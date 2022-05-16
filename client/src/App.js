import React, { useEffect, useState, createContext }from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Layout             from "./components/Layout.js";
import Home               from "./components/Home.js";
import Collections        from "./components/Collections";
import CollectionsCreate  from "./components/CollectionsCreate";

import getWeb3 from "./getWeb3";
import Factory from "./contracts/Factory.json";

export const ContractContext = createContext();

export default function App() {

  const [ContractVar, setContractVar] = useState({
    web3: null,
    accounts: null,
    instanceFactory: null
  });

  const getContractVar = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetworkFactory = Factory.networks[networkId];
      const instanceFactory = new web3.eth.Contract(Factory.abi, deployedNetworkFactory && deployedNetworkFactory.address);
        
      setContractVar({
          web3,
          accounts, 
          instanceFactory: instanceFactory
      });

      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  };
  
  useEffect(() => {
    
    getContractVar();

    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    })

  }, []);

  return (
    <>
      <BrowserRouter>
        <ContractContext.Provider value={{ ContractVar, setContractVar}}>
          <Routes>

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="collections" element={<Collections />} />      
              <Route path="collections/create" element={<CollectionsCreate />} />
            </Route>
          
          </Routes>
        </ContractContext.Provider>
      </BrowserRouter>
      <NotificationContainer/>
    </>
  );
}
