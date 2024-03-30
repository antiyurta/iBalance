import "dayjs/locale/mn";
import { SetStateAction, useEffect, useState } from "react";
import { useReportContext } from "@/feature/context/ReportsContext";
import { NewReportSectionSelect } from "../component/report-section-select";
import { NewReportSelect } from "../component/report-select";
import { Form } from "antd";
import { NewReportSwitch } from "../component/report-switch";
import { ITool, Tool } from "@/service/entities";
import dayjs, { Dayjs } from "dayjs";
import { useTypedSelector } from "@/feature/store/reducer";
import { FilterToolData } from "@/feature/data";
import ReportDateFilter from "../component/date-filter";
interface IProps {
  reportKey: string;
}
const RStorage1Filter: React.FC<IProps> = ({ reportKey }) => {
  const {
    form,
    sections,
    materialSections,
    warehouses,
    materials,
    brands,
    setEmployeeIds,
    setFormStyle,
  } = useReportContext();
  const employeeIds = Form.useWatch("employeeIds", form);
  const { items } = useTypedSelector((state) => state.reportPanel);
  const currentItem = items.find((item) => item.key == reportKey);
  const [operator, setOperator] = useState<Tool>("BETWEEN");
  const [startAt, setStartAt] = useState<Dayjs | null>(dayjs());
  const [endAt, setEndAt] = useState<Dayjs | null>(dayjs());
  useEffect(() => {
    employeeIds && setEmployeeIds(employeeIds);
  }, [employeeIds]);
  useEffect(() => {
    setFormStyle({ width: 600, margin: "auto" });
  }, []);
  useEffect(() => {
    form.setFieldValue("dateFilter", {
      operator,
      startAt,
      endAt,
    });
  }, [operator, startAt, endAt]);
  useEffect(() => {
    if (currentItem && currentItem.param) {
      const { param } = currentItem;
      setOperator(param.dateFilter.operator);
      setStartAt(param.dateFilter.startAt);
      setEndAt(param.dateFilter.endAt);
      form.setFieldsValue(param);
    }
  }, [currentItem]);
  return (
    <>
      <Form.Item
        name={"dateFilter"}
        label={"Хайх огноо"}
        rules={[
          {
            validator: async (_, value) => {
              if (Array.isArray(value.dates) && value.dates.length == 0) {
                return Promise.reject(new Error("Хайх огноо оруулна уу."));
              }
            },
          },
        ]}
      >
        <ReportDateFilter
          operator={operator}
          setOperator={setOperator}
          startAt={startAt}
          setStartAt={setStartAt}
          endAt={endAt}
          setEndAt={setEndAt}
        />
      </Form.Item>
      <NewReportSectionSelect
        sectionLabel="Байршилын бүлэг:"
        sectionName="warehouseSectionId"
        sectionSelectProps={{
          options: sections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label="Байршил:"
        name="warehouseIds"
        selectProps={{
          options: warehouses.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel={"Барааны бүлэг:"}
        sectionName={"materialSectionId"}
        sectionSelectProps={{
          options: materialSections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label={"Бараа:"}
        name={"materialIds"}
        selectProps={{
          options: materials.map((item) => ({
            value: item.id,
            label: `${item.code}-${item.name}`,
          })),
        }}
      />
      <NewReportSelect
        form={form}
        label={"Брэнд"}
        name={"brandIds"}
        selectProps={{
          options: brands.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSwitch name="isLock" label="Зөвхөн түгжсэн гүйлгээг харуулах" />
      <NewReportSwitch
        name="isNotTransaction"
        label="Гүйлгээ гараагүй (идэвхтэй) барааны үлдэгдэл харуулах"
      />
    </>
  );
};
export default RStorage1Filter;
