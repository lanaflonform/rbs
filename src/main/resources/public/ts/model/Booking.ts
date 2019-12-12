import {Mix, Selectable, Selection} from "entcore-toolkit";
import {moment, _ ,  notify, model} from "entcore";
import http from "axios";
import {Resource, Resources, ResourceType, ResourceTypes, Slots, Utils} from './index';
import {BD_DATE_FORMAT} from "./constantes";

export class Booking implements Selectable {
    selected: boolean;
    id: number;
    created: string;
    days: string | null;
    periodDays;
    end_date: string;
    endDate: string;
    is_periodic: boolean;
    modified: string;
    occurrences: number | null;

    owner: any;
    owner_name: string;
    parent_booking_id: number;
    periodicity: number | null;
    refusal_reason: string | null;
    resource_id: number;
    start_date: string;
    startDate: string;
    status: number | null;
    booking_reason: string;

    resourceType?: ResourceType;

    locked: boolean = true;
    periodicEndMoment: Object;
    isMine: boolean;
    unProcessed: boolean;
    start: Object;
    end: Object;
    startMoment: Object;
    endMoment: Object;
    resource: Resource;
    slots: Slots;
    _slots: Array<Booking>;

    constructor(id?: number) {
        if (id) this.id = id;
        this.start = this.startMoment = this.start_date ? moment.utc(this.start_date).tz(moment.tz.guess()) : moment();
        this.end = this.endMoment = this.end_date ? moment.utc(this.end_date).tz(moment.tz.guess()) : moment();
        this.resource = new Resource();
        this.slots = new Slots();
    }

    async save() {
        if (this.id) {
            this.update();
        }
        else {
            this.create();
        }
    }

    async sync() {
        try {
            let {data} = await http.get('/rbs/booking/' + this.id);
            Mix.extend(this, data);
        } catch (e) {
            notify.error('rbs.errors.title.sync.booking');
        }
    };

    mapResources(resourceTypes: ResourceTypes) {
        this.resource.resourceType = _.findWhere(resourceTypes.all , {id : this.resource.type_id})
    };

    calendarUpdate() {
        if (this.start) {
            this.slots = new Slots();
        }
        if (this.id) {
            this.update()
        }
        else {
            this.create();
        }
    };

    async update() {
        try {
            let url = '/rbs/resource/' + this.resource.id + '/booking/' + this.id;
            url += this.is_periodic ? '/periodic' : '';
            let {data} = await http.put(url, this.toJSON());
            this.status = 1;
            return data;
        } catch (e) {
            notify.error('rbs.errors.title.update.booking');
        }
    };

    async create() {
        try {
            let url = '/rbs/resource/' + this.resource.id + '/booking';
            url += this.is_periodic ? '/periodic' : '';
            let {data} = await http.post(url, this.toJSON());
            Mix.extend(this, data);
        } catch (e) {
            notify.error('rbs.errors.title.create.booking');
        }
    }

    validate() {
        this.status = 2;
        this.process({
            status: this.status
        });
    };


    refuse() {
        this.status = 3;
        this.process({
            status: this.status,
            refusal_reason: this.refusal_reason
        });

    };

    async process(json) {
        try {
             await http.put('/rbs/resource/' + this.resource.id + '/booking/' + this.id + '/process', json);
        }
        catch (e) {
            notify.error('rbs.error.title.process.booking');
        }
    };

    async delete() {
        try {
            await http.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/false");
        }
        catch (e) {
            notify.error('rbs.errors.title.delete.booking');
        }
    };

    isSlot() {
        return this.parent_booking_id !== null
    };

    isPending() {
        return this.status === 1;
    };

    isValidated() {
        return this.status === 2;
    };

    isRefused() {
        return this.status === 3;
    };

    isSuspended() {
        return this.status === 4;
    };

    isPartial() {
        return this.status === 9;
    };

    isNotPeriodicRoot() {
        return this.is_periodic !== true;
    };

    isBooking() {
        return this.parent_booking_id === null;
    };

    toJSON() {
        let json = {
            slots: this.slots
        };
        if (this.is_periodic === true) {

            json['periodicity'] = this.periodicity;
            json['iana'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
            json['days'] = _.pluck(_.sortBy(this.periodDays, function (day) {
                return day.number;
            }), 'value');
            if (this.occurrences !== undefined && this.occurrences > 0) {
                json['occurrences'] = this.occurrences;
            }
            else {
                json['periodic_end_date'] = moment(this.periodicEndMoment).utc().unix();
            }
        }

        if (_.isString(this.booking_reason)) {
            json['booking_reason'] = this.booking_reason;
        }
        return json;
    }
}

export class Bookings extends Selection<Booking> {
    startPagingDate: object;
    endPagingDate: object;
    filtered: Array<Booking>;
    filters: filterBookings;
    resources: Resources;
    slots: Array<Booking>;

