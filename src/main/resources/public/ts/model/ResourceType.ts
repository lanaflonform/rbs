import {model, Rights, _, Shareable, Model, Behaviours, notify} from 'entcore';
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
    moderators:object;
    created:string|Date;
    modified:string|Date;
    myRights: any;
    selected:boolean;
    shared;
    owner;
    constructor (resourceType?) {
        if (resourceType) {
            Mix.extend(this, resourceType);
            this.myRights = new Rights(this);
            this.myRights.fromBehaviours();
        }
    }

    async create() {
        try {
            let { data } = await http.post('/rbs/type', this.toJSON());
            Mix.extend(this, data);
        } catch (e) {
            notify.error('');
        }
    }

    toJSON(){
        return this;
    }

    setPreference(preferenceType, resources?:boolean){
        let state = _.findWhere(preferenceType, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        if(resources) this.resources.all.map((resource)=> resource.setPreference(state.resources));
        return state;
    }

    async getModerators() {
        let {data} =await http.get('/rbs/type/' + this.id + '/moderators');
        this.moderators = data;
    };

}

export class ResourceTypes  extends Selection<ResourceType> {

    constructor () {
        super([]);
    }

    async sync (resources?:Resources) {
        try{
            let { data } = await http.get('/rbs/types');
            if(!resources) {
                let resources = new Resources();
            }
            let groupedResources = _.groupBy(resources.all, 'type_id');
            this.all = Mix.castArrayAs(ResourceType, data);
            await this.all.map((resourceType)=>{
                resourceType.resources = new Resources();
                resourceType.resources.all = groupedResources[resourceType.id];
                Behaviours.applicationsBehaviours.rbs.resource(resourceType);
            })
        } catch (e) {

        }
    }

    deselectAllResources () {
       this.all.forEach( resourceType => resourceType.resources.deselectAll());
     }
    initModerators () {
        if (this.all[0].moderators === undefined) {
            this.all.forEach(function(resourceType) {
                resourceType.getModerators();
            });
        }
    };
}