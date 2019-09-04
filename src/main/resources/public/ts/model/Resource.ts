import { Mix, Selectable, Selection } from "entcore-toolkit";
import { _, Behaviours } from 'entcore';
import { ResourceType } from "./index";
import http from "axios";

export class Resource implements Selectable {
    id:number;
    color: string;
    description: string;
    icon: null|any ;
    is_available: boolean;
    max_delay: null | number;
    min_delay: null | number;
    name: string;
    periodic_booking: boolean;
    validation: boolean;
    visibility: null |boolean;
    resourceType: ResourceType;
    type_id: number;
    created: string|Date;
    modified: string|Date;
    owner:any;
    shared: any;
    myRights: any;
    selected:boolean;


    constructor (resource?) {

    }

    setPreference(preferenceResource){
        let state = _.findWhere(preferenceResource, {id : this.id});
        if(!state || state.length == 0) return;
        this.selected = !!state.selected;
        return state;
    }

    isBookable(periodic){
        return this.is_available === true
            && this.myRights !== undefined
            && this.myRights.contrib !== undefined
            && (!periodic || this.periodic_booking);
    };
}

export class Resources extends Selection<Resource> {
    constructor() {
        super([]);
    }
    async sync() {
        let  {data} = await http.get('/rbs/resources');
        this.all = Mix.castArrayAs(Resource, data);
        await this.all.map((resource)=>{
             Behaviours.applicationsBehaviours.rbs.resource(resource)
        })
    }

    filterAvailable(periodic) {
        return _.filter(this.all, (resource)=> resource.isBookable(periodic));
    }

}