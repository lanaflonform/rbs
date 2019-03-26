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
      if(start)  this.start_date= start;
        if(end) this.end_date= end;
      if(booking)  this.start_date;
    }

    toJson (){
        return this;
    }
    slotJson(start, end) {
        return {
            start_date : (moment.utc(start._i).add('hours',- moment(this.startMoment._i).format('Z').split(':')[0])).unix(),
            end_date :  (moment.utc(end._i).add('hours',- moment(this.startMoment._i).format('Z').split(':')[0])).unix(),
            iana :  moment.tz.guess()
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

