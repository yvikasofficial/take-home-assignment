import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "react-router-dom";
import { useEditUser } from "@/services/user/use-edit-user";
import { useGetUser } from "@/services/user/use-get-user";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";

const userFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultValues: Partial<UserFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
};

export function UserEditModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: editUserMutation, isPending } = useEditUser();
  const editUserId = searchParams.get("editUser");

  const { data: user, isLoading: isLoadingUser } = useGetUser(editUserId || "");

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  // Pre-populate form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
      });
    }
  }, [user, form]);

  function onSubmit(data: UserFormValues) {
    if (!editUserId) return;

    editUserMutation(
      { id: editUserId, userData: data },
      {
        onSuccess: () => {
          handleClose();
          toast.success("User updated successfully!");
        },
        onError: (error: any) => {
          toast.error("Failed to update user. Please try again.");
        },
      }
    );
  }

  const handleClose = () => {
    searchParams.delete("editUser");
    setSearchParams(searchParams);
    form.reset(defaultValues);
  };

  return (
    <Dialog open={!!editUserId} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            {isLoadingUser
              ? "Loading user details..."
              : user
              ? `Update the details for ${user.firstName} ${user.lastName}.`
              : "Edit user information."}
          </DialogDescription>
        </DialogHeader>
        {isLoadingUser ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
