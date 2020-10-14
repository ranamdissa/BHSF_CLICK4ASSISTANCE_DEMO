import React, {Component} from 'react';
import {Viewer} from "./viewer"
import "./Viewer.css"
import CircleJoystick from "../joystick/CircleJoystick";
import FPSNavigationControl from '../navigation/fps-navigation-control'
import AnnotationContainer from '../annotations/AnnotationContainer'
import {ANNOTATION_LAYER_CHANEL, V21_ARTSPACE_WEBSITE, VIDEO_LAYER_CHANEL} from '../../client-data/GlobalConstants'
import Hamburger from '../../icons/Hamburger.svg';
import VR from '../../icons/VR.svg';
import FullScreen from '../../icons/FullScreen.svg';
import QuestionMark from '../../icons/QuestionMark.svg';
import forPlanIconBlack from '../../icons/forPlanIconBlack.svg'
import ResetArrows from '../../icons/ResetArrows.svg';
import CloseFullScreen from '../../icons/CloseFullScreen.svg';
import ToggleAnnotation from '../../icons/ToggleAnnotaion.svg';

import V21DropdownMenu from "../menu/V21DropdownMenu";
import V21Navbar from "../menu/V21NavBar";
import V21NavItem from "../menu/V21NavItem";
import HelpModal from '../modals/HelpModal'
import LoadingProgressModal from "../modals/LoadingProgressModal";
import AnnotationModal from "../annotations/AnnotationModal";
import AnnotationDataController from "../annotations/AnnotationDataController";
import MediaController from '../annotations/MediaController'
import VideoContainer from "../annotations/VideoContainer";
import SocialMediaAnnotationModal from "../annotations/SocialMediaAnnotationModal";
import GalleryAnnotation from "../annotations/GalleryAnnotation";
import CarouselAnnotationModal from "../annotations/CarouselAnnotationModal";
import OnlyMediaCarousel from "../annotations/OnlyMediaCarousel";
import VideosComponent from "../../client-data/VideosComponent";
import CameraLocationsDataController from "../zones/CameraLocationsDataController";
import ZonesLinkModal from "../modals/ZonesLinkModal";
import {Euler, Vector3,Scene} from "three";
import HideAllControls from '../../icons/hideEyeBlack.svg';
import UnHideEyeBlack from '../../icons/unHideEyeBlack.svg';
import CSS3DContainer from "../annotations/CSS3DContainer";
import {clientOptions, DISPLAY_ZONE_LINK} from "../../client-data/clientOptions";
import ChatModal from "../chat/ChatModal";


class ThreeGLTFLoader extends Component {
    viewerCamera = null;
    annotationData = null;
    zonesData = null;
    pausePreventDefault = false; //need this flag to be able to scroll when popups are open.
    mediaController;
    videoContainer;
    viewerScene = null;
    css3dContainer

    constructor(props) {
        super(props);
        this.mount = React.createRef();
        this.joystickUpdateLoop = null;
        this.setJoystickUpdateLoop = this.setJoystickUpdateLoop.bind(this);
        this.fullScreenChange = this.fullScreenChange.bind(this);
        this.viewer = null;
        this.fpsController = null;
        this.annotationContainer = null;
        this.showHelpOnLoad = false;

        this.state = {
            closeNavItem: false,
            openMenu: false,
            showHelp: false,
            showZonesShortCutModal: false,
            loadingProgress: 0,
            showLoadingProgress: true,
            fullScreen: false,
            showAnnotation: true,
            showAnnotationModal: false,
            showOnlyMediaCarousel: false,
            SocialMediaAnnotationModal: false,
            showGalleryAnnotation: false,
            showCarouselAnnotation: false,
            showChat: false,
            hideAllControls:false,
            displayZoneLink: DISPLAY_ZONE_LINK,

        };
        this.onClickZonesShortcutHandler = this.onClickZonesShortcutHandler.bind(this);
        this.closeZonesShortcutHandler = this.closeZonesShortcutHandler.bind(this);
        this.onClickZonesLinkHandler = this.onClickZonesLinkHandler.bind(this);
        this.hideChatHandler = this.hideChatHandler.bind(this);
        this.openChatWindowHandler = this.openChatWindowHandler.bind(this);
    }

