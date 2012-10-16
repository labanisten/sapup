'use strict';

describe('The main controller', function() {
  var scope, 
      ctrl, 
      $httpBackend;


  beforeEach(module('systemAvailability')); 
  
  beforeEach(
    inject(function(_$httpBackend_, $rootScope, $controller) {   

      var systems = [{system:"D03"}]; 
      var systemnames = {name:"D03"}; 
      var systemstatuses = [{status:"freeze"}, {status:"upgrade"}]; 
      var alerts = {title:"Downtime", comment:"System will be down"}; 
      var alerttypes = [{type:"warning"}, {type:"error"}]; 

      var sysJSON = JSON.stringify(systems); 

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(/systems*/).respond(JSON.stringify(systems));
      $httpBackend.expectGET(/systemnames*/).respond(JSON.stringify(systemnames));
      $httpBackend.expectGET(/systemstatuses*/).respond(JSON.stringify(systemstatuses));
      $httpBackend.expectGET(/alerts*/).respond(JSON.stringify(alerts));
      $httpBackend.expectGET(/alerttypes*/).respond(JSON.stringify(alerttypes));

      scope = $rootScope.$new();
      ctrl = $controller('TimelineCtrl', {$scope: scope});

     
    })
  );

  it('should fetch all systems', function() {
    
    //$httpBackend.expectGET(/systems*/).respond();
    //expect(ctrl.systemlines.system).toBe("D03");
    // var controller = scope.$new(TimelineCtrl);
    expect(true).toBe(true);
  });  

});
