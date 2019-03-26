import {model} from "entcore";

export class Utils {
    // Used to display types for moderators (moderators of a type can update a resource, but cannot create one)
    static keepProcessableResourceTypes = (type) => {
        return type.myRights && type.myRights.process;
    };

    // Used to display types in which current user can create a resource
    static  keepManageableResourceTypes = (type) => {
        return type.myRights && type.myRights.manage;
    };

    static getIncrenementISOMoment = () =>{
        let increment = model.calendar.increment;
       return increment == 'week' ? 'isoweek' : increment;
    }
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
}