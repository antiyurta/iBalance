"use client";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Col, Form, Row, Space } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";
import NewCard from "@/components/Card";
import {
  NewDatePicker,
  NewFilterSelect,
  NewInput,
  NewInputNumber,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { ConsumerSelect } from "@/components/consumer-select";
import { EditableTablePos } from "./editable-table-pos";
import { IDataShoppingCart } from "@/service/pos/shopping-card/entities";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import {
  IDataReferencePaymentMethod,
  IParamPaymentMethod,
} from "@/service/reference/payment-method/entities";
import { ReferencePaymentMethodService } from "@/service/reference/payment-method/service";
import { UserSelect } from "@/components/user-select";
interface IProps {
  selectedCart: IDataShoppingCart;
}
const TransactionPos = (props: IProps) => {
  const { selectedCart } = props;
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    IDataReferencePaymentMethod[]
  >([]);
  const getWarehouses = (params: IParamWarehouse) => {
    WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getPaymentMethods = (params: IParamPaymentMethod) => {
    ReferencePaymentMethodService.get(params).then((response) => {
      if (response.success) {
        setPaymentMethods(response.response);
      }
    });
  };
  useEffect(() => {
    getWarehouses({});
    getPaymentMethods({});
    form.setFieldsValue({
      ...selectedCart,
      createdAt: dayjs(selectedCart?.createdAt),
      paymentMethodIds: selectedCart?.paymentInvoices.map(
        (invoice) => invoice.paymentMethodId
      ),
    });
  }, [selectedCart]);
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
            {/* TODO xl md sm style хийх @Amarbat */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 12,
              }}
            >
              <Form.Item label="Баримтын дугаар" name="id">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Поссын нэр" name="id">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Баримтын огноо" name="createdAt">
                <NewDatePicker format={"YYYY-MM-DD"} disabled />
              </Form.Item>
              <Form.Item
                label="Зарлагын байршил"
                name={["transactionDocument", "warehouseId"]}
              >
                <NewFilterSelect
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  }))}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Харилцагчийн код, нэр">
                <ConsumerSelect
                  form={form}
                  name={["transactionDocument", "consumerId"]}
                  rules={[]}
                  isDisable={true}
                />
              </Form.Item>
              <Form.Item label="Нийт дүн" name="totalAmount">
                <NumericFormat
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Form.Item>
              <Form.Item
                label="Харилцагчийн хөнгөлөлт"
                name="membershipDiscountAmount"
              >
                <NumericFormat
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Form.Item>
              <Form.Item
                label="Бараа материалын үнийн хөнгөлөлт"
                name="materialDiscountAmount"
              >
                <NumericFormat
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Form.Item>
              <Form.Item label="Төлөх дүн" name="payAmount">
                <NumericFormat
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Form.Item>
              <Form.Item label="Төлбөрийн хэлбэр" name="paymentMethodIds">
                <NewSelect
                  disabled
                  mode="multiple"
                  options={paymentMethods.map((method) => ({
                    value: method.id,
                    label: method.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Баримтын төлөв"
                name="isPaid"
                valuePropName="checked"
              >
                <NewSwitch disabled />
              </Form.Item>
              <Form.Item label="Төлсөн огноо" name="createdAt">
                <NewDatePicker format={"YYYY-MM-DD"} disabled />
              </Form.Item>
              <Form.Item label="Төлсөн дүн" name="paidAmount">
                <NumericFormat
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  displayType="text"
                  suffix="₮"
                />
              </Form.Item>
              <Form.Item label="Ашигласан огноо" name="payAmount">
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item label="Бэлгийн карт" name="payAmount">
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item
                label="Ибаримтын төлөв"
                name={["transactionDocument", "isEbarimt"]}
                valuePropName="checked"
              >
                <NewSwitch disabled />
              </Form.Item>
              <Form.Item label="Татвар төлөгчийн РД" name="taxRegno">
                <NewInput disabled />
              </Form.Item>
              <Form.Item label="Ибаримт руу илгээх дүн" name={"payAmount"}>
                <NewInputNumber disabled />
              </Form.Item>
              <Form.Item label="Олгосон огноо" name="createdAt">
                <NewDatePicker format={"YYYY-MM-DD"} disabled />
              </Form.Item>
              <Form.Item label="Олгосон хэрэглэгч">
                <UserSelect
                  form={form}
                  rules={[]}
                  name="updatedBy"
                  isDisable={true}
                />
              </Form.Item>
            </div>
            <Space size={12} wrap></Space>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List name="goods" rules={[]}>
              {(items) => (
                <>
                  <EditableTablePos data={items} form={form} />
                </>
              )}
            </Form.List>
          </Form>
        </NewCard>
      </Col>
    </Row>
  );
};
export default TransactionPos;