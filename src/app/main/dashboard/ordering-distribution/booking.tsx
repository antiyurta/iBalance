import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { NewTable, Column } from "@/components/table";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import {
  BookingStatus,
  FilteredColumnsBooking,
  IDataBooking,
  IFilterBooking,
} from "@/service/booking/entities";
import { DataIndexType, IParam, Meta } from "@/service/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { BookingService } from "@/service/booking/service";
import LocalOrder from "./order-distribution/local-order";
import SaleOrder from "./sales-order-distribution/sale-order";

const { Title } = Typography;
interface IProps {
  type: "SALE" | "LOCAL";
  status: BookingStatus;
  params?: IParam;
}
const Booking: React.FC<IProps> = ({ type, status, params }) => {
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [data, setData] = useState<IDataBooking[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBooking>();
  const [selectedBooking, setSelectedBooking] = useState<IDataBooking>();
  const [columns, setColumns] = useState<FilteredColumnsBooking>({
    id: {
      label: "Захиалгын ID",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.MULTI,
    },
    bookingAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["bookingAt"],
      type: DataIndexType.DATE,
    },
    fromWarehouseName: {
      label: "Орлогын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["fromWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    toWarehouseName: {
      label: "Зарлагын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["toWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    materialQuantity: {
      label: "Тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["materialQuantity"],
      type: DataIndexType.NUMBER,
    },
    bookingQuantity: {
      label: "Тоо хэмжээ /захилга/",
      isView: true,
      isFiltered: false,
      dataIndex: ["bookingQuantity"],
      type: DataIndexType.NUMBER,
    },
    status: {
      label: "Баримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["status"],
      type: DataIndexType.ENUM,
    },
    createdAt: {
      label: "Захиалга хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATETIME,
    },
    createdBy: {
      label: "Захиалга өгсөн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdByUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  const getData = async () => {
    blockContext.block();
    await BookingService.get(params)
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
  }, [params]);
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
            isEdit
            isDelete
            onEdit={(row) => {
              setIsOpenModal(true);
              setSelectedBooking(row);
            }}
          >
            {status == "DISTRIBUTE" && (
              <Column
                title="Хуваарилалт хийх"
                dataIndex={"test"}
                render={(_, record: IDataBooking) => (
                  <>
                    {record.status == "NEW" && (
                      <button
                        onClick={() => {
                          setIsOpenModal(true);
                          setSelectedBooking(record);
                        }}
                        className="app-button-regular"
                        style={{
                          height: 22,
                          fontWeight: 400,
                          width: 100,
                        }}
                      >
                        {type == "SALE" && "Хуваарилах"}
                        {type == "LOCAL" && "Зөвшөөрөх"}
                      </button>
                    )}
                    {record.status == "DISTRIBUTE_IGNORE" && (
                      <button
                        className="app-button-danger"
                        style={{
                          height: 22,
                          fontWeight: 400,
                          width: 100,
                        }}
                      >
                        Сэргээх
                      </button>
                    )}
                  </>
                )}
              />
            )}
          </NewTable>
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
      <NewModal
        width={1400}
        title="Дотоод захиалга"
        open={isOpenModal}
        footer={null}
        onCancel={() => setIsOpenModal(false)}
      >
        {type == "LOCAL" && (
          <LocalOrder
            selectedBooking={selectedBooking}
            status={status}
            isModal={setIsOpenModal}
          />
        )}
        {type == "SALE" && (
          <div>борлуулалт comming soon</div>
          // <SaleOrder
          //   type={"Distribute"}
          //   isEdit={false}
          //   isFormAdd={false}
          // />
        )}
      </NewModal>
    </div>
  );
};
export default Booking;
