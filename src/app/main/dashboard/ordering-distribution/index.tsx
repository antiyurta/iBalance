import { NewSearch } from "@/components/input";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tabs, Typography } from "antd";

// Захиалга үүсгэх
import Create from "./create";
// Хуваарилалт хийх
import Distribution from "./distribution";
//Баримтын жагсаалт
import ListOfReceipt from "./listOfReceipt";
// Гүйлгээний жагсаалт
import ListOfTransactions from "./listOfTransations";
import type { ColumnsType } from "antd/es/table";
import {
  IDataInternal,
  IDataSale,
} from "@/service/order-distribution/entities";

const { Title } = Typography;

export interface ITabs {
  grid: number;
  columns: IOrder[];
  order: IOrder[];
}

export interface IDistribution {}

export interface IProps {
  type: Type;
  create: ITabs;
  distribution: ITabs;
  listOfReceipt: ITabs;
  listOfTransations: ITabs;
}

export type Type = "SALES" | "INTERNAL";

export interface IOptions {
  label: React.ReactNode;
  value?: string | number | null;
}

enum title {
  SALES = "Борлуулалт",
  INTERNAL = "Дотоод",
}

export enum CompactItem {
  CONSUMER = "consumer",
}

export interface IOrder {
  label: string | null;
  type: FormItemType;
  name: string;
  disabled: boolean;
  required?: boolean;
  options?: IOptions[];
  compact?: {
    is: boolean;
    from?: CompactItem;
    to?: string;
  };
}

export enum FormItemType {
  INPUT = "input", // input
  SELECT = "select", // select
  DATE_PICKER = "date_picker", // date picker
  ORDER_ID = "order_id", // захиалгын ID
  STATUS = "status", // Баримтын төлөв
  SALE_DATE = "sele_date", // Захиалга өгсөн огноо
  ORDER_CONSUMER = "order_consumer", // захиалга өгсөн хэрэглэгч
  DATE = "date", // огноо
  LOCATION_INCOME = "location_income", //Орлогын байршил
  LOCATION_EXPAND = "location_expand", //  Зарлагын байршил
  NAME = "name", // Харилцагчийн нэр
  PAYMENT_TYPE = "payment_type", // Төлбөрийн хэлбэр
  TOTAL = "total", // нийт дүн
  DISCOUNT = "DISCOUNT", // Бараа үйлчилгээний хөнгөлөлт
  DISCOUNT_CONSUMER = "discount_consumer", // Харилцагчийн хөнгөлөлт
  PAID_AMOUNT = "paid_amount", // Төлөх дүн
  AMOUNT_DISCOUNT = "amount_discount", // Бараа материалын үнийн хөнгөлөлт
}

const OrderDistrubutionIndex = (props: IProps) => {
  const { type, create, distribution, listOfReceipt, listOfTransations } =
    props;
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined /> Захиалга үүсгэх
        </div>
      ),
      key: "item-1",
      children: (
        <Create
          type={type}
          isEdit={false}
          columns={create.columns}
          grid={create.grid}
          order={create.order}
        />
      ),
    },
    {
      label: "Хуваарилалт хийх",
      key: "item-2",
      children: (
        <Distribution
          type={type}
          grid={distribution.grid}
          columns={distribution.columns}
          order={distribution.order}
        />
      ),
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-3",
      children: (
        <ListOfReceipt
          type={type}
          grid={listOfReceipt.grid}
          columns={listOfReceipt.columns}
          order={listOfReceipt.order}
        />
      ),
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-4",
      children: (
        <ListOfTransactions
          type={type}
          grid={listOfTransations.grid}
          columns={listOfTransations.columns}
          order={listOfTransations.order}
        />
      ),
    },
  ];
  return (
    <Row
      style={{
        paddingTop: 16,
      }}
      gutter={[12, 24]}
    >
      <Col md={24} lg={16} xl={19}>
        <Space size={24}>
          <Title level={3}>Захиалга, хуваарилалт / {title[`${type}`]} </Title>
        </Space>
      </Col>
      <Col md={24} lg={8} xl={5}>
        <NewSearch />
      </Col>
      <Col span={24}>
        <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
      </Col>
    </Row>
  );
};
export default OrderDistrubutionIndex;
