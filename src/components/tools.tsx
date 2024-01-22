import { Card } from "antd";
import Image from "next/image";
import { CSSProperties, ReactNode } from "react";
import NewModal from "./modal";
import RStorage1 from "@/app/main/dashboard/reports/document/RStorage1";
import RStorage1Filter from "@/app/main/dashboard/reports/filters/RStorage1Filter";

interface IProps {}
export const Tools = (props: IProps) => {
  const style: CSSProperties & { "&:hover"?: CSSProperties } = {
    gap: 12,
    cursor: "pointer",
  };
  return (
    <>
      <Card title="Хэрэгслүүд" style={{ width: 250 }}>
        <p style={style}>
          <Image
            src={"/icons/tools/Search.png"}
            width={16}
            height={16}
            alt="Хайх"
          />
          Хайх
        </p>
        <p style={style}>
          <Image
            src={"/images/filterFalse.svg"}
            width={16}
            height={16}
            alt="Шүүх"
          />
          Шүүх
        </p>
        <p style={style}>
          <Image
            src={"/images/FilterButtonIcon.svg"}
            width={16}
            height={16}
            alt="Бүлэглэлт"
          />
          Бүлэглэлт
        </p>
        <p style={style}>
          <Image
            src={"/icons/tools/list.svg"}
            width={16}
            height={16}
            alt="Жагсаалт"
          />
          Жагсаалт
        </p>
        <p style={style}>
          <Image
            src={"/icons/tools/system-design.svg"}
            width={16}
            height={16}
            alt="Системийн загвар"
          />
          Системийн загвар
        </p>
        <p style={style}>
          <Image
            src={"/images/PrintIcon.svg"}
            width={16}
            height={16}
            alt="Хэвлэх"
          />
          Хэвлэх
        </p>
        <p style={style}>
          <Image
            src={"/icons/tools/page-config.svg"}
            width={16}
            height={16}
            alt="Хуудасны тохиргоо"
          />
          Хуудасны тохиргоо
        </p>
        <p style={style}>
          <Image
            src={"/icons/tools/export.svg"}
            width={16}
            height={16}
            alt="Экспорт"
          />
          Экспорт
        </p>
        <p style={style}>
          <Image
            src={"/icons/tools/mail.svg"}
            width={16}
            height={16}
            alt="Мэйл илгээх"
          />
          Мэйл илгээх
        </p>
      </Card>
      <NewModal>
        
      </NewModal>
    </>
  );
};
