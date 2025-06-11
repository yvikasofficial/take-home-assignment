import { Button } from "@/components/ui/button";
import generateFakeUsers from "./lib/generate-fake-users";

const App = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <Button
        variant="default"
        onClick={() => {
          const users = generateFakeUsers();
          console.log(users);
        }}
      >
        Click me!
      </Button>
    </div>
  );
};

export default App;
