import { App, Button, Form, Popconfirm, Space, Table } from "antd";
import { FormInstance, FormListFieldData } from "antd/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NewInput, NewInputNumber, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import InventoriesRegistration from "@/app/main/dashboard/registration/inventory/inventories-registration/inventoriesRegistration";
import { IDataMaterial, MaterialType } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { IDataUnitOfMeasure } from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { MaterialSelect } from "@/components/material-select";

interface IProps {
  isFormAdd: boolean;
  data: FormListFieldData[];
  form: FormInstance;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableOrder = (props: IProps) => {
  const { isFormAdd, data, form, add, remove } = props;
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
        // ["discounts", editingIndex, "materialId"],
        // ["discounts", editingIndex, "endAt"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
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
  //
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
              materialTypes={[MaterialType.Material]}
              form={form}
              rules={[{ required: true, message: "Дотоод код заавал" }]}
              name={[index, "materialId"]}
              listName="test"
              disabled={!(index === editingIndex)}
              onClear={() => {
                form.resetFields([
                  ["test", index, "name"],
                  ["test", index, "measurement"],
                  ["test", index, "countPackage"],
                ]);
              }}
              onSelect={(value) => {
                form.setFieldsValue({
                  test: {
                    [index]: {
                      name: value.name,
                      measurement: value.measurementName,
                      countPackage: value.countPackage,
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
          dataIndex={"balance"}
          render={(_, __, index) => (
            <Form.Item name={[index, "balance"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Тоо хэмжээ /захиалга/"
          dataIndex={"order_quantity"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_quantity"]}>
              <NewInputNumber disabled={!(index === editingIndex)} />
            </Form.Item>
          )}
        />
        <Column
          title="Нэгж үнэ /захиалга/"
          dataIndex={"order_price"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_price"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Дүн /захиалга/"
          dataIndex={"order_amount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_amount"]}>
              <NewInputNumber disabled />
            </Form.Item>
          )}
        />
        <Column
          title="Бараа үйлчилгээний хөнгөлөлт/захиалга/"
          dataIndex={"order_discount"}
          render={(_, __, index) => (
            <Form.Item name={[index, "order_discount"]}>
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
