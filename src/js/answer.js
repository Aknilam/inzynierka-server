(function() {
  'use strict';
  var mmAnswer = angular.module('mmAnswer', ['mmAlert']);

  mmAnswer.factory('mmAnswer', ['mmAlert', function(alert) {
    var answer = {
      status: {
        success: 200,
        error: 400,
        forbidden: 403,
        notexists: 404,
        closedProject: 419
      },
      server: {
        project: {
          closed: 'closed'
        }
      },
      project: {
        closedMessage: 'Project already closed',
        accessMessage: 'You do not have access to perform this action',
        failure: function(data, status) {
          if (angular.isDefined(status)) {
            if (status === answer.status.closedProject) {
              answer.project.failureData(data);
            } else if (status === answer.status.forbidden) {
              alert.warning(answer.project.accessMessage);
            }
          } else {
            answer.project.failureData(data);
          }
        },
        failureData: function(data) {
          if (data === answer.server.project.closed) {
            alert.warning(answer.project.closedMessage);
          }
        }
      }
    };
    return answer;
  }]);

})();
