import styled from "styled-components";
import { useDarkMode } from "../hooks/useDarkMode";

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const src1 = isDarkMode ? "/logo-dark.png" : "/logo-light.png";
  return <Img src={src1} alt="Logo" />;
}

export default Logo;
