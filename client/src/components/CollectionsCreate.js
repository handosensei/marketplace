import React, {useState,useContext,  useEffect} from "react";
import { ContractContext } from '../App';

import { Navigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

export default function CollectionsCreate() {

  const context = useContext(ContractContext);

  const [name, setName] = useState('');
  const [symbole, setSymbole] = useState('');
  const [goCreateNFT, setGoCreateNFT] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState('');

  useEffect(() => {
    
  }, []);

  const create = async (name, symbole) => {
    console.log('create');
    
    context.ContractVar.instanceFactory.methods.deploy(name, symbole).send({ from: context.ContractVar.accounts[0] })
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
    
    create(name, symbole)
      .catch((err) => {
        NotificationManager.error('Error call', 'Add collection failed');
        console.log(err);
      });
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
      
      {goCreateNFT && <Navigate to={`/erc721/${collectionAddress}/create`} replace={true} />}
      
    </div>
  );
}
  