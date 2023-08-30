"use client";
import { FilteredColumns } from "@/service/consumer/entities";
import { Modal } from "antd";
import Image from "next/image";

interface IDescription {
  title: string;
  open: boolean;
  columns: FilteredColumns;
  selectedRow: any;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onCancel: (state: boolean) => void;
}

const Description = (props: IDescription) => {
  const { title, open, columns, selectedRow, onEdit, onDelete, onCancel } =
    props;
  const warning = () => {
    Modal.error({
      title: "Устгах",
      content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
      maskClosable: true,
      onOk: () => onDelete(selectedRow?.["id"]),
    });
  };
  const configRender = (key: string, relationIndex?: string[]) => {
    if (typeof selectedRow?.[key] === "boolean") {
      if (selectedRow?.[key]) {
        return (
          <Image
            src={"/icons/switchTrue.svg"}
            width={44}
            height={22}
            alt="switchfalse"
          />
        );
      } else {
        return (
          <Image
            src={"/icons/switchFalse.svg"}
            width={44}
            height={22}
            alt="switchtrue"
          />
        );
      }
    }
    if (relationIndex) {
      var clonedSelectedRow = selectedRow;
      relationIndex?.map((index) => {
        clonedSelectedRow = clonedSelectedRow[`${index}`];
      });
      return <p>{clonedSelectedRow}</p>;
    }
    return (
      <p className="value">{selectedRow?.[key as keyof typeof columns]}</p>
    );
  };
  if (open) {
    return (
      <div className="extra-description">
        <div className="header">
          <Image
            src={"/images/expandedIcon.svg"}
            width={24}
            height={24}
            alt="expandedIcon"
          />
          <Image
            onClick={() => onCancel(false)}
            src={"/images/closeIcon.svg"}
            width={24}
            height={24}
            alt="closeIcon"
          />
        </div>
        <div className="title">
          <p>{title}</p>
        </div>
        <div className="body">
          {Object.entries(columns)?.map(([key, value], index) => {
            return (
              <div key={index} className="content">
                <p className="label">{value.label}</p>
                {configRender(key, value?.relationIndex)}
              </div>
            );
          })}
        </div>
        <div className="footer">
          <button onClick={warning} className="app-button-danger">
            Устгах
          </button>
          <button onClick={onEdit} className="app-button">
            Засах
          </button>
        </div>
      </div>
    );
  }
  return;
};
export default Description;
