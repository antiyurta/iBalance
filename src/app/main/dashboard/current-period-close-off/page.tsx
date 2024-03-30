"use client";

import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import { SettingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { App, Button, Col, Form, Row, Space, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "dayjs/locale/mn";
import Image from "next/image";
import { NewTable } from "@/components/table";
import {
  FilteredColumnsReportClosure,
  IColumnReportClosure,
  IDataReportClosure,
} from "@/service/report/report-closure/entities";
import { DataIndexType, Meta } from "@/service/entities";
import Column from "antd/es/table/Column";
import { DateType, IDataConfigCode } from "@/service/config-code/entities";
import { getParam, getQuarter } from "@/feature/common";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
import { ReportClosureService } from "@/service/report/report-closure/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import PageTitle from "@/components/page-title";
import NewModal from "@/components/modal";
import { ConfigCodeService } from "@/service/config-code/service";
import dayjs, { Dayjs } from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

const { Title } = Typography;
interface IFormPeriod {
  period: DateType;
  date: Dayjs;
}

const key = "current-period-close-off";
const CurrentPeriodCloseOff = () => {
  const { modal } = App.useApp();
  const blockContext: BlockView = useContext(BlockContext);
  const [dateType, setDateType] = useState<DateType>(DateType.Month);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IDataReportClosure[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IColumnReportClosure>();
  const [isConfigModal, setIsConfigModal] = useState<boolean>(false);
  const [closeForm] = Form.useForm<IFormPeriod>();
  const [form] = Form.useForm<IDataConfigCode>();
  const [columns, setColumns] = useState<FilteredColumnsReportClosure>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["id"],
      type: DataIndexType.MULTI,
    },
    period: {
      label: "Хаалтын үе",
      isView: true,
      isFiltered: false,
      dataIndex: ["period"],
      type: DataIndexType.MULTI,
    },
    year: {
      label: "Тайлант жил",
      isView: true,
      isFiltered: false,
      dataIndex: ["year"],
      type: DataIndexType.MULTI,
    },
    quarter: {
      label: "Тайлант улирал",
      isView: true,
      isFiltered: false,
      dataIndex: ["quarter"],
      type: DataIndexType.MULTI,
    },
    month: {
      label: "Тайлант сар",
      isView: true,
      isFiltered: false,
      dataIndex: ["month"],
      type: DataIndexType.MULTI,
    },
    currentAt: {
      label: "Тайлант үе",
      isView: true,
      isFiltered: false,
      dataIndex: ["currentAt"],
      type: DataIndexType.DATE,
    },
    isClose: {
      label: "Хаалтын төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isClose"],
      type: DataIndexType.BOOLEAN,
    },
    updatedBy: {
      label: "Өөрчлөлт оруулсан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["employee", "firstName"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт оруулсан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
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
        blockContext.block();
        values.date.month();
        ReportClosureService.post({
          period: values.period,
          year: values.date.year(),
          quarter: getQuarter(values.date.month()),
          month: values.period == DateType.Season ? null : values.date.month() + 1,
          isClose: true,
        })
          .then((response) => {
            if (response.success) {
              getData();
            }
          })
          .finally(() => blockContext.unblock());
      },
    });
  };
  const getData = () => {
    blockContext.block();
    ReportClosureService.get(param)
      .then((response) => {
        if (response.success) {
          setMeta(response.response.meta);
          setFilters(response.response.filter);
          setData(response.response.data);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const onFinish = (value: IDataConfigCode) => {
    blockContext.block();
    ConfigCodeService.post(value).finally(() => blockContext.unblock());
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current <= form.getFieldValue("openerAt").endOf("day");
  };
  const getDateType = (dateType: DateType): "year" | "quarter" | "month" => {
    if (dateType == DateType.Year) return "year";
    if (dateType == DateType.Season) return "quarter";
    return "month";
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param]);
  useEffect(() => {
    ConfigCodeService.get().then((response) => {
      if (response.success) {
        const { openerAt } = response.response;
        form.setFieldsValue({
          ...response.response,
          openerAt: openerAt !== null ? dayjs(openerAt) : dayjs(new Date()),
        });
      }
    });
  }, [isConfigModal]);
  return (
    <div>
      <PageTitle />
      <Row
        style={{
          paddingTop: 16,
        }}
        gutter={[0, 12]}
      >
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
              form={closeForm}
              layout="vertical"
              initialValues={{ period: DateType.Month }}
            >
              <Space size={12} align="end">
                <Form.Item label="Хаалтын төрөл" name="period">
                  <NewSelect
                    style={{
                      width: 130,
                    }}
                    onChange={(value) => setDateType(value)}
                    options={[
                      {
                        value: DateType.Year,
                        label: "Жил",
                      },
                      {
                        value: DateType.Season,
                        label: "Улирал",
                      },
                      {
                        value: DateType.Month,
                        label: "Сар",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Тайлант үе жил" name="date">
                  <NewDatePicker
                    picker={getDateType(closeForm.getFieldValue("period"))}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    Хаалт хийх
                  </Button>
                </Form.Item>
              </Space>
            </Form>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setIsConfigModal(true)}
            >
              Тохиргоо
            </Button>
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
            data={data}
            columns={columns}
            meta={meta}
            onColumns={setColumns}
            incomeFilters={filters}
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
      <NewModal
        title={"Тохиргоо"}
        open={isConfigModal}
        onCancel={() => setIsConfigModal(false)}
        footer={
          <Button
            type="primary"
            disabled={form.getFieldValue("openerAt")}
            onClick={() =>
              form.validateFields().then((values) => {
                onFinish(values);
              })
            }
          >
            Хадгалах
          </Button>
        }
      >
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
          <Form.Item label="Нээлтийн огноо" name={"openerAt"}>
            <NewDatePicker disabled={form.getFieldValue("openerAt")} />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
export default CurrentPeriodCloseOff;
