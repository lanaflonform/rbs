import { model, _ } from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from 'axios';
import {ResourceTypes, Preference} from './index'
import {DETACHED_STRUCTURE} from "./constantes/index";


export class Structure implements Selectable{
    id: string;
    name: string;
    expanded: boolean;
    resourceTypes: ResourceTypes;

    selected:boolean;

    constructor(id?, name?){
        if(id) this.id=id;
        if(name) this.name=name;
    }
    setPreference(preference){
        let state = _.findWhere(preference, {id : this.id});
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        return state;
    }
}

export class Structures  extends Selection<Structure> {
    preference: Preference;
    private ids : object;
    constructor () {
        super([]);
        this.preference = new Preference();

    }

    async sync (resourceTypes?:ResourceTypes) {
        ( this.all =  Mix.castArrayAs(Structure, model['structure'])).push(DETACHED_STRUCTURE);
    }
    mapedStructures(resourceTypes){
        return _.map( this.all , (structure) =>{
            let state = structure.setPreference(Preference);
            structure.resourceTypes = _.filter(resourceTypes, (type) => {return type.school_id == structure.id});

        })
    }
    groupByStructure (resourceTypes) {
       this.ids = _.groupBy(resourceTypes, );
    }
}