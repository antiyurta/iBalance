import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import { Col, Row, Space } from "antd";
import Image from "next/image";
import { useContext, useState } from "react";

const ListOfGiftCard = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [columns, setColumns] = useState<any>({
    id: {
      label: "Баримтын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["docno"],
      type: DataIndexType.MULTI,
    },
    giftAt: {
      label: "Баримтын огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["giftAt"],
      type: DataIndexType.DATE,
    },
    warehouseName: {
      label: "Байршил",
      isView: true,
      isFiltered: false,
      dataIndex: ["warehouse", "name"],
      type: DataIndexType.MULTI,
    },
    code: {
      label: "Карын дугаар",
      isView: true,
      isFiltered: false,
      dataIndex: ["code"],
      type: DataIndexType.MULTI,
    },
    membershipName: {
      label: "Карт, эрхийн бичгийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["membership", "name"],
      type: DataIndexType.MULTI,
    },
    membershipDiscount: {
      label: "Худалдах нэгж үнэ",
      isView: true,
      isFiltered: false,
      dataIndex: ["membership", "discount"],
      type: DataIndexType.VALUE,
    },
    incomeQty: {
      label: "Орлого тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["incomeQty"],
      type: DataIndexType.NUMBER,
    },
    expenseQty: {
      label: "Зарлага тоо хэмжээ",
      isView: true,
      isFiltered: false,
      dataIndex: ["expenseQty"],
      type: DataIndexType.NUMBER,
    },
    totalAmount: {
      label: "Дүн(Орлого, Зарлага)",
      isView: true,
      isFiltered: false,
      dataIndex: ["totalAmount"],
      type: DataIndexType.VALUE,
    },
  });
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
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
            scroll={{ x: 1000 }}
            rowKey="id"
            doubleClick={true}
            data={data}
            meta={meta}
            columns={columns}
            onColumns={setColumns}
            incomeFilters={[]}
          />
        </Col>
      </Row>
    </div>
  );
};
export default ListOfGiftCard;
