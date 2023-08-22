import Image from "next/image";
import { useEffect, useState } from "react";
import NewModal from "./modal";
import { IColumnData } from "./table";
import { Space, Tag } from "antd";
const { CheckableTag } = Tag;

interface IFilterTable {
  columns: IColumnData[];
  defaultSelectedKeys: number[];
  selectedKeys: (columns: IColumnData[]) => void;
}

function FilterTable(props: IFilterTable) {
  const { columns, defaultSelectedKeys, selectedKeys } = props;
  const [selectedTags, setSelectedTags] =
    useState<number[]>(defaultSelectedKeys);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  // functions
  // tag songoh
  const handleChange = (tag: number, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };
  //  defualt songoh
  const setDefualt = () => {
    setSelectedTags(defaultSelectedKeys);
    selectedKeys(
      defaultSelectedKeys?.map((tag) => {
        return columns[tag];
      })
    );
  };
  // modal hadgalah darah ued
  const onFinish = () => {
    selectedKeys(
      selectedTags?.map((tag) => {
        return columns[tag];
      })
    );
    setIsOpenModal(false);
  };
  return (
    <>
      <div
        className="extra"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 24,
          width: "100%",
        }}
      >
        <Space size={[6, 6]} wrap>
          {selectedTags.map((tag, index) => {
            return <Tag key={index}>{columns[tag].title}</Tag>;
          })}
        </Space>
        <button className="app-button-regular" onClick={() => setDefualt()}>
          Цэрэвлэх
        </button>
        <Image
          title="Баганын тохиргоо"
          onClick={() => {
            setIsOpenModal(true);
          }}
          src={"/images/FilterButtonIcon.svg"}
          width={24}
          height={24}
          alt="filterButtonIcon"
        />
      </div>
      <NewModal
        title="Баганын тохиргоо"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <Space size={[6, 6]} wrap>
          {columns.map((column, index) => {
            return (
              <CheckableTag
                key={index}
                checked={selectedTags.includes(index)}
                onChange={(checked) => handleChange(index, checked)}
              >
                {column.title}
              </CheckableTag>
            );
          })}
        </Space>
      </NewModal>
    </>
  );
}
export default FilterTable;
