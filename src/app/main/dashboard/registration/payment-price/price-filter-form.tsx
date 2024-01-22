import { NewFilterSelect, NewInput, NewSelect } from "@/components/input";
import { Button, Card, Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import DateIntervalForm from "@/components/dateIntervalForm";
import {
  IDataWarehouse,
  IParamWarehouse,
} from "@/service/reference/warehouse/entities";
import { useEffect, useState } from "react";
import { WarehouseService } from "@/service/reference/warehouse/service";
import { ConsumerSelect } from "@/components/consumer-select";
import { ConsumerSectionSelect } from "@/components/consumer-section-select";
import { IParamUser, IUser } from "@/service/authentication/entities";
import { authService } from "@/service/authentication/service";
import { IParamCommand } from "@/service/command/entities";
import { MaterialSelect } from "@/components/material-select";
import { MaterialSectionSelect } from "@/components/material-section-select";
import { MaterialType } from "@/service/material/entities";
interface IProps {
  onToggle(): void;
  getData(params: IParamCommand): void;
}
export const PriceFilterForm = (props: IProps) => {
  const { onToggle, getData } = props;
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState<IDataWarehouse[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const getWarehouses = async (params: IParamWarehouse) => {
    await WarehouseService.get(params).then((response) => {
      if (response.success) {
        setWarehouses(response.response.data);
      }
    });
  };
  const getUsers = async (ids: number[]) => {
    await authService.getAllUsers({ ids }).then((response) => {
      if (response.success) {
        setUsers(response.response);
      }
    });
  };
  useEffect(() => {
    getWarehouses({});
    getUsers([]);
  }, []);
  const onFinish = (params: IParamCommand) => {
    getData(params);
  };
  const onReset = () => {
    form.resetFields();
  };
  return (
    <Card
      title="Шүүлтүүр"
      extra={
        <Button
          type="link"
          onClick={() => onToggle()}
          icon={<ArrowRightOutlined />}
        />
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Тушаалын дугаар" name="commandNo">
          <NewInput />
        </Form.Item>
        <DateIntervalForm
          intervalStyle={{ minWidth: 120 }}
          dateStyle={{ minWidth: 220 }}
          form={form}
          itemname="commandAt"
          label="Тушаалын огноо"
        />
        <Form.Item label="Мөрдөх төв, салбарын нэр" name="warehouseId">
          <NewFilterSelect
            options={warehouses.map((warehouse) => ({
              value: warehouse.id,
              label: warehouse.name,
            }))}
          />
        </Form.Item>
        <DateIntervalForm
          intervalStyle={{ minWidth: 120 }}
          dateStyle={{ minWidth: 220 }}
          form={form}
          itemname="ruleAt"
          label="Мөрдөж эхлэх огноо"
        />
        <Form.Item label="Харилцагчийн код, нэр">
          <ConsumerSelect form={form} rules={[]} name="consumerId" />
        </Form.Item>
        <Form.Item label="Харилцагчийн бүлэг">
          <ConsumerSectionSelect
            form={form}
            rules={[]}
            name="consumerSectionId"
          />
        </Form.Item>
        <Form.Item label="Бараа үйлчилгээний код, нэр">
          <MaterialSelect
            form={form}
            rules={[]}
            params={{
              types: [
                MaterialType.Material,
                MaterialType.Package,
                MaterialType.Service,
              ],
            }}
            name="materialId"
          />
        </Form.Item>
        <Form.Item label="Бараа үйлчилгээний бүлэг">
          <MaterialSectionSelect form={form} rules={[]} isLeaf={false} />
        </Form.Item>
        <Form.Item label="Нэгж үнэ">
          <ConsumerSelect form={form} rules={[]} name="consumerId" />
        </Form.Item>
        <Form.Item label="Бөөний нэгж үнэ">
          <ConsumerSelect form={form} rules={[]} name="consumerId" />
        </Form.Item>
        <Form.Item label="Үүсгэсэн хэрэглэгч" name="createdUserId">
          <NewFilterSelect
            options={users.map((user) => ({
              value: user.id,
              label: user.firstName,
            }))}
          />
        </Form.Item>
        <DateIntervalForm
          intervalStyle={{ minWidth: 120 }}
          dateStyle={{ minWidth: 220 }}
          form={form}
          itemname="createdAt"
          label="Үүсгэсэн огноо"
        />
        <Form.Item label="Өөрчлөлт хийсэн хэрэглэгч" name="updatedUserId">
          <NewFilterSelect
            options={users.map((user) => ({
              value: user.id,
              label: user.firstName,
            }))}
          />
        </Form.Item>
        <hr />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Шүүх
          </Button>
          <Button onClick={onReset}>Цэвэрлэх</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
