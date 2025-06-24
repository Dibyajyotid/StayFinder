import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginPromptDialog from "./LoginPromptDialog";
import { useAuth } from "./auth-provider";
import { useState } from "react";

function Footer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6 text-rose-500" />
              <span className="text-lg font-bold text-rose-500">
                StayFinder
              </span>
            </div>

            <p className="text-gray-600">Find your perfect stay</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Cancellation Options
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Diversity & Belonging
                </Link>
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  StayFinder Associates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Host</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <button
                  onClick={() => {
                    if (user) {
                      navigate("/dashboard");
                    } else {
                      setShowLoginAlert(true);
                    }
                  }}
                  className="hover:text-gray-900"
                >
                  Host Dashboard
                </button>

                <LoginPromptDialog
                  open={showLoginAlert}
                  onOpenChange={setShowLoginAlert}
                />
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Host an Experience
                </Link>
              </li>
              <li>
                <Link to={"#"} className="hover:text-gray-900">
                  Responsible Hosting
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">
            © 2025 StayFinder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to={"#"} className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link to={"#"} className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link to={"#"} className="text-gray-600 hover:text-gray-900">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
