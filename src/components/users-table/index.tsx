import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  type ColDef,
  type ValueFormatterParams,
  type ValueGetterParams,
  type ICellRendererParams,
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
import {
  Eye,
  Edit,
  Trash,
  MoreVertical,
  Plus,
  MapPin,
  Calendar,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { UserAddModal } from "./user-add-modal";
import { Search } from "lucide-react";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import { UserDeleteModal } from "./user-delete-modal";
import { UserEditModal } from "./user-edit-modal";
import { UserDetailsModal } from "./user-details-modal";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const UsersTable = () => {
  const { data, isLoading } = useGetUsers();
  const [_searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const columnDefs = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className="text-center">
            <Badge variant="outline">#{params.data.id}</Badge>
          </div>
        );
      },
    },

    {
      headerName: "Full Name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="!bg-[#784778] text-white">
                {params.data.firstName[0]}
                {params.data.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {`${params.data.firstName} ${params.data.lastName}`}
          </div>
        );
      },
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className="flex items-center h-full gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {params.data.city}
          </div>
        );
      },
    },
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
        const registeredDate = params.data.registeredDate;
        return differenceInDays(new Date(), registeredDate);
      },

      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className="flex items-center h-full gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {params.value === 0 ? "Today" : `${params.value} days`}
          </div>
        );
      },
    },
    {
      headerName: "",
      pinned: "right",
      width: 65,
      suppressMovable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const user = params.data as User;
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
                  setSearchParams({ user: user.id });
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSearchParams({ editUser: user.id });
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSearchParams({ deleteUser: user.id });
                }}
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

  const filteredData = data?.users?.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.city.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <UserDetailsModal />
      <UserAddModal />
      <UserEditModal />
      <UserDeleteModal />
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-medium">Users</h4>
        <span className="text-sm text-muted-foreground">
          A fully optimized table with occlusion scrolling and search.{" "}
          {data?.totalUsers && data?.totalUsers > 0 && (
            <span className="font-medium">
              Total records: {data?.totalUsers.toLocaleString()}
            </span>
          )}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setSearchParams({ addUser: "true" })}>
          <Plus className="mr-1 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div
        className="ag-theme-quartz"
        style={{ height: "calc(100vh - 180px)", width: "100%" }}
      >
        <AgGridReact<User>
          columnDefs={columnDefs as ColDef<User>[]}
          rowData={filteredData}
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
    </div>
  );
};

export default UsersTable;
