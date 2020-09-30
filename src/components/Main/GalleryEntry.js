import React, {Component} from 'react';
import ThreeCubeSample from "../../components/three-cube-sample"
import ThreeBuildingSample from "../../components/three-building-sample"
import ThreeGLTFLoader from "../../components/three-gltf-loader"
import CircleJoystick from '../../components/joystick/CircleJoystick'
import EnterAppModal from "../../components/modals/EnterAppModal";
import AnnotationPage from "../../components/annotations/AnnotationPage";


class GalleryEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enterApp: false
        }
    }


    enterApp = (evt) => {
        this.setState({
            enterApp: true
        })
    }

    render() {

        return (
            <div>
                {/*{this.state.enterApp ? <ThreeCubeSample/> : null}*/}
                {/*<ThreeBuildingSample/>*/}
                {/*<CircleJoystick/>*/}
                {/*<ThreeGLTFLoader/>*/}
                 {this.state.enterApp ? <ThreeGLTFLoader/> : null}
                {!this.state.enterApp ? <EnterAppModal enterApp={this.enterApp}/> : null}
                {/*<AnnotationPage paintingId="W01P01"/>*/}
            </div>
        )
    }
}

export default GalleryEntry;
