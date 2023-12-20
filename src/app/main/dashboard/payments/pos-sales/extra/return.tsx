import { TabsActions } from "@/feature/core/actions/TabsActions";
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
          TabsActions.setTabsData({
            label: "Агуулахын тайлан",
            key: "/payments/list-of-receipt",
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
