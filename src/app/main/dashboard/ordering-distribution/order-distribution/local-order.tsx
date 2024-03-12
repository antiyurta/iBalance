import { NewDatePicker, NewFilterSelect, NewInput } from "@/components/input";
import { hasUniqueValues } from "@/feature/common";
import { IDataBookingMaterial } from "@/service/booking/booking-material/entities";
import { Button, Divider, Form } from "antd";
import EditableMateral from "./editable-material";
import NewCard from "@/components/Card";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useContext, useEffect, useState } from "react";
import { BookingStatus, IDataBooking } from "@/service/booking/entities";
import { BookingService } from "@/service/booking/service";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import dayjs from "dayjs";
import { enumTranslation } from "@/feature/constraint-translation";

interface IProps {
  status?: BookingStatus;
  selectedBooking?: IDataBooking;
  isModal?: (isValue: boolean) => void;
}
const LocalOrder: React.FC<IProps> = ({
  selectedBooking,
  status = "NEW",
  isModal,
}) => {
  const [form] = Form.useForm<IDataBooking | undefined>();
  const blockContext: BlockView = useContext(BlockContext);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const getWarehouse = async () => {
    await WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataBooking) => {
    blockContext.block();
    if (selectedBooking) {
      values.status = status;
      await BookingService.patch(selectedBooking.id, values)
        .then((response) => {
          if (response.success) {
            form.resetFields();
            isModal?.(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await BookingService.postLocal(values)
        .then((response) => {
          if (response.success) form.resetFields();
        })
        .finally(() => blockContext.unblock());
    }
  };
  useEffect(() => {
    getWarehouse();
  }, []);
  useEffect(() => {
    if (selectedBooking) {
      form.setFieldsValue({
        ...selectedBooking,
        bookingAt: dayjs(selectedBooking?.bookingAt),
      });
    }
  }, [selectedBooking]);
  return (
    <NewCard>
      <Form form={form} layout="vertical">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          <Form.Item name={"id"} label={"Захиалгын ID"} required>
            <NewInput disabled />
          </Form.Item>
          <Form.Item name={"bookingAt"} label={"Баримтын огноо"} required>
            <NewDatePicker />
          </Form.Item>
          <Form.Item name={"toWarehouseId"} label={"Орлогын байршил"} required>
            <NewFilterSelect
              disabled={status !== "NEW"}
              options={warehouses.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item name={"fromWarehouseId"} label={"Зарлагын байршил"}>
            <NewFilterSelect
              options={warehouses.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          {status !== "NEW" && (
            <Form.Item name={"status"} label={"Баримтын төлөв"}>
              <NewFilterSelect
                disabled
                options={[
                  {
                    label: enumTranslation("NEW"),
                    value: "NEW",
                  },
                  {
                    label: enumTranslation("ORDER_IGNORE"),
                    value: "ORDER_IGNORE",
                  },
                  {
                    label: enumTranslation("DISTRIBUTE"),
                    value: "DISTRIBUTE",
                  },
                  {
                    label: enumTranslation("DISTRIBUTE_IGNORE"),
                    value: "DISTRIBUTE_IGNORE",
                  },
                  {
                    label: enumTranslation("CONFIRM"),
                    value: "CONFIRM",
                  },
                  {
                    label: enumTranslation("CONFIRM_IGNORE"),
                    value: "CONFIRM_IGNORE",
                  },
                ]}
              />
            </Form.Item>
          )}
        </div>
        <Divider />
        <Form.List
          name={"bookingMaterials"}
          rules={[
            {
              validator: async (_, transactions) => {
                const arr = Array.isArray(transactions)
                  ? transactions.map(
                      (item: IDataBookingMaterial) => item.materialId
                    )
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
          {(items, { add, remove }, { errors }) => (
            <>
              <EditableMateral
                data={items}
                form={form}
                status={status}
                add={add}
                remove={remove}
              />
              <div style={{ color: "#ff4d4f" }}>{errors}</div>
            </>
          )}
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
        <Button
          type="primary"
          onClick={() =>
            form.validateFields().then((values) => {
              values && onFinish(values);
            })
          }
        >
          {status == "NEW" && "Хадгалах"}
          {status == "DISTRIBUTE" && "Зөвшөөрөх"}
          {status == "CONFIRM" && "Олгох"}
        </Button>
      </div>
    </NewCard>
  );
};
export default LocalOrder;
