import React, {Component} from 'react';
import {
    JOYSTICK_CIRCLE,
    JOYSTICK_THUMB,
    THUMB_COLOR_NORMAL,
    THUMB_COLOR_SHIFT,
    THUMB_COLOR_ALT,
    MAX_TOUCH_KEYS_USED,
    THUMB_MOVE_TYPE,
    THUMB_CROSS_ORIENTATION,
    THUMB_CROSS_STATUS,
    JOYSTICK_SPEED,
    CIRCLE_COLOR_NORMAL,
    CIRCLE_BORDER_NORMAL, JOYSTICK_ROTATION_SPEED
} from '../../client-data/CircleJoystickConstants'

import NavigationCore from '../navigation/navigation-core'

class CircleJoystick extends Component {

    constructor(props) {
        super(props);
        this.circleEL = React.createRef();
        this.thumbEL = React.createRef();

        this.maxRadius = this.props.maxRadius || 40;
        this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        this.origin = null;
        this.originCopy = null;
        this.offset = null;
        this.shiftKeyPressed = false;
        this.ctrlKeyPressed = false;
        this.touchScreen = false;
        this.thumbCrossOrient = THUMB_CROSS_ORIENTATION.none;
        this.mousePos = null;
        this.firstStroke = false;
        this.isThumbMoving = false;
        this.previusPoint = {
            x: 0,
            y: 0
        };
        this.lastMoveType = null;

        this.movingEventDispatchDelay = typeof (this.props.movingEventDispatchDelay) === 'undefined' ? 0 : this.props.movingEventDispatchDelay;

        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.forwardCamera = 0;
        this.panCameraX = 0;
        this.panCameraUp = 0;

        this.isLocked = false;


        this.onMouseMoveCircle = this.onMouseMoveCircle.bind(this);
        this.onMouseUpCircle = this.onMouseUpCircle.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
        this.onTouchStartThumb = this.onTouchStartThumb.bind(this);
        this.move = this.move.bind(this);
        this.update = this.update.bind(this);
        this.resetMouseThumb = this.resetMouseThumb.bind(this);

        if (this.props.update) {
            this.props.update(this.update);
        }

    }

    componentDidMount() {
        this.origin = {
            left: this.thumbEL.current.offsetLeft,
            top: this.thumbEL.current.offsetTop
        };
        this.originCopy = {...this.origin};

        //console.log("origin=", this.origin);

        if ('ontouchstart' in window) {
            this.touchScreen = true;
            //window.addEventListener('touchmove', this.windowTouchMove, {passive: false});
           // document.addEventListener('touchmove', this.windowTouchMove, {passive: false});
        }
        document.onkeydown = this.onKeyDownHandler;
        document.onkeyup = this.onKeyUpHandler;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        //need to update (recalculate) the origin when 'hide' property changes
        this.origin = {
            left: this.thumbEL.current.offsetLeft,
            top: this.thumbEL.current.offsetTop
        };
        this.originCopy = {...this.origin};
    }


    componentWillUnmount() {
        window.removeEventListener('touchmove', this.windowTouchMove);
        document.onkeydown = null;
        document.onkeyup = null;
    }

    //disable zoom, pinch, ...
    windowTouchMove(evt) {
        //todo: if annotation is active i need to not execute preventdefault because is prevent scrolling annotation text
       evt.preventDefault();
        //return false;
    }

    onKeyDownHandler(evt) {

        if (this.isThumbMoving) return;

        if (evt.shiftKey) {
            this.shiftKeyPressed = true;
            this.ctrlKeyPressed = false;
            this.thumbEL.current.style.backgroundColor = THUMB_COLOR_SHIFT;
            //this.thumbEL.current.style.top = `${this.origin.top - this.maxRadius}px`;
            //this.thumbEL.current.style.left = `${this.origin.left}px`;
        } else if (evt.altKey) {

            this.shiftKeyPressed = false;
            this.ctrlKeyPressed = true;
            this.thumbEL.current.style.backgroundColor = THUMB_COLOR_ALT;
        }
    }

    onKeyUpHandler(evt) {

        if (evt.keyCode === 16 || evt.keyCode === 18) {
            this.shiftKeyPressed = false;
            this.ctrlKeyPressed = false;
            this.thumbEL.current.style.backgroundColor = THUMB_COLOR_NORMAL;
            this.resetMouseThumb();
        }
    }

    onMouseDownThumb(evt) {

        // this.offset = this.getMousePosition(evt);
        this.onThumbSelectionStart(evt);
        document.onmousemove = this.onMouseMoveCircle;
        document.onmouseup = this.onMouseUpCircle;
        /*this.mousePos = null;
        this.firstStroke = true;*/

    }

