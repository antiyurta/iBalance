import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ListItem = () => {
  return (
    <div className="item-list">
      <div className="left">
        <Link href={"/dashboard/payments/pos-sales/1"}>
          <Image src="/images/vera.png" width={50} height={50} alt="dd" />
        </Link>
        <div className="title">
          <p className="top">Japonica Koshi Hikiri-2kg</p>
          <p className="bottom">#1325 4896 4848 1515</p>
          <div className="price">
            <p className="p-top">Хүнс, ногоо</p>
            <div className="p-bottom">
              <p>2100₮</p>
              <p>2100₮</p>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="extra">
          <p>1 + 1</p>
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
    </div>
  );
};
export default ListItem;
