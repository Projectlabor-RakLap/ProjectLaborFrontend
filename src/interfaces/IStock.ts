import { IWarehouse } from "./IWarehouse";
import { IProduct } from "./IProduct";

export interface IStock{
    id: number;
    stockInWarehouse: number;
    stockInStore: number;
    wareHouseCapacity: number;
    storeCapacity: number;
    price: number;
    transportCost: number;
    storageCost: number;
    currency: string;
    product: IProduct;
    warehouse: IWarehouse;
}

export interface ICreateStock{
    stockInWarehouse: number;
    stockInStore: number;
    wareHouseCapacity: number;
    storeCapacity: number;
    price: number;
    transportCost: number;
    storageCost: number;
    currency: string;
    productId: number;
    warehouseId: number;
}

export interface IUpdateStock{
    stockInWarehouse: number | null;
    stockInStore: number | null;
    wareHouseCapacity: number | null;
    storeCapacity: number | null;
    price: number | null;
    transportCost: number | null;
    storageCost: number | null;
    currency: string | null;
    productId: number | null;
    warehouseId: number | null;
}