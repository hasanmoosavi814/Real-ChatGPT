"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </Provider>
  );
};

export default AppProvider;
