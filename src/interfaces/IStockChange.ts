import { IProduct } from "./IProduct";
import { IWarehouse } from "./IWarehouse";

export interface IStockChange{
    id: number;
    quantity: number;
    changeDate: Date;
    product: IProduct;
    warehouse: IWarehouse;
}

export interface ICreateStockChange{
    quantity: number;
    changeDate: Date;
    productId: number;
    warehouseId: number;
}

export interface IUpdateStockChange{
    quantity: number | null;
    changeDate: Date | null;
    productId: number | null;
    warehouseId: number | null;
}
