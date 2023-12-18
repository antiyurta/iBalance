interface IPropsCheckCoupon {
  unitAmount: number;
  conditionValue: number;
  percent: number;
  quantity: number;
}

interface IPropsDisplayCoupon {
  conditionValue: number;
  percent: number;
  quantity: number;
}

function checkCoupon(props: IPropsCheckCoupon): number {
  const { unitAmount, conditionValue, percent, quantity } = props;
  if (quantity) {
    return (conditionValue * unitAmount) / (conditionValue + quantity);
  }
  if (percent) {
    return conditionValue * unitAmount * (1 - percent / 100);
  }
  return 0;
}

function displayCoupon(props: IPropsDisplayCoupon): string {
  const { conditionValue, percent, quantity } = props;
  if (percent) {
    return `${conditionValue} + ${percent}%`;
  }
  if (quantity) {
    return `${conditionValue} + ${quantity}`;
  }
  return "";
}
// checkDiscount
export { checkCoupon, displayCoupon };
