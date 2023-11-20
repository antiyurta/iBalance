import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage10 = () => {
  const { RStorage10 } = useTypedSelector((state: RootState) => state.report);
  return <div>10</div>;
};
export default RStorage10;
