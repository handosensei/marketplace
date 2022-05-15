import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Link } from '@reach/router';

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link 
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);

const Header= function() {

    const [userAddress, setUserAddress] = React.useState("");
    const [, btn_icon] = useState(false);

    async function connect(onConnected) {
      if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
      }
    
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    
      onConnected(accounts[0]);
    };
  
    async function checkIfWalletIsConnected(onConnected) {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
    
        if (accounts.length > 0) {
          const account = accounts[0];
          onConnected(account);
          return;
        }
      }
    }

    async function logout() {}
    
    function UserConnectLink() {
      if (userAddress !== "") {
        return (
          <span>
            <div className='navbar-item'>
              <a href="/erc721/collections/create">Create</a>
              <span className='lines'></span>  
            </div>

            <div className='navbar-item'>
              <a href={`/accounts/${userAddress}`}>Account</a>
              <span className='lines'></span>
            </div>
          </span>
        );
      }

      return (<div></div>);
    }

    function Connect({ setUserAddress }) {
      return (
        <button className="btn-main" onClick={() => connect(setUserAddress)}>
          Connect wallet
        </button>
      );
    };
    
    function Address({ userAddress }) {
        return (
            <button className="btn-main" onClick={ () => logout()}>
                {userAddress.substring(0, 5)}…{userAddress.substring(userAddress.length - 4)}
            </button>
        );
    }
  
    useEffect(() => {

      const header = document.getElementById("myHeader");
      const totop = document.getElementById("scroll-to-top");
      const sticky = header.offsetTop;
      const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);

      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      } 
      });
  
      checkIfWalletIsConnected(setUserAddress);    

      return () => {
        window.removeEventListener("scroll", scrollCallBack);
      };

    }, []);

    return (
      <header id="myHeader" className='navbar white'>
        <div className='container'>
          <div className='row w-100-nav'>          
            <BreakpointProvider>                
              <Breakpoint xl>
                <div className='menu'>
                
                  <div className='navbar-item'>
                    <NavLink to="/">
                      Home
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                  
                  <UserConnectLink />

                </div>
              </Breakpoint>
            </BreakpointProvider>

            <div className='mainside'>
              { userAddress ? (<Address userAddress={userAddress} />) : (<Connect setUserAddress={setUserAddress}/>)}
            </div>
          </div>

        </div>     
      </header>
    );
}
export default Header;