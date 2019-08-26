import { routes, ng, moment } from "entcore";
import * as controllers from './controllers';
import * as directives from './directives';

moment.defineLocale(moment.locale(), { week: {dow: 1}});

for (let controller in controllers) {
    ng.controllers.push(controllers[controller]);
}

for (let directive in directives) {
    ng.directives.push(directives[directive]);
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