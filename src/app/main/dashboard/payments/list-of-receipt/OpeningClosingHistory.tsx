import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import { FilteredColumnsPosOpenClose, IDataPosOpenClose, IFilterPosOpenClose, IParamOpenClose } from "@/service/pos/open-close/entities";
import { OpenCloseService } from "@/service/pos/open-close/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const OpeningClosingHistory = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsPosOpenClose>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
    posId: {
      label: "Посын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "posId",
      type: DataIndexType.NUMBER,
    },
    openerUserId: {
      label: "Нээсэн ажилтан",
      isView: true,
      isFiltered: false,
      dataIndex: "openerUserId",
      type: DataIndexType.MULTI,
    },
    openerAmount: {
      label: "Нээсэн дүн",
      isView: true,
      isFiltered: false,
      dataIndex: "openerAmount",
      type: DataIndexType.MULTI,
    },
    closerUserId: {
      label: "Хаасан хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "closerUserId",
      type: DataIndexType.MULTI,
    },
    closerAt: {
      label: "Хаасан огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "closerAt",
      type: DataIndexType.MULTI,
    },
  });
  const [data, setData] = useState<IDataPosOpenClose[]>();
  const [params, setParams] = useState<IParamOpenClose>({
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterPosOpenClose>();
  const getData = async (params: IParamOpenClose) => {
    await OpenCloseService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
      }
    });
  };
  useEffect(() => {
    getData(params);
  }, []);
  return (
    <div>
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
            scroll={{ x: 1000 }}
            rowKey="id"
            doubleClick={true}
            data={data}
            meta={meta}
            columns={columns}
            onChange={getData}
            onColumns={setColumns}
            newParams={params}
            onParams={setParams}
            incomeFilters={filters}
            // addItems={items}
            // custom={(key, id) => itemClick(key, String(id))}
          />
        </Col>
      </Row>
    </div>
  );
};
export default OpeningClosingHistory;
