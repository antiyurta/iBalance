import { NewInput } from "@/components/input";
import { Button, Form, Input, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { useTypedSelector } from "@/feature/store/reducer";
import { MinusCircleOutlined } from "@ant-design/icons";
const Bonus: React.FC = () => {
  // const { data } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { shoppingCart } = useTypedSelector((state) => state);
  const [form] = Form.useForm();
  const code = Form.useWatch("code", form);
  const columns: ColumnsType<any> = [
    {
      title: "Карт",
      dataIndex: ["membership", "name"],
    },
    {
      title: "Дүн",
      dataIndex: "totalAmount",
    },
    {
      title: "Үйлдэл",
      dataIndex: "",
      key: "x",
      render: (_: any, record: any) => (
        <Button
          type="link"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => updateCode(record.code)}
        />
      ),
    },
  ];
  const updateCode = async (code: string, shoppingCartId?: string) => {
    // const res = await GiftCartService.patch({ code, shoppingCartId });
    // if (res.success) {
    //   await ShoppingCartService.getById(data.id).then((response) => {
    //     if (response.success) {
    //       dispatch(setShoppingCart(response.response));
    //     }
    //   });
    // }
  };
  return (
    <div className="step-membership">
      <Form form={form} autoComplete="off">
        <Form.Item name="code">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 12,
            }}
          >
            <NewInput />
            <Button
              title="Ашиглах"
              onClick={() => updateCode(code)}
              icon={<RightOutlined />}
            />
          </div>
        </Form.Item>
      </Form>
      {/* <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={shoppingCart.giftCarts}
      /> */}
    </div>
  );
};
export default Bonus;
