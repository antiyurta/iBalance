import { Modal } from "antd";
import { ReactNode } from "react";
import type { ModalProps } from "antd/es/modal";
interface IProps extends ModalProps {
  positionTitle?: "left" | "center" | "right";
}

const NewModal = (props: IProps) => {
  const { positionTitle } = props;
  return <Modal {...props}>{props.children}</Modal>;
};
export default NewModal;
