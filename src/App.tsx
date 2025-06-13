import { UserAddModal } from "./components/user-add-modal";
import { UserEditModal } from "./components/user-edit-modal";
import { UserDetailsModal } from "./components/user-details-modal";
import UsersTable from "./components/users-table";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { UserDeleteModal } from "./components/user-delete-modal";

const App = () => {
  return (
    <BrowserRouter>
      <div className="p-6">
        <UserDetailsModal />
        <UserAddModal />
        <UserEditModal />
        <UserDeleteModal />
        <UsersTable />
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
