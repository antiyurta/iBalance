import { useTypedSelector } from "@/feature/store/reducer";
import { Breadcrumb, Button, Col, Row, Space } from "antd";
import Image from "next/image";
import { ReactNode } from "react";
interface IProps {
  onClick?: () => void;
  children?: ReactNode;
}
const PageTitle: React.FC<IProps> = ({ onClick, children }) => {
  const tab = useTypedSelector((state) => state.tabs);
  const currentTab = tab.tabItems.find((item) => item.key == tab.activeKey);
  return (
    <Row gutter={24}>
      <Col span={24}>
        <Space size={24}>
          <Breadcrumb style={{ fontSize: 16 }}>
            {currentTab?.breadcrumb.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {onClick !== undefined && (
            <Button
              hidden={!currentTab?.isAdd}
              type="primary"
              onClick={() => onClick()}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Шинээр бүртгэх
            </Button>
          )}
          {children}
        </Space>
      </Col>
    </Row>
  );
};
export default PageTitle;
