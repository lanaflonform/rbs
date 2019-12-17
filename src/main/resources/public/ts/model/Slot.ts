import {_, moment, notify} from 'entcore';
import { Selectable, Mix, Selection } from 'entcore-toolkit';
import http from "axios";
import {Booking} from "./Booking";
import {Resource} from "./Resource";
import {Utils} from "./Utils";


export class Slot implements Selectable{
    startMoment;
    start_date;
    end_date;
    selected:boolean;

    resource: Resource;
    id: number;

    constructor (booking?: Booking, id?: number) {
        if (booking) {
            if(booking.startDate)  this.start_date = booking.startMoment;
            if(booking.endDate) this.end_date = booking.endMoment;
        }
        if (id) this.id = id;
        this.resource = new Resource();
    }

    toJson (){
        return this.slotJson(this.start_date, this.end_date);
    }
    slotJson(start, end) {
        return {
            start_date : (moment.utc(start).add(Utils.getUtcTime(start),'hours' )).unix(),
            end_date : (moment.utc(end).add(Utils.getUtcTime(end), 'hours')).unix(),
            iana : Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    }

    async delete() {
        try {
            return await http.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/false");
        }
        catch (e) {
            notify.error('rbs.errors.title.delete.booking');
        }
    };
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

