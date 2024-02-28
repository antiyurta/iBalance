import { useTypedSelector } from "@/feature/store/reducer";
import { Breadcrumb, Button, Col, Row, Space } from "antd";
import Image from "next/image";
import { ReactNode } from "react";
import { AddButton } from "./add-button";
interface IProps {
  onClick?: () => void;
  addButtonName?: string;
  children?: ReactNode;
}
const PageTitle: React.FC<IProps> = ({ onClick, children }) => {
  const tab = useTypedSelector((state) => state.tabs);
  const currentTab = tab.tabItems.find((item) => item.key == tab.activeKey);
  return (
    <div className="page-title-container">
      <Breadcrumb style={{ fontSize: 16 }}>
        {currentTab?.breadcrumb.map((item, index) => (
          <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {onClick !== undefined && (
        <AddButton hidden={!currentTab?.isAdd} onClick={() => onClick()} />
      )}
      {children}
    </div>
  );
};
export default PageTitle;
