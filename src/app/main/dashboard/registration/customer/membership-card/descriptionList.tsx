import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import {
  DataIndexType,
  FilteredColumns,
  Meta,
} from "@/service/entities";
import {
  FilteredColumnsConsumerMembership,
  IDataConsumerMembership,
  IFilterConsumerMembership,
  IParamConsumerMembership,
} from "@/service/consumer/membership/entities";
import { ConsumerMembershipService } from "@/service/consumer/membership/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const DescriptionList = () => {
  const [newParams, setNewParams] = useState<IParamConsumerMembership>({});
  const [data, setData] = useState<IDataConsumerMembership[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterConsumerMembership>();
  const [columns, setColumns] = useState<FilteredColumnsConsumerMembership>({
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerLastname: {
      label: "Харилцагчийн овог",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "lastName"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "name"],
      type: DataIndexType.MULTI,
    },
    consumerIsIndividual: {
      label: "Хувь хүн эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isIndividual"],
      type: DataIndexType.BOOLEAN,
    },
    consumerPhone: {
      label: "Утасны дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "phone"],
      type: DataIndexType.MULTI,
    },
    consumerIsActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isActive"],
      type: DataIndexType.BOOLEAN,
    },
    consumerIsEmployee: {
      label: "Ажилтан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "isEmployee"],
      type: DataIndexType.BOOLEAN,
    },
    consumerSectionId: {
      label: "Бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    consumerEmail: {
      label: "И-мэйл хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "email"],
      type: DataIndexType.MULTI,
    },
    consumerAddress: {
      label: "Хаяг",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "address"],
      type: DataIndexType.MULTI,
    },
    consumerRegno: {
      label: "Харилцагчийн РД",
      isView: true,
      isFiltered: false,
      dataIndex: ["consumer", "regno"],
      type: DataIndexType.MULTI,
    },
    cardno: {
      label: "Картын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "cardno",
      type: DataIndexType.MULTI,
    },
    membershipName: {
      label: "Картын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["membership", "name"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Нээсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
    branch: {
      label: "Нээлгэсэн төв, салбар",
      isView: true,
      isFiltered: false,
      dataIndex: ["branch", "name"],
      type: DataIndexType.MULTI,
    },
    isClose: {
      label: "Хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isClose"],
      type: DataIndexType.BOOLEAN,
    },
    endAt: {
      label: "Дуусах огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["endAt"],
      type: DataIndexType.DATE,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  //
  const getData = async (params: IParamConsumerMembership) => {
    await ConsumerMembershipService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={24} xl={24}>
          <Row gutter={[24, 12]}>
            <Col sm={24}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size={12}
              >
                <Filtered
                  columns={columns}
                  isActive={(key, state) => {
                    onCloseFilterTag({
                      key: key,
                      state: state,
                      column: columns,
                      onColumn: (columns) => setColumns(columns),
                      params: newParams,
                      onParams: (params) => setNewParams(params),
                    });
                    getData(newParams);
                  }}
                />
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
                        params: newParams,
                        onParams: (params) => setNewParams(params),
                        getData: (params) => getData(params),
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
                </Space>
              </Space>
            </Col>
            <Col span={24}>
              <NewTable
                scroll={{
                  x: 1700,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onChange={(params) => getData(params)}
                onColumns={(columns) => setColumns(columns)}
                newParams={newParams}
                onParams={(params) => setNewParams(params)}
                incomeFilters={filters}
                onEdit={(row) => console.log(true, row)}
                onDelete={(id) => console.log(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default DescriptionList;
