import Image from "next/image";
import { Button, Checkbox, Col, Form, Row, Space } from "antd";
import NewCard from "@/components/Card";
import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import { useContext, useEffect, useState } from "react";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import {
  CommandType,
  IDataCommand,
  IResponseOneCommand,
} from "@/service/command/entities";
import { MaterialCommandService } from "@/service/command/service";
import { hasUniqueValues, openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import mnMN from "antd/es/calendar/locale/mn_MN";
import EditableTableProduct from "./product-price/editableTable";
import EditableTableService from "./service-price/editableTable";
import EditableTablePackage from "./package-price/editableTable";
import EditableTableDiscount from "./discount/editableTable";
import EditableTableCoupon from "./coupon/editableTable";
import { IDataPrice } from "@/service/command/price/entities";
import { ConsumerSelect } from "@/components/consumer-select";

interface IProps {
  selectedCommand?: IDataCommand;
  isEdit?: boolean;
  onSavePriceModal?: (state: boolean) => void;
  type: CommandType;
}
const SavePrice = (props: IProps) => {
  const { selectedCommand, isEdit, onSavePriceModal, type } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isSelectAllWarehouse, setIsSelectAllWarehouse] =
    useState<boolean>(false);
  const getWarehouses = async (params: IParamWarehouse) => {
    await WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataCommand) => {
    blockContext.block();
    values.type = type;
    if (isEdit && selectedCommand) {
      if (type == CommandType.Discount) {
        await MaterialCommandService.patchDiscount(selectedCommand.id, values)
          .then((response) => {
            success("Хөнгөлөлт", response);
            onSavePriceModal?.(false);
          })
          .finally(() => blockContext.unblock());
      } else if (type == CommandType.Coupon) {
        await MaterialCommandService.patchCoupon(selectedCommand.id, values)
          .then((response) => {
            success("Урамшуулал", response);
            onSavePriceModal?.(false);
          })
          .finally(() => blockContext.unblock());
      } else {
        await MaterialCommandService.patchPrice(selectedCommand.id, values)
          .then((response) => {
            success("Үнэ", response);
            onSavePriceModal?.(false);
          })
          .finally(() => blockContext.unblock());
      }
    } else {
      if (type == CommandType.Discount) {
        await MaterialCommandService.postDiscount(values)
          .then((response) => {
            success("Хөнгөлөлт", response);
          })
          .finally(() => blockContext.unblock());
      } else if (type == CommandType.Coupon) {
        await MaterialCommandService.postCoupon(values)
          .then((response) => {
            success("Урамшуулал", response);
          })
          .finally(() => blockContext.unblock());
      } else {
        await MaterialCommandService.postPrice(values)
          .then((response) => {
            success("Үнэ", response);
          })
          .finally(() => blockContext.unblock());
      }
    }
  };
  const success = (name: string, response: IResponseOneCommand) => {
    if (response.success) {
      openNofi("success", `${name} амжилттай хадгаллаа.`);
      setIsReloadList(!isReloadList);
      form.resetFields();
    }
  };
  const handleWarehouseSelectAll = () => {
    setIsSelectAllWarehouse(!isSelectAllWarehouse);
    form.setFieldValue("isAll", !isSelectAllWarehouse);
  };
  useEffect(() => {
    getWarehouses({});
  }, []);
  useEffect(() => {
    if (selectedCommand) {
      setIsSelectAllWarehouse(selectedCommand.isAll);
      form.setFieldsValue({
        ...selectedCommand,
        commandAt: dayjs(selectedCommand.commandAt, "YYYY-MM-DD"),
        ruleAt: dayjs(selectedCommand.ruleAt, "YYYY-MM-DD"),
        prices: selectedCommand?.prices.map((price) => ({
          materialId: price.materialId,
          name: price.material.name,
          measurement: price.material.measurement?.name,
          countPackage: price.material.countPackage,
          section: price.material.section?.name,
          unitAmount: price.unitAmount,
          lumpQuantity: price.lumpQuantity,
          lumpAmount: price.lumpAmount,
        })),
        coupons: selectedCommand?.coupons.map((coupon) => ({
          materialId: coupon.materialId,
          name: coupon.material.name,
          measurement: coupon.material.measurement?.name,
          countPackage: coupon.material.countPackage,
          section: coupon.material.section?.name,
          unitAmount: coupon.unitAmount,
          endAt: dayjs(coupon.endAt, "YYYY-MM-DD"),
          condition: coupon.condition,
          conditionValue: coupon.conditionValue,
          quantity: coupon.quantity,
          percent: coupon.percent,
        })),
        discounts: selectedCommand?.discounts.map((discount) => ({
          materialId: discount.materialId,
          name: discount.material.name,
          measurement: discount.material?.measurement?.name,
          section: discount.material.section?.name,
          endAt: dayjs(discount.endAt, "YYYY-MM-DD"),
          percent: discount.percent,
          amount: discount.amount,
        })),
      });
    }
  }, [selectedCommand]);

  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
          size={12}
        >
          <Image
            src={"/images/PrintIcon.svg"}
            width={24}
            height={24}
            alt="printIcon"
          />
          {!isEdit ? (
            <Image
              src={"/images/UploadIcon.svg"}
              width={24}
              height={24}
              alt="uploadIcon"
            />
          ) : (
            ""
          )}
          <Image
            src={"/images/DownloadIcon.svg"}
            width={24}
            height={24}
            alt="downloadIcon"
          />
        </Space>
      </Col>
      <Col span={24}>
        <NewCard>
          <Form form={form} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="ID" name="id">
                  <NewInput disabled />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Тушаалын огноо"
                  name="commandAt"
                  rules={[
                    {
                      required: true,
                      message: "Тушаалын огноо оруулна уу.",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Тушаалын дугаар"
                  name="commandNo"
                  rules={[
                    {
                      required: true,
                      message: "Тушаалын дугаар оруулна уу.",
                    },
                  ]}
                >
                  <NewInput />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Мөрдөж эхлэх огноо"
                  name="ruleAt"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                {isEdit ? (
                  <Form.Item
                    label="Мөрдөх төв, салбарын нэр"
                    name="warehouseId"
                    rules={
                      !isSelectAllWarehouse
                        ? [
                            {
                              required: true,
                              message: "Мөрдөх салбар оруулна уу.",
                            },
                          ]
                        : []
                    }
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
                      disabled={isSelectAllWarehouse}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="Мөрдөх төв, салбарын нэр"
                    name="warehouseIds"
                    rules={
                      !isSelectAllWarehouse
                        ? [
                            {
                              required: true,
                              message: "Мөрдөх салбар оруулна уу.",
                            },
                          ]
                        : []
                    }
                  >
                    <NewSelect
                      allowClear
                      showSearch
                      mode="multiple"
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
                      disabled={isSelectAllWarehouse}
                    />
                  </Form.Item>
                )}
                <Form.Item name="isAll">
                  <Checkbox
                    checked={isSelectAllWarehouse}
                    onChange={handleWarehouseSelectAll}
                  >
                    бүх салбар сонгох
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Харилцагчын код, нэр">
                  <ConsumerSelect form={form} rules={[]} />
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List
              name="prices"
              rules={[
                {
                  validator: async (_, prices) => {
                    const arr = Array.isArray(prices)
                      ? prices.map((price: IDataPrice) => price.materialId)
                      : [];
                    if (!hasUniqueValues(arr)) {
                      return Promise.reject(
                        new Error("Барааны код давхардсан байна.")
                      );
                    }
                  },
                },
              ]}
            >
              {(items, { add, remove }, { errors }) => {
                if (type === CommandType.Material) {
                  return (
                    <EditableTableProduct
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                      errors={errors}
                    />
                  );
                } else if (type === CommandType.Service) {
                  return (
                    <EditableTableService
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                } else if (type === CommandType.Package) {
                  return (
                    <EditableTablePackage
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                }
              }}
            </Form.List>
            <Form.List name="discounts">
              {(items, { add, remove }) => {
                if (type === CommandType.Discount) {
                  return (
                    <EditableTableDiscount
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                }
              }}
            </Form.List>
            <Form.List name="coupons">
              {(items, { add, remove }) => {
                if (type === CommandType.Coupon) {
                  return (
                    <EditableTableCoupon
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                }
              }}
            </Form.List>
          </Form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              paddingTop: 12,
            }}
          >
            <p
              style={{
                color: "#000",
                textAlign: "center",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "normal",
              }}
            >
              *Харилцагчид тусгай үнээр борлуулах бол харилцагчийн нэрийг
              сонгоно.
            </p>
            <Button
              type="primary"
              onClick={() =>
                form.validateFields().then((values) => {
                  onFinish(values);
                })
              }
            >
              Хадгалах
            </Button>
          </div>
        </NewCard>
      </Col>
    </Row>
  );
};
export default SavePrice;
