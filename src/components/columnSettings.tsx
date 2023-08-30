import Image from "next/image";
import { useEffect, useState } from "react";
import NewModal from "./modal";
import { Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
const { CheckableTag } = Tag;
interface IProps {
  columns: object;
  columnIndexes: (selected: string[], unSelected: string[]) => void;
}

const ColumnSettings = (props: IProps) => {
  const { columns, columnIndexes } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [unSelectedTags, setUnSelectedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleChange = (dataIndex: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, dataIndex]
      : selectedTags.filter((t) => t !== dataIndex);
    const nextUnSelectedTags = !checked
      ? [...unSelectedTags, dataIndex]
      : unSelectedTags.filter((t) => t !== dataIndex);
    setUnSelectedTags(nextUnSelectedTags);
    setSelectedTags(nextSelectedTags);
  };
  useEffect(() => {
    if (columns) {
      const data: string[] = [];
      Object.entries(columns)?.map(([key, value]) => {
        if (value.isView) {
          data.push(key);
        }
      });
      setSelectedTags(data);
    }
  }, [columns]);
  return (
    <>
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
      <NewModal
        title="Баганын тохиргоо"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                height: 38,
              }}
              className="app-button-regular"
              onClick={() => {
                // setSelectedTags(defualtColumns);
                // columnIndexes(defualtColumns, unSelectedTags);
                setIsOpenModal(false);
              }}
            >
              Defualt
            </button>
            <button
              disabled={selectedTags?.length > 0 ? false : true}
              className="app-button"
              onClick={() => {
                columnIndexes(selectedTags, unSelectedTags);
                setIsOpenModal(false);
              }}
            >
              Хадгалах
            </button>
          </div>
        }
      >
        <Space size={[6, 6]} wrap>
          {Object.entries(columns)?.map(([key, value], index) => {
            return (
              <CheckableTag
                key={index}
                checked={selectedTags.includes(key)}
                onChange={(checked) => handleChange(key, checked)}
              >
                {value.label}
              </CheckableTag>
            );
          })}
        </Space>
      </NewModal>
    </>
  );
};
export default ColumnSettings;
