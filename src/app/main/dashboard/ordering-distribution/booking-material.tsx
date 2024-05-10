import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { NewTable } from "@/components/table";
import { NewInput } from "@/components/input";
import { ArrowRightOutlined } from "@ant-design/icons";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsBookingMaterial,
  IDataBookingMaterial,
  IFilterBookingMaterial,
} from "@/service/booking/booking-material/entities";
import { BookingMaterialService } from "@/service/booking/booking-material/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
const { Title } = Typography;

interface IProps {
  type: "SALE" | "LOCAL";
}

const BookingMaterial: React.FC<IProps> = ({ type }) => {
  const blockContext: BlockView = useContext(BlockContext);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBookingMaterial>();
  const [data, setData] = useState<IDataBookingMaterial[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsBookingMaterial>({
    bookingId: {
      label: "Захиалгын ID",
      isView: true,
      isFiltered: false,
      dataIndex: ["booking", "id"],
      type: DataIndexType.MULTI,
    },
    bookingAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["booking", "bookingAt"],
      type: DataIndexType.DATE,
    },
    toWarehouseName: {
      label: "Зарлагын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["booking", "toWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    fromWarehouseName: {
      label: "Орлогын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["booking", "fromWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    materialCode: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "code"],
      type: DataIndexType.MULTI,
    },
    materialName: {
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "name"],
      type: DataIndexType.MULTI,
    },
    quantity: {
      label: "Тоо хэмжээ /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: ["quantity"],
      type: DataIndexType.NUMBER,
    },
    distributeQuantity: {
      label: "Тоо хэмжээ /хуваарилсан/",
      isView: true,
      isFiltered: false,
      dataIndex: ["distributeQuantity"],
      type: DataIndexType.NUMBER,
    },
    confirmQuantity: {
      label: "Тоо хэмжээ /олгосон/",
      isView: true,
      isFiltered: false,
      dataIndex: ["confirmQuantity"],
      type: DataIndexType.NUMBER,
    },
    status: {
      label: "Баримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["booking", "status"],
      type: DataIndexType.ENUM,
    },
    createdAt: {
      label: "Захиалга хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
  });
  const getData = async () => {
    blockContext.block();
    await BookingMaterialService.get()
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            {/* <Filtered
                columns={columns}
                isActive={(key, state) => {
                  onCloseFilterTag({
                    key: key,
                    state: state,
                    column: columns,
                    onColumn: (columns) => setColumns(columns),
                    params: params,
                    onParams: (params) => setParams(params),
                  });
                  getData(params ? params : {});
                }}
              /> */}

            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size={12}
            >
              {/* <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns: columns,
                      onColumns: (columns) => setColumns(columns),
                      params: params,
                      onParams: (params) => setParams(params),
                      getData: (params) => getData(params),
                    })
                  }
                /> */}
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
              <Image
                onClick={() => setIsFilter(!isFilter)}
                src={
                  isFilter
                    ? "/images/filterTrue.svg"
                    : "/images/filterFalse.svg"
                }
                width={24}
                height={24}
                alt="filter"
              />
            </Space>
          </Space>
        </Col>
        <Col span={isFilter ? 20 : 24}>
          <NewTable
            scroll={{
              x: undefined,
            }}
            rowKey={"id"}
            data={data}
            columns={columns}
            meta={meta}
            onColumns={setColumns}
            incomeFilters={filters}
          />
        </Col>
        <Col span={isFilter ? 4 : 0}>
          <div className="big-filter">
            <div className="title">
              <Title level={3}>Шүүлтүүр</Title>
              <ArrowRightOutlined />
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form layout="vertical">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item label="Баримтын дугаар">
                  <NewInput />
                </Form.Item>
                <Form.Item
                  style={{
                    alignSelf: "flex-end",
                  }}
                >
                  <Button htmlType="submit">Шүүх</Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BookingMaterial;
