import { Button } from "antd";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction } from "react";

export type DisplayType = "list" | "grid";
interface IProps {
  display: DisplayType;
  setDisplay: Dispatch<SetStateAction<DisplayType>>;
}
const DisplayTool: React.FC<IProps> = ({ display = "grid", setDisplay }) => {
  return (
    <>
      <Button
        type={display == "list" ? "primary" : "default"}
        icon={
          <BarsOutlined
            style={{
              fontSize: 20,
            }}
          />
        }
        onClick={() => setDisplay("list")}
      />
      <Button
        type={display == "grid" ? "primary" : "default"}
        icon={
          <AppstoreOutlined
            style={{
              fontSize: 20,
            }}
          />
        }
        onClick={() => setDisplay("grid")}
      />
    </>
  );
};
export default DisplayTool;
