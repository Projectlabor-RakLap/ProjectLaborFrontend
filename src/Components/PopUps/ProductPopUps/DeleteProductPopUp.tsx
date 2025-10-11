import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import BlockIcon from '@mui/icons-material/Block';
import '../PopUpCSS.css';
import  api  from '../../../api/api';

interface FormDialogProps<T> {
  id: number;
  text: string;
  dialogTitle: string;
  dialogContent: string;
  acceptText: string;
  cancelText: string;
  onUpdate?: (updated: T) => void;
}

export default function DeleteProductDialog<T>({
  id,
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

  const handleDelete = async () => {
    try {
      await api.Products.deleteProduct(id);

      setAlertSeverity('success');
      setAlertMessage('Product deleted successfully!');
      onUpdate?.(null as any);

      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setAlertSeverity('error');
      setAlertMessage(
        error.response?.data?.message || error.message || 'An unknown error occurred while deleting product.'
      );
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} className="deleteButton">
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
              style={{ marginTop: '1rem' }}
            >
              {alertMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancelDeleteButton">
            {cancelText}
          </Button>
          <Button onClick={handleDelete} className="deleteButton">
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
