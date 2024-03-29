import Image from "next/image";
import { useContext, useEffect, useState } from "react";

// components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/tree";
import Filtered from "@/components/table/filtered";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { NewTable } from "@/components/table";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { Col, Row, Space } from "antd";
import { IDataMaterialSection } from "@/service/material/section/entities";
import { MaterialSectionService } from "@/service/material/section/service";
import {
  FilteredColumnsMaterial,
  IDataMaterial,
  IFilterMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { BalanceService } from "@/service/material/balance/service";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { changeParam, newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  isReload: boolean;
  onEdit: (row: IDataMaterial) => void;
}
const key = "inventory/beginning-balance";
const Thumbnail = (props: IProps) => {
  const { isReload, onEdit } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [data, setData] = useState<IDataMaterial[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMaterial>();
  const [sections, setSections] = useState<IDataMaterialSection[]>([]);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
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
      type: DataIndexType.NUMBER,
    },
    balanceQty: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["balanceQty"],
      type: DataIndexType.NUMBER,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
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
  const getData = async (params: IParamMaterial) => {
    blockContext.block();
    params.isBalanceRel = true;
    const prm: IParamMaterial = {
      ...params,
      ...param,
    };
    await MaterialService.get(prm)
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
  const getMaterialSection = async () => {
    await MaterialSectionService.get({
      materialType: MaterialType.Material,
    }).then((response) => {
      setSections(response.response);
    });
  };
  const onDeleteBeginingBalance = async (id: number) => {
    await BalanceService.remove(id).then((response) => {
      if (response.success) {
        getData({ ...param });
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
    getMaterialSection();
  }, []);
  useEffect(() => {
    getData({ ...param });
  }, [param, isReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col md={24} lg={10} xl={6}>
          <NewDirectoryTree
            data={sections}
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
            <Col sm={24}>
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
                scroll={{
                  x: 1000,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onColumns={(columns) => setColumns(columns)}
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
