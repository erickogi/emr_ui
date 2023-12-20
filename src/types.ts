interface Drug  {
    id: number,
    name: string,
    category: DrugCategory,
    quantityAvailable: number,
    quantityOnHold: number,
    reorderPoint: number,
    metadata: string,
    quantityToOrder: number,
    minimumStockLevel: number,
    tags: DrugTag[],
    costPrice: number,
}
interface DrugCategory {
    id: string,
    name: string,
}
interface DrugTag {
    id: string,
    name: string,
}
interface CreateOrder {
    quantity: number,
    itemId: number,
    orderStatus: string,
}

type Order = {
    id: number,
    quantity: number,
    orderStatus: string,
    item: Drug,
}

export { type Drug, type DrugCategory,type DrugTag,type CreateOrder,type Order };