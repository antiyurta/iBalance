import { PlusCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import LocalOrder from "./order-distribution/local-order";
import SaleOrder from "./sales-order-distribution/sale-order";
import { TabType } from "@/service/order-distribution/entities";
import Booking from "./booking";
import Image from "next/image";
import { IParamBooking } from "@/service/booking/entities";
import { useEffect, useState } from "react";
import { useTypedSelector } from "@/feature/store/reducer";
import { getParam } from "@/feature/common";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { newPane } from "@/feature/store/slice/param.slice";
import BookingMaterial from "./booking-material";

interface IProps {
  type: "SALE" | "LOCAL";
  pageKey: string;
}
const OrderTab: React.FC<IProps> = ({ type, pageKey }) => {
  const { items } = useTypedSelector((state) => state.pane);
  const [activeKey, setActiveKey] = useState<string>(`${pageKey}/create`);
  const param = getParam(items, activeKey);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(newPane({ key: activeKey, param: {} }));
  }, [activeKey]);
  useEffect;
  const tabItems = [
    {
      label: (
        <div>
          <PlusCircleOutlined /> Захиалга үүсгэх
        </div>
      ),
      key: `${pageKey}/create`,
      children: (
        <>
          {type == "LOCAL" && <LocalOrder />}
          {type == "SALE" && (
            <SaleOrder
              type={TabType.CREATE_ORDER}
              isEdit={false}
              isFormAdd={false}
            />
          )}
        </>
      ),
    },
    {
      label: (
        <div style={{ gap: 5 }}>
          <Image
            src={"/icons/distribution.svg"}
            alt="Хуваарилалт"
            width={16}
            height={16}
          />{" "}
          {type == "SALE" && <span>Хуваарилалт хийх</span>}
          {type == "LOCAL" && <span>Зөвшөөрөл олгох</span>}
        </div>
      ),
      key: `${pageKey}/distrbution`,
      children: <Booking type={type} params={param} status="DISTRIBUTE" />,
    },
    {
      label: "Баримтын жагсаалт",
      key: `${pageKey}/booking`,
      children: <Booking type={type} params={param} status="CONFIRM" />,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: `${pageKey}/booking-material`,
      children: <BookingMaterial type={type} />,
    },
  ];
  return (
    <Tabs
      className="lineTop"
      items={tabItems}
      destroyOnHidden={true}
      activeKey={activeKey}
      onChange={setActiveKey}
    />
  );
};
export default OrderTab;
