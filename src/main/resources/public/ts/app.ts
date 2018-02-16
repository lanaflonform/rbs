import { routes, ng, model } from 'entcore';

import { rbsController } from './controller';
ng.controllers.push(rbsController);

import { timePickerRbs } from './directives';
ng.directives.push(timePickerRbs);

import { buildModel } from './model';
model.build = buildModel;

routes.define(function($routeProvider) {
    $routeProvider
        .when('/booking/:bookingId', {
            action: 'viewBooking',
        })
        .when('/booking/:bookingId/:start', {
            action: 'viewBooking',
        });
});
