import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import BlockIcon from '@mui/icons-material/Block';
import '../PopUpCSS.css';
import  api  from '../../../api/api';
import { ICreateProduct } from '../../../Interfaces/IProduct';

interface FormDialogProps<T> {
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  defaultEAN?: string;
  open?: boolean;
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
  onClose,
  onUpdate,
}: FormDialogProps<T>) {
  const [base64Image, setBase64Image] = React.useState<string>('');
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setBase64Image(reader.result as string);
    reader.readAsDataURL(file);
  };

  const createProduct = async (newProduct: ICreateProduct) => {
    try {
      const response = await api.Products.createProduct(newProduct);
      const createdProduct = response.data;

      setAlertSeverity('success');
      setAlertMessage('Product created successfully!');
      onUpdate?.(createdProduct as any);

      console.log('Product created:', createdProduct);
      return true;
    } catch (error: any) {
      console.error('Error creating product:', error);
      setAlertSeverity('error');
      setAlertMessage(
        error.response?.data?.message || error.message || 'An unknown error occurred while creating the product.'
      );
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const newProduct : ICreateProduct = {
          name: formData.get("name") as string,
          ean: formData.get("ean") as string,
          description: formData.get("description") as string,
          image: base64Image
        }
    const success = await createProduct(newProduct);
    if (success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>

        {alertMessage && (
          <Alert
            icon={<BlockIcon fontSize="inherit" />}
            severity={alertSeverity}
            onClose={() => setAlertMessage(null)}
            style={{ marginBottom: '1rem' }}
          >
            {alertMessage}
          </Alert>
        )}

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
