import Image from "next/image";
import { useContext, useEffect, useState } from "react";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { NewTable } from "@/components/table";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { Col, Row, Space } from "antd";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import { FilteredColumnsMaterial, IDataMaterial, IFilterMaterial, IParamMaterial, MaterialType } from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { BalanceService } from "@/service/material/balance/service";

interface IProps {
  isReload: boolean;
  onEdit: (row: IDataMaterial) => void;
}

const Thumbnail = (props: IProps) => {
  const { isReload, onEdit } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [params, setParams] = useState<IParamMaterial>({
    page: 1,
    limit: 10,
  });
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMaterial>();
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);
  const [columns, setColumns] = useState<FilteredColumnsMaterial>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: "code",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      label: "Бараа материалын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["section", "name"],
      type: DataIndexType.MULTI,
    },
    measurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["measurement", "name"],
      type: DataIndexType.MULTI,
    },
    countPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: "countPackage",
      type: DataIndexType.NUMBER,
    },
    balanceQty: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: "balanceQty",
      type: DataIndexType.NUMBER,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const getData = async (param: IParamMaterial) => {
    blockContext.block();
    params.isBalanceRel = true;
    const prm: IParamMaterial = {
      ...params,
      ...param,
    }
    setParams(prm);
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    }).finally(() => {
      blockContext.unblock();
    });
  };
  const getMaterialSection = async () => {
    await MaterialSectionService.get({
      materialTypes: [MaterialType.Material],
    }).then((response) => {
      setSections(response.response.data);
    });
  };
  const onDeleteBeginingBalance = async (id: number) => {
    await BalanceService.remove(id).then((response) => {
      if (response.success) {
        getData(params);
      }
    });
  };
  useEffect(() => {
    getData(params);
    getMaterialSection();
  }, []);
  useEffect(() => {
    getData(params);
  }, [isReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={sections}
            isLeaf={false}
            extra="HALF"
            onClick={(keys) => {
              onCloseFilterTag({
                key: "materialSectionId",
                state: true,
                column: columns,
                onColumn: (columns) => setColumns(columns),
                params: params,
                onParams: (params) => setParams(params),
              });
              getData({
                page: 1,
                limit: 10,
                materialSectionId: keys,
              });
            }}
          />
        </Col>
        <Col md={24} lg={14} xl={18}>
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
                    getData(params);
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
                        params: params,
                        onParams: (params) => setParams(params),
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
                    src={"/images/UploadIcon.svg"}
                    width={24}
                    height={24}
                    alt="uploadIcon"
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
                  x: 1000,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onChange={(params) => getData(params)}
                onColumns={(columns) => setColumns(columns)}
                newParams={params}
                onParams={(params) => setParams(params)}
                incomeFilters={filters}
                isEdit={true}
                isDelete={true}
                onEdit={(row) => onEdit(row)}
                onDelete={(id) => onDeleteBeginingBalance(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Thumbnail;
