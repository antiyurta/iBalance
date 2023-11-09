import { App, Button, Form, Popconfirm, Table } from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FormInstance, FormListFieldData } from "antd/lib";
import type { ColumnsType } from "antd/es/table";
import * as IndexProps from "./index";
import Image from "next/image";
import {
  IDataInternal,
  IDataSale,
} from "@/service/order-distribution/entities";
import React, { ReactNode, useState } from "react";
import { formItems } from "./formItems";

const { Column } = Table;

interface IProps {
  type: IndexProps.Type;
  data: FormListFieldData[];
  form: FormInstance;
  columns: IndexProps.IOrder[];
  add: () => void;
  remove: (index: number) => void;
}

const EditableTable = (props: IProps) => {
  const { message } = App.useApp();
  const { type, data, form, columns, add, remove } = props;
  const [isNewService, setNewService] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
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
      {columns?.map((column, index) => (
        <Column
          key={index}
          title={column.label}
          render={(text, row, index) => (
            <Form.Item
              name={[index, column.name]}
              rules={[
                {
                  required: column.required,
                  message: `${column.label} заавал`,
                },
              ]}
            >
              {formItems({
                disabled: column.disabled
                  ? column.disabled
                  : !(index === editingIndex),
                type: column.type,
                options: column.options,
              })}
            </Form.Item>
          )}
        />
      ))}
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
  );
};
export default EditableTable;
