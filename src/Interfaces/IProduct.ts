interface IProduct{
    id: number;
    EAN: string;
    name: string;
    Description: string
    ImageBase64: string | null;
}

export default IProduct;