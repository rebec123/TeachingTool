import React from 'react';
import { slide as Menu } from 'react-burger-menu'

//Algorithm supplies if the user is on Merge or Heap sort
//Link type supplies if the user is on the practice screen, so has to go to extra info or vice versa
function SideMenu({ algorithm}) {
    let linkText = "Extra Information"
    let infoLink = "";
    if (algorithm === "merge") {
        infoLink = "/Merge-Info";
    }
    else if (algorithm === "heap") {
        infoLink = "/Heap-Info";
    }
    else {//Invalid var passed so just take user to home
        infoLink = "/";
    }
    return (
        <Menu>
            <a className="menu-item" href="/">
                Home
            </a>
            <a className="menu-item" href={infoLink}>
                Algorithm Information
            </a>
            <a className="menu-item" href="/Merge">
                Merge Sort
            </a>
            <a className="menu-item" href="/Heap">
                Heap Sort
            </a>
        </Menu>
    );
}

export default SideMenu;
