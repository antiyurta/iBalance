import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewInput, NewSearch } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { UploadExcelFile } from "@/components/upload-excel-file";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  unDuplicate,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  ComponentType,
  DataIndexType,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  FilteredColumnsMaterialAccount,
  IDataMaterialAccount,
  IParamMaterialAccount,
} from "@/service/material/account/entities";
import { MaterialAccountService } from "@/service/material/account/service";
import { App, Form, Typography } from "antd";
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useState } from "react";

const { Title } = Typography;

interface IProps {
  ComponentType: ComponentType;
  onClickModal?: (row: any) => void;
}

const InventoriesType = (props: IProps) => {
  const { ComponentType, onClickModal } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [params, setParams] = useState<IParamMaterialAccount>({ page: 1, limit: 10 });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [data, setData] = useState<IDataMaterialAccount[]>([]);
  const [filters, setFilters] = useState<IFilters>();
  //
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isUploadModal, setIsUploadModal] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  //
  const [selectedRow, setSelectedRow] = useState<IDataMaterialAccount>();
  const [columns, setColumns] = useState<FilteredColumnsMaterialAccount>({
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
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  // modal neeh edit uu esvel new uu ??
  const openModal = (state: boolean, row?: IDataMaterialAccount) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (param: IParamMaterialAccount) => {
    blockContext.block();
    var prm: IParamMaterialAccount = {
      ...params,
      ...param,
      queries: params.queries,
    };
    if (param.queries?.length) {
      const incomeParam = param.queries[0].param;
      prm.queries = [...unDuplicate(incomeParam, params), ...param.queries];
    }
    if (param.accountNo) {
      prm.queries = [...unDuplicate("accountNo", params)];
    }
    if (param.name) {
      prm.queries = [...unDuplicate("name", params)];
    }
    setParams(prm);
    await MaterialAccountService.get(prm)
      .then((response) => {
        if (response.success) {
          setData(response.response.data);
          setMeta(response.response.meta);
          setFilters(response.response.filter);
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const newType = () => {
    form.resetFields();
    setEditMode(false);
    setIsOpenModal(true);
  };
  const onFinish = async (values: IDataMaterialAccount) => {
    blockContext.block();
    if (editMode) {
      await MaterialAccountService.patch(selectedRow?.id, values)
        .then((response) => {
          if (response.success) {
            getData(params);
            setIsOpenModal(false);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await MaterialAccountService.post(values)
        .then((response) => {
          if (response.success) {
            getData(params);
            setIsOpenModal(false);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  const onDelete = async (id: number) => {
    await MaterialAccountService.remove(id).then((response) => {
      if (response.success) {
        getData(params);
        setIsOpenModal(false);
      }
    });
  };
  useEffect(() => {
    getData(params);
  }, [isReload]);
  return (
    <div>
      <div className="information">
        <div className="header">
          <div className="left">
            {ComponentType === "FULL" ? (
              <Title level={3}>Үндсэн бүртгэл / Бараа материал / Данс</Title>
            ) : null}
            {ComponentType === "MODAL" ? <Title level={3}>Данс</Title> : null}
            <button className="app-button" onClick={newType}>
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
                params: params,
                onParams: (params) => setParams(params),
              });
              getData(params);
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
                  params: params,
                  onParams: (params) => setParams(params),
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
              alt="Дата байршуулах"
              onClick={() => setIsUploadModal(true)}
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
              scroll={{ x: ComponentType === "FULL" ? 1200 : 400 }}
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
              newParams={params}
              onParams={(params) => setParams(params)}
              incomeFilters={filters}
              isEdit={true}
              onEdit={(row) => openModal(true, row)}
              isDelete={true}
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
      <UploadExcelFile
        isModal={isUploadModal}
        setIsModal={(value) => setIsUploadModal(value)}
        templateExcel="MATERIAL_TYPE"
        isReload={isReload}
        setIsReload={setIsReload}
      />
    </div>
  );
};
export default InventoriesType;
