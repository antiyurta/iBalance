import {
  Button,
  Form,
  FormListFieldData,
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
import React, { useEffect, useState } from "react";
import { IDataReferenceAccount } from "@/service/reference/account/entities";
import {
  NewDatePicker,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import { IParamReferenceAccount } from "@/service/reference/account/entities";
import { referenceAccountService } from "@/service/reference/account/service";

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
  const [accounts, setAccounts] = useState<IDataReferenceAccount[]>([]);
  const [isOpenPopover, setIsOpenPopOver] = useState<boolean>(false);
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [accountsDictionary, setAccountsDictionary] =
    useState<Map<number, IDataReferenceAccount>>();
  const addService = () => {
    onSave().then((state) => {
      if (state) {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      }
    });
  };
  const onSave = async () => {
    return form
      .validateFields([
        ["accounts", editingIndex, "accountId"],
        ["accounts", editingIndex, "amount"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        const amounts = form
          .getFieldValue("accounts")
          ?.reduce((sum: number, account: any) => (sum += account.amount), 0);
        form.setFieldsValue({
          amount: amounts,
        });
        return true;
      })
      .catch((error) => {
        error.errorFields?.map((errorMsg: any) => {
          message.error(errorMsg.errors[0]);
        });
        return false;
      });
  };
  const getAccounts = async (params: IParamReferenceAccount) => {
    await referenceAccountService.get(params).then((response) => {
      if (response.success) {
        const data = response.response.data;
        setAccounts(response.response.data);
        setAccountsDictionary(
          data.reduce((dict, account) => {
            dict.set(account.id, account);
            return dict;
          }, new Map<number, IDataReferenceAccount>())
        );
      }
    });
  };
  const accountFormField = (id: number) => {
    const account = accountsDictionary?.get(id);
    if (account) {
      form.setFieldsValue({
        ["accounts"]: {
          [`${editingIndex}`]: {
            accountId: account.id,
            name: account.name,
          },
        },
      });
    }
  };
  const onRemove = (index: number) => {
    const amount = form.getFieldValue(["accounts", index, "amount"]);
    const limitAmount = form.getFieldValue("amount");
    form.setFieldValue("amount", limitAmount - amount);
    remove(index);
  };
  const onCancel = (index: number) => {
    if (isNewService) {
      remove(index);
    } else {
      onSave().then((state) => {
        if (state) {
          setNewService(false);
          setEditingIndex(undefined);
        }
      });
    }
    setEditingIndex(undefined);
  };
  useEffect(() => {
    getAccounts({});
  }, []);
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
                <Form.Item
                  name={[index, "accoundId"]}
                  rules={[
                    {
                      required: true,
                      message: "Дансны код заавал",
                    },
                  ]}
                >
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
                    disabled={index === editingIndex ? false : true}
                    onClear={() => {
                      form.resetFields([
                        ["accounts", index, "name"],
                        ["accounts", index, "date"],
                        ["accounts", index, "amount"],
                      ]);
                    }}
                    options={accounts?.map((account) => ({
                      value: account.id,
                      label: account.code,
                    }))}
                    onSelect={accountFormField}
                  />
                </Form.Item>
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
            <Form.Item
              name={[index, "name"]}
              rules={[
                {
                  required: true,
                  message: "Дансны нэр заавал",
                },
              ]}
            >
              <NewInput disabled placeholder="Дансны нэр" />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"date"}
        title={"Авлага үүссэн огноо"}
        render={(value, row, index) => {
          return (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Авлага үүссэн огноо заавал",
                },
              ]}
              name={[index, "date"]}
            >
              <NewDatePicker
                disabled={index === editingIndex ? false : true}
                format={"YYYY/MM/DD"}
              />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"amount"}
        title={"Дансны эхний үлдэгдэл"}
        render={(value, row, index) => {
          return (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Дансны эхний үлдэгдэл заавал",
                },
              ]}
              name={[index, "amount"]}
            >
              <NewInputNumber
                disabled={index === editingIndex ? false : true}
                style={{ width: "100%" }}
                prefix={"₮ "}
                formatter={(value: any) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
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
                  onClick={onSave}
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
                  onClick={() => onCancel(index)}
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
                  onConfirm={() => onRemove(index)}
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
