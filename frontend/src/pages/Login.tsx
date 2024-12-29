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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function LoginPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await api.post(`${config.api_url}users/login`, values);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem(
        "permissions",
        JSON.stringify(res.data.permissions)
      );
      sessionStorage.setItem("role", res.data.role);
      if (res.data.role === "Employee") {
        window.location.href = "/orders";
      } else if (res.data.role === "Manager") {
        window.location.href = "/products";
      } else {
        window.location.href = "/users";
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  }

  return (
    <div className="h-full pt-4">
      <section className="container mt-10 flex justify-center align-middle drop-shadow-lg">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default LoginPage;
