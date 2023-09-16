import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  FormInstance,
  FormListFieldData,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  message,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { EditableFormItemLimit } from "./editableFormItemLimit";
import { IDataMembership } from "@/service/reference/membership/entities";
import { MembershipService } from "@/service/reference/membership/service";
import { IDataBranch } from "@/service/reference/branch/entities";
import { BranchService } from "@/service/reference/branch/service";
import {
  NewInput,
  NewInputNumber,
  NewOption,
  NewSelect,
  NewDatePicker,
} from "@/components/input";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import mnMN from "antd/es/calendar/locale/mn_MN";
import "dayjs/locale/mn";

interface IProps {
  data: FormListFieldData[];
  branchs: IDataBranch[];
  memberships: IDataMembership[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;
const { Option } = Select;

const EditableTableCard: React.FC<IProps> = (props) => {
  const { data, branchs, memberships, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const [membershipDictionary, setMembershipDictionary] =
    useState<Map<number, IDataMembership>>();

  const addService = () => {
    form
      .validateFields([
        ["cards", editingIndex, "cardNo"],
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

  const onSave = () => {
    console.log(form.getFieldsValue());
    form
      .validateFields([
        ["cards", editingIndex, "cardNo"],
        ["cards", editingIndex, "name"],
        ["cards", editingIndex, "amount"],
        ["cards", editingIndex, "branchId"],
        ["cards", editingIndex, "endAt"],
        ["cards", editingIndex, "isClose"],
      ])
      .then(() => {
        console.log("end orson");
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
        ["cards", editingIndex, "cardNo"],
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

  // const getMemberships = async (cardNo: string) => {
  //   if (!cardNo) {
  //     message.error("Картын дугаар заавал оруулна уу.");
  //   } else {
  //     const response = await MembershipService.get({
  //       queries: [
  //         {
  //           param: "cardNo",
  //           operator: "CONTAINS",
  //           value: cardNo,
  //         },
  //       ],
  //     });
  //     if (response.success) {
  //       setMemberships(response.response.data);
  //       setMembershipDictionary(
  //         new Map<number, IDataMembership>(
  //           memberships.map((membership) => [membership.id, membership])
  //         )
  //       );
  //     }
  //   }
  // };

  const membershipFormField = async (id: number) => {
    const membership = membershipDictionary?.get(id);
    if (membership) {
      form.setFieldsValue({
        ["cards"]: {
          [`${editingIndex}`]: {
            name: membership.name,
          },
        },
      });
    }
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
        dataIndex="cardNo"
        title="Картын дугаар"
        render={(value, row, index) => (
          <Form.Item
            name={[index, "cardNo"]}
            rules={[{ required: true, message: "Картын дугаар заавал" }]}
          >
            <Select
              showSearch
              allowClear
              // filterOption={(input: any, option: { children: any }) => {
              //   return (option?.children.toLowerCase() ?? "").includes(input);
              // }}
              onSelect={membershipFormField}
            >
              {memberships?.map((membership, index) => {
                return (
                  <Option key={index} value={membership.id}>
                    {membership.cardNo}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        )}
      />
      <Column
        dataIndex="name"
        title="Карт эрхийн бичгийн нэр"
        render={(value, row, index) => (
          <Form.Item name={[index, "name"]}>
            <NewInput disabled />
          </Form.Item>
          // <EditableFormItemLimit
          //   name={[index, "name"]}
          //   editing={index === editingIndex}
          //   className="ant-form-item-no-bottom-margin"
          // >
          //   <NewInput disabled min={0} max={150} />
          // </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="amount"
        title="Эхний үлдэгдэл"
        render={(value, row, index) => (
          <EditableFormItemLimit
            name={[index, "amount"]}
            editing={index === editingIndex}
            className="ant-form-item-no-bottom-margin"
          >
            <NewInputNumber
              style={{ width: "100%" }}
              prefix="₮ "
              formatter={(value: any) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="branchId"
        title="Ашиглах салбар"
        render={(value, row, index) => (
          <EditableFormItemLimit
            name={[index, "branchId"]}
            editing={index === editingIndex}
            className="ant-form-item-no-bottom-margin"
          >
            <Select>
              {branchs?.map((branch, index) => {
                return (
                  <Option key={index} value={branch.id}>
                    {branch.name}
                  </Option>
                );
              })}
            </Select>
          </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="endAt"
        title="Дуусах огноо"
        render={(value, row, index) => (
          <Form.Item name={[index, "endAt"]}>
            <NewDatePicker
              disabled={index === editingIndex ? false : true}
              locale={mnMN}
            />
          </Form.Item>
          // <EditableFormItemLimit
          //   name={[index, "endAt"]}
          //   editing={index === editingIndex}
          //   className="ant-form-item-no-bottom-margin"
          //   getValueFromEvent={(onChange) =>
          //     dayjs(onChange).format("YYYY-MM-DD")
          //   }
          //   // getValueProps={(i) => {
          //   //   if (i) {
          //   //     return { value: dayjs(i) };
          //   //   } else {
          //   //     return;
          //   //   }
          //   // }}
          // >

          // </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="isClose"
        title="Хаах эсэх"
        render={(value, row, index) => (
          <EditableFormItemLimit
            valuePropName="checked"
            name={[index, "isClose"]}
            editing={index === editingIndex}
            className="ant-form-item-no-bottom-margin"
          >
            <Switch />
          </EditableFormItemLimit>
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
