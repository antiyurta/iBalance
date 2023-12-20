import { Button } from "antd";
import { NewInput, NewInputNumber } from "./input";
import { useState } from "react";
import NewModal from "./modal";
import { SearchOutlined } from "@ant-design/icons";
const Word = () => {
  const mongol35 = "абвгдеёжзийклмноөпрстуфхцчшъыьэүюя";
  // uppercase болгох
  const mongol35Upper = mongol35.toUpperCase();
  // uppercase-с том үсгээр бичих
  const mongol35List = Array.from(mongol35Upper);
  const [options, setOptions] = useState<{ value: string }[]>(
    mongol35List.map((item) => ({ value: item }))
  );
  const [value, setValue] = useState<string>("А");
  const [isModal, setIsModal] = useState<boolean>(false);
  const onChange = (data: string) => {
    setValue(data);
  };

  const getPanelValue = (searchText: string) => {
    const values = mongol35List.map((item) => ({ value: item }));
    setOptions(
      values.filter((item) => item.value.includes(searchText.toUpperCase()))
    );
  };
  return (
    <>
      <Button style={{ width: 40 }} onClick={() => setIsModal(true)}>
        {value}
      </Button>
      <NewModal open={isModal}>
        <NewInput
          suffix={<SearchOutlined />}
          onChange={(e) => getPanelValue(e.target.value)}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 12,
          }}
        >
          {options.map((item, index) => (
            <Button
              key={index}
              onClick={() => {
                setIsModal(false);
                onChange(item.value);
              }}
            >
              {item.value}
            </Button>
          ))}
        </div>
      </NewModal>
    </>
  );
};
// TODO дутуу байгаа
const InputRegno = () => {
  return (
    <div style={{ display: "flex" }}>
      <Word />
      <Word />
      <NewInputNumber maxLength={8} minLength={8} />
    </div>
  );
};
export default InputRegno;
