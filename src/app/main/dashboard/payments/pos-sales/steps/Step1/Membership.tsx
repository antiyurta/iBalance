import { NewInput, NewSearch, NewSelect } from "@/components/input";
import { openNofi } from "@/feature/common";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { PosStepActions } from "@/feature/core/actions/PosAction";
import { RootState, useTypedSelector } from "@/feature/store/reducer";
import { IDataConsumerMembership } from "@/service/consumer/membership/entities";
import { ConsumerService } from "@/service/consumer/service";
import { Form, Typography } from "antd";
import { useContext, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";

const { Title } = Typography;

interface IProps {
  amount: number;
}

const Membership = (props: IProps) => {
  const dispatch = useDispatch();
  const { regnoOrPhono, consumer, membershipId, membership, useValue } =
    useTypedSelector((state: RootState) => state.posStep);
  const { amount } = props;
  const [form] = Form.useForm();
  const blockContext: BlockView = useContext(BlockContext); // uildeliig blockloh
  const getConsumerMembership = async (searchValue: string) => {
    blockContext.block();
    await ConsumerService.Byfilter(searchValue)
      .then((response) => {
        if (response.success && response.response) {
          dispatch(PosStepActions.setRegnoOrPhono(searchValue));
          dispatch(PosStepActions.setConsumer(response.response));
        } else {
          openNofi("error", "Хайсан үр дүн байхгүй");
        }
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  const getMembershipCard = async (id: number) => {
    dispatch(PosStepActions.setMembershipId(id));
    dispatch(
      PosStepActions.setMembership(
        consumer?.memberships.find(
          (membership: IDataConsumerMembership) => membership.id === id
        )
      )
    );
  };
  const Discount = () => {
    if (membership?.membership.isSave && membership.membership.isPercent) {
      return (
        <Title
          level={3}
          style={{
            color: "#E35D6A",
          }}
          type="secondary"
        >
          Нэмэгдсэн оноо:
          <NumericFormat
            value={(amount / 100) * membership.membership.discount}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </Title>
      );
    }
  };
  const Saved = () => {
    if (membership?.membership.isSave) {
      const discount = (amount / 100) * membership.membership.discount;
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
            value={membership.amount + discount}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            displayType="text"
            suffix="₮"
          />
        </Title>
      );
    }
  };
  const UseSaved = () => {
    if (membership?.membership.isSave) {
      return (
        <div className="inputs">
          <button
            className="app-button-regular"
            style={{
              height: 36,
              minWidth: 140,
            }}
            onClick={() => {
              form.validateFields(["pinCode"]).then((values) => {
                dispatch(
                  PosStepActions.setIsUseSaveAndSeUseValue(true, amount)
                );
              });
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
    }
  };
  useEffect(() => {
    if (membershipId) {
      dispatch(
        PosStepActions.setIsSaveAndSaveValue(
          membership?.membership.isSave,
          (amount / 100) * membership.membership.discount
        )
      );
      dispatch(
        PosStepActions.setIsUseSaveAndSeUseValue(
          membership?.membership.isSave,
          membership?.membership.isSave ? useValue : 0
        )
      );
    }
  }, [membershipId]);

  useEffect(() => {
    form.resetFields([["membershipId"]]);
  }, [regnoOrPhono]);
  return (
    <Form
      form={form}
      autoComplete="off"
      initialValues={{
        searchValue: regnoOrPhono,
        membershipId: membershipId,
      }}
    >
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
            <Form.Item name="membershipId">
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
              Картын нэр: {membership?.membership.name}
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
