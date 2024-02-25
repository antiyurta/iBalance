"use client";
import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { AuthContextProvider } from "@/feature/context/AuthContext";
import { ProviderResource } from "@/feature/context/ResourceContext";
const { Sider, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <AuthContextProvider>
        <ProviderResource>
          <Sider theme="light">
            <Sidebar />
          </Sider>
          <Layout>
            <Content>{children}</Content>
          </Layout>
        </ProviderResource>
      </AuthContextProvider>
    </Layout>
  );
};
export default MainLayout;
