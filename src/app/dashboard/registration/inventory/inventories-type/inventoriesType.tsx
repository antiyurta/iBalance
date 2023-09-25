import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewInput, NewSearch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
import {
  ComponentType,
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import { IDataType, IParams } from "@/service/material/type/entities";
import { TypeService } from "@/service/material/type/service";
import { Form } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const InventoriesType = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm();
  const [newParams, setNewParams] = useState<IParams>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataType[]>([]);
  const [filters, setFilters] = useState<IFilters>();
  //
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  //
  const [selectedRow, setSelectedRow] = useState<IDataType>();
  const [columns, setColumns] = useState<FilteredColumns>({
    accountNo: {
      label: "Дансны код",
      isView: true,
      isFiltered: false,
      dataIndex: "accountNo",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Дансны нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
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
      dataIndex: "updatedBy",
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: IDataType) => {
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
    await TypeService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const onFinish = async (values: IDataType) => {
    if (editMode) {
      await TypeService.patch(selectedRow?.id, values).then((response) => {
        if (response.success) {
          getData({ page: 1, limit: 10 });
          setIsOpenModal(false);
        }
      });
    } else {
      await TypeService.post(values).then((response) => {
        if (response.success) {
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    await TypeService.remove(id).then((response) => {
      if (response.success) {
        getData({ page: 1, limit: 10 });
        setIsOpenModal(false);
      }
    });
  };
  useEffect(() => {
    getData({ page: 1, limit: 10 });
  }, []);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            {ComponentType === "FULL" ? (
              <p>Үндсэн бүртгэл / Бараа материал / Данс</p>
            ) : null}
            {ComponentType === "MODAL" ? <p>Данс</p> : null}
            <button
              className="app-button"
              onClick={() => {
                form.resetFields();
                setIsOpenModal(true);
              }}
            >
              <Image
                src={"/images/AddIcon.svg"}
                width={12}
                height={12}
                alt="addicon"
              />
              Шинээр бүртгэх
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
              src={"/images/UploadIcon.svg"}
              width={24}
              height={24}
              alt="uploadIcon"
            />
            <Image
              src={"/images/DownloadIcon.svg"}
              width={24}
              height={24}
              alt="downloadIcon"
            />
          </div>
        </div>
        <div className="body">
          <div
            style={{
              width: "100%",
            }}
          >
            <NewTable
              scroll={{ x: ComponentType === "FULL" ? 1400 : 400 }}
              rowKey="id"
              data={data}
              meta={meta}
              columns={columns}
              doubleClick={ComponentType === "MODAL" ? true : false}
              onDClick={(value) => {
                if (ComponentType === "MODAL") {
                  onClickModal?.(value);
                }
              }}
              onChange={(params) => getData(params)}
              onColumns={(columns) => setColumns(columns)}
              newParams={newParams}
              onParams={(params) => setNewParams(params)}
              incomeFilters={filters}
              onEdit={(row) => openModal(true, row)}
              onDelete={(id) => onDelete(id)}
            />
          </div>
        </div>
      </div>
      <NewModal
        width={300}
        title="Бараа материалын данс"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Бараа материалын дансны код"
            name="accountNo"
            rules={[
              {
                required: true,
                message: "Заавал",
              },
            ]}
          >
            <NewInput />
          </Form.Item>
          <Form.Item
            label="Бараа материалын дансны нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Заавал",
              },
            ]}
          >
            <NewInput />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
export default InventoriesType;
