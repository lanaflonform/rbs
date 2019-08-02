import { model, moment } from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from "axios";
import {Booking} from "./Booking";


export class Slot implements Selectable{
    startMoment;
    start_date;
    end_date;
    selected:boolean;
    constructor (booking?: Booking,start?:string, end?:string) {
        if(booking.startDate)  this.start_date = booking.startDate;
        if(booking.endDate) this.end_date = booking.endDate;
        // if(booking)  this.start_date;
    }

    toJson (){
        return this.slotJson(this.start_date, this.end_date);
    }
    slotJson(start, end) {
        return {
            // start_date : (moment.utc(this.start_date._i).add('hours',- moment(this.startMoment._i).format('Z').split(':')[0])).unix(),
            // end_date :  (moment.utc(this.end_date._i).add('hours',- moment(this.startMoment._i).format('Z').split(':')[0])).unix(),
            start_date : this.start_date,
            end_date : this.end_date,
            // iana :  moment.tz.guess()
        }
    }
}

export class Slots  extends Selection<Slot> {

    constructor (slot?) {
        super([]);
        if(slot) this.all = Mix.castArrayAs(Slot, [slot] );
    }

    async sync () {
        let { data } = await http.get('');
        this.all = Mix.castArrayAs(Slot, data );
    }
}

