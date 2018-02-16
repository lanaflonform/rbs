import { ng, angular, model, moment, _ } from 'entcore';
import http from 'axios';

declare let infraPrefix: any;

export const timePickerRbs = ng.directive('timePickerRbs', function () {
    return {
        scope: {
            ngModel: '=',
            ngBegin: '=',
            ngEnd: '=',
            ngLimit: '='
        },
        transclude: true,
        replace: true,
        restrict: 'E',
        template: "<input type='text' />",
        link: function($scope, $element, $attributes){
            let hideFunction = function(e){
                let timepicker = $element.data('timepicker');
                if(!timepicker || $element[0] === e.target || $('.bootstrap-timepicker-widget').find(e.target).length !== 0){
                    return;
                }
                timepicker.hideWidget();
            };
            $('body, lightbox').on('click', hideFunction);
            $('body, lightbox').on('focusin', hideFunction);
/*
            http.get('/' + infraPrefix + '/public/js/bootstrap-timepicker.js')
                .then((response) => {
                    $element.timepicker({
                        showMeridian: false,
                        defaultTime: 'current',
                        minuteStep: model.timeConfig.interval,
                        minHour: model.timeConfig.start_hour,
                        maxHour: model.timeConfig.end_hour
                    });
                });
*/
            $element.timepicker({
                showMeridian: false,
                defaultTime: 'current',
                minuteStep: model.timeConfig.interval,
                minHour: model.timeConfig.start_hour,
                maxHour: model.timeConfig.end_hour
            });

            $scope.$watch('ngModel', function(newVal){
                $scope.ngModel = newVal;
                $element.val($scope.ngModel.format("HH:mm"));
                if( ($scope.ngLimit !== undefined && !newVal.isSame($scope.ngLimit))
                    && ( ($scope.ngBegin === true && newVal.isAfter($scope.ngLimit))
                        || ($scope.ngEnd === true && newVal.isBefore($scope.ngLimit)) )
                ){
                    $scope.ngLimit = moment(newVal);
                }
            });

            $element.on('change', function(){
                let time = $element.val().split(':');
                $scope.ngModel = moment($scope.ngLimit);
                $scope.ngModel.set('hour', time[0]);
                $scope.ngModel.set('minute', time[1]);
                $scope.$apply('ngModel');
                $scope.$parent.$eval($scope.ngChange);
                $scope.$parent.$apply();
            });

            $element.on('focus', function() {
                $element.timepicker('updateFromElementVal');
            });

            $element.on('show.timepicker', function() {
                let timepicker = $element.data('timepicker');
                if (! timepicker){
                    return;
                }
                let lightbox = $element.parents().find('lightbox');
                if(lightbox) {
                    _.each(lightbox.find('.lightbox-view, .lightbox-background'), function(zone) {
                        $(zone).on('mousedown.timepicker, touchend.timepicker', function(e) {
                            if (!($element.parent().find(e.target).length ||
                                    timepicker.$widget.is(e.target) ||
                                    timepicker.$widget.find(e.target).length)) {
                                timepicker.hideWidget();
                            }
                        });
                    });
                }
            });

            $element.on('hide.timepicker', function() {
                let lightbox = $element.parents().find('lightbox');
                if(lightbox) {
                    _.each(lightbox.find('.lightbox-view, .lightbox-background'), function(zone) {
                        $(zone).off('mousedown.timepicker, touchend.timepicker');
                    });
                }
            });

            $element.on('$destroy', function(){
                $element.timepicker('remove');
            });
        }
    }
});
