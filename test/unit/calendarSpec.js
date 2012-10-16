'use strict';

describe('In the calendar module', function() {
    var calendar;

   beforeEach(module('calendarModule'));
  

  beforeEach(
    inject(function(Calendar) {   
      calendar = Calendar;
    })
  );

  describe('get month name', function(){

    it('should return the value January', function() {
      var d = new Date();             
      expect(calendar.getMonthName()[0]).toBe('January');
    });  

    it('should return the value January', function() {
      var d = new Date();             
      expect(calendar.getMonthName()[0]).toBe('January');
    });  
    
    it('should return the value December', function() {
      var d = new Date();             
      expect(calendar.getMonthName()[11]).toBe('December');
    });  
  });

  describe('get number of days between two dates', function(){
    it('should return the value 5', function() {
      var d1 = new Date();
      d1.setDate(5);
      var d2 = new Date()             ;
      d2.setDate(10);
      expect(calendar.numberOfDaysBetweenDates(d1, d2)).toBe(5);
    });  
    it('should return the value 5', function() {
      var d1 = new Date();
      d1.setDate(5);
      d1.setMonth(2);
      var d2 = new Date();
      d2.setDate(10);
      d2.setMonth(3);
      expect(calendar.numberOfDaysBetweenDates(d1, d2)).toBe(35);
    });  
  });


});
