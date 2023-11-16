"use client";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import Image from "next/image";
import { IDataBalance } from "@/service/material/balance/entities";
import { useEffect, useState } from "react";
import Thumbnail from "./thumbnail";
import Detailed from "./detailed";
import NewModal from "@/components/modal";
import { BalanceService } from "@/service/material/balance/service";
import EditableTableBalance from "./editableTable";
import { NewInput } from "@/components/input";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { MaterialSelect } from "@/components/material-select";
import { IDataMaterial } from "@/service/material/entities";

const { Title } = Typography;
const BeginningBalancePage = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const items = [
    {
      label: "Бараа материалын жагсаалт",
      key: "item-1",
      children: (
        <Thumbnail
          isReload={isReloadList}
          onEdit={(row) => openModal(true, row)}
        />
      ),
    },
    {
      label: "Дэлгэрэнгүй жагсаалт",
      key: "item-2",
      children: <Detailed />,
    },
  ];
  const getWarehouses = async (param: IParamWarehouse) => {
    await WarehouseService.get(param).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehouses({});
  }, []);
  const openModal = (state: boolean, row?: IDataMaterial) => {
    setIsReloadList(false);
    setEditMode(state);
    form.resetFields();
    if (state && row) {
      setSelectedRow(row);
      form.resetFields();
      form.setFieldsValue({
        ...row,
        materialId: row.id,
      });
    }
    setIsOpenModal(true);
  };
  const onFinish = async (values: IDataBalance) => {
    if (editMode && selectedRow) {
      await BalanceService.patch(selectedRow.id, values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(!isReloadList);
        }
      });
    } else {
      await BalanceService.post(values).then((response) => {
        if (response.success) {
          setIsOpenModal(false);
          setIsReloadList(!isReloadList);
        }
      });
    }
  };
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>
              Үндсэн бүртгэл / Бараа материал / Эхний үлдэгдэл
            </Title>
            <Button
              type="primary"
              onClick={() => openModal(false)}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Шинээр бүртгэх
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <Tabs
            className="lineTop"
            items={items}
            destroyInactiveTabPane={true}
          />
        </Col>
      </Row>
      <NewModal
        title="Барааны эхний үлдэгдэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isAccount: false,
            isClose: false,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div className="inputs-gird-2">
              <Form.Item label="Дотоод код">
                <MaterialSelect
                  materialTypes={[]}
                  form={form}
                  rules={[
                    {
                      required: true,
                      message: "Дотоод код",
                    },
                  ]}
                  name="materialId"
                  onClear={() => {
                    form.resetFields([
                      "name",
                      "measurement",
                      "countPackage",
                      "section",
                    ]);
                  }}
                  onSelect={(value) => {
                    form.setFieldsValue({
                      name: value.name,
                      countPackage: value.countPackage,
                      measurement: {
                        name: value.measurementName,
                      },
                      section: {
                        name: value.sectionName,
                      },
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Бараа материалын нэр" name="name">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Хэмжих нэгж" name={["measurement", "name"]}>
                <NewInput disabled />
              </Form.Item>
              <Form.Item
                label="Бараа материалын бүлэг"
                name={["section", "name"]}
              >
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Багцын доторх тоо" name="countPackage">
                <InputNumber disabled />
              </Form.Item>
              <Form.Item label="Эхний үлдэгдэл" name="balanceQty">
                <InputNumber disabled />
              </Form.Item>
            </div>
            <Form.List name="balances">
              {(accounts, { add, remove }) => (
                <EditableTableBalance
                  data={accounts}
                  form={form}
                  editMode={editMode}
                  add={add}
                  remove={remove}
                  warehouses={warehouses}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default BeginningBalancePage;
