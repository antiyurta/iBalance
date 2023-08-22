"use client";
import Image from "next/image";

interface IDescription {
  open: boolean;
  onCancel: (state: boolean) => void;
}

const Description = (props: IDescription) => {
  const { open, onCancel } = props;
  if (open) {
    return (
      <div className="right">
        <div className="header">
          <Image
            src={"/images/expandedIcon.svg"}
            width={24}
            height={24}
            alt="expandedIcon"
          />
          <Image
            onClick={() => props.onCancel(false)}
            src={"/images/closeIcon.svg"}
            width={24}
            height={24}
            alt="closeIcon"
          />
        </div>
        <div className="title">
          <p>Дэлгэрэнгүй мэдээлэл</p>
        </div>
        <div className="body">
          <div>
            <p>asdas</p>
            <p>asdsad</p>
          </div>
          <div>
            <p>asdas</p>
            <p>asdsad</p>
          </div>
        </div>
        <div className="footer">
          <button className="app-button-danger">Устгах</button>
          <button>Засах</button>
        </div>
      </div>
    );
  }
  return;
};
export default Description;
