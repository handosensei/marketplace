import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import ERC721Factory from "../../contracts/Factory.json";
import Footer from '../components/footer';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

function ERC721FactoryCreate() {

    const [addressUser, setAddressUser] = useState('');
    const [name, setName] = useState('');
    const [symbole, setSymbole] = useState('');

    
    function ButtonSubmit() {
      if (true) {
        return (<button type="button" id="submit" className="btn-main" onClick={onSubmit} >Create new collection</button>);  
      }

      return (<button className="btn-main" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
              </button>);
    }

    const getWeb3ERC721Factory = async () => {
    
      try {
          const web3 = await getWeb3();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = Factory.networks[networkId];
          const instanceContract = new web3.eth.Contract(
              ERC721Factory.abi,
              deployedNetwork && deployedNetwork.address,
          );
          
          return instanceContract;
      } catch (error) {
          alert(`Failed to load web3, accounts, or contract. Check console for details.`);
          console.error(error);
      }
    };
  
    useEffect(() => {
      
    }, []);

    const create = async (name, symbole) => {

        const response = instanceContract.methods.deployCollection(name, symbole).send({ from: addressUser })
          .catch((err) => {
            NotificationManager.error('Error method', 'Add collection failed');
            console.log(err)
          });

          return response;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        
        create(name, symbole)
          .then( (object) => {
            console.log(object);
            const contractAddress = object.events.CollectionCreated.returnValues.contractAddress;
            NotificationManager.success(contractAddress, 'Collection created');
            
            window.location.href = '/erc721/' + contractAddress + '/create';
          })
          .catch((err) => {
            NotificationManager.error('Error call', 'Add collection failed');
            console.log(err);
          });
      }

    return (
      <div>

        <section className='jumbotron breadcumb no-bg'>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>New Collection</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
              <form id="form-create-item" className="form-border" action="#" >
                  <div className="field-set">
                      
                      <h5>Collection name</h5>
                      <input type="text" onChange={e => setName(e.target.value)} name="name" id="name" className="form-control" placeholder="e.g. 'Crypto Funk" />
                      
                      <div className="spacer-10"></div>
  
                      <h5>Symbole</h5>
                      <div className="col-4">
                      <input type="text" onChange={e => setSymbole(e.target.value)} name="symbole" id="symbole" className="form-control" placeholder="e.g. 'CF" />
                      </div>
                      <div className="spacer-10"></div>

                      <ButtonSubmit />
                      

                  </div>
              </form>
          </div>                                        
      </div>

      </section>
        <Footer />
      </div>
  );
}

export default ERC721FactoryCreate;
