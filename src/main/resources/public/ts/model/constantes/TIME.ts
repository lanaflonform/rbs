export var TIME_CONFIG = { // 5min slots from 7h00 to 20h00, default 8h00
    interval: 5, // in minutes
    start_hour: 0,
    end_hour: 23,
    default_hour: 8
};

export var PERIODS = {
    periodicity: [1, 2, 3, 4], // weeks
    days: [
        1, // monday
        2, // tuesday
        3, // wednesday
        4, // thursday
        5, // friday
        6, // saturday
        0 // sunday
    ],
    occurrences: [] // loaded by function
};

export var PERIODS_CONFIG = {
    occurrences: {
        start: 1,
        end: 52,
        interval: 1
    }
};

export var BD_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:SSS';