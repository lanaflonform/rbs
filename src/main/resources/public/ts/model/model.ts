import {_, angular, Behaviours, calendar, Collection, loader, model, Model, moment} from 'entcore';
import { Eventer } from 'entcore-toolkit';

import http from 'axios';

import {Booking, Bookings, ResourceTypes, SelectionHolder} from './index';
import {safeApply} from "../functions/safeApply";

export const buildModel = async function () {
//  cyan', 'green', 'orange', 'pink', 'purple', 'grey'
    model.colors = ["#4bafd5", "#46bfaf", "#FF8500", "#b930a2", "#763294"];
    model.STATE_CREATED = 1;
    model.STATE_VALIDATED = 2;
    model.STATE_REFUSED = 3;
    model.STATE_SUSPENDED = 4;
    model.STATE_PARTIAL = 9; // this state is used only in front-end for periodic bookings, it is not saved in database.
    model.LAST_DEFAULT_COLOR = "#4bafd5";
    model.DETACHED_STRUCTURE = {
        id: 'DETACHED',
        name: 'rbs.structure.detached'
    };


    model.timeConfig = { // 5min slots from 7h00 to 20h00, default 8h00
        interval: 5, // in minutes
        start_hour: 0,
        end_hour: 23,
        default_hour: 8
    };

    model.periods = {
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
        occurrences: [] // loaded by function
    };

    model.periodsConfig = {
        occurrences: {
            start: 1,
            end: 52,
            interval: 1
        }
    };

    let returnData = function (hook, params) { //TODO params = [data] is it good ?
        if (typeof hook === 'function')
            hook.apply(this, params)
    };

    model.me.workflow.load(['rbs']);
    Model.prototype.inherits(Booking, calendar.ScheduleItem);

    this.eventer = new Eventer();
    this.bookings = new Bookings();
    this.resourceTypes = new ResourceTypes();
    this.recordedSelections = new SelectionHolder();

    // Will auto-select all resources and "Mine" bookings filter by default
    //model.bookings.filters.mine = true;
    //model.recordedSelections.allResources = true;
    //model.recordedSelections.mine = true;

    // fixme why to do that  Will auto-select first resourceType resources and no filter by default
    //model.recordedSelections.firstResourceType = true;
    model.recordedSelections.allResources = true;

    model.bookings.filters.dates = true;
    //Paging start date
    model.bookings.startPagingDate = moment().startOf('isoweek');
    //Paging end date
    model.bookings.endPagingDate = moment(model.bookings.startPagingDate)
        .add(1, 'week')
        .startOf('day');
    //fixme Why started with today date ....
    model.bookings.filters.startMoment = moment().startOf('day');
    //fixme Why two month ?
    model.bookings.filters.endMoment = moment().add(2, 'month').startOf('day');
    model.bookings.filters.startDate = model.bookings.filters.startMoment.toDate();
    model.bookings.filters.endDate = model.bookings.filters.endMoment.toDate();

    model.resourceTypes.sync();
    await model.bookings.sync();

    model.bookings.eventer.on('sync', (cb) => {
        _.forEach(model.resourceTypes.all, function (type) {
            _.forEach(type.resources.all, function (resource) {
                resource.syncBookings();
            });
        });
        model.bookings.applyFilters();
    });

    model.refreshRessourceType = function () {
        // Record selections
        model.recordedSelections.record();
        model.resourceTypes.sync();
    };

    model.refresh = function (isDisplayList) {
        // Record selections
        model.recordedSelections.record();
        // Clear bookings
        if (isDisplayList === true) {
            model.bookings.syncForShowList();
        } else {
            model.bookings.sync();
        }
        // Launch resync
        model.resourceTypes.sync();
    };

    model.refreshBookings = function (isDisplayList) {
        // Record selections
        model.recordedSelections.record();
        // Clear bookings
        if (isDisplayList === true) {
            model.bookings.syncForShowList();
        } else {
            model.bookings.sync();
        }
    };

    model.getNextColor = function () {
        let i = model.colors.indexOf(model.LAST_DEFAULT_COLOR);
        return model.colors[(i + 1) % model.colors.length];
    };

    model.findColor = function (index) {
        return model.colors[index % model.colors.length];
    };

    model.parseBookingsAndSlots = function (rows, resourceIndex, color) {
        // Prepare bookings and slots
        let bookingIndex = {
            bookings: {},
            slots: {}
        };

        // Process
        _.each(rows, function (row) {
            if (row.parent_booking_id === null) {
                // Is a Booking
                bookingIndex.bookings[row.id] = row;
                model.parseBooking(row, color || row.resource.type.color);
                // Calendar locking
                if (row.owner !== model.me.userId) {
                    row.locked = true;
                }
            }
            else {
                // Is a Slot
                if (bookingIndex.slots[row.parent_booking_id] === undefined) {
                    bookingIndex.slots[row.parent_booking_id] = [];
                }
                bookingIndex.slots[row.parent_booking_id].push(row);
                // Calendar locking
                row.locked = true;
            }
        });

        // Link bookings and slots
        _.each(bookingIndex.bookings, function (booking) {
            if (booking.is_periodic === true) {
                // Link
                booking._slots = bookingIndex.slots[booking.id] || [];
                // Resolve status of periodic booking
                let statusCount = _.countBy(booking._slots, function (slot) {
                    // link (here to avoid another loop)
                    slot.booking = booking;
                    slot.color = booking.color;
                    // index status
                    return slot.status;
                });
                if (booking._slots.length === statusCount[model.STATE_VALIDATED]) {
                    booking.status = model.STATE_VALIDATED;
                }
                else if (booking._slots.length === statusCount[model.STATE_REFUSED]) {
                    booking.status = model.STATE_REFUSED;
                }
                else if (booking._slots.length === statusCount[model.STATE_CREATED]) {
                    booking.status = model.STATE_CREATED;
                }
                else if (booking._slots.length === statusCount[model.STATE_SUSPENDED]) {
                    booking.status = model.STATE_SUSPENDED;
                }
                else {
                    booking.status = model.STATE_PARTIAL;
                }
            }
        });

        return bookingIndex;
    };

    model.parseBooking = function (booking, color) {
        booking.color = color;

        // periodic booking
        if (booking.is_periodic === true) {
            // parse bitmask
            booking.periodDays = model.bitMaskToDays(booking.days);
            // date if not by occurrences
            if (booking.occurrences === undefined || booking.occurrences < 1) {
                booking.periodicEndMoment = moment.utc(booking.periodic_end_date);
            }
        }
    };

    model.bitMaskToDays = function (bitMask) {
        let periodDays = [];
        let bits = [];
        if (bitMask !== undefined) {
            let bits = (bitMask + '').split("");
        }
        _.each(model.periods.days, function (day) {
            if (bits[day] === '1') {
                periodDays.push({number: day, value: true});
            }
            else {
                periodDays.push({number: day, value: false});
            }
        });
        return periodDays;
    };

    model.loadPeriods = function () {
        for (let occurrence = model.periodsConfig.occurrences.start; occurrence <= model.periodsConfig.occurrences.end; occurrence = occurrence + model.periodsConfig.occurrences.interval) {
            model.periods.occurrences.push(occurrence);
        }
    };

    model.loadStructures = function () {
        if (model.me.structures && model.me.structures.length > 0 && model.me.structureNames && model.me.structureNames.length > 0) {
            model.structures = [];
            for (let i = 0; i < model.me.structures.length; i++) {
                model.structures.push({
                    id: model.me.structures[i],
                    name: model.me.structureNames[i]
                });
            }
        }
        else {
            model.structures = [model.DETACHED_STRUCTURE];
        }
    };

    model.parseError = function (e, object, context) {
        let error: any = {};
        error.status = e.response.status;
        try {
            error.error = e.response.data;
        }
        catch (err) {
            if (error.status == 401) {
                error.error = "rbs.error.unauthorized";
            }
            else if (error.status == 404) {
                error.error = "rbs.error.notfound";
            }
            else if (e.status == 409) {
                error.error = "rbs.error.conflict";
            }
            else {
                error.error = "rbs.error.unknown";
            }
        }
        error.object = object;
        error.context = context;
        return error;
    };

    model.loadTreeState = function (cb) {
        http.get('/userbook/preference/rbs')
            .then(function (response) {
                let state = (angular.fromJson(response.data.preference) || {}).treeState;

                if (typeof cb === 'function') {
                    cb(state || []);
                }
            })
    };

    model.saveTreeState = function (state) {
        http.put('/userbook/preference/rbs', {treeState: state});
    };

    this.loadStructures();
    this.loadPeriods();
};