    toggleAnnotation = () => {
        if (this.state.showAnnotation) {
            this.annotationContainer.closeActiveAnnotation();
            this.viewerCamera.layers.disable(ANNOTATION_LAYER_CHANEL);
            this.viewerCamera.layers.disable(VIDEO_LAYER_CHANEL);

        } else {
            this.viewerCamera.layers.enable(ANNOTATION_LAYER_CHANEL);
            this.viewerCamera.layers.enable(VIDEO_LAYER_CHANEL);
        }

        this.setState({
            ...this.state,
            showAnnotation: !this.state.showAnnotation,
            closeNavItem: true,
            openMenu: false
        })
    }

    loadingTimeoutFunc = () => {

        this.setState({
            ...this.state,
            showLoadingProgress: false,
            showHelp: this.showHelpOnLoad,

        });
    }

    modelLoadingProgress = (percent) => {
        this.setState({
            ...this.state,
            loadingProgress: percent
        })

        if (percent >= 100) {
            setTimeout(this.loadingTimeoutFunc, 10);
        }
    }

    teleportEventReceiver = (teleportId) => {
        console.log("--------triggerTeleportEvent",teleportId);

        /*this.viewer.setCameraOrient(
            {
                position: new Vector3(-1.928, 1.7, 10),
                rotation: new Euler(0, 0, 0, 'XYZ')
            }
        );*/



        /* if (this.viewer) {
            this.viewer.dispose();
         }*/



        /* const parent = this.mount.current;
         while (parent.firstChild) {
             parent.firstChild.remove();
         }*/
        if (teleportId === 'teleportTopA') {

            /*  this.reloadModel('NC_mainbuilding_jpg_022_bottom.glb',
                  {
                      position: new Vector3(-1.928, -2.1, 10.60),
                      rotation: new Euler(0, 0, 0, 'XYZ')
                  });*/

            this.viewer.setCameraOrient(
                {
                    position: new Vector3(-1.928, -2.1, .189),
                    rotation: new Euler(0, Math.PI, 0, 'XYZ')

                }
            );


        }
        else {

            this.viewer.setCameraOrient(
                {

                    position: new Vector3(-1.928, 1.52, .189),
                    rotation: new Euler(0, Math.PI, 0, 'XYZ')
                }
            );

            /* this.reloadModel('NC_mainbuilding_jpg_022_top.glb',
                 {
                     position: new Vector3(-1.928, 1.7, 10.60),
                     rotation: new Euler(0, 0, 0, 'XYZ')
                 });*/
        }

        // this.viewer.clear();
    }

    reloadModel = (modelName, initCameraOrient) => {

        this.viewer.onLoadProgress = null;
        /*this.setState({
            showLoadingProgress: true,
            loadingProgress: 0,
        });
        this.showHelpOnLoad = false;*/

        this.viewerCamera.layers.disableAll();
        this.viewer.load(process.env.PUBLIC_URL + `/models/${modelName}`).then((obj) => {
            this.annotationContainer.resetScene(obj.gltfScene);
            this.videoContainer.resetScene(obj.gltfScene);
            this.viewer.resetColliders();
            this.viewer.addMedia(this.mediaController);
            this.viewer.setCameraOrient(initCameraOrient);
            this.viewerCamera.layers.enableAll();
            this.viewer.saveCamera();
            this.showHelpOnLoad = false;
        });
    }

