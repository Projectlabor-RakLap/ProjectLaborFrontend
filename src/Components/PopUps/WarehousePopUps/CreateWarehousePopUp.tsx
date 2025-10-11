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
import { IWarehouse, ICreateWarehouse } from '../../../interfaces/IWarehouse';
import api from '../../../api/api';

interface FormDialogProps<T> {
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  onUpdate?: (updated: IWarehouse) => void;
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

  const createWarehouse = async (updatedData: ICreateWarehouse) => {
  try {
    const response = await api.Warehouses.createWarehouse(updatedData);

    if (response.status >= 200 && response.status < 300) {
      setAlertSeverity("success");
      setAlertMessage("Warehouse created successfully!");

      const createdWarehouse = response.data;
      onUpdate?.(createdWarehouse);
      return true;
    }

    throw new Error(`Unexpected status code: ${response.status}`);

  } catch (error: any) {
    console.error("Error creating warehouse:", error);

    let message = "Unknown error occurred.";

    if (error.response) {
      message = error.response.data?.message || `HTTP ${error.response.status}`;
    } else if (error.request) {
      message = "No response from server.";
    } else {
      message = error.message;
    }

    setAlertSeverity("error");
    setAlertMessage(message);
    return false;
  }
};


 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const newWarehouse: ICreateWarehouse = {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
  };

  const success = await createWarehouse(newWarehouse);

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
