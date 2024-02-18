"use client";
import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { AuthContextProvider } from "@/feature/context/AuthContext";
const { Sider, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <AuthContextProvider>
      <Sider theme="light">
        <Sidebar />
      </Sider>
      <Layout>
        <Content>{children}</Content>
      </Layout>
      </AuthContextProvider>
    </Layout>
  );
};
export default MainLayout;
