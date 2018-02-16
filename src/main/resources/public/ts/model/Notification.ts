import { model, notify } from 'entcore';
import http from 'axios';

export class Notification {

    constructor() {
    };

    getNotifications  (cb) {
        return http.get('/rbs/resource/notifications')
            .then(function (data) {
                model.returnData(cb, [data.data]);
            }).catch(function (e) {
                if (e.responseText) { //TODO Explose quand ajout par exemple (e.responseText)
                    let error = JSON.parse(e.responseText);
                    notify.error(error.error);
                }
            });
    };

    postNotification  (id, cb, cbe) {
        let notif = this;
        return http.post('/rbs/resource/notification/add/' + id)
            .then(function () {
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, notif, 'create'));
                }
            });
    };

    postNotifications  (id, cb, cbe) {
        let notif = this;
        return http.post('/rbs/type/notification/add/' + id)
            .then(function () {
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, notif, 'create'));
                }
            });
    };

    removeNotification  (id, cb, cbe) {
        return http.delete('/rbs/resource/notification/remove/' + id)
            .then(function () {
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, this, 'delete'));
                }
            });
    };

    removeNotifications  (id, cb, cbe) {
        return http.delete('/rbs/type/notification/remove/' + id)
            .then(function () {
                if (typeof cb === 'function') {
                    cb();
                }
            })
            .catch(function (e) {
                if (typeof cbe === 'function') {
                    cbe(model.parseError(e, this, 'delete'));
                }
            });
    };
}
