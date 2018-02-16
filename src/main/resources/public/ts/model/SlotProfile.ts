import { model, notify } from 'entcore';
import http from 'axios';

export class SlotProfile {

    constructor() {
    };

    getSlotProfiles (structId, callback) {
        return http.get('/rbs/slotprofiles/schools/' + structId)
            .then(function(data){
                model.returnData (callback, [data.data]);
            }).catch(function(e){
                let error = e.response.data;
                notify.error(error.error);
            });
    };

    getSlots (slotProfileId, callback) {
        return http.get('/rbs/slotprofiles/' + slotProfileId + '/slots')
            .then(function(data){
                model.returnData (callback, [data.data]);
            }).catch(function(e){
                let error = e.response.data;
                notify.error(error.error);
            });
    };
}