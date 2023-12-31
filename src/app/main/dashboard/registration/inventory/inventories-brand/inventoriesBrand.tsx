import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewInput, NewSearch, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  Meta,
} from "@/service/entities";
import {
  IDataBrand,
  IFilterBrand,
  IParamBrand,
} from "@/service/reference/brand/entities";
import { IDataCountry } from "@/service/reference/country/entities";
import { BrandService } from "@/service/reference/brand/service";
import { ReferenceService } from "@/service/reference/reference";
import { Form, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UploadExcelFile } from "@/components/upload-excel-file";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;

const InventoriesBrand = (props: IProps) => {
  const { ComponentType = "FULL", onClickModal } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [data, setData] = useState<IDataBrand[]>([]);
  const [countries, setCountries] = useState<IDataCountry[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBrand>();
  const [params, setNewParams] = useState<IParamBrand>({
    page: 1,
    limit: 10,
  });
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataBrand>();
  const [isUploadModal, setIsUploadModal] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumns>({
    name: {
      label: "Брэнд",
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
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: "updatedAt",
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
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
      setSelectedRow(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: IParamBrand) => {
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
    if (editMode && selectedRow) {
      await BrandService.patch(selectedRow.id, values).then((response) => {
        if (response.success) {
          setIsReload(!isReload);
          setIsOpenModal(false);
        }
      });
    } else {
      await BrandService.post(values).then((response) => {
        if (response.success) {
          setIsReload(!isReload);
          setIsOpenModal(false);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await BrandService.remove(id)
      .then((response) => {
        if (response.success) {
          setIsReload(!isReload);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    getData(params);
  }, [isReload]);
  useEffect(() => {
    getCountries();
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            {ComponentType === "FULL" ? (
              <Title level={3}>Үндсэн бүртгэл / Бараа материал / Брэнд</Title>
            ) : (
              <Title level={3}>Брэнд</Title>
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
              Брэнд бүртгэх
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
                params,
                onParams: (params) => setNewParams(params),
              });
              getData(params);
            }}
          />
          {ComponentType === "FULL" ? (
            <div className="extra">
              <ColumnSettings
                columns={columns}
                columnIndexes={(arg1, arg2) =>
                  findIndexInColumnSettings({
                    newRowIndexes: arg1,
                    unSelectedRow: arg2,
                    columns: columns,
                    onColumns: (columns) => setColumns(columns),
                    params,
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
                src={"/images/UploadIcon.svg"}
                width={24}
                height={24}
                alt="uploadIcon"
                onClick={() => setIsUploadModal(true)}
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
              scroll={{ x: ComponentType === "FULL" ? 1000 : 400 }}
              rowKey="id"
              data={data}
              meta={meta}
              columns={columns}
              onChange={(params) => getData(params)}
              onColumns={(columns) => setColumns(columns)}
              newParams={params}
              onParams={(params) => setNewParams(params)}
              incomeFilters={filters}
              isEdit
              isDelete
              onEdit={(row) => openModal(true, row)}
              onDelete={(id) => onDelete(id)}
            />
          </div>
        </div>
      </div>
      <NewModal
        width={300}
        title="Бараа материалын брэнд"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => form.validateFields().then((values) => onFinish(values))}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Брэнд"
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
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, label) =>
                (label?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={countries?.map((country) => ({
                label: country.name,
                value: country.id,
              }))}
            />
          </Form.Item>
        </Form>
      </NewModal>
      <UploadExcelFile
        isModal={isUploadModal}
        setIsModal={(value) => setIsUploadModal(value)}
        templateExcel="MATERIAL_BRAND"
        isReload={isReload}
        setIsReload={setIsReload}
      />
    </div>
  );
};

export default InventoriesBrand;
