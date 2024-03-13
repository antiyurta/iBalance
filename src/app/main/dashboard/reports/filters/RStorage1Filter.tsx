import "dayjs/locale/mn";
import { useEffect, useState } from "react";
import { useReportContext } from "@/feature/context/ReportsContext";
import { NewReportSectionSelect } from "../component/report-section-select";
import { NewReportSelect } from "../component/report-select";
import { Form } from "antd";
import { NewReportSwitch } from "../component/report-switch";
import { IntervalDate } from "@/components/table/dropdown/interval-date";
import { ITool } from "@/service/entities";
import dayjs, { Dayjs } from "dayjs";

const RStorage1Filter = () => {
  const {
    form,
    employees,
    sections,
    materialSections,
    warehouses,
    materials,
    brands,
    setEmployeeIds,
    setFormStyle,
  } = useReportContext();
  const employeeIds = Form.useWatch("employeeIds", form);
  const [tool, setTool] = useState<ITool>({
    logo: "/icons/tools/Equals.png",
    title: "Тухайн",
    operator: "THAT",
  });
  const [dates, setDates] = useState<Dayjs[]>([]);
  useEffect(() => {
    employeeIds && setEmployeeIds(employeeIds);
  }, [employeeIds]);
  useEffect(() => {
    setFormStyle({ width: 600, margin: "auto" });
  }, []);
  useEffect(() => {
    form.setFieldValue("dateFilter", {
      operator: tool.operator,
      dates,
    });
  }, [dates]);
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
        <IntervalDate
          tool={tool}
          setTool={setTool}
          dates={dates}
          setDates={setDates}
        />
      </Form.Item>
      <NewReportSectionSelect
        form={form}
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
        form={form}
        sectionLabel={"Барааны бүлэг:"}
        sectionName={"materalSectionId"}
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
