import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";

class NavBar extends Component {

    constructor() {
        super();
        this.state = {
            linkIndex: 0,
        };
    }    

    onClickLink = (index) => {
        document.getElementById("nave-menu-link-0").classList.remove("selected");
        document.getElementById("nave-menu-link-1").classList.remove("selected");
        if (index == 0) {
            document.getElementById("nave-menu-link-0").classList.add("selected");
        } else {
            document.getElementById("nave-menu-link-1").classList.add("selected");
        }
        // console.log(document.getElementById("nave-menu-link-0").classList)
        // console.log(document.getElementById("nave-menu-link-1").classList)
        this.setState({linkIndex: index});
    }

    render() {
        return (
            <>
                <div className="nav-bar-title">
                    <h1 className="navbar-logo">
                        Uniswap V2 Interface
                    </h1>
                </div>
                <div className="nav-bar-content">
                    <ul className={`nav-menu`}>
                    {
                        MenuItems.map((item, index) => {
                            return (
                                <li 
                                    key={index}
                                >
                                    <Link 
                                        id={"nave-menu-link-"+index}
                                        onClick={() => this.onClickLink(index)}
                                        className={this.state.linkIndex == index ? "nav-menu-link selected" : "nav-menu-link"}
                                        to={item.url}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })
                    }
                    </ul>
                </div>
            </>
        );
    }
}

export default NavBar;
