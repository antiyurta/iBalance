import { Modal } from "antd";
import { ReactNode } from "react";

interface IProps {
  title?: string;
  open: boolean;
  width?: number;
  onCancel?: () => void;
  onOk?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

const NewModal = (props: IProps) => {
  const { title, open, width, onCancel, onOk, footer, children } = props;
  return (
    <Modal
      title={
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          {title}
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      cancelText="Болих"
      okText="Хадгалах"
      width={width}
      footer={footer}
    >
      {children}
    </Modal>
  );
};
export default NewModal;
