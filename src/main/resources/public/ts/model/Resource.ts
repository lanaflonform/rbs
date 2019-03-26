import { Mix, Selectable, Selection} from "entcore-toolkit";
import {Bookings} from "./index";

export class Resource implements Selectable {
    selected : boolean;
    id:number;
    bookings: Bookings;
    type;

    constructor () {

    }

}