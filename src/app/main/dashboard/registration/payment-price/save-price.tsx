import Image from "next/image";
import { Button, Col, Form, Row, Space } from "antd";
import NewCard from "@/components/Card";
import { NewDatePicker, NewInput, NewSelect } from "@/components/input";
import { useContext, useEffect, useState } from "react";
import { IDataBranch, IParamBranch } from "@/service/reference/branch/entities";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { BranchService } from "@/service/reference/branch/service";
import { ConsumerService } from "@/service/consumer/service";
import {
  CommandType,
  IDataCommand,
  IResponseOneCommand,
} from "@/service/command/entities";
import { MaterialCommandService } from "@/service/command/service";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import dayjs from "dayjs";
import mnMN from "antd/es/calendar/locale/mn_MN";
import EditableTableProduct from "./product-price/editableTable";
import EditableTableService from "./service-price/editableTable";
import EditableTablePackage from "./package-price/editableTable";
import EditableTableDiscount from "./discount/editableTable";

interface IProps {
  selectedCommand?: IDataCommand;
  isEdit?: boolean;
  isSucess?: (state: boolean) => void;
  type: CommandType;
}
const SavePrice = (props: IProps) => {
  const { selectedCommand, isEdit, isSucess, type } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const [branchs, setBranchs] = useState<IDataBranch[]>([]);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const getBranchs = async (params: IParamBranch) => {
    await BranchService.get(params).then((response) => {
      if (response.success) {
        setBranchs(response.response.data);
      }
    });
  };
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  const onFinish = async (values: IDataCommand) => {
    blockContext.block();
    values.type = type;
    if (isEdit && selectedCommand) {
      if (type == CommandType.Discount) {
      } else {
        await MaterialCommandService.patchPrice(
          selectedCommand.id,
          values
        ).then((response) => {
          success("Үнэ", response);
          isSucess?.(true);
        });
      }
    } else {
      if (type == CommandType.Discount) {
        await MaterialCommandService.postDiscount(values).then((response) => {
          success("Хөнгөлөлт", response);
        });
      } else {
        await MaterialCommandService.postPrice(values).then((response) => {
          success("Үнэ", response);
        });
      }
    }
    blockContext.unblock();
  };
  const success = (name: string, response: IResponseOneCommand) => {
    if (response.success) {
      openNofi("success", "Амжилттай", `${name} амжилттай хадгаллаа.`);
      setIsReloadList(!isReloadList);
      form.resetFields();
    }
  };
  useEffect(() => {
    getBranchs({});
    getConsumers({});
  }, []);
  useEffect(() => {
    if (selectedCommand) {
      form.setFieldsValue({
        ...selectedCommand,
        commandAt: dayjs(selectedCommand.commandAt, "YYYY-MM-DD"),
        ruleAt: dayjs(selectedCommand.ruleAt, "YYYY-MM-DD"),
        prices: selectedCommand?.prices.map((price) => ({
          materialId: price.materialId,
          name: price.material.name,
          measurement: price.material.measurement?.name,
          countPackage: price.material.countPackage,
          section: price.material.section?.name,
          unitAmount: price.unitAmount,
          lumpQuantity: price.lumpQuantity,
          lumpAmount: price.lumpAmount,
        })),
      });
    }
  }, [selectedCommand]);

  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
          size={12}
        >
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
      </Col>
      <Col span={24}>
        <NewCard>
          <Form form={form} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="ID" name="id">
                  <NewInput disabled />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Тушаалын огноо" name="commandAt">
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Тушаалын дугаар" name="commandNo">
                  <NewInput />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item
                  label="Мөрдөж эхлэх огноо"
                  name="ruleAt"
                  rules={[
                    {
                      required: true,
                      message: "Заавал",
                    },
                  ]}
                >
                  <NewDatePicker
                    style={{
                      width: "100%",
                    }}
                    format={"YYYY-MM-DD"}
                    locale={mnMN}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Мөрдөх төв, салбарын нэр" name="branchId">
                  <NewSelect
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={branchs.map((branch) => ({
                      value: branch.id,
                      label: branch.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col md={12} lg={8} xl={4}>
                <Form.Item label="Харилцагчын код, нэр">
                  <Space.Compact>
                    <div
                      className="extraButton"
                      onClick={() => setIsOpenPopOver(true)}
                    >
                      <Image
                        src="/icons/clipboardBlack.svg"
                        width={16}
                        height={16}
                        alt="clipboard"
                      />
                    </div>
                    <Form.Item name="consumerId">
                      <NewSelect
                        style={{
                          width: "100%",
                        }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={consumers.map((consumer) => ({
                          value: consumer.id,
                          label: consumer.name,
                        }))}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                width: "100%",
                height: 1,
                background: "#DEE2E6",
              }}
            />
            <Form.List name="prices">
              {(items, { add, remove }) => {
                if (type === CommandType.Material) {
                  return (
                    <EditableTableProduct
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                } else if (type === CommandType.Service) {
                  return (
                    <EditableTableService
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                } else if (type === CommandType.Package) {
                  return (
                    <EditableTablePackage
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                }
              }}
            </Form.List>
            <Form.List name="discounts">
              {(items, { add, remove }) => {
                if (type === CommandType.Discount) {
                  return (
                    <EditableTableDiscount
                      data={items}
                      form={form}
                      add={add}
                      remove={remove}
                    />
                  );
                }
              }}
            </Form.List>
          </Form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              paddingTop: 12,
            }}
          >
            <p
              style={{
                color: "#000",
                textAlign: "center",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "normal",
              }}
            >
              *Харилцагчид тусгай үнээр борлуулах бол харилцагчийн нэрийг
              сонгоно.
            </p>
            <Button
              type="primary"
              onClick={() =>
                form.validateFields().then((values) => {
                  onFinish(values);
                })
              }
            >
              Хадгалах
            </Button>
          </div>
        </NewCard>
      </Col>
    </Row>
  );
};
export default SavePrice;
