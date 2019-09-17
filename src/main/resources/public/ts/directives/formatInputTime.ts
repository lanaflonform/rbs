// import {ng} from "entcore";
//
// export const FormatInputTime = ng.directive('ngModel', function( $filter ) {
//     return {
//         require: '?ngModel',
//         link: function(scope, elem, attr, ngModel) {
//             if( !ngModel )
//                 return;
//             if( attr.type !== 'time' )
//                 return;
//
//             ngModel.$formatters.unshift(function(value) {
//                 // value.replace(/:[0-9]{2}\.[0-9]{3}$/, '')
//                 value
//             });
//         }
//     }
// });