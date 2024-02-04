import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  FilteredColumnsDocument,
  IDataDocument,
  IFilterDocument,
  IParamDocument,
  MovingStatus,
  getDocumentColumns,
} from "@/service/document/entities";
import { DocumentService } from "@/service/document/service";
import { Meta } from "@/service/entities";
import { Col, Row } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { DocumentEdit } from "./document-edit";
import LockDocument from "./lock-document";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
interface IProps {
  movingStatus?: MovingStatus;
}
export const DocumentList = (props: IProps) => {
  const { movingStatus } = props;
  const key = `document/${movingStatus}`;
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IDataDocument[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterDocument>();
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<IDataDocument>();
  const [columns, setColumns] = useState<FilteredColumnsDocument>(
    getDocumentColumns(movingStatus)
  );
  const [isReload, setIsReload] = useState<boolean>(false);
  const getData = async () => {
    const params: IParamDocument = {
      ...param,
    };
    if (movingStatus) params.movingStatus = movingStatus;
    // else params.hideMovingStatuses = [MovingStatus.PosSaleReturn];
    blockContext.block();
    await DocumentService.get(params)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const editDocument = async (row: IDataDocument) => {
    if (row.isLock) {
      openNofi("warning", "Баримт түгжигдсэн байна.");
    } else {
      blockContext.block();
      await DocumentService.getById(row.id)
        .then((response) => {
          if (response.success) {
            setSelectedDocument(response.response);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await DocumentService.remove(id)
      .then((response) => {
        if (response.success) {
          getData();
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param, isReload]);
  return (
    <div>
      <Row gutter={[12, 24]}>
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered columns={columns} />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
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
                  src={"/images/DownloadIcon.svg"}
                  width={24}
                  height={24}
                  alt="downloadIcon"
                />
                <LockDocument movingStatus={movingStatus} />
                <Image
                  onClick={() => setIsFilterToggle(!isFilterToggle)}
                  src={
                    isFilterToggle
                      ? "/images/filterTrue.svg"
                      : "/images/filterFalse.svg"
                  }
                  width={24}
                  height={24}
                  alt="filter"
                />
              </div>
            </div>
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              data={data}
              meta={meta}
              columns={columns}
              onColumns={setColumns}
              incomeFilters={filters}
              isEdit
              isDelete={movingStatus ? true : false}
              onEdit={editDocument}
              onDelete={onDelete}
            />
          </div>
        </Col>
        <Col span={isFilterToggle ? 4 : 0}>
          {/* <CommandFilterForm
            onToggle={() => setIsFilterToggle(!isFilterToggle)}
            getData={getData}
          /> */}
        </Col>
      </Row>
      <DocumentEdit
        selectedDocument={selectedDocument}
        movingStatus={selectedDocument?.movingStatus}
        isReload={isReload}
        setIsReload={setIsReload}
      />
    </div>
  );
};
