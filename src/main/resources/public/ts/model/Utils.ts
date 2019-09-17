import {_, model, moment} from "entcore";
import {PERIODS} from "./constantes";

export class Utils {
    // Used to display types for moderators (moderators of a type can update a resource, but cannot create one)
    static keepProcessableResourceTypes = (type) => {
        return type.myRights && type.myRights.process;
    };

    // Used to display types in which current user can create a resource
    static  keepManageableResourceTypes = (type) => {
        return type.myRights && type.myRights.manage;
    };

    static getIncrementISOMoment = () =>{
        let increment = model.calendar.increment;
        return increment == 'week' ? 'isoweek' : increment+'s';
    };
    static canCreateBooking (resourceType) {
        if (
            undefined !==
            resourceType.all.find((resourceType) =>{
                return (
                    resourceType.myRights !== undefined &&
                    resourceType.myRights['contrib'] !== undefined
                );
            })
        ) {
            return true;
        }
        return false;
    };
    static  today = moment().startOf('day');
    static tomorrow = moment().add(1, 'day').startOf('day');

    static bitMaskToDays = (bitMask?) =>{
        let periodDays = [];
        let bits = [];
        if (bitMask !== undefined) {
            bits = (bitMask + '').split("");
        }
        _.each(PERIODS.days, function(day){
            if (bits[day] === '1') {
                periodDays.push({number: day, value: true});
            }
            else {
                periodDays.push({number: day, value: false});
            }
        });
        return periodDays;
    };
}