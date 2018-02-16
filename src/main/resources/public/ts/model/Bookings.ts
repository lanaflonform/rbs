import { model, _ } from 'entcore';
import { Selection, Eventer } from 'entcore-toolkit';
import http from 'axios';

import { Booking } from './index';

export class Bookings extends Selection<Booking>{
    all: Booking[];
    eventer: Eventer;
    filtered: any;
    _selectionResources: any;
    startPagingDate: any;
    endPagingDate: any;
    filters: any = {
        mine: undefined,
        unprocessed: undefined,
        booking: undefined,
        dates: undefined,
        startMoment: undefined,
        endMoment: undefined
    };

    constructor() {
        super([]);
        this.eventer = new Eventer();
    };

    async sync (callback, startDate, endDate) {
        let newArr = [];
        if (startDate) {
            http.get('/rbs/bookings/all/' + startDate.format('YYYY-MM-DD') +
                '/' + endDate.format('YYYY-MM-DD'))
                .then((bookings) => {
                    _.forEach(bookings.data, function (booking) {
                        newArr.push(new Booking(booking));
                    });
                    this.all = newArr;

                    if (typeof callback === 'function') {
                        callback();
                    }
                    this.eventer.trigger('sync');
                });
        } else {
            http.get('/rbs/bookings/all/' + model.bookings.startPagingDate.format('YYYY-MM-DD') +
                '/' + model.bookings.endPagingDate.format('YYYY-MM-DD'))
                .then((bookings) => {
                    _.forEach(bookings.data, function (booking) {
                        newArr.push(new Booking(booking));
                    });
                    this.all = newArr;
                    if (typeof callback === 'function') {
                        callback();
                    }
                    this.eventer.trigger('sync');
                });
        }
    };

    async syncForShowList  (callback) {
        http.get('/rbs/bookings/all')
            .then((bookings) => {
                let newArr = [];
                _.forEach(bookings.data, function (booking) {
                    newArr.push(new Booking(booking));
                });
                this.all = newArr;
                if (typeof callback === 'function') {
                    callback();
                }
                this.eventer.trigger('sync');
            });
    };

    selectionForProcess  () {
        return _.filter(this.selected, function (booking) {
            return booking.isNotPeriodicRoot();
        });
    };

    selectionForDelete  () {
        return _.filter(this.selected, function (booking) {
            return booking.isBooking();
        });
    };

    selectAllBookings  () {
        _.forEach(this.all, function (booking) {
            if (booking.isBooking()) {
                booking.selected = true;
            }
            if (booking.expanded === true) {
                booking.selectAllSlots();
            }
        });
    };

    pushAll  (datas, trigger) {
        if (datas) {
            this.all = _.union(this.all, datas);
            if (trigger) {
                this.eventer.trigger('sync');
            }
            this.applyFilters();
        }
    };

    pullAll  (datas, trigger) {
        if (datas) {
            this.all = _.difference(this.all, datas);
            if (trigger) {
                this.eventer.trigger('sync');
            }
        }
    };

    clear  (trigger) {
        this.all = [];
        if (trigger) {
            this.eventer.trigger('sync');
        }
    };

    selectionResources  () {
        //returning the new array systematically breaks the watcher
        //due to the reference always being updated
        let currentResourcesSelection = _.pluck(this.selected, 'resource') || [];
        if (!this._selectionResources || this._selectionResources.length !== currentResourcesSelection.length) {
            this._selectionResources = currentResourcesSelection;
        }
        return this._selectionResources;
    };

    loadSlots  (booking, callback) {
        http.get('/rbs/bookings/full/slots/' + booking.parent_booking_id)
            .then(function (bookings) {
                //do not add data already loading with inital load
                let ids = [];
                let slots = booking.booking._slots;
                slots.forEach(function (book) {
                    ids.push(book.id);
                });

                //check status
                let setStatus = new Set();

                bookings.data.forEach(function (book) {
                    let bb = new Booking(book);
                    bb.color = booking.color;
                    bb.resource = booking.resource;
                    setStatus.add(book.status);

                    if (ids.indexOf(bb.id) === -1) {
                        model.bookings.push(bb);
                        slots.push(bb);
                    }
                });

                booking.booking.status = (setStatus.size === 1) ? setStatus.values().next().value : model.STATE_PARTIAL;
                booking.booking._slots = slots;

                if (typeof callback === 'function') {
                    callback();
                }
            });
    };

    applyFilters  () {
        if (this.filters.booking === true) {
            if (this.filters.dates !== undefined) {
                if (this.filters.mine === true) {
                    if (this.filters.unprocessed === true) {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && booking.owner === model.me.userId
                                && (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL)
                                && ((booking.is_periodic !== true
                                    && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                    && booking.endMoment.isAfter(model.bookings.filters.startMoment))
                                    || (booking.is_periodic === true
                                        && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                        && (_.last(booking._slots)).endMoment.isAfter(model.bookings.filters.startMoment)));
                        });
                    }
                    else {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && booking.owner === model.me.userId
                                && ((booking.is_periodic !== true
                                    && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                    && booking.endMoment.isAfter(model.bookings.filters.startMoment))
                                    || (booking.is_periodic === true
                                        && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                        && (_.last(booking._slots)).endMoment.isAfter(model.bookings.filters.startMoment)));
                        });
                    }
                }
                else {
                    if (this.filters.unprocessed === true) {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL)
                                && ((booking.is_periodic !== true
                                    && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                    && booking.endMoment.isAfter(model.bookings.filters.startMoment))
                                    || (booking.is_periodic === true
                                        && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                        && (_.last(booking._slots)).endMoment.isAfter(model.bookings.filters.startMoment)));
                        });
                    }
                    else {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && ((booking.is_periodic !== true
                                    && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                    && booking.endMoment.isAfter(model.bookings.filters.startMoment))
                                    || (booking.is_periodic === true
                                        && booking.startMoment.isBefore(model.bookings.filters.endMoment)
                                        && (_.last(booking._slots)).endMoment.isAfter(model.bookings.filters.startMoment)));
                        });
                    }
                }
            }
            else {
                if (this.filters.mine === true) {
                    if (this.filters.unprocessed === true) {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && booking.owner === model.me.userId
                                && (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL);
                        });
                    }
                    else {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && booking.owner === model.me.userId;
                        });
                    }
                }
                else {
                    if (this.filters.unprocessed === true) {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected
                                && (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL);
                        });
                    }
                    else {
                        this.filtered = _.filter(this.all, function (booking) {
                            return booking.isBooking()
                                && booking.resource
                                && booking.resource.selected;
                        });
                    }
                }
            }
        }
        else {
            if (this.filters.mine === true) {
                if (this.filters.unprocessed === true) {
                    this.filtered = _.filter(this.all, function (booking) {
                        return booking.owner === model.me.userId
                            && booking.resource
                            && booking.resource.selected
                            && (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL);
                    });
                }
                else {
                    this.filtered = _.filter(this.all, function (booking) {
                        return booking.owner === model.me.userId
                            && booking.resource
                            && booking.resource.selected;
                    });
                }
            }
            else {
                if (this.filters.unprocessed === true) {
                    this.filtered = _.filter(this.all, function (booking) {
                        return (booking.status === model.STATE_CREATED || booking.status === model.STATE_PARTIAL)
                            && booking.resource
                            && booking.resource.selected;
                    });
                }
                else {
                    this.filtered = _.filter(this.all, function (booking) {
                        return booking.resource && booking.resource.selected;
                    });
                }
            }
        }
        model.eventer.trigger('change');
    };
}