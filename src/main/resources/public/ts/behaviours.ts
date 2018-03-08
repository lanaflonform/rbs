import { Behaviours, model, _ } from 'entcore';

import {Booking, Resource } from './model';

console.log('RBS behaviours loaded');

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
	rights: {
		workflow: rbsBehaviours.workflow,
		resource: rbsBehaviours.resources
	},
	resourceRights: function(resource){
		let rightsContainer = resource;
		if(resource instanceof Resource && resource.type){
			rightsContainer = resource.type;
		}
		if(resource instanceof Booking && resource.resource && resource.resource.type){
			rightsContainer = resource.resource.type;
		}
		
		if(!resource.myRights){
			resource.myRights = {};
		}

		// ADML permission check
		let isAdmlForResource = model.me.functions.ADMIN_LOCAL && _.find(model.me.functions.ADMIN_LOCAL.scope, function(structure_id) {
			return structure_id === rightsContainer.school_id;
		});

		for (let behaviour in rbsBehaviours.resources) {
			if(model.me.userId === resource.owner || model.me.userId === rightsContainer.owner || isAdmlForResource || model.me.hasRight(rightsContainer, rbsBehaviours.resources[behaviour])){
				if(resource.myRights[behaviour] !== undefined){
					resource.myRights[behaviour] = resource.myRights[behaviour] && rbsBehaviours.resources[behaviour];
				}
				else{
					resource.myRights[behaviour] = rbsBehaviours.resources[behaviour];
				}
			}
		}
		return resource;
	},
	workflow: function(){
		let workflow = { };
		let rbsWorkflow = rbsBehaviours.workflow;
		for(let prop in rbsWorkflow){
			if(model.me.hasWorkflow(rbsWorkflow[prop])){
				workflow[prop] = true;
			}
		}
		return workflow;
	}
});