import { NewRadio, NewRadioGroup } from "@/components/input";
import { useTypedSelector } from "@/feature/store/reducer";
import { changeParam } from "@/feature/store/slice/tab.slice";
import { AppDispatch } from "@/feature/store/store";
import { RadioType } from "@/service/entities";
import { RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
interface IProps {
  dataIndex: string[];
}
const Sorter: React.FC<IProps> = ({ dataIndex }) => {
  const [sorter, setSorter] = useState<RadioType>(RadioType.DESC);
  const { activeKey, tabItems } = useTypedSelector((state) => state.tabs);
  const currentTab = tabItems.find((item) => item.key == activeKey);
  const dispatch = useDispatch<AppDispatch>();
  const onChange = (e: RadioChangeEvent) => {
    setSorter(e.target.value);
  };
  useEffect(() => {
    if (currentTab) {
      dispatch(
        changeParam({
          ...currentTab.param,
          order: sorter,
          orderParam: dataIndex,
        })
      );
    }
  }, [sorter]);
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
          value={RadioType.ASC}
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
          value={RadioType.DESC}
        >
          Я-A
        </NewRadio>
      </div>
    </NewRadioGroup>
  );
};
export default Sorter;
