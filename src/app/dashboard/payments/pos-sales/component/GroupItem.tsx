import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const GroupItem = () => {
  return (
    <div className="item-group">
      <div className="image">
        <Link href={"/dashboard/payments/pos-sales/1"}>
          <Image src="/images/vera.png" width={120} height={120} alt="dd" />
        </Link>
        <div className="extra">
          <p>1 + 1</p>
        </div>
      </div>
      <div className="title">
        <p className="top">Japonica Koshi Hikiri-2kg</p>
        <p className="bottom">#1325 4896 4848 1515</p>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#DEE2E6",
        }}
      />
      <div className="price">
        <p className="top">Хүнс, ногоо</p>
        <div className="bottom">
          <p>2100₮</p>
          <p>2100₮</p>
        </div>
      </div>
      <Button
        style={{
          width: "100%",
        }}
        icon={<ShoppingCartOutlined />}
      >
        Сагслах
      </Button>
    </div>
  );
};
export default GroupItem;
