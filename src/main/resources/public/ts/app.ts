import { model, notify, http, IModel, Model, Collection, BaseModel, moment, ui,routes, _, $, ng } from "entcore";
import * as controllers from './controllers';
import * as directives from "./directives";

for (let controller in controllers) {
    ng.controllers.push(controllers[controller]);
}

routes.define(function($routeProvider) {
    $routeProvider
        .when('/booking/:bookingId', {
            action: 'viewBooking',
        })
        .when('/booking/:bookingId/:start', {
            action: 'viewBooking',
        })
        .when('/', {
        action: 'main'
    });
});


// for (let directive in directives) {
//     ng.directives.push(directives[directive]);
// }
//
// for (let filter in filters) {
//     ng.filters.push(filters[filter]);
// }