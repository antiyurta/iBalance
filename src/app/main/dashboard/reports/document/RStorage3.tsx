import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage3 = () => {
  const { RStorage3 } = useTypedSelector((state: RootState) => state.report);
  return <div>3</div>;
};
export default RStorage3;
