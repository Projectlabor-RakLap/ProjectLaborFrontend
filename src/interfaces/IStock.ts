import { IProduct } from "./IProduct";
import { IWarehouse } from "./IWarehouse";

export interface IStock {
    id : number;
    stockInWarehouse: number;
    stockInStore: number;
    warehouseCapacity: number;
    storeCapacity: number;
    product: IProduct;
    currency: string;
    price: number;
    warehouse: IWarehouse;
}

export interface ICreateStock{
    stockInWarehouse: number;
    stockInStore: number;
    warehouseCapacity: number;
    storeCapacity: number;
    productId: number;
    currency: string;
    price: number;
    warehouseId: number;
}

export interface IUpdateStock{
    stockInWarehouse: number | null;
    stockInStore: number | null;
    warehouseCapacity: number | null;
    storeCapacity: number | null;
    productId: number | null;
    currency: string | null;
    price: number | null;
    warehouseId: number | null;
}