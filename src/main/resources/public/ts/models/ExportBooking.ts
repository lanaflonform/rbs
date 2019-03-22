import {moment,  _, notify} from "entcore";
import http from "axios";
export class ExportBooking  {
    format: string;
    exportView : string;
    startDate : Date;
    endDate: Date;
    resources : Array<number>;
    resourcesToTake : string;

    constructor () {
        this.format = "PDF";
        this.exportView = "WEEK";
        this.startDate = moment().day(1).toDate();
        this.endDate = moment().day(7).toDate();
        this.resources = [];
        this.resourcesToTake = "selected";
    }
    toJSON (){
        return  {
            format: this.format.toUpperCase(),
            view: this.exportView,
            startdate: this.startDate,
            enddate: this.endDate,
            resourceIds: this.resources
        }
    };
    async send  () {
        try{
            return await http.post('/rbs/bookings/export', this)
        }catch (e) {
            notify.error('');
        }
    };
}
