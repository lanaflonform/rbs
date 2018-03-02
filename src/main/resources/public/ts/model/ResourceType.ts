import { model, _, Behaviours, Rights } from 'entcore';
import { Eventer, Mix, Selectable, Selection } from 'entcore-toolkit';
import http from 'axios';

import { Resource, Resources } from './index';

export class ResourceType implements Selectable {
    selected: boolean;

    color: string;
    created: any;
    expanded: boolean;
    extendcolor: boolean;
    id: number;
    _id: number;
    modified: any;
    name: string;
    owner: string;
    resources: Resources;
    school_id: number;
    shared: any;
    slotprofile: any;
    structure: any;
    moderators: any;
    validation: boolean;
    visibility: any;
    rights: any;

    constructor(data?) {
        this.resources = new Resources();
        this.rights = new Rights(this);
        this.rights.fromBehaviours(); // TODO in rights.ts and undefined behaviours
        if (data) {
            // Can't mix extend because of the readonly attributes in Selection
            // Mix.extend(this, data);
            this.color = data.color;
            this.created = data.created;
            this.expanded = data.expanded;
            this.extendcolor = data.extendcolor;
            this.id = data.id;
            this._id = data._id;
            this.modified = data.modified;
            this.name = data.name;
            this.owner = data.owner;
            this.resources = data.resources;
            this.school_id = data.school_id;
            this.shared = data.shared;
            this.slotprofile = data.slotprofile;
            this.structure = data.structure;
            this.moderators = data.moderators;
            this.validation = data.validation;
            this.visibility = data.visibility;
        }
    };

    get myRights() {
        return this.rights.myRights;
    }

    save (cb, cbe) {
        if(this.id) {
            this.update(cb, cbe);
        }
        else {
            this.create(cb, cbe);
        }
    };

    update (cb, cbe) {
        http.put('/rbs/type/' + this.id, this)
            .then(() => {
                if(typeof cb === 'function'){
                    cb();
                }
            })
            .catch((e) => {
                if(typeof cbe === 'function'){
                    cbe(model.parseError(e, this, 'update'));
                }
            });
    };

    create (cb, cbe) {
        this.school_id = this.structure.id;
        http.post('/rbs/type', this)
            .then((t) => {
                Mix.extend(this, t);
                this._id = this.id;

                // Update collections
                model.resourceTypes.push(this);
                if (typeof cb === 'function'){
                    cb();
                }
            })
            .catch(function(e){
                if (typeof cbe === 'function'){
                    cbe(model.parseError(e, this, 'create'));
                }
            });
    };

    delete (cb?, cbe?) {
        http.delete('/rbs/type/' + this.id)
            .then(() => {
                if (typeof cb === 'function'){
                    cb();
                }
            })
            .catch((e) => {
                if (typeof cbe === 'function'){
                    cbe(model.parseError(e, this, 'delete'));
                }
            });
    };

    getModerators (callback) {
        http.get('/rbs/type/' + this.id + '/moderators')
            .then((response) => {
            this.moderators = response.data;
            if(typeof callback === 'function'){
                callback();
            }
        });
    };

    toJSON () {
        if (this.extendcolor === null) {
            this.extendcolor = false;
        }
        let json: any = {
            name : this.name,
            validation : this.validation,
            color : this.color,
            extendcolor : this.extendcolor
        };
        // Send school id only at creation
        if (! this.id) {
            json.school_id = this.school_id;
        }
        if (this.slotprofile) {
            json.slotprofile = this.slotprofile;
        }
        return json;
    };
}

export class ResourceTypes extends Selection<ResourceType> {
    all: ResourceType[];
    eventer: Eventer;

    constructor() {
        super([]);
        this.all = [];
        this.eventer = new Eventer();
    };

    sync () {
        // Load the ResourceTypes
        http.get('/rbs/types')
            .then( (result) => {
                let resourceTypes = result.data;
                let index = 0;
                // Auto-associate colors to Types
                _.each(resourceTypes, function (resourceType) {
                    // Resolve the structure if possible
                    let structure = _.find(model.structures, function (s) {
                        return s.id === resourceType.school_id;
                    });
                    resourceType.structure = structure || model.DETACHED_STRUCTURE;

                    // Auto-associate colors to Types

                    if (resourceType.color == null) {
                        resourceType.color = model.findColor(index);
                        model.LAST_DEFAULT_COLOR = resourceType.color;
                        index++;
                    }
                    else {
                        let nbCouleur = 0;
                        resourceTypes.forEach(function (resourceType) {
                            if (model.colors.indexOf(resourceType.color) !== -1) {
                                nbCouleur++;
                            }
                        });
                        model.LAST_DEFAULT_COLOR = model.findColor(nbCouleur);
                        index = nbCouleur + 1;
                    }
                    resourceType._id = resourceType.id;
                    if (resourceType.slotprofile === null) {
                        resourceType.slotprofile = undefined;
                    }
                    resourceType.expanded = true;
                });

                // Fill the ResourceType collection and prepare the index
                let resourceTypeIndex = {};
                this.all = resourceTypes;
                _.forEach(this.all, (resourceType) => {
                    resourceType.resources = new Resources();
                    resourceType.resources.all = [];
                    resourceTypeIndex[resourceType.id] = resourceType;
                });
                // Load the Resources in each ResourceType
                http.get('/rbs/resources')
                    .then((result) => {
                        let resources = result.data;
                        let actions = (resources !== undefined ? resources.length : 0);
                        _.forEach(resources, (resource) => {
                            let newResource = Mix.castAs(Resource, resource);
                            // Load the ResourceType's collection with associated Resource
                            let resourceType = resourceTypeIndex[newResource.type_id];
                            if (resourceType !== undefined) {
                                newResource.type = resourceType;
                                if (newResource.color === null) {
                                    newResource.color = resourceType.color;
                                }
                                newResource.syncBookings();
                                resourceType.resources.push(newResource, false);
                            }

                            actions--;
                            if (actions === 0) {
                                model.resourceTypes.all[0].resources.selectAll();
                                _.forEach(model.bookings.all, function (booking) {
                                    Behaviours.applicationsBehaviours.rbs.resourceRights(booking);
                                });
                                this.eventer.trigger('sync');
                                model.bookings.applyFilters();
                            }
                        });
                    });
            });
    };

    filterAvailable (periodic) {
        return this.filter(function (resourceType) {
            return (resourceType.myRights !== undefined
                && resourceType.myRights.contrib !== undefined);
        });
    };

    deselectAllResources () {
        _.forEach(this.all, function (resourceType) {
            resourceType.resources.deselectAll();
        });
    };

    removeSelectedTypes () {
        _.forEach(this.selected, (resourceType) => {
            let rtype = new ResourceType();
            rtype.id = resourceType.id;
            rtype.delete();
        });
        this.removeSelection();
    };
}