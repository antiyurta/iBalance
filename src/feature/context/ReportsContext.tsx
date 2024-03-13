import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  CSSProperties,
} from "react";
import Image from "next/image";
import ReportList from "@/app/main/dashboard/reports/reportList";
import { Form, FormInstance } from "antd";
import { IParamDocument } from "@/service/document/entities";
import { IDataEmployee } from "@/service/employee/entities";
import {
  IDataTreeSection,
  IParamTreeSection,
  TreeSectionType,
} from "@/service/reference/tree-section/entities";
import {
  IDataMaterialSection,
  IParamMaterialSection,
} from "@/service/material/section/entities";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { EmployeeService } from "@/service/employee/service";
import { TreeSectionService } from "@/service/reference/tree-section/service";
import { MaterialSectionService } from "@/service/material/section/service";
import {
  IDataMaterial,
  IParamMaterial,
  MaterialType,
} from "@/service/material/entities";
import { MaterialService } from "@/service/material/service";
import { IDataBrand } from "@/service/reference/brand/entities";
import { BrandService } from "@/service/reference/brand/service";
import { Operator } from "@/service/entities";
import { IParamReportMaterial } from "@/service/report/entities";

interface Tab {
  label: ReactNode;
  key: string;
  children: ReactNode;
  closable?: boolean;
}
interface ReportContextProps {
  tabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  tabKey: string;
  setTabKey: Dispatch<SetStateAction<string>>;
  form: FormInstance<IParamReportMaterial>;
  formStyle: CSSProperties;
  setFormStyle: Dispatch<SetStateAction<CSSProperties>>;
  employees: IDataEmployee[];
  sections: IDataTreeSection[];
  materialSections: IDataMaterialSection[];
  warehouses: IDataWarehouse[];
  materials: IDataMaterial[];
  brands: IDataBrand[];
  employeeIds: number[];
  setEmployeeIds: Dispatch<SetStateAction<number[]>>;
}

const ReportsContext = createContext<ReportContextProps | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

const ProviderReport: React.FC<IProps> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      key: "item-1",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <Image
            src={"/icons/tools/report.svg"}
            width={16}
            height={16}
            alt="Тайлан"
          />
          Тайлан харах
        </div>
      ),
      children: <ReportList />,
      closable: false,
    },
  ]);
  const [tabKey, setTabKey] = useState<string>("item-1");
  const [form] = Form.useForm<IParamReportMaterial>();
  const [employees, setEmployees] = useState<IDataEmployee[]>([]);
  const [sections, setSections] = useState<IDataTreeSection[]>([]);
  const [materialSections, setMaterialSections] = useState<
    IDataMaterialSection[]
  >([]);
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [materials, setMaterials] = useState<IDataMaterial[]>([]);
  const [brands, setBrands] = useState<IDataBrand[]>([]);
  const [employeeIds, setEmployeeIds] = useState<number[]>([]);
  const [formStyle, setFormStyle] = useState<CSSProperties>({
    width: 600,
    margin: "auto",
  });
  const getWarehouses = async (params: IParamWarehouse) => {
    await WarehouseService.get(params).then((response) => {
      if (response.success) {
        const warehouses = response.response.data;
        setWarehouses(warehouses);
      }
    });
  };
  const getEmployee = async () => {
    await EmployeeService.get({ isTreasure: true }).then((response) => {
      if (response.success) {
        setEmployees(response.response.data);
      }
    });
  };
  const getWarehouseSection = async (params: IParamTreeSection) => {
    await TreeSectionService.getByFilter(params).then((response) => {
      if (response.success) {
        setSections(response.response);
      }
    });
  };
  const getMaterialSection = async (params: IParamMaterialSection) => {
    await MaterialSectionService.get(params).then((response) => {
      if (response.success) {
        setMaterialSections(response.response);
      }
    });
  };
  const getMaterial = async (params: IParamMaterial) => {
    await MaterialService.get(params).then((response) => {
      if (response.success) {
        setMaterials(response.response.data);
      }
    });
  };
  const getBrand = async () => {
    await BrandService.get().then((response) => {
      if (response.success) {
        setBrands(response.response.data);
      }
    });
  };
  useEffect(() => {
    getEmployee();
    getBrand();
    getMaterial({ types: [MaterialType.Material] });
    getWarehouseSection({ type: TreeSectionType.Warehouse, isExpand: false });
    getMaterialSection({
      materialType: MaterialType.Material,
      isExpand: false,
    });
  }, []);
  useEffect(() => {
    employeeIds &&
      getWarehouses({
        filters: [
          {
            dataIndex: ["employeeId"],
            operator: Operator.In,
            filter: [...employeeIds],
          },
        ],
      });
  }, [employeeIds]);

  const value: ReportContextProps = {
    tabs,
    setTabs,
    tabKey,
    setTabKey,
    form,
    formStyle,
    setFormStyle,
    employees,
    sections,
    materialSections,
    warehouses,
    materials,
    brands,
    employeeIds,
    setEmployeeIds,
  };
  return (
    <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
  );
};

const useReportContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ProviderReport");
  }
  return context;
};

export { ProviderReport, useReportContext };
