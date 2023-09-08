"use client";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import {
  NewInput,
  NewInputNumber,
  NewOption,
  NewSearch,
  NewSelect,
} from "@/components/input";
import NewModal from "@/components/modal";
import { getConsumerByCode } from "@/feature/common";
import { IDataConsumer } from "@/service/consumer/entities";
import {
  IDataConsumerSection,
  TreeSectionType,
} from "@/service/consumer/section/entities";
import { ConsumerSectionService } from "@/service/consumer/section/service";
import { AutoComplete, Form, Input, Space, Tabs } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditableTable from "./editableTable";
const items = [
  {
    label: "Харилцагчийн жагсаалт",
    key: "item-1",
    children: <CustomerList />,
  },
  {
    label: "Дэлгэрэнгүй жагсаалт",
    key: "item-2",
    children: <DescriptionList />,
  },
];
const BeginningBalance = () => {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [sections, setSections] = useState<IDataConsumerSection[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedConsumer, setSelectedConsumer] = useState<
    IDataConsumer | undefined
  >();
  const getConsumerSections = async () => {
    await ConsumerSectionService.get(TreeSectionType.Consumer).then(
      (response) => {
        if (response.success) {
          setSections(response.response);
        }
      }
    );
  };
  useEffect(() => {
    getConsumerSections();
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Эхний үлдэгдэл</p>
            <button
              className="app-button"
              onClick={() => {
                setIsOpenModal(true);
                form.resetFields();
              }}
            >
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Эхний үлдэгдэл
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <Tabs className="lineTop" items={items} />
      </div>
      <NewModal
        title="Эхний үлдэгдэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => console.log("sdas")}
        width={1000}
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div className="inputs-gird-4">
              <Form.Item label="Харилцагчийн код">
                <Space.Compact>
                  <div className="extraButton">
                    <Image
                      // onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                  <Form.Item
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Харилцагчийн код",
                      },
                      {
                        pattern: /^\d*(?:\.\d+)?$/,
                        message: "Зөвхөн тоо оруулах",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={consumers?.map((consumer) => {
                        return {
                          label: consumer.code,
                          value: consumer.code,
                        };
                      })}
                      onSelect={(id) => {
                        const data = consumers.find(
                          (consumer) => consumer.code === id
                        );
                        setSelectedConsumer(data);
                        form.setFieldsValue(data);
                      }}
                      className="ant-selecto-border-no"
                    >
                      <Input.Search
                        style={{
                          border: "none",
                        }}
                        enterButton={false}
                        placeholder="Хайх"
                        onSearch={async (e: any) => {
                          const result = await getConsumerByCode(e);
                          if (result?.state) {
                            setConsumers(result.data);
                          } else {
                            form.setFieldsValue({
                              code: undefined,
                              name: undefined,
                              sectionId: undefined,
                            });
                            setConsumers([]);
                          }
                        }}
                      />
                    </AutoComplete>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                label="Харилцагчийн нэр"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Харилцагчийн нэр",
                  },
                ]}
              >
                <NewInput disabled />
              </Form.Item>
              <Form.Item
                label="Харилцагчийн бүлэг"
                name="sectionId"
                rules={[
                  {
                    required: true,
                    message: "Харилцагчийн бүлэг",
                  },
                ]}
              >
                <NewSelect disabled>
                  {sections?.map((section, index) => {
                    return (
                      <NewOption key={index} value={section.id}>
                        {section.name}
                      </NewOption>
                    );
                  })}
                </NewSelect>
              </Form.Item>
              <Form.Item
                label="Эхний үлдэгдэл"
                name="limitAmount"
                rules={[
                  {
                    // required: !isAccounts,
                    message: "Заавал",
                  },
                ]}
              >
                <NewInputNumber
                  disabled
                  className="numberValue-to-right"
                  style={{ width: "100%", color: "red" }}
                  addonAfter="₮"
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
            <Form.List name="lendLimitAccounts">
              {(accounts, { add, remove }) => (
                <EditableTable
                  data={accounts}
                  form={form}
                  editMode={editMode}
                  add={add}
                  remove={remove}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default BeginningBalance;
