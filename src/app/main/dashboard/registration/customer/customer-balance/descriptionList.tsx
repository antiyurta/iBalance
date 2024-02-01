"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { DataIndexType, Meta } from "@/service/entities";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { NewTable } from "@/components/table";
import { Col, Row, Space } from "antd";
import { balanceAccountService } from "@/service/consumer/initial-balance/account/service";
import {
  FilteredColumnsBalanceAccount,
  IDataBalanceAccount,
  IFilterBalanceAccount,
  IParamBalanceAccount,
} from "@/service/consumer/initial-balance/account/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  onReload: boolean;
  onEdit?: (row: IDataBalanceAccount) => void;
  onDelete?: (id: number) => void;
}
const key = "customer/balance/description-list";
const DescriptionList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [data, setData] = useState<IDataBalanceAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBalanceAccount>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsBalanceAccount>({
    consumerCode: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    consumerName: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "name"],
      type: DataIndexType.STRING_CONSUMER_NAME,
    },
    consumerSectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["balance", "consumer", "section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    accountCode: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "code"],
      type: DataIndexType.MULTI,
    },
    accountName: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["account", "name"],
      type: DataIndexType.MULTI,
    },
    amount: {
      label: "Дансны эхний үлдэгдэл",
      isView: true,
      isFiltered: false,
      dataIndex: ["amount"],
      type: DataIndexType.VALUE,
    },
    date: {
      label: "Авлага үүссэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["date"],
      type: DataIndexType.DATE,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.USER,
    },
  });
  const getData = async () => {
    blockContext.block();
    const params: IParamBalanceAccount = { ...param };
    await balanceAccountService
      .get(params)
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
    getData();
  }, [param, onReload]);
  return (
    <div>
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
              x: 1400,
            }}
            rowKey="id"
            data={data}
            meta={meta}
            columns={columns}
            onColumns={(columns) => setColumns(columns)}
            incomeFilters={filters}
            isEdit={true}
            onEdit={(row) => onEdit?.(row)}
            isDelete={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default DescriptionList;
