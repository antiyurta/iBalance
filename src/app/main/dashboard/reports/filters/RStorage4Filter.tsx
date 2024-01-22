import { NewInput } from "@/components/input";
import { Col, Form, Row, Space } from "antd";
import { NewReportSelect } from "../component/report-select";
import { useReportContext } from "@/feature/context/ReportsContext";
import { CSSProperties, useEffect } from "react";
import { NewReportSectionSelect } from "../component/report-section-select";
import DateIntervalForm from "@/components/dateIntervalForm";
import { NewReportSwitch } from "../component/report-switch";
const RStorage4Filter = () => {
  const {
    form,
    setFormStyle,
    employees,
    sections,
    materialSections,
    warehouses,
    materials,
    brands,
    setEmployeeIds,
  } = useReportContext();
  const employeeIds = Form.useWatch("employeeIds", form);
  const colStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingLeft: 5,
    paddingRight: 5,
  };
  useEffect(() => {
    employeeIds && setEmployeeIds(employeeIds);
  }, [employeeIds]);
  useEffect(() => {
    setFormStyle({ width: "100%", margin: "auto" });
  }, []);
  return (
    <>
      <Row>
        <Col span={12} style={colStyle}>
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
        </Col>
      </Row>
      <Row>
        <Col span={12} style={colStyle}>
          <NewReportSelect
            label={"Нярав:"}
            name={"employeeId"}
            selectProps={{
              options: employees.map((item) => ({
                value: item.id,
                label: `${item.lastName}-${item.firstName}`,
              })),
            }}
          />
          <NewReportSectionSelect
            sectionLabel={"Байршилын бүлэг:"}
            sectionName={"warehouseSectionId"}
            sectionSelectProps={{
              options: sections.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
            label={"Байршил:"}
            name={"warehouseId"}
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
              options: materials.map((item) => ({
                value: item.id,
                label: `${item.code}-${item.name}`,
              })),
            }}
          />
          <NewReportSelect
            label={"Брэнд"}
            name={"brandId"}
            selectProps={{
              options: brands.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
          />
        </Col>
        <Col span={12} style={colStyle}>
          <NewReportSelect
            label={"Нярав:"}
            name={"employeeId"}
            selectProps={{
              options: employees.map((item) => ({
                value: item.id,
                label: `${item.lastName}-${item.firstName}`,
              })),
            }}
          />
          <NewReportSectionSelect
            sectionLabel={"Байршилын бүлэг:"}
            sectionName={"warehouseSectionId"}
            sectionSelectProps={{
              options: sections.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
            label={"Байршил:"}
            name={"warehouseId"}
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
              options: materials.map((item) => ({
                value: item.id,
                label: `${item.code}-${item.name}`,
              })),
            }}
          />
          <NewReportSelect
            label={"Брэнд"}
            name={"brandId"}
            selectProps={{
              options: brands.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
          />
          <NewReportSwitch
            name="isActive"
            label="Гүйлгээ гараагүй (идэвхтэй) барааны үлдэгдэл харуулах"
          />
        </Col>
      </Row>
    </>
  );
};
export default RStorage4Filter;
