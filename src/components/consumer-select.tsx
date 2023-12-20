import Image from "next/image";
import { Form, Space } from "antd";
import { NewFilterSelect } from "./input";
import { useEffect, useState } from "react";
import { IDataConsumer, IParamConsumer } from "@/service/consumer/entities";
import { ConsumerService } from "@/service/consumer/service";
import NewModal from "./modal";
import Information from "@/app/main/dashboard/registration/customer/information/information";
import { FormInstance } from "antd/lib";
import { Rule } from "antd/es/form";
interface IProps {
  form: FormInstance;
  rules: Rule[];
  name: string | (string | number)[];
  isDisable?: boolean;
}
export const ConsumerSelect = (props: IProps) => {
  const { form, name, rules, isDisable } = props;
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [consumers, setConsumers] = useState<IDataConsumer[]>([]);
  const getConsumers = async (params: IParamConsumer) => {
    await ConsumerService.get(params).then((response) => {
      if (response.success) {
        setConsumers(response.response.data);
      }
    });
  };
  useEffect(() => {
    getConsumers({});
  }, []);
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
            disabled={isDisable}
          />
        </Form.Item>
      </Space.Compact>
      <NewModal
        width={1300}
        title="Харилцагчын жагсаалт"
        open={isOpenPopOver}
        onCancel={() => setIsOpenPopOver(false)}
      >
        <Information
          ComponentType="MIDDLE"
          onClickModal={(row: IDataConsumer) => {
            form.setFieldsValue({
              name: row.id,
            });
            setIsOpenPopOver(false);
          }}
        />
      </NewModal>
    </>
  );
};
