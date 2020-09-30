import React, {Component} from 'react';
import './App.css';
import ThreeCubeSample from "./components/three-cube-sample"
import ThreeBuildingSample from "./components/three-building-sample"
import ThreeGLTFLoader from "./components/three-gltf-loader"
import CircleJoystick from './components/joystick/CircleJoystick'
import EnterAppModal from "./components/modals/EnterAppModal";
import AnnotationPage from "./components/annotations/AnnotationPage";
import GalleryEntry from "./components/Main/GalleryEntry";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {thisIsMobile} from "./client-data/GlobalConstants";

import ReactGa from 'react-ga';



class App extends Component {
    constructor(props) {
        super(props);
        this.isMobile();
        this.state = {
            enterApp: false
        }

        // This code adds Google Analytics Module to our app
        ReactGa.initialize('UA-111511367-3', {
            debug: false,
            gaOptions: {
                siteSpeedSampleRate: 100
            }
        });
        ReactGa.pageview(window.location.pathname + window.location.search);
    }

    isMobile() {

        window.isMobile = thisIsMobile;

    }

    enterApp = (evt) => {
        this.setState({
            enterApp: true
        })
    }

    render() {

        return (
            /*<div className={'background-image'}>
               <GalleryEntry/>
            </div>*/
            <main>
                <Switch>
                    <Route path="/" component={GalleryEntry} exact />
                    <Route path="/AnnotationPage/:id" exact component={AnnotationPage} />

                </Switch>
            </main>
        )
    }
}

export default App;