    onThumbSelectionStart(evt) {

        this.isLocked = true;
        this.offset = this.getMousePosition(evt);
        this.mousePos = null;
        this.firstStroke = true;
        this.thumbCrossOrient = THUMB_CROSS_ORIENTATION.none;

        let moveType = this.moveType();
        if (moveType === THUMB_MOVE_TYPE.border) {
            this.previusPoint = {
                x: -this.maxRadius,
                y: 0
            }
        } else {
            this.previusPoint = {
                x: 0,
                y: 0
            }
        }
        this.lastMoveType = moveType;
        this.movingEventDispatchDelayCounter = 0;
    }


    emulateTouchShiftKey(evt, forceNormalMode = false) {

        if (!forceNormalMode && this.getTouchID(evt)) {
            if (evt.touches && evt.touches.length === 2) {

                this.ctrlKeyPressed = false;
                this.shiftKeyPressed = true;
                this.thumbEL.current.style.backgroundColor = THUMB_COLOR_SHIFT;
                // this.thumbEL.current.style.top = `${this.origin.top - this.maxRadius}px`;
                //this.thumbEL.current.style.left = `${this.origin.left}px`;
                return;

            } else if (evt.touches && evt.touches.length === 3) {

                this.ctrlKeyPressed = true;
                this.shiftKeyPressed = false;
                this.thumbEL.current.style.backgroundColor = THUMB_COLOR_ALT;
                return;

            }
        }

        this.ctrlKeyPressed = false;
        this.shiftKeyPressed = false;
        this.thumbEL.current.style.backgroundColor = THUMB_COLOR_NORMAL;

    }

    getTouchID(evt) {

        let identifier = '';

        if (evt.touches && evt.touches.length) {
            for (let index = 0; index < evt.touches.length; index++) {
                if (index === MAX_TOUCH_KEYS_USED) {
                    break;
                }
                identifier = evt.touches[index].target.id === JOYSTICK_THUMB ? evt.touches[index].identifier : identifier;
            }
        }
        return identifier;
    }

    onTouchStartThumb(evt) {


        if (this.touchScreen) {
            this.emulateTouchShiftKey(evt);
            this.onThumbSelectionStart(evt);
            document.documentElement.style.overflow = 'hidden';
            document.ontouchmove = this.onMouseMoveCircle;
            document.ontouchend = this.onMouseUpCircle;
            this.touchID = this.getTouchID(evt);
            evt.preventDefault();
            return false;

        }

    }

    onMouseMoveCircle(evt) {
        evt.preventDefault();
        if (this.movingEventDispatchDelayCounter !== 0) {

            if (this.movingEventDispatchDelayCounter > this.movingEventDispatchDelay) {
                this.movingEventDispatchDelayCounter = 0;
            } else {
                this.movingEventDispatchDelayCounter++;
                return;
            }

        }
        this.movingEventDispatchDelayCounter++;

        if (evt.targetTouches && this.touchID !== evt.targetTouches[0].identifier) {
            return;
        }

        this.isThumbMoving = true;
        this.mousePos = this.getMousePosition(evt);
        return false;
    }

    onMouseUpCircle(evt) {

        this.resetMouseThumb();
        if (this.touchScreen) {
            this.emulateTouchShiftKey(evt, true);

            document.ontouchmove = null;
            document.ontouchend = null;
        }
    }

    resetMouseThumb() {

        this.mousePos = null;

        document.onmousemove = null;
        document.onmouseup = null;

        this.isThumbMoving = false;

        this.thumbEL.current.style.top = `${this.origin.top}px`;
        this.thumbEL.current.style.left = `${this.origin.left}px`;

        if (this.lastMoveType === THUMB_MOVE_TYPE.free) {
            this.dispatchEventEnd(this.createFreeTypeEventEnd());
        } else if (this.lastMoveType === THUMB_MOVE_TYPE.cross || this.lastMoveType === THUMB_MOVE_TYPE.cross2) {
            this.dispatchEventEnd(this.createCrossTypeEventEnd(this.lastMoveType, this.thumbCrossOrient));
        }
        this.isLocked = false;

    }

    moveType() {

        if (this.shiftKeyPressed) return THUMB_MOVE_TYPE.cross2;
        if (this.ctrlKeyPressed) return THUMB_MOVE_TYPE.cross;
        return THUMB_MOVE_TYPE.free;
    }

