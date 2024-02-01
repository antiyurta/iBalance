import { Button, Col, Form, Row, Space, Tooltip, Typography } from "antd";
import Image from "next/image";
import {
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  DeleteOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { NewTable, Column } from "@/components/table";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import CreateOrder from "./createOrder";
import { TabType } from "@/service/order-distribution/entities";
import {
  BookingStatus,
  FilteredColumnsBooking,
  IDataBooking,
  IParamBooking,
} from "@/service/booking/entities";
import { DataIndexType, Meta } from "@/service/entities";
import Filtered from "@/components/table/filtered";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BookingService } from "@/service/booking/service";
import ColumnSettings from "@/components/columnSettings";

const { Title } = Typography;

const Distribution = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [params, setParams] = useState<IParamBooking>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataBooking[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [selectedRow, setSelectedRow] = useState<IDataBooking>();
  const [columns, setColumns] = useState<FilteredColumnsBooking>({
    code: {
      label: "Захиалгын ID",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    bookingAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["bookingAt"],
      type: DataIndexType.DATE,
    },
    toWarehouseId: {
      label: "Зарлагын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["toWarehouse", "name"],
      type: DataIndexType.MULTI,
    },
    consumerId: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    materialQuantity: {
      label: "Тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["materialQuantity"],
      type: DataIndexType.MULTI,
    },
    bookingQuantity: {
      label: "Тоо хэмжээ /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: ["bookingQuantity"],
      type: DataIndexType.MULTI,
    },
    payAmount: {
      label: "Төлөх дүн /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: ["payAmount"],
      type: DataIndexType.VALUE,
    },
    totalAmount: {
      label: "Нийт дүн /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: ["totalAmount"],
      type: DataIndexType.VALUE,
    },
    materialDiscountAmount: {
      label: "Бараа материалын үнийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["materialDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    consumerDiscountAmount: {
      label: "Харилцагчийн хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumerDiscountAmount"],
      type: DataIndexType.VALUE,
    },
    status: {
      label: "Баримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["status"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Захиалга өгсөн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    createdBy: {
      label: "Захиалга өгсөн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  const getData = async (params: IParamBooking) => {
    await BookingService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    getData(params);
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
            <Filtered columns={columns} />
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size={12}
            >
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                  })
                }
              />
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
            onColumns={function (columns: any): void {
              throw new Error("Function not implemented.");
            }}
            incomeFilters={undefined}
          >
            <Column
              title="Хуваарилалт хийх"
              render={(row: IDataBooking) => {
                const { status } = row;
                if (status == BookingStatus.New) {
                  return (
                    <div
                      style={{
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: `repeat(2, minmax(0,1fr))`,
                      }}
                    >
                      <Tooltip title="Хуваарилах">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<DeploymentUnitOutlined />}
                          onClick={() => {
                            setIsOpenModal(true);
                            setSelectedRow(row);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Цуцлах">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => setIsOpenModal(true)}
                        />
                      </Tooltip>
                    </div>
                  );
                } else if (status == BookingStatus.Refund) {
                  return (
                    <Tooltip title="Сэргээх">
                      <Button
                        type="dashed"
                        danger
                        shape="circle"
                        icon={<ImportOutlined />}
                      />
                    </Tooltip>
                  );
                }
              }}
            />
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
        title="Борлуулалтын захиалга"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <CreateOrder
          type={TabType.DISTRIBUTION}
          isEdit={true}
          isFormAdd={false}
          row={selectedRow}
        />
      </NewModal>
    </div>
  );
};
export default Distribution;
