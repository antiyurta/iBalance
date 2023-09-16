import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewInput, NewOption, NewSearch, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  IDataBrand,
  IDataCountry,
  IParams,
} from "@/service/material/brand/entities";
import { BrandService } from "@/service/material/brand/service";
import { ReferenceService } from "@/service/reference/reference";
import { Form } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  ComponentsType: string;
  onClickModal?: (row: any) => void;
}

const InventoriesBrand = (props: IProps) => {
  const { ComponentsType = "FULL", onClickModal } = props;
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [data, setData] = useState<IDataBrand[]>([]);
  const [countries, setCountries] = useState<IDataCountry[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [newParams, setNewParams] = useState<IParams>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataBrand>();
  const [columns, setColumns] = useState<FilteredColumns>({
    name: {
      label: "Бренд",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    countryId: {
      label: "Улс",
      isView: true,
      isFiltered: false,
      dataIndex: ["country", "name"],
      type: DataIndexType.COUNTRY,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: ComponentsType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "updatedBy",
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: IDataBrand) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: IParams) => {
    await BrandService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const getCountries = async () => {
    await ReferenceService.getCountries().then((response) => {
      setCountries(response.response.data);
    });
  };
  const onFinish = async (values: IDataBrand) => {
    if (editMode) {
    } else {
      await BrandService.post(values).then((response) => {
        if (response.success) {
          openNofi("success", "Амжиллтай", "Хэмжих нэгж амжиллттай нэмэгдлээ");
          getData({ page: 1, limit: 10 });
          setIsOpenModal(false);
        }
      });
    }
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            {ComponentsType === "FULL" ? (
              <p>Үндсэн бүртгэл / Бараа материал / Бренд</p>
            ) : (
              <p>Бренд</p>
            )}
            <button
              className="app-button"
              onClick={() => {
                openModal(false);
                getCountries();
              }}
            >
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Бренд бүртгэх
            </button>
          </div>
          <div className="right">
            <NewSearch
              prefix={
                <Image
                  src={"/images/SearchIcon.svg"}
                  width={12}
                  height={12}
                  alt="searchIcon"
                />
              }
              allowClear={true}
              onSearch={(values: string) => console.log(values)}
            />
          </div>
        </div>
        <div className="second-header">
          <Filtered
            columns={columns}
            isActive={(key, state) => {
              onCloseFilterTag({
                key: key,
                state: state,
                column: columns,
                onColumn: (columns) => setColumns(columns),
                params: newParams,
                onParams: (params) => setNewParams(params),
              });
              getData(newParams);
            }}
          />
          {ComponentsType === "FULL" ? (
            <div className="extra">
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                    params: newParams,
                    onParams: (params) => setNewParams(params),
                    getData: (params) => getData(params),
                  })
                }
              />
              <Image
                src={"/images/PrintIcon.svg"}
                width={24}
                height={24}
                alt="printIcon"
              />
              <Image
                src={"/images/DownloadIcon.svg"}
                width={24}
                height={24}
                alt="downloadIcon"
              />
            </div>
          ) : null}
        </div>
        <div className="body">
          <div
            style={{
              width: "100%",
            }}
          >
            <NewTable
              scroll={{ x: ComponentsType === "FULL" ? 1000 : 400 }}
              rowKey="id"
              //   doubleClick={true}
              //   onDClick={(value) => {
              //     setSelectedRow(value);
              //     setIsDescription(true);
              //     setIsOpenTree(false);
              //   }}
              data={data}
              meta={meta}
              columns={columns}
              onChange={(params) => getData(params)}
              onColumns={(columns) => setColumns(columns)}
              newParams={newParams}
              onParams={(params) => setNewParams(params)}
              incomeFilters={filters}
              onEdit={(row) => openModal(true, row)}
              onDelete={(id) => console.log(id)}
            />
          </div>
        </div>
      </div>
      <NewModal
        width={300}
        title="Бараа материалын бренд"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => form.validateFields().then((values) => onFinish(values))}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Бренд"
            name={"name"}
            rules={[
              {
                required: true,
                message: "Нэр заавал",
              },
            ]}
          >
            <NewInput />
          </Form.Item>
          <Form.Item
            label="Улс"
            name={"countryId"}
            rules={[
              {
                required: true,
                message: "Улс заавал",
              },
            ]}
          >
            <NewSelect
              showSearch
              filterOption={(input: any, option: { children: any }) => {
                return (option?.children ?? "").includes(input);
              }}
            >
              {countries?.map((country, index) => {
                return (
                  <NewOption key={index} value={country.id}>
                    {country.name}
                  </NewOption>
                );
              })}
            </NewSelect>
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};

export default InventoriesBrand;
