import {
  AutoComplete,
  Button,
  Form,
  FormListFieldData,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FormInstance } from "antd/lib";
import Image from "next/image";
import React, { useState } from "react";
import { EditableFormItemLimit } from "../limit-of-loans/editableFormItemLimit";
import { getReceivableAccountByCode } from "@/feature/common";
import { IDataAccount } from "@/service/limit-of-loans/account/entities";
import { NewDatePicker, NewInput, NewInputNumber } from "@/components/input";
import { EditableFormItemLimitNumber } from "../limit-of-loans/editableFormItemLimitNumber";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

function EditableTable(props: IProps) {
  const { data, form, editMode, add, remove } = props;
  const [accounts, setAccounts] = useState<IDataAccount[]>([]);
  const [isOpenPopover, setIsOpenPopOver] = useState<boolean>(false);
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const addService = () => {
    form
      .validateFields([
        ["accounts", editingIndex, "code"],
        ["accounts", editingIndex, "name"],
        ["accounts", editingIndex, "amount"],
      ])
      .then(() => {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      })
      .catch((error) => {
        error.errorFields?.map((errorMsg: any) => {
          message.error(errorMsg.errors[0]);
        });
      });
  };
  return (
    <Table
      locale={{
        emptyText: <>Дата байхгүй</>,
      }}
      dataSource={data}
      pagination={false}
      footer={() => {
        return (
          <div className="button-editable-footer" onClick={() => addService()}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                placeContent: "center",
              }}
            >
              <Image
                src={"/images/AddIconBlack.svg"}
                alt="addiconblack"
                width={16}
                height={16}
              />
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "13px",
                  color: "#6C757D",
                }}
              >
                Нэмэх
              </span>
            </div>
          </div>
        );
      }}
    >
      <Column
        dataIndex={"code"}
        title={"Дансны код"}
        render={(value, row, index) => {
          return (
            <Form.Item>
              <Space.Compact>
                {index === editingIndex ? (
                  <div className="extraButton">
                    <Image
                      onClick={() => setIsOpenPopOver(true)}
                      src="/icons/clipboardBlack.svg"
                      width={16}
                      height={16}
                      alt="clipboard"
                    />
                  </div>
                ) : null}
                <EditableFormItemLimit
                  rules={[
                    {
                      required: true,
                      message: "Дансны код заавал",
                    },
                  ]}
                  name={[index, "code"]}
                  editing={index === editingIndex}
                  className={"ant-form-item-no-bottom-margin"}
                >
                  <AutoComplete
                    options={accounts?.map((account) => {
                      return {
                        label: account.code,
                        value: account.code,
                      };
                    })}
                    onSelect={(id) => {
                      const data = accounts?.find(
                        (account) => account.code === id
                      );
                      const value = form.getFieldValue("accounts");
                      form.setFieldsValue({
                        ["accounts"]: {
                          ...value,
                          [`${editingIndex}`]: {
                            accountId: data?.id,
                            code: data?.code,
                            name: data?.name,
                          },
                        },
                      });
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
                        const result = await getReceivableAccountByCode(e);
                        if (result) setAccounts(result);
                      }}
                    />
                  </AutoComplete>
                </EditableFormItemLimit>
              </Space.Compact>
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"name"}
        title={"Дансны нэр"}
        render={(value, row, index) => {
          return (
            <EditableFormItemLimit
              rules={[
                {
                  required: true,
                  message: "Дансны нэр заавал",
                },
              ]}
              name={[index, "name"]}
              editing={index === editingIndex}
              className={"ant-form-item-no-bottom-margin"}
            >
              <NewInput disabled placeholder="Дансны нэр" min={0} max={150} />
            </EditableFormItemLimit>
          );
        }}
      />
      <Column
        dataIndex={"date"}
        title={"Авлага үүссэн огноо"}
        render={(value, row, index) => {
          return (
            <EditableFormItemLimit
              rules={[
                {
                  required: true,
                  message: "Авлага үүссэн огноо заавал",
                },
              ]}
              name={[index, "date"]}
              editing={index === editingIndex}
              className={"ant-form-item-no-bottom-margin"}
            >
              <NewDatePicker format={"YYYY/MM/DD"} />
            </EditableFormItemLimit>
          );
        }}
      />
      <Column
        dataIndex={"amount"}
        title={"Дансны эхний үлдэгдэл"}
        render={(value, row, index) => {
          return (
            <EditableFormItemLimitNumber
              rules={[
                {
                  required: true,
                  message: "Дансны эхний үлдэгдэл заавал",
                },
              ]}
              name={[index, "amount"]}
              editing={index === editingIndex}
              className={"ant-form-item-no-bottom-margin"}
            >
              <NewInputNumber
                style={{ width: "100%" }}
                prefix={"₮ "}
                formatter={(value: any) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </EditableFormItemLimitNumber>
          );
        }}
      />
      <Column
        title={" "}
        width={110}
        render={(value, row, index) => {
          if (index === editingIndex) {
            return (
              <React.Fragment>
                <Button
                  icon={<SaveOutlined />}
                  shape={"circle"}
                  type={"primary"}
                  style={{ marginRight: 8 }}
                  //   onClick={onSave}
                />
                <Button
                  danger
                  icon={
                    <CloseOutlined
                      style={{
                        color: "red",
                      }}
                    />
                  }
                  shape={"circle"}
                  //   onClick={() => onCancel(index)}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <Button
                  icon={<EditOutlined />}
                  shape={"circle"}
                  style={{ marginRight: 8 }}
                  disabled={editingIndex !== undefined}
                  onClick={() => setEditingIndex(index)}
                />
                <Popconfirm
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => remove(index)}
                >
                  <Button
                    danger
                    icon={
                      <DeleteOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    }
                    shape={"circle"}
                    disabled={editingIndex !== undefined}
                  />
                </Popconfirm>
              </React.Fragment>
            );
          }
        }}
      />
    </Table>
  );
}
export default EditableTable;
