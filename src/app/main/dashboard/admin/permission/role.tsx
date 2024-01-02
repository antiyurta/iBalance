import NewCard from "@/components/Card";
import { NewCheckbox, NewInput, NewTextArea } from "@/components/input";
import { IDataRole } from "@/service/permission/role/entities";
import { Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import { PermissionList } from "./permission";
import { useEffect } from "react";

export const Role = () => {
  const [form] = Form.useForm<IDataRole>();
  const onFinish = (values: IDataRole) => {
    console.log("values ======>", values);
  };
  return (
    <>
      <Row gutter={[12, 24]}>
        <Col span={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Image
              src={"/images/PrintIcon.svg"}
              width={24}
              height={24}
              alt="printIcon"
            />
            <Image
              src={"/images/DownloadIcon.svg"}
              width={24}
              height={24}
              alt="downloadIcon"
            />
          </Space>
        </Col>
      </Row>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={8}>
            <NewCard title="Эрх">
              <Form.Item name="name" label="Нэр">
                <NewInput />
              </Form.Item>
              <Form.Item name="description" label="Тайлбар">
                <NewTextArea />
              </Form.Item>
            </NewCard>
          </Col>
          <Col span={16}>
            <NewCard title="Зөвшөөрөл">
              <PermissionList form={form} />
              <Form.Item>
                <Button htmlType="submit">Хадгалах</Button>
              </Form.Item>
            </NewCard>
          </Col>
        </Row>
      </Form>
    </>
  );
};
