"use client";

import {
  NewInput,
  NewInputNumber,
  NewOption,
  NewSearch,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { AutoComplete, Form, Input, Popover, Space, Tabs, message } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
//hariltsagchin jagsaalt
import CustomerList from "./customerList";
// delgerengu jagsaalt
import DescriptionList from "./descriptionList";
import NewModal from "@/components/modal";
import Information from "../information/information";
import NewDirectoryTree from "@/components/directoryTree";
import {
  IDataConsumerSection,
  TreeSectionType,
} from "@/service/consumer/section/entities";
import EditableTableLimit from "./editableTableLimit";
import { IDataConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import { ConsumerSectionService } from "@/service/consumer/section/service";
import { parseNumber } from "@/feature/common";
import { IDataLimitOfLoansAccount } from "@/service/limit-of-loans/account/entities";
import { limitOfLoansAccountService } from "@/service/limit-of-loans/account/service";
import {
  IDataLimitOfLoans,
  IDataLimitOfLoansPost,
} from "@/service/limit-of-loans/entities";
import { limitOfLoansService } from "@/service/limit-of-loans/service";

type IAccounts = {
  code: string;
  name: string;
  accountId: number;
  amount: number;
};

type IForm = {
  code: number | string;
  name: string;
  sectionId: number;
  isAccount: boolean;
  isClose: boolean;
  limitAmount: number;
  lendLimitAccounts: IAccounts[] | null;
};

const LimitOfLoans = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [isAccounts, setIsAccounts] = useState<boolean>(false);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [sections, setSections] = useState<IDataConsumerSection[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataLimitOfLoans>();
  const [selectedConsumer, setSelectedConsumer] = useState<
    IDataConsumer | undefined
  >();
  const items = [
    {
      label: "Харилцагчийн жагсаалт",
      key: "item-1",
      children: (
        <CustomerList
          onReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
          onDelete={(id) => {
            console.log(id);
          }}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <DescriptionList />,
    },
  ];
  const openModal = (state: boolean, row?: IDataLimitOfLoans) => {
    setIsReloadList(false);
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      if (row) {
        form.resetFields();
        const data: IForm = {
          code: row.consumer.code,
          name: row.consumer.name,
          sectionId: row.consumer.sectionId,
          isAccount: row.isAccount,
          isClose: row.isClose,
          limitAmount: row.limitAmount,
          lendLimitAccounts: row.lendLimitAccounts?.map((lendLimit) => {
            return {
              code: lendLimit.account.code,
              name: lendLimit.account.name,
              accountId: lendLimit.accountId,
              amount: lendLimit.amount,
            };
          }),
        };
        getConsumerByCode(data.code);
        form.setFieldsValue(data);
        setIsAccounts(row.isAccount);
        setSelectedRow(row);
      }
    }
    setIsOpenModal(true);
  };
  const getConsumerByCode = async (code: number | string) => {
    if (!code) {
      message.error("Код заавал оруулж хайх");
    } else {
      await ConsumerService.get({
        queries: [
          {
            param: "code",
            operator: "CONTAINS",
            value: code.toString(),
          },
        ],
      }).then((response) => {
        if (response.success) {
          if (response.response.data.length === 0) {
            message.warning("Хайсан утгаар дата алга");
            form.setFieldsValue({
              code: undefined,
              name: undefined,
              sectionId: undefined,
            });
            setConsumers([]);
          } else {
            setConsumers(response.response.data);
          }
        }
      });
    }
  };
  const getConsumerSections = async () => {
    await ConsumerSectionService.get(TreeSectionType.Consumer).then(
      (response) => {
        if (response.success) {
          setSections(response.response);
        }
      }
    );
  };
  const onFinish = async (values: IForm) => {
    const data: IDataLimitOfLoansPost = {
      consumerId: consumers?.find((consumer) => consumer.code === values.code)
        ?.id,
      limitAmount: values.limitAmount,
      isAccount: values.isAccount,
      isClose: values.isClose,
      accounts: values.lendLimitAccounts || [],
    };
    if (editMode) {
      console.log(data);
      await limitOfLoansService
        .patch(selectedRow?.id, data)
        .then((response) => {
          console.log(response);
        });
    } else {
      await limitOfLoansService.post(data).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(true);
        }
      });
    }
  };
  useEffect(() => {
    getConsumerSections();
  }, []);
  useEffect(() => {
    if (!isAccounts) {
      form.resetFields(["accounts"]);
    }
  }, [isAccounts]);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Зээлийн лимит</p>
            <button className="app-button" onClick={() => openModal(false)}>
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Зээлийн лимит оруулах
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
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </div>
      <NewModal
        title="Харилцагчийн зээлийн лимит"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isAccount: false,
            isClose: false,
          }}
        >
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
                      onChange={(id) => {
                        console.log(id);
                      }}
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
                        onChange={(e) => console.log(e)}
                        enterButton={false}
                        placeholder="Хайх"
                        onSearch={(e: any) => {
                          getConsumerByCode(e);
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
                label="Харилцагчид олгох нийт лимит"
                name="limitAmount"
                rules={[
                  {
                    required: !isAccounts,
                    message: "Заавал",
                  },
                ]}
              >
                <NewInputNumber
                  disabled={isAccounts}
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
            <div className="switches-col">
              <Form.Item
                label="Зээлийн лимитыг дансаар тохируулах эсэх"
                name="isAccount"
                valuePropName="checked"
              >
                <NewSwitch
                  onChange={(e: boolean) => {
                    setIsAccounts(e);
                    form.setFieldsValue({
                      amount: 0,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Захиалга хаах эсэх"
                name="isClose"
                valuePropName="checked"
              >
                <NewSwitch />
              </Form.Item>
              <Form.Item
                label="Идэвхтэй эсэх"
                name="isActive"
                valuePropName="checked"
              >
                <NewSwitch disabled />
              </Form.Item>
            </div>
            {isAccounts ? (
              <Form.List name="lendLimitAccounts">
                {(accounts, { add, remove }) => (
                  <EditableTableLimit
                    data={accounts}
                    form={form}
                    editMode={editMode}
                    add={add}
                    remove={remove}
                  />
                )}
              </Form.List>
            ) : null}
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
export default LimitOfLoans;
