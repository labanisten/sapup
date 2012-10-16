'use strict';

describe('In the calendar module', function() {
  var scope, 
      ctrl, 
      $httpBackend,
      calendar,
      utils;


    beforeEach(module('systemAvailability')); 
    beforeEach(module('calendarModule'));
  // beforeEach(module('directiveModule'));
  // beforeEach(module('mongodbModule'));
  

  beforeEach(
    inject(function(_$httpBackend_, $rootScope, $controller) {   


      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(/systems*/).respond({});
      $httpBackend.expectGET(/systemnames*/).respond({});
      $httpBackend.expectGET(/systemstatuses*/).respond({});
      $httpBackend.expectGET(/alerts*/).respond({});
      $httpBackend.expectGET(/alerttypes*/).respond({});
     
      scope = $rootScope.$new();
      ctrl = $controller('TimelineCtrl', {$scope: scope});
    })
  );

  describe('get month name', function(){
    it('should return the value January', function() {
      var d = new Date();             
      expect(ctrl.Calendar.getMonthName()[0]).toBe('January');
    });  
    it('should return the value December', function() {
      var d = new Date();             
      expect(ctrl.Calendar.getMonthName()[11]).toBe('December');
    });  
  });

  describe('get number of days between two dates', function(){
    it('should return the value 5', function() {
      var d1 = new Date();
      d1.setDate(5);
      var d2 = new Date()             ;
      d2.setDate(10);
      expect(ctrl.Calendar.numberOfDaysBetweenDates(d1, d2)).toBe(5);
    });  
    it('should return the value 5', function() {
      var d1 = new Date();
      d1.setDate(5);
      d1.setMonth(2);
      var d2 = new Date();
      d2.setDate(10);
      d2.setMonth(3);
      expect(ctrl.Calendar.numberOfDaysBetweenDates(d1, d2)).toBe(35);
    });  
  });


});
