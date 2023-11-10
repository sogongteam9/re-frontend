import * as C from './ContainerStyle';
import Nav from './Nav';
import MenuImage from './MenuImage';
const Container = () => {

  return(
  <C.Container>
    <C.WhiteBox>
      <Nav></Nav>
      <MenuImage></MenuImage>
    </C.WhiteBox>
  </C.Container>
  );
};
export default Container;
