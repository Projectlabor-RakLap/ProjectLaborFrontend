import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../PopUpCSS.css';
import { IWarehouse } from '../../../interfaces/IWarehouse';

interface FormDialogProps<T> {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  apiUrl:string;
  onUpdate?: (updated: T) => void;
}

export default function DeleteProductDialog<T>({
  id,
  text,
  dialogTitle,
  dialogContent,
  acceptText,
  cancelText,
  apiUrl,
  onUpdate
}: FormDialogProps<T>) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteWarehouse = async (id:number) => {
    try {
      const response = await fetch(`${apiUrl}/api/warehouse/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const deletedWarehouse: IWarehouse = await response.json();

      onUpdate?.(deletedWarehouse as any);
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  const handleDelete = () => {
    deleteWarehouse(id);
    handleClose();
    window.location.reload();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} className="deleteButton">
        {text}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancelDeleteButton">{cancelText}</Button>
          <Button onClick={handleDelete} type="submit" form="warehouse-form" className="deleteButton">{acceptText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
