import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
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
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
interface IProps {
  onReload: boolean;
  onEdit: (row: IDataMembership) => void;
  onDelete: (id: number) => void;
}
const key = "membership-card/card-list";
const CardList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const [data, setData] = useState<IDataMembership[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterMembership>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsMembership>({
    name: {
      label: "Карт эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    isSave: {
      label: "Оноо хуримтлуулдаг эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isSave"],
      type: DataIndexType.BOOLEAN,
    },
    isBalance: {
      label: "Үлдэгдэлтэй эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isBalance"],
      type: DataIndexType.BOOLEAN,
    },
    isPercent: {
      label: "Хөнгөлөлт хувиар эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isPercent"],
      type: DataIndexType.BOOLEAN,
    },
    discount: {
      label: "Хөнгөлөлт",
      isView: true,
      isFiltered: false,
      dataIndex: ["discount"],
      type: DataIndexType.VALUE,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["isActive"],
      type: DataIndexType.BOOLEAN,
    },
    limitDiscount: {
      label: "Ашиглах боломжтой онооны дээд хязгаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["limitDiscount"],
      type: DataIndexType.VALUE,
    },
    isSale: {
      label: "Борлуулдаг эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["isSale"],
      type: DataIndexType.BOOLEAN,
    },
    description: {
      label: "Тайлбар",
      isView: true,
      isFiltered: false,
      dataIndex: ["description"],
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
      dataIndex: ["updatedAt"],
      type: DataIndexType.USER,
    },
  });
  // Жагсаалтын өгөгдөл дуудаж авчирна
  const getData = async () => {
    const params: IParamMembership = { ...param };
    await MembershipService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setFilters(response.response.filter);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [onReload, param]);

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
                        onColumns: setColumns,
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
                  x: 1700,
                }}
                rowKey="id"
                data={data}
                meta={meta}
                columns={columns}
                onColumns={setColumns}
                incomeFilters={filters}
                isEdit
                isDelete
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
