import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  FormInstance,
  FormListFieldData,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  message,
} from "antd";
import Image from "next/image";
import React, { useState } from "react";
import "dayjs/locale/mn";
import { IDataStorage } from "@/service/material/storage/entities";

interface IProps {
  data: FormListFieldData[];
  storages: IDataStorage[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;
const { Option } = Select;

const EditableTableBalance: React.FC<IProps> = (props) => {
  const { data, storages, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const addService = () => {
    form
      .validateFields([
        ["materialStorageBalances", editingIndex, "storageId"],
        ["materialStorageBalances", editingIndex, "quantity"],
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
        ["materialStorageBalances", editingIndex, "storageId"],
        ["materialStorageBalances", editingIndex, "quantity"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        if (editMode) {
          console.log("end account patch");
        }
      })
      .catch((error) => {
        console.log(error);
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
        ["materialStorageBalances", editingIndex, "storageId"],
        ["materialStorageBalances", editingIndex, "quantity"],
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
        width={50}
        dataIndex="storageId"
        title="Байршил"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "storageId"]}
            rules={[{ required: true, message: "Байршил заавал" }]}
          >
            <Select showSearch allowClear>
              {storages?.map((storage, index) => {
                return (
                  <Option key={index} value={storage.id}>
                    {storage.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        )}
      />
      <Column
        width={50}
        dataIndex="quantity"
        title="Эхний үлдэгдэл"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Эхний үлдэгдэл заавал" }]}
          >
            <InputNumber />
          </Form.Item>
        )}
      />
      <Column
        title=" "
        width={110}
        render={(value, row, index) => {
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
                  disabled={editingIndex !== undefined}
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
                    disabled={editingIndex !== undefined}
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
