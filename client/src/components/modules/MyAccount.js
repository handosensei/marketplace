import React, { useEffect, useState } from "react";

import AccountColumnZero from '../components/AccountColumnZero';
import Footer from '../components/footer';

import getWeb3ERC721Factory from "../../getWeb3ERC721Factory";

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #212428;
  }
`;

function MyAccount() {
  
    const [instanceContract, setInstanceContract] = useState({});
    const [userAddress, setUserAddress] = useState('');
    

    useEffect(() => {
      
        getWeb3ERC721Factory()
          .then((data) => {
              setInstanceContract(data[0]);
              setUserAddress(data[1][0]);  
          })
          .catch((err) => console.log(err));
    });

    return (
        <div>
            <GlobalStyles/>

            <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'../img/background/4.jpg'})`}}>
                <div className='mainbreadcumb'>
                </div>
            </section>

            <section className='container d_coll no-top no-bottom'>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="d_profile">
                            <div className="profile_avatar">
                                <div className="spacer-40"></div>
                                <div className="profile_name">
                                    <h4>
                                        <div className="clearfix"></div>
                                        <span id="wallet" className="profile_wallet">{userAddress}</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-top'>
                <div id='zero1' className='onStep'>
                    <AccountColumnZero />
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default MyAccount;
