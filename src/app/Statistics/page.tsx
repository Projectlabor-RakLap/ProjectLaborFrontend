import React, { useEffect } from 'react';
import '../../App.css';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import Select from '@mui/material/Select';
import IWarehouse from '../../Interfaces/IWarehouse';
import IProduct from '../../Interfaces/IProduct';
import IStockChange from '../../Interfaces/IStockChange';
import IStock from '../../Interfaces/IStock';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart } from '@mui/x-charts';

function Statistics() {
  const [warehouses, setWarehouses] = React.useState<IWarehouse[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [stockChanges, setStockChanges] = React.useState<IStockChange[]>([]);
  const [stock, setStock] = React.useState<IStock>();
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<string | ''>('');
  const [selectedProduct, setSelectedProduct] = React.useState<string | ''>('');
  const [loadingWarehouses, setLoadingWarehouses] = React.useState(true);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingStockChanges, setLoadingStockChanges] = React.useState(false);
  const [loadingStock, setLoadingStock] = React.useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const response = await fetch('https://localhost:7116/api/warehouse');
        const data = await response.json();
        setWarehouses(data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleChangeWarehouse = (event: any) => {
    setSelectedWarehouse(event.target.value);
    setSelectedProduct('');
    setProducts([]);
    setStockChanges([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedWarehouse) return;
      setLoadingProducts(true);
      try {
        const response = await fetch(
          `https://localhost:7116/api/product/warehouse/${selectedWarehouse}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedWarehouse]);

  const handleChangeProduct = (event: any) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    const fetchStockChanges = async () => {
      if (!selectedWarehouse || !selectedProduct) return;
      setLoadingStockChanges(true);

      try {
        const response = await fetch(
          `https://localhost:7116/api/stockchange/warehouse-product/${selectedProduct}-${selectedWarehouse}`
        );
        const data = await response.json();
        setStockChanges(data);
      } catch (error) {
        console.error('Error fetching stock changes:', error);
      }finally {
        setLoadingStockChanges(false);
      }
    };

    fetchStockChanges();
  }, [selectedWarehouse, selectedProduct]);

  useEffect(() => {
    const fetchStock = async () => {
      if (!selectedWarehouse || !selectedProduct) return;
      setLoadingStock(true);
      try {
        const response = await fetch(
          `https://localhost:7116/api/stock/product/${selectedProduct}`
        );
        const data = await response.json();
        setStock(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      } finally {
        setLoadingStock(false);
      }
    };
    fetchStock();
  }, [selectedWarehouse, selectedProduct]);

  const chartData = stockChanges
    .sort(
      (a, b) => new Date(a.changeDate).getTime() - new Date(b.changeDate).getTime()
    )
    .map((item) => ({
      date: new Date(item.changeDate),
      quantity: item.quantity,
    }));

  return (
    <div className="App">
      <header className="App-header">
        <PillNavFull />

        <InputLabel
          variant="standard"
          htmlFor="warehouse-select"
          sx={{ color: 'white', mb: 1 }}
        >
          Warehouse
        </InputLabel>

        {loadingWarehouses ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : (
          <Select
            value={selectedWarehouse}
            onChange={handleChangeWarehouse}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: '#888' }}>Select a warehouse</span>;
              }
              return selected;
            }}
            sx={{
              width: 300,
              bgcolor: 'white',
              color: 'black',
              borderRadius: 1,
              marginBottom: '20px',
            }}
            inputProps={{ id: 'warehouse-select' }}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.name} value={warehouse.name}>
                {warehouse.name}
              </MenuItem>
            ))}
          </Select>
        )}

        <br />

        {selectedWarehouse && (
          <>
            <InputLabel
              variant="standard"
              htmlFor="product-select"
              sx={{ color: 'white', mb: 1 }}
            >
              Product
            </InputLabel>

            {loadingProducts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            ) : (
              <Select
                value={selectedProduct}
                onChange={handleChangeProduct}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>Select a product</span>;
                  }
                  return selected;
                }}
                sx={{
                  width: 300,
                  bgcolor: 'white',
                  color: 'black',
                  borderRadius: 1,
                  marginBottom: '20px',
                }}
                inputProps={{ id: 'product-select' }}
              >
                {products.map((product) => (
                  <MenuItem key={product.name} value={product.name}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </>
        )}

        {selectedProduct && (
          <>
            {loadingStockChanges || loadingStock ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            ) : chartData.length > 0 ? (
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="flex-start"
                sx={{ mt: 3 }}
              >
                <Grid>
                  <div
                    style={{
                      width: '600px',
                      height: '400px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '10px',
                    }}
                  >
                    <LineChart
                      xAxis={[
                        {
                          data: chartData.map((d) => d.date),
                          scaleType: 'time',
                          label: 'Date',
                          valueFormatter: (value) =>
                            new Date(value).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                            }),
                        },
                      ]}
                      series={[
                        {
                          data: chartData.map((d) => d.quantity),
                          label: 'Stock Change',
                          showMark: true,
                          color: '#1976d2',
                        },
                      ]}
                      yAxis={[{ label: 'Quantity Change' }]}
                      grid={{ vertical: true, horizontal: true }}
                    />
                  </div>
                </Grid>
                {stock && (
                  <>
                    <Grid>
                      <PieChart
                        colors={['green', 'blue']}
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: stock.stockInWarehouse,
                                label: 'In Warehouse',
                              },
                              {
                                id: 1,
                                value:
                                  stock.warehouseCapacity - stock.stockInWarehouse,
                                label: 'Free Space',
                              },
                            ],
                          },
                        ]}
                        
                        width={250}
                        height={250}
                      />
                      <p style={{ color: 'white' }}>Warehouse Capacity</p>
                    </Grid>

                    <Grid>
                      <PieChart
                        colors={['green', 'blue']}
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: stock.stockInStore,
                                label: 'In Store',
                              },
                              {
                                id: 1,
                                value: stock.storeCapacity - stock.stockInStore,
                                label: 'Free Space',
                              },
                            ],
                          },
                        ]}
                        width={250}
                        height={250}
                      />
                      <p style={{ color: 'white' }}>Store Capacity</p>
                    </Grid>
                  </>
                )}
              </Grid>
            ) : (
              <p>No stock changes available.</p>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default Statistics;
