import { Mix, Selectable, Selection} from "entcore-toolkit";
import {Bookings} from "./index";

export class Resource implements Selectable {
    selected : boolean;
    bookings: Bookings;


    constructor () {

    }

}