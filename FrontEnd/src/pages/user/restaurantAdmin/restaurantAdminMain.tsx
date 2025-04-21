import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const restaurantAdminMain = ({}) => {
  const test = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log(test);
  return <div>restaurantAdminMain</div>;
};

export default restaurantAdminMain;