    loadModel = (modelName, initCameraOrient) => {

        this.viewer.onLoadProgress = this.modelLoadingProgress;

        this.viewer.load(process.env.PUBLIC_URL + `/models/${modelName}`).then((obj) => {

            this.viewerScene = obj.scene;
            this.viewerCamera = obj.camera;
            //todo  if this.showAnnotationModal = null then we need to set useCss3Renderer  to 'Y' in Viewr class
            // this.annotationContainer = new AnnotationContainer(obj.scene, obj.camera, obj.css3dScene, this.showAnnotationModal);
            this.annotationContainer = new AnnotationContainer(obj.gltfScene, obj.camera, obj.css3dScene, this.showAnnotationModal);
            // this.videoContainer = new VideoContainer(obj.scene, obj.camera, obj.css3dScene);
            this.videoContainer = new VideoContainer(obj.gltfScene, obj.camera, obj.css3dScene);
            this.css3dContainer = new CSS3DContainer(obj.css3dScene,obj.gltfScene,obj.camera);
            this.mediaController = new MediaController(this.annotationContainer, this.videoContainer,this.css3dContainer);
            this.viewer.addMedia(this.mediaController);
            this.viewer.addColliders();
            this.viewer.setJoystickUpdateLoop(this.joystickUpdateLoop);
            this.fpsController = new FPSNavigationControl(this.mount.current);
            this.viewer.setFPSNavigation(this.fpsController.update);
            this.viewer.saveCamera();
            this.viewer.populateCameraLocations();
            this.zonesData = CameraLocationsDataController.getCameraLocationsData();
        });

        document.addEventListener("fullscreenchange", this.fullScreenChange);

        /* Firefox */
        document.addEventListener("mozfullscreenchange", this.fullScreenChange);

        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", this.fullScreenChange);

        /* IE / Edge */
        document.addEventListener("msfullscreenchange", this.fullScreenChange);
        // let {scene ,camera} = this.viewer.getSceneAndCamera();


        if (window.isMobile) {
            document.addEventListener('touchmove', this.documentTouchMove, {passive: false});
        }
    }

    componentDidMount() {

        const newClientOptions = {
            ...clientOptions,
            useGUI: this.props.useGUI || clientOptions.useGUI,
        }

        this.viewer = new Viewer(this.mount.current, 'Y', newClientOptions,this.teleportEventReceiver);
        // this.loadModel('NC_bottomFloor_005_2K_jpg.glb',
        // this.loadModel('NC_mainbuilding_jpg_022_bottom.glb',
        this.loadModel(clientOptions.modelName,
            {
                position: new Vector3(-1.928, -2.1, 10.60),
                rotation: new Euler(0, 0, 0, 'XYZ')
            });





        // this.loadModel('NC_mainbuilding_jpg_016.glb');


    }

    documentTouchMove = (evt) => {
        //used to allow scrolling in modal for mobile
        if (!this.pausePreventDefault) {
            evt.preventDefault();
        }

    }

    fullScreenChange() {
        if (
            document.fullscreenElement || /* Standard syntax */
            document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
            document.mozFullScreenElement ||/* Firefox syntax */
            document.msFullscreenElement /* IE/Edge syntax */
        ) {


            this.setState({
                ...this.state,
                fullScreen: true
            })
        } else {
            this.setState({
                ...this.state,
                fullScreen: false
            })
        }
    }