    move() {

        if (!this.mousePos) return;

        const moveType = this.moveType();

        // calculate the new cursor position:
        let left = this.mousePos.x - this.offset.x;
        let top = this.mousePos.y - this.offset.y;

        if (moveType === THUMB_MOVE_TYPE.free) {
            const sqMag = left * left + top * top;
            if (sqMag > this.maxRadiusSquared) {
                //Only use sqrt if essential
                const magnitude = Math.sqrt(sqMag);
                left /= magnitude;
                top /= magnitude;
                left *= this.maxRadius;
                top *= this.maxRadius;
            }
        } else if (moveType === THUMB_MOVE_TYPE.border) {

            top -= 40;  //the pivot is the -maxradius,0
            const sqMag = left * left + top * top;
            if (this.firstStroke) {
                this.firstStroke = false;
                top = -this.maxRadius;
                left = 0;
            } else {
                const modulus = Math.sqrt(sqMag);
                if (modulus === 0) {
                    top = -this.maxRadius;
                    left = 0;
                } else {
                    left = left * this.maxRadius / modulus;
                    top = top * this.maxRadius / modulus;
                }
            }
        } else {

            if (this.thumbCrossOrient === THUMB_CROSS_ORIENTATION.none) {
                if (Math.abs(top) > 10 || Math.abs(left) > 10) {
                    // if ((Math.abs(top)) >= Math.abs(left)) {
                    if ((top > left && top > -left) || (top < left && top < -left)) {
                        this.thumbCrossOrient = THUMB_CROSS_ORIENTATION.vert;
                    } else {
                        this.thumbCrossOrient = THUMB_CROSS_ORIENTATION.horiz;
                    }
                }
                const sqMag = left * left + top * top;
                if (sqMag > this.maxRadiusSquared) {
                    //Only use sqrt if essential
                    const magnitude = Math.sqrt(sqMag);
                    left /= magnitude;
                    top /= magnitude;
                    left *= this.maxRadius;
                    top *= this.maxRadius;
                }
            }

            if (this.thumbCrossOrient === THUMB_CROSS_ORIENTATION.vert) {

                left = 0;
                if (Math.abs(top) > this.maxRadius) {
                    top = this.maxRadius * Math.sign(top)

                }
            } else if (this.thumbCrossOrient === THUMB_CROSS_ORIENTATION.horiz) {
                top = 0;
                if (Math.abs(left) > this.maxRadius) {
                    left = this.maxRadius * Math.sign(left);

                }
            }

        }

        const clientHeight = this.thumbEL.current.clientHeight / 2;
        const clientWidth = this.thumbEL.current.clientWidth / 2;


        // set the element's new position:
        const styleTop = `${top + clientHeight}px`;
        const styleLeft = `${left + clientWidth}px`;

        this.thumbEL.current.style.top = styleTop;
        this.thumbEL.current.style.left = styleLeft;

        this.mousePos = null;

        if (moveType === THUMB_MOVE_TYPE.free) {
            this.dispatchEventMoving(this.createFreeTypeEventMoving(left, -top, this.previusPoint.x, -this.previusPoint.y));
        } else if ((moveType === THUMB_MOVE_TYPE.cross || moveType === THUMB_MOVE_TYPE.cross2) && (this.thumbCrossOrient !== THUMB_CROSS_ORIENTATION.none)) {
            this.dispatchEventMoving(this.createCrossTypeEventMoving(moveType, left, -top, this.previusPoint.x, -this.previusPoint.y, this.thumbCrossOrient));
        }

        this.previusPoint.x = left;
        this.previusPoint.y = top;

    }

    getMousePosition(evt) {
        // evt.preventDefault();
        let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
        return {x: clientX, y: clientY};
    }


    createEventTemplate() {

        return {
            eventType: THUMB_MOVE_TYPE.free,
            newXPos: 0,
            newYPos: 0,
            prevXPos: 0,
            prevYPos: 0,
            centerX: 0,
            centerY: 0,
            radius: this.maxRadius,
            status: THUMB_CROSS_STATUS.begin,
            thumbCrossOrientation: THUMB_CROSS_ORIENTATION.none
        };
    }

    createFreeTypeEventMoving(nX, nY, pX, pY) {

        return {
            ...this.createEventTemplate(),
            newXPos: nX,
            newYPos: nY,
            prevXPos: pX,
            prevYPos: pY,
            status: THUMB_CROSS_STATUS.moving
        }
    }

    createFreeTypeEventEnd() {

        return {
            ...this.createEventTemplate(),
            status: THUMB_CROSS_STATUS.end,
            prevXPos: this.previusPoint.x,
            prevYPos: this.previusPoint.y
        }
    }

