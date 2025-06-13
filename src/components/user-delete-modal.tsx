import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useDeleteUser } from "@/services/user/use-delete-user";
import { useGetUser } from "@/services/user/use-get-user";
import { Loader2, Trash, X } from "lucide-react";

export function UserDeleteModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: deleteUserMutation, isPending } = useDeleteUser();
  const deleteUserId = searchParams.get("deleteUser");

  const { data: user, isLoading: isLoadingUser } = useGetUser(
    deleteUserId || ""
  );

  const handleDelete = () => {
    if (!deleteUserId) return;

    deleteUserMutation(
      { id: deleteUserId },
      {
        onSuccess: () => {
          handleClose();
          toast.success("User deleted successfully!");
        },
        onError: (error: any) => {
          toast.error("Failed to delete user. Please try again.");
        },
      }
    );
  };

  const handleClose = () => {
    searchParams.delete("deleteUser");
    setSearchParams(searchParams);
  };

  return (
    <Dialog open={!!deleteUserId} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash className="h-5 w-5" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            {isLoadingUser
              ? "Loading user details..."
              : user
              ? `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`
              : "Are you sure you want to delete this user?"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !user && deleteUserId ? (
          <div className="py-8 flex flex-col items-center space-y-2">
            <p className="text-muted-foreground">No user found with this ID.</p>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : user ? (
          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Name:</span>
                <span className="col-span-2">{`${user.firstName} ${user.lastName}`}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <span className="col-span-2">{user.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">City:</span>
                <span className="col-span-2">{user.city}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Joined:
                </span>
                <span className="col-span-2">
                  {new Date(user.registeredDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              This action is permanent and cannot be undone.
            </p>
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || !user}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
