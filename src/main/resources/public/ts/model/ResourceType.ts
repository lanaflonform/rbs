import {Rights, _, Shareable, Behaviours, notify, moment} from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from 'axios';
import { Resources, Structure } from './';

export class ResourceType implements Selectable, Shareable{
    id: number;
    expanded: boolean;
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
            // this.myRights = new Rights(this);
            // console.log('first --->', this.myRights);
            // this.myRights.fromBehaviours();
            // console.log('second --->', this.myRights);
        }
    }

    toJSON() {
        let json = {
            name: this.name,
            color: this.color,
            validation: this.validation,
            school_id: this.school_id
        };
        if (this.slotprofile) {
            json['slotprofile'] = this.slotprofile;
        }
        return json;
    }

    save(structureId) {
      if(this.id) {
        this.update();
      }
      else {
        this.create(structureId);
      }
    };

    async create(structureId) {
        try {
            this.school_id = structureId;
            let url = '/rbs/type';
            let { data } = await http.post(url, this.toJSON());
            this.id =  data.id;
            this.myRights = new Rights(this);
            console.log('first --->', this.myRights);
            this.myRights.fromBehaviours();
            console.log('second --->', this.myRights);
        } catch (e) {
            notify.error('Function create type failed');
        }
    }

    async update() {
        try {
            await http.put('/rbs/type/' + this.id, this.toJSON());
        } catch (e) {
            notify.error('Function update type failed');
        }
    };

    async delete() {
        try {
            return await http.delete('/rbs/type/' + this.id);
        }
        catch (e) {
            notify.error('rbs.errors.title.delete.type');
        }
    };

    setPreference(preferenceType, resources?:boolean){
        let state = _.findWhere(preferenceType, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        if(resources && this.resources.all !== undefined) this.resources.all.map((resource) => resource.setPreference(state.resources));
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
        try {
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
            notify.error('Function sync resource type failed');
        }
    };

    deselectAllResources () {
       this.all.forEach(resourceType => {
           if(resourceType.resources.all !== undefined) {
               resourceType.resources.deselectAll();
           }
       });
    };

    initModerators () {
        if (this.all[0].moderators === undefined) {
            this.all.forEach(function(resourceType) {
                resourceType.getModerators();
            });
        }
    };
}