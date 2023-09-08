import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewSearch } from "@/components/input";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import { IParams } from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { Form } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  ComponentsType: string;
  onClickModal?: () => void;
}

const UnitOfMeasure = (props: IProps) => {
  const { ComponentsType, onClickModal } = props;
  const tableWidth = "calc(100% - 262px)";
  const [form] = Form.useForm();
  const [data, setData] = useState<any>();
  const [newParams, setNewParams] = useState<IParams>({});
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenTree, setIsOpenTree] = useState<boolean>(true);
  const [columns, setColumns] = useState<FilteredColumns>({
    shortName: {
      label: "Богино нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "shortName",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Хэмжих нэгжийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    type: {
      label: "Хэмжих нэгжийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: "type",
      type: DataIndexType.MEASUREMENT,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedBy",
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: any) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    // setSelectedRow(row);
  };
  const getData = async (params: IParams) => {
    await UnitOfMeasureService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Бараа материал / Бүртгэл</p>
            <button className="app-button" onClick={() => openModal(false)}>
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Шинээр бүртгэх
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <div className="second-header">
          <Filtered
            columns={columns}
            isActive={(key, state) => {
              onCloseFilterTag({
                key: key,
                state: state,
                column: columns,
                onColumn: (columns) => setColumns(columns),
                params: newParams,
                onParams: (params) => setNewParams(params),
              });
              getData(newParams);
            }}
          />
          {ComponentsType === "FULL" ? (
            <div className="extra">
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                    params: newParams,
                    onParams: (params) => setNewParams(params),
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
            </div>
          ) : null}
        </div>
        <div className="body">
          <NewDirectoryTree
            mode="UNIT"
            isLeaf={true}
            open={isOpenTree}
            onClick={(key, isLeaf) => {
              if (isLeaf) {
                getData({
                  page: 1,
                  limit: 10,
                  sectionId: [`${key}`],
                });
              }
            }}
          />
          <div
            style={{
              width: tableWidth,
            }}
          >
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              //   onDClick={(value) => {
              //     setSelectedRow(value);
              //     setIsDescription(true);
              //     setIsOpenTree(false);
              //   }}
              data={data}
              meta={meta}
              columns={columns}
              onChange={(params) => getData(params)}
              onColumns={(columns) => setColumns(columns)}
              newParams={newParams}
              onParams={(params) => setNewParams(params)}
              incomeFilters={filters}
              onEdit={(row) => openModal(true, row)}
              onDelete={(id) => console.log(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UnitOfMeasure;
