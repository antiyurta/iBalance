"use client";
import "antd/dist/reset.css";
import "../app/globals.scss";
import React from "react";
import { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { AppBlock } from "@/feature/context/BlockContext";
import { Provider } from "react-redux";
import { store, persistor } from "@/feature/store/store";
import { PersistGate } from "redux-persist/integration/react";
import Sidebar from "./layout/sidebar";
import { Interceptor, api } from "@/feature/interceptor/interceptor";
import { Spin } from "antd";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

Interceptor(api, store);

// export const metadata: Metadata = {
//   title: "iBalance",
//   description: "iBalance",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Provider store={store}>
          <PersistGate
            loading={
              <div className="app-container-block">
                <Spin />
              </div>
            }
            persistor={persistor}
          >
            <AppBlock />
            <Sidebar />
            <main className="app-main">{children}</main>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
