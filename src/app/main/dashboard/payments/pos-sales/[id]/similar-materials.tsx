import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialType } from "@/service/material/entities";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { useContext, useEffect, useState } from "react";
import DisplayItem from "../component/DisplayItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperButton } from "../component/swiper";
interface IProps {
  sectionId: number;
}
const SimilarMaterials = (props: IProps) => {
  const { sectionId } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
  const [dividedMaterials, setDividedMaterials] = useState<
    IDataViewMaterial[][]
  >([]);
  const getMaterials = () => {
    blockContext.block();
    ViewMaterialService.get({
      sectionId,
      types: [MaterialType.Material],
    })
      .then((response) => {
        if (response.success) {
          setMaterials(response.response.data);
        }
      })
      .finally(() => blockContext.unblock());
  };
  const chunkArray = (array: IDataViewMaterial[], size: number) => {
    const chunkedArray = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, index + size));
      index += size;
    }
    console.log("chunkedArray", chunkedArray);
    return chunkedArray;
  };
  useEffect(() => {
    getMaterials();
  }, []);
  useEffect(() => {
    if (materials && materials.length > 0) {
      setDividedMaterials(chunkArray(materials, 5));
    }
  }, [materials]);
  return (
    <div className="group">
      <Swiper
        modules={[Pagination, Navigation]}
        effect="fade"
        className="swiper-one-item"
        spaceBetween={30}
        centeredSlides={false}
        pagination={{ clickable: true }}
        navigation={true}
      >
        <SwiperButton move="prev" />
        <>
          {dividedMaterials.map((el, i) => (
            <SwiperSlide key={i}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                {el.map((item, index) => (
                  <DisplayItem key={index} type={"group"} material={item} />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </>
        <SwiperButton move="next" />
      </Swiper>
    </div>
  );
};
export default SimilarMaterials;
