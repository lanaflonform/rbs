/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var model_1 = __webpack_require__(3);
	console.log('RBS behaviours loaded');
	var rbsBehaviours = {
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
	entcore_1.Behaviours.register('rbs', {
	    behaviours: rbsBehaviours,
	    rights: {
	        workflow: rbsBehaviours.workflow,
	        resource: rbsBehaviours.resources
	    },
	    resourceRights: function (resource) {
	        var rightsContainer = resource;
	        if (resource instanceof model_1.Resource && resource.type) {
	            rightsContainer = resource.type;
	        }
	        if (resource instanceof model_1.Booking && resource.resource && resource.resource.type) {
	            rightsContainer = resource.resource.type;
	        }
	        if (!resource.myRights) {
	            resource.myRights = {};
	        }
	        // ADML permission check
	        var isAdmlForResource = entcore_1.model.me.functions.ADMIN_LOCAL && entcore_1._.find(entcore_1.model.me.functions.ADMIN_LOCAL.scope, function (structure_id) {
	            return structure_id === rightsContainer.school_id;
	        });
	        for (var behaviour in rbsBehaviours.resources) {
	            if (entcore_1.model.me.userId === resource.owner || entcore_1.model.me.userId === rightsContainer.owner || isAdmlForResource || entcore_1.model.me.hasRight(rightsContainer, rbsBehaviours.resources[behaviour])) {
	                if (resource.myRights[behaviour] !== undefined) {
	                    resource.myRights[behaviour] = resource.myRights[behaviour] && rbsBehaviours.resources[behaviour];
	                }
	                else {
	                    resource.myRights[behaviour] = rbsBehaviours.resources[behaviour];
	                }
	            }
	        }
	        return resource;
	    },
	    workflow: function () {
	        var workflow = {};
	        var rbsWorkflow = rbsBehaviours.workflow;
	        for (var prop in rbsWorkflow) {
	            if (entcore_1.model.me.hasWorkflow(rbsWorkflow[prop])) {
	                workflow[prop] = true;
	            }
	        }
	        return workflow;
	    }
	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = entcore;

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(4));
	__export(__webpack_require__(71));
	__export(__webpack_require__(72));
	__export(__webpack_require__(73));
	__export(__webpack_require__(74));
	__export(__webpack_require__(75));
	__export(__webpack_require__(76));
	__export(__webpack_require__(77));
	__export(__webpack_require__(78));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(5);
	var axios_1 = __webpack_require__(45);
	var index_1 = __webpack_require__(3);
	exports.buildModel = function () {
	    return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    //  cyan', 'green', 'orange', 'pink', 'purple', 'grey'
	                    entcore_1.model.colors = ["#4bafd5", "#46bfaf", "#FF8500", "#b930a2", "#763294"];
	                    entcore_1.model.STATE_CREATED = 1;
	                    entcore_1.model.STATE_VALIDATED = 2;
	                    entcore_1.model.STATE_REFUSED = 3;
	                    entcore_1.model.STATE_SUSPENDED = 4;
	                    entcore_1.model.STATE_PARTIAL = 9; // this state is used only in front-end for periodic bookings, it is not saved in database.
	                    entcore_1.model.LAST_DEFAULT_COLOR = "#4bafd5";
	                    entcore_1.model.DETACHED_STRUCTURE = {
	                        id: 'DETACHED',
	                        name: 'rbs.structure.detached'
	                    };
	                    entcore_1.model.timeConfig = {
	                        interval: 5,
	                        start_hour: 0,
	                        end_hour: 23,
	                        default_hour: 8
	                    };
	                    entcore_1.model.periods = {
	                        periodicities: [1, 2, 3, 4],
	                        days: [
	                            1,
	                            2,
	                            3,
	                            4,
	                            5,
	                            6,
	                            0 // sunday
	                        ],
	                        occurrences: [] // loaded by function
	                    };
	                    entcore_1.model.periodsConfig = {
	                        occurrences: {
	                            start: 1,
	                            end: 52,
	                            interval: 1
	                        }
	                    };
	                    entcore_1.model.returnData = function (hook, params) {
	                        if (typeof hook === 'function')
	                            hook.apply(this, params);
	                    };
	                    entcore_1.model.me.workflow.load(['rbs']);
	                    entcore_1.Model.prototype.inherits(index_1.Booking, entcore_1.calendar.ScheduleItem);
	                    this.eventer = new entcore_toolkit_1.Eventer();
	                    this.bookings = new index_1.Bookings();
	                    this.resourceTypes = new index_1.ResourceTypes();
	                    this.recordedSelections = new index_1.SelectionHolder();
	                    // Will auto-select all resources and "Mine" bookings filter by default
	                    //model.bookings.filters.mine = true;
	                    //model.recordedSelections.allResources = true;
	                    //model.recordedSelections.mine = true;
	                    // fixme why to do that  Will auto-select first resourceType resources and no filter by default
	                    //model.recordedSelections.firstResourceType = true;
	                    entcore_1.model.recordedSelections.allResources = true;
	                    entcore_1.model.bookings.filters.dates = true;
	                    //Paging start date
	                    entcore_1.model.bookings.startPagingDate = entcore_1.moment().startOf('isoweek');
	                    //Paging end date
	                    entcore_1.model.bookings.endPagingDate = entcore_1.moment(entcore_1.model.bookings.startPagingDate)
	                        .add(1, 'week')
	                        .startOf('day');
	                    //fixme Why started with today date ....
	                    entcore_1.model.bookings.filters.startMoment = entcore_1.moment().startOf('day');
	                    //fixme Why two month ?
	                    entcore_1.model.bookings.filters.endMoment = entcore_1.moment().add(2, 'month').startOf('day');
	                    entcore_1.model.bookings.filters.startDate = entcore_1.model.bookings.filters.startMoment.toDate();
	                    entcore_1.model.bookings.filters.endDate = entcore_1.model.bookings.filters.endMoment.toDate();
	                    entcore_1.model.resourceTypes.sync();
	                    return [4 /*yield*/, entcore_1.model.bookings.sync()];
	                case 1:
	                    _a.sent();
	                    entcore_1.model.bookings.eventer.on('sync', function (cb) {
	                        entcore_1._.forEach(entcore_1.model.resourceTypes.all, function (type) {
	                            entcore_1._.forEach(type.resources.all, function (resource) {
	                                resource.syncBookings();
	                            });
	                        });
	                        entcore_1.model.bookings.applyFilters();
	                    });
	                    entcore_1.model.refreshRessourceType = function () {
	                        // Record selections
	                        entcore_1.model.recordedSelections.record();
	                        entcore_1.model.resourceTypes.sync();
	                    };
	                    entcore_1.model.refresh = function (isDisplayList) {
	                        // Record selections
	                        entcore_1.model.recordedSelections.record();
	                        // Clear bookings
	                        if (isDisplayList === true) {
	                            entcore_1.model.bookings.syncForShowList();
	                        }
	                        else {
	                            entcore_1.model.bookings.sync();
	                        }
	                        // Launch resync
	                        entcore_1.model.resourceTypes.sync();
	                    };
	                    entcore_1.model.refreshBookings = function (isDisplayList) {
	                        // Record selections
	                        entcore_1.model.recordedSelections.record();
	                        // Clear bookings
	                        if (isDisplayList === true) {
	                            entcore_1.model.bookings.syncForShowList();
	                        }
	                        else {
	                            entcore_1.model.bookings.sync();
	                        }
	                    };
	                    entcore_1.model.getNextColor = function () {
	                        var i = entcore_1.model.colors.indexOf(entcore_1.model.LAST_DEFAULT_COLOR);
	                        return entcore_1.model.colors[(i + 1) % entcore_1.model.colors.length];
	                    };
	                    entcore_1.model.findColor = function (index) {
	                        return entcore_1.model.colors[index % entcore_1.model.colors.length];
	                    };
	                    entcore_1.model.parseBookingsAndSlots = function (rows, resourceIndex, color) {
	                        // Prepare bookings and slots
	                        var bookingIndex = {
	                            bookings: {},
	                            slots: {}
	                        };
	                        // Process
	                        entcore_1._.each(rows, function (row) {
	                            if (row.parent_booking_id === null) {
	                                // Is a Booking
	                                bookingIndex.bookings[row.id] = row;
	                                entcore_1.model.parseBooking(row, color || row.resource.type.color);
	                                // Calendar locking
	                                if (row.owner !== entcore_1.model.me.userId) {
	                                    row.locked = true;
	                                }
	                            }
	                            else {
	                                // Is a Slot
	                                if (bookingIndex.slots[row.parent_booking_id] === undefined) {
	                                    bookingIndex.slots[row.parent_booking_id] = [];
	                                }
	                                bookingIndex.slots[row.parent_booking_id].push(row);
	                                // Calendar locking
	                                row.locked = true;
	                            }
	                        });
	                        // Link bookings and slots
	                        entcore_1._.each(bookingIndex.bookings, function (booking) {
	                            if (booking.is_periodic === true) {
	                                // Link
	                                booking._slots = bookingIndex.slots[booking.id] || [];
	                                // Resolve status of periodic booking
	                                var statusCount = entcore_1._.countBy(booking._slots, function (slot) {
	                                    // link (here to avoid another loop)
	                                    slot.booking = booking;
	                                    slot.color = booking.color;
	                                    // index status
	                                    return slot.status;
	                                });
	                                if (booking._slots.length === statusCount[entcore_1.model.STATE_VALIDATED]) {
	                                    booking.status = entcore_1.model.STATE_VALIDATED;
	                                }
	                                else if (booking._slots.length === statusCount[entcore_1.model.STATE_REFUSED]) {
	                                    booking.status = entcore_1.model.STATE_REFUSED;
	                                }
	                                else if (booking._slots.length === statusCount[entcore_1.model.STATE_CREATED]) {
	                                    booking.status = entcore_1.model.STATE_CREATED;
	                                }
	                                else if (booking._slots.length === statusCount[entcore_1.model.STATE_SUSPENDED]) {
	                                    booking.status = entcore_1.model.STATE_SUSPENDED;
	                                }
	                                else {
	                                    booking.status = entcore_1.model.STATE_PARTIAL;
	                                }
	                            }
	                        });
	                        return bookingIndex;
	                    };
	                    entcore_1.model.parseBooking = function (booking, color) {
	                        booking.color = color;
	                        // periodic booking
	                        if (booking.is_periodic === true) {
	                            // parse bitmask
	                            booking.periodDays = entcore_1.model.bitMaskToDays(booking.days);
	                            // date if not by occurrences
	                            if (booking.occurrences === undefined || booking.occurrences < 1) {
	                                booking.periodicEndMoment = entcore_1.moment.utc(booking.periodic_end_date);
	                            }
	                        }
	                    };
	                    entcore_1.model.bitMaskToDays = function (bitMask) {
	                        var periodDays = [];
	                        var bits = [];
	                        if (bitMask !== undefined) {
	                            var bits_1 = (bitMask + '').split("");
	                        }
	                        entcore_1._.each(entcore_1.model.periods.days, function (day) {
	                            if (bits[day] === '1') {
	                                periodDays.push({ number: day, value: true });
	                            }
	                            else {
	                                periodDays.push({ number: day, value: false });
	                            }
	                        });
	                        return periodDays;
	                    };
	                    entcore_1.model.loadPeriods = function () {
	                        for (var occurrence = entcore_1.model.periodsConfig.occurrences.start; occurrence <= entcore_1.model.periodsConfig.occurrences.end; occurrence = occurrence + entcore_1.model.periodsConfig.occurrences.interval) {
	                            entcore_1.model.periods.occurrences.push(occurrence);
	                        }
	                    };
	                    entcore_1.model.loadStructures = function () {
	                        if (entcore_1.model.me.structures && entcore_1.model.me.structures.length > 0 && entcore_1.model.me.structureNames && entcore_1.model.me.structureNames.length > 0) {
	                            entcore_1.model.structures = [];
	                            for (var i = 0; i < entcore_1.model.me.structures.length; i++) {
	                                entcore_1.model.structures.push({
	                                    id: entcore_1.model.me.structures[i],
	                                    name: entcore_1.model.me.structureNames[i]
	                                });
	                            }
	                        }
	                        else {
	                            entcore_1.model.structures = [entcore_1.model.DETACHED_STRUCTURE];
	                        }
	                    };
	                    entcore_1.model.parseError = function (e, object, context) {
	                        var error = {};
	                        error.status = e.response.status;
	                        try {
	                            error.error = e.response.data;
	                        }
	                        catch (err) {
	                            if (error.status == 401) {
	                                error.error = "rbs.error.unauthorized";
	                            }
	                            else if (error.status == 404) {
	                                error.error = "rbs.error.notfound";
	                            }
	                            else if (e.status == 409) {
	                                error.error = "rbs.error.conflict";
	                            }
	                            else {
	                                error.error = "rbs.error.unknown";
	                            }
	                        }
	                        error.object = object;
	                        error.context = context;
	                        return error;
	                    };
	                    entcore_1.model.loadTreeState = function (cb) {
	                        axios_1.default.get('/userbook/preference/rbs')
	                            .then(function (response) {
	                            var state = (entcore_1.angular.fromJson(response.data.preference) || {}).treeState;
	                            if (typeof cb === 'function') {
	                                cb(state || []);
	                            }
	                        });
	                    };
	                    entcore_1.model.saveTreeState = function (state) {
	                        axios_1.default.put('/userbook/preference/rbs', { treeState: state });
	                    };
	                    this.loadStructures();
	                    this.loadPeriods();
	                    return [2 /*return*/];
	            }
	        });
	    });
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(6));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));
	__export(__webpack_require__(43));
	__export(__webpack_require__(44));


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	function mapToArray(map) {
	    var result = [];
	    map.forEach(function (item) {
	        result.push(item);
	    });
	    return result;
	}
	var Mix = (function () {
	    function Mix() {
	    }
	    Mix.extend = function (obj, mixin, casts) {
	        var _loop_1 = function () {
	            var value = mixin[property];
	            if (casts && casts[property] && value) {
	                var castItem = casts[property];
	                var cast_1;
	                if (castItem instanceof Function) {
	                    cast_1 = {
	                        type: castItem,
	                        deps: []
	                    };
	                }
	                else {
	                    cast_1 = {
	                        type: castItem.type,
	                        single: castItem.single,
	                        deps: castItem.deps ? castItem.deps : []
	                    };
	                }
	                var doCast_1 = function (v) {
	                    var instance = new ((_a = cast_1.type).bind.apply(_a, [void 0].concat(cast_1.deps)))();
	                    if (instance.mixin)
	                        instance.mixin(v);
	                    else
	                        Mix.extend(instance, v);
	                    return instance;
	                    var _a;
	                };
	                if (value instanceof Array && cast_1.single) {
	                    obj[property] = [];
	                    value.forEach(function (v) {
	                        obj[property].push(doCast_1(v));
	                    });
	                }
	                else {
	                    obj[property] = doCast_1(value);
	                }
	            }
	            else if (!value || typeof value !== 'object' || value instanceof Array) {
	                obj[property] = value;
	            }
	            else {
	                if (obj[property] instanceof TypedArray) {
	                    obj[property].load(value);
	                }
	                else {
	                    if (!obj[property]) {
	                        obj[property] = {};
	                    }
	                    this_1.extend(obj[property], value);
	                }
	            }
	        };
	        var this_1 = this;
	        for (var property in mixin) {
	            _loop_1();
	        }
	        if (obj && obj.fromJSON) {
	            obj.fromJSON(mixin);
	        }
	    };
	    Mix.castAs = function (className, obj, params) {
	        if (params === void 0) { params = {}; }
	        var newObj = new className(params);
	        this.extend(newObj, obj);
	        return newObj;
	    };
	    Mix.castArrayAs = function (className, arr, params) {
	        if (params === void 0) { params = {}; }
	        var newArr = [];
	        arr.forEach(function (item) {
	            newArr.push(Mix.castAs(className, item, params));
	        });
	        return newArr;
	    };
	    return Mix;
	}());
	exports.Mix = Mix;
	var TypedArray = (function (_super) {
	    __extends(TypedArray, _super);
	    function TypedArray(className, mixin) {
	        if (mixin === void 0) { mixin = {}; }
	        var _this = _super.call(this) || this;
	        _this.className = className;
	        _this.mixin = mixin;
	        return _this;
	    }
	    TypedArray.prototype.push = function () {
	        var _this = this;
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        items.forEach(function (item) {
	            if (!(item instanceof _this.className)) {
	                item = Mix.castAs(_this.className, item);
	            }
	            for (var prop in _this.mixin) {
	                item[prop] = _this.mixin[prop];
	            }
	            Array.prototype.push.call(_this, item);
	        });
	        return this.length;
	    };
	    TypedArray.prototype.load = function (data) {
	        var _this = this;
	        data.forEach(function (item) {
	            _this.push(item);
	        });
	    };
	    TypedArray.prototype.asArray = function () {
	        return mapToArray(this);
	    };
	    TypedArray.prototype.toJSON = function () {
	        return mapToArray(this);
	    };
	    return TypedArray;
	}(Array));
	exports.TypedArray = TypedArray;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	var Eventer = (function () {
	    function Eventer() {
	        this.events = new Map();
	    }
	    Eventer.prototype.trigger = function (eventName, data) {
	        if (this.events[eventName]) {
	            this.events[eventName].forEach(function (f) { return f(data); });
	        }
	    };
	    Eventer.prototype.on = function (eventName, cb) {
	        if (!this.events[eventName]) {
	            this.events[eventName] = [];
	        }
	        this.events[eventName].push(cb);
	    };
	    Eventer.prototype.off = function (eventName, cb) {
	        if (!this.events[eventName]) {
	            return;
	        }
	        if (cb === undefined) {
	            this.events[eventName] = [];
	            return;
	        }
	        var index = this.events[eventName].indexOf(cb);
	        if (index !== -1) {
	            this.events[eventName].splice(index, 1);
	        }
	    };
	    Eventer.prototype.once = function (eventName, cb) {
	        var _this = this;
	        var callback = function (data) {
	            cb(data);
	            _this.off(eventName, callback);
	        };
	        this.on(eventName, callback);
	    };
	    return Eventer;
	}());
	exports.Eventer = Eventer;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	var Selection = (function () {
	    function Selection(arr) {
	        this.arr = arr;
	        this.selectedElements = [];
	    }
	    Object.defineProperty(Selection.prototype, "all", {
	        get: function () {
	            return this.arr;
	        },
	        set: function (all) {
	            this.arr = all;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Selection.prototype.filter = function (filter) {
	        return this.arr.filter(filter);
	    };
	    Selection.prototype.push = function (item) {
	        this.arr.push(item);
	    };
	    Selection.prototype.addRange = function (arr) {
	        for (var i = 0; i < arr.length; i++) {
	            this.all.push(arr[i]);
	        }
	    };
	    Object.defineProperty(Selection.prototype, "colLength", {
	        get: function () {
	            return this.arr.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Selection.prototype, "length", {
	        get: function () {
	            return this.selected.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Selection.prototype.forEach = function (func) {
	        this.arr.forEach(func);
	    };
	    Selection.prototype.selectAll = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = true;
	        }
	    };
	    Selection.prototype.select = function (filter) {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = filter(this.arr[i]);
	        }
	    };
	    Selection.prototype.deselect = function (filter) {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = !filter(this.arr[i]);
	        }
	    };
	    Selection.prototype.deselectAll = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = false;
	        }
	    };
	    Selection.prototype.removeSelection = function () {
	        var newArr = [];
	        for (var i = 0; i < this.arr.length; i++) {
	            if (!this.arr[i].selected) {
	                newArr.push(this.arr[i]);
	            }
	        }
	        this.arr.splice(0, this.arr.length);
	        for (var i = 0; i < newArr.length; i++) {
	            this.arr.push(newArr[i]);
	        }
	    };
	    Selection.prototype.updateSelected = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            var index = this.selectedElements.indexOf(this.arr[i]);
	            if (this.arr[i].selected && index === -1) {
	                this.selectedElements.push(this.arr[i]);
	            }
	            else if (!this.arr[i].selected && index !== -1) {
	                this.selectedElements.splice(index, 1);
	            }
	        }
	        for (var i = 0; i < this.selectedElements.length; i++) {
	            var index = this.arr.indexOf(this.selectedElements[i]);
	            if (index === -1) {
	                this.selectedElements.splice(index, 1);
	            }
	        }
	    };
	    Object.defineProperty(Selection.prototype, "selected", {
	        // a specific array is maintained to avoid references breaking all the time
	        get: function () {
	            this.updateSelected();
	            return this.selectedElements;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Selection;
	}());
	exports.Selection = Selection;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(11));
	__export(__webpack_require__(12));
	__export(__webpack_require__(39));
	__export(__webpack_require__(40));
	__export(__webpack_require__(41));
	__export(__webpack_require__(42));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var minicast_1 = __webpack_require__(7);
	var AbstractCrud = (function () {
	    function AbstractCrud(api, model, initialCast, childrenCasts, customMixin) {
	        this.api = api;
	        this.model = model;
	        this.initialCast = initialCast;
	        this.childrenCasts = childrenCasts;
	        this.customMixin = customMixin;
	    }
	    AbstractCrud.prototype.parseApi = function (api, parameters) {
	        var _this = this;
	        if (typeof api === 'function') {
	            api = api();
	        }
	        return api.split(/(:[a-zA-Z0-9_.]+)/)
	            .map(function (fragment) {
	            return fragment.charAt(0) === ':' ?
	                parameters && parameters[fragment.substr(1)] ||
	                    _this.model[fragment.substr(1)] ||
	                    _this[fragment.substr(1)] ||
	                    fragment :
	                fragment;
	        }).join('');
	    };
	    AbstractCrud.prototype.defaultMixin = function (payload) {
	        var _this = this;
	        if (payload instanceof Array && this.model instanceof Array) {
	            this.model = [];
	            var model_1 = this.model; //fix type inference
	            payload.forEach(function (item) {
	                var instance = {};
	                if (_this.initialCast) {
	                    if (_this.initialCast instanceof Function) {
	                        instance = new _this.initialCast();
	                    }
	                    else {
	                        instance = new ((_a = _this.initialCast.type).bind.apply(_a, [void 0].concat(_this.initialCast.deps)))();
	                    }
	                }
	                minicast_1.Mix.extend(instance, item, _this.childrenCasts);
	                model_1.push(instance);
	                var _a;
	            });
	        }
	        else {
	            minicast_1.Mix.extend(this.model, payload, this.childrenCasts);
	        }
	    };
	    AbstractCrud.prototype.create = function (item, opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.create) {
	            throw '[Crud][Api] "create" route is undefined';
	        }
	        return this.http.post(this.parseApi(this.api.create, item), item || this.model, opts)
	            .then(function (response) {
	            if (_this.model instanceof Array) {
	                _this.model.push(item);
	            }
	            return response;
	        });
	    };
	    AbstractCrud.prototype.sync = function (opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.sync) {
	            throw '[Crud][Api] "sync" route is undefined';
	        }
	        return this.http.get(this.parseApi(this.api.sync), opts)
	            .then(function (response) {
	            (_this.customMixin || _this.defaultMixin).bind(_this)(response.data);
	            return response;
	        });
	    };
	    AbstractCrud.prototype.update = function (item, opts) {
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.update) {
	            throw '[Crud][Api] "update" route is undefined';
	        }
	        return this.http.put(this.parseApi(this.api.update, item), item || this.model, opts);
	    };
	    AbstractCrud.prototype.delete = function (item, opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.delete) {
	            throw '[Crud][Api] "delete" route is undefined';
	        }
	        return this.http.delete(this.parseApi(this.api.delete, item), opts)
	            .then(function (response) {
	            if (_this.model instanceof Array) {
	                _this.model.splice(_this.model.indexOf(item), 1);
	            }
	            return response;
	        });
	    };
	    return AbstractCrud;
	}());
	exports.AbstractCrud = AbstractCrud;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(13);
	var abstract_crud_1 = __webpack_require__(11);
	var Crud = (function (_super) {
	    __extends(Crud, _super);
	    function Crud() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Crud;
	}(abstract_crud_1.AbstractCrud));
	exports.Crud = Crud;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	var bind = __webpack_require__(16);
	var Axios = __webpack_require__(17);
	var defaults = __webpack_require__(18);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(36);
	axios.CancelToken = __webpack_require__(37);
	axios.isCancel = __webpack_require__(33);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(38);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(16);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(18);
	var utils = __webpack_require__(15);
	var InterceptorManager = __webpack_require__(30);
	var dispatchRequest = __webpack_require__(31);
	var isAbsoluteURL = __webpack_require__(34);
	var combineURLs = __webpack_require__(35);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(15);
	var normalizeHeaderName = __webpack_require__(20);
	
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(21);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(21);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(15);
	var settle = __webpack_require__(22);
	var buildURL = __webpack_require__(25);
	var parseHeaders = __webpack_require__(26);
	var isURLSameOrigin = __webpack_require__(27);
	var createError = __webpack_require__(23);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(28);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(29);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(23);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response
	    ));
	  }
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(24);
	
	/**
	 * Create an Error with the specified message, config, error code, and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, response);
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.response = response;
	  return error;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	var transformData = __webpack_require__(32);
	var isCancel = __webpack_require__(33);
	var defaults = __webpack_require__(18);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(15);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(36);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var abstract_crud_1 = __webpack_require__(11);
	var minicast_1 = __webpack_require__(7);
	var AbstractCollection = (function (_super) {
	    __extends(AbstractCollection, _super);
	    function AbstractCollection(api, initialCast, childrenCasts) {
	        var _this = _super.call(this, api, null, initialCast, childrenCasts) || this;
	        _this.data = [];
	        _this.model = _this.data;
	        _this.customMixin = _this.mixin;
	        return _this;
	    }
	    AbstractCollection.prototype.mixin = function (data) {
	        var _this = this;
	        if (!data || !(data instanceof Array)) {
	            throw "[Crud][Collection] An Array payload is expected.";
	        }
	        this.data = [];
	        data.forEach(function (item) {
	            var instance = {};
	            if (_this.initialCast) {
	                if (_this.initialCast instanceof Function) {
	                    instance = new _this.initialCast();
	                }
	                else {
	                    instance = new ((_a = _this.initialCast.type).bind.apply(_a, [void 0].concat(_this.initialCast.deps)))();
	                }
	            }
	            minicast_1.Mix.extend(instance, item, _this.childrenCasts);
	            _this.data.push(instance);
	            var _a;
	        });
	    };
	    return AbstractCollection;
	}(abstract_crud_1.AbstractCrud));
	exports.AbstractCollection = AbstractCollection;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(13);
	var abstract_collection_1 = __webpack_require__(39);
	var Collection = (function (_super) {
	    __extends(Collection, _super);
	    function Collection(api, initialCast, childrenCasts) {
	        var _this = _super.call(this, api, initialCast, childrenCasts) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Collection;
	}(abstract_collection_1.AbstractCollection));
	exports.Collection = Collection;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var abstract_crud_1 = __webpack_require__(11);
	var minicast_1 = __webpack_require__(7);
	var AbstractModel = (function (_super) {
	    __extends(AbstractModel, _super);
	    function AbstractModel(api, childrenCasts) {
	        var _this = _super.call(this, api, null, null, childrenCasts) || this;
	        _this.model = _this;
	        _this.customMixin = _this.mixin;
	        return _this;
	    }
	    AbstractModel.prototype.mixin = function (data) {
	        if (!data || !(data instanceof Object)) {
	            throw "[Crud][Collection] An Object payload is expected.";
	        }
	        minicast_1.Mix.extend(this, data, this.childrenCasts);
	    };
	    return AbstractModel;
	}(abstract_crud_1.AbstractCrud));
	exports.AbstractModel = AbstractModel;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(13);
	var abstract_model_1 = __webpack_require__(41);
	var Model = (function (_super) {
	    __extends(Model, _super);
	    function Model(api, childrenCasts) {
	        var _this = _super.call(this, api, childrenCasts) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Model;
	}(abstract_model_1.AbstractModel));
	exports.Model = Model;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var eventer_1 = __webpack_require__(8);
	var minicast_1 = __webpack_require__(7);
	var axios_1 = __webpack_require__(13);
	/*
	 * Tool to manage a single list provider used by multiple objects (to avoid multiple call to a same path)
	 * Usage :
	 * let provider = new Provider<T>(path, MyClass);
	 * function a(){
	 *    //get data from provider
	 *    let data = await provider.data();
	 * }
	 *
	 * function b(){
	 *    let data = await provider.data();
	 *    //get data when a refresh happens
	 *    provider.on('refresh', (newData) => data = newData));
	 * }
	 *
	 * //force provider refresh (after data invalidation)
	 * setTimeout(() => provider.refresh(), 50000);
	 *
	 * a();
	 * b();
	*/
	var Provider = (function () {
	    function Provider(path, className) {
	        this.path = path;
	        this.className = className;
	        this._data = [];
	        this.eventer = new eventer_1.Eventer();
	    }
	    Provider.prototype.data = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(!this.isSynced && !this.syncing))
	                            return [3 /*break*/, 2];
	                        return [4 /*yield*/, this.sync()];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2:
	                        if (!this.syncing)
	                            return [3 /*break*/, 4];
	                        return [4 /*yield*/, this.syncDone()];
	                    case 3:
	                        _a.sent();
	                        _a.label = 4;
	                    case 4: return [2 /*return*/, this._data];
	                }
	            });
	        });
	    };
	    Provider.prototype.syncDone = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator(this, function (_a) {
	                return [2 /*return*/, new Promise(function (resolve, reject) {
	                        _this.eventer.once('sync', function () { return resolve(); });
	                    })];
	            });
	        });
	    };
	    Provider.prototype.sync = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.syncing = true;
	                        return [4 /*yield*/, axios_1.default.get(this.path)];
	                    case 1:
	                        response = _a.sent();
	                        this._data = minicast_1.Mix.castArrayAs(this.className, response.data);
	                        this.isSynced = true;
	                        this.eventer.trigger('sync');
	                        this.syncing = false;
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Provider.prototype.refresh = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.isSynced = false;
	                        return [4 /*yield*/, this.sync()];
	                    case 1:
	                        _a.sent();
	                        this.eventer.trigger('refresh');
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Provider.prototype.push = function (data) {
	        this._data.push(data);
	    };
	    Provider.prototype.remove = function (data) {
	        var index = this._data.indexOf(data);
	        this._data.splice(index, 1);
	    };
	    return Provider;
	}());
	exports.Provider = Provider;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var axios_1 = __webpack_require__(13);
	var autosaved = [];
	var loopStarted = false;
	var token;
	var loop = function () {
	    autosaved.forEach(function (item) {
	        if (item._backup !== JSON.stringify(item.model)) {
	            if (item.fn) {
	                item.fn();
	            }
	            else {
	                axios_1.default[item.method](item.path, item.model);
	            }
	            item._backup = JSON.stringify(item.model);
	        }
	    });
	    loopStarted = true;
	    token = setTimeout(loop, 500);
	};
	var Autosave = (function () {
	    function Autosave() {
	    }
	    Autosave.watch = function (path, model, method) {
	        if (method === void 0) { method = 'put'; }
	        if (autosaved.findIndex(function (e) { return e.model === model && e.path === path; }) !== -1) {
	            return;
	        }
	        var autosave;
	        if (typeof path === 'string') {
	            autosave = {
	                model: model,
	                path: path,
	                method: method
	            };
	        }
	        else {
	            autosave = {
	                model: model,
	                fn: path,
	                method: method
	            };
	        }
	        autosaved.push(autosave);
	        if (!loopStarted) {
	            loop();
	        }
	    };
	    Autosave.unwatch = function (model) {
	        var index = autosaved.findIndex(function (e) { return e.model === model; });
	        autosaved.splice(index, 1);
	        if (autosaved.length === 0) {
	            this.unwatchAll();
	        }
	    };
	    Autosave.unwatchAll = function () {
	        autosaved = [];
	        clearTimeout(token);
	        loopStarted = false;
	    };
	    return Autosave;
	}());
	exports.Autosave = Autosave;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(46);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	var bind = __webpack_require__(48);
	var Axios = __webpack_require__(50);
	var defaults = __webpack_require__(51);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(68);
	axios.CancelToken = __webpack_require__(69);
	axios.isCancel = __webpack_require__(65);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(70);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(48);
	var isBuffer = __webpack_require__(49);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */
	
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}
	
	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}
	
	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(51);
	var utils = __webpack_require__(47);
	var InterceptorManager = __webpack_require__(62);
	var dispatchRequest = __webpack_require__(63);
	var isAbsoluteURL = __webpack_require__(66);
	var combineURLs = __webpack_require__(67);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(47);
	var normalizeHeaderName = __webpack_require__(52);
	
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(53);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(53);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(47);
	var settle = __webpack_require__(54);
	var buildURL = __webpack_require__(57);
	var parseHeaders = __webpack_require__(58);
	var isURLSameOrigin = __webpack_require__(59);
	var createError = __webpack_require__(55);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(60);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
	        request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(61);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(55);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(56);
	
	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 60 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	var transformData = __webpack_require__(64);
	var isCancel = __webpack_require__(65);
	var defaults = __webpack_require__(51);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(47);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(68);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(5);
	var axios_1 = __webpack_require__(45);
	var Booking = (function () {
	    function Booking(book) {
	        // this.resource = new Resource(); // TODO Infinite loop with New Resource() calling bookings.sync calling new Booking callin new Resource
	        this.eventer = new entcore_toolkit_1.Eventer();
	        if (book) {
	            entcore_toolkit_1.Mix.extend(this, book);
	            this.beginning = this.startMoment = entcore_1.moment.utc(book.start_date);
	            this.end = this.endMoment = entcore_1.moment.utc(book.end_date);
	        }
	        else {
	            var startDate = void 0;
	            if (this.start_date) {
	                var aStartDate = this.start_date.split("T");
	                if (aStartDate.length === 2) {
	                    startDate = entcore_1.moment(aStartDate[0]);
	                    startDate.set('hour', aStartDate[1].split(":")[0]);
	                    startDate.set('minute', aStartDate[1].split(":")[1]);
	                }
	            }
	            if (!startDate) {
	                startDate = entcore_1.moment();
	            }
	            var endDate = void 0;
	            if (this.end_date) {
	                var aEndDate = this.end_date.split("T");
	                if (aEndDate.length === 2) {
	                    endDate = entcore_1.moment(aEndDate[0]);
	                    endDate.set('hour', aEndDate[1].split(":")[0]);
	                    endDate.set('minute', aEndDate[1].split(":")[1]);
	                }
	            }
	            if (!endDate) {
	                endDate = entcore_1.moment();
	            }
	            this.beginning = this.startMoment = startDate;
	            this.end = this.endMoment = endDate;
	        }
	    }
	    Booking.prototype.save = function (cb, cbe) {
	        if (this.id) {
	            this.update(cb, cbe);
	        }
	        else {
	            this.create(cb, cbe);
	        }
	    };
	    ;
	    Booking.prototype.retrieve = function (id, cb, cbe) {
	        var booking = this;
	        axios_1.default.get('/rbs/booking/' + id)
	            .then(function (response) {
	            if (typeof cb === 'function') {
	                cb(response.data.start_date);
	            }
	        }.bind(this))
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, 'retrieve'));
	            }
	        });
	    };
	    ;
	    Booking.prototype.calendarUpdate = function (cb, cbe) {
	        if (this.beginning) {
	            this.slots = [{
	                    start_date: this.beginning.unix(),
	                    end_date: this.end.unix()
	                }];
	        }
	        if (this.id) {
	            this.update(function () {
	                entcore_1.model.refresh();
	            }, function (error) {
	                // notify
	                entcore_1.model.refresh();
	            });
	        }
	        else {
	            this.create(function () {
	                entcore_1.model.refresh();
	            }, function (error) {
	                // notify
	                entcore_1.model.refresh();
	            });
	        }
	    };
	    ;
	    Booking.prototype.update = function (cb, cbe) {
	        var url = '/rbs/resource/' + this.resource.id + '/booking/' + this.id;
	        if (this.is_periodic === true) {
	            url = url + '/periodic';
	        }
	        var booking = this;
	        axios_1.default.put(url, this)
	            .then(function () {
	            this.status = entcore_1.model.STATE_CREATED;
	            if (typeof cb === 'function') {
	                cb();
	            }
	            this.eventer.trigger('change');
	        }.bind(this))
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, 'update'));
	            }
	        });
	    };
	    ;
	    Booking.prototype.create = function (cb, cbe) {
	        var url = '/rbs/resource/' + this.resource.id + '/booking';
	        if (this.is_periodic === true) {
	            url = url + '/periodic';
	        }
	        var booking = this;
	        axios_1.default.post(url, this)
	            .then(function (b) {
	            entcore_toolkit_1.Mix.extend(booking, b);
	            booking.resource.bookings.push(booking);
	            entcore_1.model.bookings.pushAll([booking]);
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, 'create'));
	            }
	        });
	    };
	    ;
	    Booking.prototype.validate = function (cb, cbe) {
	        this.status = entcore_1.model.STATE_VALIDATED;
	        var data = {
	            status: this.status
	        };
	        this.process(data, cb, cbe, 'validate');
	    };
	    ;
	    Booking.prototype.refuse = function (cb, cbe) {
	        this.status = entcore_1.model.STATE_REFUSED;
	        var data = {
	            status: this.status,
	            refusal_reason: this.refusal_reason
	        };
	        this.process(data, cb, cbe, 'refuse');
	    };
	    ;
	    Booking.prototype.process = function (data, cb, cbe, context) {
	        var booking = this;
	        axios_1.default.put('/rbs/resource/' + this.resource.id + '/booking/' + this.id + '/process', data)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, context));
	            }
	        });
	    };
	    ;
	    Booking.prototype.delete = function (cb, cbe) {
	        var booking = this;
	        axios_1.default.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/false")
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, 'delete'));
	            }
	        });
	    };
	    ;
	    Booking.prototype.deletePeriodicCurrentToFuture = function (cb, cbe) {
	        var booking = this;
	        axios_1.default.delete('/rbs/resource/' + this.resource.id + '/booking/' + this.id + "/true")
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, booking, 'delete'));
	            }
	        });
	    };
	    ;
	    Booking.prototype.showSlots = function () {
	        this.slots = this._slots;
	    };
	    ;
	    Booking.prototype.selectAllSlots = function () {
	        entcore_1._.each(this._slots, function (slot) {
	            slot.selected = true;
	        });
	    };
	    ;
	    Booking.prototype.deselectAllSlots = function () {
	        entcore_1._.each(this._slots, function (slot) {
	            slot.selected = undefined;
	        });
	    };
	    ;
	    Booking.prototype.hideSlots = function () {
	        this.slots = [];
	        entcore_1._.each(this._slots, function (slot) {
	            slot.selected = undefined;
	        });
	    };
	    ;
	    Booking.prototype.isSlot = function () {
	        return this.parent_booking_id !== null;
	    };
	    ;
	    Booking.prototype.isBooking = function () {
	        return this.parent_booking_id === null;
	    };
	    ;
	    Booking.prototype.isNotPeriodicRoot = function () {
	        return this.is_periodic !== true;
	    };
	    ;
	    Booking.prototype.isPending = function () {
	        return this.status === entcore_1.model.STATE_CREATED;
	    };
	    ;
	    Booking.prototype.isValidated = function () {
	        return this.status === entcore_1.model.STATE_VALIDATED;
	    };
	    ;
	    Booking.prototype.isRefused = function () {
	        return this.status === entcore_1.model.STATE_REFUSED;
	    };
	    ;
	    Booking.prototype.isPartial = function () {
	        return this.status === entcore_1.model.STATE_PARTIAL;
	    };
	    ;
	    Booking.prototype.isSuspended = function () {
	        return this.status === entcore_1.model.STATE_SUSPENDED;
	    };
	    ;
	    Booking.prototype.hasAtLeastOnePendingSlot = function () {
	        return this._slots.some(function (slot) {
	            return slot.isPending();
	        });
	    };
	    ;
	    Booking.prototype.hasAtLeastOneSuspendedSlot = function () {
	        return this._slots.some(function (slot) {
	            return slot.isSuspended();
	        });
	    };
	    ;
	    Booking.prototype.toJSON = function () {
	        var json = {
	            slots: this.slots
	        };
	        if (this.is_periodic === true) {
	            json.periodicity = this.periodicity;
	            json.days = entcore_1._.pluck(entcore_1._.sortBy(this.periodDays, function (day) { return day.number; }), 'value');
	            if (this.occurrences !== undefined && this.occurrences > 0) {
	                json.occurrences = this.occurrences;
	            }
	            else {
	                json.periodic_end_date = this.periodicEndMoment.utc().unix();
	            }
	        }
	        if (entcore_1._.isString(this.booking_reason)) {
	            json.booking_reason = this.booking_reason;
	        }
	        return json;
	    };
	    ;
	    return Booking;
	}());
	exports.Booking = Booking;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(5);
	var axios_1 = __webpack_require__(45);
	var index_1 = __webpack_require__(3);
	var Bookings = (function (_super) {
	    __extends(Bookings, _super);
	    function Bookings() {
	        var _this = _super.call(this, []) || this;
	        _this.filters = {
	            mine: undefined,
	            unprocessed: undefined,
	            booking: undefined,
	            dates: undefined,
	            startMoment: undefined,
	            endMoment: undefined
	        };
	        _this.eventer = new entcore_toolkit_1.Eventer();
	        return _this;
	    }
	    ;
	    Bookings.prototype.sync = function (callback, startDate, endDate) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            var newArr;
	            return __generator(this, function (_a) {
	                newArr = [];
	                if (startDate) {
	                    axios_1.default.get('/rbs/bookings/all/' + startDate.format('YYYY-MM-DD') +
	                        '/' + endDate.format('YYYY-MM-DD'))
	                        .then(function (bookings) {
	                        entcore_1._.forEach(bookings.data, function (booking) {
	                            newArr.push(new index_1.Booking(booking));
	                        });
	                        _this.all = newArr;
	                        if (typeof callback === 'function') {
	                            callback();
	                        }
	                        _this.eventer.trigger('sync');
	                    });
	                }
	                else {
	                    axios_1.default.get('/rbs/bookings/all/' + entcore_1.model.bookings.startPagingDate.format('YYYY-MM-DD') +
	                        '/' + entcore_1.model.bookings.endPagingDate.format('YYYY-MM-DD'))
	                        .then(function (bookings) {
	                        entcore_1._.forEach(bookings.data, function (booking) {
	                            newArr.push(new index_1.Booking(booking));
	                        });
	                        _this.all = newArr;
	                        if (typeof callback === 'function') {
	                            callback();
	                        }
	                        _this.eventer.trigger('sync');
	                    });
	                }
	                return [2 /*return*/];
	            });
	        });
	    };
	    ;
	    Bookings.prototype.syncForShowList = function (callback) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator(this, function (_a) {
	                axios_1.default.get('/rbs/bookings/all')
	                    .then(function (bookings) {
	                    var newArr = [];
	                    entcore_1._.forEach(bookings.data, function (booking) {
	                        newArr.push(new index_1.Booking(booking));
	                    });
	                    _this.all = newArr;
	                    if (typeof callback === 'function') {
	                        callback();
	                    }
	                    _this.eventer.trigger('sync');
	                });
	                return [2 /*return*/];
	            });
	        });
	    };
	    ;
	    Bookings.prototype.selectionForProcess = function () {
	        return entcore_1._.filter(this.selected, function (booking) {
	            return booking.isNotPeriodicRoot();
	        });
	    };
	    ;
	    Bookings.prototype.selectionForDelete = function () {
	        return entcore_1._.filter(this.selected, function (booking) {
	            return booking.isBooking();
	        });
	    };
	    ;
	    Bookings.prototype.selectAllBookings = function () {
	        entcore_1._.forEach(this.all, function (booking) {
	            if (booking.isBooking()) {
	                booking.selected = true;
	            }
	            if (booking.expanded === true) {
	                booking.selectAllSlots();
	            }
	        });
	    };
	    ;
	    Bookings.prototype.pushAll = function (datas, trigger) {
	        if (datas) {
	            this.all = entcore_1._.union(this.all, datas);
	            if (trigger) {
	                this.eventer.trigger('sync');
	            }
	            this.applyFilters();
	        }
	    };
	    ;
	    Bookings.prototype.pullAll = function (datas, trigger) {
	        if (datas) {
	            this.all = entcore_1._.difference(this.all, datas);
	            if (trigger) {
	                this.eventer.trigger('sync');
	            }
	        }
	    };
	    ;
	    Bookings.prototype.clear = function (trigger) {
	        this.all = [];
	        if (trigger) {
	            this.eventer.trigger('sync');
	        }
	    };
	    ;
	    Bookings.prototype.selectionResources = function () {
	        //returning the new array systematically breaks the watcher
	        //due to the reference always being updated
	        var currentResourcesSelection = entcore_1._.pluck(this.selected, 'resource') || [];
	        if (!this._selectionResources || this._selectionResources.length !== currentResourcesSelection.length) {
	            this._selectionResources = currentResourcesSelection;
	        }
	        return this._selectionResources;
	    };
	    ;
	    Bookings.prototype.loadSlots = function (booking, callback) {
	        axios_1.default.get('/rbs/bookings/full/slots/' + booking.parent_booking_id)
	            .then(function (bookings) {
	            //do not add data already loading with inital load
	            var ids = [];
	            var slots = booking.booking._slots;
	            slots.forEach(function (book) {
	                ids.push(book.id);
	            });
	            //check status
	            var setStatus = new Set();
	            bookings.data.forEach(function (book) {
	                var bb = new index_1.Booking(book);
	                bb.color = booking.color;
	                bb.resource = booking.resource;
	                setStatus.add(book.status);
	                if (ids.indexOf(bb.id) === -1) {
	                    entcore_1.model.bookings.push(bb);
	                    slots.push(bb);
	                }
	            });
	            booking.booking.status = (setStatus.size === 1) ? setStatus.values().next().value : entcore_1.model.STATE_PARTIAL;
	            booking.booking._slots = slots;
	            if (typeof callback === 'function') {
	                callback();
	            }
	        });
	    };
	    ;
	    Bookings.prototype.applyFilters = function () {
	        if (this.filters.booking === true) {
	            if (this.filters.dates !== undefined) {
	                if (this.filters.mine === true) {
	                    if (this.filters.unprocessed === true) {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && booking.owner === entcore_1.model.me.userId
	                                && (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL)
	                                && ((booking.is_periodic !== true
	                                    && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                    && booking.endMoment.isAfter(entcore_1.model.bookings.filters.startMoment))
	                                    || (booking.is_periodic === true
	                                        && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                        && (entcore_1._.last(booking._slots)).endMoment.isAfter(entcore_1.model.bookings.filters.startMoment)));
	                        });
	                    }
	                    else {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && booking.owner === entcore_1.model.me.userId
	                                && ((booking.is_periodic !== true
	                                    && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                    && booking.endMoment.isAfter(entcore_1.model.bookings.filters.startMoment))
	                                    || (booking.is_periodic === true
	                                        && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                        && (entcore_1._.last(booking._slots)).endMoment.isAfter(entcore_1.model.bookings.filters.startMoment)));
	                        });
	                    }
	                }
	                else {
	                    if (this.filters.unprocessed === true) {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL)
	                                && ((booking.is_periodic !== true
	                                    && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                    && booking.endMoment.isAfter(entcore_1.model.bookings.filters.startMoment))
	                                    || (booking.is_periodic === true
	                                        && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                        && (entcore_1._.last(booking._slots)).endMoment.isAfter(entcore_1.model.bookings.filters.startMoment)));
	                        });
	                    }
	                    else {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && ((booking.is_periodic !== true
	                                    && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                    && booking.endMoment.isAfter(entcore_1.model.bookings.filters.startMoment))
	                                    || (booking.is_periodic === true
	                                        && booking.startMoment.isBefore(entcore_1.model.bookings.filters.endMoment)
	                                        && (entcore_1._.last(booking._slots)).endMoment.isAfter(entcore_1.model.bookings.filters.startMoment)));
	                        });
	                    }
	                }
	            }
	            else {
	                if (this.filters.mine === true) {
	                    if (this.filters.unprocessed === true) {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && booking.owner === entcore_1.model.me.userId
	                                && (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL);
	                        });
	                    }
	                    else {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && booking.owner === entcore_1.model.me.userId;
	                        });
	                    }
	                }
	                else {
	                    if (this.filters.unprocessed === true) {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected
	                                && (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL);
	                        });
	                    }
	                    else {
	                        this.filtered = entcore_1._.filter(this.all, function (booking) {
	                            return booking.isBooking()
	                                && booking.resource
	                                && booking.resource.selected;
	                        });
	                    }
	                }
	            }
	        }
	        else {
	            if (this.filters.mine === true) {
	                if (this.filters.unprocessed === true) {
	                    this.filtered = entcore_1._.filter(this.all, function (booking) {
	                        return booking.owner === entcore_1.model.me.userId
	                            && booking.resource
	                            && booking.resource.selected
	                            && (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL);
	                    });
	                }
	                else {
	                    this.filtered = entcore_1._.filter(this.all, function (booking) {
	                        return booking.owner === entcore_1.model.me.userId
	                            && booking.resource
	                            && booking.resource.selected;
	                    });
	                }
	            }
	            else {
	                if (this.filters.unprocessed === true) {
	                    this.filtered = entcore_1._.filter(this.all, function (booking) {
	                        return (booking.status === entcore_1.model.STATE_CREATED || booking.status === entcore_1.model.STATE_PARTIAL)
	                            && booking.resource
	                            && booking.resource.selected;
	                    });
	                }
	                else {
	                    this.filtered = entcore_1._.filter(this.all, function (booking) {
	                        return booking.resource && booking.resource.selected;
	                    });
	                }
	            }
	        }
	        entcore_1.model.eventer.trigger('change');
	    };
	    ;
	    return Bookings;
	}(entcore_toolkit_1.Selection));
	exports.Bookings = Bookings;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(5);
	var axios_1 = __webpack_require__(45);
	var index_1 = __webpack_require__(3);
	var Resource = (function () {
	    function Resource(data) {
	        this.bookings = new index_1.Bookings();
	        this.rights = new entcore_1.Rights(this); //TODO rights doesn't have the right value when it should
	        this.rights.fromBehaviours();
	        if (data) {
	            entcore_toolkit_1.Mix.extend(this, data);
	        }
	        entcore_1.model.bookings.sync();
	    }
	    ;
	    Object.defineProperty(Resource.prototype, "myRights", {
	        get: function () {
	            return this.rights.myRights;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Resource.prototype.save = function (cb, cbe) {
	        if (this.id) {
	            this.update(cb, cbe);
	        }
	        else {
	            this.create(cb, cbe);
	        }
	    };
	    ;
	    Resource.prototype.update = function (cb, cbe) {
	        var resource = this;
	        var originalTypeId = this.type_id;
	        this.type_id = this.type.id;
	        axios_1.default.put('/rbs/resource/' + this.id, this)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, resource, 'update'));
	            }
	        });
	    };
	    ;
	    Resource.prototype.create = function (cb, cbe) {
	        var resource = this;
	        this.was_available = undefined;
	        axios_1.default.post('/rbs/type/' + this.type.id + '/resource', this)
	            .then(function (r) {
	            // Update collections
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, resource, 'create'));
	            }
	        });
	    };
	    ;
	    Resource.prototype.delete = function (cb, cbe) {
	        var resource = this;
	        axios_1.default.delete('/rbs/resource/' + this.id)
	            .then(function () {
	            var resourceType = resource.type;
	            var index_resource = resourceType.resources.all.indexOf(resource);
	            if (index_resource !== -1) {
	                resourceType.resources.all.splice(index_resource, 1);
	            }
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, resource, 'delete'));
	            }
	        });
	    };
	    ;
	    Resource.prototype.toJSON = function () {
	        var json = {
	            name: this.name,
	            periodic_booking: this.periodic_booking,
	            is_available: this.is_available,
	            type_id: this.type_id,
	            min_delay: (this.hasMinDelay) ? this.min_delay : undefined,
	            max_delay: (this.hasMaxDelay) ? this.max_delay : undefined,
	            color: this.color,
	            validation: this.validation
	        };
	        if (this.was_available !== undefined) {
	            json.was_available = this.was_available;
	        }
	        if (entcore_1._.isString(this.description)) {
	            json.description = this.description;
	        }
	        return json;
	    };
	    ;
	    Resource.prototype.isBookable = function (periodic) {
	        return this.is_available === true
	            && (!periodic || this.periodic_booking);
	    };
	    ;
	    Resource.prototype.syncBookings = function (cb) {
	        var _this = this;
	        this.bookings.all = entcore_1._.where(entcore_1.model.bookings.all, { resource_id: this.id });
	        entcore_1._.forEach(this.bookings.all, function (booking) {
	            booking.resource = _this;
	        });
	        var resourceIndex = {};
	        resourceIndex[this.id] = this;
	        var bookingIndex = entcore_1.model.parseBookingsAndSlots(this.bookings.all, resourceIndex);
	        if (typeof cb === 'function') {
	            cb();
	        }
	    };
	    ;
	    return Resource;
	}());
	exports.Resource = Resource;
	var Resources = (function (_super) {
	    __extends(Resources, _super);
	    function Resources() {
	        return _super.call(this, []) || this;
	    }
	    Resources.prototype.filterAvailable = function (periodic) {
	        return this.filter(function (resource) {
	            return resource.isBookable(periodic);
	        });
	    };
	    ;
	    Resources.prototype.collapseAll = function () {
	        entcore_1._.forEach(this.all, function (resource) {
	            if (resource.expanded === true) {
	                resource.expanded = undefined;
	            }
	        });
	    };
	    ;
	    return Resources;
	}(entcore_toolkit_1.Selection));
	exports.Resources = Resources;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(5);
	var axios_1 = __webpack_require__(45);
	var index_1 = __webpack_require__(3);
	var ResourceType = (function () {
	    function ResourceType(data) {
	        this.resources = new index_1.Resources();
	        this.rights = new entcore_1.Rights(this);
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
	    }
	    ;
	    Object.defineProperty(ResourceType.prototype, "myRights", {
	        get: function () {
	            return this.rights.myRights;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ResourceType.prototype.save = function (cb, cbe) {
	        if (this.id) {
	            this.update(cb, cbe);
	        }
	        else {
	            this.create(cb, cbe);
	        }
	    };
	    ;
	    ResourceType.prototype.update = function (cb, cbe) {
	        var _this = this;
	        axios_1.default.put('/rbs/type/' + this.id, this)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, _this, 'update'));
	            }
	        });
	    };
	    ;
	    ResourceType.prototype.create = function (cb, cbe) {
	        var _this = this;
	        this.school_id = this.structure.id;
	        axios_1.default.post('/rbs/type', this)
	            .then(function (t) {
	            entcore_toolkit_1.Mix.extend(_this, t);
	            _this._id = _this.id;
	            // Update collections
	            entcore_1.model.resourceTypes.push(_this);
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, this, 'create'));
	            }
	        });
	    };
	    ;
	    ResourceType.prototype.delete = function (cb, cbe) {
	        var _this = this;
	        axios_1.default.delete('/rbs/type/' + this.id)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, _this, 'delete'));
	            }
	        });
	    };
	    ;
	    ResourceType.prototype.getModerators = function (callback) {
	        var _this = this;
	        axios_1.default.get('/rbs/type/' + this.id + '/moderators')
	            .then(function (response) {
	            _this.moderators = response.data;
	            if (typeof callback === 'function') {
	                callback();
	            }
	        });
	    };
	    ;
	    ResourceType.prototype.toJSON = function () {
	        if (this.extendcolor === null) {
	            this.extendcolor = false;
	        }
	        var json = {
	            name: this.name,
	            validation: this.validation,
	            color: this.color,
	            extendcolor: this.extendcolor
	        };
	        // Send school id only at creation
	        if (!this.id) {
	            json.school_id = this.school_id;
	        }
	        if (this.slotprofile) {
	            json.slotprofile = this.slotprofile;
	        }
	        return json;
	    };
	    ;
	    return ResourceType;
	}());
	exports.ResourceType = ResourceType;
	var ResourceTypes = (function (_super) {
	    __extends(ResourceTypes, _super);
	    function ResourceTypes() {
	        var _this = _super.call(this, []) || this;
	        _this.all = [];
	        _this.eventer = new entcore_toolkit_1.Eventer();
	        return _this;
	    }
	    ;
	    ResourceTypes.prototype.sync = function () {
	        var _this = this;
	        // Load the ResourceTypes
	        axios_1.default.get('/rbs/types')
	            .then(function (result) {
	            var resourceTypes = result.data;
	            var index = 0;
	            // Auto-associate colors to Types
	            entcore_1._.each(resourceTypes, function (resourceType) {
	                // Resolve the structure if possible
	                var structure = entcore_1._.find(entcore_1.model.structures, function (s) {
	                    return s.id === resourceType.school_id;
	                });
	                resourceType.structure = structure || entcore_1.model.DETACHED_STRUCTURE;
	                // Auto-associate colors to Types
	                if (resourceType.color == null) {
	                    resourceType.color = entcore_1.model.findColor(index);
	                    entcore_1.model.LAST_DEFAULT_COLOR = resourceType.color;
	                    index++;
	                }
	                else {
	                    var nbCouleur_1 = 0;
	                    resourceTypes.forEach(function (resourceType) {
	                        if (entcore_1.model.colors.indexOf(resourceType.color) !== -1) {
	                            nbCouleur_1++;
	                        }
	                    });
	                    entcore_1.model.LAST_DEFAULT_COLOR = entcore_1.model.findColor(nbCouleur_1);
	                    index = nbCouleur_1 + 1;
	                }
	                resourceType._id = resourceType.id;
	                if (resourceType.slotprofile === null) {
	                    resourceType.slotprofile = undefined;
	                }
	                resourceType.expanded = true;
	            });
	            // Fill the ResourceType collection and prepare the index
	            var resourceTypeIndex = {};
	            _this.all = resourceTypes;
	            entcore_1._.forEach(_this.all, function (resourceType) {
	                resourceType.resources = new index_1.Resources();
	                resourceType.resources.all = [];
	                resourceTypeIndex[resourceType.id] = resourceType;
	            });
	            // Load the Resources in each ResourceType
	            axios_1.default.get('/rbs/resources')
	                .then(function (result) {
	                var resources = result.data;
	                var actions = (resources !== undefined ? resources.length : 0);
	                entcore_1._.forEach(resources, function (resource) {
	                    var newResource = entcore_toolkit_1.Mix.castAs(index_1.Resource, resource);
	                    // Load the ResourceType's collection with associated Resource
	                    var resourceType = resourceTypeIndex[newResource.type_id];
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
	                        entcore_1.model.resourceTypes.all[0].resources.selectAll();
	                        entcore_1._.forEach(entcore_1.model.bookings.all, function (booking) {
	                            entcore_1.Behaviours.applicationsBehaviours.rbs.resourceRights(booking);
	                        });
	                        _this.eventer.trigger('sync');
	                        entcore_1.model.bookings.applyFilters();
	                    }
	                });
	            });
	        });
	    };
	    ;
	    ResourceTypes.prototype.filterAvailable = function (periodic) {
	        return this.filter(function (resourceType) {
	            return (resourceType.myRights !== undefined
	                && resourceType.myRights.contrib !== undefined);
	        });
	    };
	    ;
	    ResourceTypes.prototype.deselectAllResources = function () {
	        entcore_1._.forEach(this.all, function (resourceType) {
	            resourceType.resources.deselectAll();
	        });
	    };
	    ;
	    ResourceTypes.prototype.removeSelectedTypes = function () {
	        entcore_1._.forEach(this.selected, function (resourceType) {
	            var rtype = new ResourceType();
	            rtype.id = resourceType.id;
	            rtype.delete();
	        });
	        this.removeSelection();
	    };
	    ;
	    return ResourceTypes;
	}(entcore_toolkit_1.Selection));
	exports.ResourceTypes = ResourceTypes;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var SelectionHolder = (function () {
	    function SelectionHolder() {
	        this.resources = [];
	        this.resourceTypes = [];
	    }
	    ;
	    SelectionHolder.prototype.record = function (resourceTypeCallback, resourceCallback) {
	        this.mine = (entcore_1.model.bookings.filters.mine === true ? true : undefined);
	        this.unprocessed = (entcore_1.model.bookings.filters.unprocessed === true ? true : undefined);
	        this.currentType = ((entcore_1.model.resourceTypes.current !== undefined && entcore_1.model.resourceTypes.current !== null) ? entcore_1.model.resourceTypes.current.id : undefined);
	        var typeRecords = [];
	        var resourceRecords = [];
	        entcore_1._.forEach(entcore_1.model.resourceTypes.all, function (resourceType) {
	            if (resourceType.expanded === true) {
	                typeRecords[resourceType.id] = true;
	                if (typeof resourceTypeCallback === 'function') {
	                    resourceTypeCallback(resourceType);
	                }
	            }
	            entcore_1._.forEach(entcore_1.model.resourceTypes.all, function (resource) {
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
	    ;
	    SelectionHolder.prototype.restore = function (resourceTypeCallback, resourceCallback) {
	        var _this = this;
	        var typeRecords = this.resourceTypes || [];
	        var resourceRecords = this.resources || [];
	        // First resourceType initial selection if enabled
	        if (this.firstResourceType === true && entcore_1.model.resourceTypes.all.length > 0) {
	            typeRecords = [];
	            typeRecords[entcore_1.model.resourceTypes.all[0].id] = true;
	            resourceRecords = [];
	            entcore_1._.forEach(entcore_1.model.resourceTypes.all[0].resources.all, function (resource) {
	                resourceRecords[resource.id] = true;
	            });
	            this.firstResourceType = undefined;
	        }
	        // Apply recorded booking filters
	        entcore_1.model.bookings.filters.mine = (this.mine === true ? true : undefined);
	        entcore_1.model.bookings.filters.unprocessed = (this.unprocessed === true ? true : undefined);
	        entcore_1._.forEach(entcore_1.model.resourceTypes.all, function (resourceType) {
	            if (typeRecords[resourceType.id] || _this.allResources === true) {
	                resourceType.expanded = true;
	            }
	            if (resourceType.id === _this.currentType) {
	                entcore_1.model.resourceTypes.current = resourceType;
	                if (typeof resourceTypeCallback === 'function') {
	                    resourceTypeCallback(resourceType);
	                }
	            }
	            entcore_1._.forEach(resourceType.resources.all, function (resource) {
	                if (resourceRecords[resource.id] || _this.allResources === true) {
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
	    ;
	    return SelectionHolder;
	}());
	exports.SelectionHolder = SelectionHolder;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var axios_1 = __webpack_require__(45);
	var ExportBooking = (function () {
	    function ExportBooking() {
	        this.format = "PDF";
	        this.exportView = "WEEK";
	        this.startDate = entcore_1.moment().day(1).toDate();
	        this.endDate = entcore_1.moment().day(7).toDate();
	        this.resources = [];
	        this.resourcesToTake = "selected";
	    }
	    ExportBooking.prototype.toJSON = function () {
	        return {
	            format: this.format.toUpperCase(),
	            view: this.exportView,
	            startdate: this.startDate,
	            enddate: this.endDate,
	            resourceIds: this.resources
	        };
	    };
	    ;
	    ExportBooking.prototype.send = function (cb, cbe) {
	        var exportBooking = this;
	        return axios_1.default.post('/rbs/bookings/export', this)
	            .then(function (data) {
	            entcore_1.model.returnData(cb, [data.data]);
	        }).catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, exportBooking, 'create'));
	            }
	        });
	    };
	    ;
	    return ExportBooking;
	}());
	exports.ExportBooking = ExportBooking;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var axios_1 = __webpack_require__(45);
	var SlotProfile = (function () {
	    function SlotProfile() {
	    }
	    ;
	    SlotProfile.prototype.getSlotProfiles = function (structId, callback) {
	        return axios_1.default.get('/rbs/slotprofiles/schools/' + structId)
	            .then(function (data) {
	            entcore_1.model.returnData(callback, [data.data]);
	        }).catch(function (e) {
	            var error = e.response.data;
	            entcore_1.notify.error(error.error);
	        });
	    };
	    ;
	    SlotProfile.prototype.getSlots = function (slotProfileId, callback) {
	        return axios_1.default.get('/rbs/slotprofiles/' + slotProfileId + '/slots')
	            .then(function (data) {
	            entcore_1.model.returnData(callback, [data.data]);
	        }).catch(function (e) {
	            var error = e.response.data;
	            entcore_1.notify.error(error.error);
	        });
	    };
	    ;
	    return SlotProfile;
	}());
	exports.SlotProfile = SlotProfile;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var axios_1 = __webpack_require__(45);
	var Notification = (function () {
	    function Notification() {
	    }
	    ;
	    Notification.prototype.getNotifications = function (cb) {
	        return axios_1.default.get('/rbs/resource/notifications')
	            .then(function (data) {
	            entcore_1.model.returnData(cb, [data.data]);
	        }).catch(function (e) {
	            if (e.responseText) {
	                var error = JSON.parse(e.responseText);
	                entcore_1.notify.error(error.error);
	            }
	        });
	    };
	    ;
	    Notification.prototype.postNotification = function (id, cb, cbe) {
	        var notif = this;
	        return axios_1.default.post('/rbs/resource/notification/add/' + id)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, notif, 'create'));
	            }
	        });
	    };
	    ;
	    Notification.prototype.postNotifications = function (id, cb, cbe) {
	        var notif = this;
	        return axios_1.default.post('/rbs/type/notification/add/' + id)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, notif, 'create'));
	            }
	        });
	    };
	    ;
	    Notification.prototype.removeNotification = function (id, cb, cbe) {
	        return axios_1.default.delete('/rbs/resource/notification/remove/' + id)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, this, 'delete'));
	            }
	        });
	    };
	    ;
	    Notification.prototype.removeNotifications = function (id, cb, cbe) {
	        return axios_1.default.delete('/rbs/type/notification/remove/' + id)
	            .then(function () {
	            if (typeof cb === 'function') {
	                cb();
	            }
	        })
	            .catch(function (e) {
	            if (typeof cbe === 'function') {
	                cbe(entcore_1.model.parseError(e, this, 'delete'));
	            }
	        });
	    };
	    ;
	    return Notification;
	}());
	exports.Notification = Notification;


/***/ })
/******/ ]);
//# sourceMappingURL=behaviours.js.map