import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  FilteredColumnsMaterial,
  IDataMaterial,
  IFilterMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialService } from "@/service/material/service";
import { MaterialResourceSizeService } from "@/service/material/resource-size/service";
import { MaterialSectionService } from "@/service/material/section/service";

const { Title } = Typography;
interface IProps {
  onEdit: (row: IDataMaterial) => void;
}

const Thumbnail = (props: IProps) => {
  const { onEdit } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [params, setParams] = useState<IParamMaterial>({
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [filters, setFilters] = useState<IFilterMaterial>();
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [columns, setColumns] = useState<FilteredColumnsMaterial>({
    code: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Бараа материалын нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
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
      dataIndex: ["countPackage"],
      type: DataIndexType.MULTI,
    },
    minResourceSize: {
      label: "Заавал байлгах хамгийн бага нөөцийн хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["minResourceSize"],
      type: DataIndexType.MULTI,
    },
    minDownloadSize: {
      label: "Дараагийн татан авалтын хамгийн бага хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["minDownloadSize"],
      type: DataIndexType.MULTI,
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
      type: DataIndexType.MULTI,
    },
  });

  const getMaterialSections = async () => {
    await MaterialSectionService.get({
      materialTypes: [MaterialType.Material],
    }).then((response) => {
      setMaterialSections(response.response.data);
    });
  };
  const getData = async (params: IParamMaterial) => {
    blockContext.block();
    params.isResourceSizeRel = true;
    params.isActive = [true];
    await MaterialService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const onDeleteMaterialResourceSize = (id: number) => {
    MaterialResourceSizeService.remove(id).then((response) => {
      if (response.success) {
        getData(params);
      }
    });
  };
  useEffect(() => {
    getMaterialSections();
    getData(params);
  }, []);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <>
          <Col md={24} lg={16} xl={19}>
            <Space size={24}>
              <Title level={3}>
                Үндсэн бүртгэл / Бараа материал / Зохистой нөөцийн хэмжээ
              </Title>
            </Space>
          </Col>
          <Col md={24} lg={8} xl={5}>
            <Input.Search />
          </Col>
        </>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={materialSections}
            extra="HALF"
            isLeaf={false}
            onClick={(keys, isLeaf) => {
              onCloseFilterTag({
                key: "materialSectionId",
                state: true,
                column: columns,
                onColumn: (columns) => setColumns(columns),
              });
              getData({
                page: 1,
                limit: 10,
                materialSectionId: keys,
              });
              if (isLeaf) {
                getData({
                  page: 1,
                  limit: 10,
                  materialSectionId: keys,
                });
              }
            }}
          />
        </Col>
        <Col md={24} lg={14} xl={18}>
          <Row gutter={[0, 12]}>
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
                scroll={{ x: 1400 }}
                rowKey="id"
                doubleClick={true}
                data={data}
                meta={meta}
                columns={columns}
                onColumns={(columns) => setColumns(columns)}
                incomeFilters={filters}
                isEdit={true}
                onEdit={(row) => onEdit(row)}
                isDelete={true}
                onDelete={(id) => onDeleteMaterialResourceSize(id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Thumbnail;
