export var TIME_CONFIG = { // 5min slots from 7h00 to 20h00, default 8h00
    interval: 5, // in minutes
    start_hour: 0,
    end_hour: 23,
    default_hour: 8
};

export var PERIODS = {
    periodicities: [1, 2, 3, 4], // weeks
    days: [
        1, // monday
        2, // tuesday
        3, // wednesday
        4, // thursday
        5, // friday
        6, // saturday
        0 // sunday
    ],
    occurrences: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
};

export var PERIODS_CONFIG = {
    occurrences: {
        start: 1,
        end: 52,
        interval: 1
    }
};

export var BD_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:SSS';