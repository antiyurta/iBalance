"use client";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { TabsProps } from "antd/lib";
import { Role } from "./role";
import PermissionEmployee from "./employee";
import { ProviderResource } from "./context/ResourceContext";
import TreeList from "./component/tree";
import { IDataPermission } from "@/service/permission/entities";
import { SetStateAction } from "react";
const { Title } = Typography;
const Permission = () => {
  const items: TabsProps["items"] = [
    {
      key: "item-1",
      label: "Цэсний тохиргоо",
      children: (
        <TreeList
          permissions={[]}
          setPermissions={function (
            value: SetStateAction<IDataPermission[]>
          ): void {
            // throw new Error("Function not implemented.");
          }}
        />
      ),
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
    <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Админ / Хэрэглэгчийн эрхийн тохиргоо</Title>
        </Space>
      </Col>
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
  );
};
export default Permission;
