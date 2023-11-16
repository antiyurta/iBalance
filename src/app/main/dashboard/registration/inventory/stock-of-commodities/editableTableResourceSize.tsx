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
import React, { useEffect, useState } from "react";
import "dayjs/locale/mn";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { NewFilterSelect } from "@/components/input";

interface IProps {
  data: FormListFieldData[];
  // warehouses: IDataWarehouse[];
  form: FormInstance;
  editMode: boolean;
  add: () => void;
  remove: (index: number) => void;
}

const { Column } = Table;
const { Option } = Select;

const EditableTableResourseSize: React.FC<IProps> = (props) => {
  const { message } = App.useApp();
  const { data, form, editMode, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewService, setNewService] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const addService = () => {
    form
      .validateFields([
        ["resourceSizes", editingIndex, "warehouseId"],
        ["resourceSizes", editingIndex, "quantity"],
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
        ["resourceSizes", editingIndex, "warehouseId"],
        ["resourceSizes", editingIndex, "quantity"],
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
        ["resourceSizes", editingIndex, "warehouseId"],
        ["resourceSizes", editingIndex, "quantity"],
      ]);
    }
    setNewService(false);
    setEditingIndex(undefined);
  };
  const getWarehouses = () => {
    const params: IParamWarehouse = { isActive: [true] };
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehouses();
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
        dataIndex="downloadDay"
        title="Эргэц /хоногоор/"
        render={(_, __, index) => (
          <Form.Item name={[index, "downloadDay"]}>
            <InputNumber disabled={editingIndex !== index} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="minResourceSize"
        title="Заавал байх хамгийн байлгах хамгийн бага нөөцийн хэмжээ"
        render={(_, __, index) => (
          <Form.Item name={[index, "minResourceSize"]}>
            <InputNumber disabled={editingIndex !== index} />
          </Form.Item>
        )}
      />
      <Column
        dataIndex="minDownloadSize"
        title="Дараагийн татан авалтын хамгийн бага хэмжээ"
        render={(_, __, index) => (
          <Form.Item name={[index, "minDownloadSize"]}>
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

export default EditableTableResourseSize;
