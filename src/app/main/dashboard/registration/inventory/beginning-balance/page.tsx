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
import { NewInput, NewSwitch } from "@/components/input";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { MaterialSelect } from "@/components/material-select";
import { IDataMaterial, MaterialType } from "@/service/material/entities";
import { hasUniqueValues, openNofi } from "@/feature/common";
import dayjs from "dayjs";
import PageTitle from "@/components/page-title";
import { ConfigCodeService } from "@/service/config-code/service";
import { IDataConfigCode } from "@/service/config-code/entities";

const { Title } = Typography;
const BeginningBalancePage = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDataMaterial>();
  const [configCode, setConfigCode] = useState<IDataConfigCode>();
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
        balances: row.balances.map((item) => ({
          ...item,
          purchaseAt: dayjs(item.purchaseAt),
          expirationAt: dayjs(item.expirationAt),
        })),
        materialId: row.id,
      });
    }
    setIsOpenModal(true);
  };
  const onFinish = async (values: IDataBalance) => {
    if (configCode?.openerAt == null) {
      openNofi("warning", "Нээлтийн огноо оруулна уу.");
      return;
    }
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
  useEffect(() => {
    ConfigCodeService.get().then((response) => {
      if (response.success) {
        setConfigCode(response.response);
      }
    });
  }, []);
  return (
    <div>
      <PageTitle onClick={() => openModal(false)} />
      <Row gutter={[12, 24]}>
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
                  params={{ types: [MaterialType.Material] }}
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
                        name: value.measurement.name,
                      },
                      section: {
                        name: value.section.name,
                      },
                      isExpired: value.isExpired,
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
              <Form.Item
                label="Хугацаа дуусах эсэх"
                name="isExpired"
                valuePropName="checked"
              >
                <NewSwitch disabled />
              </Form.Item>
            </div>
            <Form.List
              name="balances"
              rules={[
                {
                  validator: async (_, balances) => {
                    const arr = Array.isArray(balances)
                      ? balances.map(
                          (balance: IDataBalance) =>
                            `${balance.warehouseId}-${dayjs(
                              balance.expirationAt
                            ).format("DD/MM/YYYY")}`
                        )
                      : [];
                    if (!hasUniqueValues(arr)) {
                      return Promise.reject(
                        new Error(
                          "Байршил-хугацаа дуусах огноо давхардсан байна."
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(accounts, { add, remove }, { errors }) => (
                <>
                  <EditableTableBalance
                    data={accounts}
                    form={form}
                    editMode={editMode}
                    add={add}
                    remove={remove}
                    warehouses={warehouses}
                  />
                  <div style={{ color: "#ff4d4f" }}>{errors}</div>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default BeginningBalancePage;
