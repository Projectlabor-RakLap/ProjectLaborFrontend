import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './../PopUpCSS.css';
import { IWarehouse } from '../../../Interfaces/IWarehouse';

interface FormDialogProps<T> {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  initialValues: T;
  onUpdate?: (updated: T) => void;
}

export default function UpdateWarehouseDialog<T>({
  id,
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  initialValues,
  onUpdate
}: FormDialogProps<T>) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateWarehouse = async (id: number, updatedData: Partial<IWarehouse>) => {
    try {
      const response = await fetch(`https://localhost:7116/api/warehouse/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedWarehouse: IWarehouse = await response.json();

      // Frissítés a callbackkel
      onUpdate?.(updatedWarehouse as any);
      console.log("Warehouse updated:", updatedWarehouse);
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    updateWarehouse(id, formJson);
    handleClose();
    window.location.reload();
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
          <form onSubmit={handleSubmit} id="warehouse-form">
            <TextField
              autoFocus
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
              id="location"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={(initialValues as any).location}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancelButton">{cancelText}</Button>
          <Button type="submit" form="warehouse-form" className="acceptButton">{acceptText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
