import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
function Header() {
  const pagePermissions: string[] = JSON.parse(
    sessionStorage.getItem("permissions") || "[]"
  );

  return (
    <>
      <div className="bg-secondary h-10 flex justify-end">
        {pagePermissions.includes("users") && (
          <Link to="/users" className="link">
            Users
          </Link>
        )}
        {pagePermissions.includes("products") && (
          <Link to="/products" className="link">
            Products
          </Link>
        )}
        {pagePermissions.includes("orders") && (
          <Link to="/orders" className="link">
            Orders
          </Link>
        )}

        <Button
          type="button"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }}
          size="sm"
          variant="default"
          style={{ marginRight: "8px" }}
        >
          <LogOut />
        </Button>
      </div>
    </>
  );
}

export default Header;
