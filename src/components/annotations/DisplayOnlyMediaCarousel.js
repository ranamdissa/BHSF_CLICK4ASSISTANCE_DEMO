import React, {Component} from "react";
import OnlyMediaCarousel from "./OnlyMediaCarousel";

class DisplayOnlyMediaCarousel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showOnlyMediaCarousel: true,
        }

        this.mediaCarouselCloseBtnHandler = this.mediaCarouselCloseBtnHandler.bind(this);
    }

    mediaCarouselCloseBtnHandler = () => {
        this.setState({showOnlyMediaCarousel: false});
    }

    render() {
        return (
            <OnlyMediaCarousel
                annotationData={this.props.annotationData}
                showMediaCarousel={this.state.showOnlyMediaCarousel}
                mediaCarouselCloseBtnHandler={this.mediaCarouselCloseBtnHandler}
                annotationModalSize={this.props.annotationModalSize}
            />

            )}
}

export default DisplayOnlyMediaCarousel;