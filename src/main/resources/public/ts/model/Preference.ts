import http from "axios";

import { Mix } from "entcore-toolkit";
import {_} from "entcore";


export class Preference {

    constructor() {
    }

    async sync() {
        let {data } = await http.get('/userbook/preference/rbs');
        Mix.extend(this, JSON.parse( data.preference));
    }
    async save(structures){
        let {status} =  await http.put('/userbook/preference/rbs', this.toJson(structures));
        return status
    }

    toJson(structures){
        return  _.map(structures.all,(struct) =>{
            return {
                id: struct.id,
                expanded: struct.expanded === true,
                selected: struct.selected === true,
                types: _.map(struct.resourceTypes.all, (type) => {
                    return {
                        id: type.id,
                        expanded: type.expanded === true,
                        resources: _.map(type.resources.all,(resource)=> {
                            return {
                                id: resource.id,
                                selected: resource.selected === true,
                            };
                        })
                    };
                })
            };
        });
    }
}