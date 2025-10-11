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
import InputFileUpload from '../../Inputs/FileInput';
import '../PopUpCSS.css';
import { IProduct } from '../../../Interfaces/IProduct';

interface FormDialogProps<T> {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  initialValues: T;
  apiUrl:string;
  onUpdate?: (updated: T) => void;
}

export default function UpdateProductDialog<T>({
  id,
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  initialValues,
  apiUrl,
  onUpdate,
}: FormDialogProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateProduct = async (id: number, updatedData: Partial<IProduct>) => {
    try {
      const response = await fetch(`${apiUrl}/api/product/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const text = await response.text();
          if (text) {
            const data = JSON.parse(text);
            if (data?.message) errorMessage = data.message;
            else errorMessage = text;
          }
        } catch { }
        throw new Error(errorMessage);
      }

      const updatedProduct: IProduct = await response.json();
      onUpdate?.(updatedProduct as any);

      setAlertSeverity('success');
      setAlertMessage('Product updated successfully!');
      return true;

    } catch (error: any) {
      console.error("Error updating product:", error.message);
      setAlertSeverity('error');
      setAlertMessage(error.message);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const success = await updateProduct(id, formJson);
    if (success) {
      window.location.reload();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
  if (!files || files.length === 0) return;

  const file = files[0];
  const reader = new FileReader();

  reader.onload = () => {
    // reader.result egy data URL, pl. "data:image/png;base64,iVBORw0K..."
    const base64String = (reader.result as string).split(',')[1]; // csak a Base64 rész
    console.log("Base64 kód:", base64String);
  };

  reader.readAsDataURL(file); // konvertálás DataURL formátumba
};
  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} className="updateButton">
        {text}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent.replace('{name}', (initialValues as any).name)}
          </DialogContentText>

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
              margin="dense"
              id="ean"
              name="ean"
              label="EAN"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={(initialValues as any).ean}
            />
            <TextField
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={(initialValues as any).name}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={(initialValues as any).description}
            />
            <InputFileUpload text="Upload Picture" onFileSelect={handleFileSelect} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancelButton">{cancelText}</Button>
          <Button type="submit" form="product-form" className="acceptButton">{acceptText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
