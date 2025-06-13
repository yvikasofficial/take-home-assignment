import { UserDetailsModal } from "./components/user-details-modal";
import UsersTable from "./components/users-table";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="p-6">
        <UserDetailsModal />
        <UsersTable />
      </div>
    </BrowserRouter>
  );
};

export default App;
