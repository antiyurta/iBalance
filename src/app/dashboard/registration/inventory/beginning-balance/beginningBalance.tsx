import { ComponentsType } from "@/service/entities";
import { Button, Col, Input, Row, Space, Typography } from "antd";
import Image from "next/image";

interface IProps {
  ComponentType: ComponentsType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;

const BeginningBalance = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  return (
    <>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            {ComponentType === "FULL" ? (
              <Title level={5}>
                Үндсэн бүртгэл / Бараа материал / Эхний үлдэгдэл
              </Title>
            ) : (
              <Title>Эхний үлдэгдэл</Title>
            )}
            <Button
              type="primary"
              onClick={() => {
                // form.resetFields();
                // setEditMode(false);
                // setIsOpenModal(true);
              }}
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
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
      </Row>
    </>
  );
};
export default BeginningBalance;
