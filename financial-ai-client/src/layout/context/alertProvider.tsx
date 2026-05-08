import AlertMessage from "@/component/Alert/AlertMessage";
import React, { createContext, useContext, useState } from "react";

interface AlertContextProps {
  showAlert: (message: string, type: "success" | "error") => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.visible && (
        <AlertMessage
          messages={alert.message}
          sucessOrFail={alert.type}
          backgroundColor={alert.type === "success" ? "rgb(44, 197, 44)" : "rgb(255, 0, 0)"}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
