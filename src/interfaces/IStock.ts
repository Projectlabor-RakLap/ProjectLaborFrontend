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