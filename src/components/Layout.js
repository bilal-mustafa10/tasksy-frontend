import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import styled from 'styled-components';
// component styles

const Main = styled.main`
  @media (min-width: 700px) {
    display: flex;
    top: 74px;
    position: relative;
    height: calc(100% - 56px);
    width: 100%;
    flex: auto;
    flex-direction: column;
  }

  
`;
const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <Header />
            <Main>{children}</Main>
        </React.Fragment>
    );
};
export default Layout;
