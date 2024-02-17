"use client";
import {
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { App, Col, Form, Row, Tabs } from "antd";
import { useContext, useEffect, useState } from "react";
//hariltsagchin jagsaalt
import CustomerList from "./customerList";
// delgerengu jagsaalt
import DescriptionList from "./descriptionList";
import NewModal from "@/components/modal";
import Information from "../information/information";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import EditableTableLimit from "./editableTableLimit";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import {
  IDataLimitOfLoans,
  IInputLimitOfLoans,
} from "@/service/limit-of-loans/entities";
import { limitOfLoansService } from "@/service/limit-of-loans/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { openNofi } from "@/feature/common";
import PageTitle from "@/components/page-title";
import { ConsumerSelect } from "@/components/consumer-select";

const LimitOfLoans = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [isAccounts, setIsAccounts] = useState<boolean>(false);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataLimitOfLoans>();
  const onDelete = async (id: number) => {
    blockContext.block();
    setIsReloadList(false);
    await limitOfLoansService
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
  const openModal = (state: boolean, row?: IDataLimitOfLoans) => {
    setEditMode(state);
    form.resetFields();
    if (state && row) {
      console.log(row);
      setIsAccounts(row.isAccount);
      const data: IInputLimitOfLoans = {
        consumerId: row.consumerId,
        name: row.consumer.name,
        sectionId: row.consumer.sectionId,
        limitAmount: row.limitAmount,
        isAccount: row.isAccount,
        isClose: row.isClose,
        isActive: row.consumer.isActive,
        accounts: row.accounts.map((account) => ({
          accountId: account.account.id,
          name: account.account.name,
          amount: account.amount,
        })),
      };
      form.setFieldsValue(data);
      setSelectedRow(row);
    }
    setIsOpenModal(true);
  };
  const getTreeSections = async () => {
    await TreeSectionService.get(TreeSectionType.Consumer).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  // const consumerFormField = async (id: number) => {
  //   blockContext.block();
  //   data
  //   await ConsumerService.get({ ids: [id], isLendLimit: true })
  //     .then((response) => {
  //       if (response.response.data.length > 0) {
  //         openNofi(
  //           "error",
  //           `${response.response.data[0].code} кодтой харилцагч бүртгэлтэй байна`
  //         );
  //         form.setFieldsValue({
  //           consumerId: "",
  //         });
  //       } else {
  //         if (consumer) {
  //           form.setFieldsValue({
  //             consumerId: consumer.id,
  //             name: consumer.name,
  //             sectionId: consumer.sectionId,
  //             isActive: consumer.isActive,
  //           });
  //         }
  //       }
  //     })
  //     .finally(() => {
  //       blockContext.unblock();
  //     });
  // };
  const onFinish = async (values: IInputLimitOfLoans) => {
    if (editMode && selectedRow) {
      await limitOfLoansService
        .patch(selectedRow?.id, values)
        .then((response) => {
          if (response.success) {
            setIsOpenModal(false);
            setIsReloadList(true);
          }
        });
    } else {
      await limitOfLoansService.post(values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(true);
        }
      });
    }
  };
  const items = [
    {
      label: "Харилцагчийн жагсаалт",
      key: "item-1",
      children: (
        <CustomerList
          onReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
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
          onEdit={(row) => openModal(true, row)}
        />
      ),
    },
  ];
  useEffect(() => {
    getTreeSections();
  }, []);
  useEffect(() => {
    if (!isAccounts) {
      form.resetFields(["accounts"]);
    }
  }, [isAccounts]);
  return (
    <div>
      <PageTitle onClick={() => openModal(false)} />
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
      <NewModal
        title="Харилцагчийн зээлийн лимит"
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
          setIsAccounts(false);
        }}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={900}
        okText="Хадгалах"
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
                <ConsumerSelect
                  form={form}
                  rules={[
                    {
                      required: true,
                      message: "Харилцагчийн код заавал",
                    },
                  ]}
                  name={"consumerId"}
                  onClear={() => {
                    form.resetFields([["name"], ["sectionId"], ["isActive"]]);
                  }}
                  // onSelect={(row) => consumerFormField(row.id)}
                />
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
                <NewInput placeholder="Харилцагчийн нэр" disabled />
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
                  placeholder="Харилцагчийн бүлэг"
                />
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
                  className="numberValue-to-right"
                  style={{ width: "100%", color: "red" }}
                  addonAfter="₮"
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Харилцагчид олгох нийт лимит"
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
              <Form.List name="accounts">
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
    </div>
  );
};
export default LimitOfLoans;
