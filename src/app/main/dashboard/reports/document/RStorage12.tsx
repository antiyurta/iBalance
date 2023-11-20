import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage12 = () => {
  const { RStorage12 } = useTypedSelector((state: RootState) => state.report);
  return <div>12</div>;
};
export default RStorage12;
