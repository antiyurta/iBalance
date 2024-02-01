import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MaterialResourceSizeService } from "@/service/material/resource-size/service";
import {
  FilteredColumnsResourceSize,
  IDataResourceSize,
  IFilterResourceSize,
  IParamResourceSize,
} from "@/service/material/resource-size/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

const { Title } = Typography;

const DetailList = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataResourceSize[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterResourceSize>();
  const [params, setParams] = useState<IParamResourceSize>({
    page: 1,
    limit: 10,
  });
  const [columns, setColumns] = useState<FilteredColumnsResourceSize>({
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
    materialMeasurementName: {
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
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    downloadDay: {
      label: "Эргэц /хоногоор/",
      isView: true,
      isFiltered: false,
      dataIndex: ["downloadDay"],
      type: DataIndexType.NUMBER,
    },
    minResourceSize: {
      label: "Заавал байлгах хамгийн бага нөөцийн хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["minResourceSize"],
      type: DataIndexType.NUMBER,
    },
    minDownloadSize: {
      label: "Дараагийн татан авалтын хамгийн бага хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["minDownloadSize"],
      type: DataIndexType.NUMBER,
    },
  });
  const getData = async (params: IParamResourceSize) => {
    blockContext.block();
    await MaterialResourceSizeService.get(params)
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
    getData(params);
  }, []);
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
export default DetailList;
