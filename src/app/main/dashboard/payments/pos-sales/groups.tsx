import { Col, Row, Typography } from "antd";
import {
  VerticalRightOutlined,
  VerticalLeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { MaterialSectionService } from "@/service/material/section/service";
import Image from "next/image";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { getFile } from "@/feature/common";
const { Title } = Typography;

interface IGroup {
  name: string;
  src: string;
  sectionId: number;
}

const Groups = () => {
  const { value, set } = usePaymentGroupContext();
  const [sections, setSections] = useState<IGroup[]>([]);
  const getMaterialSections = async () => {
    await MaterialSectionService.get({
      isExpand: false,
      isSale: [true],
    }).then(async (response) => {
      const result: IGroup[] = [];
      await Promise.all(
        response.response.data.map(async (section) => {
          if (section.fileId) {
            const src = await getFile(section.fileId);
            result.push({
              name: section.name,
              src: src,
              sectionId: section.id,
            });
          } else {
            result.push({
              name: section.name,
              src: "",
              sectionId: section.id,
            });
          }
        })
      );
      setSections(result);
    });
  };
  useEffect(() => {
    getMaterialSections();
  }, []);
  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Title level={4}>Ангиллаас сонгох</Title>
        </Col>
        <Col span={24}>
          <div className="group">
            <div
              onClick={() => set("all")}
              className={value != "all" ? "box" : "box-active"}
            >
              <ShoppingOutlined
                style={{
                  fontSize: 30,
                }}
              />
              <p className="text">Бүгд</p>
            </div>
            <div className="box-prev">
              <VerticalRightOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
            <div className="content">
              {sections?.map((section, index) => (
                <div
                  key={index}
                  onClick={() => set(section.sectionId)}
                  className={section.sectionId === value ? "box-active" : "box"}
                >
                  <Image
                    src={section.src}
                    alt={`${section.name + index}`}
                    width={30}
                    height={30}
                  />
                  <p className="text">{section.name}</p>
                </div>
              ))}
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
