import { useEffect, useState } from "react";
//components
import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import mnMN from "antd/es/calendar/locale/mn_MN";
import EditableTableOrder from "./editableTableOrder";
import Image from "next/image";
import NewCard from "@/components/Card";

// service
import { StorageSerivce } from "@/service/material/storage/service";
import { ConsumerService } from "@/service/consumer/service";

// entity
import { IDataStorage } from "@/service/material/storage/entities";
import { IDataConsumer } from "@/service/consumer/entities";
import NewModal from "@/components/modal";
import Information from "../../registration/customer/information/information";
import { TabType } from "./page";

interface IProps {
  type: TabType;
  isEdit: boolean;
  isFormAdd: boolean;
}

const CreateOrder = (props: IProps) => {
  const { type, isEdit, isFormAdd } = props;
  const [form] = Form.useForm();
  const [isOpenModalConsumer, setIsOpenModalConsumer] =
    useState<boolean>(false);
  const [storagies, setStoragies] = useState<IDataStorage[]>([]);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const FormItems = () => {
    switch (type) {
      case TabType.CREATE_ORDER:
        return (
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: `repeat(4, minmax(0,1fr))`,
            }}
          >
            <Form.Item label="Захиалгын ID" name="order_id">
              <NewInput disabled />
            </Form.Item>
            <Form.Item
              label="Огноо"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Огноо заавал",
                },
              ]}
            >
              <NewDatePicker
                style={{
                  width: "100%",
                }}
                format={"YYYY-MM-DD"}
                locale={mnMN}
              />
            </Form.Item>
            <Form.Item label="Зарлагын байршил" name="order_storage">
              <NewSelect
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, label) =>
                  (label?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={storagies?.map((storage) => ({
                  label: storage.name,
                  value: storage.id,
                }))}
              />
            </Form.Item>
            <Form.Item label="Харилцагчийн нэр">
              <Space.Compact>
                <div
                  className="extraButton"
                  onClick={() => setIsOpenModalConsumer(true)}
                >
                  <Image
                    src="/icons/clipboardBlack.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </div>
                <Form.Item name="consumerId">
                  <NewSelect
                    allowClear
                    showSearch
                    virtual={false}
                    optionFilterProp="children"
                    filterOption={(input, label) =>
                      (label?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={consumers?.map((consumer) => ({
                      label: consumer.name,
                      value: consumer.id,
                    }))}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
            <Form.Item label="Нийт дүн" name="total">
              <NewInputNumber disabled />
            </Form.Item>
            <Form.Item label="Бараа үйлчилгээний хөнгөлөлт" name="discount">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Харилцагчийн хөнгөлөлт" name="discount_consumer">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Төлөх дүн" name="paid_amount">
              <NewInputNumber disabled />
            </Form.Item>
          </div>
        );
      case TabType.DISTRIBUTION:
        return (
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: `repeat(4, minmax(0,1fr))`,
            }}
          >
            <Form.Item label="Захиалгын ID" name="order_id">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Баримтын төлөв" name="status">
              <NewSelect
                disabled
                options={[
                  {
                    label: (
                      <span
                        style={{
                          color: "blue",
                        }}
                      >
                        Захиалга
                      </span>
                    ),
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Захиалга өгсөн огноо"
              name="order_date"
              rules={[
                {
                  required: false,
                  message: "Захиалга өгсөн заавал",
                },
              ]}
            >
              <NewDatePicker
                disabled
                style={{
                  width: "100%",
                }}
                format={"YYYY-MM-DD"}
                locale={mnMN}
              />
            </Form.Item>
            <Form.Item label="Захиалга өгсөн хэрэглэгч" name="order_consumer">
              <NewSelect
                disabled
                options={consumers?.map((consumer) => ({
                  label: consumer.name,
                  value: consumer.id,
                }))}
              />
            </Form.Item>
            <Form.Item label="Нийт дүн" name="total">
              <NewInputNumber disabled />
            </Form.Item>
            <Form.Item label="Бараа үйлчилгээний хөнгөлөлт" name="discount">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Харилцагчийн хөнгөлөлт" name="discount_consumer">
              <NewInput disabled />
            </Form.Item>
            <Form.Item label="Төлөх дүн" name="paid_amount">
              <NewInputNumber disabled />
            </Form.Item>
            <Form.Item
              label="Огноо"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Огноо заавал",
                },
              ]}
            >
              <NewDatePicker
                style={{
                  width: "100%",
                }}
                format={"YYYY-MM-DD"}
                locale={mnMN}
              />
            </Form.Item>
            <Form.Item label="Зарлагын байршил" name="order_storage">
              <NewSelect
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, label) =>
                  (label?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={storagies?.map((storage) => ({
                  label: storage.name,
                  value: storage.id,
                }))}
              />
            </Form.Item>
            <Form.Item label="Харилцагчийн нэр">
              <Space.Compact>
                <div
                  className="extraButton"
                  onClick={() => setIsOpenModalConsumer(true)}
                >
                  <Image
                    src="/icons/clipboardBlack.svg"
                    width={16}
                    height={16}
                    alt="clipboard"
                  />
                </div>
                <Form.Item name="consumerId">
                  <NewSelect
                    allowClear
                    showSearch
                    virtual={false}
                    optionFilterProp="children"
                    filterOption={(input, label) =>
                      (label?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={consumers?.map((consumer) => ({
                      label: consumer.name,
                      value: consumer.id,
                    }))}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </div>
        );
      default:
        return;
    }
  };
  const Content = () => (
    <Form form={form} layout="vertical">
      <div
        style={{
          display: "flex",
          gap: 12,
          flexDirection: "column",
        }}
      >
        <FormItems />
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#DEE2E6",
          }}
        />
        <Form.List name="test">
          {(items, { add, remove }) => (
            <EditableTableOrder
              isFormAdd={isFormAdd}
              data={items}
              form={form}
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
  const getStorage = async () => {
    await StorageSerivce.get().then((response) => {
      if (response.success) {
        setStoragies(response.response.data);
      }
    });
  };
  const getConsumers = async () => {
    await ConsumerService.get().then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  useEffect(() => {
    getStorage();
    getConsumers();
  }, []);
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
        footer={null}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              consumerId: row.id,
            });
            setIsOpenModalConsumer(false);
          }}
        />
      </NewModal>
    </>
  );
};
export default CreateOrder;
