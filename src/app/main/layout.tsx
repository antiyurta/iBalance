"use client";
import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
const { Sider, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  console.log("end bn");
  return (
    <Layout>
      <Sider theme="light">
        <Sidebar />
      </Sider>
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
