import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage4 = () => {
  const { RStorage4 } = useTypedSelector((state: RootState) => state.report);
  return <div>4</div>;
};
export default RStorage4;
