import Image from "next/image";
import React from "react";

const isChecked = (state: boolean) => {
  if (state) {
    return (
      <Image src={"/icons/checked.png"} width={15} height={15} alt="checked" />
    );
  }
  return (
    <Image
      src={"/icons/unchecked.png"}
      width={15}
      height={15}
      alt="unchecked"
    />
  );
};
export { isChecked };
