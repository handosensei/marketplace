import React, { useEffect, useRef, useState } from "react";

import Footer from '../components/footer';
import getWeb3ERC721Factory from "../../getWeb3ERC721Factory";

import 'react-notifications/lib/notifications.css';
import { NotificationManager} from 'react-notifications';

import FormData from 'form-data';
import axios from 'axios';

const useForceUpdate = () => useState()[1];

function ERC721Create(props) {

    const [instanceContract, setInstanceContract] = useState({});
    const [addressUser, setAddressUser] = useState('');
    const [collectionAddress, setCollectionAddress] = useState('');
    const [collectionName, setCollectionName] = useState('');
    
    const [inputList, setInputList] = useState([{ trait_type: "", value: "" }]);

    const fileInput = useRef(null);
    const forceUpdate = useForceUpdate();
    const [isActive, setIsActive] = useState(false);
    
    function ButtonSubmit() {
      if (isActive) {
        return (<button type="button" id="submit" className="btn-main" onClick={onSubmit} >Create item</button>);  
      }

      return (<button className="btn-main" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
              </button>);
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
    
    useEffect(() => {
      
      setCollectionAddress(props.collectionAddress);
      
      getWeb3ERC721Factory()
        .then((data) => {
            setIsActive(true);
            setInstanceContract(data[0]);
            setAddressUser(data[1][0]);  
            data[0].methods.getCollectionName(props.collectionAddress).call()
              .then((response) => {
                 setCollectionName(response); 
              })
              .catch(console.error);
        })
        .catch(console.error);

    }, []);
    
    const onSubmit = async (e) => {
      e.preventDefault();
      setIsActive(false);
      const tokenIdToAffect = await instanceContract.methods.getNextTokenId(collectionAddress).call();
      
      const responseFile = await postFile(fileInput.current.files[0]);
      console.log('responseFile');
      console.log(responseFile);

      const ipfsFile = "https://gateway.pinata.cloud/ipfs/" + responseFile.data.IpfsHash;
      const responseJSON = await postJSONBody(tokenIdToAffect, ipfsFile);
      console.log('responseJSON');
      console.log(responseJSON);
      
      const ipfsCid = responseJSON.data.IpfsHash;
      const ipfsJson = "https://gateway.pinata.cloud/ipfs/" + ipfsCid;
      console.log(ipfsJson);

      mint(ipfsCid)
        .then( (object) => {
          console.log(object);
          const tokenId = object.events.Minted.returnValues.tokenId;
          NotificationManager.success('NFT #' + tokenId + ' minted', 'Success');
          
          window.location.href = '/erc721/' + collectionAddress + '/' + tokenId;
        })
        .catch((err) => {
          NotificationManager.error('Error call', 'Add NFT failed');
          console.log(err);
        })
      ;
    }

    const mint = async (ipfsCid) => {
      const response = instanceContract.methods.mint(collectionAddress, ipfsCid).send({ from: addressUser })
        .catch((err) => {
          NotificationManager.error('Add item failed','Error');
          console.log(err)
        });

      return response;
    }

    const postJSONBody = async (tokenIdToAffect, imageURL) => {
      const JSONBody = {
        name: collectionName + ' #' + tokenIdToAffect,
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

    function fileNames() {
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

    return (
      <div>

        <section className='jumbotron breadcumb no-bg'>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>"{collectionName}" New Item</h1>
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
                      
                      <h5>Upload file</h5>

                      <div className="d-create-file">
                        <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 10mb. </p>
                        <p>&nbsp;{fileNames()}</p>
                        <div className='browse'>
                          <input id="upload_file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
                          <input type="button" id="get_file" className="btn-main" value="Browse"/>
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
                                          {inputList.length !== 1 && <button type="button" className="btn-main btn-sm" onClick={() => handleRemoveClick(i)}><i className="fa fa-trash"></i></button>}
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-1">
                                          {inputList.length - 1 === i && <button type="button" className="btn-main btn-sm" onClick={handleAddClick}><i className="fa fa-plus"></i></button>}
                                      </div>
                                  </div>            
                              );
                          })}
                          <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
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

export default ERC721Create;
