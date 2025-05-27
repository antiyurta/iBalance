import { App, Button, Form, Popconfirm, Space, Table } from "antd";
import { FormInstance, FormListFieldData } from "antd/lib";
import Image from "next/image";
import React, { useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber } from "@/components/input";
import { MaterialSelect } from "@/components/material-select";
import { IDataBookingMaterial } from "@/service/booking/booking-material/entities";
import { IParamMaterial } from "@/service/material/entities";

interface IProps {
  params: IParamMaterial;
  isFormAdd: boolean;
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableOrder = (props: IProps) => {
  const { params, isFormAdd, data, form, add, remove } = props;
  const { message } = App.useApp();
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>();
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
        ["bookingMaterials", editingIndex, "materialId"],
        ["bookingMaterials", editingIndex, "quantity"],
      ])
      .then(() => {
        if (editingIndex !== undefined) {
          const quantity = form.getFieldValue([
            "bookingMaterials",
            editingIndex,
            "quantity",
          ]);
          const unitAmount = form.getFieldValue([
            "bookingMaterials",
            editingIndex,
            "unitAmount",
          ]);
          const discountAmount = form.getFieldValue([
            "bookingMaterials",
            editingIndex,
            "unitDiscountAmount",
          ]);
          form.setFieldsValue({
            bookingMaterials: {
              [editingIndex]: {
                amount: quantity * unitAmount,
                discountAmount: quantity * discountAmount,
              },
            },
          });
        }
        setNewService(false);
        setEditingIndex(undefined);
        const bookingMaterials = form.getFieldValue("bookingMaterials") || [];
        const totalAmount = bookingMaterials.reduce(
          (sum: number, bookingMaterial: IDataBookingMaterial) =>
            sum + (bookingMaterial.amount || 0),
          0
        );
        const materialDiscountAmount = bookingMaterials.reduce(
          (sum: number, bookingMaterial: IDataBookingMaterial) =>
            sum + (bookingMaterial.discountAmount || 0),
          0
        );
        form.setFieldsValue({
          totalAmount,
          materialDiscountAmount,
          consumerDiscountAmount: 0,
          payAmount: totalAmount - materialDiscountAmount,
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
  const onRemove = (index: number) => {
    // const amount = form.getFieldValue(["accounts", index, "amount"]);
    // const limitAmount = form.getFieldValue("amount");
    // form.setFieldValue("amount", limitAmount - amount);
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
  const Footer = () => (
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
  return (
    <>
      <Table dataSource={data} footer={isFormAdd ? Footer : undefined}>
        <Column
          title="Дотоод код"
          dataIndex={"code"}
          render={(_, __, index) => (
            <MaterialSelect
              params={params}
              form={form}
              rules={[{ required: true, message: "Дотоод код заавал" }]}
              name={[index, "materialId"]}
              listName="test"
              disabled={!(index === editingIndex)}
              onClear={() => {
                form.resetFields([
                  ["bookingMaterials", index, "name"],
                  ["bookingMaterials", index, "measurement"],
                  ["bookingMaterials", index, "countPackage"],
                  ["bookingMaterials", index, "lastQty"],
                  ["bookingMaterials", index, "unitAmount"],
                  ["bookingMaterials", index, "quantity"],
                  ["bookingMaterials", index, "amount"],
                  ["bookingMaterials", index, "discountAmount"],
                ]);
              }}
              onSelect={(value) => {
                form.setFieldsValue({
                  bookingMaterials: {
                    [index]: {
                      name: value.name,
                      measurement: value.measurement.name,
                      countPackage: value.countPackage,
                      lastQty: 0,
                      unitAmount: 0,
                      unitDiscountAmount: 0,
                      quantity: 1,
                      amount: 0,
                      discountAmount: 0,
                    },
                  },
                });
              }}
            />
          )}
        />
        <Column
          title="Бараа материалын нэр"
          dataIndex={"name"}
          render={(_, __, index) => (
            <Form.Item name={[index, "name"]}>
              <NewInput disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Хэмжих нэгж"
          dataIndex={"measurement"}
          render={(_, __, index) => (
            <Form.Item name={[index, "measurement"]}>
              <NewInput disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Багц доторх тоо"
          dataIndex={"countPackage"}
          render={(_, __, index) => (
            <Form.Item name={[index, "countPackage"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Агуулахын үлдэгдэл"
          dataIndex={"lastQty"}
          render={(_, __, index) => (
            <Form.Item name={[index, "lastQty"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Нэгж үнэ /захиалга/"
          dataIndex={"unitAmount"}
          render={(_, __, index) => (
            <>
              <Form.Item name={[index, "unitAmount"]}>
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item name={[index, "unitDiscountAmount"]} hidden>
                <NewInputNumber disabled />
              </Form.Item>
            </>
          )}
        />
        <Column
          title="Тоо хэмжээ /захиалга/"
          dataIndex={"quantity"}
          render={(_, __, index) => (
            <Form.Item name={[index, "quantity"]}>
              <NewInputNumber disabled={!(index === editingIndex)} />
            </Form.Item>
          )}
        />
        <Column
          title="Дүн /захиалга/"
          dataIndex={"amount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "amount"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Бараа үйлчилгээний хөнгөлөлт/захиалга/"
          dataIndex={"discountAmount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "discountAmount"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title={" "}
          width={110}
          render={(_, __, index) => {
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
    </>
  );
};
export default EditableTableOrder;
