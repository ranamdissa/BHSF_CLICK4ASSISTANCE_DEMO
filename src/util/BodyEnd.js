import React from 'react';
import ReactDOM from 'react-dom';

class BodyEnd extends React.Component {

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.el.style.display = 'contents';
    }

    componentDidMount() {
        this.props.parentElem.appendChild(this.el);
    }

    componentWillUnmount() {
        this.props.parentElem.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}

export default BodyEnd;
