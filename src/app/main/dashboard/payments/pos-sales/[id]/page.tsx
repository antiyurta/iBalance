"use client";
import Image from "next/image";
import Link from "next/link";
import {
  LeftOutlined,
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  CreditCardOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons";
import { Badge, Breadcrumb, Button, Col, Row, Space, Typography } from "antd";
import { useParams } from "next/navigation";
import { NewInputNumber } from "@/components/input";
import { useEffect, useState } from "react";
import { MaterialService } from "@/service/material/service";
import { IDataMaterial } from "@/service/material/entities";
const { Title } = Typography;
const MaterialDetail = () => {
  const params = useParams();
  const [material, setMaterial] = useState<IDataMaterial>();
  const getMaterial = async (id: number) => {
    await MaterialService.getById(id).then((response) => {
      setMaterial(response.response);
    });
  };
  useEffect(() => {
    getMaterial(Number(params.id));
  }, []);
  return (
    <div>
      <Row
        style={{
          width: "100%",
        }}
        gutter={[12, 24]}
      >
        <Col span={24}>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: "Home",
              },
              {
                title: "Application Center",
                href: "",
              },
              {
                title: "Application List",
                href: "",
              },
              {
                title: "An Application",
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[12, 24]}>
            <Col sm={24} md={24} lg={12} xl={10}>
              <Image
                src="/images/vera.png"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt="dd"
              />
            </Col>
            <Col sm={24} md={24} lg={12} xl={14}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Space size={24} wrap>
                    <Link
                      href={"/dashboard/payments/pos-sales"}
                      className="app-button-regular"
                    >
                      <LeftOutlined
                        style={{
                          fontSize: 23,
                        }}
                      />
                    </Link>
                    <Title
                      level={1}
                      style={{
                        fontWeight: 500,
                        color: "black",
                      }}
                    >
                      {material?.name}
                    </Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Title
                    level={3}
                    style={{
                      fontWeight: 500,
                      color: "#6C757D",
                    }}
                  >
                    #1325 4896 4848 1515
                  </Title>
                </Col>
                <Col span={24}>
                  <Space size={24} wrap>
                    <Badge count={11} color="red" />
                    <Badge>
                      <ShoppingCartOutlined />
                    </Badge>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space size={12} wrap>
                    <NewInputNumber
                      style={{
                        width: 170,
                      }}
                      addonBefore={<MinusOutlined />}
                      addonAfter={<PlusOutlined />}
                    />
                    <Title level={3}>Нэгж үнэ: 1400</Title>
                    <Title level={3}>Нийт үнэ: 4200</Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Title
                    level={3}
                    style={{
                      fontWeight: 400,
                      color: "#212529",
                    }}
                  >
                    Агуулахад байгаа барааны үлдэгдэл: 1,000ш
                  </Title>
                </Col>
                <Col span={24}>
                  <button
                    className="app-button-regular"
                    style={{
                      height: 32,
                    }}
                  >
                    <ShoppingCartOutlined />
                    Сагслах
                  </button>
                </Col>
                <Col span={24}>
                  <Title
                    level={4}
                    style={{
                      fontWeight: 500,
                      color: "#6C757D",
                    }}
                  >
                    Дэлгэрэнгүй мэдээлэл
                  </Title>
                </Col>
                <Col span={24}>
                  <Title
                    level={5}
                    style={{
                      fontWeight: 400,
                      color: "#86909C",
                    }}
                  >
                    Дизайнер М.Төмөрсүх нь энэ ондоо амжилт бүтээлээрээ,
                    бусдыгаа манлайлан онц сайн ажилласан тул байгууллагын
                    зүгээс урамшуулал олгон бүэн жилийн Мульти Витамин ундааны
                    хэрэглээ болон 100,000,00.00 ₮ -ны мөнгөн урамшуулал олгож
                    Зайсанд 3-н Өрөө хаус бэлэглэж хувийн онгоц урамшуулал
                    болгон өглөө. Мөн сарын цалинг 351% өгсөхөөр боллоо. Ингээд
                    Төмөрсүхдээ болон ажиллын хамт олон, зэвсэг нэгт ахан дүүсд
                    нь цаашдын ажиллын өндөр амжилт хүссэн ерөөж байна. Гэвэл
                    гоеоо хаха
                  </Title>
                </Col>
                <Col span={24}>
                  <Title
                    level={4}
                    style={{
                      fontWeight: 500,
                      color: "#6C757D",
                    }}
                  >
                    Төлбөрийн нөхцөл
                  </Title>
                </Col>
                <Col span={24}>
                  <Space size={12} wrap>
                    <div className="payment-type-box">
                      <CreditCardOutlined
                        style={{
                          color: "#86909C",
                          fontSize: 24,
                        }}
                      />
                      <Title
                        level={4}
                        style={{
                          fontWeight: 700,
                          color: "#86909C",
                        }}
                      >
                        Бэлэн мөнгө
                      </Title>
                    </div>
                    <div className="payment-type-box">
                      <CreditCardOutlined
                        style={{
                          color: "#86909C",
                          fontSize: 24,
                        }}
                      />
                      <Title
                        level={4}
                        style={{
                          fontWeight: 700,
                          color: "#86909C",
                        }}
                      >
                        Бэлэн мөнгө
                      </Title>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Title
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#142A38",
            }}
          >
            Төстэй бараанууд:
          </Title>
        </Col>
        <Col span={24}>
          <div className="group">
            <div className="box-prev">
              <VerticalRightOutlined
                style={{
                  fontSize: 20,
                }}
              />
            </div>
            <div className="material-group">
              <div className="item-group">
                <div className="image">
                  <Link href={"/dashboard/payments/pos-sales/1"}>
                    <Image
                      src="/images/vera.png"
                      width={120}
                      height={120}
                      alt="dd"
                    />
                  </Link>
                  <div className="extra">
                    <p>1 + 1</p>
                  </div>
                </div>
                <div className="title">
                  <p className="top">Japonica Koshi Hikiri-2kg</p>
                  <p className="bottom">#1325 4896 4848 1515</p>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    background: "#DEE2E6",
                  }}
                />
                <div className="price">
                  <p className="top">Хүнс, ногоо</p>
                  <div className="bottom">
                    <p>2100₮</p>
                    <p>2100₮</p>
                  </div>
                </div>
                <Button
                  style={{
                    width: "100%",
                  }}
                  icon={<ShoppingCartOutlined />}
                >
                  Сагслах
                </Button>
              </div>
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
export default MaterialDetail;
