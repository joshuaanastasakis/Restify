import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './style.css';

export default function NavbarItem({title, link, onClick}) {
    const toLink = link ?? '';

    return (
        <>
            <NavLink as='a' to={toLink} className="dropdown-item" onClick={onClick}>
                {title}
            </NavLink>
        </>
    )
}