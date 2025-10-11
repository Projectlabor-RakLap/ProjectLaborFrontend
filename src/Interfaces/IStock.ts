interface IStock {
    id : number;
    stockInWarehouse: number;
    stockInStore: number;
    warehouseCapacity: number;
    storeCapacity: number;
    productId: number;
    currency: string;
    price: number;
    warehouseId: number;
}

export default IStock;