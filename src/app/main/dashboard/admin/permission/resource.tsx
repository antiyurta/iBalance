"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/table/filtered";
import {
  NewFilterSelect,
  NewInput,
  NewInputNumber,
  NewTextArea,
} from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import {
  findIndexInColumnSettings,
  getParam,
  onCloseFilterTag,
} from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsResource,
  IDataResource,
  IFilterResource,
  IParamResource,
} from "@/service/permission/resource/entities";
import { ResourceService } from "@/service/permission/resource/service";
import { Button, Col, Form, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";

const { Title } = Typography;
const key = "admin/permission/resource";
const ConfigResource = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<IDataResource>();
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<IDataResource[]>([]);
  const [filters, setFilters] = useState<IFilterResource>();
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<IDataResource>();
  const [columns, setColumns] = useState<FilteredColumnsResource>({
    position: {
      label: "Байрлал",
      isView: true,
      isFiltered: false,
      dataIndex: ["position"],
      type: DataIndexType.MULTI,
    },
    label: {
      label: "Нэр",
      isView: true,
      isFiltered: false,
      dataIndex: ["label"],
      type: DataIndexType.MULTI,
    },
    key: {
      label: "Түлхүүр",
      isView: true,
      isFiltered: false,
      dataIndex: ["key"],
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["createdAt"],
      type: DataIndexType.DATE,
    },
  });
  const getData = async () => {
    await ResourceService.get({ ...param }).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const onFinish = async (values: IDataResource) => {
    blockContext.block();
    if (selectedResource) {
      await ResourceService.patch(selectedResource.id, values)
        .then((response) => {
          if (response.success) {
            getData();
            setIsModal(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await ResourceService.post(values)
        .then((response) => {
          if (response.success) {
            getData();
            setIsModal(false);
          }
        })
        .finally(() => blockContext.unblock());
    }
  };
  const onDelete = async (id: number) => {
    blockContext.block();
    await ResourceService.remove(id)
      .then((response) => {
        if (response.success) {
          getData();
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);
  useEffect(() => {
    getData();
  }, [param]);
  return (
    <>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>Админ / POS-ын тохиргоо</Title>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setSelectedResource(undefined);
                setIsModal(true);
              }}
              icon={
                <Image
                  src={"/images/AddIcon.svg"}
                  width={12}
                  height={12}
                  alt="addicon"
                />
              }
            >
              Шинээр бүртгэх
            </Button>
          </Space>
        </Col>
        <Col span={isFilterToggle ? 20 : 24}>
          <div className="information">
            <div className="second-header">
              <Filtered columns={columns} />
              <div className="extra">
                <ColumnSettings
                  columns={columns}
                  columnIndexes={(arg1, arg2) =>
                    findIndexInColumnSettings({
                      newRowIndexes: arg1,
                      unSelectedRow: arg2,
                      columns,
                      onColumns: setColumns,
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
                <Image
                  onClick={() => setIsFilterToggle(!isFilterToggle)}
                  src={
                    isFilterToggle
                      ? "/images/filterTrue.svg"
                      : "/images/filterFalse.svg"
                  }
                  width={24}
                  height={24}
                  alt="filter"
                />
              </div>
            </div>
            <NewTable
              scroll={{ x: 1000 }}
              rowKey="id"
              doubleClick={true}
              data={data}
              meta={meta}
              columns={columns}
              onColumns={setColumns}
              incomeFilters={filters}
              isEdit
              onEdit={(row: IDataResource) => {
                form.resetFields();
                setSelectedResource(row);
                form.setFieldsValue({
                  position: row.position,
                  label: row.label,
                  key: row.key,
                });
                setIsModal(true);
              }}
              isDelete
              onDelete={onDelete}
            />
          </div>
        </Col>
      </Row>
      <NewModal
        title={"Цэс"}
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Нэр" name={"label"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Түлхүүр" name={"key"}>
            <NewTextArea />
          </Form.Item>
          <Form.Item label="Байрлал" name={"position"}>
            <NewInputNumber />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default ConfigResource;
