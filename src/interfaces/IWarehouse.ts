export interface IWarehouse{
    id: number;
    name: string;
    location: string;
}

export interface ICreateWarehouse{
    name: string;
    location: string;
}

export interface IUpdateWarehouse{
    name: string | null;
    location: string | null;
} 