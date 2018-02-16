import { model, _, Rights } from 'entcore';
import { Mix, Selection, Selectable } from 'entcore-toolkit';
import http from 'axios';

import { Bookings } from './index';

export class Resource implements Selectable{
    selected: boolean;

    id: number;
    was_available: boolean;
    is_available: boolean;
    type: any;
    type_id: any;
    name: string;
    periodic_booking: any;
    min_delay: any;
    max_delay: any;
    description: string;
    bookings: Bookings;
    color: any;
    created: any;
    icon: any;
    modified: any;
    owner: string;
    shared: any;
    hasMinDelay: boolean;
    hasMaxDelay: boolean;
    validation: boolean;
    rights: any;

    constructor(data? : Resource) {
        this.bookings = new Bookings();
        this.rights = new Rights(this);
        // this.rights.fromBehaviours(); TODO see other TODO
        if (data) {
            Mix.extend(this, data);
        }
        model.bookings.sync();
        // this.syncBookings(); TODO
    };

    get myRights() {
        return this.rights.myRights;
    }

    save  (cb, cbe) {
        if (this.id) {
            this.update(cb, cbe);
        }
        else {
            this.create(cb, cbe);
        }
    };

    update  (cb, cbe) {
        let resource = this;
        let originalTypeId = this.type_id;
        this.type_id = this.type.id;

        http.put('/rbs/resource/' + this.id, this)
            .then(function () {
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, resource, 'update'));
                }
            });
    };

    create  (cb, cbe) {
        let resource = this;
        this.was_available = undefined;

        http.post('/rbs/type/' + this.type.id + '/resource', this)
            .then(function (r) {
                // Update collections
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, resource, 'create'));
                }
            });
    };

    delete  (cb, cbe) {
        let resource = this;

        http.delete('/rbs/resource/' + this.id)
            .then(function () {
                let resourceType = resource.type;
                let index_resource = resourceType.resources.all.indexOf(resource);
                if (index_resource !== -1) {
                    resourceType.resources.all.splice(index_resource, 1);
                }
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, resource, 'delete'));
                }
            });
    };

    toJSON  () {
        let json: any = {
            name: this.name,
            periodic_booking: this.periodic_booking,
            is_available: this.is_available,
            type_id: this.type_id,
            min_delay: (this.hasMinDelay) ? this.min_delay : undefined,
            max_delay: (this.hasMaxDelay) ? this.max_delay : undefined,
            color: this.color,
            validation: this.validation
        };
        if (this.was_available !== undefined) {
            json.was_available = this.was_available;
        }
        if (_.isString(this.description)) {
            json.description = this.description;
        }

        return json;
    };

    isBookable  (periodic) {
        return this.is_available === true
            && this.myRights !== undefined
            && this.myRights.contrib !== undefined
            && (!periodic || this.periodic_booking);
    };

    syncBookings  (cb?) {
        this.bookings.all = _.where(model.bookings.all, {resource_id: this.id});

        _.forEach(this.bookings.all, (booking) => {
            booking.resource = this;
        });
        let resourceIndex = {};
        resourceIndex[this.id] = this;
        let bookingIndex = model.parseBookingsAndSlots(this.bookings.all, resourceIndex);
        if (typeof cb === 'function') {
            cb();
        }
    };
}

export class Resources extends Selection<Resource> {
    all: Resource[];

    constructor() {
        super([]);
    }

    filterAvailable  (periodic) {
        return this.filter(function (resource) {
            return resource.isBookable(periodic);
        });
    };

    collapseAll  () {
        _.forEach(this.all, function (resource) {
            if (resource.expanded === true) {
                resource.expanded = undefined;
            }
        });
    };
}