import { model, _ } from 'entcore';

export class SelectionHolder {

    mine: boolean;
    unprocessed: boolean;
    currentType: boolean;
    firstResourceType: boolean;
    resources: any;
    resourceTypes: any;
    allResources: boolean;

    constructor() {
        this.resources = [];
        this.resourceTypes = [];
    };

    record (resourceTypeCallback, resourceCallback) {
        this.mine = (model.bookings.filters.mine === true ? true : undefined);
        this.unprocessed = (model.bookings.filters.unprocessed === true ? true : undefined);
        this.currentType = ((model.resourceTypes.current !== undefined && model.resourceTypes.current !== null) ? model.resourceTypes.current.id : undefined);

        let typeRecords = [];
        let resourceRecords = [];

        _.forEach(model.resourceTypes.all, (resourceType) => {
            if (resourceType.expanded === true) {
                typeRecords[resourceType.id] = true;
                if (typeof resourceTypeCallback === 'function') {
                    resourceTypeCallback(resourceType);
                }
            }
            _.forEach(model.resourceTypes.all, (resource) => {
                if (resource.selected === true) {
                    resourceRecords[resource.id] = true;
                    if (typeof resourceCallback === 'function') {
                        resourceCallback(resource);
                    }
                }
            });
        });

        this.resourceTypes.all = typeRecords;
        this.resources.all = resourceRecords;
    };

    restore (resourceTypeCallback, resourceCallback) {
        let typeRecords = this.resourceTypes || [];
        let resourceRecords = this.resources || [];

        // First resourceType initial selection if enabled
        if (this.firstResourceType === true && model.resourceTypes.all.length > 0) {
            typeRecords = [];
            typeRecords[model.resourceTypes.all[0].id] = true;
            resourceRecords = [];
            _.forEach(model.resourceTypes.all[0].resources.all, (resource) => {
                resourceRecords[resource.id] = true;
            });
            this.firstResourceType = undefined;
        }

        // Apply recorded booking filters
        model.bookings.filters.mine = (this.mine === true ? true : undefined);
        model.bookings.filters.unprocessed = (this.unprocessed === true ? true : undefined);

        _.forEach(model.resourceTypes.all, (resourceType) => {
            if (typeRecords[resourceType.id] || this.allResources === true) {
                resourceType.expanded = true;
            }
            if (resourceType.id === this.currentType) {
                model.resourceTypes.current = resourceType;
                if (typeof resourceTypeCallback === 'function') {
                    resourceTypeCallback(resourceType);
                }
            }
            _.forEach(resourceType.resources.all, (resource) => {
                if (resourceRecords[resource.id] || this.allResources === true) {
                    resource.selected = true;
                    if (typeof resourceCallback === 'function') {
                        resourceCallback(resource);
                    }
                }
            });
        });

        this.resourceTypes = [];
        this.resources = [];
    };
}
