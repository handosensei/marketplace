import React, { useEffect, useState } from "react";

import Footer from '../components/footer';
import getWeb3ERC721Factory from "../../getWeb3ERC721Factory";

import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

function ERC721FactoryCreate() {

    const [instanceContract, setInstanceContract] = useState(null);
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

    useEffect(() => {
      
      getWeb3ERC721Factory()
        .then((data) => {
            setInstanceContract(data[0]);
            setAddressUser(data[1][0]);
        })
        .catch(console.error);

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
