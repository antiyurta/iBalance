import { useSwiper } from "swiper/react";
import { VerticalRightOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import React from "react";
interface IButtonProps {
  move: "prev" | "next";
}
export const SwiperButton: React.FC<IButtonProps> = ({ move }) => {
  const swiper = useSwiper();
  const handleButtonClick = () => {
    if (move === "prev") swiper.slidePrev();
    else if (move === "next") swiper.slideNext();
  };
  return (
    <div className="box-prev" onClick={handleButtonClick}>
      {move == "prev" && (
        <VerticalRightOutlined
          style={{
            fontSize: 20,
          }}
        />
      )}
      {move == "next" && (
        <VerticalLeftOutlined
          style={{
            fontSize: 20,
          }}
        />
      )}
    </div>
  );
};
