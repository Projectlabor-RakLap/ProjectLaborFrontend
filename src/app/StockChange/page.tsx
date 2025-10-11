import React, { useState } from 'react';
import logo from '../../logo.svg';
import '../../App.css';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import { Button } from '@mui/material';
import CreateProductDialog from '../../Components/PopUps/ProductPopUp/CreateProductPopUp';
import CreateStockChangeDialog from '../../Components/PopUps/StockChangePopUp/CreateStockChangePopUp';
import ScannerDialog from '../../Components/Scanner/Scanner';
import { IProduct } from '../../Interfaces/IProduct';
import { waitFor } from '@testing-library/dom';

function StockChange() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [productDialogOpenManually, setProductDialogOpenManually] = useState(false);
  const [stockDialogOpenManually, setStockDialogOpenManually] = useState(false);
  const [scannedEAN, setScannedEAN] = useState<string>("");
  const [foundProduct, setFoundProduct] = useState<string | null>(null);

  const handleScan = async (ean: string) => {
    console.log("Scanned EAN:", ean);
    setScannedEAN(ean);
    setScannerOpen(false);

    try {
      const response = await fetch(`https://localhost:7116/api/product/ean/${ean}`);
      if (response.ok) {
        const product: IProduct = await response.json();
        console.log("Found product:", product);
        setFoundProduct(product.name);
        setStockDialogOpen(true);
      } else if (response.status === 404) {
        console.log("Product not found, opening CreateProductDialog");
        setFoundProduct(null);
        setProductDialogOpen(true);
      } else {
        console.error("Unexpected error:", response.status);
      }
    } catch (err) {
      console.error("Error checking product:", err);
    }
  };

  const handleProductCreated = async (newProduct: IProduct) => {
    setProductDialogOpen(false);
    setFoundProduct(newProduct.name);
    setStockDialogOpen(true);
};

  const handleCreateProductManually = () => {
    setScannedEAN("");
    setFoundProduct(null);
    setProductDialogOpenManually(true);
  };

  const handleCreateStockChangeManually = () => {
    setScannedEAN("");
    setFoundProduct(null);
    setStockDialogOpenManually(true);
  };

  const handleStockChangeCreated = () => {
    setFoundProduct(null);
    setStockDialogOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <PillNavFull />
        <h1>Stock Change</h1>

        <div style={{ marginBottom: "16px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setScannerOpen(true)}
          >
            Open Scanner
          </Button>
        </div>

        <div style={{ marginBottom: "16px", display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCreateProductManually}
          >
            Create Product Manually
          </Button>
          </div>
          <div style={{ marginBottom: "16px", display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCreateStockChangeManually}
          >
            Create Stock Change Manually
          </Button>
        </div>

        <ScannerDialog
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScan={handleScan}
        />

        <div style={{ marginBottom: "16px" }}>
          <CreateProductDialog
            open={productDialogOpenManually}
            onClose={() => setProductDialogOpenManually(false)}
            text="Create Product"
            dialogTitle="Create a New Product"
            dialogContent="Please fill in the details for the new product."
            acceptText="Create"
            cancelText="Cancel"
            onUpdate={handleCreateProductManually}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <CreateStockChangeDialog
            open={stockDialogOpenManually}
            onClose={() => setStockDialogOpenManually(false)}
            text="Add Stock Change"
            dialogTitle="Record Stock Change"
            dialogContent="Select a product and specify the quantity change."
            acceptText="Save"
            cancelText="Cancel"
            preselectedProduct={undefined}
            onUpdate={handleCreateStockChangeManually}
          />
        </div>

        {productDialogOpen && (
          <CreateProductDialog
            open={productDialogOpen}
            onClose={() => setProductDialogOpen(false)}
            text=""
            dialogTitle="Create Product"
            dialogContent="The scanned product was not found. Please create it."
            acceptText="Create"
            cancelText="Cancel"
            defaultEAN={scannedEAN}
            onUpdate={handleProductCreated}
          />
        )}

        {stockDialogOpen && foundProduct && (
          <CreateStockChangeDialog
            open={stockDialogOpen}
            onClose={() => setStockDialogOpen(false)}
            text=""
            dialogTitle="Add Stock Change"
            dialogContent={`Recording stock change for ${foundProduct}`}
            acceptText="Save"
            cancelText="Cancel"
            preselectedProduct={foundProduct || undefined}
            onUpdate={handleStockChangeCreated}
          />
        )}
      </header>
    </div>
  );
}

export default StockChange;
