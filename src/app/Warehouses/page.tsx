import { useEffect, useState } from 'react';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import { IWarehouse } from '../../interfaces/IWarehouse';
import VirtuosoTable, { ColumnData } from '../../Components/DataTable/DataTable';
import UpdateWarehouseDialog from '../../Components/PopUps/WarehousePopUps/UpdateWarehousePopUp';
import DeleteWarehouseDialog from '../../Components/PopUps/WarehousePopUps/DeleteWarehousePopUp';
import CreateWarehouseDialog from '../../Components/PopUps/WarehousePopUps/CreateWarehousePopUp';

const warehouseColumns: ColumnData<IWarehouse>[] = [
  { dataKey: 'id', label: 'id', width: 50 },
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
  const apiBaseUrl = `https://${window.location.hostname}:7116`;
  const height = useWindowHeight();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/warehouse`, {
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
          onUpdate={handleUpdate}
          updateButton={(row) => (
            <UpdateWarehouseDialog
              id={row.id}
              text="Update"
              dialogTitle="Warehouse update"
              dialogContent={`Update the ${row.name} warehouse`}
              acceptText="Update"
              cancelText="Cancel"
              initialValues={row}
              apiUrl={apiBaseUrl}
              onUpdate={handleUpdate}
            />
          )}
          deleteButton={(row) => (
          <DeleteWarehouseDialog
            id={row.id}
            text="Delete"
            dialogTitle="Delete warehouse"
            dialogContent={`Are you sure you want to delete ${row.name} warehouse?`}
            acceptText="Delete"
            cancelText="Cancel"
            apiUrl={apiBaseUrl}
            onUpdate={handleUpdate}
          />)}
          createButton={(
            <CreateWarehouseDialog
            text="Create"
            dialogTitle="Create warehouse"
            dialogContent={`Please add a name and a location`}
            acceptText="Create"
            cancelText="Cancel"
            apiUrl={apiBaseUrl}
            onUpdate={handleUpdate}
            />
          )} 
        />
      </header>
    </div>
  );
}
