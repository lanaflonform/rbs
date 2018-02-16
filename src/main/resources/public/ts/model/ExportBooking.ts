import { model, moment } from 'entcore';
import http from 'axios';

export class ExportBooking {

    format: string;
    exportView: string;
    startDate: any;
    endDate: any;
    resources: any;
    resourcesToTake: string;

    constructor() {
        this.format = "PDF";
        this.exportView = "WEEK";
        this.startDate = moment().day(1).toDate();
        this.endDate = moment().day(7).toDate();
        this.resources = [];
        this.resourcesToTake = "selected";
    }

    toJSON  () {
        return {
            format: this.format.toUpperCase(),
            view: this.exportView,
            startdate: this.startDate,
            enddate: this.endDate,
            resourceIds: this.resources
        };
    };

    send  (cb, cbe) {
        let exportBooking = this;

        return http.post('/rbs/bookings/export', this)
            .then(function (data) {
                model.returnData(cb, [data.data]);
            }).catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, exportBooking, 'create'));
                }
            });
    };
}