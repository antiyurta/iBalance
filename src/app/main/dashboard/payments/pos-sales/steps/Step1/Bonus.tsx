import { NewInput } from "@/components/input";
import { Form } from "antd";

const Bonus = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} autoComplete="off">
      <div className="step-membership">
        <Form.Item name="bonusId">
          <NewInput />
        </Form.Item>
      </div>
    </Form>
  );
};
export default Bonus;
