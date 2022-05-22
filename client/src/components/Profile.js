import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import getWeb3 from "../getWeb3";
import Factory from "../contracts/Factory.json";

export default function Profile() {
    const [collections, setCollections] = useState([]);    

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

    const loadCollections = async (instanceFactory, account) => {
        
        const collections = await instanceFactory.methods.getCollections().call();
        
        var result = [];
        for (let index = 0; index <= collections.length - 1; index++) {
            let tokenAddress = collections[index];
            let metadataTokens = [];
            const tokenIds = await instanceFactory.methods.getOwnerTokenIdsByCollection(tokenAddress, account).call();
            for (let indexToken = 0; indexToken <= tokenIds.length - 1; indexToken++) {
                const tokenId = tokenIds[indexToken];
                const metadataUri = await instanceFactory.methods.getTokenURI(tokenAddress, tokenId).call();
                const metadataToken = await axios.get(metadataUri).catch((err) => { console.log(err); });
                console.log(metadataToken);
                metadataToken['data']['tokenId'] = tokenId;
                
                metadataTokens.push(metadataToken);
            }
            const data = {contract : tokenAddress, tokens: metadataTokens}
            result.push(data);
        }
        
        setCollections(result);
    }

    function Collections() {
        
        return (<>
            {
                collections.map((collection, i) => {
                    
                    return (
                        <div className="row" key={i}>
                            <div className="row">
                                <h4>{collection.tokens[0].data.collection}</h4>
                            </div>
                            <div className="row">
                                <Cards tokens={collection.tokens} contract={collection.contract} />
                            </div>
                        </div>
                    );
                })
            }
        </>);
    }

    function Cards(data) {
        
        return (
            <ul className="list-group list-group-horizontal">
                {
                    data.tokens.map((metadataToken, i) => {
                        return (
                            <li className="list-group-item" key={i}>
                                <Card metadataToken={metadataToken} contract={data.contract}/>
                            </li>         
                        );
                    })
                }
            </ul>
        );
    }

    function Card(element) {
        const metadata = element.metadataToken.data;
        
        return (
            <Link to={`/collections/${element.contract}/${metadata.tokenId}/`} >
                <img src={metadata.image} className="img-thumbnail" style={{width: "100px", height: "auto"}} alt={metadata.name} />
                <div className="card-body">
                    <h5 className="card-title">{metadata.collection} #{metadata.tokenId}</h5>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
            </Link>
        );
    }

    useEffect(() => {
        
        getWeb3Data().then((data) => {
            const instanceFactory = data[0];
            const account = data[1]
            loadCollections(instanceFactory, account);
        });

    }, []);

    return (
        <div>
            <h1>Mes NFT</h1>  
            
            <Collections />
            
        </div>        
    );
}
