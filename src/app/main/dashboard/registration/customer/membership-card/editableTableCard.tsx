import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  DatePicker,
  Form,
  FormInstance,
  FormListFieldData,
  InputNumber,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IDataMembership } from "@/service/reference/membership/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import dayjs from "dayjs";
import mnMN from "antd/es/calendar/locale/mn_MN";
import "dayjs/locale/mn";
import { NewInput, NewSelect } from "@/components/input";

interface IProps {
  data: FormListFieldData[];
  warehouses: IDataWarehouse[];
  memberships: IDataMembership[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableCard: React.FC<IProps> = (props) => {
  const { message } = App.useApp();
  const { data, warehouses, memberships, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const [membershipDictionary, setMembershipDictionary] =
    useState<Map<number, IDataMembership>>();

  const addService = () => {
    onSave().then((state) => {
      if (state) {
        add();
        setEditingIndex(data.length);
        setNewService(true);
      }
    });
    form
      .validateFields([
        ["cards", editingIndex, "membershipId"],
        ["cards", editingIndex, "name"],
        ["cards", editingIndex, "amount"],
        ["cards", editingIndex, "branchId"],
        ["cards", editingIndex, "endAt"],
        ["cards", editingIndex, "isClose"],
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
  const onSave = async () => {
    return form
      .validateFields([
        ["cards", editingIndex, "membershipId"],
        ["cards", editingIndex, "name"],
        ["cards", editingIndex, "amount"],
        ["cards", editingIndex, "branchId"],
        ["cards", editingIndex, "endAt"],
        ["cards", editingIndex, "isClose"],
      ])
      .then(() => {
        setNewService(false);
        setEditingIndex(undefined);
        if (editMode) {
          console.log("end account patch");
        }
        return true;
      })
      .catch((error) => {
        console.log(error);
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
        ["cards", editingIndex, "membershipId"],
        ["cards", editingIndex, "name"],
        ["cards", editingIndex, "amount"],
        ["cards", editingIndex, "branchId"],
        ["cards", editingIndex, "endAt"],
        ["cards", editingIndex, "isClose"],
      ]);
    }
    setNewService(false);
    setEditingIndex(undefined);
  };

  useEffect(() => {
    setMembershipDictionary(
      new Map<number, IDataMembership>(
        memberships.map((membership) => [membership.id, membership])
      )
    );
  }, [memberships]);
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
        dataIndex="cardno"
        title="Картын дугаар"
        render={(value, row, index) => (
          <Form.Item name={[index, "cardno"]}>
            <NewInput disabled={!(index === editingIndex)} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="membershipId"
        title="Карт эрхийн бичгийн нэр"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "membershipId"]}
            rules={[{ required: true, message: "Картын дугаар заавал" }]}
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
              options={memberships?.map((membership) => ({
                value: membership.id,
                label: membership.name,
              }))}
              disabled={!(index === editingIndex)}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="amount"
        title="Эхний үлдэгдэл"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "amount"]}
            rules={[{ required: true, message: "Эхний үлдэгдэл заавал" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="₮ "
              formatter={(value: any) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              disabled={!(index === editingIndex)}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="warehouseId"
        title="Нээсэн салбар"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "warehouseId"]}
            rules={[{ required: true, message: "Нээсэн салбар заавал" }]}
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
              options={warehouses.map((warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
              }))}
              disabled={!(index === editingIndex)}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="endAt"
        title="Дуусах огноо"
        render={(value, row, index) => (
          <Form.Item name={[index, "endAt"]}>
            <DatePicker
              disabled={!(index === editingIndex)}
              value={value ? dayjs(value, "YYYY-MM-DD hh:mm:ss") : null}
              locale={mnMN}
            />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="isClose"
        title="Хаах эсэх"
        render={(value, row, index) => (
          <Form.Item
            valuePropName="checked"
            name={[index, "isClose"]}
            className="ant-form-item-no-bottom-margin"
          >
            <Switch disabled={!(index === editingIndex)} />
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

export default EditableTableCard;
