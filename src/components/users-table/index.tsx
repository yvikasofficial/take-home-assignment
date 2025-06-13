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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, MoreVertical } from "lucide-react";
import { useSearchParams } from "react-router-dom";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const UsersTable = () => {
  const { data, isLoading } = useGetUsers();
  const [searchParams, setSearchParams] = useSearchParams();

  const columnDefs = [
    { field: "id", headerName: "ID", width: 100 },

    {
      headerName: "Full Name",
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        return `${params.data.firstName} ${params.data.lastName}`;
      },
      minWidth: 200,
    },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "city", headerName: "City", flex: 1, minWidth: 200 },
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
    {
      headerName: "",
      pinned: "right",
      width: 65,
      suppressMovable: true,
      cellRenderer: (params: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSearchParams({ user: params.data.id });
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Edit", params.data)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Delete", params.data)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
        loadingOverlayComponent={"Loading..."}
        loadingOverlayComponentParams={{
          loadingMessage: "Loading users...",
        }}
        overlayLoadingTemplate={
          '<span class="ag-overlay-loading-center">Loading users...</span>'
        }
        loading={isLoading}
      />
    </div>
  );
};

export default UsersTable;
