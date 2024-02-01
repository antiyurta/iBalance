import { Space, Typography } from "antd";
const { Title } = Typography;
interface IProps {
  title: string;
}
const PageTitle: React.FC<IProps> = ({ title }) => (
  <Space size={24}>
    <Title level={3}>{title}</Title>
  </Space>
);
export default PageTitle;
