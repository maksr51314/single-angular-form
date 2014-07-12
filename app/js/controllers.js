'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

        function MyCtrl1() {
            $scope.tabs = [
                { title:'Dynamic Title 1', content:'Dynamic content 1' },
                { title:'Dynamic Title 2', content:'Dynamic content 2' }
            ];


        }

        return new MyCtrl1();

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