    createCrossTypeEventMoving(eventType, nX, nY, pX, pY, thumbOrientation) {

        return {
            ...this.createEventTemplate(),
            newXPos: nX,
            newYPos: nY,
            prevXPos: pX,
            prevYPos: pY,
            status: THUMB_CROSS_STATUS.moving,
            eventType: eventType,
            thumbCrossOrientation: thumbOrientation

        }

    }

    createCrossTypeEventEnd(eventType, thumbOrientation) {

        return {
            ...this.createEventTemplate(),
            status: THUMB_CROSS_STATUS.end,
            prevXPos: this.previusPoint.x,
            prevYPos: this.previusPoint.y,
            eventType: eventType,
            thumbCrossOrientation: thumbOrientation
        }
    }

    dispatchEventMoving(event) {

        /* if (!this.props.eventDispatcherMoving) return;

         this.props.eventDispatcherMoving(event);*/

        this.joystickEventReceiverMoving(event);

    }


    dispatchEventEnd(event) {

        /*if (!this.props.eventDispatcherEnd) return;

        this.props.eventDispatcherEnd(event);*/

        this.joystickEventReceiverEnd(event);

    }

    joystickEventReceiverMoving(event) {
        let {eventType, newXPos, newYPos, radius, centerX, centerY, thumbCrossOrientation} = event;
        if (eventType === THUMB_MOVE_TYPE.free) {
            let deltaX = newXPos - centerX;
            let deltaY = newYPos - centerY;

            if (deltaX !== 0) {
                this.rotateCameraY = -deltaX / (radius);
            }

            if (deltaY !== 0) {
                this.forwardCamera = deltaY / (radius);
            }
        } else if (eventType === THUMB_MOVE_TYPE.cross2) {
            if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.vert) {
                let deltaY = newYPos - centerY;
                if (deltaY !== 0) {
                    this.rotateCameraX = deltaY / (radius);
                }
            } else if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.horiz) {
                let deltaX = newXPos - centerX;
                if (deltaX !== 0) {
                    this.panCameraX = deltaX / (radius);
                }
            }
        } else if (eventType === THUMB_MOVE_TYPE.cross) {
            if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.vert) {
                let deltaY = newYPos - centerY;
                if (deltaY !== 0) {
                    this.panCameraUp = deltaY / (radius);
                }
            }
        }


    }

    joystickEventReceiverEnd(event) {
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.forwardCamera = 0;
        this.panCameraX = 0;
        this.panCameraUp = 0;
    }

    update(camera, deltaTime,colliderContainer) {
        // requestAnimationFrame(this.messageLoop);
        this.move();
        NavigationCore.rotateCameraXY2(camera, this.rotateCameraX * deltaTime, this.rotateCameraY * deltaTime * JOYSTICK_ROTATION_SPEED);
        NavigationCore.moveForward2(camera, this.forwardCamera * deltaTime * JOYSTICK_SPEED,colliderContainer);
        NavigationCore.moveRight2(camera, this.panCameraX * deltaTime * JOYSTICK_SPEED,colliderContainer);
        NavigationCore.moveUp2(camera, this.panCameraUp * deltaTime * JOYSTICK_SPEED,colliderContainer);

        return this.isLocked;

    }

    render() {

        const hide = this.props.hide && true;
        const display = hide ? 'none' : 'block';
        const circleStyle = {
            position: 'absolute',
            bottom: '35px',
            width: '80px',
            height: '80px',
            // border: '#444000 solid medium',
            // border: 'rgba(68, 64, 0, .3) solid medium',
            //moved the border because it shifts the thum to the bottom due to collision with Bootstrap
            // border: CIRCLE_BORDER_NORMAL,
            // overflow: 'hidden',
            backgroundColor: CIRCLE_COLOR_NORMAL,
            borderRadius: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            userSelect: 'none',
            display: display,
            zIndex:100

        };

        const thumbStyle = {

            position: 'absolute',
            left: '20px',
            top: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: THUMB_COLOR_NORMAL,
            // backgroundColor: '#ff0000',
            cursor: 'pointer',
            borderRadius: '50%',
            userSelect: 'none',
            outline: '0',
            display:display,
            zIndex:100
        }

        const htmlStr = (
            <div id={JOYSTICK_CIRCLE} style={circleStyle} ref={this.circleEL}>
                <div id={JOYSTICK_THUMB} style={thumbStyle} ref={this.thumbEL} onMouseDown={evt => {
                    this.onMouseDownThumb(evt)
                }} onTouchStart={evt => this.onTouchStartThumb(evt)}>
                </div>
            </div>
        );


        return (
            htmlStr
        );

    }
}

export default CircleJoystick;

