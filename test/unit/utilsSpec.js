'use strict';

describe('The utils module', function() {
  var utils;

  beforeEach(module('utilsModule'));
  

  beforeEach(
    inject(function(Utils) {   
      utils = Utils;
    })
  );


  it('should convert a date string to js date format', function(){
      var dateString = '19990101';
      var jsTime = 915145200000;
      expect(utils.convertToDate(dateString).getTime()).toBe(jsTime);
  });


  it('should convert a date object to a viewable format', function(){
      var d = new Date();
      d.setDate(1);
      d.setMonth(0);
      d.setYear(1999);

      expect(utils.dateObjectToViewDate(d)).toBe('01.01.1999');
  });


  it('should convert a database date to viewable format', function(){
      var dateString = '19990101';
      expect(utils.dbDateToViewDate(dateString)).toBe('01.01.1999');
  });


  it('should convert a viewable date to database date format', function(){
      var dateString = '01.01.1999';
      expect(utils.viewDateToDBDate(dateString)).toBe('19990101');
  });


  it('should convert a viewable date to database date format', function(){
      var dateString = '01.01.1999';
      var jsTime = 915145200000;
      expect(utils.viewDateToDateObject(dateString).getTime()).toBe(jsTime);
  });


  it('should pad a zero (0) char to front of input string', function(){
      var string = 1;
      expect(utils.padZeroFront(string)).toBe('01');
  });


  it('should return string format of js date', function(){
      var date = new Date(1999,0,1);
      expect(utils.getDateString(date)).toBe('19990101');
  });


  it('should convert a date string to js date object', function(){
      var dateString = '19990101';
      var jsTime = 915145200000;
      expect(utils.dateFromString(dateString).getTime()).toBe(jsTime);
  });


  it('should compare to js date objects', function(){
      var date1 = new Date(1999,0,1);
      var date2 = new Date(1999,0,1);
      expect(utils.sameDay(date1, date2)).toBe(true);
  });


  it('should decrement input month', function(){
      var month = 0;
      expect(utils.decMonth(month)).toBe(11);
  });


  it('should increment input month', function(){
      var month = 11;
      expect(utils.incMonth(month)).toBe(0);
  });

 it('should build array of months close to input month', function(){
      var month = 5;
      var monthList = [3, 4, 5, 6, 7];
      expect(utils.buildCompactMonthList(month)).toEqual(monthList);
  });

  /*
  it('should search system element for spesific line', function(){
      expect(utils.findSystem()).toBe();
  });


  it('should find if tag exists in array', function(){
      expect(utils.existInTagArray()).toBe();
  });
  */

  it('should find if date is a weekend', function(){
      var date = new Date(2013,1,24);
      expect(utils.dateIsWeekend(date)).toBe(true);
  });

});
