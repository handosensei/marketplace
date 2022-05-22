import React, {useEffect, useState, useContext } from "react";

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

  function ButtonAdd() {
    

    return (
      <>
        <Link to={`/collections/${collectionAddress}/create`} className="btn btn-primary">Ajouter</Link>
      </>
    );
  }

  function ButtonSale() {
    return (
      <>
        <a href="#" className="btn btn-danger">Vendre</a>
      </>
    );
  }

  

  useEffect(() => {
    
    getWeb3Data().then((data) => {

      data[0].methods.getTokenURI(collectionAddress, tokenId).call()
        .then(tokenURI => {
          console.log(tokenURI);
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
  
    }).catch((err) => {
      console.error(err)
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
    </div>
  
  );
};
