"use client";

import NewDirectoryTree from "@/components/directoryTree";
import StoragiesRegistration from "./StoragiesRegistration";
import { useEffect, useState } from "react";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { Col, Input, Row, Space, Tabs, Typography } from "antd";
const { Title } = Typography;
const StoragiesRegistrationPage = () => {
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const getSections = async (type: TreeSectionType) => {
    await TreeSectionService.get(type).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  const items = [
    {
      label: "Байршилын жагсаалт",
      key: "item-1",
      children: <StoragiesRegistration ComponentType="FULL" />,
    },
    {
      label: "Байршилын бүлгийн жагсаалт",
      key: "item-2",
      children: (
        <NewDirectoryTree
          data={sections}
          isLeaf={true}
          extra="FULL"
          onEdit={(row) => console.log("onEdit ======>", row)}
          onDelete={(id) => console.log("onDelete ======>", id)}
        />
      ),
    },
  ];
  return (
    <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
  );
};
export default StoragiesRegistrationPage;
