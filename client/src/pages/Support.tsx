import Hero from "@/components/Hero";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import { SlSocialLinkedin } from "react-icons/sl";

export default function SupportPage() {
  return (
    <div>
      <Hero />
      <Separator className="m-6 bg-rose-400" />
      <div className="container mx-auto px-4 py-4 flex items-center justify-center dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 w-full space-y-6 border-l-5 border-rose-500">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Contact Support
          </h2>

          <Separator className="bg-rose-500" />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="text-rose-600 w-6 h-6" />
              <span className="text-gray-700 dark:text-gray-300 text-lg">
                dibyajyotid358@gmail.com
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="text-rose-600 w-6 h-6" />
              <span className="text-gray-700 dark:text-gray-300 text-lg">
                +91 ----- -----
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <SlSocialLinkedin className="text-rose-700 w-6 h-6" />
              <a
                href="https://www.linkedin.com/in/dibyajyoti-das-2332a5260"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400 text-lg underline hover:text-blue-800"
              >
                www.linkedin.com/in/dibyajyoti-das-2332a5260
              </a>
            </div>
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400 text-sm pt-6">
            We&apos;ll get back to you within 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
