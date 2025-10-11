export interface IProduct{
    id: number;
    ean: string;
    name: string;
    description: string
    image: string | null;
}

export interface ICreateProduct{
    ean: string;
    name: string;
    description: string
    image: string | null;
}

export interface IUpdateProduct{
    ean: string | null;
    name: string | null;
    description: string | null
    image: string | null;
}
