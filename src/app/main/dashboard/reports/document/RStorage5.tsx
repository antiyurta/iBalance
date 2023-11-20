import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage5 = () => {
  const { RStorage5 } = useTypedSelector((state: RootState) => state.report);
  return <div>5</div>;
};
export default RStorage5;
