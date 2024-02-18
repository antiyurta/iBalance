import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import { NewFilterSelect, NewInput, NewSearch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
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
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
import PageTitle from "@/components/page-title";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const { Title } = Typography;
const key = "inventory/inventories-brand";
const InventoriesBrand = (props: IProps) => {
  const { ComponentType = "FULL", onClickModal } = props;
  const [form] = Form.useForm<IDataBrand>();
  const blockContext: BlockView = useContext(BlockContext);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [data, setData] = useState<IDataBrand[]>([]);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [countries, setCountries] = useState<IDataCountry[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilterBrand>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataBrand>();
  const [isUploadModal, setIsUploadModal] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [columns, setColumns] = useState<FilteredColumns>({
    name: {
      label: "Брэнд",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    country: {
      label: "Улс",
      isView: true,
      isFiltered: false,
      dataIndex: ["country"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: ComponentType === "FULL" ? true : false,
      isFiltered: false,
      dataIndex: ["updatedAt"],
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
      row && form.setFieldsValue(row);
      setSelectedRow(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async () => {
    const params: IParamBrand = { ...param };
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
    dispatch(newPane({ key, param: {} }));
    getCountries();
  }, []);
  useEffect(() => {
    getData();
  }, [param, isReload]);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            {ComponentType == "FULL" && (
              <PageTitle
                onClick={() => {
                  openModal(false);
                  getCountries();
                }}
              />
            )}
          </div>
        </div>
        <div className="second-header">
          <Filtered columns={columns} />
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
              onColumns={(columns) => setColumns(columns)}
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
            name={"country"}
            rules={[
              {
                required: true,
                message: "Улс заавал",
              },
            ]}
          >
            <NewFilterSelect
              options={countries?.map((country) => ({
                label: country.name,
                value: country.name,
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
