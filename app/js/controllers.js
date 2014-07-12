'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

        var templateData = {
            "workflowCreationInformation":{
                "workflowTypeName": "Incident Report",
                "name": "Report - 2013.05.09"
            },
            "workflowStepUpdateInformation":{
                "stepIdOrName": "Initial Step",
                "fields":[
                    {"name":"Date and Time of Incident","values":["2013-05-13T15:40:00"]},
                    {"name":"Reported By","values":["John Doe"]},
                    {"name":"Company of Reporter","values":["CompanyA"]},
                    {"name":"Contact Number","values":["405.234.9751"]},
                    {"name":"Supervisor Name","values":["Aaron Moore"]},
                    {"name":"High Level Description of Incident","values":["description"]},
                    {"name":"Well Number","values":["Well-01"]},
                    {"name":"Region","values":["South"]},
                    {"name":"State","values":["Oklahoma"]},
                    {"name":"Field Office","values":["Ringwood"]},
                    {"name":"Incident Severity (Check all that Apply)","values":["Loss of well control", "Spill offsite > 50 Bbls"]},
                    {"name":"Description of Corrective Action (1)","values":["description"]},
                    {"name":"Action Taken By (name) (1)","values":["James Bucci"]},
                    {"name":"Company (1)","values":["CompanyA"]},
                    {"name":"Date (1)","values":["2013-05-22T09:00:00"]},
                    {"name":"Description of Corrective Action (2)","values":["description"]},
                    {"name":"Action Taken By (name) (2)","values":["Michael Mondt"]},
                    {"name":"Company (2)","values":["CompanyB"]},
                    {"name":"Date (2)","values":["2013-05-11T13:35:00"]}
                ]
            }
        };


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
