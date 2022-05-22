import React, {useEffect, useState, useContext } from "react";
import { NotificationManager } from 'react-notifications';
import { useParams, Link } from "react-router-dom";

import getWeb3 from "../getWeb3";
import Factory from "../contracts/Factory.json"

import axios from 'axios';

export default function NFTDisplay() {

  const { collectionAddress, tokenId } = useParams();
  const [collectionName, ] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [, setInstanceSaleFactory] = useState("");
  const [instanceFactory, setInstanceFactory] = useState("");
  const [account, setAccount] = useState("");  
  const [showModal, setShowModal] = useState("");  

  const getWeb3Data = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId();

      const deployedNetworkFactory      = Factory.networks[networkId];
      const instanceFactory     = new web3.eth.Contract(Factory.abi, deployedNetworkFactory && deployedNetworkFactory.address);
      
      return [instanceFactory, accounts[0]];

      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  };

  function ButtonAdd() {
    return (
      <>
        <Link to={`/collections/${collectionAddress}/create`} className="btn btn-primary">add</Link>
      </>
    );
  }

  function ButtonSale() {
    if (showPrice) {
      return (<></>);
    }

    return (
      <>
        <button href="#" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalPrice">sale</button>
      </>
    );
  }

  const onSale = async (e) => {
    e.preventDefault();
    instanceFactory.methods.setPrice(collectionAddress, tokenId, price).send({ from: account })
    .then((object) => {
      console.log(object);
      NotificationManager.success('Token #' + tokenId + ' sale to ' + price + 'ETH', 'Token on sale');
      setShowModal(false);
      setShowPrice(true);
    });
  }
  

  useEffect(() => {
    
    getWeb3Data().then((data) => {
      
      setInstanceFactory(data[0]);
      setAccount(data[1]);
      data[0].methods.getTokenURI(collectionAddress, tokenId).call()
        .then(tokenURI => {
          axios.get(tokenURI)
            .then(response => {
                setTokenName(response.data.collection + ' #' + tokenId );
                setImage(response.data.image);
                setAttributes(response.data.attributes); 
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });    
        });
      data[0].methods.getPrice(collectionAddress, tokenId).call()
        .then(price => {
          setPrice(price);
          if (price != 0) {
            setShowPrice(true);
          }
          
        });
    });
    
  }, []);

  return (
    <div>
      <h1>NFT Display</h1>
      
      <div className="row">
        <div className="col-lg-1 offset-lg-1">
          <ButtonAdd />
        </div>
        <div className="col-lg-1 offset-rg-9 ">
          <ButtonSale />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 offset-lg-1">
          <ul>
            <li>
              <img src={image} className="img-thumbnail" style={{width: "200px", height: "auto"}} alt={tokenName} />
            </li>
            <li>{collectionName}</li>
            <li>{tokenName}</li>
            <li>{showPrice && 'On sale to ' + price + ' ETH'}</li>
          </ul>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-5 offset-lg-1">
          <h5>Attributes</h5>
          <ul className="de_nav">    
              {attributes.map( (x, i) => {
                  return (<li key={i}><span>{x.trait_type} : {x.value}</span></li>)
              })}
          </ul>
        </div>
      </div>

      <div className="modal fade" id="modalPrice" aria-labelledby="modalPriceLabel" aria-hidden="true" show={showModal} >
        
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPriceLabel">Define NFT price</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSale}>

                <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <label htmlFor="inputPrice" className="col-form-label">Price</label>
                  </div>
                  <div className="col-auto">
                    <input type="text" onChange={e => setPrice(e.target.value)} aria-describedby="priceHelpInline" name="price" id="inputPrice" className="form-control" placeholder="0.59" /> 
                  </div>
                  <div className="col-auto">
                    <span id="priceHelpInline" className="form-text">
                      ETH
                    </span>
                  </div>
                </div>
                  
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <input type="submit" className="btn btn-danger" onClick={onSale}value="Sale" />
            </div>
          </div>
        </div>
        
      </div> 

    </div>
  
  );
};
