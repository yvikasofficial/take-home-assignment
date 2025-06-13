import UsersTable from "./components/users-table";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <BrowserRouter>
      <div className="p-6">
        <UsersTable />
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
