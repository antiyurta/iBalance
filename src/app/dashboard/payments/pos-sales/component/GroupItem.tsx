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

const GroupItem = (props: IProps) => {
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
        <div className="item-group">
          <div className="image">
            <Link href={"/dashboard/payments/pos-sales/1"}>
              <Image src={item?.src} width={120} height={120} alt="dd" />
            </Link>
            <div className="extra">
              <p>1 + 1</p>
            </div>
          </div>
          <div className="title">
            <p className="top">{item?.name}</p>
            <p className="bottom">{item?.name}</p>
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
      ) : null}
    </>
  );
};
export default GroupItem;
