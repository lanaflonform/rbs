import http from "axios";
import {  Mix } from 'entcore-toolkit';
export class Notification {
    constructor() {
    }
    async getNotifications() {
        try{
            let {data} = await http.get('/rbs/resource/notifications');
            Mix.extend(this, data);
        }catch (e) {

        }
    };

    async postNotification (id) {
        try{
            let {status} = await http.post('/rbs/resource/notification/add/' + id);
            return status
        }catch (e) {

        }
    };
    async postNotifications (id) {
        try{
            let {status} = await http.post('/rbs/type/notification/add/' + id);
            return status
        }catch (e) {

        }
    };

  async removeNotification (id) {
      try{
          let {status} = await http.delete(`/rbs/resource/notification/remove/${id}`);
          return status
      }catch (e) {

      }
    };

    async removeNotifications (id) {
        try{
            let {status} = await http.delete(`/rbs/type/notification/remove/${id}`);
            return status
        }catch (e) {

        }

    };
}