import { IProduct } from "../Components/PopUps/ProductPopUps/CreateProductPopUp";

export interface IStockChange{
    id:number;
    quantity:number;
    changeDate: Date;
    prduct: IProduct
}