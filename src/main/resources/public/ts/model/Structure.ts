import {_, model} from 'entcore';
import {Mix, Selectable, Selection} from 'entcore-toolkit';
import {Preference, ResourceTypes} from './index'
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
    setPreference(preference,type?:boolean,resource?:boolean){
        let state = _.findWhere(preference, {id : this.id});
        if(!state || state.length == 0) return;
        this.expanded = !!state.expanded ;
        this.selected = !!state.selected;
        if(type ) this.resourceTypes.all.map((type)=> type.setPreference(state.type,resource));
        return state;
    }
}

export class Structures  extends Selection<Structure> {

    constructor() {
        super([]);
    }

    async sync(resourceTypes?: ResourceTypes, preference?:Preference) {
        this.all = this.getStructuresList(false);
        if(!resourceTypes) await resourceTypes.sync(true);
        if(!Preference) await preference.sync();

        let detachedType = this.mappedStructures(resourceTypes, preference);
        this.mappedDetachedStructure(detachedType ,preference) ;
    }

    mappedStructures(resourceTypes, preference) {
        this.all.map((structure)=> {
            let resourceType = _.filter(resourceTypes.all,{school_id: structure.id });
            if(resourceType){
               structure.resourceTypes.all= resourceType;
                resourceTypes.all = _.without(resourceTypes.all, resourceType)
            }
            structure.setPreference(preference, true, true);
        });
        return resourceTypes
    }
    mappedDetachedStructure(resourceTypes,preference ){
        let structure = Mix.castAs(Structure, DETACHED_STRUCTURE);
        structure.resourceTypes.all =
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
