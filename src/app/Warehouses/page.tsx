import React, { useEffect, useState } from 'react';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import { IWarehouse } from '../../interfaces/IWarehouse';
import VirtuosoTable, { ColumnData } from '../../Components/DataTable/DataTable';
import UpdateWarehouseDialog from '../../Components/PopUps/UpdateWarehousePopUp';

const warehouseColumns: ColumnData<IWarehouse>[] = [
  { dataKey: 'id', label: 'Update', width: 50 },
  { dataKey: 'name', label: 'Name', width: 150 },
  { dataKey: 'location', label: 'Location', width: 150 },
];

function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const height = useWindowHeight();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("https://localhost:7116/api/warehouse", {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: IWarehouse[] = await response.json();
        setWarehouses(data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleUpdate = (updated: IWarehouse) => {
    setWarehouses(prev =>
      prev.map(w => (w.id === updated.id ? { ...w, ...updated } : w))
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <PillNavFull />
        <VirtuosoTable
          data={warehouses}
          columns={warehouseColumns}
          height={height * 0.85}
          onUpdate={handleUpdate} // frissíti a táblát
          actionCell={(row) => (
            <UpdateWarehouseDialog
              id={row.id}
              text="Update"
              dialogTitle="Warehouse update"
              dialogContent={`Update the ${row.name} warehouse`}
              acceptText="Update"
              cancelText="Cancel"
              initialValues={row}
              onUpdate={handleUpdate}
            />
          )}
        />
      </header>
    </div>
  );
}
