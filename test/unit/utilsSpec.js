'use strict';

describe('The utils module', function() {
    var utils;

  beforeEach(module('utilsModule'));
  
  beforeEach(
    inject(function(Utils) {   
      utils = Utils;
    })
  );

  it('should convert a date object to a viewable format', function(){
      var d = new Date();
      d.setDate(1);
      d.setMonth(0);
      d.setYear(1999);
      expect(utils.dateObjectToViewDate(d)).toBe('01.01.1999');
  });
});
