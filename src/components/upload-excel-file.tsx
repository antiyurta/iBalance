import { Button, Upload } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import NewModal from "./modal";
import { openNofi } from "@/feature/common";
const { Dragger } = Upload;
/** загвар татах төрлүүд */
type TemplateExcel = "MATERIAL_BRAND" | "MATERIAL_TYPE";
interface IProps {
  templateExcel: TemplateExcel;
  isModal: boolean;
  setIsModal: (value: boolean) => void;
  isReload: boolean;
  setIsReload: (value: boolean) => void;
}
export const UploadExcelFile = (props: IProps) => {
  const { templateExcel, isModal, setIsModal, isReload, setIsReload } = props;
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const uploadProps: UploadProps = {
    name: "file",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    action: `${process.env.NEXT_PUBLIC_BASEURL}/excel-file`,
    multiple: false,
    // action: url,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        openNofi("success", `${info.file.name} файл байршууллаа`);
        setIsReload(!isReload);
        setIsModal(!isModal);
      } else if (status === "error") {
        openNofi("error", `${info.file.name} файл байршуулж чадсангүй.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload: (file) => {
      const fileType = file.type;
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(fileType)) {
        openNofi("warning", "Та зөвхөн Excel файлуудыг байршуулах боломжтой!");
        return false;
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  const downloadTemplate = (templateExcel: TemplateExcel): string => {
    switch (templateExcel) {
      case "MATERIAL_BRAND":
        return "/excel-template/material-brand.xlsx";
      case "MATERIAL_TYPE":
        return "/excel-template/material-type.xlsx";
      default:
        return "";
    }
  };
  return (
    <NewModal
      title="Файл оруулах"
      open={isModal}
      footer={[
        <Button key="back" onClick={() => setIsModal(false)}>
          Хаах
        </Button>,
        <Button type="primary" href={downloadTemplate(templateExcel)} key={1}>
          Загвар татах
        </Button>,
      ]}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <FileExcelOutlined />
        </p>
        <p className="ant-upload-text">энэ хэсэгт дарах болон чирнэ үү!</p>
        <p className="ant-upload-hint" style={{ color: "red" }}>
          Загвар файлын хүснэгтийн толгой хэсгийн мэдээллийг өөрчлөж, устгаж
          болохгүй!
        </p>
        <p className="ant-upload-hint">Оруулах файл (.xlsx, .xls, .csv)</p>
      </Dragger>
    </NewModal>
  );
};
