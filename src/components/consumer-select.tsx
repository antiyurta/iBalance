import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import React, { useEffect, useState } from "react";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import NewModal from "./modal";
import Information from "@/app/main/dashboard/registration/customer/information/information";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
import { Operator } from "@/service/entities";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  name: string | (string | number)[];
  isSupplier?: boolean;
  isDisable?: boolean;
  onClear?: () => void;
  onSelect?: (value: IDataConsumer) => void;
}
export const ConsumerSelect: React.FC<IProps> = ({
  form,
  name,
  rules,
  isSupplier,
  isDisable,
  onClear,
  onSelect,
}) => {
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const [consumerDictionary, setConsumerDictionary] =
    useState<Map<number, IDataConsumer>>();
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  useEffect(() => {
    getConsumers({
      filters: [
        { dataIndex: ["isActive"], operator: Operator.Equals, filter: true },
        {
          dataIndex: ["isSupplier"],
          operator: Operator.Equals,
          filter: Boolean(isSupplier),
        },
      ],
    });
  }, []);
  useEffect(() => {
    setConsumerDictionary(
      consumers.reduce((dict, consumer) => {
        dict.set(consumer.id, consumer);
        return dict;
      }, new Map<number, IDataConsumer>())
    );
  }, [consumers]);
  return (
    <>
      <Space.Compact>
        {isDisable ? null : (
          <div className="extraButton" onClick={() => setIsOpenPopOver(true)}>
            <Image
              src="/icons/clipboardBlack.svg"
              width={16}
              height={16}
              alt="clipboard"
            />
          </div>
        )}
        <Form.Item name={name} rules={rules}>
          <NewFilterSelect
            style={{
              width: "100%",
            }}
            options={consumers.map((consumer) => ({
              value: consumer.id,
              label: `${consumer.code} - ${consumer.name}`,
            }))}
            onClear={onClear}
            onSelect={(id) => {
              const consumer = consumerDictionary?.get(id);
              if (consumer) onSelect?.(consumer);
            }}
            disabled={isDisable}
          />
        </Form.Item>
      </Space.Compact>
      <NewModal
        width={1300}
        title="Харилцагчын жагсаалт"
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
        footer={null}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldValue([name], row.id);
            if (row) onSelect?.(row);
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </>
  );
};
