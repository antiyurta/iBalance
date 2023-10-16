import NewCard from "@/components/Card";
import { Button, Col, Form, Row, Space } from "antd";
import Image from "next/image";
import EditableTable from "./editableTable";
import { CompactItem, IOrder, ITabs, Type } from "./index";
import { formItems } from "./formItems";
import { useState } from "react";
import NewModal from "@/components/modal";
import Information from "../registration/customer/information/information";
import { IDataConsumer } from "@/service/consumer/entities";
interface IProps extends ITabs {
  type: Type;
  isEdit: boolean;
}

interface IRender {
  key: number;
  item: IOrder;
}

const Create = (props: IProps) => {
  const { type, grid, columns, isEdit, order } = props;
  const [form] = Form.useForm();
  const [to, setTo] = useState<string>();
  const [isOpenModalConsumer, setIsOpenModalConsumer] =
    useState<boolean>(false);
  const initialValues = {
    status: type === "SALES" && isEdit ? 0 : null,
  };
  const openCompactModal = (props: { from?: CompactItem; to?: string }) => {
    const { from, to } = props;
    switch (from) {
      case CompactItem.CONSUMER:
        setTo(to);
        setIsOpenModalConsumer(true);
        return;
      default:
        return;
    }
  };
  const Render = (props: IRender) => {
    const { item } = props;
    if (item.compact?.is) {
      return (
        <Form.Item label={item.label}>
          <Space.Compact>
            <div
              className="extraButton"
              onClick={() =>
                openCompactModal({
                  from: item.compact?.from,
                  to: item.compact?.to,
                })
              }
            >
              <Image
                src="/icons/clipboardBlack.svg"
                width={16}
                height={16}
                alt="clipboard"
              />
            </div>
            <Form.Item
              name={item.name}
              rules={[
                {
                  required: item.required,
                  message: `${item.label} заавал`,
                },
              ]}
            >
              {formItems({
                type: item.type,
                disabled: item.disabled,
                options: item.options,
              })}
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item
          label={item.label}
          name={item.name}
          rules={[
            {
              required: item.required,
              message: `${item.label} заавал`,
            },
          ]}
        >
          {formItems({
            type: item.type,
            disabled: item.disabled,
            options: item.options,
          })}
        </Form.Item>
      );
    }
  };
  const Content = () => (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <div
        style={{
          display: "flex",
          gap: 12,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: `repeat(${grid}, minmax(0,1fr))`,
          }}
        >
          {order?.map((item, key) => (
            <Render key={key} item={item} />
          ))}
        </div>
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#DEE2E6",
          }}
        />
        <Form.List name="test">
          {(items, { add, remove }) => (
            <EditableTable
              type={type}
              data={items}
              form={form}
              columns={columns}
              add={add}
              remove={remove}
            />
          )}
        </Form.List>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Button
            type="primary"
            onClick={() =>
              form.validateFields().then((values) => {
                // onFinish(values);
                console.log(values);
              })
            }
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </Form>
  );
  return (
    <>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
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
          </Space>
        </Col>
        <Col span={24}>
          {isEdit ? (
            <Content />
          ) : (
            <NewCard>
              <Content />
            </NewCard>
          )}
        </Col>
      </Row>
      <NewModal
        width={1300}
        title="Харилцагчын бүртгэл"
        open={isOpenModalConsumer}
        onCancel={() => setIsOpenModalConsumer(false)}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              [`${to}`]: row.id,
            });
            setIsOpenModalConsumer(false);
          }}
        />
      </NewModal>
    </>
  );
};
export default Create;
