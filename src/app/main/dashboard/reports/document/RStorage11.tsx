import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage11 = () => {
  const { RStorage11 } = useTypedSelector((state: RootState) => state.report);
  return <div>11</div>;
};
export default RStorage11;
