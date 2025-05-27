import { useContext, useEffect, useState } from "react";
//components
import {
  NewDatePicker,
  NewFilterSelect,
  NewInput,
  NewInputNumber,
  NewSelect,
} from "@/components/input";
import { Button, Col, Form, Row, Space } from "antd";
import EditableTableOrder from "./editableTableOrder";
import Image from "next/image";
import NewCard from "@/components/Card";

// entity
import { TabType } from "@/service/order-distribution/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ConsumerSelect } from "@/components/consumer-select";
import { IDataBooking } from "@/service/booking/entities";
import { BookingService } from "@/service/booking/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialType } from "@/service/material/entities";
import { UserSelect } from "@/components/user-select";
import dayjs from "dayjs";

interface IProps {
  type: TabType;
  isEdit: boolean;
  isFormAdd: boolean;
  row?: IDataBooking;
}

const CreateOrder = (props: IProps) => {
  const { type, isEdit, isFormAdd, row } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm();
  const toWarehouseId = Form.useWatch("toWarehouseId", form);
  const consumerId = Form.useWatch("consumerId", form);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const onFinish = (values: IDataBooking) => {
    blockContext.block();
    BookingService.postSale(values)
      .then((response) => {
        console.log("response =======>", response);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    console.log("warehouseId ======>", toWarehouseId);
  }, [toWarehouseId]);
  useEffect(() => {
    console.log("consumerId =====>", consumerId);
  }, [consumerId]);
  useEffect(() => {
    console.log("row =====>", row);
    form.setFieldsValue({
      ...row,
      createdAt: dayjs(row?.createdAt),
      bookingAt: dayjs(row?.bookingAt),
    });
  }, [row]);
  const FormItems = () => {
    return (
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: `repeat(4, minmax(0,1fr))`,
        }}
      >
        <Form.Item label="Захиалгын ID" name="id">
          <NewInput disabled />
        </Form.Item>
        <Form.Item
          label="Баримтын төлөв"
          name="status"
          hidden={type == TabType.CREATE_ORDER}
        >
          <NewSelect
            disabled
            options={[
              {
                label: (
                  <span
                    style={{
                      color: "blue",
                    }}
                  >
                    Захиалга
                  </span>
                ),
                value: 0,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Захиалга өгсөн огноо"
          name="createdAt"
          hidden={type == TabType.CREATE_ORDER}
        >
          <NewDatePicker disabled format={"YYYY-MM-DD"} />
        </Form.Item>
        <Form.Item
          label="Захиалга өгсөн хэрэглэгч"
          name="createdBy"
          hidden={type == TabType.CREATE_ORDER}
        >
          <UserSelect form={form} rules={[]} name="createdBy" isDisable />
        </Form.Item>
        <Form.Item
          label="Огноо"
          name="bookingAt"
          rules={[
            {
              required: true,
              message: "Огноо заавал",
            },
          ]}
        >
          <NewDatePicker
            format={"YYYY-MM-DD"}
            disabled={type != TabType.CREATE_ORDER}
          />
        </Form.Item>
        <Form.Item
          label="Зарлагын байршил"
          name="toWarehouseId"
          rules={[{ required: true, message: "Байршил заавал" }]}
        >
          <NewFilterSelect
            options={warehouses?.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Харилцагчийн нэр">
          <ConsumerSelect form={form} rules={[]} name={"consumerId"} />
        </Form.Item>
        <Form.Item label="Нийт дүн" name="totalAmount">
          <NewInputNumber disabled />
        </Form.Item>
        <Form.Item
          label="Бараа үйлчилгээний хөнгөлөлт"
          name="materialDiscountAmount"
        >
          <NewInput disabled />
        </Form.Item>
        <Form.Item label="Харилцагчийн хөнгөлөлт" name="consumerDiscountAmount">
          <NewInput disabled />
        </Form.Item>
        <Form.Item label="Төлөх дүн" name="payAmount">
          <NewInputNumber disabled />
        </Form.Item>
      </div>
    );
  };
  const Content = () => (
    <Form form={form} layout="vertical">
      <div
        style={{
          display: "flex",
          gap: 12,
          flexDirection: "column",
        }}
      >
        <FormItems />
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#DEE2E6",
          }}
        />
        <Form.List name="bookingMaterials">
          {(items, { add, remove }) => (
            <EditableTableOrder
              params={{
                types: [MaterialType.Material],
                // warehouseId: toWarehouseId,
                // consumerId: consumerId,
              }}
              isFormAdd={isFormAdd}
              data={items}
              form={form}
              add={add}
              remove={remove}
            />
          )}
        </Form.List>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Button
            type="primary"
            onClick={() =>
              form.validateFields().then((values) => {
                onFinish(values);
                console.log(values);
              })
            }
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </Form>
  );
  const getWarehouse = async () => {
    await WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  useEffect(() => {
    getWarehouse();
  }, []);
  return (
    <>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
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
          </Space>
        </Col>
        <Col span={24}>
          {isEdit ? (
            <Content />
          ) : (
            <NewCard>
              <Content />
            </NewCard>
          )}
        </Col>
      </Row>
    </>
  );
};
export default CreateOrder;
