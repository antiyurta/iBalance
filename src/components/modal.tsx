import { Modal } from "antd";
import { ReactNode } from "react";

interface IProps {
  positionTitle?: "left" | "center" | "right";
  title?: string;
  open: boolean;
  width?: number;
  onCancel?: () => void;
  onOk?: () => void;
  footer?: ReactNode;
  children: ReactNode;
  destroyOnClose?: boolean;
  okButtonProps?: {
    disabled: boolean;
  };
}

const NewModal = (props: IProps) => {
  const {
    positionTitle,
    title,
    open,
    width,
    onCancel,
    onOk,
    footer,
    children,
    destroyOnClose,
    okButtonProps,
  } = props;
  return (
    <Modal
      className="ant-modal-title-left"
      title={
        <span
          style={{
            display: "flex",
            width: "100%",
            fontSize: 20,
            fontWeight: 500,
            justifyContent: positionTitle,
          }}
        >
          {title}
        </span>
      }
      okButtonProps={okButtonProps}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      cancelText="Болих"
      okText="Хадгалах"
      width={width}
      footer={footer}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Modal>
  );
};
export default NewModal;
