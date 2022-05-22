import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import 'react-notifications/lib/notifications.css';
import { NotificationManager} from 'react-notifications';
import getWeb3 from "../getWeb3";
import Factory from "../contracts/Factory.json"

import FormData from 'form-data';
import axios from 'axios';

import { useLocation, Navigate } from 'react-router-dom';

const useForceUpdate = () => useState()[1];

export default function NFTCreate() {
  
    const forceUpdate = useForceUpdate();
    const fileInput = useRef(null);

    const [account, setAccount] = useState("");  
    const [instanceFactory, setInstanceFactory] = useState("");  
    const [collectionName, setCollectionName] = useState('');
    const [tokenId, setTokenId] = useState(0);
    const [goNFTDisplay, setGoNFTDisplay] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [inputList, setInputList] = useState([{ trait_type: "", value: "" }]);
    const [locationData, setLocationData] = useState({ 
      collectionName: "",
      tokenId: 0
    });

    const { collectionAddress } = useParams();

    function ButtonSubmit() {
        if (isActive) {
          return (<button type="button" id="submit" className="btn btn-primary" onClick={onSubmit} >Create NFT</button>);  
        }
  
        return (<button className="btn btn-primary" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                  <span className="sr-only">Loading...</span>
                </button>);
    }

    const mint = async (tokenUri) => {
        const response = instanceFactory.methods.mint(collectionAddress, account, tokenUri).send({ from: account })
          .catch((err) => {
            NotificationManager.error('Add item failed','Error');
            console.log(err)
          });
  
        return response;
    }

    const postJSONBody = async (imageURL) => {
        const supply = await instanceFactory.methods.getTotalSupply(collectionAddress).call();
        const JSONBody = {
          tokenId: parseInt(supply) + 1,
          collection: collectionName,
          image:imageURL, 
          attributes:inputList
        };
        const params = {
          headers: {
            'pinata_api_key': process.env.REACT_APP_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_API_SECRET
          }
        };
      
        const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
        return axios.post(url, JSONBody, params)
          .catch((err) => {
            console.log(err)
          });
    }
  
    const postFile = async (fileToHandle) =>{
      const formData = new FormData()
      formData.append("file", fileToHandle);
      const params = {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,     
          'pinata_api_key': process.env.REACT_APP_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_API_SECRET
        }
      };
    
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      return axios.post(url, formData, params)
        .catch((err) => {
          console.log(err)
        });
    };
  
    const onSubmit = async (e) => {
        setIsActive(false);
        
        const responseFile = await postFile(fileInput.current.files[0]);
        console.log('responseFile');
        console.log(responseFile);

        const ipfsFile = "https://gateway.pinata.cloud/ipfs/" + responseFile.data.IpfsHash;
        const responseJSON = await postJSONBody(ipfsFile);
        console.log('responseJSON');
        console.log(responseJSON);
        
        
        const tokenUri = "https://gateway.pinata.cloud/ipfs/" + responseJSON.data.IpfsHash;
        console.log(tokenUri);
        mint(tokenUri)
          .then( (object) => {
              console.log(object);
              const tokenId = object.events.FactoryMinted.returnValues.tokenId;
              setTokenId(tokenId);
              NotificationManager.success('NFT #' + tokenId + ' minted', 'Success');
        
              const data = {
                collectionName : collectionName,
                tokenId: tokenId
              };
              
              setLocationData(data);
              setGoNFTDisplay(true);
          })
          .catch((err) => {
              NotificationManager.error('Error call', 'Add NFT failed');
              console.log(err);
          });
    }

    const fileNames = () => {
        const { current } = fileInput;
    
        if (current && current.files.length > 0) {
          let messages = [];
          for (let file of current.files) {
            messages = messages.concat(<span key={file.name}>{file.name}</span>);
          }
          return messages;
        }
        return null;
    }

    // handle input change
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value;
      setInputList(list);
    };
      
    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    
    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { trait_type: "", value: "" }]);
    };

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

    const loadCollectionName = async (instanceFactory) => {
      return instanceFactory.methods.getCollectionName(collectionAddress).call()
    }

    useEffect(() => {

      getWeb3Data().then((data) => {
        setInstanceFactory(data[0]);
        setAccount(data[1]);
        loadCollectionName(data[0]).then(res => {
          setCollectionName(res);
        });
      }).catch((err) => {
        console.error(err)
      });
    }, []);

    return (
        <div className="row">
          <h2>New NFT to collection "{collectionName}"</h2>
          <div className="col-lg-7 offset-lg-1 mb-5">
          <form id="form-create-item" className="form-border" action="#" >
                <div className="field-set">
                      
                    <h5>Upload file</h5>

                    <div className="d-create-file">
                        <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 10mb. </p>
                        <p>&nbsp;{fileNames()}</p>
                        <div className='browse'>
                            <input id="upload_file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
                        </div>
                    </div>

                    <div className="spacer-single"></div>
  
                    <h5>Metadata</h5>
                    <div>
                        {inputList.map((x, i) => {
                            return (
                                <div className="row" key={i}>
                                    <div className="col-4">
                                        <input type="text" name="trait_type" className="form-control" placeholder="Key" value={x.traitType} onChange={e => handleInputChange(e, i)}/>
                                    </div>

                                    <div className="col-4">
                                        <input type="text" name="value" className="form-control" placeholder="Value" value={x.val} onChange={e => handleInputChange(e, i)}/>
                                    </div>

                                    <div className="col-1">
                                        {inputList.length !== 1 && <button type="button" className="btn btn-primary" onClick={() => handleRemoveClick(i)}><i className="fa fa-trash"></i>Enlever</button>}
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-1">
                                        {inputList.length - 1 === i && <button type="button" className="btn btn-primary" onClick={handleAddClick}><i className="fa fa-plus"></i>Ajouter</button>}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
                    </div>
                      
                    <div className="spacer-10"></div>
                      
                    <ButtonSubmit />
                    {goNFTDisplay && <Navigate to={`/collections/${collectionAddress}/${tokenId}`} replace={true} state={locationData}/>}
                  </div>
              </form>
          </div>
        </div>
    );
}
