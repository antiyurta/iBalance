import { PlusCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";

interface IProps {
  type: "SALE" | "LOCAL";
}
const OrderTab: React.FC<IProps> = () => {
  const items = [
    {
      label: (
        <div>
          <PlusCircleOutlined /> Захиалга үүсгэх
        </div>
      ),
      key: "item-1",
      children: <div>Захиалга үүсгэх</div>,
    },
    {
      label: "Хуваарилалт хийх",
      key: "item-2",
      children: <div>Хуваарилалт хийх</div>,
    },
    {
      label: "Баримтын жагсаалт",
      key: "item-3",
      children: <div>Баримтын жагсаалт</div>,
    },
    {
      label: "Гүйлгээний жагсаалт",
      key: "item-4",
      children: <div>Гүйлгээний жагсаалт</div>,
    },
  ];
  return (
    <Tabs className="lineTop" items={items} destroyInactiveTabPane={true} />
  );
};
export default OrderTab;