import React, {Component, useState} from "react";
import DisplayTooltip from "../../client-data/DisplayTooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

class V21NavItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    itemOnClick(evt) {
        const openTmp = !this.state.open;
        this.setState(
            {
                open: openTmp
            }
        )
        if (this.props.onClick) {
            this.props.onClick(evt);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.closeMenu) {
            if (this.props.closeMenu !== prevProps.closeMenu) {
                if (this.props.closeMenu) {
                    this.setState(
                        {
                            open: !this.props.closeMenu
                        }
                    )
                }
                if (this.props.setCloseMenuToFalse) {
                    this.props.setCloseMenuToFalse();
                }
            }
        }
    }

    render() {

        return (
            <div id="V21NavItemId">
                <li className="v21-nav-item">
                    {/* If the item is the main menu, then don't show a tooltip*/}
                    {this.props.tooltip_type === "hamburger" ?
                        <button className="v21-button-menu-item" onClick={(evt) => {
                            this.itemOnClick(evt)
                        }} >
                            <img src={this.props.icon} className="icon-button"/>
                        </button>
                        :
                        <OverlayTrigger
                            placement="top"
                            delay={{show: 150, hide: 200}}
                            overlay={DisplayTooltip(this.props)}>
                            <button className="v21-button-menu-item" onClick={(evt) => {
                                this.itemOnClick(evt)
                            }}>
                                {/* {this.props.icon}*/}
                                <img src={this.props.icon} className="icon-button"/>
                            </button>
                        </OverlayTrigger>
                    }

                    {this.state.open && this.props.children}
                </li>
            </div>
        );
    }
}

export default V21NavItem;
