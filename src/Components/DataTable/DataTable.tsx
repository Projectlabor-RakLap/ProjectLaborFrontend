import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import UpdateWarehouseDialog from '../PopUps/WarehousePopUp/UpdateWarehousePopUp';

export interface ColumnData<T> {
  dataKey: keyof T;
  label: string;
  width?: number;
  numeric?: boolean;
}

interface VirtuosoTableProps<T> {
  data: T[];
  columns: ColumnData<T>[];
  height?: number | string;
  onUpdate?: (updated: T) => void;
  actionCell?: (row: T) => React.ReactNode; // <--- ideadjuk a gombot
}
export default function VirtuosoTable<T extends { id: number }>({
  data,
  columns,
  height = 400,
  actionCell,
}: VirtuosoTableProps<T>) {
  const VirtuosoTableComponents: TableComponents<T> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((col) => (
        <TableCell
          key={String(col.dataKey)}
          style={{
            width: col.width,
            position: 'sticky',
            top: 0,
            backgroundColor: 'grey',
            zIndex: 1,
            textAlign: col.numeric ? 'right' : 'left',
          }}
        >
          {col.label}
        </TableCell>
      ))}
    </TableRow>
  );

const rowContent = (_index: number, row: T) => (
  <>
    {columns.map((col) => (
      <TableCell
        key={String(col.dataKey)}
        style={{ backgroundColor: 'white', textAlign: col.numeric ? 'right' : 'left' }}
      >
        {col.dataKey === 'id' && actionCell ? (
          actionCell(row) // ide kerül a gomb
        ) : (
          String(row[col.dataKey])
        )}
      </TableCell>
    ))}
  </>
);

  return (
    <Paper style={{ height, width: '100%' }}>
      <TableVirtuoso data={data} components={VirtuosoTableComponents} fixedHeaderContent={fixedHeaderContent} itemContent={rowContent} />
    </Paper>
  );
}


