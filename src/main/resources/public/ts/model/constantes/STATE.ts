export var STATE_CREATED = 1;
export var STATE_VALIDATED = 2;
export var STATE_REFUSED = 3;
export var STATE_SUSPENDED = 4;
export var STATE_PARTIAL = 9; //// this state is used only in front-end for periodic bookings, it is not saved in database.
export var DISPLAY_BOOKING_MANAGE = {
    state: 0,
    STATE_RESOURCE: 0,
    STATE_BOOKING: 1,
    STATE_PERIODIC: 2,
};