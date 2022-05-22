import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
  
import getWeb3 from "../getWeb3";
import Factory from "../contracts/Factory.json"

export default function CollectionCreate() {

  const [name, setName] = useState('');
  const [symbole, setSymbole] = useState('');
  
  const [goCreateNFT, setGoCreateNFT] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const [account, setAccount] = useState("");  
  const [instanceFactory, setInstanceFactory] = useState("");  

  const getWeb3Data = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId();

      const deployedNetworkFactory = Factory.networks[networkId];
      const instanceFactory = new web3.eth.Contract(Factory.abi, deployedNetworkFactory && deployedNetworkFactory.address);
    
      return [instanceFactory, accounts[0]];

      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  };
  
  useEffect(() => {
  
    getWeb3Data().then((data) => {
      setInstanceFactory(data[0]);
      setAccount(data[1]);
    }).catch((err) => {
      console.error(err)
    });
    
  }, []);

  const create = async (name, symbole) => {
    console.log('create');
    setCollectionName(name);
    instanceFactory.methods.deploy(name, symbole).send({ from: account })
      .then((object) => {
        const contractAddress = object.events.CollectionCreated.returnValues.contractAddress;
        setCollectionAddress(contractAddress);
        NotificationManager.success(contractAddress, 'Collection created');
        
        setGoCreateNFT(true);
      })
      .catch((err) => {
        NotificationManager.error('Error method', 'Add collection failed');
        console.log(err)
      });
  };
  
  const onSubmit = async (e) => {

    e.preventDefault();
    console.log(instanceFactory);

    create(name, symbole)
      .catch((err) => {
        NotificationManager.error('Error call', 'Add collection failed');
        console.log(err);
      });
  };

  const locationData = {
    collectionName: collectionName
  }

  return (
    <div>
      <h2>CollectionsCreate</h2>
      <div className="row">
        <div className="col-lg-7 offset-lg-1 mb-5">
          <form id="form-create-item" className="form-border" action="#" >
            <h5>Collection name</h5>
            <div className="col-4">
              <input type="text" onChange={e => setName(e.target.value)} name="name" id="name" className="form-control" placeholder="e.g. 'Crypto Funk" />
            </div>
            
            <h5>Symbole</h5>
            <div className="col-4">
              <input type="text" onChange={e => setSymbole(e.target.value)} name="symbole" id="symbole" className="form-control" placeholder="e.g. 'CF" />
            </div>
                        
            <button type="button" id="submit" className="btn btn-primary" onClick={onSubmit} >Create new collection</button>
          </form>
        </div>
      </div>
      
      {goCreateNFT && <Navigate to={`/collections/${collectionAddress}/create`} replace={true} state={locationData}/>}
      
    </div>
  );
}
  