    constructor() {
        super([]);
        this.initDates();
        this.filters = new filterBookings();
    }

    initDates(startPagingDate?, endPagingDate?,) {
        this.startPagingDate = moment(startPagingDate).startOf('isoweek');
        this.endPagingDate = endPagingDate ? endPagingDate : moment(startPagingDate).add(1, Utils.getIncrementISOMoment()).startOf('day');
    }

    async sync(ignoreDate: boolean, resources?: Resources) {
        let url = `/rbs/bookings/all`;
        if (this.startPagingDate && this.endPagingDate && !ignoreDate)
            url += '/' + moment(this.startPagingDate).format('YYYY-MM-DD') + '/' + moment(this.endPagingDate).format('YYYY-MM-DD');
        let {data} = await http.get(url);
        this.all = Mix.castArrayAs(Booking, data);
        this.all.map((booking) => {
            booking.startMoment = moment(booking.start_date, BD_DATE_FORMAT);
            booking.endMoment = moment(booking.end_date, BD_DATE_FORMAT);
            booking.isMine = booking.owner === model.me.userId;
            booking.unProcessed = booking.status === 1 || booking.status === 9;
            if (resources) booking.resource = _.findWhere(resources.all, {id: booking.resource_id});
        });
        this.sortChildSlot();
        this.applyFilters();
    }

    sortChildSlot() {
        let child = {};
        let parent = this.all.filter(function (book) {
            if (book.parent_booking_id !== null) {
                if(!child[book.parent_booking_id]){
                    child[book.parent_booking_id] = [];
                }
                child[book.parent_booking_id].push(book);
                return false;
            }
            else {
                return true;
            }
        });
        this.sortParentSlot(child, parent);
    };

    sortParentSlot(child, parent) {
        _.each(parent, function(parent) {
            parent._slots = child[parent.id]
        });
    };

    applyFilters(isDisplayList?) {
        this.filtered = this.all;
        this.filtered = _.filter(this.all, (booking) => {
                if (this.filters.dates && this.filters.dates === true) {
                        if (this.filters.mine) {
                            return (booking.isBooking()
                                && booking.resource.selected)
                                && (
                                    (booking.is_periodic !== true && booking.startMoment.isBefore(this.filters.endDate)
                                        && booking.endMoment.isAfter(this.filters.startDate))
                                    ||
                                    (booking.is_periodic === true && booking.startMoment.isBefore(this.filters.endDate)
                                        && (_.last(booking._slots)).endMoment.isAfter(this.filters.startDate))
                                     && booking.isMine);
                        }
                        else if (this.filters.unprocessed) {
                            return (booking.isBooking()
                                && booking.resource.selected)
                                && (
                                    (booking.is_periodic !== true && booking.startMoment.isBefore(this.filters.endDate)
                                        && booking.endMoment.isAfter(this.filters.startDate))
                                    ||
                                    (booking.is_periodic === true && booking.startMoment.isBefore(this.filters.endDate)
                                        && (_.last(booking._slots)).endMoment.isAfter(this.filters.startDate))
                                     && booking.unProcessed);
                        }
                        else {
                            return (booking.isBooking()
                                && booking.resource.selected) &&
                                ((booking.is_periodic !== true && booking.startMoment.isBefore(this.filters.endDate)
                                        && booking.endMoment.isAfter(this.filters.startDate))
                                    ||
                                    (booking.is_periodic === true && booking.startMoment.isBefore(this.filters.endDate)
                                        && (_.last(booking._slots)).endMoment.isAfter(this.filters.startDate))
                                );
                        }
                } else if (this.filters.mine) {
                return (booking.isMine) && booking.resource.selected
            }
            else if (this.filters.unprocessed) {
                return (booking.unProcessed && (booking.status === 1 || booking.status === 9) && booking.resource.selected)
            }
            else if (isDisplayList) {
                return booking.isBooking() && booking.resource.selected;
            }
            else {
                return booking.resource.selected;
            }
        });
    };

    showSlots(booking) {
        booking.slots = booking._slots;
    };

    hideSlots(booking) {
        booking.slots = [];
        _.each(this.slots, function(slot) {
            slot.selected = undefined;
        });
    };

}

export class filterBookings {
    showParentBooking: boolean;
    calendar: object;
    booking: any;
    mine: any;
    unprocessed: any;
    dates: any;
    startDate: any;
    endDate: any;

    constructor() {
        this.showParentBooking = false;
        this.calendar = [{icon: "mine", filter: "isMine"}, {icon: "pending-action", filter: "unProcessed"}];
    }
}