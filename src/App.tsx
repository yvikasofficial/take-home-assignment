import { UsersTable } from "./components/users-table";

const App = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <UsersTable />
    </div>
  );
};

export default App;
