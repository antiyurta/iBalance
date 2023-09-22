import { Col, Row, Typography } from "antd";
import { VerticalRightOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Title } = Typography;
const Groups = () => {
  const [groups, setGroups] = useState<any>([]);
  const getGroups = () => {};
  useEffect(() => {
    getGroups();
  }, []);
  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Title level={4}>Ангиллаас сонгох</Title>
        </Col>
        <Col span={24}>
          <div className="group">
            <div className="box">asdsasd</div>
            <div className="box-prev">
              <VerticalRightOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
            <div className="content">
              <div className="box">1</div>
              <div className="box">2</div>
              <div className="box">3</div>
              <div className="box">4</div>
              <div className="box">5</div>
              <div className="box">6</div>
              <div className="box">7</div>
              <div className="box">8</div>
              <div className="box">9</div>
              <div className="box">10</div>
              <div className="box">11</div>
              <div className="box">12</div>
              <div className="box">13</div>
            </div>
            <div className="box-next">
              <VerticalLeftOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Groups;
