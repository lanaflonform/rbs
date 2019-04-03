import { Mix, Selectable, Selection} from "entcore-toolkit";
import {_, Rights} from 'entcore';
import {Bookings, ResourceType} from "./index";
import http from "axios";

export class Resource implements Selectable {
    id:number;
    bookings: Bookings;
    type;

    selected:boolean;

    constructor () {

    }
    setPreference(preferenceResource){
        let state = _.findWhere(preferenceResource, {id : this.id});
        if(!state || state.length == 0) return;
        this.selected = !!state.selected;
        return state;
    }
}

export class Resources extends Selection<Resource> {
    constructor() {
        super([]);
    }
    async sync() {
        let  {data} = await http.get('/rbs/resources');
        this.all = Mix.castArrayAs(Resource, data);
    }

}