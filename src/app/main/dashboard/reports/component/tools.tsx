import { Card, Form } from "antd";
import Image from "next/image";
import React, {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useState,
} from "react";
import NewModal from "../../../../../components/modal";
import { FilterOutlined } from "@ant-design/icons";
import { useReportContext } from "@/feature/context/ReportsContext";
import { useReactToPrint } from "react-to-print";
import { NewRadio, NewRadioGroup, NewSwitch } from "@/components/input";
import { useTypedSelector } from "@/feature/store/reducer";
import { IParamReportMaterial } from "@/service/report/entities";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { savePanel } from "@/feature/store/slice/report.slice";
interface IProps {
  filter: ReactNode;
  printRef: MutableRefObject<null>;
}
export const Tools: React.FC<IProps> = ({ filter, printRef }) => {
  const style: CSSProperties & { "&:hover"?: CSSProperties } = {
    gap: 12,
    cursor: "pointer",
  };
  const dispatch = useDispatch<AppDispatch>();
  const { activeKey, items } = useTypedSelector((state) => state.reportPanel);
  const currentItem = items.find((item) => item.key == activeKey);
  const { form } = useReportContext();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const onFilter = (params: IParamReportMaterial) => {
    if (currentItem) {
      let newItem = { ...currentItem };
      newItem.param = { ...params };
      dispatch(savePanel(newItem));
    }
    setIsFilter(false);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const onGroupBy = (type: "WAREHOUSE" | "SECTION", value: boolean) => {
    if (currentItem && currentItem.param) {
      const { key, param } = currentItem;
      const newParam = { ...param };
      if (type == "WAREHOUSE") {
        newParam.isWarehouse = value;
      }
      if (type == "SECTION") {
        newParam.isSection = value;
      }
      dispatch(savePanel({ key, param: newParam }));
    }
  };
  return (
    <>
      <Card title="Хэрэгслүүд" style={{ width: 250 }}>
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
        <p style={style} onClick={() => {}}>
          <Image
            src={"/icons/tools/list.svg"}
            width={16}
            height={16}
            alt="Жагсаалт"
          />
          Жагсаалт
        </p>
        <p style={style} onClick={() => {}}>
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
        <p style={style} onClick={() => {}}>
          <Image
            src={"/icons/tools/export.svg"}
            width={16}
            height={16}
            alt="Экспорт"
          />
          Экспорт
        </p>
        <p style={style} onClick={() => {}}>
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
        <Form
          form={form}
          labelCol={{ span: 4 }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ span: 20 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {filter}
        </Form>
      </NewModal>
      <NewModal
        open={isGroup}
        title={"Бүлэглэлтийн мэдээлэл"}
        footer={null}
        onCancel={() => setIsGroup(false)}
      >
        <table className="my-table">
          <thead>
            <th>Нэр</th>
            <th>Эрэмбэлэлт</th>
            <th>Бүлэглэлт эсэх</th>
          </thead>
          <tbody>
            <tr>
              <td>Байршил</td>
              <td>
                <NewRadioGroup>
                  <NewRadio value={"ASC"}>А-Я</NewRadio>
                  <NewRadio value={"DESC"}>Я-А</NewRadio>
                </NewRadioGroup>
              </td>
              <td>
                <NewSwitch
                  checked={currentItem?.param?.isWarehouse}
                  onChange={(checked) => onGroupBy("WAREHOUSE", checked)}
                />
              </td>
            </tr>
            <tr>
              <td>Бүлэг</td>
              <td>
                <NewRadioGroup>
                  <NewRadio value={"ASC"}>А-Я</NewRadio>
                  <NewRadio value={"DESC"}>Я-А</NewRadio>
                </NewRadioGroup>
              </td>
              <td>
                <NewSwitch
                  checked={currentItem?.param?.isSection}
                  onChange={(checked) => onGroupBy("SECTION", checked)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </NewModal>
    </>
  );
};
