import React, { useEffect, useState } from "react";
import Footer from '../components/footer';
import getWeb3Factory from "../../getWeb3Factory";


import 'react-notifications/lib/notifications.css';

function CollectionCreate() {

    const [name, setName] = useState('');
    const [supply, setSupply] = useState(0);
    const [symbole, setSymbole] = useState('');
    const [artistName, setArtistName] = useState('');
    const [description, setDescription] = useState('');
    const [royalties, setRoyalties] = useState('');
    const [instanceContract, setInstanceContract] = useState({});
    const [addressUser, setAddressUser] = useState('');
    
    useEffect(() => {
        

        getWeb3Factory()
            .then((data) => {
                setInstanceContract(data[0]);
                setAddressUser(data[1][0]);
            })
            .catch(console.error);

    }, []);
 
    const create = async () => {
  
        const object = await instanceContract.methods.deployCollection(
            name,
            symbole,
            artistName,
            description,
            "",
            supply,
            royalties
        ).send({ from: addressUser });

        return object;        
    }

    function submit() {
        create()
            .then((object) => {
                NotificationManager.success(
                    object.events.CollectionCreated.address,
                    'Collection created'
                );
            })
            .catch(console.error);
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
                <form id="form-create-item" className="form-border" action="#">
                    <div className="field-set">
                        
                        <div className="spacer-single"></div>
  
                        <h5>Name</h5>
                        <input type="text" onChange={e => setName(e.target.value)} name="name" id="name" className="form-control" placeholder="e.g. 'Crypto Funk" />
  
                        <div className="spacer-10"></div>

                        <h5>Symbole</h5>
                        <input type="text" onChange={e => setSymbole(e.target.value)} name="symbole" id="symbole" className="form-control" placeholder="e.g. 'CF" />
  
                        <div className="spacer-10"></div>

                        <h5>Supply</h5>
                        <input type="text" onChange={e => setSupply(e.target.value)} name="supply" id="supply" className="form-control" placeholder="e.g. 'CF" />
  
                        <div className="spacer-10"></div>

                        <h5>Artist</h5>
                        <input type="text" onChange={e => setArtistName(e.target.value)} name="artist" id="artist" className="form-control" placeholder="e.g. 'Satoshi" />
  
                        <div className="spacer-10"></div>
  
                        <h5>Description</h5>
                        <textarea data-autoresize onChange={e => setDescription(e.target.value)} name="description" id="description" className="form-control" placeholder="e.g. 'This is very limited item'"></textarea>
  
                        <div className="spacer-10"></div>
  
                        <h5>Royalties</h5>
                        <input type="text" onChange={e => setRoyalties(e.target.value)} name="royalties" id="royalties" className="form-control" placeholder="suggested: 0, 10%, 20%." />
  
                        <div className="spacer-10"></div>
  
                        <input onClick={() => submit()} type="button" id="submit" className="btn-main" value="Create new collection"/>
                    </div>
                </form>
            </div>                                        
        </div>
  
        </section>
          <Footer />
        </div>
    );
}

export default CollectionCreate;
