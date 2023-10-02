import { DataIndexType, DescMode } from "@/service/entities";
import AntImage from "antd/es/image/index";
import Image from "next/image";
import { App } from "antd";

interface IDescription {
  mode?: DescMode;
  title: string;
  open: boolean;
  columns: object;
  selectedRow: any;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onCancel: (state: boolean) => void;
}

const Description = (props: IDescription) => {
  const { modal } = App.useApp();
  const {
    mode,
    title,
    open,
    columns,
    selectedRow,
    onEdit,
    onDelete,
    onCancel,
  } = props;
  const warning = () => {
    modal.error({
      title: "Устгах",
      content: "Та бүртгэлийг устгахдаа итгэлтэй байна уу ?",
      maskClosable: true,
      onOk: () => onDelete(selectedRow?.["id"]),
    });
  };
  const configRender = (
    key: string,
    type?: DataIndexType,
    dataIndex?: string | string[]
  ) => {
    if (
      type === DataIndexType.BOOLEAN ||
      type === DataIndexType.BOOLEAN_STRING
    ) {
      return selectedRow?.[key] ? (
        <Image
          src={"/icons/switchTrue.svg"}
          width={44}
          height={22}
          alt="switchfalse"
        />
      ) : (
        <Image
          src={"/icons/switchFalse.svg"}
          width={44}
          height={22}
          alt="switchfalse"
        />
      );
    } else if (type === DataIndexType.STRING || type === DataIndexType.MULTI) {
      return (
        <p className="value">{selectedRow?.[key as keyof typeof columns]}</p>
      );
    } else if (
      type === DataIndexType.STRING_BANK ||
      type === DataIndexType.STRING_TREE ||
      type === DataIndexType.STRING_SECTION
    ) {
      if (typeof dataIndex === "object") {
        console.log("end baina aa");
        var clonedSelectedRow = selectedRow;
        console.log("sadasd", clonedSelectedRow, dataIndex);
        dataIndex?.map((index) => {
          clonedSelectedRow = clonedSelectedRow?.[`${index}`];
        });
        return <p>{clonedSelectedRow}</p>;
      }
    }
  };
  if (open) {
    return (
      <div className="extra-description">
        <div className="header">
          <Image
            src={"/images/expandedIcon.svg"}
            width={24}
            height={24}
            alt="expandedIcon"
          />
          <Image
            onClick={() => onCancel(false)}
            src={"/images/closeIcon.svg"}
            width={24}
            height={24}
            alt="closeIcon"
          />
        </div>
        <div className="title">
          <p>{title}</p>
        </div>
        {mode === "PICTURE" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              padding: 12,
              width: "100%",
              overflow: "auto",
            }}
          >
            <AntImage.PreviewGroup>
              {selectedRow?.files?.map((file: any, index: number) => {
                return (
                  <AntImage
                    key={index}
                    width={70}
                    height={70}
                    src={`http://192.168.5.102:8000/${file.path}`}
                    alt={"asd"}
                  />
                );
              })}
            </AntImage.PreviewGroup>
          </div>
        ) : null}
        <div className="extra-description-body">
          {Object.entries(columns)?.map(([key, value], index) => {
            return (
              <div key={index} className="content">
                <p className="label">{value.label}</p>
                {configRender(key, value.type, value?.dataIndex)}
              </div>
            );
          })}
        </div>
        <div className="footer">
          <button onClick={warning} className="app-button-danger">
            Устгах
          </button>
          <button onClick={onEdit} className="app-button">
            Засах
          </button>
        </div>
      </div>
    );
  }
  return;
};
export default Description;
