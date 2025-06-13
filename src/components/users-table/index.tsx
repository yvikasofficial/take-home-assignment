import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  type ColDef,
  type ValueFormatterParams,
  type ValueGetterParams,
} from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { useGetUsers } from "@/services/user/use-get-users";
import type { User } from "@/types";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const UsersTable = () => {
  const { data, isLoading } = useGetUsers();

  const columnDefs = [
    { field: "id", headerName: "ID", width: 100 },

    {
      headerName: "Full Name",
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        return `${params.data.firstName} ${params.data.lastName}`;
      },
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    {
      field: "registeredDate",
      headerName: "Registered Date",
      width: 200,
      valueFormatter: (params: ValueFormatterParams) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      headerName: "DSR",
      width: 200,
      valueGetter: (params: ValueGetterParams) => {
        const registeredDate = new Date(params.data.registeredDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - registeredDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return `${params.value} days`;
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ag-theme-quartz" style={{ height: "80vh", width: "100%" }}>
      <AgGridReact<User>
        columnDefs={columnDefs as ColDef<User>[]}
        rowData={data?.users}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          enableRowGroup: true,
        }}
        animateRows={true}
        rowBuffer={100}
        rowSelection="multiple"
        suppressColumnMoveAnimation={false}
      />
    </div>
  );
};

export default UsersTable;
