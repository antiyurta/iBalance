import { BlockContext, BlockView } from "@/feature/context/BlockContext";
import { MaterialType } from "@/service/material/entities";
import { IDataViewMaterial } from "@/service/material/view-material/entities";
import { ViewMaterialService } from "@/service/material/view-material/service";
import { useContext, useEffect, useState } from "react";
import DisplayItem from "../component/DisplayItem";
interface IProps {
  sectionId: number;
}
const SimilarMaterials = (props: IProps) => {
  const { sectionId } = props;
  const blockContext: BlockView = useContext(BlockContext);
  const [materials, setMaterials] = useState<IDataViewMaterial[]>([]);
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
  useEffect(() => {
    getMaterials();
  }, []);
  return (
    <div className="group">
      {materials.map((item) => (
        <DisplayItem key={item.id} type={"group"} material={item} />
      ))}
    </div>
  );
};
export default SimilarMaterials;