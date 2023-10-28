import { Modal } from "antd";
import type { ModalProps } from "antd/es/modal";
interface IProps extends ModalProps {
  positionTitle?: "left" | "center" | "right";
}

const NewModal = (props: IProps) => {
  return (
    <Modal cancelText="Болих" {...props} maskClosable={false}>
      {props.children}
    </Modal>
  );
};
export default NewModal;
