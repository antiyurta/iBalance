import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage20 = () => {
  const { RStorage20 } = useTypedSelector((state: RootState) => state.report);
  return <div>RStorage20</div>;
};
export default RStorage20;
