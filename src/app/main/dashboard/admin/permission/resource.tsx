"use client";
import ColumnSettings from "@/components/columnSettings";
import Filtered from "@/components/filtered";
import { NewFilterSelect, NewInput, NewTextArea } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { findIndexInColumnSettings, onCloseFilterTag } from "@/feature/common";
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

const { Title } = Typography;
const ConfigResource = () => {
  const blockContext: BlockView = useContext(BlockContext);
  const [form] = Form.useForm<IDataResource>();
  const [data, setData] = useState<IDataResource[]>([]);
  const [filters, setFilters] = useState<IFilterResource>();
  const [params, setParams] = useState<IParamResource>({ page: 1, limit: 10 });
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10 });
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isFilterToggle, setIsFilterToggle] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<IDataResource>();
  const [columns, setColumns] = useState<FilteredColumnsResource>({
    id: {
      label: "№",
      isView: true,
      isFiltered: false,
      dataIndex: "id",
      type: DataIndexType.MULTI,
    },
    name: {
      label: "Нэр",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    description: {
      label: "Тайлбар",
      isView: true,
      isFiltered: false,
      dataIndex: "description",
      type: DataIndexType.MULTI,
    },
    createdAt: {
      label: "Үүсгэсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "createdAt",
      type: DataIndexType.DATE,
    },
  });
  const getData = async (params: IParamResource) => {
    await ResourceService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        // setFilters(response.response.filter);
      }
    });
  };
  const onFinish = async (values: IDataResource) => {
    blockContext.block();
    if (selectedResource) {
      await ResourceService.patch(selectedResource.id, values)
        .then((response) => {
          if (response.success) {
            getData(params);
            setIsModal(false);
          }
        })
        .finally(() => blockContext.unblock());
    } else {
      await ResourceService.post(values)
        .then((response) => {
          if (response.success) {
            getData(params);
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
          getData(params);
        }
      })
      .finally(() => blockContext.unblock());
  };
  useEffect(() => {
    getData(params);
  }, []);
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
              <Filtered
                columns={columns}
                isActive={(key, state) => {
                  onCloseFilterTag({
                    key: key,
                    state: state,
                    column: columns,
                    onColumn: setColumns,
                    params: params,
                    onParams: setParams,
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
                      columns,
                      onColumns: setColumns,
                      params,
                      onParams: (params) => setParams(params),
                      getData,
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
              onChange={getData}
              onColumns={setColumns}
              newParams={params}
              onParams={setParams}
              incomeFilters={filters}
              isEdit
              onEdit={(row: IDataResource) => {
                form.resetFields();
                setSelectedResource(row);
                form.setFieldsValue({
                  id: row.id,
                  name: row.name,
                  description: row.description,
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
          <Form.Item label="Нэр" name={"name"}>
            <NewInput />
          </Form.Item>
          <Form.Item label="Тайлбар" name={"description"}>
            <NewTextArea />
          </Form.Item>
        </Form>
      </NewModal>
    </>
  );
};
export default ConfigResource;
