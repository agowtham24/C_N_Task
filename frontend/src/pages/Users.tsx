import Header from "@/components/ui/header";
import { api, config } from "@/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";

const formSchema = z
  .object({
    name: z
      .string()
      .min(6, {
        message: "Name is required",
      })
      .max(30, {
        message: "Name is required",
      }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    role: z.string().min(1, {
      message: "role must be at least 1 characters.",
    }),
    ownerId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.role === "Employee" && !values.ownerId) {
      ctx.addIssue({
        path: ["ownerId"], // The field where the issue is added
        message: "Owner ID is required when role is Employee.",
        code: "custom",
      });
    }
  });

function UsersPage() {
  const role = sessionStorage.getItem("role") as string;
  const [roles, setRoles] = useState([]);
  const [employeeRole, setEmployeeRole] = useState("");
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "",
      ownerId: "",
    },
  });
  const selectedRole = form.watch("role");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post(`${config.api_url}users`, values);
      toast({
        variant: "default",
        description: "User Created SuccessFully",
      });
      form.reset();
      getUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  }
  async function getRoles() {
    try {
      const res = await api.get(`${config.api_url}roles`);
      setRoles(res.data.data);
      let role = "";
      res.data.data.forEach((item: any) => {
        if (item.role === "Employee") {
          role = item._id;
        }
      });
      setEmployeeRole(role);
    } catch (error) {
      console.log(error);
    }
  }
  async function getUsers() {
    try {
      const res = await api.get(`${config.api_url}users`);
      console.log(res.data.data);
      setUsers(res.data.data);
      setManagers(
        res.data.data.filter((item: any) => item.roleName === "Manager")
      );
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getRoles();
    getUsers();
  }, []);
  return (
    <>
      <Header />
      {role !== "Manager" && (
        <section className="container mt-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create User</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Name" {...field} type="text" />
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
                          <Input placeholder="email" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((item: any) => (
                                <SelectItem value={item._id} key={item._id}>
                                  {item.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OwnerId</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                            disabled={selectedRole !== employeeRole}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {managers.map((item: any) => (
                                <SelectItem value={item._id} key={item._id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-8">
                    Submit
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="container mt-5">
        <Card className="w-full">
          <CardHeader>
            {role === "Manager" && <CardTitle>Team List</CardTitle>}
            {role !== "Manager" && <CardTitle>Users List</CardTitle>}
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your Users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.roleName}</TableCell>
                    {role !== "Manager" && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="text-center">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem>edit</DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  await api.delete(
                                    `${config.api_url}users/${item._id}`
                                  );
                                  getUsers();
                                  toast({
                                    variant: "default",
                                    description: "User deleted Success",
                                  });
                                } catch (error: any) {
                                  toast({
                                    variant: "default",
                                    description: error.response.data.message,
                                  });
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export default UsersPage;
