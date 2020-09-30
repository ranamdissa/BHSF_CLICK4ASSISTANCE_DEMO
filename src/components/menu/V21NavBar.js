import React from "react";

function V21Navbar(props) {
    const align = props.alignRightLeft ? props.alignRightLeft === 'right' : true;
    if (align) {
        return (
            <nav className="v21-navbar-right">
                <ul className="v21-navbar-nav">{props.children}</ul>
            </nav>
        );
    }
    else {
        return (
            <nav className="v21-navbar-left">
                <ul className="v21-navbar-nav">{props.children}</ul>
            </nav>
        );
    }
}

export default V21Navbar;
