import { openNofi } from "@/feature/common";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { ReferenceService } from "@/service/reference/reference";
import { Upload, UploadFile } from "antd";
import { UploadProps } from "antd/lib";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
interface MyUploadFile extends UploadFile {
  response?: {
    message: string;
    response: {
      filename?: string;
      id: number;
      mimetype?: string;
      path?: string;
    };
    success: boolean;
  };
}
interface IProps {
  imageId?: number;
  setImage: (id: number | undefined) => void;
}
export const UploadImage = (props: IProps) => {
  const { imageId, setImage } = props;
  const {
    login_data: {
      response: { accessToken },
    },
  } = useTypedSelector((state: RootState) => state.core);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const [fileList, setFileList] = useState<MyUploadFile[]>([]);

  const onChange: UploadProps["onChange"] = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "done" || info.file.status === "removed") {
      info.fileList?.map((file) => {
        setImage(file.response.response.id);
      });
    }
  };
  const handleRemove = async (info: MyUploadFile) => {
    setFileList([]);
    if (info.response?.response) {
      const { id } = info.response.response;
      try {
        await ReferenceService.removeGlobalImage(id).then((response) => {
          if (response.data.success) {
            openNofi("success", "Амжилттай", "Зураг устгалаа.");
            setImage(undefined);
          }
        });
      } catch (error) {
        console.error("Error while removing file:", error);
      }
    }
  };
  const renderImage = async (fileId: number) => {
    const blobImage = await ReferenceService.getGlobalImage(fileId).then(
      (response) => {
        const file = new Blob([response], { type: response.type });
        const fileUrl = URL.createObjectURL(file);
        return fileUrl;
      }
    );
    setFileList([
      {
        uid: `-rc-uplload`,
        name: fileId.toString(),
        status: "done",
        url: blobImage,
        response: {
          response: {
            id: fileId,
          },
          success: true,
          message: "",
        },
      },
    ]);
  };
  const beforeUpload = () => {
    if (fileList && fileList.length > 0) {
      handleRemove(fileList[0]);
    }
  };
  useEffect(() => {
    if (imageId) {
      renderImage(imageId);
    }
  }, [imageId]);
  return (
    <Upload
      maxCount={1}
      headers={headers}
      action={`${process.env.NEXT_PUBLIC_BASEURL}/global-files/fileUpload`}
      fileList={fileList}
      listType="picture-card"
      beforeUpload={beforeUpload}
      onChange={onChange}
      onRemove={handleRemove}
    >
      {fileList.length >= 1 ? null : (
        <PlusOutlined
          style={{
            fontSize: 24,
            color: "#6c757d",
          }}
        />
      )}
    </Upload>
  );
};
