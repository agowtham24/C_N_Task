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

const formSchema = z.object({
  customerName: z
    .string()
    .min(6, {
      message: "Name is required",
    })
    .max(30, {
      message: "Name is required",
    }),
  productId: z.string(),
});

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({} as any);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      productId: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post(`${config.api_url}orders`, values);
      toast({
        variant: "default",
        description: "order Created SuccessFully",
      });
      form.reset();
      getOrders();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  }
  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.patch(`${config.api_url}orders/${editData._id}`, values);
      toast({
        variant: "default",
        description: "order updated SuccessFully",
      });
      setEditMode(false);
      setEditData({});
      form.reset();
      getOrders();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  }
  async function getOrders() {
    try {
      const res = await api.get(`${config.api_url}orders`);
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getProducts() {
    try {
      const res = await api.get(`${config.api_url}products`);
      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getProducts();
    getOrders();
  }, []);
  return (
    <>
      <Header />
      <section className="container mt-3">
        <Card className="w-full">
          <CardHeader>
            {editMode === false && <CardTitle>Create Order</CardTitle>}
            {editMode === true && <CardTitle>Edit Order</CardTitle>}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={
                  editMode === false
                    ? form.handleSubmit(onSubmit)
                    : form.handleSubmit(onEditSubmit)
                }
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
              >
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Customer Nae"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((item: any) => (
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
      <section className="container mt-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your orders.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Product Details</TableHead>
                  <TableHead>status</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-center">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditMode(true);
                              setEditData(item);
                              form.setValue("customerName", item.customerName);
                              form.setValue("productId", item.product._id);
                            }}
                          >
                            edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await api.delete(
                                  `${config.api_url}orders/${item._id}`
                                );
                                getOrders();
                                toast({
                                  variant: "default",
                                  description: "order deleted Success",
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

export default OrdersPage;
