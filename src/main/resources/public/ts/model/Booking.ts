import { moment, model, _ } from 'entcore';
import { Selectable, Mix, Eventer } from 'entcore-toolkit';
import http from 'axios';

import { Resource } from './index';

export class Booking implements Selectable{
    selected: boolean;

    id: any;
    color: any;
    beginning: any;
    startMoment: any;
    endMoment: any;
    start_date: any;
    end_date: any;
    startTime: any;
    endTime: any;
    end: any;
    resource: Resource;
    refusal_reason: boolean;
    booking_reason: any;
    slots: any;
    _slots: any;
    is_periodic: boolean;
    periodicity: any;
    periodDays: any;
    occurrences: any;
    periodicEndMoment: any;
    status: any;
    parent_booking_id: any;
    eventer: Eventer;


    constructor(book?) {
        // this.resource = new Resource(); // TODO Infinite loop with New Resource() calling bookings.sync calling new Booking callin new Resource
        this.eventer = new Eventer();
        if (book) {
            Mix.extend(this, book);
            this.beginning = this.startMoment = moment.utc(book.start_date);
            this.end = this.endMoment = moment.utc(book.end_date);
        } else {
            let startDate;
            if (this.start_date) {
                let aStartDate = this.start_date.split("T");
                if (aStartDate.length === 2) {
                    startDate = moment(aStartDate[0]);
                    startDate.set('hour', aStartDate[1].split(":")[0]);
                    startDate.set('minute', aStartDate[1].split(":")[1]);
                }
            }

            if (!startDate) {
                startDate = moment();
            }

            let endDate;
            if (this.end_date) {
                let aEndDate = this.end_date.split("T");
                if (aEndDate.length === 2) {
                    endDate = moment(aEndDate[0]);
                    endDate.set('hour', aEndDate[1].split(":")[0]);
                    endDate.set('minute', aEndDate[1].split(":")[1]);
                }
            }

            if (!endDate) {
                endDate = moment();
            }

            this.beginning = this.startMoment = startDate;
            this.end = this.endMoment = endDate;
        }
    }

    save (cb, cbe) {
        if(this.id) {
            this.update(cb, cbe);
        }
        else {
            this.create(cb, cbe);
        }
    };

    retrieve (id, cb, cbe) {
        let booking = this;
        http.get('/rbs/booking/' + id)
            .then(function (response) {
                if (typeof cb === 'function') {
                    cb(response.data.start_date);
                }
            }.bind(this))
            .catch(function(e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, booking, 'retrieve'));
                }
            });
    };

    calendarUpdate (cb, cbe) {
        if (this.beginning) {
            this.slots = [{
                start_date: this.beginning.unix(),
                end_date: this.end.unix()
            }];
        }
        if(this.id) {
            this.update(function(){
                model.refresh();
            }, function(error){
                // notify
                model.refresh();
            });
        }
        else {
            this.create(function(){
                model.refresh();
            }, function(error){
                // notify
                model.refresh();
            });
        }
    };

    update (cb, cbe) {
        let url = '/rbs/resource/' + this.resource.id + '/booking/' + this.id;
        if (this.is_periodic === true) {
            url = url + '/periodic';
        }

        let booking = this;
        http.put(url, this)
            .then(function(){
                this.status = model.STATE_CREATED;
                if(typeof cb === 'function'){
                    cb();
                }
                this.eventer.trigger('change');
            }.bind(this))
            .catch(function(e){
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, booking, 'update'));
                }
            });
    };

    create (cb, cbe) {
        let url = '/rbs/resource/' + this.resource.id + '/booking';
        if (this.is_periodic === true) {
            url = url + '/periodic';
        }

        let booking = this;
        http.post(url, this)
            .then(function(b){
                Mix.extend(booking, b);

                booking.resource.bookings.push(booking);
                model.bookings.pushAll([booking]);
                if(typeof cb === 'function'){
                    cb();
                }
            })
            .catch(function(e){
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, booking, 'create'));
                }
            });
    };

    validate (cb, cbe) {
        this.status = model.STATE_VALIDATED;
        let data = {
            status: this.status
        };
        this.process(data, cb, cbe, 'validate');
    };

    refuse (cb, cbe) {
        this.status = model.STATE_REFUSED;
        let data = {
            status: this.status,
            refusal_reason: this.refusal_reason
        };
        this.process(data, cb, cbe, 'refuse');
    };

    process (data, cb, cbe, context) {
        let booking = this;
        http.put('/rbs/resource/' + this.resource.id + '/booking/' + this.id + '/process', data)
            .then(function(){
                if(typeof cb === 'function'){
                    cb();
                }
            })
            .catch(function(e){
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, booking, context));
                }
            });
    };

    delete (cb, cbe) {
        let booking = this;
        http.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/false")
            .then(function(){
                if(typeof cb === 'function'){
                    cb();
                }
            })
            .catch(function(e){
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, booking, 'delete'));
                }
            });
    };

    deletePeriodicCurrentToFuture (cb, cbe) {
        let booking = this;
        http.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/true")
            .then(function(){
                if(typeof cb === 'function'){
                    cb();
                }
            })
            .catch(function(e){
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, booking, 'delete'));
                }
            });
    };

    showSlots () {
        this.slots = this._slots;
    };

    selectAllSlots () {
        _.each(this._slots, function(slot){
            slot.selected = true;
        });
    };

    deselectAllSlots () {
        _.each(this._slots, function(slot){
            slot.selected = undefined;
        });
    };

    hideSlots () {
        this.slots = [];
        _.each(this._slots, function(slot){
            slot.selected = undefined;
        });
    };

    isSlot () {
        return this.parent_booking_id !== null;
    };

    isBooking () {
        return this.parent_booking_id === null;
    };

    isNotPeriodicRoot () {
        return this.is_periodic !== true;
    };

    isPending () {
        return this.status === model.STATE_CREATED;
    };

    isValidated () {
        return this.status === model.STATE_VALIDATED;
    };

    isRefused () {
        return this.status === model.STATE_REFUSED;
    };

    isPartial () {
        return this.status === model.STATE_PARTIAL;
    };

    isSuspended () {
        return this.status === model.STATE_SUSPENDED;
    };


    hasAtLeastOnePendingSlot () {
        return this._slots.some(function(slot) {
            return slot.isPending();
        });
    };

    hasAtLeastOneSuspendedSlot () {
        return this._slots.some(function(slot) {
            return slot.isSuspended();
        });
    };


    toJSON () {
        let json: any = {
            slots : this.slots
        };

        if (this.is_periodic === true) {
            json.periodicity = this.periodicity;
            json.days = _.pluck(_.sortBy(this.periodDays, function(day){ return day.number; }), 'value');

            if (this.occurrences !== undefined && this.occurrences > 0) {
                json.occurrences = this.occurrences;
            }
            else {
                json.periodic_end_date = this.periodicEndMoment.utc().unix();
            }
        }

        if (_.isString(this.booking_reason)) {
            json.booking_reason = this.booking_reason;
        }

        return json;
    };

}