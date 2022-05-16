import React, { useEffect, useState } from "react";
import Footer from '../components/footer';
import { Link } from '@reach/router';
import getWeb3ERC721Factory from "../../getWeb3ERC721Factory";

import { createGlobalStyle } from 'styled-components';

import axios from 'axios';

const GlobalStyles = createGlobalStyle`
    header#myHeader.navbar.white {
        background: #212428;
    }

    a:link { text-decoration: none; }
    a:visited { text-decoration: none; }
    a:hover { text-decoration: none; }
    a:active { text-decoration: none; }
`;

function ERC721Display (props) {
    //const [instanceContract, setInstanceContract] = useState({});
    const [userAddress, setUserAddress] = useState('');
    const [collectionAddress, setCollectionAddress] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState("");
    const [attributes, setAttributes] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    //const [tokenId, setTokenId] = useState(0);
    //const [cid, setCid] = useState('');

    function CanBuyOrSell() {
        if (ownerAddress !== userAddress) {
            return (
                <div><a href="/"><span>Buy</span></a></div>
            );
        }

        return (<div><a href="/" className="btn-main">Sell</a></div>);
    }

    function CanAddItem() {
        // todo : Qui est le owner du contrat de cette collection ?
        if (true) {
            return (
                <a href={`/erc721/${collectionAddress}/create`} ><span>Add item to your collection</span></a>
            );
        }

        return (<span></span>);
    }
    
    useEffect(() => {
      
        setCollectionAddress(props.collectionAddress);
        //setTokenId(props.tokenId);
        
        getWeb3ERC721Factory()
          .then((data) => {
              //setInstanceContract(data[0]);
              setUserAddress(data[1][0]);  

                data[0].methods.getCollectionName(props.collectionAddress).call()
                    .then((response) => {
                        setCollectionName(response); 
                    })
                    .catch(console.error);
                    
                data[0].methods.getCIDbyTokenId(props.collectionAddress, props.tokenId).call()
                    .then((data) => {
                        //setCid(cid); 
                        console.log(data);
                        
                        const url = "https://gateway.pinata.cloud/ipfs/" + data;
                        axios.get(url)
                            .then(response => {
                                setTokenName(response.data.name);
                                setImageUrl(response.data.image);
                                setAttributes(response.data.attributes);
                                console.log(response.data);
                                console.log(response.data.attributes[0]);
                            })
                            .catch((err) => {
                                console.log(err);
                            });  
                    })
                    .catch(console.error);
                
                data[0].methods.getOwnerAddressByTokenId(props.collectionAddress, props.tokenId).call()
                    .then( ownerAddress => {
                        setOwnerAddress(ownerAddress);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
          })
          .catch(console.error);
  
        
    }, []);

    return (
        <div>
            <GlobalStyles/>

            <section className='container'>
                <div className='row mt-md-5 pt-md-4'>

                    <div className="col-md-6 text-center">
                        <img src={imageUrl} className="img-fluid img-rounded mb-sm-30" alt={tokenName}/>
                    </div>

                    <div className="col-md-6">
                        <div className="item_info">
                            
                            <h2>{collectionName} - {tokenName}</h2>
                            
                            <div className="nft__item_action">
                                <CanBuyOrSell />
                                <div className="spacer-50"></div>
                                <CanAddItem /> 
                            </div>
                            
                            <div className="spacer-40"></div>
                            
                            <div>owner : { ownerAddress === userAddress ? 'You' : ownerAddress}</div>
                            
                            <div className="spacer-50"></div>
                            
                            <div className="de_tab">
                                <div className="de_tab_content">
                                    <div className="tab-1 onStep">
                                        <h6>Attributes</h6>
                                        
                                        <ul className="de_nav">    
                                            {attributes.map( (x, i) => {
                                                return (<li key={i}><span>{x.trait_type} : {x.value}</span></li>)
                                            })}
                                        </ul>
                                    </div>
                                </div>                           
                            </div>                    
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
export default ERC721Display;