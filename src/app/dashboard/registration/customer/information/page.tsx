"use client";

import ColumnSettings from "@/components/columnSettings";
import Description from "@/components/description";
import NewDirectoryTree from "@/components/directoryTree";
import FilterDropDown from "@/components/filterDropDown";
import FilterTable from "@/components/filterTable";
import { NewSearch, NewSwitch } from "@/components/input";
import NewModal from "@/components/modal";
import { IColumnData, NewColumn, NewTable } from "@/components/table";
import Image from "next/image";
import { useState } from "react";

type DataType = {
  id: number;
  name: string;
} | null;

const Information = () => {
  const [editMode, setIsMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isDualMirror, setIsDualMirror] = useState<boolean>(false);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<DataType>();
  const [selectedColumns, setSelectedColumns] = useState<IColumnData[]>();
  const data: DataType[] = [
    {
      id: 1,
      name: "sadasda",
    },
  ];
  const columns: IColumnData[] = [
    {
      title: "Харилцагчийн код",
      dataIndex: "sadasd",
    },
    {
      title: "Хувь хүн эсэх",
      dataIndex: "asdasd",
    },
    {
      title: "Ажилтан эсэх",
      dataIndex: "sada",
    },
    {
      title: "Харилцагчийн бүлэг",
      dataIndex: "sada",
    },
    {
      title: "Харилцагчийн овог",
      dataIndex: "sada",
    },
    {
      title: "Харилцагчийн нэр",
      dataIndex: "sada",
    },
    {
      title: "Регистр",
      dataIndex: "sada",
    },
    {
      title: "Утасны дугаар",
      dataIndex: "sada",
    },
    {
      title: "И-мэйл хаяг",
      dataIndex: "sada",
    },
    {
      title: "Төлөв",
      dataIndex: "sada",
    },
  ];
  //functions
  const openModal = (state: boolean, row: DataType) => {
    setIsMode(state);
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  return (
    <>
      <div className="information">
        <div className="header">
          <div className="left">
            <p>Үндсэн бүртгэл / Харилцагч / Бүртгэл</p>
            <button
              className="app-button"
              onClick={() => openModal(false, null)}
            >
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
          <FilterTable
            columns={columns}
            defaultSelectedKeys={[0, 1]}
            selectedKeys={(columns) => setSelectedColumns(columns)}
          />
          <div className="extra">
            <ColumnSettings />
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
            <Image
              src={
                isDualMirror
                  ? "/images/DualMirrorBlack.svg"
                  : "/images/DualMirror.svg"
              }
              onClick={() => setIsDualMirror(!isDualMirror)}
              width={24}
              height={24}
              alt="dualMirror"
            />
          </div>
        </div>
        <div className="body">
          {!isDualMirror ? (
            <div className="left">
              <div className="header">
                <Image
                  src={"/images/folder.svg"}
                  width={32}
                  height={32}
                  alt="folder"
                />
                <Image
                  src={"/images/openFolder.svg"}
                  width={32}
                  height={32}
                  alt="openfolder"
                />
                <p>Бүлэгийн нэр</p>
              </div>
              <div className="content">
                <div
                  style={{
                    padding: "0 12px",
                  }}
                >
                  <NewSearch />
                </div>
                <NewDirectoryTree />
              </div>
            </div>
          ) : null}
          <div className="middle">
            <NewTable
              prop={{
                rowKey: "id",
                rowClassName: "cursor-pointer",
                bordered: false,
                scroll: {
                  x: 1100,
                },
                dataSource: data,
                onRow: (record: DataType) => {
                  return {
                    onDoubleClick: () => {
                      if (isDualMirror) {
                        setIsDescription(true);
                        setSelectedRow(record);
                      }
                    },
                  };
                },
              }}
              meta={{
                page: 1,
                limit: 10,
                itemCount: 15,
              }}
              isLoading={false}
              isPagination={true}
              columns={columns}
            />
          </div>
          <Description
            open={isDescription}
            onCancel={(state) => setIsDescription(state)}
          />
        </div>
      </div>
      <NewModal
        title="Харилцагчийн бүртгэл"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <NewSwitch />
        </div>
      </NewModal>
    </>
  );
};
export default Information;
