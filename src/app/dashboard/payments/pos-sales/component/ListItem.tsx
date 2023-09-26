import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { IDataMaterial } from "@/service/material/entities";
import { useEffect, useState } from "react";
import { getFile } from "@/feature/common";

interface IProps {
  data: IDataMaterial;
}

interface IItem {
  name: string;
  src: string;
}

const ListItem = (props: IProps) => {
  const [item, setItem] = useState<IItem>();
  const { data } = props;
  const configureData = async () => {
    setItem({
      name: data.name,
      src:
        data.files?.length > 0
          ? await getFile(data.files[0].id)
          : "/images/groupAll.png",
    });
  };
  useEffect(() => {
    configureData();
  }, [data]);
  return (
    <>
      {item ? (
        <div className="item-list">
          <div className="left">
            <Link href={"/dashboard/payments/pos-sales/1"}>
              <Image src={item.src} width={50} height={50} alt="dd" />
            </Link>
            <div className="title">
              <p className="top">{item.name}</p>
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
      ) : null}
    </>
  );
};
export default ListItem;
