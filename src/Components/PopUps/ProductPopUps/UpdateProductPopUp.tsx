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
import { IProduct, IUpdateProduct } from '../../../Interfaces/IProduct';
import api from '../../../api/api'; // ✅ axios instance és endpoint wrapper

interface FormDialogProps {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  initialValues: IProduct;
  onUpdate?: (updated: IProduct) => void;
}

export default function UpdateProductDialog({
  id,
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  initialValues,
  onUpdate,
}: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [base64Image, setBase64Image] = React.useState<string | null>(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateProduct = async (id: number, updatedData: IUpdateProduct) => {
    try {
      const dataToSend = base64Image
        ? { ...updatedData, pictureBase64: base64Image }
        : updatedData;

      const response = await api.Products.updateProduct(id, dataToSend);
      const updatedProduct: IProduct = response.data;

      setAlertSeverity('success');
      setAlertMessage('Product updated successfully!');
      onUpdate?.(updatedProduct);

      return true;
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Unknown error');
      return false;
    }
  };
  
  let picture : string;
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newProduct : IUpdateProduct = {
      name: formData.get("name") as string | null,
      ean: formData.get("ean") as string | null,
      description: formData.get("description") as string | null,
      image: picture
    }

    if(newProduct.name !== undefined && newProduct.name !== null && newProduct.name.length < 1){
        newProduct.name = null;
    }
    if(newProduct.ean !== undefined && newProduct.ean !== null && newProduct.ean.length < 1){
      newProduct.ean = null;
    }
    if(newProduct.description !== undefined && newProduct.description !== null && newProduct.description.length < 1){
      newProduct.description = null;
    }
    if(newProduct.image !== undefined && newProduct.image !== null){
      newProduct.image = null;
    }

    const success = await updateProduct(id, newProduct)

    if (success) {
      handleClose();
      window.location.reload();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      setBase64Image(base64String);
      console.log('Base64 kód:', base64String.substring(0, 50) + '...');
      picture = base64String;
    };

    reader.readAsDataURL(file);
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
            {dialogContent.replace('{name}', initialValues.name)}
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
              defaultValue={initialValues.ean}
            />
            <TextField
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={initialValues.name}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={initialValues.description}
            />
            <InputFileUpload text="Upload Picture" onFileSelect={handleFileSelect} />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} className="cancelButton">
            {cancelText}
          </Button>
          <Button type="submit" form="product-form" className="acceptButton">
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
