import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import UsersPage from "./pages/Users";
import ProductsPage from "./pages/Products";
import OrdersPage from "./pages/Orders";
const getRoutes = () => {
  const pagePermissions: string[] = JSON.parse(
    sessionStorage.getItem("permissions") || "[]"
  );

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/users",
      element: pagePermissions.includes("users") ? (
        <UsersPage />
      ) : (
        <div>404 page Not Found</div>
      ),
    },
    {
      path: "/products",
      element: pagePermissions.includes("products") ? (
        <ProductsPage />
      ) : (
        <div>404 page Not Found</div>
      ),
    },
    {
      path: "/orders",
      element: pagePermissions.includes("orders") ? (
        <OrdersPage />
      ) : (
        <div>404 page Not Found</div>
      ),
    },
    {
      path: "*",
      element: <LoginPage />,
    },
  ]);
  return router;
};

function App() {
  return (
    <>
      <RouterProvider router={getRoutes()}></RouterProvider>
    </>
  );
}

export default App;
