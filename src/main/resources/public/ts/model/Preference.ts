import http from "axios";

import { Mix } from "entcore-toolkit";
import {_} from "entcore";


export class Preference {
    treeState : Array<object>;
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
        return {treeState: _.map(structures.all, (struct) => {
                return {
                    id: struct.id,
                    expanded: struct.expanded,
                    selected: struct.selected,
                    resourceTypes: _.map(struct.resourceTypes.all, (type) => {
                        return {
                            id: type.id,
                            expanded: type.expanded,
                            resources: _.map(type.resources.all, (resource) => {
                                return {
                                    id: resource.id,
                                    selected: resource.selected,
                                };
                            })
                        };
                    })
                };
            })
        }
    }
}