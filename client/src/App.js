import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Layout               from "./components/Layout.js";
import Home                 from "./components/Home.js";
import CollectionCreate     from "./components/CollectionCreate";
import NFTCreate            from "./components/NFTCreate";
import NFTDisplay           from "./components/NFTDisplay";
import Profile                 from "./components/Profile";

export default function App() {

  
  return (
    <>
      <BrowserRouter>
        
          <Routes>

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="collections/create" element={<CollectionCreate />} />
              <Route path="collections/:collectionAddress/create" element={<NFTCreate />} />
              <Route path="collections/:collectionAddress/:tokenId" element={<NFTDisplay />} />
              <Route path="profile" element={<Profile />} /> 
            </Route>
          
          </Routes>
        
      </BrowserRouter>
      <NotificationContainer/>
    </>
  );
}
