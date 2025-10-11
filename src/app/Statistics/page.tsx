import React, { useEffect } from 'react';
import '../../App.css';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import Select from '@mui/material/Select';
import { IWarehouse } from '../../Interfaces/IWarehouse';
import {IProduct} from '../../Interfaces/IProduct';
import {IStockChange} from '../../Interfaces/IStockChange';
import { IStock } from '../../Interfaces/IStock';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, SparkLineChart } from '@mui/x-charts';
import { Card, CardContent, Typography } from '@mui/material';

function Statistics() {
  const [warehouses, setWarehouses] = React.useState<IWarehouse[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [stockChanges, setStockChanges] = React.useState<IStockChange[]>([]);
  const [weeklyData, setWeeklyData] = React.useState<IStockChange[]>([]);
  const [stock, setStock] = React.useState<IStock>();
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<number | null>();
  const [selectedProduct, setSelectedProduct] = React.useState<number | null>();
  const [loadingWarehouses, setLoadingWarehouses] = React.useState(true);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingStockChanges, setLoadingStockChanges] = React.useState(false);
  const [loadingStock, setLoadingStock] = React.useState(false);
  const [loadingWeeklyData, setLoadingWeeklyData] = React.useState(false);

  const getSelectedWarehouseName = () => {
    if (!selectedWarehouse) return '';
    const warehouse = warehouses.find(w => w.id === selectedWarehouse);
    return warehouse ? warehouse.name : '';
  };

  const getSelectedProductName = () => {
    if (!selectedProduct) return '';
    const product = products.find(p => p.id === selectedProduct);
    return product ? product.name : '';
  };

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
    setSelectedProduct(null);
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
    const fetchWeeklyData = async () => {
      if (!selectedWarehouse) return;
      setLoadingWeeklyData(true);
      try {
        const response = await fetch(
          `https://localhost:7116/api/stockchange/previous-week/${selectedWarehouse}`
        );
        const data = await response.json();
        setWeeklyData(data);
      } catch (error) {
        console.error('Error fetching weekly data:', error);
      } finally {
        setLoadingWeeklyData(false);
      }
    };

    fetchWeeklyData();
  }, [selectedWarehouse]);

  useEffect(() => {
    const fetchStockChanges = async () => {
      if (!selectedWarehouse || !selectedProduct) return;
      setLoadingStockChanges(true);

      try {
        const response = await fetch(
          `https://localhost:7116/api/stockchange/warehouse-product/${selectedProduct}-${selectedWarehouse}`
        );
        const data = await response.json();
        setStockChanges(Array.isArray(data) ? data : []);
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

    const weeklySalesData = React.useMemo(() => {
    if (!weeklyData.length) return null;

    const dailySales = weeklyData.reduce((acc, item) => {
      const date = new Date(item.changeDate);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          day: dayKey,
          sales: 0,
          date: date
        };
      }
      
      acc[dayKey].sales += Math.abs(item.quantity);
      
      return acc;
    }, {} as Record<string, { day: string; sales: number; date: Date }>);

    return Object.values(dailySales)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(item => item.sales);
  }, [weeklyData]);

  const dayLabels = React.useMemo(() => {
    if (!weeklyData.length) return [];
    
    const dailySales = weeklyData.reduce((acc, item) => {
      const date = new Date(item.changeDate);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!acc[dayKey]) {
        acc[dayKey] = date;
      }
      return acc;
    }, {} as Record<string, Date>);

    return Object.entries(dailySales)
      .sort((a, b) => a[1].getTime() - b[1].getTime())
      .map(([day]) => day);
  }, [weeklyData]);

  const totalWeeklySales = React.useMemo(() => {
    if (!weeklyData.length) return 0;
    return weeklyData.reduce((total, item) => total + Math.abs(item.quantity), 0);
  }, [weeklyData]);

  return (
    <div className="App">
      <header className="App-header">
        <PillNavFull />

        <InputLabel
          variant="standard"
          htmlFor="warehouse-select"
          sx={{ color: 'white', mb: 1, marginTop: 10 }}
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
              return getSelectedWarehouseName();
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
              <MenuItem key={warehouse.name} value={warehouse.id}>
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
                  return getSelectedProductName();
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
                  <MenuItem key={product.name} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </>
        )}

        {selectedWarehouse && (
          <Card sx={{ maxWidth: 400, mx: 'auto', my: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom align="center">
                Previous Week Sales
              </Typography>
              
              {loadingWeeklyData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : weeklySalesData && weeklySalesData.length > 0 ? (
                <>
                  <SparkLineChart
                    data={weeklySalesData}
                    height={150}
                    area
                    showTooltip
                    showHighlight
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    {dayLabels.map((day, index) => (
                      <Typography key={day} variant="caption" align="center">
                        {day}
                      </Typography>
                    ))}
                  </Box>
                  
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Total Sales: <strong>{totalWeeklySales}</strong> units
                  </Typography>
                  <Typography variant="caption" display="block" align="center" color="text.secondary">
                    {weeklyData.length} sales transactions
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4 }}>
                  No sales data available for previous week
                </Typography>
              )}
            </CardContent>
          </Card>
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
                  <Card sx={{ maxWidth: 400, mx: 'auto', my: 3, bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Grid>
                      <PieChart
                        colors={['green', 'blue', 'red']}
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
                      <p style={{ color: 'black' }}>Warehouse Capacity</p>
                    </Grid>
                    </CardContent>
                    </Card>
                    
                    <Card sx={{ maxWidth: 400, mx: 'auto', my: 3, bgcolor: 'background.paper' }}>
                    <CardContent>
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
                      <p style={{ color: 'black' }}>Store Capacity</p>
                    </Grid>
                    </CardContent>
                    </Card>
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
