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
          openNofi("success", "Амжилттай", "Амжиллтай устгагдлаа");
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
    if (editMode) {
    } else {
      console.log(values);
      // await initialBalanceService.post(data).then((response) => {
      //   console.log(response);
      // });
    }
  };
  //
  const openModal = (state: boolean, balance?: IDataInitialBalance) => {
    setIsReloadList(false);
    setEditMode(state);
    form.resetFields();
    getConsumers({});
    if (state && balance) {
      // const data: IInputConsumerMembership = {
      //   consumerId: consumer.id,
      //   cards: consumer.memberships.map((card) => ({
      //     ...card,
      //     endAt: dayjs(card.endAt),
      //     name: card.membership.name,
      //   })),
      // };
      // consumerFormField(consumer.id);
      // form.setFieldsValue(data);
    }
    setIsOpenModal(true);
    // setSelectedRow(row);
  };
  const consumerFormField = (id: number) => {
    const consumer = consumerDictionary?.get(id);
    if (consumer) {
      form.setFieldsValue({
        name: consumer.name,
        lastName: consumer.lastName,
        sectionId: consumer.sectionId,
      });
    }
  };
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
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
      children: <DescriptionList />,
    },
  ];
  useEffect(() => {
    getTreeSections();
  }, []);
  useEffect(() => {
    setConsumerDictionary(
      consumers.reduce((dict, consumer) => {
        dict.set(consumer.id, consumer);
        return dict;
      }, new Map<number, IDataConsumer>())
    );
  }, [consumers]);
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
