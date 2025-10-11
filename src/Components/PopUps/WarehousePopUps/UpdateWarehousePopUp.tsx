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
import { IWarehouse, IUpdateWarehouse } from '../../../interfaces/IWarehouse';
import api from '../../../api/api';

interface FormDialogProps {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  initialValues: IWarehouse;
  onUpdate?: (updated: IWarehouse) => void;
}

export default function UpdateWarehouseDialog({
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateWarehouse = async (id: number, updatedData: IUpdateWarehouse) => {
    try {
      const response = await api.Warehouses.updateWarehouse(id, updatedData);

      const updatedWarehouse: IWarehouse = response.data;

      setAlertSeverity('success');
      setAlertMessage('Warehouse updated successfully!');
      onUpdate?.(updatedWarehouse);

      return true;
    } catch (error: any) {
      console.error('Error updating warehouse:', error.message || error);
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Unknown error');
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
      const newWarehouse: IUpdateWarehouse = {
        name: formData.get("name") as string | null,
        location: formData.get("location") as string | null,
      };
      if(newWarehouse.name !== undefined && newWarehouse.name !== null && newWarehouse.name.length === 0){
        newWarehouse.name = null;
      }
      if(newWarehouse.location !== undefined && newWarehouse.location !== null && newWarehouse.location.length === 0){
        newWarehouse.location = null;
      }
      const success = await updateWarehouse(id,newWarehouse);
    if (success) {
      handleClose();
      window.location.reload();
    }
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
              defaultValue={initialValues.name}
            />
            <TextField
              margin="dense"
              id="location"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={initialValues.location}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} className="cancelButton">
            {cancelText}
          </Button>
          <Button type="submit" form="warehouse-form" className="acceptButton">
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
