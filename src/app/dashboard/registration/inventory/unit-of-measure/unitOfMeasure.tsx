import ColumnSettings from "@/components/columnSettings";
import NewDirectoryTree from "@/components/directoryTree";
import Filtered from "@/components/filtered";
import { NewInput, NewSearch, NewSelect } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  onCloseFilterTag,
  openNofi,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import {
  DataIndexType,
  FilteredColumns,
  IFilters,
  Meta,
} from "@/service/entities";
import {
  IDataUnitOfMeasure,
  IParamUnitOfMeasure,
  MeasurementType,
} from "@/service/material/unitOfMeasure/entities";
import { UnitOfMeasureService } from "@/service/material/unitOfMeasure/service";
import { Form } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

interface IProps {
  ComponentsType: string;
  onClickModal?: (row: IDataUnitOfMeasure) => void;
}

const UnitOfMeasure = (props: IProps) => {
  const { ComponentsType, onClickModal } = props;
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const tableWidth = "calc(100% - 262px)";
  const [form] = Form.useForm();
  const [data, setData] = useState<IDataUnitOfMeasure[]>([]);
  const [newParams, setNewParams] = useState<IParamUnitOfMeasure>({});
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [filters, setFilters] = useState<IFilters>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IDataUnitOfMeasure>();
  const [columns, setColumns] = useState<FilteredColumns>({
    shortName: {
      label: "Богино нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "shortName",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Хэмжих нэгжийн нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    type: {
      label: "Хэмжих нэгжийн бүлэг",
      isView: true,
      isFiltered: false,
      dataIndex: "type",
      type: DataIndexType.MEASUREMENT,
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
  const openModal = (state: boolean, row?: any) => {
    setEditMode(state);
    if (!state) {
      form.resetFields();
    } else {
      form.setFieldsValue(row);
    }
    setIsOpenModal(true);
    setSelectedRow(row);
  };
  const getData = async (params: IParamUnitOfMeasure) => {
    blockContext.block();
    await UnitOfMeasureService.get(params)
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
  const onFinish = async (values: IDataUnitOfMeasure) => {
    blockContext.block();
    if (editMode) {
      await UnitOfMeasureService.patch(selectedRow?.id, values)
        .then((response) => {
          if (response.success) {
            openNofi(
              "success",
              "Амжиллтай",
              "Хэмжих нэгж амжиллттай засагдлаа"
            );
            getData({ page: 1, limit: 10 });
            setIsOpenModal(false);
          }
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await UnitOfMeasureService.post(values).then((response) => {
        if (response.success) {
          openNofi("success", "Амжиллтай", "Хэмжих нэгж амжиллттай нэмэгдлээ");
          getData({ page: 1, limit: 10 });
          setIsOpenModal(false);
        }
      });
    }
  };
  const onDelete = async (id: number) => {
    await UnitOfMeasureService.remove(id).then((response) => {
      if (response.success) {
        openNofi("success", "Амжиллтай", "Хэмжих нэгж амжиллттай устгагдлаа");
        getData({ page: 1, limit: 10 });
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
            {ComponentsType === "FULL" ? (
              <p>Үндсэн бүртгэл / Бараа материал / Хэмжих нэгж</p>
            ) : null}
            {ComponentsType === "MODAL" ? <p>Хэмжих нэгж</p> : null}
            <button className="app-button" onClick={() => openModal(false)}>
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
          ) : null}
        </div>
        <div className="body">
          <NewDirectoryTree
            data={[]}
            mode="UNIT"
            extra="HALF"
            isLeaf={true}
            onClick={(key, isLeaf) => {
              if (isLeaf) {
                getData({
                  page: 1,
                  limit: 10,
                  type: [`${key}`],
                });
              }
            }}
          />
          <div
            style={{
              width: ComponentsType === "FULL" ? tableWidth : "100%",
            }}
          >
            <NewTable
              scroll={{ x: ComponentsType === "FULL" ? 1000 : 400 }}
              rowKey="id"
              doubleClick={true}
              onDClick={(value) => {
                if (ComponentsType === "MODAL") {
                  onClickModal?.(value);
                }
              }}
              data={data}
              meta={meta}
              columns={columns}
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
        title="Хэмжих нэгж"
        width={300}
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => form.validateFields().then((values) => onFinish(values))}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Хэмжих нэгжийн нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Хэмжих нэгжийн нэр заавал",
              },
            ]}
          >
            <NewInput placeholder="Хэмжих нэгжийн нэр" />
          </Form.Item>
          <Form.Item
            label="Богино нэр"
            name="shortName"
            rules={[
              {
                required: true,
                message: "Богино нэр заавал",
              },
            ]}
          >
            <NewInput placeholder="Богино нэр" />
          </Form.Item>
          <Form.Item
            label="Бүлэг"
            name="type"
            rules={[
              {
                required: true,
                message: "Бүлэг",
              },
            ]}
          >
            <NewSelect
              placeholder="Бүлэг"
              options={[
                {
                  label: "Тооны хэмжих нэгж",
                  value: MeasurementType.Quantity,
                },
                {
                  label: "Уртын хэмжих нэгж",
                  value: MeasurementType.Length,
                },
                {
                  label: "Шингэний хэмжих нэгж",
                  value: MeasurementType.Volume,
                },
                {
                  label: "Талбайн хэмжих нэгж",
                  value: MeasurementType.Area,
                },
                {
                  label: " Цаг хугацааны хэмжих нэгж",
                  value: MeasurementType.Time,
                },
                {
                  label: "Хүндийн хэмжих нэгж",
                  value: MeasurementType.Weight,
                },
              ]}
            />
          </Form.Item>
        </Form>
      </NewModal>
    </div>
  );
};
export default UnitOfMeasure;
