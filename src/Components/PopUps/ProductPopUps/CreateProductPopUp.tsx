import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../PopUpCSS.css';

export interface IProduct {
  ean: string;
  name: string;
  description: string;
  image: string;
}

interface FormDialogProps<T> {
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  defaultEAN?: string;
  open?: boolean;
  apiUrl:string;
  onClose?: () => void;
  onUpdate?: (updated: T) => void;
}

export default function CreateProductDialog<T>({
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  defaultEAN,
  open = false,
  apiUrl,
  onClose,
  onUpdate,
}: FormDialogProps<T>) {
  const [base64Image, setBase64Image] = React.useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setBase64Image(reader.result as string);
    reader.readAsDataURL(file);
  };

  const createProduct = async (newProduct: Partial<IProduct>) => {
    try {
        const response = await fetch(`${apiUrl}/api/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let createdProduct: IProduct | null = null;
        try {
        createdProduct = await response.json();
        } catch {
        console.warn('No product returned from POST; fetching by EAN...');
        }

        if (!createdProduct && newProduct.ean) {
        const fetchResponse = await fetch(`${apiUrl}/api/product/ean/${newProduct.ean}`);
        if (fetchResponse.ok) {
            createdProduct = await fetchResponse.json();
        }
        }

        if (createdProduct) {
        onUpdate?.(createdProduct as any);
        console.log('Product created:', createdProduct);
        } else {
        console.warn('Could not retrieve created product details.');
        }
    } catch (error) {
        console.error('Error creating product:', error);
    }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const productData = { ...formJson, image: base64Image };
    await createProduct(productData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>

        <form onSubmit={handleSubmit} id="product-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="ean"
            name="ean"
            label="EAN"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={defaultEAN || ''}
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            minRows={2}
            variant="standard"
          />

          <div className="upload-section" style={{ marginTop: '20px' }}>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span" className="uploadButton">
                Upload Image
              </Button>
            </label>
            {base64Image && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img
                  src={base64Image}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="cancelButton">
          {cancelText}
        </Button>
        <Button type="submit" form="product-form" className="acceptButton">
          {acceptText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
