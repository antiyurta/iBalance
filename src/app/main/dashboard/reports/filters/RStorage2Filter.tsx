import DateIntervalForm from "@/components/dateIntervalForm";
import { NewInput } from "@/components/input";
import { useReportContext } from "@/feature/context/ReportsContext";
import { Form } from "antd";
import { NewReportSelect } from "../component/report-select";
import { NewReportSectionSelect } from "../component/report-section-select";
import { useEffect, useState } from "react";
import {
  IDataTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import { IDataConsumer } from "@/service/consumer/entities";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { ConsumerService } from "@/service/consumer/service";
import { NewReportSwitch } from "../component/report-switch";

const RStorage2Filter = () => {
  const {
    form,
    employees,
    setEmployeeIds,
    sections,
    warehouses,
    brands,
    materialSections,
    setFormStyle,
  } = useReportContext();
  const employeeIds = Form.useWatch("employeeIds", form);
  const [consumerSections, setConsumerSections] = useState<IDataTreeSection[]>(
    []
  );
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  useEffect(() => {
    setFormStyle({ width: 600, margin: "auto" });
  }, []);
  const getSection = () => {
    TreeSectionService.getByFilter({
      type: TreeSectionType.Consumer,
      isExpand: false,
    }).then((response) => {
      if (response.success) {
        setConsumerSections(response.response);
      }
    });
  };
  const getConsumer = () => {
    ConsumerService.get().then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  useEffect(() => {
    employeeIds && setEmployeeIds(employeeIds);
  }, [employeeIds]);
  useEffect(() => {
    getSection();
    getConsumer();
  }, []);
  return (
    <>
      <DateIntervalForm
        form={form}
        intervalStyle={{
          minWidth: 100,
        }}
        dateStyle={{
          width: "100%",
        }}
        label=""
        labelForDate="Огноо"
        itemname={"interval"}
      />
      <Form.Item label="Баримтын дугаар" name="documentCode">
        <NewInput />
      </Form.Item>
      <NewReportSelect
        form={form}
        label={"Нярав:"}
        name={"employeeIds"}
        selectProps={{
          options: employees.map((item) => ({
            value: item.id,
            label: `${item.lastName}-${item.firstName}`,
          })),
        }}
      />
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
        name="warehouseId"
        selectProps={{
          options: warehouses.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel={"Барааны бүлэг:"}
        sectionName={"materalSectionId"}
        sectionSelectProps={{
          options: materialSections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label={"Бараа:"}
        name={"materialId"}
        selectProps={{
          options: materialSections.map((item) => ({
            value: item.id,
            label: `${item.id}-${item.name}`,
          })),
        }}
      />
      <NewReportSelect
        form={form}
        label={"Брэнд"}
        name={"brandId"}
        selectProps={{
          options: brands.map((item) => ({ value: item.id, label: item.name })),
        }}
      />
      <NewReportSectionSelect
        sectionLabel={"Харилцагчийн бүлэг:"}
        sectionName={"consumerSectionId"}
        sectionSelectProps={{
          options: consumerSections.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }}
        label={"Харилцагчийн код, нэр:"}
        name={"consumerId"}
        selectProps={{
          options: consumers.map((item) => ({
            value: item.id,
            label: `${item.code}-${item.name}`,
          })),
        }}
      />
      <NewReportSwitch name="isLock" label="Зөвхөн түгжсэн гүйлгээг харуулах" />
    </>
  );
};
export default RStorage2Filter;
