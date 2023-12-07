import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsGiftCart,
  IDataGiftCart,
  IFilterGiftCart,
  IParamGiftCart,
} from "@/service/pos/gift-cart/entities";
import { GiftCartService } from "@/service/pos/gift-cart/service";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const ListOfGiftCard = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<FilteredColumnsGiftCart>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
      type: DataIndexType.MULTI,
    },
    giftAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "giftAt",
      type: DataIndexType.DATE,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: "giftAt",
      type: DataIndexType.MULTI,
    },
    membershipName: {
      label: "Карт, эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["membership", "name"],
      type: DataIndexType.MULTI,
    },
    unitAmount: {
      label: "Худалдах нэгж үнэ",
      isView: true,
      isFiltered: false,
      dataIndex: "unitAmount",
      type: DataIndexType.VALUE,
    },
    type: {
      label: "Төрөл",
      isView: true,
      isFiltered: false,
      dataIndex: "type",
      type: DataIndexType.MULTI,
    },
    quantity: {
      label: "Тоо хэмжээ(Орлого, Зарлага)",
      isView: true,
      isFiltered: false,
      dataIndex: "quantity",
      type: DataIndexType.NUMBER,
    },
    totalAmount: {
      label: "Дүн(Орлого, Зарлага)",
      isView: true,
      isFiltered: false,
      dataIndex: "totalAmount",
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<IDataGiftCart[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [params, setParams] = useState<IParamGiftCart>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterGiftCart>();
  const getData = async (params: IParamGiftCart) => {
    await GiftCartService.get(params).then((response) => {
      if (response.success) {
        setMeta(response.response.meta);
        setData(response.response.data);
      }
    })
  }
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
          />
        </Col>
      </Row>
    </div>
  );
};
export default ListOfGiftCard;
