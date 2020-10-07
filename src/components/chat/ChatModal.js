import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";


// props.annotationData
// props.showChat ==> boolean either true or false
// props.chatCloseBtnHandler ==> change the value of state.showChat to false


const ChatModal = (props) => {

    console.log("[ChatModal] - render called chatElement to be mounted", props.annotationData.paintingId, props.annotationData.chatSrc);

   const  onClickHandler = (chatSrc) => {
        window.open(chatSrc,'popup','width=600,height=600,scrollbars=no,resizable=no');
        return false;
    }

    let chatIframeElement = null;
        //<iframe title="pureChat" width='100%' height='680'
        chatIframeElement = <iframe height="890"
                                    src={props.annotationData.chatSrc}
                              frameBorder="0">
        </iframe>;

    const modalCloseHandler = () => {
        props.chatCloseBtnHandler();
    }


    const modalChat = <Modal show={props.showChat} onHide={modalCloseHandler} animation={false} scrollable="true">
                <Modal.Header closeButton>
                    <Modal.Title>{props.annotationData.chatTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {/*<div style={{width: "100%", height: "100%", all: "revert"}}>*/}
                        {chatIframeElement}
                    {/*</div>*/}

                    </Modal.Body>
            </Modal>;


    const windowChat =
                <a href={props.annotationData.chatSrc}
                   target="popup"
                   onClick={() => onClickHandler(props.annotationData.showChat, props.annotationData.chatSrc)}>
                </a>;


    return (
        <div style={{all: "initial"}}>
            {/*{windowChat}*/}
            {modalChat}
            </div>
        )
    }

export default ChatModal;