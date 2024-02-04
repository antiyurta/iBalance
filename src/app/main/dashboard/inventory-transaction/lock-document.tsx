import { ConsumerSelect } from "@/components/consumer-select";
import DateIntervalForm from "@/components/dateIntervalForm";
import { NewFilterSelect, NewInput, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IFilterDocument,
  IParamDocument,
  MovingStatus,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { DataIndexType, Meta } from "@/service/entities";
import { IDataWarehouse } from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { Button, Form } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const columns: FilteredColumnsDocument = {
  code: {
    label: "Баримтын дугаар",
    isView: true,
    isFiltered: false,
    dataIndex: ["code"],
    type: DataIndexType.MULTI,
  },
  documentAt: {
    label: "Баримтын огноо",
    isView: true,
    isFiltered: false,
    dataIndex: ["documentAt"],
    type: DataIndexType.DATETIME,
  },
  warehouseName: {
    label: "Байршил",
    isView: true,
    isFiltered: false,
    dataIndex: ["warehouse", "name"],
    type: DataIndexType.MULTI,
  },
  incomeCount: {
    label: "Орлогын тоо",
    isView: true,
    isFiltered: false,
    dataIndex: ["incomeCount"],
    type: DataIndexType.VALUE,
  },
  incomeQuantity: {
    label: "Орлогын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["incomeQuantity"],
    type: DataIndexType.VALUE,
  },
  expenseCount: {
    label: "Зарлагын тоо",
    isView: true,
    isFiltered: false,
    dataIndex: ["expenseCount"],
    type: DataIndexType.VALUE,
  },
  expenseQuantity: {
    label: "Зарлагын тоо хэмжээ",
    isView: true,
    isFiltered: false,
    dataIndex: ["expenseQuantity"],
    type: DataIndexType.VALUE,
  },
  consumerName: {
    label: "Харилцагчийн нэр",
    isView: true,
    isFiltered: false,
    dataIndex: ["consumer", "name"],
    type: DataIndexType.VALUE,
  },
  isLock: {
    label: "Гүйлгээ түгжсэн эсэх",
    isView: true,
    isFiltered: false,
    dataIndex: ["isLock"],
    type: DataIndexType.BOOLEAN,
  },
  description: {
    label: "Гүйлгээний утга",
    isView: true,
    isFiltered: false,
    dataIndex: ["description"],
    type: DataIndexType.MULTI,
  },
};
interface IProps {
  movingStatus?: MovingStatus;
}
const LockDocument = (props: IProps) => {
  const { movingStatus } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [isLockModal, setIsLockModal] = useState<boolean>(false);
  const [params, setParams] = useState<IParamDocument>({
    page: 1,
    limit: 10,
    isLock: false,
    movingStatus: movingStatus,
  });
  const [data, setData] = useState<IDataDocument[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterDocument>();
  const [selectedRows, setSelectedRows] = useState<IDataDocument[]>([]);
  const getData = (params: IParamDocument) => {
    DocumentService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const getWarehouses = () => {
    WarehouseService.get().then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const locking = () => {
    const ids: number[] = selectedRows.map((item) => item.id);
    blockContext.block();
    DocumentService.lock(ids, !form.getFieldValue("isLock"))
      .then((response) => {
        if (response.success) setIsLockModal(false);
      })
      .finally(() => blockContext.unblock());
  };
  const onFinish = (values: IParamDocument) => {
    setParams({ ...params, ...values });
  };
  useEffect(() => {
    if (isLockModal) {
      getData(params);
    }
  }, [isLockModal, params]);
  useEffect(() => getWarehouses(), []);
  useEffect(() => {
    form.setFieldValue("movingStatus", movingStatus);
  }, [movingStatus]);
  return (
    <>
      <Image
        src={"/images/lock.svg"}
        width={24}
        height={24}
        alt="downloadIcon"
        onClick={() => setIsLockModal(true)}
      />
      <NewModal
        width={1400}
        open={isLockModal}
        title={"Гүйлгээ түгжих"}
        onCancel={() => setIsLockModal(false)}
        footer={
          <Button type="primary" onClick={() => locking()}>
            Түгжих
          </Button>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            alignSelf: "stretch",
          }}
          initialValues={{ isLock: false }}
        >
          <DateIntervalForm
            intervalStyle={{}}
            dateStyle={{}}
            form={form}
            itemname={"interval"}
          />
          <Form.Item label={"Баримтын дугаар"}>
            <NewInput />
          </Form.Item>
          <Form.Item label={"Байршил"} name="warehouseId">
            <NewFilterSelect
              options={warehouses.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item label={"Харилцагчийн код, нэр"}>
            <ConsumerSelect form={form} rules={[]} name="consumerId" />
          </Form.Item>
          <Form.Item label={"Гүйлгээний төлөв"} name="status">
            <NewFilterSelect
              options={[
                { value: "PAID", label: "Төлөгдсөн" },
                { value: "LENDING", label: "Зээлтэй" },
                { value: "REFUND", label: "Буцаалт" },
              ]}
            />
          </Form.Item>
          <Form.Item label={"Гүйлгээний цонх"} name="movingStatus">
            <NewFilterSelect
              options={[
                { value: "PURCHASE", label: "Татан авалт/Худалдан авалт" },
                { value: "SALE_RETURN", label: "Борлуулалтын буцаалт" },
                { value: "SALES", label: "Борлуулалт" },
                { value: "PURCHASE_RETURN", label: "Худалдан авалтын буцаалт" },
                { value: "IN_OPERATION", label: "Үйл ажиллагаанд" },
                { value: "ACT_AMORTIZATION", label: "Акт хорогдол" },
                {
                  value: "MOVEMENT_IN_WAREHOUSE",
                  label: "Агуулах доторх хөдөлгөөн",
                },
                { value: "ITEM_CONVERSION", label: "Барааны хөрвүүлэг" },
                { value: "MIXTURE", label: "Хольц" },
                { value: "CENCUS", label: "Тооллого" },
                { value: "POS", label: "Посын борлуулалт" },
                { value: "POS_SALE_RETURN", label: "Пос борлуулалтын буцаалт" },
                { value: "BOOKING_SALE", label: "Захиалгын борлуулалт" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Гүйлгээ түгжсэн эсэх"
            name="isLock"
            valuePropName="checked"
          >
            <NewSwitch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Шүүх
            </Button>
          </Form.Item>
        </Form>
        <hr />
        <NewTable
          rowSelection={{
            type: "checkbox",
            onChange(_: any, selectedRows: IDataDocument[]) {
              setSelectedRows(selectedRows);
            },
          }}
          columns={columns}
          onColumns={(columns: FilteredColumnsDocument) => {}}
          data={data}
          rowKey={"id"}
          meta={meta}
          incomeFilters={filters}
          scroll={{ x: 1300 }}
        />
      </NewModal>
    </>
  );
};
export default LockDocument;
