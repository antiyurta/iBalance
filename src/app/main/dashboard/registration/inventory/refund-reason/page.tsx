"use client";

import { NewInput } from "@/components/input";
import NewModal from "@/components/modal";
import { NewTable } from "@/components/table";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
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

const { Title } = Typography;
const RefundReasonPage = () => {
  const [form] = Form.useForm();
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [params, setParams] = useState<IParamReference>({
    type: IType.REASON_REFUND,
  });
  const [meta, setMeta] = useState<Meta>({});
  const [filters, setFilters] = useState<IFilterReference>({
    type: IType.REASON_REFUND,
  });
  const [data, setData] = useState<IDataReference[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDataReference>();
  const [columns, setColumns] = useState<FilteredColumnsReference>({
    name: {
      label: "Буцаалтын шалтгаан",
      isView: true,
      isFiltered: false,
      dataIndex: "name",
      type: DataIndexType.MULTI,
    },
    updatedAt: {
      label: "Өөрчлөлт хийсэн огноо",
      isView: true,
      isFiltered: false,
      dataIndex: "updatedAt",
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
  const getData = async (params: IParamReference) => {
    params.type = IType.REASON_REFUND;
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
    getData(params);
  }, []);

  useEffect(() => {
    getData(params);
  }, [isReloadList]);
  return (
    <div>
      <Row style={{ paddingTop: 12 }} gutter={[12, 24]}>
        <Col md={24} lg={16} xl={19}>
          <Space size={24}>
            <Title level={5}>
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
        <Col md={24} lg={8} xl={5}>
          <Input.Search />
        </Col>
        <Col span={24}>
          <NewTable
            scroll={{ x: 1700 }}
            rowKey="id"
            data={data}
            meta={meta}
            columns={columns}
            onChange={getData}
            onColumns={setColumns}
            newParams={params}
            onParams={setParams}
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
