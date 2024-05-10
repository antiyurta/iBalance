import { MaterialType } from "@/service/material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DisplayItem from "./DisplayItem";
import {
  IDataViewMaterial,
  IParamViewMaterial,
} from "@/service/material/view-material/entities";
import { DisplayType } from "./tool-header/display-tool";
import { Divider } from "antd";
import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { usePaymentContext } from "@/feature/context/PaymentGroupContext";
interface IProps {
  display: DisplayType;
  searchValue?: string;
}
const GoodsContainer: React.FC<IProps> = ({ display, searchValue }) => {
  const blockContext: BlockView = useContext(BlockContext);
  const { sectionId } = usePaymentContext();
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
  const [isMore, setIsMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const getMaterials = async () => {
    await ViewMaterialService.get({
      types: [MaterialType.Material],
      moreUnitAmount: 0,
      page: page,
      limit: 12,
    }).then((response) => {
      setMaterials((prevMaterials) => [
        ...prevMaterials,
        ...response.response.data,
      ]);
      setPage(page + 1);
      setIsMore(Boolean(response.response.meta.hasNextPage));
    });
  };
  const onSearchMaterial = async () => {
    blockContext.block();
    const param: IParamViewMaterial = {
      types: [MaterialType.Material],
      name: searchValue,
      sectionId,
      moreUnitAmount: 0,
      page: 1,
      limit: 12,
    };
    if (
      searchValue !== "" ||
      searchValue !== null ||
      searchValue !== undefined
    ) {
      param.name = searchValue;
    }
    await ViewMaterialService.get(param)
      .then((response) => {
        setMaterials(response.response.data);
        setIsMore(Boolean(response.response.meta.hasNextPage));
        setPage(1);
      })
      .finally(() => {
        blockContext.unblock();
      });
  };
  useEffect(() => {
    onSearchMaterial();
  }, [searchValue, sectionId]);
  return (
    <div id="goodsContainer" className="goods-container">
      <InfiniteScroll
        dataLength={materials.length}
        next={getMaterials}
        hasMore={isMore}
        scrollableTarget="goodsContainer"
        loader={<h4>Уншиж байна...</h4>}
        endMessage={<Divider plain>Өөр илэрц олдсонгүй</Divider>}
      >
        <div className={`material-${display}`}>
          {materials.map((material, index) => (
            <DisplayItem key={index} material={material} type={display} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
export default GoodsContainer;
