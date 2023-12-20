import React, { useEffect } from "react";
import {
    Button,
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Select,
    InputLabel,
    Container,
    CssBaseline,
    TextField,
    Grid,
    Snackbar,
    Alert,
    MenuItem,
    Autocomplete,
    Modal,
    Backdrop,
    CircularProgress,
    Badge,
    ListItemButton,
    ListItemIcon,
    Divider,

} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getUser, logout } from "../slices/authSlice";
import { addOrder, listCategories, checkOutOrders } from "../slices/inventorySlice";
import { getOrder } from "../slices/inventorySlice";
import { search } from "../slices/inventorySlice";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    showNotification,
    NotificationType,
} from "../slices/notificationSlice";
import { CreateOrder, Drug, DrugCategory } from "../types";
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    border: '2px solid #61dafb',
    boxShadow: 24,
    p: 4,
};

const Home = () => {



    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let drugs = useAppSelector((state) => state.inventory.drugs ?? []);


    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
    const categories = useAppSelector((state) => state.inventory.categories);
    const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);
    const [keyword, setKeyWord] = useState("");
    const [openDrugView, setOpenDrugView] = useState(false);
    const [row, setRow] = useState(null as Drug | null);
    const handleOpenrugView = () => setOpenDrugView(true);
    const handleCloserugView = () => setOpenDrugView(false);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [category, setCategory] = useState(null as DrugCategory | null);
    const [categoryEdit, setCategoryEdit] = useState(null as DrugCategory | null);
    const isLoading = useAppSelector((state) => state.inventory.status === "loading");
    const orders = useAppSelector((state) => state.inventory.orders);

    const handleOpenCartView = () => setOpenCartView(true);
    const [openCartView, setOpenCartView] = useState(false);
    const handleCloseCartView = () => setOpenCartView(false);
    const [state, setState] = React.useState({ left: false });

    const handleOpenrugViewEdit = () => setOpenDrugViewEdit(true);
    const handleCloseDrugViewEdit = () => setOpenDrugViewEdit(false);
    const [openDrugViewEdit, setOpenDrugViewEdit] = useState(false);

    let editableItem: Drug;

    useEffect(() => {
        if (basicUserInfo) {
            dispatch(getUser());
        }
        if (drugs) {
            dispatch(search({ name: "", categoryId: "" }));
        }
        dispatch(listCategories());
        dispatch(getOrder());

    }, [basicUserInfo]);

    const handleClickRow = (row: Drug) => {
        setRow(row as Drug);
        handleOpenrugView();

    };
    const handleClickRowEdit = (row: Drug) => {
        Object.freeze(row);
        editableItem = { ...row };;
        //setRow(row as Drug);
        handleOpenrugViewEdit();
    };
    const handleCartClick = () => {
        if (orders?.length ?? 0 > 0) {
            handleOpenCartView();
        }
    };
    const addToOrder = async (row: Drug) => {

        try {
            Object.freeze(row);

            const rowCopy = { ...row };
            rowCopy.quantityToOrder = orderQuantity;
            let createOrder: CreateOrder = {
                orderStatus: "PENDING",
                itemId: rowCopy.id,
                quantity: rowCopy.quantityToOrder
            }
            await dispatch(addOrder(createOrder)).unwrap();
            handleCloserugView();
            dispatch(getOrder());
        } catch (e) {
            console.error(e);
        }
    }
    const checkOut = async () => {

        try {
            await dispatch(checkOutOrders()).unwrap();

            handleCloseCartView();
            dispatch(getOrder());
        } catch (e) {
            console.error(e);
        }
    };
    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/login");
        } catch (e) {
            console.error(e);
        }
    };
    const handleSearch = async () => {
        dispatch(search({ name: keyword || "", categoryId: category?.id || "" }));
    };
    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, ["left"]: open });
            };

    const drawer = (text: string) => () => {

        if (text === "Home") {
            navigate("/");
        } else if (text === "Inventory") {
            navigate("/");
        }
        setState({ ...state, ["left"]: false });
    };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Home', 'Inventory'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={drawer(text)}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <HomeIcon /> : <InventoryIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />

        </Box>
    );

    const saveItem = async (editableItem: Drug) => {

        dispatch(
            showNotification({
                message: "TOD - API WORK IS READY AWAITING INTEGRATION",
                type: NotificationType.Error,
            })
        );
    }
    const handleBulkUpload = async () => {
        dispatch(
            showNotification({
                message: "TOD - API WORK IS READY AWAITING INTEGRATION",
                type: NotificationType.Error,
            })
        );
    }

    return (
        <>
            <SwipeableDrawer
                anchor="left"
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
                onOpen={toggleDrawer("left", true)}
            >
                {list("left")}
            </SwipeableDrawer>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer("left", true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            ILARA HEALTH EMR SYSTEM
                        </Typography>
                        <Typography variant="h6" paddingRight={4}>
                            {userProfileInfo?.firstName}
                        </Typography>

                        <Button color="inherit" onClick={handleLogout}>Logout
                        </Button>
                        <Badge
                            badgeContent={orders?.length}
                            color="primary"
                            onClick={handleCartClick}
                            sx={{ marginLeft: 2 }}
                        >
                            <ShoppingCartIcon color="error" />
                        </Badge>
                        {/* <IconButton sx={{ paddingLeft: 4 }}>
                            <Avatar alt="logo" src="../static/images/avatar.jpg" />
                        </IconButton> */}
                    </Toolbar>
                </AppBar>
            </Box>
            <Container maxWidth="xl">
                <CssBaseline />

                <Box sx={{ mt: 1, display: "flex", flexDirection: "row" }}>

                    <TextField
                        margin="normal"
                        required

                        id="keyword"
                        label="Keyword"
                        name="keyword"
                        autoFocus
                        value={keyword}
                        onChange={(e) => setKeyWord(e.target.value)}
                    />

                    <Autocomplete
                        disablePortal
                        id="categories"
                        options={categories || []}
                        getOptionLabel={(option) => (option ? option.name : "")}

                        sx={{ marginLeft: 1, width: 200 }}
                        onChange={(event: any, newValue: DrugCategory | null) => {
                            setCategory(newValue);
                        }}
                        renderInput={(params) => <TextField  {...params} label="Categories" margin="normal" />}
                    />


                    <Button
                        variant="contained"
                        sx={{ mt: 2, mb: 1, marginLeft: 1, paddingLeft: 2, paddingRight: 2 }}
                        onClick={handleSearch}>
                        Search
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ mt: 2, mb: 1, marginLeft: 10, paddingLeft: 2, paddingRight: 2 }}
                        onClick={handleBulkUpload}>
                        Bulk Upload
                    </Button>
                </Box>

            </Container>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Code</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drugs.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            // onClick={() =>
                            //     //handleClickRow(row)
                            // }
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.category.name}
                                </TableCell>
                                <TableCell align="right">{row.id}</TableCell>
                                <TableCell align="right" style={{ color: (row.quantityAvailable - row.quantityOnHold) <= row.minimumStockLevel ? 'red' : 'black' }}>
                                    {row.quantityAvailable - row.quantityOnHold}
                                </TableCell>
                                <TableCell align="right">{
                                    row?.tags.map(x => x.name).toString()

                                }</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained"
                                        onClick={() =>
                                            handleClickRow(row)}>
                                        ADD TO CART</Button>

                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="contained"
                                        color="error"
                                        onClick={() =>
                                            handleClickRowEdit(row)}>
                                        EDIT</Button>

                                </TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <h1>Home</h1>
        <h4>First Name: {userProfileInfo?.firstName}</h4>
        <h4>Last Name: {userProfileInfo?.lastName}</h4>
        <h4>Mobile Number: {userProfileInfo?.mobileNumber}</h4>
        <h4>Email: {userProfileInfo?.email}</h4>
        <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogout}>
          Logout
        </Button> */}
            <Modal
                open={openDrugView}
                onClose={handleCloserugView}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2">
                        Details
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Drug Name"
                            name="name"
                            autoFocus
                            value={row?.name}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="category"
                            label="Drug Category"
                            name="category"
                            autoFocus
                            value={row?.category.name}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="quantity"
                            label="Available Quantity"
                            name="quantity"
                            autoFocus
                            value={(row?.quantityAvailable ?? 0) - (row?.quantityOnHold ?? 0)}
                            InputProps={{ readOnly: true }}
                        />

                    </Box>
                    <Typography id="description" sx={{ mt: 2 }}>
                        {

                            row?.tags.map(x => x.name).toString()
                            //row?.tags.toString()

                        }
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="sold"
                        label="Quantity"
                        name="sold"
                        autoFocus
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: (row?.quantityAvailable ?? 0) - (row?.quantityOnHold ?? 0) } }}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                    />
                    <Button variant="contained"
                        onClick={() =>
                            addToOrder(row ? row : {} as Drug)}>
                        Add to Cart</Button>

                </Box>
            </Modal>


            <Modal
                open={openCartView}
                onClose={handleCloseCartView}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <React.Fragment>
                        <Typography variant="h4" gutterBottom>
                            Order summary
                        </Typography>
                        <List disablePadding>
                            {orders?.map((order) => (
                                <ListItem key={order.item.name} sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary={order.item.name} secondary={order.item.category.name} />
                                    <Typography variant="body1">{order.item.costPrice}</Typography>
                                </ListItem>

                            ))}
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="Total" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {orders?.reduce((acc, curr) => acc + curr.item.costPrice, 0)}
                                </Typography>
                            </ListItem>
                        </List>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Officer
                                </Typography>
                                <Typography gutterBottom>{userProfileInfo?.firstName + " " + userProfileInfo?.lastName}</Typography>
                                <Typography gutterBottom>{userProfileInfo?.email}</Typography>
                                <Typography gutterBottom>{userProfileInfo?.mobileNumber}</Typography>
                            </Grid>
                            <Grid item container direction="column" xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Payment details
                                </Typography>
                                <Grid container>

                                    <React.Fragment key="payment">
                                        <Grid item xs={6}>
                                            <Typography gutterBottom>Cash</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography gutterBottom>"PAID"</Typography>
                                        </Grid>
                                    </React.Fragment>

                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                    <Button variant="contained"
                        onClick={() =>
                            checkOut()}>
                        Check Out</Button>
                </Box>
            </Modal>


            <Modal
                open={openDrugViewEdit}
                onClose={handleCloseDrugViewEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2">
                        Item
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Drug Name"
                            name="name"
                            autoFocus
                            value={row?.name}
                        />
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="category"
                            label="Drug Category"
                            name="category"
                            autoFocus
                            value={row?.category.name}
                            InputProps={{ readOnly: false }}
                        /> */}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="quantity"
                            label="Available Quantity"
                            name="quantity"
                            autoFocus
                            value={(row?.quantityAvailable ?? 0) - (row?.quantityOnHold ?? 0)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="minimumStockLevel"
                            label="Minimum Quantity Level"
                            name="minimumStockLevel"
                            autoFocus
                            value={row?.minimumStockLevel}
                        />

                        <Autocomplete
                            disablePortal
                            id="categories1"
                            options={categories || []}
                            getOptionLabel={(option) => (option ? option.name : "")}

                            sx={{ marginLeft: 1, width: 200 }}
                            onChange={(event: any, newValue: DrugCategory | null) => {
                                if (newValue !== null) {
                                    // editableItem.category = newValue;
                                }
                                setCategoryEdit(newValue);
                            }}
                            renderInput={(params) => <TextField  {...params} label="Categories" margin="normal" />}
                        />

                    </Box>


                    <Button variant="contained"
                        onClick={() =>
                            saveItem(editableItem)}>
                        Save</Button>

                </Box>
            </Modal>
        </>

    );


};

export default Home;
