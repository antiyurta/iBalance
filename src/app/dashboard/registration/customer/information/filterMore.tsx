"use client";

import { NewInputNumber } from "@/components/input";
import Image from "next/image";
import { useState } from "react";

interface IProps {
  title: string;
  open: boolean;
  onOk: (value: any) => void;
  onCancel: (state: boolean) => void;
}
const FilterMore = (props: IProps) => {
  const { title, open, onOk, onCancel } = props;
  const [value, setValue] = useState();
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
        <NewInputNumber value={value} onChange={(e: any) => setValue(e)} />
        <button onClick={() => onOk(value)}>filter</button>
      </div>
    );
  }
  return;
};
export default FilterMore;
