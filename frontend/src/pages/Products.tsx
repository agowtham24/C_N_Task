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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
const formSchema = z.object({
  name: z
    .string()
    .min(6, {
      message: "Name is required",
    })
    .max(30, {
      message: "Name is required",
    }),
  description: z
    .string()
    .min(6, {
      message: "description is required",
    })
    .max(50, {
      message: "description is required",
    }),
  price: z.number().min(0, {
    message: "price should be minimum 10",
  }),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Image must be a valid file (JPEG, PNG, or GIF)." }
    ),
});
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({} as any);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 10,
      image: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await api.post(`${config.api_url}products`, formData);
      toast({
        variant: "default",
        description: "Product Created SuccessFully",
      });
      setSelectedFile(null);
      form.reset();
      getProducts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  }
  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("entered edit");
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await api.patch(`${config.api_url}products/${editData._id}`, formData);
      setEditMode(false);
      setSelectedFile(null);
      setEditData({});
      form.reset();
      getProducts();
      toast({
        variant: "default",
        description: "Product Updated SuccessFully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
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
  }, []);
  return (
    <>
      <Header />
      <section className="container mt-3">
        <Card className="w-full">
          <CardHeader>
            {editMode === false && <CardTitle>Create Product</CardTitle>}
            {editMode === true && <CardTitle>Edit Product</CardTitle>}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file || null);
                            setSelectedFile(file || null);
                          }}
                        />
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
            <CardTitle>Products List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your Products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.image}
                        loading="lazy"
                        height="150px"
                        width="150px"
                      />
                    </TableCell>
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
                              form.setValue("name", item.name);
                              form.setValue("description", item.description);
                              form.setValue("price", item.price);
                              form.setValue("image", undefined);
                            }}
                          >
                            edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await api.delete(
                                  `${config.api_url}products/${item._id}`
                                );
                                getProducts();
                                toast({
                                  variant: "default",
                                  description: "Products deleted Success",
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

export default ProductsPage;
