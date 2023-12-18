import { Operator } from "@/service/entities";

interface IProps {
  condition: Operator;
  conditionValue: number;
  quantity: number;
  percent: number;
}
export const Coupon = (props: IProps) => {
  const { condition, conditionValue, quantity, percent } = props;
  const getCondition = (): string => {
    let conditionStr = "";
    if (condition == Operator.IsGreatorOrEqual) {
      conditionStr = `${conditionValue}-c дээш`;
    } else if (condition == Operator.Equals) {
      conditionStr = `${conditionValue}`;
    } else {
      return "";
    }
    if (percent > 0) {
      conditionStr += ` ${percent}%`;
    } else {
      conditionStr += ` + ${quantity}`;
    }
    return conditionStr;
  };
  return (
    <div className="coupon">
      <p>{getCondition()}</p>
    </div>
  );
};
