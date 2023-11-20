import { RootState, useTypedSelector } from "@/feature/store/reducer";
const RStorage16 = () => {
  const { RStorage16 } = useTypedSelector((state: RootState) => state.report);
  return <div>RStorage16</div>;
};
export default RStorage16;
