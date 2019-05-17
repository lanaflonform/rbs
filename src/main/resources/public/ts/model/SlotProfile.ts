
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from "axios";
import {notify} from "entcore";

export class SlotProfile implements Selectable{
    slots:Array<object>;
    selected:boolean;
    async getSlots(slotProfileId) {
        try {
            if(!slotProfileId)
                this.slots=[];
            else{
                let {data} = await http.get('/rbs/slotprofiles/' + slotProfileId + '/slots');
                Mix.extend(this, data);
            }
        }catch (e) {
            notify.error('');
        }
    };
}

export class SlotProfiles  extends Selection<SlotProfile> {

    constructor () {
        super([]);
    }

    async sync (structId) {
        let { data } = await http.get(`/rbs/slotprofiles/schools/${structId}` );
        this.all = Mix.castArrayAs(SlotProfile, data );
    }

}