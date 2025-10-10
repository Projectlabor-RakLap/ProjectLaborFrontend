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
import './PopUpCSS.css';
import { IWarehouse } from '../../interfaces/IWarehouse';

interface FormDialogProps<T> {
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  onUpdate?: (updated: T) => void;
}

export default function CreateWarehouseDialog<T>({
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  onUpdate,
}: FormDialogProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createWarehouse = async (updatedData: Partial<IWarehouse>) => {
  try {
    const response = await fetch(`https://localhost:7116/api/warehouse`, {
      method: "POST",
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
      } catch {}
      throw new Error(errorMessage);
    }
    if (response.status >= 200 && response.status < 300) {
      setAlertSeverity('success');
      setAlertMessage('Warehouse created successfully!');
      return true;
    }
    const updatedWarehouse: IWarehouse = await response.json();
    onUpdate?.(updatedWarehouse as any);

    setAlertSeverity('success');
    setAlertMessage('Warehouse created successfully!');

    return true;
  } catch (error: any) {
    console.error("Error creating warehouse:", error.message);
    setAlertSeverity('error');
    setAlertMessage(error.message);
    return false; 
  }
};

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const formJson = Object.fromEntries(formData.entries()) as Partial<IWarehouse>;

  const success = await createWarehouse(formJson);
  if (success) {
    window.location.reload();
  }
};

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} className="createButton">
        {text}
      </Button>

      <Dialog open={open} onClose={handleClose}>
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

          <form onSubmit={handleSubmit} id="warehouse-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue=""
            />
            <TextField
              required
              margin="dense"
              id="location"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              defaultValue=""
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} className="cancelButton">{cancelText}</Button>
          <Button type="submit" form="warehouse-form" className="createButton">{acceptText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
