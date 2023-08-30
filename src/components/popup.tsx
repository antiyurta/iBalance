"use client";
import { Modal } from "antd";
import Image from "next/image";
interface IProps {
  onEdit?: () => void;
  onDelete?: () => void;
}
const Popup = (props: IProps) => {
  const { onEdit, onDelete } = props;
  const warning = () => {
    Modal.error({
      title: "Устгах",
      content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
      maskClosable: true,
      onOk: onDelete,
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <button onClick={onEdit} className="popupButton">
        <Image src="/icons/Edit.png" width={16} height={16} alt="edit" />
        <p
          style={{
            color: "#FD7E14",
            margin: 0,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          Засварлах
        </p>
      </button>
      <button onClick={warning} className="popupButton">
        <Image src="/icons/DeleteOff.png" width={16} height={16} alt="edit" />
        <p
          style={{
            color: "#DC3545",
            margin: 0,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          Устгах
        </p>
      </button>
    </div>
  );
};
export default Popup;
