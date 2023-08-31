"use client";

import Image from "next/image";

interface IProps {
  title: string;
  open: boolean;
  onCancel: (state: boolean) => void;
}
const FilterMore = (props: IProps) => {
  const { title, open, onCancel } = props;
  if (open) {
    return (
      <div className="extra-description">
        <div className="header">
          <div className="title">
            <p>{title}</p>
          </div>
          <Image
            onClick={() => onCancel(false)}
            src={"/images/closeIcon.svg"}
            width={24}
            height={24}
            alt="closeIcon"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "gray",
          }}
        ></div>
      </div>
    );
  }
  return;
};
export default FilterMore;
