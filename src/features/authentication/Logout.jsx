import { useLogout } from "./useLogout";

import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";

import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useWindowSize } from "../../hooks/useWindowSize";
import { windowSizes } from "../../utils/constants";

function Logout() {
  // Getting these functions from the useLogout custom hook
  const { logout, isLoading } = useLogout();
  //Getting the width property from the useWindowSize to customize the shape and the animation of the icon button
  const { width } = useWindowSize();

  return (
    <ButtonIcon
      whileHover={{ scale: 1.2 }}
      whileTap={width >= windowSizes.tablet ? { scale: 1 } : { scale: 1.2 }}
      transition={
        width >= windowSizes.tablet
          ? { duration: 0.4, type: "spring", stiffness: 250 }
          : { duration: 0.4, type: "spring", stiffness: 300 }
      }
      disabled={isLoading}
      onClick={logout}
    >
      {isLoading ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
    </ButtonIcon>
  );
}

export default Logout;
