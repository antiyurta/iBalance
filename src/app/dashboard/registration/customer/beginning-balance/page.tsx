"use client";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import {
  NewInput,
  NewInputNumber,
  NewOption,
  NewSelect,
} from "@/components/input";
import NewModal from "@/components/modal";
import { getConsumerByCode, openNofi } from "@/feature/common";
import { IDataConsumer } from "@/service/consumer/entities";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import EditableTable from "./editableTable";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { initialBalanceService } from "@/service/beginning-balance/service";
import Information from "../information/information";
import dayjs from "dayjs";
import { IDataInitialBalancePost } from "@/service/beginning-balance/entities";

const { Title } = Typography;

type IAccounts = {
  code: string;
  name: string;
  date: string;
  accountId: number;
  amount: number;
};

type IForm = {
  code: number | string;
  name: string;
  sectionId: number;
  amount: number;
  accounts?: IAccounts[];
};

const BeginningBalance = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [selectedConsumer, setSelectedConsumer] = useState<
    IDataConsumer | undefined
  >();
  // const [selectedBeginningBalance, setSelectedBeginningBalace] = useState<IData
  const onDelete = async (id: number) => {
    blockContext.block();
    setIsReloadList(false);
    await initialBalanceService
      .remove(id)
      .then((response) => {
        if (response.success) {
          openNofi("success", "Амжилттай", "Амжиллтай устгагдлаа");
          setIsReloadList(true);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const items = [
    {
      label: "Харилцагчийн жагсаалт",
      key: "item-1",
      children: (
        <CustomerList
          onReload={isReloadList}
          onEdit={(row) => {
            const data: IForm = {
              code: row.consumer.code,
              name: row.consumer.name,
              sectionId: row.consumer.sectionId,
              amount: row.amount,
              accounts: row.accounts?.map((account) => {
                return {
                  code: account.account.code,
                  name: account.account.name,
                  date: account.date,
                  accountId: account.id,
                  amount: account.amount,
                };
              }),
            };
            form.setFieldsValue(data);
            setEditMode(true);
            setIsOpenModal(true);
          }}
          onDelete={onDelete}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <DescriptionList />,
    },
  ];
  const getTreeSections = async () => {
    await TreeSectionService.get(TreeSectionType.Consumer).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  const onFinish = async (values: IForm) => {
    if (editMode) {
    } else {
      console.log(consumers, values);
      console.log(
        "=-=-=-=-=-=-=-=-=->",
        consumers?.find((consumer) => consumer.code === values.code)?.id
      );
      const data: IDataInitialBalancePost = {
        consumerId: consumers?.find((consumer) => consumer.code === values.code)
          ?.id,
        accounts: values.accounts?.map((account) => {
          return {
            date: account.date,
            accountId: account.accountId,
            amount: account.amount,
          };
        }),
      };
      await initialBalanceService.post(data).then((response) => {
        console.log(response);
      });
    }
  };
  useEffect(() => {
    getTreeSections();
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>Үндсэн бүртгэл / Харилцагч / Эхний үлдэгдэл</Title>
            <Button
              type="primary"
              onClick={() => {
                setIsOpenModal(true);
                form.resetFields();
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
              Эхний үлдэгдэл
            </Button>
          </Space>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
      <NewModal
        title="Эхний үлдэгдэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={1000}
        maskClosable={false}
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
                      onClick={() => setIsOpenPopOver(true)}
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
                name="amount"
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
            <Form.List name="accounts">
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
      <NewModal
        title={" "}
        width={1300}
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <Information
          ComponentsType="MIDDLE"
          onClickModal={(row) => {
            form.setFieldsValue(row);
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default BeginningBalance;
