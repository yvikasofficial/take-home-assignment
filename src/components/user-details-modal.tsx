import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetUser } from "@/services/user/use-get-user";
import { useSearchParams } from "react-router-dom";

export function UserDetailsModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get userId from either props or query params
  const queryUserId = searchParams.get("user");
  const userId = queryUserId;

  const { data: user, isLoading } = useGetUser(userId || "");

  // Handle modal close
  const handleClose = () => {
    searchParams.delete("user");
    setSearchParams(searchParams);
  };

  return (
    <Dialog open={!!queryUserId} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Loading user details..."
              : `Detailed information about ${user?.firstName} ${user?.lastName}`}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-4">Loading...</div>
        ) : user ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-3">{`${user.firstName} ${user.lastName}`}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Email:</span>
                <span className="col-span-3">{user.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">City:</span>
                <span className="col-span-3">{user.city}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Joined:</span>
                <span className="col-span-3">
                  {new Date(user.registeredDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">User not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
