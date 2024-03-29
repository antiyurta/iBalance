import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
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
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";
interface IProps {
  onEdit: (row: IDataMaterial) => void;
}
const key = "inventory/stock-of-commodities";
const Thumbnail = (props: IProps) => {
  const { onEdit } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
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
      materialType: MaterialType.Material,
    }).then((response) => {
      setMaterialSections(response.response);
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
        getData({ ...param });
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getMaterialSections();
  }, []);
  useEffect(() => {
    getData({ ...param });
  }, [param]);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={materialSections}
            onClick={(sectionNames) => {
              dispatch(
                changeParam({
                  ...param,
                  filters: [
                    {
                      dataIndex: ["section", "name"],
                      operator: "IN",
                      filter: sectionNames,
                    },
                  ],
                })
              );
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
