import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  FormInstance,
  FormListFieldData,
  Input,
  Popconfirm,
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
import dayjs from "dayjs";

interface IProps {
  data: FormListFieldData[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;

const EditableTableCard: React.FC<IProps> = (props) => {
  const { data, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const [memberships, setMemberships] = useState<IDataMembership[]>([]);
  const [membershipDictionary, setMembershipDictionary] =
    useState<Map<number, IDataMembership>>();
  const [branchs, setBranchs] = useState<IDataBranch[]>([]);

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

  const getMemberships = async (cardNo: string) => {
    if (!cardNo) {
      message.error("Картын дугаар заавал оруулна уу.");
    } else {
      const response = await MembershipService.get({
        queries: [
          {
            param: "cardNo",
            operator: "CONTAINS",
            value: cardNo,
          },
        ],
      });
      if (response.success) {
        setMemberships(response.response.data);
        setMembershipDictionary(
          new Map<number, IDataMembership>(
            memberships.map((membership) => [membership.id, membership])
          )
        );
      }
    }
  };

  const membershipFormField = async (id: number) => {
    const membership = membershipDictionary?.get(id);
    if (membership) {
      form.setFieldsValue({
        cardNo: membership.cardNo,
        name: membership.name,
      });
    }
  };

  useEffect(() => {
    BranchService.get({}).then((response) => {
      if (response.success) {
        setBranchs(response.response.data);
      }
    });
  }, []);

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
          <EditableFormItemLimit
            rules={[{ required: true, message: "Картын дугаар заавал" }]}
            name={[index, "cardNo"]}
            editing={index === editingIndex}
          >
            <AutoComplete
              options={memberships?.map((membership) => ({
                label: membership.cardNo,
                value: membership.cardNo,
              }))}
              onSelect={membershipFormField}
              className="ant-selecto-border-no"
            >
              <Input.Search
                style={{
                  border: "none",
                }}
                enterButton={false}
                placeholder="Хайх"
                onSearch={getMemberships}
              />
            </AutoComplete>
          </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="name"
        title="Карт эрхийн бичгийн нэр"
        render={(value, row, index) => (
          <EditableFormItemLimit
            name={[index, "name"]}
            editing={index === editingIndex}
            className="ant-form-item-no-bottom-margin"
          >
            <NewInput disabled min={0} max={150} />
          </EditableFormItemLimit>
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
            <NewSelect>
              {branchs?.map((branch) => (
                <NewOption key={branch.id} value={branch.id}>
                  {branch.name}
                </NewOption>
              ))}
            </NewSelect>
          </EditableFormItemLimit>
        )}
      />
      <Column
        dataIndex="endAt"
        title="Дуусах огноо"
        render={(value, row, index) => (
          <EditableFormItemLimit
            name={[index, "endAt"]}
            editing={index === editingIndex}
            className="ant-form-item-no-bottom-margin"
            getValueProps={(i: any) => {
              if (i) {
                console.log(i);
                return { value: dayjs(i, "YYYY/MM/DD") };
              }
              return {};
            }}
            // getValueProps={(i) => {
            //   if (i) {
            //     return { value: dayjs(i) };
            //   } else {
            //     return;
            //   }
            // }}
          >
            <NewDatePicker format={"YYYY/MM/DD"} placeholder="YYYY-MM-DD" />
          </EditableFormItemLimit>
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
