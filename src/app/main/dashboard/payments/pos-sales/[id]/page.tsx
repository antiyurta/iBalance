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
import { useContext, useEffect, useState } from "react";
import { MaterialService } from "@/service/material/service";
import { IDataMaterial } from "@/service/material/entities";
//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { getFile } from "@/feature/common";
import { IDataShoppingCartPost } from "@/service/pos/shopping-card/entities";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { ShoppingCartService } from "@/service/pos/shopping-card/service";
import { usePaymentGroupContext } from "@/feature/context/PaymentGroupContext";

const { Title } = Typography;

interface xIDataMaterial extends IDataMaterial {
  resources?: string[];
}

const MaterialDetail = () => {
  const params = useParams();
  const { setReload } = usePaymentGroupContext();
  const blockContext: BlockView = useContext(BlockContext);
  const [material, setMaterial] = useState<xIDataMaterial>();
  const getMaterial = async (id: number) => {
    await MaterialService.getById(id).then(async ({ response }) => {
      var material: xIDataMaterial = response;
      if (material.fileIds.length > 0) {
        var resources: string[] = [];
        await Promise.all(
          material.fileIds.map(async (fileId) => {
            const src = await getFile(fileId);
            resources.push(src);
          })
        );
        material.resources = resources;
      }
      setMaterial(material);
    });
  };
  const onFinish = async (data: IDataShoppingCartPost) => {
    blockContext.block();
    await ShoppingCartService.post(data).then((response) => {
      if (response.success) {
        setReload(true);
      }
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
                title: material?.section.name,
                href: "",
              },
              {
                title: material?.name,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[12, 24]}>
            <Col sm={24} md={24} lg={12} xl={10}>
              <Swiper className="swiper-one-item">
                {material?.resources?.map((blobUrls, index) => (
                  <SwiperSlide key={index}>
                    <Image src={blobUrls} width={0} height={0} alt="dd" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
            <Col sm={24} md={24} lg={12} xl={14}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Space size={24} wrap>
                    <Link
                      href={"/main/dashboard/payments/pos-sales"}
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
                    {material?.code}
                  </Title>
                </Col>
                <Col span={24}>
                  <Space size={24} wrap>
                    {material?.coupons?.map((coupon, index) => (
                      <Badge
                        key={index}
                        count={`${coupon.conditionValue} + ${coupon.quantity}`}
                      />
                    ))}
                    {material?.discounts?.map((discount, index) => (
                      <Badge
                        key={index}
                        count={
                          discount.percent > 0
                            ? `${discount.percent}%`
                            : `${discount.amount}₮`
                        }
                        style={{
                          display: "flex",
                          padding: 12,
                          alignItems: "center",
                          fontSize: 13,
                        }}
                      />
                    ))}
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
                    onClick={() => {
                      if (material) {
                        // onFinish({
                        //   materialId: material.id,
                        //   quantity: 0,
                        //   amount: material.unitAmount,
                        //   discountId: material.discount.id,
                        //   couponId: material.coupon.id,
                        // });
                      }
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
                    {material?.description}
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
                  <Link href={"/main/dashboard/payments/pos-sales/1"}>
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
