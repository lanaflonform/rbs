import {_, model} from 'entcore';
import {Mix, Selectable, Selection} from 'entcore-toolkit';
import {Preference, Resources, ResourceTypes} from './index'
import {DETACHED_STRUCTURE} from "./constantes/index";


export class Structure implements Selectable{
    id: string;
    name: string;
    expanded: boolean = false;
    resourceTypes: ResourceTypes = new  ResourceTypes();

    selected:boolean = false;

    constructor(id?, name?){
        if(id) this.id=id;
        if(name) this.name=name;
    }
    setPreference(preference,type?:boolean,resource?:boolean){
        let state = _.findWhere(preference.treeState, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected ;
        if(type ) this.resourceTypes.all.map((type)=> type.setPreference(state.resourceTypes,resource));
        return state;
    }
}

export class Structures  extends Selection<Structure> {

    constructor() {
        super([]);
    }

    async sync(resourceTypes: ResourceTypes = new ResourceTypes(), preference:Preference = new Preference()) {
        this.all = this.getStructuresList(false);
        if(!resourceTypes){
            let resources = new Resources();
            await resources.sync();
            await resourceTypes.sync(resources);
        }
        if(!preference) await preference.sync();

        let detachedType = this.mappedStructures(resourceTypes, preference);
        if(detachedType.all.length!==0  ) this.mappedDetachedStructure(detachedType ,preference) ;
        this.updateSelected()
    }
    mappedStructures(resourceTypes, preference) {
        this.all.map((structure)=> {
            let resourceType = _.filter(resourceTypes.all,{school_id: structure.id });
            if(resourceType){
                structure.resourceTypes.all= resourceType;
                resourceTypes.all = _.difference(resourceTypes.all, resourceType)
            }
            structure.setPreference(preference, true, true);
        });
        return resourceTypes
    }
    mappedDetachedStructure(resourceTypes,preference ){
        let structure = Mix.castAs(Structure, DETACHED_STRUCTURE);
        structure.resourceTypes.all = resourceTypes;
        structure.setPreference(preference, true, true);
        this.all.push(structure);
    }

    getStructuresList(withDetachedStruct?: boolean): Array<Structure> {
        let structures = [];
        if (model.me.structures && model.me.structures.length > 0
            && model.me.structureNames && model.me.structureNames.length > 0) {
            for (let i = 0; i < model.me.structures.length; i++) {
                structures.push(new Structure(model.me.structures[i], model.me.structureNames[i]));
            }
        }
        if (withDetachedStruct) structures.push(Mix.castAs(Structure, DETACHED_STRUCTURE));
        return structures
    }
    // $scope.getSharedResources = function (state) {
    //     let sharedStructure = model.DETACHED_STRUCTURE;
    //     var structureState = state.find(function(struct) { return struct.id === $scope.sharedStructure.id });
    //     $scope.sharedStructure.expanded = structureState ? structureState.expanded : false;
    //     $scope.sharedStructure.selected = structureState ? structureState.selected : false;
    //     $scope.sharedStructure.types = [];
    //     $scope.resourceTypes.all.forEach(function (resource) {
    //         var find = _.findWhere( $scope.structures,{id: resource.school_id });
    //         if(!find) {
    //             $scope.sharedStructure.types.push(resource);
    //         }
    //     });
    // };
}
