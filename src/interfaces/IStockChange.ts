import { IProduct } from "./IProduct";
import { IWarehouse } from "./IWarehouse";

export interface IStockChange{
    id:number;
    quantity:number;
    changeDate: Date;
    prduct: IProduct;
    warehouse: IWarehouse;
}

export interface ICreateStockChange{
    quantity:number;
    changeDate: Date;
    prduct: IProduct;
    warehouse: IWarehouse;
}

export interface IUpdateStockChange{
    quantity:number | null;
    changeDate: Date | null;
    prduct: IProduct | null;
    warehouse: IWarehouse | null;
}