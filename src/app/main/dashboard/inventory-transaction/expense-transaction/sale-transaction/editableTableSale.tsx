import Image from "next/image";
import { App, Button, Form, FormInstance, Popconfirm, Table } from "antd";
import { Column } from "@/components/table";
import { NewInput, NewInputNumber } from "@/components/input";
import { FormListFieldData } from "antd/lib";
import { Fragment, useEffect, useState } from "react";
import { MaterialSelect } from "@/components/material-select";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { MaterialType } from "@/service/material/entities";
import { IDataDiscount } from "@/service/command/discount/entities";
import { IDataTransaction } from "@/service/document/transaction/entities";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}
export const EditableTableSale = (props: IProps) => {
  const { message } = App.useApp();
  const { data, form, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const [quantity, setQuantity] = useState<number>(1);
  const [discountDictionary, setDiscountDictionary] =
    useState<Map<number, IDataDiscount>>();
  const onSave = async () => {
    return form
      .validateFields([
        ["transactions"],
        ["transactions", editingIndex, "materialId"],
        ["transactions", editingIndex, "name"],
        ["transactions", editingIndex, "countPackage"],
        ["transactions", editingIndex, "quantity"],
        ["transactions", editingIndex, "endAt"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        const transactions = form.getFieldValue("transactions") || [];
        const amount = transactions.reduce(
          (sum: number, transaction: IDataTransaction) =>
            sum + (transaction.amount || 0),
          0
        );
        const discountAmount = transactions.reduce(
          (sum: number, transaction: IDataTransaction) =>
            sum + (transaction.discountAmount || 0),
          0
        );
        form.setFieldsValue({
          amount,
          discountAmount,
          payAmount: amount - discountAmount,
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
  const addService = () => {
    onSave().then((state) => {
      if (state) {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      }
    });
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
  const onRemove = (index: number) => {
    const amount = form.getFieldValue(["accounts", index, "amount"]);
    const limitAmount = form.getFieldValue("amount");
    form.setFieldValue("amount", limitAmount - amount);
    remove(index);
  };
  const getDiscountAmount = (
    unitAmount: number,
    quantity: number,
    discount: IDataDiscount
  ) => {
    if (discount) {
      const amount = unitAmount * quantity;
      if (discount.percent > 0) {
        return (amount * discount.percent) / 100;
      } else if (discount.amount > 0) {
        return discount.amount * quantity;
      }
    }
  };
  useEffect(() => {
    if (editingIndex !== undefined) {
      const unitAmount = form.getFieldValue([
        "transactions",
        editingIndex,
        "unitAmount",
      ]);
      const discount = discountDictionary?.get(editingIndex);
      if (discount) {
        const discountAmount = getDiscountAmount(
          unitAmount,
          quantity,
          discount
        );
        form.setFieldsValue({
          transactions: {
            [editingIndex]: {
              amount: unitAmount * quantity,
              discountAmount: discountAmount,
            },
          },
        });
      }
    }
  }, [quantity, editingIndex]);
  return (
    <Table
      dataSource={data}
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
        dataIndex={"materialId"}
        title="Дотоод код"
        render={(_, __, index) => (
          <MaterialSelect
            params={{ types: [MaterialType.Material] }}
            form={form}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
            name={[index, "materialId"]}
            disabled={!(index === editingIndex)}
            listName="transactions"
            onClear={() => {
              form.resetFields([
                ["transactions", index, "name"],
                ["transactions", index, "measurement"],
                ["transactions", index, "countPackage"],
                ["transactions", index, "unitAmount"],
              ]);
            }}
            onSelect={(value) => {
              let discountAmount = 0;
              if (value.discount) {
                if (value.discount.isPercent)
                  discountAmount = value.discount.percent;
                else discountAmount = value.discount.amount;
                setDiscountDictionary(
                  new Map(discountDictionary).set(index, value.discount)
                );
              }
              form.setFieldsValue({
                transactions: {
                  [index]: {
                    name: value.name,
                    measurement: value.measurementName,
                    countPackage: value.countPackage,
                    unitAmount: value.unitAmount,
                    amount: value.unitAmount,
                    quantity: 1,
                    discountAmount: getDiscountAmount(
                      value.unitAmount,
                      1,
                      value.discount
                    ),
                  },
                },
              });
            }}
          />
        )}
      />
      <Column
        dataIndex={"name"}
        title="Бараа материалын нэр"
        render={(_, __, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"measurement"}
        title="Хэмжих нэгж"
        render={(_, __, index) => (
          <Form.Item name={[index, "measurement"]}>
            <NewInput disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title="Багц доторх тоо"
        render={(_, __, index) => (
          <Form.Item name={[index, "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"countPackage"}
        title="Агуулахын үлдэгдэл"
        render={(_, __, index) => (
          <Form.Item name={[index, "countPackage"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"unitAmount"}
        title="Нэгжийн үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "unitAmount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"quantity"}
        title="Борлуулах тоо хэмжээ"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Борлуулах тоо хэмжээ заавал" }]}
          >
            <NewInputNumber
              disabled={!(index === editingIndex)}
              value={quantity}
              onChange={(value) => setQuantity(Number(value))}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"amount"}
        title="Нийт үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "amount"]}>
            <NewInputNumber disabled />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"discountAmount"}
        title="Бараа материалын үнийн хөнгөлөлт"
        render={(_, __, index) => (
          <Form.Item name={[index, "discountAmount"]}>
            <NewInputNumber disabled suffix="₮" />
          </Form.Item>
        )}
      />
      {/* Засах устгах хэсэг */}
      <Column
        title={" "}
        width={110}
        render={(_, __, index) => {
          if (index === editingIndex) {
            return (
              <Fragment>
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
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <Button
                  icon={<EditOutlined />}
                  shape={"circle"}
                  style={{ marginRight: 8 }}
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
                  />
                </Popconfirm>
              </Fragment>
            );
          }
        }}
      />
    </Table>
  );
};
