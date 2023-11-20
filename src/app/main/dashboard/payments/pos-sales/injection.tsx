interface IPropsCheckDiscount {
  unitAmount: number;
  percent: number;
  amount: number;
}

interface IPropsDisplayDiscount {
  amount: number;
  percent: number;
}

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

function checkDiscount(props: IPropsCheckDiscount): number {
  const { unitAmount, percent, amount } = props;
  if (percent) {
    return unitAmount - (unitAmount * percent) / 100;
  }
  if (amount) {
    return unitAmount - amount;
  }
  return 0;
}

function displayDiscount(props: IPropsDisplayDiscount): string {
  const { amount, percent } = props;
  if (amount) {
    return `${amount}₮`;
  }
  if (percent) {
    return `${percent}%`;
  }
  return "";
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

export { displayDiscount, checkDiscount, checkCoupon, displayCoupon };
