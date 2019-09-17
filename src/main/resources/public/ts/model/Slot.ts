import { moment } from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from "axios";
import {Booking} from "./Booking";


export class Slot implements Selectable{
    startMoment;
    start_date;
    end_date;
    selected:boolean;
    constructor (booking?: Booking, start?:string, end?:string) {
        if(booking.startDate)  this.start_date = booking.startMoment;
        if(booking.endDate) this.end_date = booking.endMoment;
    }

    toJson (){
        return this.slotJson(this.start_date, this.end_date);
    }
    slotJson(start, end) {
        return {
            start_date : (moment.utc(start).add('hours',+ moment(this.startMoment).format('Z').split(':')[0])).unix(),
            end_date : (moment.utc(end).add('hours',+ moment(this.startMoment).format('Z').split(':')[0])).unix(),
            iana : Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    }
}

export class Slots  extends Selection<Slot> {
    id: number;

    constructor (slot?) {
        super([]);
        if(slot) this.all = Mix.castArrayAs(Slot, [slot] );
    }

    async sync (id: number) {
        let { data } = await http.get(`/rbs/bookings/full/slots/${id}`);
        this.all = Mix.castArrayAs(Slot, data);
    }
}

