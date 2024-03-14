import { Card } from "antd";
import Image from "next/image";
import React, {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useState,
} from "react";
import NewModal from "./modal";
import { FilterOutlined } from "@ant-design/icons";
import RStorage1 from "@/app/main/dashboard/reports/document/RStorage1";
import RStorage1Filter from "@/app/main/dashboard/reports/filters/RStorage1Filter";
import { useReportContext } from "@/feature/context/ReportsContext";
import { IParamDocument } from "@/service/document/entities";
import { useReactToPrint } from "react-to-print";

interface IProps {
  filter: ReactNode;
  printRef: MutableRefObject<null>;
}
export const Tools: React.FC<IProps> = ({ filter, printRef }) => {
  const style: CSSProperties & { "&:hover"?: CSSProperties } = {
    gap: 12,
    cursor: "pointer",
  };
  const { form } = useReportContext();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [isList, setIsList] = useState<boolean>(false);
  const [isDesign, setIsDesign] = useState<boolean>(false);
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [isConfig, setIsConfig] = useState<boolean>(false);
  const [isExport, setIsExport] = useState<boolean>(false);
  const [isMail, setIsMail] = useState<boolean>(false);
  const onFilter = (values: IParamDocument) => {
    console.log(values);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
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
        <p style={style} onClick={() => setIsFilter(true)}>
          <Image
            src={"/images/filterFalse.svg"}
            width={16}
            height={16}
            alt="Шүүх"
          />
          Шүүх
        </p>
        <p style={style} onClick={() => setIsGroup(true)}>
          <Image
            src={"/images/FilterButtonIcon.svg"}
            width={16}
            height={16}
            alt="Бүлэглэлт"
          />
          Бүлэглэлт
        </p>
        <p style={style} onClick={() => setIsList(true)}>
          <Image
            src={"/icons/tools/list.svg"}
            width={16}
            height={16}
            alt="Жагсаалт"
          />
          Жагсаалт
        </p>
        <p style={style} onClick={() => setIsDesign(true)}>
          <Image
            src={"/icons/tools/system-design.svg"}
            width={16}
            height={16}
            alt="Системийн загвар"
          />
          Системийн загвар
        </p>
        <p style={style} onClick={() => handlePrint()}>
          <Image
            src={"/images/PrintIcon.svg"}
            width={16}
            height={16}
            alt="Хэвлэх"
          />
          Хэвлэх
        </p>
        <p style={style} onClick={() => setIsGroup(true)}>
          <Image
            src={"/icons/tools/page-config.svg"}
            width={16}
            height={16}
            alt="Хуудасны тохиргоо"
          />
          Хуудасны тохиргоо
        </p>
        <p style={style} onClick={() => setIsExport(true)}>
          <Image
            src={"/icons/tools/export.svg"}
            width={16}
            height={16}
            alt="Экспорт"
          />
          Экспорт
        </p>
        <p style={style} onClick={() => setIsMail(true)}>
          <Image
            src={"/icons/tools/mail.svg"}
            width={16}
            height={16}
            alt="Мэйл илгээх"
          />
          Мэйл илгээх
        </p>
      </Card>
      <NewModal
        open={isFilter}
        title={"Шүүлт"}
        okText={
          <>
            <FilterOutlined /> Шүүх
          </>
        }
        onOk={() =>
          form.validateFields().then((values) => {
            onFilter(values);
          })
        }
        onCancel={() => setIsFilter(false)}
      >
        {filter}
      </NewModal>
    </>
  );
};
