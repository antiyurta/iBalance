"use client";

import CustomerList from "./customerList";
import DescriptionList from "./descriptionList";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { openNofi } from "@/feature/common";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { Button, Col, Form, Input, Row, Space, Tabs, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import EditableTable from "./editableTable";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { initialBalanceService } from "@/service/consumer/initial-balance/service";
import Information from "../information/information";
import { IDataInitialBalance } from "@/service/consumer/initial-balance/entities";
import { ConsumerService } from "@/service/consumer/service";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;

type IAccounts = {
  accountId: number;
  amount: number;
  date: Dayjs;
  name: string;
};

type IForm = {
  accounts?: IAccounts[];
  amount: number;
  consumerId: number;
  name: string;
  sectionId: number;
};

const BeginningBalance = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedBalance, setSelectedBalance] = useState<IDataInitialBalance>();
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [consumerDictionary, setConsumerDictionary] =
    useState<Map<number, IDataConsumer>>();
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const onDelete = async (id: number) => {
    blockContext.block();
    setIsReloadList(false);
    await initialBalanceService
      .remove(id)
      .then((response) => {
        if (response.success) {
          setIsReloadList(true);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getTreeSections = async () => {
    await TreeSectionService.get(TreeSectionType.Consumer).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  const onFinish = async (values: IForm) => {
    if (editMode && selectedBalance) {
      await initialBalanceService
        .patch(selectedBalance.id, values)
        .then((response) => {
          if (response.success) {
            setIsOpenModal(false);
            setIsReloadList(!isReloadList);
          }
        });
    } else {
      await initialBalanceService.post(values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(!isReloadList);
        }
      });
    }
  };
  //
  const openModal = (state: boolean, balance?: IDataInitialBalance) => {
    setIsReloadList(false);
    setEditMode(state);
    form.resetFields();
    getConsumers({});
    if (state && balance) {
      setSelectedBalance(balance);
      form.setFieldsValue({
        name: balance.consumer.name,
        sectionId: balance.consumer.sectionId,
        amount: balance.amount,
        consumerId: balance.consumerId,
        accounts: balance.accounts.map((account) => ({
          id: account.id,
          accountId: account.accountId,
          name: account.account.name,
          date: dayjs(account.date),
          amount: account.amount,
        })),
      });
    }
    setIsOpenModal(true);
  };
  const consumerFormField = async (id: number) => {
    blockContext.block();
    await ConsumerService.get({ ids: [id], initialBalances: true })
      .then((response) => {
        if (response.response.data.length > 0) {
          openNofi(
            "error",
            `${response.response.data[0].code} кодтой харилцагч бүртгэлтэй байна`
          );
          form.setFieldsValue({
            consumerId: "",
          });
        } else {
          const consumer = consumerDictionary?.get(id);
          if (consumer) {
            form.setFieldsValue({
              name: consumer.name,
              lastName: consumer.lastName,
              sectionId: consumer.sectionId,
            });
          }
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        const data = response.response.data;
        setConsumers(response.response.data);
        setConsumerDictionary(
          data.reduce((dict, consumer) => {
            dict.set(consumer.id, consumer);
            return dict;
          }, new Map<number, IDataConsumer>())
        );
      }
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
            openModal(true, row);
          }}
          onDelete={onDelete}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: (
        <DescriptionList
          onReload={isReloadList}
          onEdit={async (row) => {
            await initialBalanceService
              .getById(row.balanceId)
              .then((response) => {
                openModal(true, response.response);
              });
          }}
        />
      ),
    },
  ];
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
                openModal(false);
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
        okText="Хадгалах"
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
                  <div
                    className="extraButton"
                    onClick={() => setIsOpenPopOver(true)}
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
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={consumers?.map((consumer) => ({
                        value: consumer.id,
                        label: consumer.code,
                      }))}
                      onClear={() => {
                        form.resetFields(["name", "sectionId"]);
                      }}
                      onSelect={consumerFormField}
                    />
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
                <NewSelect
                  disabled
                  options={sections?.map((section) => ({
                    value: section.id,
                    label: section.name,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Эхний үлдэгдэл" name="amount">
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
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              consumerId: row.id,
              name: row.name,
              sectionId: row.sectionId,
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </div>
  );
};
export default BeginningBalance;
