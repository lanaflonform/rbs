import {model, Rights, _, Shareable, Model, Behaviours} from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from 'axios';
import {Resource, Resources, Structure} from './'

export class ResourceType implements Selectable, Shareable{
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

    rights: any;
    selected:boolean;
    shared;
    owner;
    constructor (resourceType?) {
        this.rights = new Rights(this);
        this.rights.fromBehaviours();
        if (resourceType) {
            Mix.extend(this, resourceType);
        }
    }
    get myRights() {
        return this.rights.myRights;
    };
    setPreference(preferenceType, resources?:boolean){
        let state = _.findWhere(preferenceType, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        if(resources) this.resources.all.map((resource)=> resource.setPreference(state.resources));
        return state;
    }
}

export class ResourceTypes  extends Selection<ResourceType> {

    constructor () {
        super([]);
    }
    async sync (resources?:Resources) {
        try{
            let { data } = await http.get('/rbs/types'); // fixme rrah


            if(!resources) {
                let resources = new Resources();
            }
            let groupedResources = _.groupBy(resources.all, 'type_id');
            data.map((resourceType)=>{

                resourceType.resources = new Resources();
                resourceType.resources.all = groupedResources[resourceType.id];
                this.all.push(Behaviours.applicationsBehaviours.rbs.resource(new ResourceType(resourceType)));
            })
        }catch (e) {

        }
    }
}