import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from "lucide-react";

const iconMap = {
  success: <CheckCircle className="text-green-500 w-16 h-16" />,
  error: <XCircle className="text-red-500 w-16 h-16" />,
  refund: <RotateCcw className="text-blue-500 w-16 h-16" />,
  warning: <AlertTriangle className="text-yellow-500 w-16 h-16" />,
};

export default function StatusPage({
  type = "success",
  title,
  message,
  buttonText = "Go Home",
  onClick,
}: {
  type: "success" | "error" | "refund" | "warning";
  title: string;
  message: string;
  buttonText?: string;
  onClick?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">{iconMap[type]}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        <button
          onClick={onClick}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
