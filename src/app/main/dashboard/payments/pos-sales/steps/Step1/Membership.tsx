import { NewInput, NewSearch, NewSelect } from "@/components/input";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { IDataConsumer } from "@/service/consumer/entities";
import { IDataConsumerMembership } from "@/service/consumer/membership/entities";
import { ConsumerMembershipService } from "@/service/consumer/membership/service";
import { ConsumerService } from "@/service/consumer/service";
import { Form, Typography } from "antd";
import React, { useContext, useState } from "react";
import { NumericFormat } from "react-number-format";

const { Title } = Typography;

const Membership: React.FC = () => {
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const [consumer, setConsumer] = useState<IDataConsumer>();
  const [selectedMembership, setSelectedMembership] =
    useState<IDataConsumerMembership>();
  const getConsumerMembership = async (searchValue: string) => {
    blockContext.block();
    await ConsumerService.Byfilter(searchValue)
      .then((response) => {
        if (response.success && response.response) {
          setConsumer(response.response);
        } else {
          openNofi("error", "Хайсан үр дүн байхгүй");
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getMembershipCard = async (id: number) => {
    await ConsumerMembershipService.getById(id).then((response) => {
      if (response.success) {
        setSelectedMembership(response.response);
      }
    });
  };
  const Discount = () => {
    // if (membership?.membership.isSave && membership.membership.isPercent) {
    return (
      <Title
        level={3}
        style={{
          color: "#E35D6A",
        }}
        type="secondary"
      >
        Нэмэгдсэн оноо:
        {/* data.membershipIncreaseAmount */}
        <NumericFormat
          value={3000}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          displayType="text"
          suffix="₮"
        />
      </Title>
    );
    // }
  };
  const Saved = () => {
    return (
      <Title
        style={{
          fontSize: 20,
          fontWeight: 400,
          alignSelf: "center",
        }}
      >
        Онооны үлдэгдэл:
        <NumericFormat
          value={selectedMembership?.amount}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          displayType="text"
          suffix="₮"
        />
      </Title>
    );
  };
  const UseSaved = () => {
    // if (membership?.membership.isSave) {
    return (
      <div className="inputs">
        <button
          className="app-button-regular"
          style={{
            height: 36,
            minWidth: 140,
          }}
          onClick={() => {
            // form.validateFields(["pinCode"]).then((values) => {
            //   dispatch(
            //     setIsUseSaveAndSetUseValue({
            //       isUseSave: true,
            //       useValue: amount,
            //     })
            //   );
            // });
          }}
        >
          Оноо ашиглах
        </button>
        <Form.Item
          style={{
            width: "100%",
          }}
          name={"pinCode"}
          rules={[
            {
              required: true,
              message: "Нууц үг оруулна уу",
            },
          ]}
        >
          <NewInput type="password" placeholder="Пин код оруулах" />
        </Form.Item>
      </div>
    );
    // }
  };
  return (
    <Form form={form} autoComplete="off">
      <div className="step-membership">
        <Form.Item name="searchValue">
          <NewSearch
            enterButton
            onSearch={getConsumerMembership}
            placeholder="Утас/Эсвэл РД хайх"
          />
        </Form.Item>
        <div className="info">
          <div className="names">
            <Title level={3} type="secondary">
              Овог: {consumer?.lastName}
            </Title>
            <Title level={3} type="secondary">
              Нэр: {consumer?.name}
            </Title>
          </div>
          <div className="card-no">
            <Title level={3} type="secondary">
              Картын дугаар:
            </Title>
            <Form.Item name="consumerMembershipId">
              <NewSelect
                style={{
                  width: 200,
                }}
                options={consumer?.memberships
                  ?.filter(
                    (membership: IDataConsumerMembership) => !membership.isClose
                  )
                  ?.map((filteredMembership: IDataConsumerMembership) => ({
                    label: filteredMembership.cardno,
                    value: filteredMembership.id,
                  }))}
                onSelect={getMembershipCard}
              />
            </Form.Item>
          </div>
          <div className="card-info">
            <Title level={3} type="secondary">
              Картын нэр: {selectedMembership?.membership?.name}
            </Title>
            <Discount />
          </div>
          <Saved />
          <UseSaved />
        </div>
      </div>
    </Form>
  );
};
export default Membership;
