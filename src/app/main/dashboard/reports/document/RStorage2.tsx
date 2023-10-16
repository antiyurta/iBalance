import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage2 = () => {
  const { RStorage2 } = useTypedSelector((state: RootState) => state.report);
  return <div>1</div>;
};
export default RStorage2;
