import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { IDataMaterial } from "@/service/material/entities";
import { useContext, useEffect, useState } from "react";
import { getFile } from "@/feature/common";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { IDataShoppingCartPost } from "@/service/pos/shopping-card/entities";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";

interface IProps {
  data: IDataMaterial;
}

interface IItem {
  id: number;
  name: string;
  src: string;
}

const GroupItem = (props: IProps) => {
  const { setReload } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [item, setItem] = useState<IItem>();
  const { data } = props;
  const configureData = async () => {
    setItem({
      id: data.id,
      name: data.name,
      src: "/images/groupAll.png",
      // src:
      //   data.files?.length > 0
      //     ? await getFile(data.files[0].id)
      //     : "/images/groupAll.png",
    });
  };

  const onFinish = async (data: IDataShoppingCartPost) => {
    blockContext.block();
    await ShoppingCartService.post(data).then((response) => {
      if (response.success) {
        setReload(true);
      }
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
            <Link href={"/main/dashboard/payments/pos-sales/" + item.id}>
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
            onClick={() =>
              onFinish({
                materialId: data.id,
                quantity: 0,
              })
            }
          >
            Сагслах
          </Button>
        </div>
      ) : null}
    </>
  );
};
export default GroupItem;