    resizeToFullScreen = () => {
        // const elem = this.mount.current;
        // const elem = document.getElementById('root');

        if (this.state.fullScreen) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        } else {
            if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            } else if (document.body.mozRequestFullScreen) { /* Firefox */
                document.body.mozRequestFullScreen();
            } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                document.body.webkitRequestFullscreen();
            } else if (document.body.msRequestFullscreen) { /* IE/Edge */
                document.body.msRequestFullscreen();
            }
        }
        this.setState({
            ...this.state,
            fullScreen: !this.state.fullScreen
        })

    }

    setJoystickUpdateLoop(call) {
        this.joystickUpdateLoop = call;

    }

    delegateCloseNavItem = (evt) => {
        this.setState({
                ...this.state,
                closeNavItem: true

            }
        )
    }

    setCloseMenuToFalse = () => {
        this.setState({
                ...this.state,
                closeNavItem: false
            }
        )
    }

    onClickVR = (evt) => {

        //alert("vr was clicked");

        this.setState(
            {
                ...this.state,
                closeNavItem: true,
                openMenu: false
            }
        )
    }

    onClickFullScreen = (evt) => {

        this.resizeToFullScreen();

        this.setState(
            {
                ...this.state,
                closeNavItem: true,
                openMenu: false
            }
        )
    }

    onClickQuestionMark = (evt) => {
        this.pausePreventDefault = true;
        this.setState(
            {
                ...this.state,
                closeNavItem: true,
                openMenu: false,
                showHelp: true
            }
        )
    }

    onClickZonesShortcutHandler = (evt) => {
        this.pausePreventDefault = true;
        this.setState({
            closeNavItem: true,
            openMenu: false,
            showZonesShortCutModal: true,
        })
    }

    onClickResetArrows = (evt) => {

        this.viewer.restoreCamera();
        this.setState(
            {
                ...this.state,
                closeNavItem: true,
                openMenu: false
            }
        )
    }

    onClickHamburger = (evt) => {
        this.setState(
            {
                ...this.state,
                openMenu: !this.state.openMenu
            }
        )
    }

    closeHelp = (evt) => {
        this.pausePreventDefault = false;
        this.setState(
            {
                ...this.state,
                showHelp: false
            }
        )
    }

    closeZonesShortcutHandler = (evt) => {
        this.pausePreventDefault = false;
        this.setState(
            {
                showZonesShortCutModal: false
            }
        )
    }

    onClickZonesLinkHandler = (zoneObj) => {
        console.log("index: zoneObj", zoneObj);
        this.pausePreventDefault = false;
        this.viewer.setCameraOrient({
            position:zoneObj.cameraPosition ,
            rotation:zoneObj.cameraRotation ,
        });
        this.setState(
            {
                showZonesShortCutModal: false
            }
        )
    }

    onClickHideAllControlsHandler = () => {
        this.setState({
            hideAllControls:!this.state.hideAllControls,
            closeNavItem: true,
        })
    }

    openChatWindowHandler = (chatSrc) => {
        console.log("[inde.js]; Openning Chat Window", chatSrc);
        window.open(chatSrc,'popup','width=600,height=600,scrollbars=no,resizable=no');
        return false;
    }


    showAnnotationModal = (annotationId) => {
        this.pausePreventDefault = true;
        this.annotationData = AnnotationDataController.getAnnotationDataById(annotationId);
        if (this.annotationData) {
            if(this.annotationData.chatSrc) {
                //Code for openning a chat
                console.log("[index]: showChat is set to true!!", this.annotationData.paintingId, this.annotationData.chatSrc);
                this.setState({
                    showChat: true,
                    closeNavItem: true,
                    openMenu: false
                })
                // this.openChatWindowHandler(this.annotationData.chatSrc)

            } else if (this.annotationData.hasCarouselAsParent === 'Y' && this.annotationData.socialMedia === 'N') {
                this.setState({
                    showCarouselAnnotation: true,
                    closeNavItem: true,
                    openMenu: false
                })
            } else if (this.annotationData.hasChildren === 'Y' && this.annotationData.socialMedia === 'N') {
                //Here we want to show the Gallery Annotation
                this.setState({
                    showGalleryAnnotation: true,
                    closeNavItem: true,
                    openMenu: false
                })
            } else if (this.annotationData.socialMedia === 'N') {
                if(this.annotationData.hasOnlyMediaCarousel === 'Y') {
                    // console.log("[ThreeGLTFLoader -Index] show OnlyMediaCarousel Component");
                    this.setState({
                        ...this.state,
                        showOnlyMediaCarousel: true,
                        closeNavItem: true,
                        openMenu: false

                    })
                } else
                {
                    // console.log("[ThreeGLTFLoader -Index] showAnnotationModal Component");
                    this.setState({
                        ...this.state,
                        showAnnotationModal: true,
                        closeNavItem: true,
                        openMenu: false

                    })
                }

            } else {
                this.setState({
                    ...this.state,
                    closeNavItem: true,
                    openMenu: false,
                    SocialMediaAnnotationModal: true,
                })

            }

        }
    }

    hideAnnotationModal = () => {
        this.pausePreventDefault = false;
        this.setState({
            ...this.state,
            showAnnotationModal: false,
            showOnlyMediaCarousel: false,
            SocialMediaAnnotationModal: false,
            showGalleryAnnotation: false,
            showCarouselAnnotation: false,
            showChat: false,
        })
    }

    hideChatHandler = () => {
        this.pausePreventDefault = false;
        console.log("[index, change ShowChat to false!]");
        this.setState({
            showChat: false,
        })
    }

    v21ArtspaceOnClickHandler = () => {
        window.open(V21_ARTSPACE_WEBSITE, '_blank');
    }

    render() {

        let chatElement = null;
        if(this.state.showChat && this.annotationData) {

            chatElement =  <ChatModal
                        annotationData={this.annotationData}
                        showChat={this.state.showChat}
                        chatCloseBtnHandler={this.hideChatHandler}
                    />

        }

        if (window.isMobile) {

            return (
                <div>
                    <VideosComponent/>

                    <div id="GLTFViewer" className="viewer" ref={this.mount}>

                        {this.state.showLoadingProgress ? <LoadingProgressModal progress={this.state.loadingProgress}
                                                                                showModal={this.state.showLoadingProgress}/> : null}
                        <div className="produced-by-v21artspace">
                            <a className="v21-logo" href="#" onClick={() => this.v21ArtspaceOnClickHandler()}>V21 ARTSPACE</a>
                        </div>
                        <HelpModal showHelp={this.state.showHelp} closefunc={this.closeHelp} modelType="sm"/>
                        <ZonesLinkModal show={this.state.showZonesShortCutModal} close={this.closeZonesShortcutHandler} modelType="md" zonesData={this.zonesData} onClickHandler={this.onClickZonesLinkHandler}/>
                        <AnnotationModal showAnnotationModal={this.state.showAnnotationModal}
                                         hideAnnotationModal={this.hideAnnotationModal} annotationModalSize="md"
                                         annotationData={this.annotationData}/>
                        <SocialMediaAnnotationModal showAnnotationModal={this.state.SocialMediaAnnotationModal}
                                                    hideAnnotationModal={this.hideAnnotationModal}
                                                    annotationModalSize="md" annotationData={this.annotationData}/>
                        {this.annotationData ? <GalleryAnnotation showAnnotation={this.state.showGalleryAnnotation}
                                                                  hideGalleryAnnotation={this.hideAnnotationModal}
                                                                  annotationModalSize="md"
                                                                  annotationData={this.annotationData}/> : null}
                        {this.annotationData ?
                            <CarouselAnnotationModal showAnnotation={this.state.showCarouselAnnotation}
                                                     hideCarouselAnnotation={this.hideAnnotationModal}
                                                     annotationModalSize="md"
                                                     annotationData={this.annotationData}/> : null}
                        {this.annotationData ? <OnlyMediaCarousel
                                annotationData={this.annotationData}
                                showMediaCarousel={this.state.showOnlyMediaCarousel}
                                mediaCarouselCloseBtnHandler={this.hideAnnotationModal}
                                annotationModalSize="md"
                            />
                            : null}

                        {chatElement}

                        {this.state.showLoadingProgress ? null :
                            <div>
                                <div>

                                    <V21Navbar>

                                        <V21NavItem icon={Hamburger} tooltip_type="hamburger"
                                                    closeMenu={this.state.closeNavItem}
                                                    setCloseMenuToFalse={this.setCloseMenuToFalse}>
                                            <V21DropdownMenu isfullScreen={this.state.fullScreen}
                                                             toggleAnnotation={this.state.showAnnotation ? "toggleAnnotationHide" : "toggleAnnotationShow"}
                                                             toggleHideControlls={this.state.hideAllControls ? "unhide_all_controls" : "hide_all_controls"}
                                                             onClick={this.delegateCloseNavItem}
                                                             onClickVR={this.onClickVR}
                                                             onClickFullScreen={this.onClickFullScreen}
                                                             onClickQuestionMark={this.onClickQuestionMark}
                                                             onClickZonesLink={this.onClickZonesShortcutHandler}
                                                             displayZoneLink={this.state.displayZoneLink}
                                                             onClickToggleAnnotation={this.toggleAnnotation}
                                                             onClickResetArrows={this.onClickResetArrows}
                                                             onClickHideAllControlsHandler={this.onClickHideAllControlsHandler}/>
                                        </V21NavItem>
                                        {!this.state.hideAllControls ?
                                            <div>
                                                { this.state.displayZoneLink ?
                                                    <V21NavItem icon={forPlanIconBlack} tooltip_type="floor_plan"
                                                                onClick={this.onClickZonesShortcutHandler}/>
                                                    : null
                                                }
                                            </div>
                                            : null
                                        }
                                    </V21Navbar>
                                </div>

                            </div>
                        }
                    </div>
                    <CircleJoystick update={this.setJoystickUpdateLoop} movingEventDispatchDelay={0}
                                    hide={this.state.showLoadingProgress || this.state.hideAllControls}/>

                </div>
            )
        }
        return (
            <div>
                <VideosComponent/>
                <div id="GLTFViewer" className="viewer" ref={this.mount}>

                    {this.state.showLoadingProgress ? <LoadingProgressModal progress={this.state.loadingProgress}
                                                                            showModal={this.state.showLoadingProgress}/> : null}


                    <HelpModal showHelp={this.state.showHelp} closefunc={this.closeHelp} modelType="lg"/>
                    <ZonesLinkModal show={this.state.showZonesShortCutModal} close={this.closeZonesShortcutHandler} modelType="lg" zonesData={this.zonesData} onClickHandler={this.onClickZonesLinkHandler}/>
                    <AnnotationModal showAnnotationModal={this.state.showAnnotationModal}
                                     hideAnnotationModal={this.hideAnnotationModal} annotationModalSize="md"
                                     annotationData={this.annotationData}/>
                    <SocialMediaAnnotationModal showAnnotationModal={this.state.SocialMediaAnnotationModal}
                                                hideAnnotationModal={this.hideAnnotationModal} annotationModalSize="md"
                                                annotationData={this.annotationData}/>
                    {this.annotationData ? <GalleryAnnotation showAnnotation={this.state.showGalleryAnnotation}
                                                              hideGalleryAnnotation={this.hideAnnotationModal}
                                                              annotationModalSize="md"
                                                              annotationData={this.annotationData}/> : null}
                    {this.annotationData ? <CarouselAnnotationModal showAnnotation={this.state.showCarouselAnnotation}
                                                                    hideCarouselAnnotation={this.hideAnnotationModal}
                                                                    annotationModalSize="md"
                                                                    annotationData={this.annotationData}/> : null}
                    {this.annotationData ? <OnlyMediaCarousel
                        annotationData={this.annotationData}
                        showMediaCarousel={this.state.showOnlyMediaCarousel}
                        mediaCarouselCloseBtnHandler={this.hideAnnotationModal}
                        annotationModalSize="md"/> : null}


                    {chatElement}


                    {!this.state.hideAllControls ? <div>
                            {this.state.showLoadingProgress ? null :
                                <div>
                                    <V21Navbar>
                                        <V21NavItem icon={QuestionMark} tooltip_type="help" onClick={this.onClickQuestionMark}/>
                                        { this.state.displayZoneLink ?
                                            <V21NavItem icon={forPlanIconBlack} tooltip_type="floor_plan"
                                                        onClick={this.onClickZonesShortcutHandler}/> : null
                                        }
                                        <V21NavItem icon={ToggleAnnotation}
                                                    tooltip_type={this.state.showAnnotation ? "toggleAnnotationHide" : "toggleAnnotationShow"}
                                                    onClick={this.toggleAnnotation}/>
                                        <V21NavItem icon={HideAllControls} tooltip_type="hide_all_controls"
                                                    onClick={this.onClickHideAllControlsHandler}/>
                                    </V21Navbar>
                                    <V21Navbar alignRightLeft="left">
                                        <V21NavItem
                                            icon={this.state.fullScreen ? CloseFullScreen : FullScreen}
                                            tooltip_type={this.state.fullScreen ? "wscreen" : "fullscreen"}
                                            onClick={this.onClickFullScreen}/>
                                        <V21NavItem icon={ResetArrows} tooltip_type="resetview"
                                                    onClick={this.onClickResetArrows}/>
                                    </V21Navbar>
                                </div>
                            }
                        </div> :
                        <div>
                            <V21Navbar>

                                <V21NavItem icon={UnHideEyeBlack} tooltip_type="unhide_all_controls"
                                            onClick={this.onClickHideAllControlsHandler}/>
                            </V21Navbar>
                        </div>}
                    <CircleJoystick update={this.setJoystickUpdateLoop} movingEventDispatchDelay={0}
                                    hide={this.state.showLoadingProgress || this.state.hideAllControls}/>
                    <div className="produced-by-v21artspace">
                        <a className="v21-logo" href="#" onClick={() => this.v21ArtspaceOnClickHandler()}>V21 ARTSPACE</a>
                    </div>
                </div>


            </div>
        )
    }
}

export default ThreeGLTFLoader;
