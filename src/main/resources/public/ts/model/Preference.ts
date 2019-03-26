import http from "axios";

import { Mix } from "entcore-toolkit";


export class Preference {

    constructor() {
        this.sync();
    }

    async sync() {
        let {data } = await http.get('/userbook/preference/rbs');
        Mix.extend(this, JSON.parse( data.preference));
    }
    async save(){
        let {status} =  await http.put('/userbook/preference/rbs', this.toJson);
        return status
    }

    toJson(){
        return { treeState: this };
    }
}