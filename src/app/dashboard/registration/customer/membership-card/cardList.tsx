import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FilteredColumnsMembership,
  IDataMembership,
  IFilterMembership,
  IParamMembership,
} from "@/service/reference/membership/entities";
import { MembershipService } from "@/service/reference/membership/service";

interface IProps {
  onReload: boolean;
  onEdit: (row: IDataMembership) => void;
  onDelete: (id: number) => void;
}

const CardList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const [params, setParams] = useState<IParamMembership>();
  const [data, setData] = useState<IDataMembership[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMembership>();
  const [column, setColumn] = useState<FilteredColumnsMembership>({
    cardNo: {
      label: "Картын ID",
      isView: true,
      isFiltered: false,
      dataIndex: "cardNo",
      type: DataIndexType.STRING,
    },
    name: {
      label: "Карт эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.STRING,
    },
    isSave: {
      label: "Оноо хуримтлуулдаг эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isSave",
      type: DataIndexType.BOOLEAN,
    },
    isPercent: {
      label: "Хөнгөлөлт хувиар эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isPercent",
      type: DataIndexType.BOOLEAN,
    },
    discount: {
      label: "Хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: "discount",
      type: DataIndexType.NUMBER,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: "isActive",
      type: DataIndexType.BOOLEAN,
    },
    limitDiscount: {
      label: "Ашиглах боломжтой онооны дээд хязгаар",
      isView: true,
      isFiltered: false,
      dataIndex: "limitDiscount",
      type: DataIndexType.NUMBER,
    },
    isSale: {
      label: "Борлуулдаг эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: "isSale",
      type: DataIndexType.BOOLEAN,
    },
  });
  // Жагсаалтын өгөгдөл дуудаж авчирна
  const getData = async (params: IParamMembership) => {
    await MembershipService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);

  useEffect(() => {
    if (onReload) {
      getData({ page: 1, limit: 10 });
    }
  }, [onReload]);

  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={14} xl={24}>
          <Row gutter={[0, 12]}>
            <Col sm={24}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size={12}
              >
                <Filtered
                  columns={column}
                  isActive={(key, state) => {
                    onCloseFilterTag({
                      key,
                      state,
                      column,
                      onColumn: setColumn,
                      params,
                      onParams: setParams,
                    });
                    getData(params ? params : { page: 1, limit: 10 });
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
                    columns={column}
                    columnIndexes={(arg1, arg2) =>
                      findIndexInColumnSettings({
                        newRowIndexes: arg1,
                        unSelectedRow: arg2,
                        columns: column,
                        onColumns: setColumn,
                        params,
                        onParams: setParams,
                        getData,
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
                columns={column}
                onChange={getData}
                onColumns={setColumn}
                newParams={params}
                onParams={setParams}
                incomeFilters={filters}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default CardList;
