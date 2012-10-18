'use strict';

describe('The calendar module', function() {
    var calendar;

  beforeEach(module('calendarModule'));
  
  beforeEach(
    inject(function(Calendar, Utils) {   
      calendar = Calendar;
    })
  );


  it('should return the correct name of the month', function() {
    var d = new Date();             
    expect(calendar.getMonthName()[0]).toBe('January');
    expect(calendar.getMonthName()[1]).toBe('February');
    expect(calendar.getMonthName()[2]).toBe('March');
    expect(calendar.getMonthName()[3]).toBe('April');
    expect(calendar.getMonthName()[4]).toBe('May');
    expect(calendar.getMonthName()[5]).toBe('June');
    expect(calendar.getMonthName()[6]).toBe('July');
    expect(calendar.getMonthName()[7]).toBe('August');
    expect(calendar.getMonthName()[8]).toBe('September');
    expect(calendar.getMonthName()[9]).toBe('October');
    expect(calendar.getMonthName()[10]).toBe('November');
    expect(calendar.getMonthName()[11]).toBe('December');
  });  

  it('should calculate the number of days between two dates', function() {
    var d1 = new Date();
    d1.setDate(5);
    var d2 = new Date()             ;
    d2.setDate(10);
    expect(calendar.numberOfDaysBetweenDates(d1, d2)).toBe(5);
  });  
  it('should calculate the number of days between two dates', function() {
    var d1 = new Date();
    d1.setDate(5);
    d1.setMonth(2);
    var d2 = new Date();
    d2.setDate(10);
    d2.setMonth(3);
    expect(calendar.numberOfDaysBetweenDates(d1, d2)).toBe(35);
  });  


  it('should return the number of days in a given month', function() {
    expect(calendar.getNoOfDaysInMonth()[0]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[1]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[2]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[3]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[4]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[5]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[6]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[7]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[8]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[9]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[10]).toBe(31);
    expect(calendar.getNoOfDaysInMonth()[11]).toBe(31);
  })

});
