import Image from "next/image";
import { useState } from "react";
import NewModal from "./modal";
import { Button, Space } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";

// pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { jsPDFOptions } from "jspdf";
import type { UserOptions } from "jspdf-autotable/dist/index";

import { fontt } from "./data";

interface IProps {
  pdfConfig?: jsPDFOptions;
  userOptions?: UserOptions;
  columnLength?: number;
  docName: string;
}

const Export = (props: IProps) => {
  const { pdfConfig, userOptions, columnLength, docName } = props;
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const exportPDF = () => {
    const doc = new jsPDF(pdfConfig);
    doc.addFileToVFS("Amiri-Regular.ttf", fontt);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
    var y = 10;
    doc.text("Product detailed report", 50, (y = y + 30), { align: "center" });
    autoTable(doc, {
      theme: "grid",
      ...userOptions,
      startY: 100,
      styles: {
        fontSize: 7,
        font: "Amiri",
        fontStyle: "normal",
      },
      bodyStyles: {
        fontSize: 6,
      },
    });
    doc.save(docName);
    setIsOpenModal(false);
  };
  return (
    <>
      <div className="export" onClick={() => setIsOpenModal(true)}>
        <Image
          src={"/images/UploadIcon.svg"}
          width={24}
          height={24}
          alt="uploadIcon"
        />
      </div>
      <NewModal
        width={200}
        title="Экспорт"
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
        footer={null}
      >
        <Space
          size={12}
          style={{
            paddingTop: 12,
          }}
        >
          <Button
            type="primary"
            onClick={() => exportPDF()}
            icon={<FilePdfOutlined />}
          >
            PDF
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />}>
            EXCEL
          </Button>
        </Space>
      </NewModal>
    </>
  );
};
export default Export;
