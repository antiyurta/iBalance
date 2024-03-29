import Image from "next/image";
import { useContext, useEffect, useState } from "react";

//components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { NewTable } from "@/components/table";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { Col, Row, Space } from "antd";
import {
  FilteredColumnsBalance,
  IDataBalance,
  IFilterBalance,
  IParamBalance,
} from "@/service/material/balance/entities";
import { BalanceService } from "@/service/material/balance/service";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
const key = "inventory/beginning-balance/detailed";
const Detailed = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IDataBalance[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBalance>();
  const [columns, setColumns] = useState<FilteredColumnsBalance>({
    materialCode: {
      label: "Дотоод код",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "code"],
      type: DataIndexType.MULTI,
    },
    materialName: {
      label: "Барааны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "name"],
      type: DataIndexType.MULTI,
    },
    materialSectionId: {
      label: "Бараа материалын бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "section", "name"],
      type: DataIndexType.MULTI,
    },
    materialMeasurementId: {
      label: "Хэмжих нэгж",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "measurement", "name"],
      type: DataIndexType.MULTI,
    },
    materialCountPackage: {
      label: "Багц доторх тоо",
      isView: true,
      isFiltered: false,
      dataIndex: ["material", "countPackage"],
      type: DataIndexType.MULTI,
    },
    warehouseId: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    purchaseAt: {
      label: "Худалдан авсан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["purchaseAt"],
      type: DataIndexType.DATE,
    },
    expirationAt: {
      label: "Хугацаа дуусах огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["expirationAt"],
      type: DataIndexType.DATE,
    },
    quantity: {
      label: "Эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["quantity"],
      type: DataIndexType.NUMBER,
    },
  });
  const getData = async (params: IParamBalance) => {
    blockContext.block();
    await BalanceService.get(params)
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
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData({ ...param });
  }, [param]);
  return (
    <Row gutter={[12, 24]}>
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
        />
      </Col>
    </Row>
  );
};
export default Detailed;
