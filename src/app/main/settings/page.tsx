"use client";

import NewCard from "@/components/Card";
import { NewInputNumber, NewSelect } from "@/components/input";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DateType, IDataConfigCode } from "@/service/config-code/entities";
import { ConfigCodeService } from "@/service/config-code/service";
import { Button, Form, Space, Typography } from "antd";
import { useContext, useEffect } from "react";
const { Title } = Typography;
const page = () => {
  const [form] = Form.useForm<IDataConfigCode>();
  const blockContext: BlockView = useContext(BlockContext);
  const onFinish = async (values: IDataConfigCode) => {
    blockContext.block();
    await ConfigCodeService.post(values).finally(() => blockContext.unblock());
  };
  const getConfigCode = async () => {
    await ConfigCodeService.get().then((response) => {
      if (response.success) {
        form.setFieldsValue(response.response);
      }
    });
  };
  useEffect(() => {
    getConfigCode();
  }, []);
  return (
    <>
      <Space size={24} style={{ padding: 20 }}>
        <Title level={3}>Тохиргоо</Title>
      </Space>
      <NewCard title="Баримтын дугаарын тохиргоо">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            <Form.Item label="Дугаарлалтын давтамж" name={"type"}>
              <NewSelect
                options={[
                  { value: DateType.Month, label: "Сар" },
                  { value: DateType.Season, label: "Улирал" },
                  { value: DateType.HalfYear, label: "Хагас жил" },
                  { value: DateType.Year, label: "Жил" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Тооны орон" name={"counter"}>
              <NewInputNumber />
            </Form.Item>
            <Form.Item label="Үйлдэл">
              <Button type="primary" htmlType="submit">
                Хадгалах
              </Button>
            </Form.Item>
          </div>
        </Form>
      </NewCard>
    </>
  );
};
export default page;
