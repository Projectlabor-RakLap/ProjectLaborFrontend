import { IProduct } from "../interfaces/IProduct";
import { ICreateProduct } from "../interfaces/ICreateProduct";
import { IWarehouse } from "../interfaces/IWarehouse";
import { ICreateWarehouse } from "../interfaces/ICreateWarehouse";
import { ICreateStock, IUpdateStock } from "../interfaces/IUpsertStock";
import { IStock } from "../interfaces/IStock";
import axiosInstance from "./axois.config";

const Products = {
    getProducts: () => axiosInstance.get<IProduct[]>(`/api/product`),
    getProduct: (id: number) => axiosInstance.get<IProduct>(`/api/product/${id}`),
    deleteProduct: (id: number) => axiosInstance.delete<void>(`/api/product/${id}`),
    createProduct: (param: ICreateProduct) => axiosInstance.post<IProduct>(`/api/product`, param),
    updateProduct: (id: number, param2 :
        {
            ean: string | null;
            name: string | null;
            description: string | null;
            image: string | null;
        }) => axiosInstance.patch<IProduct>(`/api/prduct/${id}`, param2)
}

const Warehouses = {
    getWarehouses: () => axiosInstance.get<IWarehouse[]>(`api/warehouse`),
    getWarehouse: (id: number) => axiosInstance.get<IWarehouse>(`api/warehouse/${id}`),
    deleteWarehouse: (id: number) => axiosInstance.delete<IWarehouse>(`api/warehouse/${id}`),
    createWarehouse: (param: ICreateWarehouse) => axiosInstance.post<IWarehouse>(`/api/warehouse`,param),
    updateWarehouse: (id: number, param2:{
        name: string | null;
        location: string |null;
    }) => axiosInstance.patch<IWarehouse>(`/api/warehouse/${id}`, param2)
} 

const Stocks = {
    getStocks: () => axiosInstance.get<IStock[]>(`api/stock`),
    getStock: (id: number) => axiosInstance.get<IStock>(`api/stock/${id}`),
    getStockByWarehouse: (id: number) => axiosInstance.get<IStock>(`api/stock/get-stock-by-warehouse/${id}`),
    createStock: (param: ICreateStock) => axiosInstance.post<ICreateStock>(`/api/stock`, param),
    updateStock:  (id: number, param2: {
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
    }) => axiosInstance.patch<IUpdateStock>(`/api/stock/${id}`,param2)
}

const StockChanges = {
    
}
const api = {Products, Warehouses, Stocks}

export default {api}