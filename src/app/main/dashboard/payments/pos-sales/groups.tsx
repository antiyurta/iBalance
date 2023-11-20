import { Col, Row, Typography } from "antd";
import {
  VerticalRightOutlined,
  VerticalLeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { ReactNode, useEffect, useState } from "react";
import { MaterialSectionService } from "@/service/material/section/service";
import Image from "next/image";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";
import { getFile } from "@/feature/common";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const { Title } = Typography;

interface IGroup {
  name: string;
  src: string;
  sectionId: number;
}

const Groups = () => {
  const SwiperButtonNext = ({ children }: { children: ReactNode }) => {
    const swiper = useSwiper();
    return (
      <div className="box-next" onClick={() => swiper.slideNext()}>
        {children}
      </div>
    );
  };
  const SwiperButtonPrev = ({ children }: { children: ReactNode }) => {
    const swiper = useSwiper();
    return (
      <div className="box-prev" onClick={() => swiper.slidePrev()}>
        {children}
      </div>
    );
  };

  const { value, set } = usePaymentGroupContext();
  const [sections, setSections] = useState<IGroup[]>([]);
  const getMaterialSections = async () => {
    await MaterialSectionService.get({
      isExpand: false,
      isSale: [true],
      materialTypes: [],
    }).then(async (response) => {
      const result: IGroup[] = [];
      await Promise.all(
        response.response.data.map(async (section) => {
          result.push({
            name: section.name,
            src:
              section.fileId != null
                ? await getFile(section.fileId)
                : "/images/emptyMarket.png",
            sectionId: section.id,
          });
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
            <Swiper
              className="swiper-group"
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 10,
                },
                1441: {
                  slidesPerView: 5,
                  spaceBetween: 10,
                },
                1562: {
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
                1797: {
                  slidesPerView: 7,
                  spaceBetween: 10,
                },
                2560: {
                  slidesPerView: 10,
                  spaceBetween: 10,
                },
              }}
            >
              <SwiperButtonPrev>
                <VerticalRightOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              </SwiperButtonPrev>
              <div className="content">
                {sections?.map((section, index) => (
                  <SwiperSlide key={index}>
                    <div
                      key={index}
                      onClick={() => set(section.sectionId)}
                      className={
                        section.sectionId === value ? "box-active" : "box"
                      }
                    >
                      <Image
                        src={section.src}
                        alt={`${section.name + index}`}
                        width={25}
                        height={25}
                      />
                      <p className="text">{section.name}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
              <SwiperButtonNext>
                <VerticalLeftOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              </SwiperButtonNext>
            </Swiper>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Groups;
