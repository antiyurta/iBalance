import { useState } from "react";
import { ITabs, Type } from "./index";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { NewTable } from "@/components/table";
import { NewInput } from "@/components/input";
import { ArrowRightOutlined } from "@ant-design/icons";
import { DataIndexType } from "@/service/entities";
import NewModal from "@/components/modal";
import Create from "./create";
const { Title } = Typography;

interface IProps extends ITabs {
  type: Type;
}

const ListOfReceipt = (props: IProps) => {
  const { type, grid, columns, order } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [salesColumns, setSalesColumns] = useState<any>({
    orderNumber: {
      label: "Захиалгын ID",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    saleTarget: {
      label: "Зарлагын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    count: {
      label: "Тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityOrder: {
      label: "Тоо хэмжээ /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityDis: {
      label: "Тоо хэмжээ /хуваарилсан/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityGrant: {
      label: "Тоо хэмжээ /олгосон/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    paidAmountOrder: {
      label: "Төлөх дүн /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    paidAmountGrant: {
      label: "Төлөх дүн /олгосон/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    ebarimtStatus: {
      label: "Баримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
  });
  const [internamColumns, setInternamColumns] = useState<any>({
    orderNumber: {
      label: "Захиалгын ID",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    saleTarget: {
      label: "Зарлагын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    disTarget: {
      label: "Орлогын байршил",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    count: {
      label: "Тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityOrder: {
      label: "Тоо хэмжээ /захиалга/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityDis: {
      label: "Тоо хэмжээ /хуваарилсан/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    quantityGrant: {
      label: "Тоо хэмжээ /олгосон/",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    ebarimtStatus: {
      label: "Баримтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    saleDate: {
      label: "Захиалга хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    orderedMan: {
      label: "Захиалга өгсөн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
  });
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
            data={[
              {
                id: 1,
                test: false,
              },
              {
                id: 2,
                test: true,
              },
            ]}
            columns={type === "SALES" ? salesColumns : internamColumns}
            meta={{}}
            onColumns={function (columns: any): void {
              throw new Error("Function not implemented.");
            }}
            incomeFilters={undefined}
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
      <NewModal
        width={1400}
        title="Борлуулалтын захиалга"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <Create
          type={type}
          grid={grid}
          isEdit={true}
          order={order}
          columns={columns}
        />
      </NewModal>
    </div>
  );
};
export default ListOfReceipt;
