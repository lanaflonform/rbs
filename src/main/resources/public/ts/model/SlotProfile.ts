
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from "axios";

export class SlotProfile implements Selectable{

    selected:boolean;
}

export class SlotProfiles  extends Selection<SlotProfile> {

    constructor () {
        super([]);
    }

    async sync () {
        let { data } = await http.get('');
        this.all = Mix.castArrayAs(SlotProfile, data );
    }
}