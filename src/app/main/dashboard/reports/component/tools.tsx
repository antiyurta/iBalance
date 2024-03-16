import { Button, Card, Form, List, Table, Typography } from "antd";
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
import { IParamDocument } from "@/service/document/entities";
import { useReactToPrint } from "react-to-print";
import {
  NewRadio,
  NewRadioGroup,
  NewSelect,
  NewSwitch,
} from "@/components/input";
import { useTypedSelector } from "@/feature/store/reducer";
import { IParamReportMaterial } from "@/service/report/entities";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { savePanel } from "@/feature/store/slice/report.slice";
const { Column } = Table;
interface IGroup {
  name: "WAREHOUSE" | "SECTION";
  sorter: "ASC" | "DESC";
  isGroupBy: boolean;
}
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
  const [groupForm] = Form.useForm<{ groups: IGroup[] }>();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const onFilter = (params: IParamReportMaterial) => {
    if (currentItem) {
      currentItem.param = { ...currentItem.param, ...params };
      dispatch(savePanel(currentItem));
    }
    setIsFilter(false);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const onGroupBy = (groups: IGroup[]) => {
    if (currentItem && currentItem.param) {
      for (const item of groups) {
        currentItem.param.isWarehouse =
          item.name == "WAREHOUSE" && item.isGroupBy;
        currentItem.param.isWarehouse =
          item.name == "SECTION" && item.isGroupBy;
      }
      dispatch(savePanel(currentItem));
    }
    setIsGroup(false);
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
        {filter}
      </NewModal>
      <NewModal
        open={isGroup}
        title={"Бүлэглэлтийн мэдээлэл"}
        onOk={() =>
          groupForm.validateFields().then((values) => {
            onGroupBy(values.groups);
          })
        }
        onCancel={() => setIsGroup(false)}
      >
        <Form
          form={groupForm}
          layout="vertical"
          initialValues={{
            groups: [
              { name: "WAREHOUSE", sorter: "ASC", isGroupBy: true },
              { name: "SECTION", sorter: "ASC", isGroupBy: true },
            ],
          }}
        >
          <Form.List name={"groups"}>
            {(groups, _, { errors }) => (
              <>
                <Table dataSource={groups} pagination={false}>
                  <Column
                    dataIndex="name"
                    title="Нэр"
                    render={(_, __, index) => (
                      <Form.Item name={[index, "name"]}>
                        <NewSelect
                          disabled
                          options={[
                            { value: "WAREHOUSE", label: "Байршил" },
                            { value: "SECTION", label: "Бүлэг" },
                          ]}
                        />
                      </Form.Item>
                    )}
                  ></Column>
                  <Column
                    dataIndex="sorter"
                    title="Эрэмбэлэлт"
                    render={(_, __, index) => (
                      <Form.Item name={[index, "sorter"]}>
                        <NewRadioGroup>
                          <NewRadio value={"ASC"}>А-Я</NewRadio>
                          <NewRadio value={"DESC"}>Я-А</NewRadio>
                        </NewRadioGroup>
                      </Form.Item>
                    )}
                  ></Column>
                  <Column
                    dataIndex="isGroupBy"
                    title="Бүлэглэх эсэх"
                    render={(_, __, index) => (
                      <Form.Item
                        name={[index, "isGroupBy"]}
                        valuePropName="checked"
                      >
                        <NewSwitch />
                      </Form.Item>
                    )}
                  ></Column>
                </Table>
                <div style={{ color: "#ff4d4f" }}>{errors}</div>
              </>
            )}
          </Form.List>
        </Form>
      </NewModal>
    </>
  );
};
