"use client";

import ColumnSettings from "@/components/columnSettings";
import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import Filtered from "@/components/table/filtered";
import { findIndexInColumnSettings, getParam } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { useTypedSelector } from "@/feature/store/reducer";
import { newPane } from "@/feature/store/slice/param.slice";
import { AppDispatch } from "@/feature/store/store";
import { DataIndexType, Meta } from "@/service/entities";
import {
  FilteredColumnsReference,
  IDataReference,
  IFilterReference,
  IParamReference,
  IResponseReference,
  IType,
} from "@/service/reference/entity";
import { ReferenceService } from "@/service/reference/reference";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const { Title } = Typography;
const key = "inventory/refund-reason";
const RefundReasonPage = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext);
  const { items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, key);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({});
  const [filters, setFilters] = useState<IFilterReference>();
  const [data, setData] = useState<IDataReference[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDataReference>();
  const [columns, setColumns] = useState<FilteredColumnsReference>({
    name: {
      label: "Буцаалтын шалтгаан",
      isView: true,
      isFiltered: false,
      dataIndex: ["name"],
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedAt"],
      type: DataIndexType.DATE,
    },
    updatedBy: {
      label: "Өөрчлөлт хийсэн хэрэглэгч",
      isView: true,
      isFiltered: false,
      dataIndex: ["updatedUser", "firstName"],
      type: DataIndexType.MULTI,
    },
  });
  const openModal = (state: boolean, refund?: IDataReference) => {
    setIsReloadList(false);
    setIsEdit(state);
    form.resetFields();
    if (state && refund) {
      setSelectedRow(refund);
      form.setFieldValue("name", refund.name);
    }
    setIsOpenModal(true);
  };
  const getData = async () => {
    const params: IParamReference = { ...param, type: IType.REASON_REFUND };
    await ReferenceService.get(params).then((response) => {
      if (response.success) {
        setData(response.response.data);
        setMeta(response.response.meta);
        setFilters(response.response.filter);
      }
    });
  };
  const onDelete = async (id: number) => {
    await ReferenceService.remove(id).then((response) => {
      if (response.success) {
        setIsReloadList(!isReloadList);
      }
    });
  };
  const onFinish = async (data: IDataReference) => {
    blockContext.block();
    data.type = IType.REASON_REFUND;
    if (isEdit && selectedRow && selectedRow.id) {
      await ReferenceService.patch(selectedRow.id, data)
        .then((response) => {
          success(response);
        })
        .finally(() => {
          blockContext.unblock();
        });
    } else {
      await ReferenceService.post(data)
        .then((response) => {
          success(response);
        })
        .finally(() => {
          blockContext.unblock();
        });
    }
  };
  const success = (response: IResponseReference) => {
    if (response.success) {
      setIsOpenModal(false);
      setIsReloadList(!isReloadList);
    }
  };
  useEffect(() => {
    dispatch(newPane({ key, param: {} }));
  }, []);

  useEffect(() => {
    getData();
  }, [param, isReloadList]);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={3}>
              Үндсэн бүртгэл / Бараа материал / Буцаалтын шалтгаан
            </Title>
            <Button
              type="primary"
              onClick={() => openModal(false)}
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
        <Col span={24}>
          <Space
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            size={12}
          >
            <Filtered columns={columns} />
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size={12}
            >
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
                src={"/images/DownloadIcon.svg"}
                width={24}
                height={24}
                alt="downloadIcon"
              />
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <NewTable
            scroll={{ x: 1700 }}
            rowKey="id"
            data={data}
            meta={meta}
            columns={columns}
            onColumns={setColumns}
            incomeFilters={filters}
            isEdit={true}
            isDelete={true}
            onEdit={(row) => openModal(true, row)}
            onDelete={onDelete}
          />
        </Col>
      </Row>
      <NewModal
        width={500}
        title="Буцаалтын шалтгаан"
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
        onOk={() =>
          form.validateFields().then((values) => {
            onFinish(values);
          })
        }
      >
        <Form form={form} layout="vertical">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Form.Item label="Шалтгаан" name="name">
              <NewInput />
            </Form.Item>
          </div>
        </Form>
      </NewModal>
    </div>
  );
};
export default RefundReasonPage;
