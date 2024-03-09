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
  bookingStatus?: BookingStatus;
  selectedBooking?: IDataBooking;
  isModal?: (isValue: boolean) => void;
}
const LocalOrder: React.FC<IProps> = ({
  selectedBooking,
  bookingStatus = BookingStatus.New,
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
      await BookingService.patchDistribute(selectedBooking.id, values)
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
    console.log(bookingStatus);
  }, [bookingStatus]);
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
              disabled={bookingStatus !== BookingStatus.New}
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
          {bookingStatus !== BookingStatus.New && (
            <Form.Item name={"status"} label={"Баримтын төлөв"}>
              <NewFilterSelect
                disabled
                options={[
                  {
                    label: enumTranslation(BookingStatus.New),
                    value: BookingStatus.New,
                  },
                  {
                    label: enumTranslation(BookingStatus.OrderIgnore),
                    value: BookingStatus.OrderIgnore,
                  },
                  {
                    label: enumTranslation(BookingStatus.Distribute),
                    value: BookingStatus.Distribute,
                  },
                  {
                    label: enumTranslation(BookingStatus.DistributeIgnore),
                    value: BookingStatus.DistributeIgnore,
                  },
                  {
                    label: enumTranslation(BookingStatus.Confirm),
                    value: BookingStatus.Confirm,
                  },
                  {
                    label: enumTranslation(BookingStatus.ConfirmIgnore),
                    value: BookingStatus.ConfirmIgnore,
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
                bookingStatus={bookingStatus}
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
          {bookingStatus == BookingStatus.New && "Хадгалах"}
          {bookingStatus == BookingStatus.Distribute && "Зөвшөөрөх"}
        </Button>
      </div>
    </NewCard>
  );
};
export default LocalOrder;
