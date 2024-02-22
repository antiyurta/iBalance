"use client";
import { Col, Row, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { Role } from "./role";
import PermissionEmployee from "./employee";
import { ProviderResource } from "./context/ResourceContext";
import PageTitle from "@/components/page-title";
import { NextPage } from "next";
import { Resource } from "./resource";
const Permission: NextPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "item-1",
      label: "Цэсний тохиргоо",
      children: <Resource />,
    },
    {
      key: "item-2",
      label: "Эрхийн зөвшөөрөл",
      children: <Role />,
    },
    {
      key: "item-3",
      label: "Хэрэглэгчийн зөвшөөрөл",
      children: <PermissionEmployee />,
    },
  ];
  return (
    <>
      <PageTitle />
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col span={24}>
          <ProviderResource>
            <Tabs
              className="lineTop"
              items={items}
              destroyInactiveTabPane={true}
            />
          </ProviderResource>
        </Col>
      </Row>
    </>
  );
};
export default Permission;
