import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';
import Home from './pages/home';


import { NotificationContainer } from 'react-notifications';

import ERC721FactoryCreate from './modules/ERC721FactoryCreate';
import ERC721Create from './modules/ERC721Create';
import ERC721Display from './modules/ERC721Display';

import MyAccount from './modules/MyAccount';

import { createGlobalStyle } from 'styled-components';
import 'react-notifications/lib/notifications.css';


const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0,0), [location])
  return children
}

export const Reload = () => {
  React.useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    })
  });
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const app= () => (
  <div className="wraper">
  <GlobalStyles />
    <Header/>
      <PosedRouter>
        <ScrollTop path="/">
          <Home exact path="/">
          <Redirect to="/home" />
        </Home>
        
        <ERC721FactoryCreate  path="/erc721/collections/create" />
        <ERC721Display        path="/erc721/:collectionAddress/:tokenId" />
        <ERC721Create         path="/erc721/:collectionAddress/create" />
        
        <MyAccount path="/accounts/:userAddress" />

      </ScrollTop>
    </PosedRouter>
      
    <ScrollToTopBtn />
    <NotificationContainer/>
    
  </div>
);
export default app;