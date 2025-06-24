import { Home, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import LoginPromptDialog from "./LoginPromptDialog";

function Header() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-4 px-4 py-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={"/"} className="flex items-center space-x-2">
          <Home className="text-rose-500 h-8 w-8" />
          <span className="text-xl font-bold text-rose-500">StayFinder</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to={"/"} className="text-gray-700 hover:text-gray-900 hover:border-b-3 hover:border-rose-500 transition-all">
            Home
          </Link>

          <button
            onClick={() => {
              if (user) {
                navigate("/dashboard");
              } else {
                setShowLoginAlert(true);
              }
            }}
            className="text-gray-700 hover:text-gray-900 hover:border-b-3 border-rose-500 transition-all ease-in-out cursor-pointer"
          >
            Host Dashboard
          </button>

          <LoginPromptDialog
            open={showLoginAlert}
            onOpenChange={setShowLoginAlert}
          />
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex items-center space-x-2 border rounded-full p-2"
                >
                  <Menu size={4} />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user?.userName?.toUpperCase().charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 border-l-3 border-l-rose-400">
                <DropdownMenuItem asChild>
                  <Link to={"/profile"}>Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to={"/bookings"}>My Bookings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to={"/dashboard"}>My Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-rose-400"/>
                <DropdownMenuItem onClick={logout} >Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant={"ghost"} asChild>
                <Link to={"/login"}>Log In</Link>
              </Button>

              <Button asChild>
                <Link to={"/signup"}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
