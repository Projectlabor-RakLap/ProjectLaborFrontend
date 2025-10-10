import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import './PopUpCSS.css';

interface IProduct {
  id: number;
  name: string;
}

interface IStockChange {
  quantity: number;
  changeDate: string;
  productId: number;
}

interface FormDialogProps<T> {
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  onUpdate?: (updated: T) => void;
}

interface CreateStockChangeDialogProps<T> extends FormDialogProps<T> {
  open?: boolean;
  onClose?: () => void;
  preselectedProduct?: string;
  productsList?: IProduct[];
}

export default function CreateStockChangeDialog<T>({
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  open = false,
  onClose,
  onUpdate,
  preselectedProduct,
  productsList,
}: CreateStockChangeDialogProps<T>) {
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [selectedProductName, setSelectedProductName] = React.useState<string | ''>(
    preselectedProduct || ''
  );
  const [selectedProductId, setSelectedProductId] = React.useState<number>();
  const [quantity, setQuantity] = React.useState<number>(0);

  React.useEffect(() => {
    if (preselectedProduct) {
      setSelectedProductName(preselectedProduct);
    }
  }, [preselectedProduct]);

  React.useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const productId = Number(event.target.value);
    setSelectedProductId(productId);
  };

  const fetchProducts = async () => {
  try {
    const response = await fetch('https://localhost:7116/api/product');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data: IProduct[] = await response.json();
    setProducts(data);
    console.log('Fetched products:', data);
    if (preselectedProduct) {
        const matched = data.find((p) => p.name === preselectedProduct);
        if (matched) {
          setSelectedProductId(matched.id);
        }
      }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

  const createStockChange = async (newStockChange: Partial<IStockChange>) => {
    try {
      const response = await fetch('https://localhost:7116/api/stockchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(newStockChange),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const created: IStockChange = await response.json();
      onUpdate?.(created as any);
      console.log('Stock change created:', created);
      onClose?.();
    } catch (error) {
      console.error('Error creating stock change:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProductId || selectedProductId === 0) {
      alert('Please select a product.');
      return;
    }

    const stockChangeData: Partial<IStockChange> = {
      quantity,
      productId: selectedProductId,
      changeDate: new Date().toISOString(),
    };

    await createStockChange(stockChangeData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>

        <form onSubmit={handleSubmit} id="stockchange-form">
          <TextField
            select
            required
            fullWidth
            margin="dense"
            label="Product"
            name="productId"
            value={selectedProductId || ''}
            onChange={handleProductChange}
            disabled={!!preselectedProduct}
            variant="standard"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="cancelButton">
          {cancelText}
        </Button>
        <Button type="submit" form="stockchange-form" className="acceptButton">
          {acceptText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}