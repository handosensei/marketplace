import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Link } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";

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
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [openMenu2, setOpenMenu2] = React.useState(false);
    const [openMenu3, setOpenMenu3] = React.useState(false);
    const [showmenu, btn_icon] = useState(false);

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
  
    const handleBtnClick1 = () => {
      setOpenMenu1(!openMenu1);
    };
    const handleBtnClick2 = () => {
      setOpenMenu2(!openMenu2);
    };
    const handleBtnClick3 = () => {
      setOpenMenu3(!openMenu3);
    };
    const closeMenu1 = () => {
      setOpenMenu1(false);
    };
    const closeMenu2 = () => {
      setOpenMenu2(false);
    };
    const closeMenu3 = () => {
      setOpenMenu3(false);
    };
    const ref1 = useOnclickOutside(() => {
      closeMenu1();
    });
    const ref2 = useOnclickOutside(() => {
      closeMenu2();
    });
    const ref3 = useOnclickOutside(() => {
      closeMenu3();
    });

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

                  <div className='navbar-item'>
                    <div ref={ref1}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onMouseEnter={handleBtnClick1} onMouseLeave={closeMenu1}>
                          Explore
                          <span className='lines'></span>
                          {openMenu1 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu1}>
                            <NavLink to="/explore">Explore</NavLink>
                            <NavLink to="/explore2">Explore 2</NavLink>
                            <NavLink to="/rangking">Rangking</NavLink>
                            <NavLink to="/colection">Collection</NavLink>
                            <NavLink to="/ItemDetail">Items Details</NavLink>
                            <NavLink to="/Auction">Live Auction</NavLink>
                            <NavLink to="/helpcenter">Help Center</NavLink>
                            </div>
                          </div>
                        )}
                        </div>
                        
                      </div>
                  </div>
                  <div className='navbar-item'>
                    <div ref={ref2}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onMouseEnter={handleBtnClick2} onMouseLeave={closeMenu2}>
                          Pages
                          <span className='lines'></span>
                          {openMenu2 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu2}>
                            <NavLink to="/Author">Author</NavLink>
                            <NavLink to="/wallet">Wallet</NavLink>
                            <NavLink to="/create">Create</NavLink>
                            <NavLink to="/news">News</NavLink>
                            <NavLink to="/works">Gallery</NavLink>
                            <NavLink to="/login">login</NavLink>
                            <NavLink to="/loginTwo">login 2</NavLink>
                            <NavLink to="/register">Register</NavLink>
                            <NavLink to="/contact">Contact Us</NavLink>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                  </div>
                  
                  <div className='navbar-item'>
                    <div ref={ref3}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onMouseEnter={handleBtnClick3} onMouseLeave={closeMenu3}>
                          Elements
                          <span className='lines'></span>
                          {openMenu3 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu3}>
                            <NavLink to="/elegantIcons">Elegant Icon</NavLink>
                            <NavLink to="/etlineIcons">Etline Icon</NavLink>
                            <NavLink to="/fontAwesomeIcons">Font Awesome Icon</NavLink>
                            <NavLink to="/accordion">Accordion</NavLink>
                            <NavLink to="/alerts">Alerts</NavLink>
                            <NavLink to="/price">Pricing Table</NavLink>
                            <NavLink to="/progressbar">Progess Bar</NavLink>
                            <NavLink to="/tabs">Tabs</NavLink>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                  </div>
                </div>
              </Breakpoint>
            </BreakpointProvider>

            <div className='mainside'>
              { userAddress ? (<Address userAddress={userAddress} />) : (<Connect setUserAddress={setUserAddress}/>)}
            </div>
          </div>

          <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
            <div className="menu-line white"></div>
            <div className="menu-line1 white"></div>
            <div className="menu-line2 white"></div>
          </button>

        </div>     
      </header>
    );
}
export default Header;