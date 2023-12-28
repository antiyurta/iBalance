import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Form,
  FormInstance,
  FormListFieldData,
  InputNumber,
  Popconfirm,
  Select,
  Table,
} from "antd";
import Image from "next/image";
import React, { useState } from "react";
import "dayjs/locale/mn";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { NewDatePicker, NewFilterSelect } from "@/components/input";

interface IProps {
  data: FormListFieldData[];
  warehouses: IDataWarehouse[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;
const { Option } = Select;

const EditableTableBalance: React.FC<IProps> = (props) => {
  const { message } = App.useApp();
  const { data, warehouses, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const addService = () => {
    form
      .validateFields([
        "balances",
        ["balances", editingIndex, "warehouseId"],
        ["balances", editingIndex, "quantity"],
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

  const onSave = () => {
    form
      .validateFields([
        "balances",
        ["balances", editingIndex, "warehouseId"],
        ["balances", editingIndex, "purchaseAt"],
        ["balances", editingIndex, "expirationAt"],
        ["balances", editingIndex, "quantity"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        if (editMode) {
          console.log("end account patch");
        }
      })
      .catch((error) => {
        error.errorFields?.map((errorMsg: any) => {
          message.error(errorMsg.errors[0]);
        });
      });
  };

  const onCancel = (index: number) => {
    if (isNewService) {
      remove(index);
    } else {
      form.resetFields([
        ["balances", editingIndex, "warehouseId"],
        ["balances", editingIndex, "quantity"],
      ]);
    }
    setNewService(false);
    setEditingIndex(undefined);
  };
  return (
    <Table
      dataSource={data}
      pagination={false}
      footer={() => (
        <div className="button-editable-footer" onClick={addService}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              placeContent: "center",
            }}
          >
            <Image
              src="/images/AddIconBlack.svg"
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
      )}
    >
      <Column
        dataIndex="warehouseId"
        title="Байршил"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "warehouseId"]}
            rules={[{ required: true, message: "Байршил заавал" }]}
          >
            <NewFilterSelect
              options={warehouses.map((warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
              }))}
              disabled={editingIndex !== index}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="purchaseAt"
        title="Худалдан авсан огноо"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "purchaseAt"]}
            rules={[{ required: true, message: "Худалдан авсан огноо заавал" }]}
          >
            <NewDatePicker disabled={editingIndex !== index} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="expirationAt"
        title="Хугацаа дуусах огноо"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "expirationAt"]}
            rules={[{ required: true, message: "Хугацаа дуусах огноо заавал" }]}
          >
            <NewDatePicker disabled={editingIndex !== index} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="quantity"
        title="Эхний үлдэгдэл"
        render={(_, __, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Эхний үлдэгдэл заавал" }]}
          >
            <InputNumber disabled={editingIndex !== index} />
          </Form.Item>
        )}
      />
      <Column
        title=" "
        width={110}
        render={(_, __, index) => {
          if (index === editingIndex) {
            return (
              <>
                <Button
                  icon={<SaveOutlined />}
                  shape="circle"
                  type="primary"
                  style={{ marginRight: 8 }}
                  onClick={onSave}
                />
                <Button
                  danger
                  icon={<CloseOutlined style={{ color: "red" }} />}
                  shape="circle"
                  onClick={() => onCancel(index)}
                />
              </>
            );
          } else {
            return (
              <>
                <Button
                  icon={<EditOutlined />}
                  shape="circle"
                  style={{ marginRight: 8 }}
                  onClick={() => setEditingIndex(index)}
                />
                <Popconfirm
                  title="Хасах?"
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => remove(index)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    shape="circle"
                  />
                </Popconfirm>
              </>
            );
          }
        }}
      />
    </Table>
  );
};

export default EditableTableBalance;
