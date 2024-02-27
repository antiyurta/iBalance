"use client";
import Image from "next/image";
import Link from "next/link";
import {
  LeftOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Badge, Breadcrumb, Col, Row, Space, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { getFile } from "@/feature/common";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import SimilarMaterials from "./similar-materials";
import { NumericFormat } from "react-number-format";
import NumberInput from "../component/number-input";
import { IGoods } from "@/service/pos/entities";
import { useTypedSelector } from "@/feature/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/feature/store/store";
import { saveGoods } from "@/feature/store/slice/point-of-sale/goods.slice";

const { Title } = Typography;

const MaterialDetail = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const goods = useTypedSelector((state) => state.shoppingGoods);
  const [material, setMaterial] = useState<IDataViewMaterial>();
  const [images, setImages] = useState<string[]>([]);
  const [qty, setQty] = useState<number>(0);
  const getMaterial = async (id: number) => {
    const response = await ViewMaterialService.getById(id);
    if (response.success) {
      setMaterial(response.response);
    }
  };
  const onFinish = async (data: IDataViewMaterial) => {
    const currentIndex = goods.findIndex((item) => item.materialId == data.id);
    const currentGoods: IGoods = {
      materialId: data.id,
      materialName: data.name,
      imageUrl: images.length > 0 ? images[0] : "/images/emptyMarket.png",
      sectionName: data.sectionName,
      unitAmount: data.unitAmount,
      quantity: 1,
      discountAmount: 0,
      payAmount: data.unitAmount,
      totalAmount: data.unitAmount,
    };
    if (currentIndex !== -1) {
      currentGoods.quantity = goods[currentIndex].quantity + 1;
      currentGoods.payAmount =
        goods[currentIndex].unitAmount * (goods[currentIndex].quantity + 1);
    }
    dispatch(saveGoods(currentGoods));
  };
  const getImages = async () => {
    if (material) {
      const listImage: string[] = [];
      await Promise.all(
        material.fileIds.map(async (fileId) => {
          const src = await getFile(fileId);
          listImage.push(src);
        })
      );
      setImages(listImage);
    }
  };
  useEffect(() => {
    getMaterial(Number(params.id));
  }, []);
  useEffect(() => {
    getImages();
  }, [material]);
  return (
    <Row
      style={{
        width: "100%",
        height: "100%",
      }}
      gutter={[12, 24]}
    >
      <Col span={24}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: material?.sectionName,
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
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              effect="fade"
              className="swiper-one-item"
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              navigation={true}
            >
              {images.map((el, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Image src={el} width={0} height={0} alt="dd" />
                  </SwiperSlide>
                );
              })}
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
                  {material?.coupon ? (
                    <Badge
                      count={`${material?.coupon?.conditionValue} + ${material?.coupon?.quantity}`}
                    />
                  ) : null}
                  <Badge
                    count={material?.discountName}
                    style={{
                      display: "flex",
                      padding: 12,
                      alignItems: "center",
                      fontSize: 13,
                    }}
                  />
                </Space>
              </Col>
              <Col span={24}>
                <Space size={12} wrap>
                  <NumberInput iValue={setQty} />
                  <Title level={3}>
                    Нэгж үнэ:
                    <NumericFormat
                      value={material?.unitAmount}
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      displayType="text"
                      suffix="₮"
                    />
                  </Title>
                  <Title level={3}>
                    Нийт дүн:
                    <NumericFormat
                      value={Number(material?.unitAmount || 0) * qty}
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      displayType="text"
                      suffix="₮"
                    />
                  </Title>
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
                  Агуулахад байгаа барааны үлдэгдэл:{" "}
                  <NumericFormat
                    value={material?.lastQty}
                    thousandSeparator=","
                    fixedDecimalScale
                    displayType="text"
                    suffix="ш"
                  />
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
                      onFinish(material);
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
          Төстөй бараанууд:
        </Title>
      </Col>
      <Col span={24}>
        {material ? (
          <div className="material-group">
            <SimilarMaterials sectionId={material?.sectionId} />
          </div>
        ) : null}
      </Col>
    </Row>
  );
};
export default MaterialDetail;
