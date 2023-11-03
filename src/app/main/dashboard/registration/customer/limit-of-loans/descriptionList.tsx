"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

//components
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  unDuplicate,
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

interface IProps {
  onReload: boolean;
  onEdit?: (row: IDataLimitOfLoans) => void;
  onDelete?: (id: number) => void;
}

const DescriptionList = (props: IProps) => {
  const { onReload, onEdit, onDelete } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [data, setData] = useState<IDataLimitOfLoansAccount[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterLimitOfLoansAccount>();
  const [params, setParams] = useState<IParamLimitOFloansAccount>({});
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
      dataIndex: "amount",
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
      dataIndex: "updatedAt",
      type: DataIndexType.MULTI,
    },
  });
  const getData = async (param: IParamLimitOFloansAccount) => {
    blockContext.block();
    var prm: IParamLimitOFloansAccount = {
      ...param,
      ...params,
      queries: params.queries,
    };
    if (param.queries?.length) {
      const incomeParam = param.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, params), ...param.queries];
    }
    setParams(prm);
    await limitOfLoansAccountService
      .get(prm)
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
    getData({ page: 1, limit: 10 });
  }, [onReload]);
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
            onChange={(params) => getData(params)}
            onColumns={(columns) => setColumns(columns)}
            newParams={params}
            onParams={(params) => setParams(params)}
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
