import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { AntTable, NewTable } from "@/components/table";
import { NewInput, NewSelect } from "@/components/input";
import { ArrowRightOutlined } from "@ant-design/icons";
import { DataIndexType } from "@/service/entities";
import NewModal from "@/components/modal";
import DateIntervalForm from "@/components/dateIntervalForm";
import { StorageSerivce } from "@/service/material/storage/service";
import { IDataStorage } from "@/service/material/storage/entities";
import { IDataConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
const { Title } = Typography;

const ListOfReceipt = () => {
  const [lockForm] = Form.useForm();
  const [storagies, setStoragies] = useState<IDataStorage[]>([]);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [isOpenLockModal, setIsOpenLockModal] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [columns, setColumns] = useState<any>({
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
  const getStorage = async () => {
    await StorageSerivce.get().then((response) => {
      if (response.success) {
        setStoragies(response.response.data);
      }
    });
  };
  const getConsumers = async () => {
    await ConsumerService.get().then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  useEffect(() => {
    getStorage();
    getConsumers();
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
                onClick={() => setIsOpenLockModal(true)}
                src={"/images/lock.svg"}
                width={24}
                height={24}
                alt="lock"
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
            columns={columns}
            meta={{}}
            onColumns={function (columns: any): void {
              throw new Error("Function not implemented.");
            }}
            newParams={undefined}
            onParams={function (params: any): void {
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
        title="Гүйлгээ түгжих"
        open={isOpenLockModal}
        onCancel={() => setIsOpenLockModal(false)}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Form form={lockForm} layout="vertical">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <DateIntervalForm
                customStyle={{
                  intervalStyle: {
                    minWidth: 120,
                  },
                  dateStyle: {
                    minWidth: 220,
                  },
                }}
                form={lockForm}
              />
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Баримтын дугаар"
                name="reportName"
              >
                <NewSelect
                  options={[
                    {
                      label: "Бүгд",
                      value: null,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Байршил"
                name="storageId"
              >
                <NewSelect
                  options={[
                    {
                      label: "Бүгд",
                      value: null,
                    },
                    ...storagies?.map((storagies) => ({
                      label: storagies.name,
                      value: storagies.id,
                    })),
                  ]}
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Харилцагчийн нэр"
                name="consumerId"
              >
                <NewSelect
                  allowClear
                  showSearch
                  virtual={false}
                  optionFilterProp="children"
                  filterOption={(input, label) =>
                    (label?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      label: "Бүгд",
                      value: null,
                    },
                    ...consumers?.map((consumer) => ({
                      label: consumer.name,
                      value: consumer.id,
                    })),
                  ]}
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Гүйлгээний төлөв"
                name="status"
              >
                <NewSelect
                  options={[
                    {
                      label: "Бүгд",
                      value: null,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                style={{
                  width: "100%",
                }}
                label="Гүйлгээний цонх"
                name="window"
              >
                <NewSelect
                  options={[
                    {
                      label: "Бүгд",
                      value: null,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Шүүх
                </Button>
              </Form.Item>
            </div>
          </Form>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "#DEE2E6",
            }}
          />
          <AntTable
            columns={[
              {
                title: "Баримтын дугаар",
              },
              {
                title: "Баримтын огноо",
              },
              {
                title: "Байршил",
              },
              {
                title: "Орлогын тоо",
              },
              {
                title: "Орлогын тоо хэмжээ",
              },
              {
                title: "Зарлагын тоо",
              },
              {
                title: "Харилцагчийн нэр",
              },
              {
                title: "Гүйлгээ түгжсэн эсэх",
              },
              {
                title: "Гүйлгээний утга",
              },
            ]}
          />
        </div>
      </NewModal>
    </div>
  );
};
export default ListOfReceipt;
