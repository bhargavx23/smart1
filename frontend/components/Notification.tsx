import React from "react";
import { toast } from "./ui/use-toast";

const Notification = () => {
  const showSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
      variant: "destructive", // Adjusted to use a valid variant
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return (
    <div>
      {/* Example buttons to trigger notifications */}
      <button
        onClick={() => showSuccess("Operation completed successfully!")}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Show Success
      </button>
      <button
        onClick={() => showError("An error occurred!")}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Show Error
      </button>
    </div>
  );
};

export default Notification;
