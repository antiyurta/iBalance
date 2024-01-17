"use client";
import "antd/dist/reset.css";
import "../app/globals.scss";
import React from "react";
import { Ubuntu } from "next/font/google";
import { AppBlock } from "@/feature/context/BlockContext";
import { Provider } from "react-redux";
import { store, persistor } from "@/feature/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Interceptor, api } from "@/feature/interceptor/interceptor";
import { App, ConfigProvider, Spin, theme } from "antd";
import mn_MN from "antd/locale/mn_MN";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
Interceptor(api, store);
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
            <ConfigProvider
              locale={mn_MN}
              theme={{
                components: {
                  DatePicker: {
                    controlHeight: 36,
                  },
                  Select: {
                    controlHeight: 36,
                  },
                  Input: {
                    controlHeight: 36,
                  },
                  InputNumber: {
                    controlHeight: 36,
                  },
                  Typography: {
                    titleMarginBottom: 0,
                  },
                  Button: {
                    controlHeight: 39,
                    padding: 12,
                    fontSize: 14,
                    colorText: "#198754",
                    colorBorder: "#198754",
                  },
                  Card: {
                    borderRadius: 12,
                  },
                },
                algorithm: theme.compactAlgorithm,
                token: {
                  colorPrimary: "#198754",
                  colorBgContainer: "white",
                  colorPrimaryBg: "#f8f9fa",
                  lineHeight: 1.2,
                  fontSizeHeading1: 24,
                  fontSizeHeading2: 19,
                  fontSizeHeading3: 14,
                  fontSizeHeading4: 12,
                  lineHeightHeading4: 1.1,
                  fontSizeHeading5: 10,
                  lineHeightHeading5: 1.1,
                  fontWeightStrong: 700,
                  colorTextHeading: "#495057",
                },
              }}
            >
              <AppBlock />
              <App className="app-main">{children}</App>
            </ConfigProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
