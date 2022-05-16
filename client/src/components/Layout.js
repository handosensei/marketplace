import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout() {

    return (
    <div>

        <ul>
            <li><Link to="/" >Home</Link></li>
            <li><Link to="/collections">collections</Link></li>
            <li><Link to="/collections/create">collections create</Link></li>
        </ul>

        <Outlet />
    </div>);
}
