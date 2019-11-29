import { Mix, Selectable, Selection } from "entcore-toolkit";
import { _, Behaviours, notify } from 'entcore';
import {Booking, ResourceType} from "./index";
import http from "axios";

export class Resource implements Selectable {
    id: number;
    color: string;
    description: string;
    icon: null|any ;
    is_available: boolean;
    was_available: boolean;
    max_delay: null | number;
    min_delay: null | number;
    name: string;
    periodic_booking: boolean;
    validation: boolean;
    visibility: null |boolean;
    resourceType: ResourceType;
    type: any;
    type_id: number;
    created: string|Date;
    modified: string|Date;
    owner: any;
    shared: any;
    myRights: any;
    selected: boolean;
    school_id: string;

    constructor (resource?) {

    }

    toJSON() {
        return {
            type_id: this.type_id,
            name: this.name,
            color: this.color,
            validation: this.validation,
            is_available: this.is_available,
            was_available: this.was_available,
            periodic_booking: this.periodic_booking,
            description: this.description
        };
    }

    save() {
        if(this.id) {
            this.update();
        }
        else {
            this.create();
        }
    };

    async create() {
        try {
            let { data } = await http.post('/rbs/type/' + this.type.id + '/resource', this.toJSON());
            this.id =  data.id;
        } catch (e) {
            notify.error('Function create resource failed');
        }
    }

    async update() {
        try {
            await http.put('/rbs/resource/' + this.id, this.toJSON());
        } catch (e) {
            notify.error('Function update resource failed');
        }
    }

    async delete() {
        try {
            return await http.delete('/rbs/resource/' + this.id);
        }
        catch (e) {
            notify.error('rbs.errors.title.delete.resource');
        }
    };

    setPreference(preferenceResource) {
        let state = _.findWhere(preferenceResource, {id : this.id});
        if(!state || state.length == 0) return;
        this.selected = !!state.selected;
        return state;
    }

    isBookable(booking, periodic) {
        return this.is_available === true
            && this.myRights !== undefined
            && booking.resourceType.myRights.contrib !== undefined
            && (!periodic || this.periodic_booking);
    };
}

export class Resources extends Selection<Resource> {

    constructor() {
        super([]);
    }

    async sync() {
        let {data} = await http.get('/rbs/resources');
        this.all = Mix.castArrayAs(Resource, data);
        this.all.map((resource) => {
            Behaviours.applicationsBehaviours.rbs.resource(resource)
        })
    }

    filterAvailable(booking, periodic) {
        return _.filter(this.all, (resource)=> resource.isBookable(booking, periodic));
    }

}