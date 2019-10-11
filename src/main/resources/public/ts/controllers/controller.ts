import {_, idiom as lang, moment, ng, notify, template} from "entcore";
import {
    Booking,
    Resource,
    ExportBooking,
    Structure,
    Structures,
    ResourceType,
    Slot, Slots,
    SlotProfile, SlotProfiles,
    ResourceTypes,
    Bookings,
    Utils,
    Notification,
    Preference,
    Resources
} from "../model";
import {
    PERIODS,
    LAST_DEFAULT_COLOR,
    DETACHED_STRUCTURE,
    DISPLAY_BOOKING_MANAGE,
    TIME_CONFIG,
} from "../model/constantes";



export const rbsController = ng.controller('RbsController', [
    "$location",
    "$scope",
    "$timeout",
    "$compile",
    "$sanitize",
    "model",
    "route",
    ($location, $scope, $timeout, $compile, $sanitize, model, route) =>  {
        $scope.template = template;
        $scope.me = model.me;
        $scope.lang = lang;
        $scope.firstTime = true;
        model.calendar.name = 'rbs';

        $scope.display = {
            list: false, // calendar by default
            create: false,
        };

        $scope.sort = {
            predicate: 'start_date',
            reverse: false,
        };
        $scope.preference = new Preference();
        $scope.booking = new Booking();
        $scope.resourceTypes = new ResourceTypes();
        $scope.resourceType = new ResourceType();
        $scope.resources = new Resources();
        $scope.bookings = new Bookings();
        $scope.slots = new Slots();
        $scope.periods = PERIODS;
        $scope.structures = new Structures();
        $scope.slotProfilesComponent = new SlotProfile();
        $scope.notificationsComponent = new Notification();
        $scope.sharedStructure = DETACHED_STRUCTURE;
        $scope.structure = new Structure();
        route({
            main: async function() {
                await Promise.all([
                    $scope.preference.sync(),
                    $scope.resources.sync()
                ]);
                await $scope.resourceTypes.sync($scope.resources);
                await Promise.all([
                    $scope.structures.sync($scope.resourceTypes,$scope.preference),
                    $scope.bookings.sync(false, $scope.resources)
                ]);
                $scope.initialize();
            },
            viewBooking: async function(param) {
                if (param.start) {
                    $scope.booking.initDates(param.start);
                } else {
                    $scope.booking =  new Booking(param.bookingId);
                    await $scope.booking.sync();
                    $scope.booking.initDates($scope.booking.start_date);
                }
                $scope.initialize();
            }
        });

        $scope.initView = () => {
            template.open('main', 'main-view');
            template.open('top-menu', 'top-menu');
            template.open('editBookingErrors', 'edit-booking-errors');
            template.open('itemTooltip', 'tooltip-template');
        };

        $scope.initConstants =()=> {
            $scope.display.create = Utils.canCreateBooking($scope.resourceTypes);

        };

        $scope.displayBookings=(list?:boolean)=> {
            if ($scope.display.list === true || list) {
                $scope.display.list = true;
                template.open('bookings', 'main-list');
            } else {
                template.open('bookings', 'main-calendar');
            }
        };

        $scope.initialize = function() {
            $scope.initView();
            $scope.displayBookings();
            $scope.initConstants();
            model.calendar.on('date-change', async () => {
                $scope.bookings.initDates(model.calendar.firstDay);
                await $scope.bookings.sync(false, $scope.resources);
                $scope.$apply();
            })
        };

        $scope.hasAnyBookingRight = function(booking) {
            return booking.owner === model.me.userId || booking.resource.myRights.process || booking.resource.myRights.manage;
        };

        // Navigation
        $scope.showCalendar = function(refresh) {
            if (refresh === true) {
                $scope.initMain();
            }
            $scope.display.admin = false;
            $scope.display.list = false;
            $scope.bookings.filters.booking = undefined;
            $scope.bookings.applyFilters();
            template.open('bookings', 'main-calendar');
        };

        $scope.showList = async function(refresh) {
            if (refresh === true) {
                $scope.initMain();
            }
            $scope.bookings.filters.dates = true;
            $scope.display.admin = false;
            $scope.display.list = true;
            $scope.bookings.filters.booking = true;
            await $scope.bookings.sync(true, $scope.resources);
            $scope.bookings.filters.endDate =
                moment($scope.bookings.filters.endDate).add(2, 'month').startOf('day');
            $scope.bookings.applyFilters();
            template.open('bookings', 'main-list');
            $scope.$apply();
        };

        $scope.showManage = () => {
            $scope.display.list = false;
            $scope.display.admin = true;
            $scope.resourceTypes.deselectAllResources();
            let processableResourceTypes =  $scope.resourceTypes.all
                .filter( resourceType => Utils.keepProcessableResourceTypes(resourceType));
            if (processableResourceTypes && processableResourceTypes.length > 0) {
                $scope.currentResourceType = processableResourceTypes[0];
            }
            if($scope.structures.all !==0 ){
                $scope.structure = $scope.structures.all[0];
                $scope.structure.selected = true;
            }

            /*
            function is delete in controller
            $scope.initStructuresManage(false);
             */
            template.open('main', 'manage-view');
            template.open('resources', 'manage-resources');
        };

        $scope.initMain = function() {
            $scope.currentResourceType = undefined;
            $scope.resetSort();
            template.open('main', 'main-view');
        };

        $scope.nextWeekBookingButton = function() {
            let nextStart = moment($scope.bookings.filters.startDate).add(7, 'day');
            let nextEnd = moment($scope.bookings.filters.endDate).add(7, 'day');
            updateCalendarList(nextStart, nextEnd);
        };

        $scope.previousWeekBookingButton = function() {
            let prevStart = moment($scope.bookings.filters.startDate).subtract(7, 'day');
            let prevEnd = moment($scope.bookings.filters.endDate).subtract(7, 'day');
            updateCalendarList(prevStart, prevEnd);
        };

        let updateCalendarList = async function(start, end) {
            $scope.bookings.filters.startDate = start;
            $scope.bookings.filters.endDate = end;
            await $scope.bookings.sync(true, $scope.resources);
            $scope.bookings.applyFilters();
            $scope.$apply();
        };

        // Main view interaction
        $scope.expandResourceType = function(resourceType) {
            resourceType.expanded = true;
            $scope.selectResources(resourceType);
            $scope.saveTreeState();
        };

        $scope.expandStructure = function(structure) {
            structure.expanded = true;
            $scope.saveTreeState();
        };

        $scope.expandStructureSettings = function(structure) {
            structure.expanded = true;
            structure.selected = true;
            structure.resourceTypes.all.forEach(function(resourceType) {
                resourceType.selected = false;
            });
        };

        $scope.collapseResourceType = function(resourceType, needToSaveTreeState) {
            resourceType.expanded = undefined;
            $scope.deselectResources(resourceType);
            if (needToSaveTreeState !== false) {
                $scope.saveTreeState();
            }
        };

        $scope.collapseStructure = function(structure) {
            structure.expanded = undefined;
            structure.resourceTypes.forEach(function(resourceType) {
                $scope.collapseResourceType (resourceType, false);
            });
            $scope.deselectStructure(structure);
            $scope.saveTreeState();
        };

        $scope.collapseStructureSettings = structure => {
            structure.expanded = false;
            structure.selected = false;
            $scope.deselectStructureSettings(structure);
        };

        $scope.selectResources = function(resourceType) {
            if (resourceType.selected == false) {
                resourceType.selected = true;
            }
            $scope.saveTreeState();
            $scope.bookings.applyFilters();
        };

        $scope.selectStructure = structure => {
            structure.selected = true;
            structure.resourceTypes.all.forEach(resourceType => {
                resourceType.expanded = true;
                $scope.selectResources(resourceType);
            });
        };

        $scope.setSelectedStructureForCreation = structure => {
            if ($scope.structure) {
                if ($scope.structure != structure) {
                    $scope.structure.resourceTypes.forEach( resourceType => {
                        resourceType.selected = false;
                    });
                    $scope.structure.selected = false;
                }
            }
            $scope.structure = structure ;
            $scope.structure.selected = true;
            let resourceType = $scope.filteredType(structure);
            if (resourceType.length > 0) {
                $scope.selectResourceType(resourceType[0]);
            } else {
                $scope.currentResourceType = undefined;
                template.close('resources');
            }
        };

        $scope.selectStructureSettings = function(structure) {
            structure.selected = true;
            structure.resourceTypes.all.forEach(function(resourceType) {
                resourceType.selected = true;
            });
            structure.resourceTypes.updateSelection();
        };

        $scope.deselectResources = function(resource) {
            if (resource.selected == true) {
                resource.selected = false;
            }
            $scope.lastSelectedResource = undefined;
            $scope.bookings.applyFilters();
        };

        $scope.deselectStructure = function(structure) {
            structure.selected = false;
            structure.updateSelection();
            structure.resourceTypes.forEach(function(resourceType) {
                $scope.deselectResources(resourceType);
            });
        };

        $scope.deselectStructureSettings = function(structure) {
            structure.selected = false;
            structure.resourceTypes.forEach(function(type) {
                $scope.deselectTypeResourcesSettings(type);
            });
            if ($scope.structure === structure) {
                $scope.structure = undefined;
                $scope.currentResourceType = undefined;
                template.close('resources');
            }
        };

        $scope.deselectTypeResourcesSettings = function(resourceType) {
            resourceType.selected = false;
            resourceType.resources.forEach(function(resource) {
                resource.selected = undefined;
            });
        };

        $scope.switchSelectResources = function(resourceType) {
            resourceType.resources.all.forEach((resourceType) => {
                if (resourceType.selected == true) {
                    $scope.deselectResources(resourceType);
                } else {
                    $scope.selectResources(resourceType);
                }
            $scope.saveTreeState();
            })
        };

        $scope.switchSelectStructure = function(structure) {
            if (structure.selected) {
                $scope.deselectStructure(structure);
            } else {
                $scope.selectStructure(structure);
            }
            $scope.saveTreeState();
        };

        $scope.switchSelectStructureSettings = function(structure) {
            if (structure.selected) {
                $scope.deselectStructureSettings(structure);
            } else {
                $scope.selectStructureSettings(structure);
            }

            $scope.saveTreeState();
        };

        $scope.switchSelect = function(resource) {
            if (resource.selected !== true) {
                resource.selected = true;
                if (resource.is_available !== true) {
                    $scope.lastSelectedResource = resource;
                }
                $scope.bookings.applyFilters();
            } else {
                resource.selected = undefined;
                if (resource.is_available !== true) {
                    $scope.lastSelectedResource = undefined;
                }
                $scope.bookings.applyFilters();
            }

            $scope.saveTreeState();
        };

        $scope.switchSelectMine = function() {
            if ($scope.bookings.filters.mine === true) {
                delete $scope.bookings.filters.mine;
            } else {
                $scope.bookings.filters.mine = true;
                delete $scope.bookings.filters.unprocessed;
            }
            $scope.bookings.applyFilters();
        };

        $scope.switchSelectUnprocessed = function() {
            if ($scope.bookings.filters.unprocessed === true) {
                delete $scope.bookings.filters.unprocessed;
            } else {
                $scope.bookings.filters.unprocessed = true;
                delete $scope.bookings.filters.mine;
            }
            $scope.bookings.applyFilters();
        };

        $scope.isViewBooking = false;
        // Bookings
        $scope.viewBooking = async function(booking) {
            $scope.currentBookingSelected = booking;
            $scope.isViewBooking = true;
            if (booking.isSlot()) {
                // slot : view booking details and show slot
                //call back-end to obtain all periodic slots
                if (booking.isSlot() && booking.occurrences !== booking.slots.length) {
                    await $scope.slots.sync(booking.parent_booking_id);
                } else {
                    if (booking.status === 3) {
                        booking.expanded = true;
                    }
                    $scope.showBookingDetail(booking.booking, 3);
                }
            } else {
                // booking
                $scope.showBookingDetail(booking, 1);
            }
        };

        $scope.showBookingDetail = function(booking, displaySection) {
            $scope.booking = booking;
            $scope.booking.displaySection = displaySection;
            $scope.booking.mapResources($scope.resourceTypes);
            $scope.resourceTypes.initModerators();
            template.open('lightbox', 'booking-details');
            $scope.display.showPanel = true;
        };

        $scope.closeBooking = function() {
            $scope.slotNotFound = undefined;
            if (
                $scope.booking !== undefined &&
                $scope.booking.is_periodic === true
            ) {
                _.each($scope.booking._slots, function(slot) {
                    slot.expanded = false;
                });
            }
            if ($scope.display.list !== true) {
                // In calendar view, deselect all when closing lightboxes
                $scope.bookings.deselectAll();
            }
            $scope.booking = undefined;
            $scope.booking = null;
            $scope.processBookings = [];
            $scope.currentErrors = [];
            $scope.display.showPanel = false;
            $scope.slots = undefined;
            template.close('lightbox');
        };

        $scope.expandPeriodicBooking = function(booking) {
            booking.expanded = true;
            $scope.bookings.showSlots(booking);
        };

        $scope.collapsePeriodicBooking = function(booking) {
            booking.expanded = undefined;
            $scope.bookings.hideSlots(booking);
        };

        $scope.switchSelectAllBookings = function(bookings) {
            if ($scope.display.selectAllBookings) {
                $scope.selectAllBookings(bookings);
            } else {
                $scope.bookings.deselectAll();
            }
        };

        $scope.selectAllBookings = function(bookings) {
            bookings.all.forEach((booking) => {
                booking.selected = true;
            });
        };

        $scope.selectAllSlots = function() {
            _.each($scope._slots, function(slot){
                slot.selected = true;
            });
        };

        $scope.displayToggle = function(booking) {
            if (!_.contains($scope.bookings.selectedElements, booking)) {
                $scope.bookings.selectedElements.push(booking);
            } else {
                $scope.bookings.selectedElements = _.without($scope.selectedElements, booking);
            }
        };

        $scope.switchSelectAllSlots = function(bookings) {
            bookings.all.forEach((booking) => {
                if (booking.is_periodic === true && booking.selected === true) {
                    _.each(booking._slots, function (slot) {
                        slot.selected = true;
                    });
                } else if (booking.is_periodic === true && booking.selected !== true) {
                    _.each(booking._slots, function (slot) {
                        slot.selected = undefined;
                    });
                }
                if (booking.selected === false) {
                    _.each(booking, function (booking) {
                        $scope.bookings.selectedElements.push(booking);
                    });
                }
            });
        };

        $scope.switchExpandSlot = function(slot) {
            if (slot.expanded !== true) {
                slot.expanded = true;
            } else {
                slot.expanded = undefined;
            }
        };

        // Sort
        $scope.switchSortBy = function(predicate) {
            if (predicate === $scope.sort.predicate) {
                $scope.sort.reverse = !$scope.sort.reverse;
            } else {
                $scope.sort.predicate = predicate;
                $scope.sort.reverse = false;
            }
        };

        $scope.resetSort = function() {
            $scope.sort.predicate = 'start_date';
            $scope.sort.reverse = false;
        };

        $scope.switchFilterListByDates = function(filter) {
            if ($scope.bookings.filters.dates !== true || filter === true) {
                $scope.bookings.filters.dates = true;
            } else {
                $scope.bookings.filters.dates = undefined;
            }
            $scope.bookings.applyFilters($scope.display.list);
            $scope.$apply();
        };

        // General
        $scope.formatDate = function(date) {
            return $scope.formatMoment(moment(date));
        };

        $scope.formatDateLong = function(date) {
            return $scope.formatMomentLong(moment(date));
        };

        $scope.formatMoment = function(date) {
            return (
                moment(date).format('DD/MM/YYYY ') +
                lang.translate('rbs.booking.details.header.at') +
                moment(date).format(' H[h]mm')
            );
        };

        $scope.formatMomentLong = function(date) {
            return date.format('dddd DD MMMM YYYY - HH[h]mm');
        };

        $scope.formatMomentDayLong = function(date) {
            return date.format('dddd DD MMMM YYYY');
        };

        $scope.formatMomentDayMedium = function(date) {
            return moment(date).format('dddd DD MMM YYYY');
        };

        $scope.formatHour = function(date) {
            return date.format('HH[h]mm');
        };

        $scope.dateToSeconds = function(date) {
            let momentDate = moment(date);
            return moment
                .utc([
                    momentDate.year(),
                    momentDate.month(),
                    momentDate.day(),
                    momentDate.hour(),
                    momentDate.minute(),
                ])
                .unix();
        };

        $scope.formatBooking = function(date, time) {
            return (
                moment(date).format('DD/MM/YYYY') +
                ' ' +
                lang.translate('rbs.booking.details.header.at') +
                ' ' +
                moment(time).format('HH[h]mm')
            );
        };

        $scope.composeTitle = function(typeTitle, resourceTitle) {
            let title;
            if (typeTitle && resourceTitle) {
                title = typeTitle + ' - ' + resourceTitle;
            } else {
                title = lang.translate('rbs.booking.no.resource');
            }
            return _.isString(title)
                ? title.trim().length > 50 ? title.substring(0, 47) + '...' : title.trim()
                : '';
        };

        $scope.countValidatedSlots = function(slots) {
            return _.filter(slots, function(slot) {
                return slot.isValidated();
            }).length;
        };

        $scope.countRefusedSlots = function(slots) {
            return _.filter(slots, function(slot) {
                return slot.isRefused();
            }).length;
        };

        // Booking edition


        $scope.canEditBookingSelection = function() {
            if ($scope.display.list === true) {
                let localSelection = _.filter($scope.bookings.selectedElements, function(
                    booking
                ) {
                    return booking.isBooking();
                });
                return (
                    localSelection.length === 1 &&
                    localSelection[0].resource.is_available === true
                );
            } else {
                let isAvailable = _.filter($scope.bookings.selectedElements, function(
                    booking
                ) {
                    return booking.is_available === true;
                });
                    return(
                        $scope.bookings.selectedElements.length === 1 &&
                        isAvailable.is_available === true
                    );
            }
        };

        $scope.canDeleteBookingSelection = function() {
            if ($scope.display.list === true) {
                return _.every($scope.bookings.selectedElements, function(booking) {
                    return (
                        booking.isBooking() ||
                        (booking.isSlot() && booking.booking.selected === true)
                    );
                });
            } else {
                return true;
            }
        };

        $scope.canDeleteBookingDateCheck = function(dateToCheck) {
            let itemDate = moment(dateToCheck);
            return moment().diff(itemDate) <= 0;
        };

        $scope.newBooking = function() {
            $scope.display.processing = undefined;
            $scope.initBookingToCreate();
            $scope.saveTime = undefined;
            $scope.booking.display = DISPLAY_BOOKING_MANAGE;
            $scope.resourceTypes.initModerators();
            $scope.structure = $scope.structures.all[0];
            $scope.autoSelectTypeAndResource();
            template.open('lightbox', 'edit-booking');
            $scope.display.showPanel = true;
        };
        $scope.initBookingToCreate = (periodic) => {
            $scope.booking = new Booking();
            $scope.booking.is_periodic = false; // false by default
            if (periodic === 'periodic') {
                $scope.initPeriodic();
            }
            // dates
            $scope.booking.startMoment = moment();
            $scope.booking.endMoment = moment();
            $scope.booking.endMoment.hour(
                $scope.booking.startMoment.hour() + 1
            );
            $scope.booking.startMoment.seconds(0);
            $scope.booking.endMoment.seconds(0);
            $scope.initBookingDates(
                $scope.booking.startMoment,
                $scope.booking.endMoment
            );

        };

        $scope.newBookingCalendar = function(timeSlot) {
            $scope.display.processing = undefined;
            $scope.booking = new Booking();
            $scope.booking.display = DISPLAY_BOOKING_MANAGE;
            if (timeSlot) {
                const { start, end } = timeSlot;
                $scope.booking.startTime = start;
                $scope.booking.endTime = end;
            }

            $scope.resourceTypes.initModerators();

            $scope.structure = $scope.structures.all[0];
            $scope.autoSelectTypeAndResource();

            // dates
            if (model.calendar.newItem !== undefined) {
                $scope.booking.startMoment = model.calendar.newItem.beginning;
                $scope.booking.startMoment.minutes(0);
                $scope.booking.endMoment = model.calendar.newItem.end;
                $scope.booking.endMoment.minutes(0);
                $scope.saveTime = {
                    startHour : model.calendar.newItem.beginning._d.getHours(),
                    endHour : model.calendar.newItem.end._d.getHours()
                }
            } else {
                $scope.booking.startMoment = moment();
                $scope.booking.endMoment = moment();
                $scope.booking.endMoment.hour(
                    $scope.booking.startMoment.hour() + 1
                );
            }
            $scope.booking.startMoment.seconds(0);
            $scope.booking.endMoment.seconds(0);
            // DEBUG
            var DEBUG_booking = $scope.booking;
            // /DEBUG
            $scope.initBookingDates(
                $scope.booking.startMoment,
                $scope.booking.endMoment
            );
        };

        $scope.editPeriodicStartDate = function() {
            $scope.showDate = true;
            if (
                moment($scope.booking.periodicEndDate).unix() <
                moment($scope.booking.startDate).unix()
            ) {
                $scope.booking.periodicEndDate = $scope.booking.startDate;
            }
        };

        $scope.editBooking = async function() {
            $scope.display.processing = undefined;
            $scope.selectedSlotStart = undefined;
            $scope.selectedSlotEnd = undefined;
            $scope.slotNotFound = undefined;
            $scope.currentErrors = [];

            if ($scope.booking !== undefined && $scope.booking !== null) {
                $scope.editedBooking = $scope.booking;
            } else {
                $scope.booking = $scope.bookings.selectedElements[0];
                if (!$scope.booking.isBooking()) {
                    $scope.booking = $scope.booking.booking;
                }
            }
            $scope.booking.display = DISPLAY_BOOKING_MANAGE;

            // periodic booking
            if ($scope.booking.is_periodic === true) {
                if (
                    $scope.booking.occurrences !== undefined &&
                    $scope.booking.occurrences > 0
                ) {
                    $scope.booking.byOccurrences = true;
                } else {
                    $scope.booking.byOccurrences = false;
                }
                $scope.booking.slots.all = _.sortBy($scope.booking.slots.all,'id') ;
                $scope.booking.startMoment= $scope.booking.slots.all[0].startMoment;
                $scope.booking.startMoment.date($scope.booking.start.date());
                $scope.booking.startMoment.month($scope.booking.start.month());
                $scope.booking.startMoment.year($scope.booking.start.year());
                $scope.booking.endMoment = $scope.booking.slots.all[0].endMoment;
            }
            $scope.initBookingDates(
                $scope.booking.startMoment,
                $scope.booking.endMoment
            );

            $scope.booking.resourceType = $scope.booking.resource.resourceType;
            if (
                $scope.booking.resourceType !== undefined &&
                $scope.booking.resourceType.slotprofile !== undefined
            ) {
             await $scope.slotProfilesComponent.getSlots($scope.booking.resourceType.slotprofile);

                if (  $scope.slotProfilesComponent.slots.length > 0) {
                    $scope.slots =  $scope.slotProfilesComponent;
                    $scope.slots.slots = _.sortBy( $scope.slots.slots, 'startHour');
                    $scope.selectedSlotStart = $scope.slots.slots
                        .filter(function(slot) {
                            return (
                                slot.startHour.split(':')[0] ==
                                $scope.booking.startMoment.hour() &&
                                slot.startHour.split(':')[1] ==
                                $scope.booking.startMoment.minute()
                            );
                        })
                        .pop();
                    $scope.selectedSlotEnd = $scope.selectedSlotStart;
                    if ($scope.selectedSlotStart === undefined) {
                        $scope.selectedSlotStart = $scope.slots.slots[0];
                        $scope.selectedSlotEnd = $scope.selectedSlotStart;
                        $scope.slotNotFound = true;
                    }
                } else {
                    $scope.booking.resourceType.slotprofile = undefined;
                }
            }
            template.open('lightbox', 'edit-booking');
            $scope.display.showPanel = true;
        };


        $scope.initPeriodic = function() {
            $scope.booking.is_periodic = true;
            $scope.booking.periodDays = Utils.bitMaskToDays(); // no days selected
            $scope.booking.byOccurrences = true;
            $scope.booking.periodicity = 1;
            $scope.booking.occurrences = 1;
            $scope.updatePeriodicSummary();
        };

        $scope.togglePeriodic = function() {
            if ($scope.booking.is_periodic === true) {
                $scope.initPeriodic();
            }
            if (
                $scope.booking.resourceType === undefined ||
                $scope.booking.resource === undefined ||
                !$scope.booking.resource.isBookable(true)
            ) {
                $scope.structure = $scope.structures.all[0];
                $scope.autoSelectTypeAndResource();
                // Warn user ?
            }
        };

        $scope.initBookingDates = function(startMoment, endMoment) {
            // hours minutes management
            let minTime = moment(startMoment);
            minTime.set('hour', TIME_CONFIG.start_hour);
            let maxTime = moment(endMoment);
            maxTime.set('hour', TIME_CONFIG.end_hour);
            if (startMoment.isAfter(minTime) && startMoment.isBefore(maxTime)) {
                $scope.booking.startTime = startMoment;
                if ($scope.selectedSlotStart) {
                    $scope.booking.startTime.set(
                        'hour',
                        $scope.selectedSlotStart.startHour.split(':')[0]
                    );
                    $scope.booking.startTime.set(
                        'minute',
                        $scope.selectedSlotStart.startHour.split(':')[1]
                    );
                }
            } else {
                $scope.booking.startTime = minTime;
                if (startMoment.isAfter(maxTime)) {
                    startMoment.add(1, 'day');
                    endMoment.add(1, 'day');
                    maxTime.add(1, 'day');
                }
            }
            if (endMoment.isBefore(maxTime)) {
                $scope.booking.endTime = endMoment;
                if ($scope.selectedSlotStart) {
                    $scope.booking.endTime.set(
                        'hour',
                        $scope.selectedSlotStart.endHour.split(':')[0]
                    );
                    $scope.booking.endTime.set(
                        'minute',
                        $scope.selectedSlotStart.endHour.split(':')[1]
                    );
                }
            } else {
                $scope.booking.endTime = maxTime;
            }

            // dates management
            if ($scope.booking.startDate == undefined) {
                $scope.booking.startDate = startMoment.toDate();
                $scope.booking.startDate.setFullYear(startMoment.years());
                $scope.booking.startDate.setMonth(startMoment.month());
                $scope.booking.startDate.setDate(startMoment.date());
                $scope.booking.endDate = endMoment.toDate();
                $scope.booking.endDate.setFullYear(endMoment.years());
                $scope.booking.endDate.setMonth(endMoment.month());
                $scope.booking.endDate.setDate(endMoment.date());
                $scope.booking.periodicEndDate = endMoment.toDate();
            }
        };

        $scope.autoSelectTypeAndResource = function() {
            $scope.booking.resourceType = undefined;
            $scope.booking.resource = undefined;
            $scope.selectedSlotStart = undefined;
            $scope.selectedSlotEnd = undefined;
            if ($scope.structure.resourceTypes.all.length > 0) {
                $scope.booking.resourceType = $scope.structure.resourceTypes.all[0];
                $scope.autoSelectResource();
            }
        };

        $scope.autoSelectResource = async function() {
            $scope.initBookingDates(
                $scope.booking.startMoment,
                $scope.booking.endMoment
            );
            $scope.booking.resource = $scope.booking.resourceType === undefined ? undefined
                    : _.first($scope.booking.resourceType.resources.filterAvailable($scope.booking.is_periodic));

            if ($scope.booking.resourceType !== undefined && $scope.booking.resourceType.slotprofile !== undefined) {
                await $scope.slotProfilesComponent.getSlots($scope.booking.resourceType.slotprofile);

                if ( $scope.slotProfilesComponent.slots.length > 0) {
                    $scope.slots =  $scope.slotProfilesComponent;
                    $scope.slots.slots = _.sortBy($scope.slots.slots ,'startHour');
                    $scope.selectedSlotStart = $scope.slots.slots[0];
                    $scope.selectedSlotEnd = $scope.slots.slots[0];
                    $scope.booking.startTime.set(
                        'hour',
                        $scope.selectedSlotStart.startHour.split(':')[0]

                    );
                    $scope.booking.startTime.set(
                        'minute',
                        $scope.selectedSlotStart.startHour.split(':')[1]
                    );
                    $scope.booking.endTime.set(
                        'hour',
                        $scope.selectedSlotEnd.endHour.split(':')[0]

                    );
                    $scope.booking.endTime.set(
                        'minute',
                        $scope.selectedSlotEnd.endHour.split(':')[1]
                    );
                } else {
                    $scope.booking.resourceType.slotprofile = undefined;
                }
                $scope.$apply();

            } else if ($scope.booking.resourceType !== undefined && $scope.saveTime) {
                $scope.booking.startTime.set('hour',
                    $scope.saveTime.startHour - $scope.getMomentFromDate($scope.booking.startDate, $scope.booking.startTime).format('Z').split(':')[0]);
                $scope.booking.startTime.set('minute', 0);
                $scope.booking.endTime.set('hour',
                    $scope.saveTime.endHour - $scope.getMomentFromDate($scope.booking.startDate, $scope.booking.startTime).format('Z').split(':')[0]);
                $scope.booking.endTime.set('minute', 0);
            }
            $scope.$apply();
        };
        $scope.getMomentFromDate = function (date,time) {
            return  moment([
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.hour(),
                time.minute()
            ])
        };
        $scope.switchSlotStart = function(slot) {
            $scope.selectedSlotStart = slot;
            $scope.booking.startTime.set(
                'hour',
                $scope.selectedSlotStart.startHour.split(':')[0]
            );
            $scope.booking.startTime.set(
                'minute',
                $scope.selectedSlotStart.startHour.split(':')[1]
            );
        };

        $scope.switchSlotEnd = function(slot) {
            $scope.selectedSlotEnd = slot;
            $scope.booking.endTime.set(
                'hour',
                $scope.selectedSlotEnd.endHour.split(':')[0]
            );
            $scope.booking.endTime.set(
                'minute',
                $scope.selectedSlotEnd.endHour.split(':')[1]
            );
        };

        $scope.switchStructure = function(struct) {
            $scope.structure = struct;
            $scope.autoSelectTypeAndResource();
        };

        $scope.getPeriodicSummary = function(item) {
            if (!item.isSlot()) {
                return undefined;
            }

            let booking = $scope.bookings.all.find(function(b) {
                return b.id === item.parent_booking_id;
            });

            let periodicSummary = "";

            // Selected days
            let selected = 0;
            _.each(booking.periodDays, function(d) {
                selected += d.value ? 1 : 0;
            });
            if (selected == 0) {
                // Error in periodic view
                booking.periodicError = lang.translate('rbs.period.error.nodays');
                return;
            } else if (selected == 7) {
                periodicSummary = lang.translate('rbs.period.days.all');
            } else {
                periodicSummary += $scope.summaryBuildDays(booking.periodDays);
            }

            // Weeks
            let summary = ', ';
            if (booking.periodicity == 1) {
                summary += lang.translate('rbs.period.weeks.all') + ', ';
            } else {
                summary +=
                    lang.translate('rbs.period.weeks.partial') + ' ' +
                    lang.translate('rbs.period.weeks.' + booking.periodicity) +
                    ', ';
            }

            // Occurences or date
            if (booking.byOccurrences) {
                summary +=
                    lang.translate('rbs.period.occurences.for') + ' ' +
                    booking.occurrences + ' ' +
                    lang.translate(
                        'rbs.period.occurences.slots.' +
                        (booking.occurrences > 1 ? 'many' : 'one')
                    );
            } else {
                summary +=
                    lang.translate('rbs.period.date.until') + ' ' +
                    $scope.formatMomentDayLong(moment(booking.end_date));
            }

            periodicSummary += summary;

            return periodicSummary;
        };

        $scope.updatePeriodicSummary = function() {
            $scope.booking.periodicSummary = '';
            $scope.booking.periodicShortSummary = '';
            $scope.booking.periodicError = undefined;

            $scope.booking.periodicShortSummary = lang.translate(
                'rbs.period.days.some'
            );

            if ($scope.showDaySelection) {
                // Selected days
                let selected = 0;
                _.each($scope.booking.periodDays, function(d) {
                    selected += d.value ? 1 : 0;
                });
                if (selected == 0) {
                    // Error in periodic view
                    $scope.booking.periodicError = lang.translate(
                        'rbs.period.error.nodays'
                    );
                    return;
                } else if (selected == 7) {
                    $scope.booking.periodicSummary = lang.translate(
                        'rbs.period.days.all'
                    );
                    $scope.booking.periodicShortSummary =
                        $scope.booking.periodicSummary;
                } else {
                    $scope.booking.periodicSummary += $scope.summaryBuildDays(
                        $scope.booking.periodDays
                    );
                }
            }

            // Weeks
            let summary = ', ';
            if ($scope.booking.periodicity == 1) {
                summary += lang.translate('rbs.period.weeks.all') + ', ';
            } else {
                summary +=
                    lang.translate('rbs.period.weeks.partial') + ' ' +
                    lang.translate('rbs.period.weeks.' + $scope.booking.periodicity) +
                    ', ';
            }

            // Occurences or date
            if ($scope.booking.byOccurrences) {
                summary +=
                    lang.translate('rbs.period.occurences.for') + ' ' +
                    $scope.booking.occurrences + ' ' +
                    lang.translate(
                        'rbs.period.occurences.slots.' +
                        ($scope.booking.occurrences > 1 ? 'many' : 'one')
                    );
            } else {
                summary +=
                    lang.translate('rbs.period.date.until') + ' ' +
                    $scope.formatMomentDayLong(moment($scope.booking.periodicEndDate));
            }

            $scope.booking.periodicSummary += summary;
            $scope.booking.periodicShortSummary += summary;
            $scope.booking.periodicSummary = $scope.booking.periodicSummary.toLowerCase();
            $scope.booking.periodicSummary = $scope.booking.periodicSummary.charAt(0).toUpperCase() +
                $scope.booking.periodicSummary.slice(1);
        };

        $scope.summaryBuildDays = function(days) {
            // No days or all days cases are already done here
            let summary = undefined;
            let startBuffer = undefined;
            let lastIndex = days.length - 1;
            if (_.first(days).value && _.last(days).value) {
                // Sunday and Monday are selected : summary will not start with monday, reverse-search the start day
                for (let k = days.length; k > 0; k--) {
                    if (!days[k - 1].value) {
                        lastIndex = k - 1;
                        break;
                    }
                }
                startBuffer = lastIndex + 1;
            }

            for (let i = 0; i <= lastIndex; i++) {
                if (startBuffer === undefined && days[i].value) {
                    // No range in buffer, start the range
                    startBuffer = i;
                }
                if (startBuffer !== undefined) {
                    if (i == lastIndex && days[lastIndex].value) {
                        // Day range complete (last index) write to summary
                        summary = $scope.summaryWriteRange(
                            summary,
                            days[startBuffer],
                            days[lastIndex]
                        );
                        break;
                    }
                    if (!days[i].value) {
                        // Day range complete, write to summary
                        summary = $scope.summaryWriteRange(
                            summary,
                            days[startBuffer],
                            days[i - 1]
                        );
                        startBuffer = undefined;
                    }
                }
            }
            return summary;
        };


        $scope.summaryWriteRange = function(summary, first, last) {
            if (first.number == last.number) {
                // One day range
                if (summary === undefined) {
                    // Start the summary
                    return (
                        ' ' +
                        lang.translate('rbs.period.days.one.start') +
                        ' ' +
                        lang.translate('rbs.period.days.' + first.number)
                    );
                }
                // Continue the summary
                return (
                    summary +
                    lang.translate('rbs.period.days.one.continue') +
                    ' ' +
                    lang.translate('rbs.period.days.' + first.number)
                );
            }
            if (first.number + 1 == last.number || first.number - 6 == last.number) {
                // Two day range
                if (summary === undefined) {
                    // Start the summary
                    return (
                        ' ' +
                        lang.translate('rbs.period.days.one.start') +
                        ' ' +
                        lang.translate('rbs.period.days.' + first.number) +
                        ' ' +
                        lang.translate('rbs.period.days.one.continue') +
                        ' ' +
                        lang.translate('rbs.period.days.' + last.number)
                    );
                }
                // Continue the summary
                return (
                    summary +
                    lang.translate('rbs.period.days.one.continue') +
                    ' ' +
                    lang.translate('rbs.period.days.' + first.number) +
                    ' ' +
                    lang.translate('rbs.period.days.one.continue') +
                    ' ' +
                    lang.translate('rbs.period.days.' + last.number)
                );
            }
            // Multi-day range
            if (summary === undefined) {
                // Start the summary
                return (
                    ' ' +
                    lang.translate('rbs.period.days.range.start') +
                    ' ' +
                    lang.translate('rbs.period.days.' + first.number) +
                    ' ' +
                    lang.translate('rbs.period.days.range.to') +
                    ' ' +
                    lang.translate('rbs.period.days.' + last.number)
                );
            }
            // Continue the summary
            return (
                summary +
                lang.translate('rbs.period.days.range.continue') +
                ' ' +
                lang.translate('rbs.period.days.' + first.number) +
                ' ' +
                lang.translate('rbs.period.days.range.to') +
                ' ' +
                lang.translate('rbs.period.days.' + last.number)
            );
        };

        $scope.saveBooking = async function() {
            // Check
            $scope.currentErrors = [];
            try {
                if ($scope.checkSaveBooking()) {
                    return;
                }
                // Save
                $scope.display.processing = true;

                // dates management
                $scope.booking.startMoment = ($scope.booking.startDate)
                    .setHours($scope.booking.startTime.hour(), $scope.booking.startTime.minute());
                if ($scope.booking.is_periodic === true) {
                    $scope.booking.endMoment = ($scope.booking.endDate)
                        .setHours($scope.booking.endTime.hour(), $scope.booking.endTime.minute());
                    if ($scope.booking.byOccurrences !== true) {
                        $scope.booking.occurrences = undefined;
                        $scope.booking.periodicEndMoment = moment([
                            $scope.booking.periodicEndDate.getFullYear(),
                            $scope.booking.periodicEndDate.getMonth(),
                            $scope.booking.periodicEndDate.getDate(),
                            $scope.booking.endTime.hour(),
                            $scope.booking.endTime.minute()
                        ]);
                    }
                    $scope.resolvePeriodicMoments();
                } else {
                    // non periodic
                    $scope.booking.endMoment = ($scope.booking.endDate)
                        .setHours($scope.booking.endTime.hour(), $scope.booking.endTime.minute());
                }
                $scope.booking.slots = [new Slot($scope.booking).toJson()];
                await $scope.booking.save();
                $scope.display.processing = undefined;
                await $scope.bookings.sync(true, $scope.resources);
                $scope.closeBooking();
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
            $scope.$apply();
        };

        $scope.checkSaveBooking = function() {
            let hasErrors = false;
            let today = moment().startOf('day');
            $scope.initBookingDates(
                $scope.booking.startMoment,
                $scope.booking.endMoment
            );
            if (
                $scope.booking.startDate.getFullYear() < today.year() ||
                ($scope.booking.startDate.getFullYear() == today.year() &&
                    $scope.booking.startDate.getMonth() < today.month()) ||
                ($scope.booking.startDate.getFullYear() == today.year() &&
                    $scope.booking.startDate.getMonth() == today.month() &&
                    $scope.booking.startDate.getDate() < today.date()) ||
                ($scope.booking.startDate.getFullYear() == today.year() &&
                    $scope.booking.startDate.getMonth() == today.month() &&
                    $scope.booking.startDate.getDate() == today.date() &&
                    $scope.booking.startTime.hour() < moment().hour())
            ) {
                $scope.currentErrors.push({
                    error: 'rbs.booking.invalid.datetimes.past',
                });
                notify.error('rbs.booking.invalid.datetimes.past');
                hasErrors = true;
            }
            if($scope.booking.startDate.getFullYear() == $scope.booking.endDate.getFullYear()
                && $scope.booking.endTime.hour() == $scope.booking.startTime.hour()
                && $scope.booking.endTime.minute() == $scope.booking.startTime.minute()){
                $scope.currentErrors.push({error: 'rbs.booking.invalid.datetimes.equals'});
                notify.error('rbs.booking.invalid.datetimes.equals');
                hasErrors = true;
            }
            if (
                $scope.booking.is_periodic === true &&
                _.find($scope.booking.periodDays, function(periodDay) {
                    return periodDay.value === true;
                }) === undefined &&
                $scope.showDaySelection
            ) {
                // Error
                $scope.currentErrors.push({ error: 'rbs.booking.missing.days' });
                notify.error('rbs.booking.missing.days');
                hasErrors = true;
            }
            return hasErrors;
        };

        $scope.saveBookingSlotProfile = async function () {
            $scope.currentErrors = [];
            $scope.booking.slots = [];
            let debut = $scope.slots.slots.indexOf($scope.selectedSlotStart);
            let fin = $scope.slots.slots.indexOf($scope.selectedSlotEnd);
            $scope.multipleDaysPeriodic = undefined;
            try {
                if ($scope.resolveSlotsSelected(debut, fin)) {
                    return;
                }
                $scope.slots.slots.forEach(async function(slot) {
                    if (slot.selected === true) {
                        $scope.booking.startTime.set('hour', slot.startHour.split(':')[0]);
                        $scope.booking.startTime.set('minute', slot.startHour.split(':')[1]);
                        $scope.booking.endTime.set('hour', slot.endHour.split(':')[0]);
                        $scope.booking.endTime.set('minute', slot.endHour.split(':')[1]);

                        // Save
                        $scope.display.processing = true;

                        // dates management
                        $scope.booking.startMoment = moment([
                            $scope.booking.startDate.getFullYear(),
                            $scope.booking.startDate.getMonth(),
                            $scope.booking.startDate.getDate(),
                            $scope.booking.startTime.hour(),
                            $scope.booking.startTime.minute()
                        ]);
                        if ($scope.booking.is_periodic === true) {
                            // periodic booking 1st slot less than a day
                            if ($scope.showDaySelection === true) {
                                if ($scope.checkSaveBooking()) {
                                    return;
                                }
                            }
                            $scope.booking.is_periodic = true;
                            $scope.booking.endMoment = moment([
                                $scope.booking.endDate.getFullYear(),
                                $scope.booking.endDate.getMonth(),
                                $scope.booking.endDate.getDate(),
                                $scope.booking.endTime.hour(),
                                $scope.booking.endTime.minute()
                            ]);

                            if (!$scope.showDaySelection) {
                                $scope.multipleDaysPeriodic = true;
                                var periodDays = Utils.bitMaskToDays();
                                let diffDays = $scope.booking.endMoment.dayOfYear() - $scope.booking.startMoment.dayOfYear();
                                var start = moment([
                                    $scope.booking.startMoment.year(),
                                    $scope.booking.startMoment.month(),
                                    $scope.booking.startMoment.date(),
                                    $scope.booking.startMoment.hour(),
                                    $scope.booking.startMoment.minute()
                                ]);

                                var end = moment([
                                    $scope.booking.startMoment.year(),
                                    $scope.booking.startMoment.month(),
                                    $scope.booking.startMoment.date(),
                                    $scope.booking.endMoment.hour(),
                                    $scope.booking.endMoment.minute()
                                ]);
                                var nbDay = 0;
                                for (let i = 0; i <= diffDays; i++) {
                                    let dow = start.day();
                                    if (i == 0 && $scope.slots.slots.indexOf(slot) >= debut) {
                                        if (start.year() > $scope.today.year() ||
                                            (start.year() == $scope.today.year() && start.month() > $scope.today.month()) ||
                                            (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() > $scope.today.date()) ||
                                            (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() == $scope.today.date() && start.hour() >= moment().hour())
                                        ) {
                                            nbDay++;
                                            periodDays[(dow + i - 1) % 7].value = true;
                                        }
                                    } else if ((i == diffDays && $scope.slots.slots.indexOf(slot) <= fin)||(i != 0 && i != diffDays) ){
                                        nbDay++;
                                        periodDays[(dow + i - 1) % 7].value = true;
                                    }

                                }
                            } else {
                                $scope.resolvePeriodicMoments();
                            }

                            if ($scope.booking.byOccurrences !== true) {
                                $scope.booking.occurrences = undefined;
                                $scope.booking.periodicEndMoment = moment([
                                    $scope.booking.periodicEndDate.getFullYear(),
                                    $scope.booking.periodicEndDate.getMonth(),
                                    $scope.booking.periodicEndDate.getDate(),
                                    $scope.booking.endTime.hour(),
                                    $scope.booking.endTime.minute()
                                ]);
                            }

                            if ($scope.multipleDaysPeriodic && nbDay > 0) {
                                let bookingPeriodicToSave = new Booking();
                                bookingPeriodicToSave.periodicity = $scope.booking.periodicity;
                                bookingPeriodicToSave.booking_reason = $scope.booking.booking_reason;
                                bookingPeriodicToSave.resource = $scope.booking.resource;
                                if ($scope.slots.slots.indexOf(slot) >= debut) {
                                    if (start.year() > $scope.today.year() ||
                                        (start.year() == $scope.today.year() && start.month() > $scope.today.month()) ||
                                        (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() > $scope.today.date()) ||
                                        (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() == $scope.today.date() && start.hour() >= moment().hour())
                                    ) {
                                        bookingPeriodicToSave.slots.all.push(new slot($scope.booking).toJson());
                                    } else {
                                        bookingPeriodicToSave.slots.all.push(new slot.slotJson(start.add(1,'d'), end.add(1,'d')));
                                    }
                                } else {
                                    bookingPeriodicToSave.slots.all.push(new slot.slotJson(start.add(1,'d'), end.add(1,'d')));
                                }


                                bookingPeriodicToSave.is_periodic = true;
                                bookingPeriodicToSave.periodDays = periodDays;
                                if($scope.booking.occurrences) {
                                    bookingPeriodicToSave.occurrences = $scope.booking.occurrences * nbDay;
                                } else {
                                    bookingPeriodicToSave.periodicEndMoment = $scope.booking.periodicEndMoment;
                                }

                                await bookingPeriodicToSave.save();
                                $scope.display.processing = undefined;
                                $scope.closeBooking();
                                // await $scope.bookings.refreshBookings($scope.display.list, true, $scope.resources);
                                await $scope.bookings.sync(true, $scope.resources);
                                $scope.$apply();

                            } else {
                                $scope.booking.slots.push(new Slot($scope.booking).toJson());
                            }
                        } else {
                            // non periodic
                            $scope.booking.endMoment = moment([
                                $scope.booking.endDate.getFullYear(),
                                $scope.booking.endDate.getMonth(),
                                $scope.booking.endDate.getDate(),
                                $scope.booking.endTime.hour(),
                                $scope.booking.endTime.minute()
                            ]);
                            let diffDays = $scope.booking.endMoment.dayOfYear() - $scope.booking.startMoment.dayOfYear();
                            if (diffDays == 0) {
                                if ($scope.checkSaveBooking()) {
                                    return;
                                }
                                $scope.booking.slots.push(new Slot($scope.booking).toJson());
                            } else {
                                for (let i = 0; i <= diffDays; i++) {
                                    let start = moment([
                                        $scope.booking.startMoment.year(),
                                        $scope.booking.startMoment.month(),
                                        $scope.booking.startMoment.date(),
                                        $scope.booking.startMoment.hour(),
                                        $scope.booking.startMoment.minute()
                                    ]);
                                    let end = moment([
                                        $scope.booking.endMoment.year(),
                                        $scope.booking.endMoment.month(),
                                        $scope.booking.endMoment.date(),
                                        $scope.booking.endMoment.hour(),
                                        $scope.booking.endMoment.minute()
                                    ]);

                                    if (i == 0 && $scope.slots.slots.indexOf(slot) >= debut) {
                                        if (start.year() > $scope.today.year() ||
                                            (start.year() == $scope.today.year() && start.month() > $scope.today.month()) ||
                                            (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() > $scope.today.date()) ||
                                            (start.year() == $scope.today.year() && start.month() == $scope.today.month() && start.date() == $scope.today.date() && start.hour() >= moment().hour())
                                        ) {
                                            $scope.booking.slots.push(new slot.slotJson(start.add(i, 'd'), end.subtract(diffDays - i, 'd')));
                                        } else {
                                            $scope.currentErrors.push({
                                                error: 'rbs.booking.invalid.datetimes.past',
                                            });
                                            notify.error(lang.translate('rbs.booking.slot.time') + slot.startHour + lang.translate('rbs.booking.slot.to')
                                                + slot.endHour + lang.translate('rbs.booking.slot.day') + start.format('MM-DD-YYYY') +  lang.translate('rbs.booking.slot.less'));
                                        }
                                    } else if (i == diffDays && $scope.slots.slots.indexOf(slot) <= fin) {
                                        $scope.booking.slots.push({
                                            start_date: start.add(i, 'd').unix(),
                                            end_date: end.subtract(diffDays - i, 'd').unix()
                                        });
                                    } else if (i != 0 && i != diffDays) {
                                        $scope.booking.slots.push(new slot.slotJson(start.add(i, 'd'), end.subtract(diffDays - i, 'd')));
                                    }
                                }
                            }
                        }
                    }
                });
                if (!$scope.multipleDaysPeriodic) {
                    $scope.booking.save(
                        async function() {
                            $scope.display.processing = undefined;
                            await $scope.bookings.sync(true, $scope.resources);
                            $scope.$apply();
                            $scope.closeBooking();
                        },
                        function(e) {
                            notify.error(e.error);
                            $scope.display.processing = undefined;
                            $scope.currentErrors.push(e);
                            $scope.$apply();
                        }
                    );
                }
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        $scope.resolveSlotsSelected = function(debut, fin) {
            let hasErrors = false;
            if (debut <= fin) {
                for (let i = debut; i <= fin; i++) {
                    $scope.slots.slots[i].selected = true;
                }
            } else {
                $scope.currentErrors.push({
                    error: 'rbs.booking.invalid.slots'
                });
                notify.error('rbs.booking.invalid.slots');
                hasErrors = true;
            }
            return hasErrors;
        };

        $scope.resolvePeriodicMoments = function() {
            // find next selected day as real start date
            let selectedDays = _.groupBy(
                _.filter($scope.booking.periodDays, function(periodDay) {
                    return periodDay.value === true;
                }),
                function(periodDay) {
                    return periodDay.number;
                }
            );
            //Periodic less than a day
            //if($scope.showDaySelection) {
            if (selectedDays[moment($scope.booking.startMoment).day()] === undefined) {
                // search the next following day (higher number)
                for (let i = moment($scope.booking.startMoment).day(); i < 7; i++) {
                    if (selectedDays[i] !== undefined) {
                        $scope.booking.startMoment = moment($scope.booking.startMoment).day(
                            i
                        );
                        $scope.booking.endMoment = moment($scope.booking.endMoment).day(
                            i
                        );
                        return;
                    }
                }
                // search the next following day (lower number)
                for (let i = 0; i < $scope.booking.startMoment.day(); i++) {
                    if (selectedDays[i] !== undefined) {
                        $scope.booking.startMoment = moment($scope.booking.startMoment).day(
                            i + 7
                        ); // +7 for days in next week, not current
                        $scope.booking.endMoment = moment($scope.booking.endMoment).day(
                            i + 7
                        );
                        return;
                    }
                }
            }
        };

        $scope.toggleShowBookingResource = function() {
            if ($scope.booking.showResource == true) {
                $scope.booking.showResource = undefined;
            } else {
                $scope.booking.showResource = true;
            }
        };

        $scope.removeBookingSelection = function(booking) {
            $scope.display.processing = undefined;
            if ($scope.booking !== undefined && $scope.booking !== null) {
                $scope.bookings.deselectAll();
            }
            if ($scope.bookings.selectedElements[0]) {
                $scope.booking = $scope.bookings.selectedElements[0];
            }
            if (!$scope.booking.isBooking()) {
                $scope.booking = $scope.booking.booking;
            }

            let totalSelectionAsynchroneCall = 0;

            _.each($scope.bookings.selectedElements, function(booking) {
                if (!$scope.isViewBooking) {
                    $scope.currentBookingSelected = booking;
                }
                if (
                    booking.isSlot() &&
                    booking.booking.occurrences !== booking.booking._slots.length
                ) {
                    totalSelectionAsynchroneCall++;
                } else if (booking.isSlot() && booking.booking.selected !== true) {
                    booking.booking.selected = true;
                    booking.booking.selectAllSlots();
                } else if (booking.is_periodic) {
                    booking.selectAllSlots();
                }
            });

            //if all slots are already completed
            if (totalSelectionAsynchroneCall === 0) {
                //confirm message
                if (
                    $scope.currentBookingSelected.isSlot() &&
                    $scope.currentBookingSelected.booking._slots.length !== 1
                ) {
                    $scope.isViewBooking = false;
                    $scope.showDeletePeriodicBookingMessage();
                } else if (
                    $scope.currentBookingSelected.isSlot() &&
                    $scope.currentBookingSelected.booking._slots.length === 1
                ) {
                    $scope.isViewBooking = false;
                    $scope.showConfirmDeleteMessage();
                } else {
                    $scope.showConfirmDeleteMessage();
                }
            } else {
                // All slots for periodic bookings
                _.each($scope.bookings.selectedElements, async function(booking) {
                    if (!$scope.isViewBooking) {
                        $scope.currentBookingSelected = booking;
                    }
                    if (booking.isSlot() && booking.occurrences !== booking._slots.length) {
                        //call back-end to obtain all periodic slots
                        await $scope.slots.sync(booking.parent_booking_id);

                        // $scope.bookings.loadSlots(booking, function() {
                        //     booking.booking.selected = true;
                        //     booking.booking.selectAllSlots();
                        //     totalSelectionAsynchroneCall--;
                        //     if (totalSelectionAsynchroneCall === 0) {
                        //         $scope.isViewBooking = false;
                        //         if (
                        //             $scope.currentBookingSelected.isSlot() &&
                        //             $scope.currentBookingSelected.booking._slots.length !== 1
                        //         ) {
                        //             $scope.showDeletePeriodicBookingMessage();
                        //         } else if (
                        //             $scope.currentBookingSelected.isSlot() &&
                        //             $scope.currentBookingSelected.booking._slots.length === 1
                        //         ) {
                        //             $scope.showConfirmDeleteMessage();
                        //         }
                        //     }
                        // });
                    }
                });
            }
        };

        $scope.showConfirmDeleteMessage = function() {
            $scope.processBookings = $scope.selectionForProcess();
            if(!$scope.processBookings.length){
                $scope.processBookings = $scope.selectBooking($scope.booking);
            }
            template.open('lightbox', 'confirm-delete-booking');
            $scope.display.showPanel = true;
            // $scope.$apply();
        };

        $scope.showDeletePeriodicBookingMessage = function() {
            $scope.processBookings = $scope.selectionForProcess();
            if(!$scope.processBookings.length){
                $scope.processBookings = $scope.selectBooking($scope.booking);
            }
            template.open('lightbox', 'delete-periodic-booking');
            $scope.display.showPanel = true;
            // $scope.$apply();
        };

        $scope.doRemoveBookingSelection = async function() {
            $scope.display.processing = true;
            $scope.currentErrors = [];
            $scope.processBookings = $scope.selectionForDelete();
            if(!$scope.processBookings.length){
                $scope.processBookings = $scope.selectBooking($scope.booking);
            }
            try {
                await $scope.booking.delete();
                $scope.display.processing = undefined;
                $scope.bookings.deselectAll();
                await $scope.bookings.sync(true, $scope.resources);
                $scope.$apply();
                $scope.closeBooking();
            } catch (e) {
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        $scope.doRemoveCurrentPeriodicBookingSelection = function() {
            $scope.display.processing = true;
            $scope.currentErrors = [];
            try {
                $scope.currentBookingSelected.delete(
                    async function() {
                        $scope.display.processing = undefined;
                        $scope.bookings.deselectAll();
                        await $scope.bookings.sync(true, $scope.resources);
                        $scope.$apply();
                        $scope.closeBooking();

                    },
                    async function(e) {
                        $scope.currentErrors.push(e);
                        $scope.display.processing = undefined;
                        $scope.showActionErrors();
                        await $scope.bookings.sync(true, $scope.resources);
                        $scope.$apply();
                    }
                );
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        $scope.doRemoveCurrentAndFuturBookingSelection = function() {
            $scope.display.processing = true;
            $scope.currentErrors = [];
            try {
                $scope.currentBookingSelected.deletePeriodicCurrentToFuture(
                    function() {
                        $scope.display.processing = undefined;
                        $scope.bookings.deselectAll();
                        $scope.closeBooking();
                        $scope.bookings.sync(false, $scope.resources);
                    },
                    function(e) {
                        $scope.currentErrors.push(e);
                        $scope.display.processing = undefined;
                        $scope.showActionErrors();
                        $scope.bookings.sync(false, $scope.resources);
                    }
                );
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        $scope.selectionForProcess = function() {
            return _.filter($scope.bookings, function(booking){
                return $scope.booking.isNotPeriodicRoot();
            });
        };

        $scope.selectionForDelete = function() {
            return _.filter($scope.bookings, function(booking){
                return $scope.booking.isBooking();
            });
        };

        // Booking Validation
        $scope.canProcessBookingSelection = function() {
            return _.every($scope.bookings.selectedElements, function(booking) {
                return booking.isPending();
            });
        };

        $scope.validateBookingSelection = function() {
            $scope.display.processing = undefined;
            if ($scope.booking !== undefined) {
                $scope.bookings.deselectAll();
                if ($scope.booking.is_periodic === true) {
                    $scope.booking.selectAllSlots();
                    $scope.booking.selected = undefined;
                } else {
                    $scope.booking.selected = true;
                }
            }

            $scope.processBookings = $scope.selectionForProcess();
            if(!$scope.processBookings.length){
                $scope.processBookings = $scope.selectBooking( $scope.booking);
            }
            $scope.display.showPanel = true;
            template.open('lightbox', 'validate-booking');
        };

        $scope.refuseBookingSelection = function() {
            $scope.display.processing = undefined;
            if ($scope.booking !== undefined) {
                $scope.bookings.deselectAll();
                if ($scope.booking.is_periodic === true) {
                    $scope.booking.selectAllSlots();
                    $scope.booking.selected = undefined;
                } else {
                    $scope.booking.selected = true;
                }
            }


            $scope.processBookings = $scope.selectionForProcess();
            if(!$scope.processBookings.length){
                $scope.processBookings = $scope.selectBooking( $scope.booking);
            }
            $scope.display.showPanel = true;
            $scope.bookings.refuseReason = '';
            template.open('lightbox', 'refuse-booking');
        };

        $scope.doValidateBookingSelection = function() {
            $scope.display.processing = true;
            $scope.currentErrors = [];
            try {
                let actions = $scope.processBookings.length;
                _.each($scope.processBookings, function(booking) {
                    booking.validate(
                        function() {
                            actions--;
                            if (actions === 0) {
                                $scope.display.processing = undefined;
                                $scope.bookings.deselectAll();
                                $scope.closeBooking();
                                $scope.bookings.sync(false, $scope.resources);
                            }
                        },
                        function(e) {
                            $scope.currentErrors.push(e);
                            actions--;
                            if (actions === 0) {
                                $scope.display.processing = undefined;
                                $scope.showActionErrors();
                                $scope.bookings.sync(false, $scope.resources);
                            }
                        }
                    );
                });
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        $scope.doRefuseBookingSelection = function() {
            $scope.display.processing = true;
            $scope.currentErrors = [];
            try {
                let actions = $scope.processBookings.length;
                _.each($scope.processBookings, function(booking) {
                    booking.refusal_reason = $scope.bookings.refuseReason;
                    booking.refuse(
                        function() {
                            actions--;
                            if (actions === 0) {
                                $scope.display.processing = undefined;
                                $scope.bookings.deselectAll();
                                $scope.bookings.refuseReason = undefined;
                                $scope.closeBooking();
                                $scope.bookings.sync(false, $scope.resources);
                            }
                        },
                        function(e) {
                            $scope.currentErrors.push(e);
                            actions--;
                            if (actions === 0) {
                                $scope.display.processing = undefined;
                                $scope.showActionErrors();
                                $scope.bookings.sync(true, $scope.resources);
                            }
                        }
                    );
                });
            } catch (e) {
                $scope.display.processing = undefined;
                $scope.currentErrors.push({ error: 'rbs.error.technical' });
            }
        };

        // Management view interaction
        $scope.selectResourceType = resourceType => {
            $scope.resourceTypes.deselectAllResources();
            $scope.display.selectAllRessources = undefined;
            $scope.currentResourceType = resourceType;
            let oldStructure = $scope.structure;
            $scope.structure =  $scope.structures.all.filter( struct => struct.id === resourceType.school_id).pop() ;
            if(!$scope.structure){
                $scope.structure = $scope.sharedStructure;
            }
            if (oldStructure){
                if (oldStructure.id !== $scope.structure.id) {
                    oldStructure.resourceTypes.forEach( resourceType => resourceType.selected = false);
                }
            }

            if ($scope.editedResourceType) {
                $scope.closeResourceType();
            }

            template.open('resources', 'manage-resources');
        };

        $scope.swicthSelectAllRessources = function() {
            if ($scope.display.selectAllRessources) {
                $scope.currentResourceType.resources.selectAll();
            } else {
                $scope.currentResourceType.resources.deselectAll();
            }
        };

        $scope.switchExpandResource = function(resource) {
            if (resource.expanded === true) {
                resource.expanded = undefined;
            } else {
                resource.expanded = true;
            }
        };

        $scope.filteredType = (structure) => {
            if (structure.resourceTypes.all && structure.resourceTypes.all.length !== 0 ){
                return structure.resourceTypes.all
                    .filter( resourceType => Utils.keepProcessableResourceTypes(resourceType));
            }
            return [];
        };

        let refreshType = (resourceType) => {
             _.each($scope.structures.all, function(struct) {
                    if (struct.id === resourceType.school_id)
                        struct.resourceTypes.all.push(resourceType);
                });
        };

        let refreshResource = (currentResourceType, resource) => {
            if (currentResourceType.resources && !currentResourceType.resources.all) {
                currentResourceType.resources.all = [];
            }
            currentResourceType.resources.all.push(resource);
        };

        $scope.createResourceType = () => {
            $scope.display.processing = undefined;
            $scope.editedResourceType = new ResourceType();
            $scope.editedResourceType.validation = false;
            $scope.editedResourceType.color = LAST_DEFAULT_COLOR;
            $scope.editedResourceType.slotprofile = null;
            $scope.updateSlotProfileField($scope.structure);
            template.open('resources', 'edit-resource-type');
        };

        $scope.newResource = function() {
            $scope.isCreation = true;
            $scope.display.processing = undefined;
            $scope.editedResource = new Resource();
            $scope.editedResource.resourceType = $scope.currentResourceType;
            $scope.editedResource.color = $scope.currentResourceType.color;
            $scope.editedResource.validation = $scope.currentResourceType.validation;
            $scope.editedResource.is_available = true;
            $scope.editedResource.periodic_booking = true;
            template.open('resources', 'edit-resource');
        };

        $scope.editSelectedResource = function() {
            $scope.isCreation = false;
            $scope.display.processing = undefined;
            $scope.editedResource = $scope.currentResourceType.resources.selection()[0];
            $scope.currentResourceType.resources.deselectAll();

            // Field to track Resource availability change
            $scope.editedResource.was_available = $scope.editedResource.is_available;

            $scope.editedResource.hasMaxDelay =
                $scope.editedResource.max_delay !== undefined &&
                $scope.editedResource.max_delay !== null;
            $scope.editedResource.hasMinDelay =
                $scope.editedResource.min_delay !== undefined &&
                $scope.editedResource.min_delay !== null;
            template.open('resources', 'edit-resource');
        };

        $scope.shareCurrentResourceType = function() {
            $scope.display.showPanel = true;
        };

        $scope.saveResourceType = async () => {
            $scope.display.processing = true;
            $scope.isManage = true;
            $scope.currentErrors = [];
            $scope.currentResourceType = $scope.editedResourceType;
            await $scope.editedResourceType.save($scope.structure.id);
            $scope.$apply();
            await $scope.resourceTypes.sync($scope.resources);
            refreshType($scope.editedResourceType);
            $scope.display.processing = undefined;
            $scope.closeResourceType();
        };

        $scope.saveResource = async () => {
            $scope.display.processing = true;
            $scope.isManage = true;
            if ($scope.editedResource.is_available === 'true') {
                $scope.editedResource.is_available = true;
            } else if ($scope.editedResource.is_available === 'false') {
                $scope.editedResource.is_available = false;
            }
            $scope.currentErrors = [];
            await $scope.editedResource.save();
            $scope.$apply();
            await $scope.resources.sync();
            refreshResource($scope.currentResourceType, $scope.editedResource);
            $scope.display.processing = undefined;
            $scope.closeResource();
        };

        $scope.deleteResourcesSelection = function() {
            $scope.currentResourceType.resourcesToDelete = $scope.currentResourceType.resources.selection();
            $scope.currentResourceType.resources.deselectAll();
            template.open('resources', 'confirm-delete-resource');
        };

        $scope.doDeleteResource = function() {
            $scope.isManage = true;
            $scope.display.processing = true;
            $scope.currentErrors = [];
            let actions = $scope.currentResourceType.resourcesToDelete.length;
            _.each($scope.currentResourceType.resourcesToDelete, function(resource) {
                resource.delete(
                    function() {
                        actions--;
                        if (actions === 0) {
                            $scope.display.processing = undefined;
                            $scope.closeResource();
                            $scope.refreshRessourceType();
                        }
                    },
                    function(e) {
                        $scope.currentErrors.push(e);
                        actions--;
                        if (actions === 0) {
                            $scope.display.processing = undefined;
                            $scope.showActionErrors();
                            $scope.refreshRessourceType();
                        }
                    }
                );
            });
        };

        $scope.closeResourceType = function() {
            $scope.editedResourceType = undefined;
            $scope.currentErrors = [];
            if ($scope.display.showPanel === true) {
                $scope.display.showPanel = false;
                template.close('lightbox');
            }
            template.open('resources', 'manage-resources');
        };

        $scope.closeResource = function() {
            $scope.editedResource = undefined;
            $scope.currentErrors = [];
            if ($scope.display.showPanel === true) {
                $scope.display.showPanel = false;
                template.close('lightbox');
            }
            template.open('resources', 'manage-resources');
        };

        // Errors
        $scope.showActionErrors = function() {
            $scope.display.showPanel = true;
            template.open('lightbox', 'action-errors');
        };

        $scope.isErrorObjectResourceType = function(object) {
            return object instanceof ResourceType;
        };

        $scope.isErrorObjectResource = function(object) {
            return object instanceof Resource;
        };

        $scope.isErrorObjectBooking = function(object) {
            return object instanceof Booking;
        };

        $scope.closeActionErrors = function() {
            $scope.display.showPanel = false;
            template.close('lightbox');
        };

        // Special Workflow and Behaviours
        $scope.hasWorkflowOrAnyResourceHasBehaviour = function(
            workflowRight,
            ressourceRight
        ) {
            let workflowRights = workflowRight.split('.');
            return (
                (model.me.workflow[workflowRights[0]] !== undefined &&
                    model.me.workflow[workflowRights[0]][workflowRights[1]] === true) ||
                $scope.resourceTypes.all.find(function(resourceType) {
                    return (
                        resourceType.resources.all.find(function(resource) {
                            return (
                                resource.myRights !== undefined &&
                                resource.myRights[ressourceRight] !== undefined
                            );
                        }) !== undefined
                    );
                })
            );
        };

        // Used when adding delays to resources
        $scope.delayDays = _.range(1, 31);
        $scope.daysToSeconds = function(nbDays) {
            return moment.duration(nbDays, 'days').asSeconds();
        };
        $scope.secondsToDays = function(nbSeconds) {
            return moment.duration(nbSeconds, 'seconds').asDays();
        };



        $scope.editSelectedType = function() {
            $scope.display.processing = undefined;
            $scope.editedResourceType = $scope.resourceTypes.selection()[0];
            template.close('resources');
            $scope.updateSlotProfileField($scope.editedResourceType.structure);
            template.open('resources', 'edit-resource-type');
        };

        $scope.updateSlotProfileField = async function(struct) {
            $scope.slotprofiles = new SlotProfiles();
            await $scope.slotprofiles.sync(struct.id);
            $scope.$apply();
        };

        $scope.removeSelectedTypes = function() {
            $scope.display.confirmRemoveTypes = true;
        };

        $scope.doRemoveTypes = function() {
            $scope.resourceTypes.removeSelectedTypes();
            $scope.display.confirmRemoveTypes = false;
            template.close('resources');
            $scope.closeResourceType();
            $scope.isManage = true;
            $scope.currentResourceType = undefined;
            $scope.refreshRessourceType();
        };

        // display a warning when editing a resource and changing the resource type (not in creation mode).
        $scope.resourceTypeModified = function() {
            if (
                $scope.currentResourceType != $scope.editedResource.resourceType &&
                !$scope.isCreation
            ) {
                notify.info('rbs.type.info.change');
            }
            // update color of color picker only in case of creation
            if ($scope.editedResource.id === undefined) {
                $scope.editedResource.color = $scope.editedResource.resourceType.color;
            }
        };


        $scope.showDaySelection = true;
        $scope.checkDateFunction = function() {
            if (
                moment($scope.booking.endDate).diff(
                    moment($scope.booking.startDate),
                    'days'
                ) >= 0
            ) {
                $scope.showDaySelection = true;
            } else {
                $scope.showDaySelection = false;
            }
            if (
                moment($scope.booking.endDate).diff(
                    moment($scope.booking.periodicEndDate),
                    'days'
                ) > 0
            ) {
                $scope.booking.periodicEndDate = $scope.booking.endDate;
            }
        };

        $scope.startDateModif = function() {
            $scope.booking.endDate = $scope.booking.startDate;
            $scope.showDaySelection = true;
        };

        $scope.saveTreeState = async ()=> {
            await $scope.preference.save($scope.structures);
            $scope.preference.sync();
        };

        $scope.initExportDisplay = function() {
            $scope.exportComponent.display = {
                state: 0,
                STATE_FORMAT: 0,
                STATE_RESOURCES: 1,
                STATE_DATE: 2,
                STATE_VIEW: 3
            };
        };

        $scope.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };

        $scope.checkResourcesExport = function (resourcesToTake) {
            if (resourcesToTake === "selected") {
                return lang.translate('rbs.export.resource.selected.summary');
            } else {
                return lang.translate('rbs.export.resource.all.summary');
            }
        };

        $scope.checkViewExport = function (view) {
            if (view === "DAY") {
                return lang.translate('rbs.export.view.day')
            }
            else if (view === "WEEK") {
                return lang.translate('rbs.export.view.week')
            }
            else {
                return lang.translate('rbs.export.view.list')
            }
        };

        $scope.exportForm = function () {
            $scope.exportComponent = new ExportBooking ();
            $scope.initExportDisplay();
            $scope.minExportDate = moment().week(moment().week() - 12).day(1).toDate();
            $scope.maxExportDate = moment().week(moment().week() + 12).day(7).toDate();
            template.open('lightbox','export-format');
            $scope.display.showPanel = true;
        }

        $scope.checkMinExportDate = function () {
            if ($scope.exportComponent.startDate < $scope.minExportDate) {
                $scope.exportComponent.startDate = $scope.minExportDate;
            }
            $scope.maxExportDate = moment($scope.exportComponent.startDate).week(moment($scope.exportComponent.startDate).week() + 12).day(7).toDate();
        }

        $scope.checkMaxExportDate = function () {
            if ($scope.exportComponent.endDate > $scope.maxExportDate) {
                $scope.exportComponent.endDate = $scope.maxExportDate;
            }
            $scope.minExportDate = moment($scope.exportComponent.endDate).week(moment($scope.exportComponent.endDate).week() - 12).day(1).toDate();
        }

        $scope.closeExport = function () {
            $scope.display.showPanel = false;
            $scope.exportation = undefined;
            template.close('lightbox');
        }

        $scope.saveExport = function () {
            $scope.exportComponent.startDate = moment([
                $scope.exportComponent.startDate.getFullYear(),
                $scope.exportComponent.startDate.getMonth(),
                $scope.exportComponent.startDate.getDate()
            ]);
            $scope.exportComponent.startDate = $scope.exportComponent.startDate.format('YYYY-MM-DD');
            $scope.exportComponent.endDate = moment([
                $scope.exportComponent.endDate.getFullYear(),
                $scope.exportComponent.endDate.getMonth(),
                $scope.exportComponent.endDate.getDate()
            ]);
            $scope.exportComponent.endDate = $scope.exportComponent.endDate.format('YYYY-MM-DD');
            if ($scope.exportComponent.format === "ICal") {
                $scope.exportComponent.exportView = "NA";
            }
            if ($scope.exportComponent.resourcesToTake === "selected"){
                $scope.resourceTypes.forEach(function(resourceType) {
                    resourceType.resources.forEach(function(resource) {
                        if (resource.selected) {
                            $scope.exportComponent.resources.push(resource.id);
                        }
                    });
                });
            } else {
                $scope.resourceTypes.forEach(function(resourceType) {
                    resourceType.resources.forEach(function(resource) {
                        $scope.exportComponent.resources.push(resource.id);
                    });
                });
            }

            if ($scope.exportComponent.format === 'ICal') {
                $scope.exportComponent.send(function(data) {
                    let blob;
                    if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
                        blob = new Blob ([data], {type: 'application/pdf;charset=utf-8'});
                    } else { // ie
                        // let bb = new BlobBuilder(); FIXme RRAH
                        // bb.append(data);
                        // blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
                    }
                    saveAs(blob, moment().format("YYYY-MM-DD") + '_export-reservations.ics');
                });
            } else {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/rbs/bookings/export', true);
                xhr.responseType = "arraybuffer";
                xhr.setRequestHeader("Content-type", "application/pdf");

                xhr.addEventListener("load", function (evt) {
                    //fixme   let data = evt.target.response;
                    //    if (this.status === 200) {
                    //      let blob = new Blob([data], {type: "application/pdf;charset=utf-8"});
                    //      saveAs(blob, moment().format("YYYY-MM-DD") + '_export-reservations.pdf');
                    //    }
                }, false);

                //  xhr.send(angular.toJson($scope.exportComponent.toJSON()));
            }
            $scope.closeExport();
        }

        $scope.switchNotification = function (resource, resourceType) {
            //$scope.switchSelect(resource);
            if (resource.notified) {
                $scope.notificationsComponent.removeNotification(resource.id);
                resource.notified = false;
            } else {
                $scope.notificationsComponent.postNotification(resource.id);
                resource.notified = true;
            }
            $scope.checkNotificationsResourceType(resourceType);
        }

        $scope.switchNotifications = function(resourceType) {
            if (
                resourceType.resources.every(function(resource) {
                    return resource.notified;
                })
            ) {
                $scope.disableNotificationsResources(resourceType);
            } else {
                $scope.enableNotificationsResources(resourceType);
            }
        };

        $scope.disableNotificationsResources = function (resourceType) {
            resourceType.resources.forEach(function(resource) {
                resource.notified = false;
            });
            $scope.notificationsComponent.removeNotifications(resourceType.id);
            resourceType.notified = 'none';
        };

        $scope.enableNotificationsResources = function (resourceType) {
            resourceType.resources.forEach(function(resource) {
                resource.notified = true;
            });
            $scope.notificationsComponent.postNotifications(resourceType.id);
            resourceType.notified = 'all';
        };

        $scope.checkNotificationsResourceType = function (resourceType) {
            if (resourceType.resources.all.length === 0) {
                resourceType.notified = 'none';
            } else if (
                resourceType.resources.every(function(resource) {
                    return resource.notified;
                })
            ) {
                resourceType.notified = 'all';
            } else if (
                resourceType.resources.every(function(resource) {
                    return !resource.notified;
                })
            ) {
                resourceType.notified = 'none';
            } else {
                resourceType.notified = 'some';
            }
        };

        $scope.selectBooking = function (currentBooking) {
            if (currentBooking.is_periodic === true) {
                return $scope.booking._slots;
            } else {
                return [$scope.booking];
            }
        };

    }]);
