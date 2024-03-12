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
import MaterialSearch from "@/components/material-search";
import { IDataViewMaterial } from "@/service/material/view-material/entities";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
  isEdit: boolean;
}
export const EditableTableSale = (props: IProps) => {
  const { message } = App.useApp();
  const { data, form, add, remove, isEdit } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
  const onSave = async () => {
    return form
      .validateFields([
        ["transactions"],
        ["transactions", editingIndex, "materialId"],
        ["transactions", editingIndex, "name"],
        ["transactions", editingIndex, "countPackage"],
        ["transactions", editingIndex, "expenseQty"],
        ["transactions", editingIndex, "endAt"],
      ])
      .then(() => {
        if (editingIndex !== undefined) {
          const unitAmount = form.getFieldValue([
            "transactions",
            editingIndex,
            "unitAmount",
          ]);
          const expenseQty = form.getFieldValue([
            "transactions",
            editingIndex,
            "expenseQty",
          ]);
          form.setFieldValue(
            ["transactions", editingIndex, "totalAmount"],
            unitAmount * expenseQty
          );
        }
        setNewService(false);
        setEditingIndex(undefined);
        const transactions = form.getFieldValue("transactions") || [];
        const amount: number = transactions.reduce(
          (sum: number, transaction: IDataTransaction) =>
            sum + (transaction.totalAmount || 0),
          0
        );
        const discountAmount: number = transactions.reduce(
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
    expenseQty: number,
    discount: IDataDiscount
  ) => {
    const amount = unitAmount * expenseQty;
    if (discount.percent > 0) {
      return (amount * discount.percent) / 100;
    } else if (discount.amount > 0) {
      return discount.amount * expenseQty;
    }
  };
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
          <Form.Item
            name={[index, "materialId"]}
            rules={[{ required: true, message: "Дотоод код заавал" }]}
          >
            <MaterialSearch
              params={{ types: [MaterialType.Material] }}
              isDisable={editingIndex !== index}
              isEdit={true}
              materialId={form.getFieldValue([
                "transactions",
                index,
                "materialId",
              ])}
              onMaterial={(material?: IDataViewMaterial) => {
                form.setFieldsValue({
                  transactions: {
                    [index]: {
                      materialId: material?.id,
                      name: material?.name,
                      measurement: material?.measurementName,
                      countPackage: material?.countPackage,
                      lastQty: material?.lastQty,
                      unitAmount: material?.unitAmount,
                      totalAmount: material?.unitAmount,
                      expenseQty: 1,
                      discountAmount: material?.discountAmount,
                    },
                  },
                });
              }}
            />
          </Form.Item>
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
        dataIndex={"lastQty"}
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
        dataIndex={"expenseQty"}
        title="Борлуулах тоо хэмжээ"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "expenseQty"]}
            rules={[{ required: true, message: "Борлуулах тоо хэмжээ заавал" }]}
          >
            <NewInputNumber disabled={!(index === editingIndex)} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex={"totalAmount"}
        title="Нийт үнэ"
        render={(_, __, index) => (
          <Form.Item name={[index, "totalAmount"]}>
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
