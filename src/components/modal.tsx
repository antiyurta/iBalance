import { Modal } from "antd";
import { ReactNode } from "react";
import type { ModalProps } from "antd/es/modal";
interface IProps extends ModalProps {
  positionTitle?: "left" | "center" | "right";
}

const NewModal = (props: IProps) => {
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
            justifyContent: props.positionTitle,
          }}
        >
          {props.title}
        </span>
      }
      {...props}
    >
      {props.children}
    </Modal>
  );
};
export default NewModal;
