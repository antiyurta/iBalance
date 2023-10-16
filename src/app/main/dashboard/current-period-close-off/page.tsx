"use client";

import {
  NewDatePicker,
  NewInput,
  NewSearch,
  NewSelect,
} from "@/components/input";
import { SettingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { App, Button, Col, Form, Row, Space, Typography } from "antd";
import React, { useState } from "react";

import locale from "antd/es/date-picker/locale/mn_MN";
import "dayjs/locale/mn";
import Image from "next/image";
import { NewTable } from "@/components/table";
import {
  FilteredColumnsCurrentPeriodCloseOff,
  PeriodType,
} from "@/service/current-period-close-off/entities";
import { DataIndexType } from "@/service/entities";
import Column from "antd/es/table/Column";

const { Title } = Typography;

interface IFormPeriod {
  periodType: PeriodType;
  periodYear: string;
}

const CurrentPeriodCloseOff = () => {
  const { modal } = App.useApp();
  const [dateType, setDateType] = useState<PeriodType>("month");
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumnsCurrentPeriodCloseOff>({
    barimtNo: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    period: {
      label: "Хаалтын үе",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    reportPeriod: {
      label: "Тайлант үе",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    closingStatus: {
      label: "Хаалтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    updatedBy: {
      label: "Өөрчлөлт оруулсан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт оруулсан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "ebarimt",
      type: DataIndexType.MULTI,
    },
  });
  //
  const onClosePeriod = (values: IFormPeriod) => {
    modal.confirm({
      title: " ",
      icon: null,
      width: 280,
      content: (
        <>
          <Title
            level={2}
            style={{
              textAlign: "center",
            }}
          >
            Анхааруулга
          </Title>
          <Title
            level={2}
            style={{
              textAlign: "center",
            }}
          >
            Та тайлант үе хаахдаа итгэлтэй байна уу?
          </Title>
        </>
      ),
      onOk: () => {
        console.log("donee");
      },
    });
  };
  //
  return (
    <div>
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[0, 12]}
      >
        <Col md={24} lg={16} xl={19}>
          <Title level={3}>Тайлан үеийн хаалт</Title>
        </Col>
        <Col md={24} lg={8} xl={5}>
          <NewSearch />
        </Col>
        <Col span={24}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Form
              onFinish={onClosePeriod}
              layout="vertical"
              initialValues={{
                periodType: "month",
                interval: "that",
              }}
            >
              <Space size={12} align="end">
                <Form.Item label="Хаалтын төрөлт" name="periodType">
                  <NewSelect
                    style={{
                      width: 130,
                    }}
                    onChange={(value) => setDateType(value)}
                    options={[
                      {
                        value: "year",
                        label: "Жил",
                      },
                      {
                        value: "month",
                        label: "Сар",
                      },
                      {
                        value: "quarter",
                        label: "Улирал",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Тайлант үе" name="periedYear">
                  <NewDatePicker
                    locale={locale}
                    picker={dateType}
                    onChange={undefined}
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    Хаалт хийх
                  </Button>
                </Form.Item>
              </Space>
            </Form>
            <button
              className="app-button-regular"
              style={{
                height: 39,
                fontWeight: 400,
              }}
            >
              <SettingOutlined />
              Автомат тохиргоо
            </button>
          </div>
        </Col>
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
          >
            <Column
              title=" "
              dataIndex={"test"}
              render={(text) =>
                text ? (
                  <button
                    className="app-button-regular"
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
                    className="app-button-regular"
                    style={{
                      height: 22,
                      fontWeight: 400,
                      width: 100,
                    }}
                  >
                    Хаалт хийх
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
    </div>
  );
};
export default CurrentPeriodCloseOff;
