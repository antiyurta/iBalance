import { Typography } from "antd";
import { ReactNode } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { prevStep } from "@/feature/store/slice/point-of-sale/shopping-cart.slice";

const { Title } = Typography;

interface IStep {
  label?: ReactNode;
  content: ReactNode;
}

const StepIndex: React.FC = () => {
  const { currentStep = 0 } = useTypedSelector((state) => state.shoppingCart);
  const dispatch = useDispatch<AppDispatch>();
  const steps: IStep[] = [
    {
      label: (
        <Title
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Гишүүнчлэлтэй эсэх:
        </Title>
      ),
      content: <Step1 />,
    },
    {
      label: (
        <Title
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Төлөх дүн:
        </Title>
      ),
      content: <Step2 />,
    },
    {
      label: " ",
      content: <Step3 />,
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      {steps[currentStep].content}
    </div>
  );
};
export default StepIndex;
