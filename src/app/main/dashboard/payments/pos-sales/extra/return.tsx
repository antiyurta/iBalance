import { newTab } from "@/feature/store/slice/tab.slice";
import { WarningOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useDispatch } from "react-redux";

const { Title } = Typography;

const Return = () => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => {
        dispatch(
          newTab({
            label: "Агуулахын тайлан",
            key: "/payments/list-of-receipt",
            closeable: true,
            filters: [],
          })
        );
      }}
      className="payment-type-box-red"
    >
      <WarningOutlined
        style={{
          color: "red",
          fontSize: 24,
        }}
      />
      <Title
        level={4}
        style={{
          fontWeight: 700,
          color: "red",
          textAlign: "center",
        }}
      >
        Буцаалт хийх
      </Title>
    </div>
  );
};
export default Return;
