import {model, Rights, _} from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from 'axios';
import {Resources, Structure} from './'

export class ResourceType implements Selectable{
    id: number;

    expanded: boolean;
    extendcolor: boolean;
    color:string;
    name: string;
    notified: string;
    resources: Resources;
    school_id: string;
    slotprofile: string;
    structure: Structure;
    validation: boolean;
    visibility: boolean |null ;

    created:string|Date;
    modified:string|Date;

    myRights: Rights<ResourceType>;
    selected:boolean;
    shared;
    owner;
    constructor () {
    }
    setPreference(preferenceType, resources?:boolean){
        let state = _.findWhere(preferenceType, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        if(resources) this.resources.all.map((resource)=>resource.setPreference(state.resources));
        return state;
    }
}

export class ResourceTypes  extends Selection<ResourceType> {

    constructor () {
        super([]);
    }
    async sync (withResource?:boolean) {
        try{
            let { data } = await http.get('/rbs/types'); // fixme rrah
            this.all = Mix.castArrayAs(ResourceType, data);
            let resources = new Resources();
            if(withResource) {
                await resources.sync();
                resources.groupByTypeId();
                this.all.map((resourceType)=>{
                    resourceType.resources = resources[resourceType.id];
                })
            }


        }catch (e) {

        }
    }


}