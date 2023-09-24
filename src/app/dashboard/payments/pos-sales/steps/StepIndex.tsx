import { Typography } from "antd";
import { ReactNode, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const { Title } = Typography;

interface IStep {
  label?: ReactNode;
  content: ReactNode;
}

const StepIndex = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };
  const next = () => {
    setCurrentStep(currentStep + 1);
  };

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
      content: <Step1 isNext={next} />,
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
      content: <Step2 isPrev={prev} isNext={next} />,
    },
    {
      label: " ",
      content: <Step3 isPrev={prev} isNext={next} />,
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
      {steps[currentStep].label}
      {steps[currentStep].content}
    </div>
  );
};
export default StepIndex;
