import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { App, Button, Form, Popconfirm, Space, Table } from "antd";
import type { FormListFieldData } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import { FormInstance } from "antd/lib";
import NewModal from "@/components/modal";
import ReceivableAccount from "../receivable-account/receivableAccount";
import { referenceAccountService } from "@/service/reference/account/service";
import {
  IDataReferenceAccount,
  IParamReferenceAccount,
} from "@/service/reference/account/entities";
import { IDataLimitOfLoansAccount } from "@/service/limit-of-loans/account/entities";
interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

function EditableTableLimit(props: IProps) {
  const { message } = App.useApp();
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
        ["accounts", editingIndex, "name"],
        ["accounts", editingIndex, "amount"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        const amounts = form
          .getFieldValue("accounts")
          ?.reduce(
            (sum: number, account: IDataLimitOfLoansAccount) =>
              (sum += account.amount),
            0
          );
        form.setFieldsValue({
          limitAmount: amounts,
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
  const onCancel = (index: number) => {
    if (isNewService) {
      remove(index);
    } else {
      form.resetFields([
        ["accounts", index, "accountId"],
        ["accounts", index, "name"],
        ["accounts", index, "amount"],
      ]);
    }
    setNewService(false);
    setEditingIndex(undefined);
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
  useEffect(() => {
    getAccounts({});
  }, []);
  return (
    <>
      <Table
        locale={{
          emptyText: <>Дата байхгүй</>,
        }}
        dataSource={data}
        pagination={false}
        footer={() => {
          return (
            <div
              className="button-editable-footer"
              onClick={() => addService()}
            >
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
          dataIndex={"accountId"}
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
                    name={[index, "accountId"]}
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
                      disabled={!(index === editingIndex)}
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
                <NewInput disabled placeholder="Дансны нэр" min={0} max={150} />
              </Form.Item>
            );
          }}
        />
        <Column
          dataIndex={"amount"}
          title={"Зээлийн лимит /дансаарх/"}
          render={(value, row, index) => {
            return (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Зээлийн лимит /дансаарх/ заавал",
                  },
                ]}
                name={[index, "amount"]}
              >
                <NewInputNumber
                  style={{ width: "100%" }}
                  prefix={"₮ "}
                  formatter={(value: any) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  disabled={!(index === editingIndex)}
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
      <NewModal
        title="Данс жагсаалт"
        open={isOpenPopover}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <ReceivableAccount
          ComponentType="MIDDLE"
          onClickModal={(row) => {
            form.setFieldsValue({
              ["accounts"]: {
                [`${editingIndex}`]: {
                  accountId: row.id,
                  code: row.code,
                  name: row.name,
                },
              },
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </>
  );
}
export default EditableTableLimit;
