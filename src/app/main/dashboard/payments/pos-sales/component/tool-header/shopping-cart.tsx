import { useTypedSelector } from "@/feature/store/reducer";
import { Badge, Button } from "antd";
import Image from "next/image";

const ShoppingCartButton: React.FC = () => {
  const goods = useTypedSelector((state) => state.shoppingGoods);
  return (
  <Badge count={goods.length}>
    <Button
      icon={
        <Image
          src={"/icons/pos/shopping-cart.svg"}
          alt=""
          width={24}
          height={24}
        />
      }
    />
  </Badge>
)};
export default ShoppingCartButton;
