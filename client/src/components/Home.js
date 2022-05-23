import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import getWeb3 from "../getWeb3";
import Factory from "../contracts/Factory.json"

export default function Home() {
  const [, setInstanceFactory] = useState("");
  const [, setAccount] = useState("");  
  const [collections, setCollections] = useState([]);    

  function Collections() {
        
    if (collections.length == 0) {
        return (<div>no NFT</div>);
    }

    return (<>
        {
            collections.map((collection, i) => {
                if (collection.tokens.length == 0) {
                  return (<></>);
                }
                
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
                
                {metadata.price != 0 && <p className="card-text">{metadata.price} ETH</p>}
                
            </div>
        </Link>
    );
}

  const loadNFTOnSale = async (instanceFactory) => {
    

    const collections = await instanceFactory.methods.getCollections().call();
    var result = [];
    for (let index = 0; index <= collections.length - 1; index++) {
      let tokenAddress = collections[index];
      const supply = await instanceFactory.methods.getTotalSupply(tokenAddress).call();
      let metadataTokens = [];
      for (let index = 0; index <= supply - 1; index++) {
        const tokenId = index + 1;
        const price = await instanceFactory.methods.getPrice(tokenAddress, tokenId).call();
        
        if (price == 0) {continue; }
        
        const metadataUri = await instanceFactory.methods.getTokenURI(tokenAddress, tokenId).call();
        let metadataToken = await axios.get(metadataUri).catch((err) => { console.log(err); });
        metadataToken['data']['price'] = price;
        metadataTokens.push(metadataToken);
      }
      const data = {contract : tokenAddress, tokens: metadataTokens}
      
      result.push(data);

    }
    console.log(result);
    setCollections(result);

  }
  
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

  useEffect(() => {
    
    getWeb3Data().then((data) => {
      setInstanceFactory(data[0]);
      setAccount(data[1]);
      loadNFTOnSale(data[0]);
    });
    
  }, []);

  return (
    <div>
      <h1>Home Page</h1>  
      <Collections />
    </div>    
  );
};
