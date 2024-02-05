import { NewRadio, NewRadioGroup } from "@/components/input";
import { getParam } from "@/feature/common";
import { useTypedSelector } from "@/feature/store/reducer";
import { changeParam } from "@/feature/store/slice/param.slice";
import { AppDispatch } from "@/feature/store/store";
import { RadioType } from "@/service/entities";
import { RadioChangeEvent } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
interface IProps {
  dataIndex: string[];
}
const Sorter: React.FC<IProps> = ({ dataIndex }) => {
  const [sorter, setSorter] = useState<RadioType>("DESC");
  const { activeKey, items } = useTypedSelector((state) => state.pane);
  const param = getParam(items, activeKey);
  const dispatch = useDispatch<AppDispatch>();
  const onChange = (e: RadioChangeEvent) => {
    setSorter(e.target.value);
    dispatch(
      changeParam({
        ...param,
        order: sorter,
        orderParam: dataIndex,
      })
    );
  };
  // TODO sorter hide
  return (
    <NewRadioGroup
      style={{
        width: "100%",
      }}
      value={sorter}
      onChange={onChange}
      optionType="button"
      buttonStyle="solid"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          alignSelf: "stretch",
          justifyContent: "space-evenly",
        }}
      >
        <NewRadio
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 22,
            width: "100%",
            fontSize: 12,
            lineHeight: "13px",
          }}
          value={"DESC"}
        >
          A-Я
        </NewRadio>
        <NewRadio
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 22,
            width: "100%",
            fontSize: 12,
            lineHeight: "13px",
          }}
          value={"ASC"}
        >
          Я-A
        </NewRadio>
      </div>
    </NewRadioGroup>
  );
};
export default Sorter;
