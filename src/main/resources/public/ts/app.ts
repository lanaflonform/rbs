import { model, notify, http, IModel, Model, Collection, BaseModel, moment, ui,routes, _, $, ng } from "entcore";
import {rbsController} from "./controllers/controller";

routes.define(function($routeProvider) {
    $routeProvider
        .when('/booking/:bookingId', {
            action: 'viewBooking',
        })
        .when('/booking/:bookingId/:start', {
            action: 'viewBooking',
        });
});
ng.controllers.push(rbsController);