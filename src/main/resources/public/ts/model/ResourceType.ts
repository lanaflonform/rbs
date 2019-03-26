import {model, Rights} from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from 'axios';

export class ResourceType implements Selectable{
    myRights: Rights<ResourceType>;
    selected:boolean;
    shared;
    owner;
    constructor () {
    }
}

export class ResourceTypes  extends Selection<ResourceType> {

    constructor () {
        super([]);
    }
    async sync () {
        try{
            let { data } = await http.get('/rbs/types'); // fixme rrah
            this.all = Mix.castArrayAs(ResourceType, data);
        }catch (e) {

        }
    }

}