import { Mix, Selectable, Selection} from "entcore-toolkit";
import {_} from 'entcore';
import {Bookings} from "./index";
import http from "axios";

export class Resource implements Selectable {
    selected : boolean ;
    id:number;
    bookings: Bookings;
    type;

    constructor () {

    }
    setPreference(preferenceRsource){
        let state = _.findWhere(preferenceRsource, {id : this.id});
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
    groupByTypeId(){
     return _.groupBy(this.all, 'type_id');
    }
}