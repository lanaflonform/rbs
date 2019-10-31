import { Behaviours, model, _ } from 'entcore';

const rbsBehaviours = {
	resources: {
		contrib: {
			right: 'net-atos-entng-rbs-controllers-BookingController|createBooking'
		},
		process: {
			right: 'net-atos-entng-rbs-controllers-BookingController|processBooking'
		},
		manage: {
			right: 'net-atos-entng-rbs-controllers-ResourceTypeController|updateResourceType'
		},
		share: {
			right: 'net-atos-entng-rbs-controllers-ResourceTypeController|shareJson'
		}
	},
	workflow: {
		typemanage: 'net.atos.entng.rbs.controllers.ResourceTypeController|createResourceType',
		validator: 'net.atos.entng.rbs.controllers.BookingController|listUnprocessedBookings',
	}
};

Behaviours.register('rbs', {
	behaviours: rbsBehaviours,
    resource:async function(resource){

        if (resource) {
            if (!resource.myRights) {
                resource.myRights = {};
            }

            // ADML permission check
            let isAdmlForResource = model.me.functions.ADMIN_LOCAL && _.find(model.me.functions.ADMIN_LOCAL.scope, function (structure_id) {
                return structure_id === resource.school_id;
            });

            for (let behaviour in rbsBehaviours.resources) {
                if (model.me.userId === resource.owner || isAdmlForResource || model.me.hasRight(resource, rbsBehaviours.resources[behaviour])) {
                    if (resource.myRights[behaviour] !== undefined) {
                        resource.myRights[behaviour] = resource.myRights[behaviour] && rbsBehaviours.resources[behaviour];
                    }
                    else {
                        resource.myRights[behaviour] = rbsBehaviours.resources[behaviour];
                    }
                }
            }

        }
		return resource;
	},
    resourceRights: function(){
        return [ 'contrib', 'process', 'manage', 'share'];
    },
    workflow: function(){
		let workflow = {};
		let rbsWorkflow = rbsBehaviours.workflow;
		for(let prop in rbsWorkflow){
			if(model.me.hasWorkflow(rbsWorkflow[prop])){
				workflow[prop] = true;
			}
		}
		return workflow;
	},
    loadResources: async function () {  }

});