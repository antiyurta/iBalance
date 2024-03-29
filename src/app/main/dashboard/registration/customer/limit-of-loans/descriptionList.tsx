"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
//components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { NewTable } from "@/components/table";
// interface types
import {
  FilteredColumnsLimitOfLoansAccount,
  IDataLimitOfLoansAccount,
  IFilterLimitOfLoansAccount,
  IParamLimitOFloansAccount,
} from "@/service/limit-of-loans/account/entities";
import { DataIndexType, Meta } from "@/service/entities";
//service
import { limitOfLoansAccountService } from "@/service/limit-of-loans/account/service";
import { Col, Row, Space } from "antd";
import Export from "@/components/Export";
import { limitOfLoansService } from "@/service/limit-of-loans/service";
import { IDataLimitOfLoans } from "@/service/limit-of-loans/entities";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";

interface IProps {
  onReload: boolean;
  onEdit?: (row: IDataLimitOfLoans) => void;
  onDelete?: (id: number) => void;
}
const key = "customer/limit-of-loans/description-list";
const DescriptionList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataLimitOfLoansAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterLimitOfLoansAccount>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<FilteredColumnsLimitOfLoansAccount>({
    code: {
      label: "Харилцагчийн код",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "code"],
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Харилцагчийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "name"],
      type: DataIndexType.MULTI,
    },
    sectionId: {
      label: "Харилцагчийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "section", "name"],
      type: DataIndexType.STRING_SECTION,
    },
    isAccount: {
      label: "Дансаар тохируулсан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isAccount"],
      type: DataIndexType.BOOLEAN,
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
      label: "Зээлийн лимит /дансаарх/",
      isView: true,
      isFiltered: false,
      dataIndex: ["amount"],
      type: DataIndexType.VALUE,
    },
    isClose: {
      label: "Захиалга хаасан эсэх",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "isClose"],
      type: DataIndexType.BOOLEAN,
    },
    isActive: {
      label: "Төлөв",
      isView: true,
      isFiltered: false,
      dataIndex: ["lendLimit", "consumer", "isActive"],
      type: DataIndexType.BOOLEAN_STRING,
    },
    updatedBy: {
      label: "Өөрчлөлт оруулсан хэрэглэгч",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт оруулсан огноо",
      isView: false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.MULTI,
    },
  });
  const getData = async () => {
    blockContext.block();
    const params: IParamLimitOFloansAccount = { ...param };
    await limitOfLoansAccountService
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
  const onEditModal = async (lendLimitId: number) => {
    await limitOfLoansService.getById(lendLimitId).then((response) => {
      if (response.success) {
        onEdit?.(response.response);
      }
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
              <Export docName="dsad" />
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
            onEdit={(row: IDataLimitOfLoansAccount) =>
              onEditModal(row.lendLimitId)
            }
            isDelete={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default DescriptionList;
