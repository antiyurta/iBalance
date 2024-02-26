import { Badge, Button } from "antd";
import Image from "next/image";

const ShoppingCartButton: React.FC = () => (
  <Badge count={3}>
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
);
export default ShoppingCartButton;
