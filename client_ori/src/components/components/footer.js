import React from 'react';

const footer= () => (
  <footer className="footer-light">  
        <div className="subfooter">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="de-flex">
                            <div className="de-flex-col">
                                <span onClick={()=> window.open("", "_self")}>
                                    <span className="copy">&copy; Copyright 2021 - OpenUp by Codatomic</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
export default footer;