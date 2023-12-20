import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { CreateOrder, Drug, DrugCategory, Order } from "../types"; // Import the 'Drug' type from the appropriate module

type Search = {
    name: string,
    categoryId: string

}


type InventoryApiState = {
    categories: DrugCategory[] | null;
    orders?: Order[] | null;
    drugs?: Drug[] | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
};

const initialState: InventoryApiState = {
    categories: localStorage.getItem("categories")
        ? JSON.parse(localStorage.getItem("categories") as string)
        : null,
    //drugs: localdrugs,
    orders: localStorage.getItem("orders")
        ? JSON.parse(localStorage.getItem("orders") as string)
        : null,

    drugs: localStorage.getItem("drugs")
        ? JSON.parse(localStorage.getItem("drugs") as string)
        : null,

    status: "idle",
    error: null,
};
export const addOrder = createAsyncThunk("addOrder", async (data: CreateOrder) => {
    const userData = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null;
    const response = await axiosInstance.post("/api/orders/create",
        data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData.accessToken
        }
    });
    const resData = response.data;
    //localStorage.setItem("orders", JSON.stringify(resData));
    getOrder();
    return resData;
});
export const getOrder = createAsyncThunk("getOrder", async () => {
    localStorage.removeItem("orders");
    const userData = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null;
    const response = await axiosInstance.get("/api/orders/list",
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData.accessToken
            }
        });
    const resData = response.data;
    localStorage.setItem("orders", JSON.stringify(resData));
    return resData;
});

export const search = createAsyncThunk("search", async (search: Search) => {
    localStorage.removeItem("drugs");
    const userData = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null;

    let urlEnd = ""
    if (search.name != "" && search.categoryId != "") {
        urlEnd = "&category=" + search.categoryId + "&name=" + search.name + "";
    } else if (search.name != "") {
        urlEnd = "&name=" + search.name + "";
    } else if (search.categoryId != "") {
        urlEnd = "&category=" + search.categoryId + "";
    }
    const response = await axiosInstance.get(
        `/api/items/search?page=0&size=1000&sort=name,asc` + urlEnd,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData.accessToken
            }
        });
    const resData = response.data.content;
    localStorage.setItem("drugs", JSON.stringify(resData));
    return resData;
});

export const listCategories = createAsyncThunk("categories", async () => {
    localStorage.removeItem("categories");
    const userData = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null;


    const response = await axiosInstance.get(
        `/api/categories/list`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData.accessToken
            }
        });
    const resData = response.data;
    localStorage.setItem("categories", JSON.stringify(resData));
    return resData;
});
export const checkOutOrders = createAsyncThunk("checkOut", async () => {
    const userData = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null;
    const response = await axiosInstance.get("/api/orders/checkout",
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData.accessToken
            }
        });
    const resData = response.data;
    getOrder();
    //localStorage.setItem("orders", JSON.stringify(resData));
    return resData;
});


const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addOrder.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                addOrder.fulfilled,
                (state, action: PayloadAction<[Order]>) => {
                    state.status = "idle";
                   // state.orders = action.payload;
                }
            )
            .addCase(addOrder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Create order failed";
            })

            .addCase(getOrder.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                getOrder.fulfilled,
                (state, action: PayloadAction<[Order]>) => {
                    state.status = "idle";
                    state.orders = action.payload;
                }
            )
            .addCase(getOrder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get Order Failed";
            })

            .addCase(search.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                search.fulfilled,
                (state, action: PayloadAction<Drug[]>) => {
                    state.status = "idle";
                    state.drugs = action.payload;
                }
            )
            .addCase(search.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get Drugs Failed";
            })

            .addCase(listCategories.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                listCategories.fulfilled,
                (state, action: PayloadAction<DrugCategory[]>) => {
                    state.status = "idle";
                    state.categories = action.payload;
                }
            )
            .addCase(listCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get Categories Failed";
            })

            .addCase(checkOutOrders.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                checkOutOrders.fulfilled,
                (state, action: PayloadAction<Order[]>) => {
                    state.status = "idle";
                    //state.categories = action.payload;
                }
            )
            .addCase(checkOutOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get Categories Failed";
            })
    },
});

export default inventorySlice.reducer;