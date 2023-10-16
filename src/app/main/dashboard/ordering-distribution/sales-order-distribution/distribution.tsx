import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { NewTable, Column } from "@/components/table";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import CreateOrder from "./createOrder";
import { TabType } from "./page";

const { Title } = Typography;

const Distribution = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [columnss, setColumnss] = useState<any>({});
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
            columns={columnss}
            meta={{}}
            onColumns={function (columns: any): void {
              throw new Error("Function not implemented.");
            }}
            newParams={undefined}
            onParams={function (params: any): void {
              throw new Error("Function not implemented.");
            }}
            incomeFilters={undefined}
          >
            <Column
              title="Хуваарилалт хийх"
              dataIndex={"test"}
              render={(text) =>
                text ? (
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
                ) : (
                  <button
                    onClick={() => setIsOpenModal(true)}
                    className="app-button-regular"
                    style={{
                      height: 22,
                      fontWeight: 400,
                      width: 100,
                    }}
                  >
                    Хуваарилах
                  </button>
                )
              }
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
        />
      </NewModal>
    </div>
  );
};
export default Distribution;
