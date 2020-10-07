import {EVENT_SOURCE, EVENT_KEY_TYPES, EVENT_STATUS, JOYSTICK_SPEED} from '../../client-data/fps-navigation-constants'
import NavigationCore from "./navigation-core";
import * as Hammer from 'hammerjs';
// import ZingTouch from 'zingtouch-stzhang';
import {CANVAS_ID} from '../../client-data/GlobalConstants';

class FPSNavigationControl {
    constructor(elm) {

        this.elm = elm || document;

        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.update = this.update.bind(this);
        this.onPan = this.onPan.bind(this);
        this.onTap = this.onTap.bind(this);
        this.removeMouseHandlers = this.removeMouseHandlers.bind(this);
        this.restoreMouseDownHandler = this.restoreMouseDownHandler.bind(this);
        this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
        this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
        this.mouseLeave = false;

        document.addEventListener('mousedown', this.mouseDownHandler, {passive: false});
        document.addEventListener('keydown', this.keyDownHandler, {passive: false});
        document.addEventListener('keyup', this.keyUpHandler, {passive: false});
        window.addEventListener('contextmenu', function (e) {
            // do something here...
            e.preventDefault();
        }, false);

        window.addEventListener('click', function (e) {
            // do something here...
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, false);

        this.shift = false;
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.forwardCamera = 0;
        this.panCameraX = 0;
        this.panCameraUp = 0;
        this.keyForwardAccel = 0;
        this.keySideAccel = 0;
        this.canProcess = true;
        this.isTap = false;
        this.isPan = false;
        this.isMouseHandlersRemoved = false;


        this.isTouchScreen = 'ontouchstart' in window;

        if (this.isTouchScreen) {
            this.hammerManager = new Hammer.Manager(document);
            this.hammerManager.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
            this.hammerManager.on("panleft panright panup pandown", this.onPan);


        }

       /* if (this.isTouchScreen) {
            let zt = new ZingTouch.Region(this.elm);
            let longTap = new ZingTouch.Tap({
                maxDelay: 1000
            })
            zt.bind(this.elm, longTap, this.onTap, false);
        }*/

        //todo maybe will need it
        /* this.elm.addEventListener('mouseleave', this.mouseUpHandler, {passive: false});
         this.elm.addEventListener('mouseout', this.mouseDownHandler, {passive: false});*/
    }

    onTap(evt) {
        if (evt.pointerType === 'mouse') {
            return;
        }
        this.isTap = true;
        this.forwardCamera = 10;
    }

    onPan(evt) {
        if (evt.pointerType === 'mouse') {
            return;
        }

        this.isPan = true;
        if (evt.direction === 2) {
            if (evt.isFinal) {
                this.rotateCameraY = 0;
                this.rotateCameraX = 0;
            } else {
                this.rotateCameraY = (evt.velocityX || 0) * 0.5;
                //this.rotateCameraX += (evt.velocity || 0) * 0.0005;
            }
        } else if (evt.direction === 4) {
            if (evt.isFinal) {
                this.rotateCameraY = 0;
                this.rotateCameraX = 0;
            } else {
                this.rotateCameraY = (evt.velocityX || 0) * 0.5;
                //this.rotateCameraX += (evt.velocity || 0) * 0.0005;
            }
        } else if (evt.direction === 8) {
            if (evt.isFinal) {
                this.rotateCameraY = 0;
                this.rotateCameraX = 0;
            } else {
                this.rotateCameraX = (evt.velocityY || 0) * 0.5;
                //this.rotateCameraX += (evt.velocity || 0) * 0.0005;
            }
        } else if (evt.direction === 16) {
            if (evt.isFinal) {
                this.rotateCameraY = 0;
                this.rotateCameraX = 0;
            } else {
                this.rotateCameraX = (evt.velocityY || 0) * 0.5;
                //this.rotateCameraX += (evt.velocity || 0) * 0.0005;
            }
        } else {
            this.rotateCameraY = 0;
            this.rotateCameraX = 0;
        }
    }

    mouseDownHandler(evt) {
        if (this.isTouchScreen) return;
        //todo:commented the line below because added to viewer   webglCanvas.style.pointerEvents = 'none'; which will prevent the canvas from receiving mouse events (for now the css3d element will have the id CANVAS_ID)
        if (evt.target.id !== CANVAS_ID) return;
        document.addEventListener('mousemove', this.mouseMoveHandler, {passive: false});
        document.addEventListener('mouseup', this.mouseUpHandler, {passive: false});
        this.elm.addEventListener('mouseout', this.mouseLeaveHandler, {passive: false});
        this.elm.addEventListener('mouseover', this.mouseEnterHandler);
        this.mouseLeave = false;
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.panCameraUp = 0;
        this.panCameraX = 0;
        //todo - i commented the code below because was disabling the dropdown on the GUI
        //evt.preventDefault();
    }

    mouseMoveHandler(evt) {

        if (!this.canProcess) {
            this.mouseUpCleanup();
        }
        if (!(evt.which === 1 || evt.which === 3)) return;


        if (this.shift || evt.which === 3) {
            this.panCameraX -= (evt.movementX || 0) * 0.001;
            this.panCameraUp += (evt.movementY || 0) * 0.001;

        } else {
            this.rotateCameraY += (evt.movementX || 0) * 0.0005;
            this.rotateCameraX += (evt.movementY || 0) * 0.0005;
        }

    }

    mouseUpHandler(evt) {

        this.mouseUpCleanup();
    }

    mouseLeaveHandler() {
        this.mouseLeave = true;
    }

    mouseEnterHandler(evt) {
        this.mouseLeave = false;

        if (evt.buttons !== 1){
           this.mouseUpCleanup();
        }
    }

    mouseUpCleanup() {

        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.elm.removeEventListener('mouseout', this.mouseLeaveHandler);
        this.elm.removeEventListener('mouseover', this.mouseEnterHandler);
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.panCameraUp = 0;
        this.panCameraX = 0;
    }

    //Don't want mouse handlers when joystick mouse handlers are in use
    removeMouseHandlers() {
        if (!this.isMouseHandlersRemoved) {
            document.removeEventListener('mousedown', this.mouseDownHandler);
            this.mouseUpCleanup();
            this.isMouseHandlersRemoved = true;
        }
    }

    restoreMouseDownHandler() {
        if (this.isMouseHandlersRemoved) {
            this.isMouseHandlersRemoved = false;
            document.addEventListener('mousedown', this.mouseDownHandler, {passive: false});
        }
    }

    keyHandler(evt, eventStatus) {

        /*  if (evt.shiftKey) {
              this.shift = true;
              return;
          }*/
        evt.preventDefault();
        let eventType = -1;
        switch (evt.keyCode) {

            case 38: // up
            case 87: // w
                eventType = EVENT_KEY_TYPES.up;
                break;

            case 37: // left
            case 65: // a
                eventType = EVENT_KEY_TYPES.left;
                break;

            case 40: // down
            case 83: // s
                eventType = EVENT_KEY_TYPES.down;
                break;

            case 39: // right
            case 68: // d
                eventType = EVENT_KEY_TYPES.right;
                break;

            case 32: // space
                eventType = EVENT_KEY_TYPES.space;
                break;

            case 16: // shift
                this.shift = !(eventStatus === EVENT_STATUS.end);
                break;

        }

        if (eventType !== -1) {
            if (eventStatus === EVENT_STATUS.moving) {
                this.dispatchMovingEvent(this.createKeyMovingEvent(eventType));
            } else {
                this.dispatchEndEvent(this.createKeyEndEvent(eventType));
            }
        }

    }

    keyDownHandler(evt) {
        this.keyHandler(evt, EVENT_STATUS.moving);
    }


    keyUpHandler(evt) {

        this.keyHandler(evt, EVENT_STATUS.end);
    }

    createEventTemplate() {
        return {
            source: 0,
            keyType: 0,
            posX: 0,
            posY: 0,
            prevX: 0,
            prevY: 0,
            centerX: 0,
            centerY: 0,
            status: 0
        };
    }

    createKeyMovingEvent(keyType) {
        return {
            ...this.createEventTemplate(),
            keyType: keyType,
            source: EVENT_SOURCE.key,
            status: EVENT_STATUS.moving
        }
    }

    createKeyEndEvent(keyType) {
        return {
            ...this.createEventTemplate(),
            keyType: keyType,
            source: EVENT_SOURCE.key,
            status: EVENT_STATUS.end
        }
    }

    dispatchMovingEvent(keyMovingEvent) {
        let {source, keyType} = keyMovingEvent;
        if (source === EVENT_SOURCE.key) {
            if (keyType === EVENT_KEY_TYPES.up) {
                this.forwardCamera = 1.5 + this.keyForwardAccel;
                // this.keyForwardAccel += 0.1;
            } else if (keyType === EVENT_KEY_TYPES.down) {
                this.forwardCamera = -1.5 - this.keyForwardAccel;
                // this.keyForwardAccel += 0.1;
            } else if (keyType === EVENT_KEY_TYPES.left) {
                // this.panCameraX = +0.1 + this.keySideAccel;
                this.rotateCameraY = +0.2 + this.keySideAccel;
                // this.keySideAccel += 0.05;
            } else if (keyType === EVENT_KEY_TYPES.right) {
                // this.panCameraX = -0.1 - this.keySideAccel;
                this.rotateCameraY = -0.2 - this.keySideAccel;
                // this.keySideAccel += 0.05;
            }
        }

    }

    dispatchEndEvent(keyMovingEvent) {
        let {source, keyType} = keyMovingEvent;
        if (source === EVENT_SOURCE.key) {
            if (keyType === EVENT_KEY_TYPES.up || keyType === EVENT_KEY_TYPES.down) {
                this.forwardCamera = 0;
            }
            if (keyType === EVENT_KEY_TYPES.left || keyType === EVENT_KEY_TYPES.right) {
                // this.panCameraX = 0;
                this.rotateCameraY = 0;
            }
            // this.keyForwardAccel = 0;
            // this.keySideAccel = 0;
        }
    }

    update(camera, deltaTime, canProcess = true,colliderContainer) {
        this.canProcess = canProcess;
        if (!canProcess) {
            this.removeMouseHandlers();
            return;
        } else {
            this.restoreMouseDownHandler();
        }
        if (this.mouseLeave) return;
        NavigationCore.moveForward2(camera, this.forwardCamera * deltaTime,colliderContainer);
        NavigationCore.rotateCameraXY2(camera, this.rotateCameraX * deltaTime * JOYSTICK_SPEED, this.rotateCameraY * deltaTime * JOYSTICK_SPEED);
        NavigationCore.moveRight2(camera, this.panCameraX * deltaTime * JOYSTICK_SPEED,colliderContainer);
        NavigationCore.moveUp2(camera, this.panCameraUp * deltaTime * JOYSTICK_SPEED,colliderContainer);

        if (this.isTap) {
            this.isTap = false;
            this.forwardCamera = 0;

        }
        if (this.isPan) {
            this.isPan = false;
            this.rotateCameraX = 0;
            this.rotateCameraY = 0;
        }
    }
}

export default FPSNavigationControl;
