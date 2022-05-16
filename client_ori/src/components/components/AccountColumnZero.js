import React, {useEffect, useState} from "react";
import styled from "styled-components";
import getWeb3ERC721Factory from "../../getWeb3ERC721Factory";
//import Clock from "./Clock";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

function AccountColumnZero() {
    const dummyData = [{
        deadline:"December, 30, 2021",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-1.jpg",
        previewImg: "../img/items/static-1.jpg",
        title: "Pinky Ocean",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-10.jpg",
        previewImg: "../img/items/static-2.jpg",
        title: "Deep Sea Phantasy",
        price: "0.06 ETH",
        bid: "1/22",
        likes: 80
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-11.jpg",
        previewImg: "../img/items/static-3.jpg",
        title: "Rainbow Style",
        price: "0.05 ETH",
        bid: "1/11",
        likes: 97
    },
    {
        deadline:"January, 1, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-12.jpg",
        previewImg: "../img/items/static-4.jpg",
        title: "Two Tigers",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-9.jpg",
        previewImg: "../img/items/anim-4.webp",
        title: "The Truth",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"January, 15, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-2.jpg",
        previewImg: "../img/items/anim-2.webp",
        title: "Running Puppets",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-3.jpg",
        previewImg: "../img/items/anim-1.webp",
        title: "USA Wordmation",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-4.jpg",
        previewImg: "../img/items/anim-5.webp",
        title: "Loop Donut",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"January, 3, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-5.jpg",
        previewImg: "../img/items/anim-3.webp",
        title: "Lady Copter",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-7.jpg",
        previewImg: "../img/items/static-5.jpg",
        title: "Purple Planet",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-6.jpg",
        previewImg: "../img/items/anim-6.webp",
        title: "Oh Yeah!",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"January, 10, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-8.jpg",
        previewImg: "../img/items/anim-7.webp",
        title: "This is Our Story",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-9.jpg",
        previewImg: "../img/items/static-6.jpg",
        title: "Pixel World",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline:"January, 10, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "#",
        authorImg: "../img/author/author-12.jpg",
        previewImg: "../img/items/anim-8.webp",
        title: "I Believe I Can Fly",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    }]
    
    const [tokens, ] = useState(dummyData);
    const [height, setHeight] = useState(0);
    const [userAddress, setUserAddress] = useState('');
    const [instanceContract, setInstanceContract] = useState({});
    
    function onImgLoad(target) {
        let currentHeight = height;
        if(currentHeight < target.offsetHeight) {
            setHeight(target.offsetHeight);
        }
    }


    useEffect(() => {
        
        getWeb3ERC721Factory()
            .then((data) => {
                setInstanceContract(data[0]);
                setUserAddress(data[1][0]);  
            })
            .catch(console.error);

        

    }, []);
 
    return (
        <div className='row'>
            {tokens.map( (nft, index) => (
                <div key={index} className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div className="nft__item">
                        <div className="nft__item_wrap" style={{height: `${height}px`}}>
                        <Outer>
                            <span>
                                <img onLoad={e => onImgLoad(e.target)}  src={nft.previewImg} className="lazy nft__item_preview" alt=""/>
                            </span>
                        </Outer>
                        </div>
                        <div className="nft__item_info">
                            <span onClick={()=> window.open(nft.nftLink, "_self")}>
                                <h4>{nft.title}</h4>
                            </span>
                            <div className="nft__item_price">
                                {/*{nft.price}<span>{nft.bid}</span>*/}
                                <span>&nbsp;</span>
                            </div>
                            <div className="nft__item_action">
                                <span></span>
                            </div>
                            <div className="nft__item_like">
                                <span>&nbsp;</span>
                            </div>
                            {/*<div className="nft__item_action">
                                <span onClick={()=> window.open(nft.bidLink, "_self")}>Place a bid</span>
                            </div>
                            <div className="nft__item_like">
                                <i className="fa fa-heart"></i><span>{nft.likes}</span>
                            </div>*/}                            
                        </div> 
                    </div>
                </div>  
            ))}
            
        </div>              
    );
    
}
export default AccountColumnZero;