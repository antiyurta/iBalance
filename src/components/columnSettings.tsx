import Image from "next/image";
import { useState } from "react";
import NewModal from "./modal";
import { Space } from "antd";

const ColumnSettings = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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
      >
        <Space size={[6, 6]} wrap></Space>
      </NewModal>
    </>
  );
};
export default ColumnSettings;
