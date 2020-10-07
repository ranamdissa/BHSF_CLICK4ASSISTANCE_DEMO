export const JOYSTICK_CIRCLE = 'JOYSTICK_CIRCLE';
export const JOYSTICK_THUMB = 'JOYSTICK_THUMB';
export const THUMB_COLOR_NORMAL = 'rgba(255, 255, 255, 0.75)';
export const THUMB_COLOR_SHIFT = 'rgba(254, 194, 46, 0.85)';
export const THUMB_COLOR_ALT = 'rgba(93, 93, 93, 0.85)';
export const CIRCLE_COLOR_NORMAL = 'rgba( 0, 0, 0, .2)';
export const CIRCLE_BORDER_NORMAL = 'rgba( 0, 0, 0, 0.15) solid medium';

export const MAX_TOUCH_KEYS_USED = 3;
export const JOYSTICK_SPEED = 'ontouchstart' in window ? 2.5 : 5;
export const JOYSTICK_ROTATION_SPEED = 2.5*0.25;
export const THUMB_MOVE_TYPE = {
    free: 0,
    border: 1,
    cross: 2,
    cross2: 3
};
export const THUMB_CROSS_ORIENTATION = {
    horiz: 0,
    vert: 1,
    none: 3
};

export const THUMB_CROSS_STATUS = {
    begin: 0,
    moving: 1,
    end: 3
};
