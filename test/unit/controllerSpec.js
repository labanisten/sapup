'use strict';

describe('The main controller', function() {
  var scope, 
      ctrl, 
      $httpBackend;


  beforeEach(module('systemAvailability')); 
  
  beforeEach(
    inject(function(_$httpBackend_, $rootScope, $controller) {   

      //var systems = [{system:"D03"}]; 

      var systemlines = [ 

                      { 
                        "system": "T03",
                        "text": "TREX",
                        "statuslines": [
                          {
                            "start": "20130128",
                            "end": "20130203",
                            "status": "Downtime",
                            "comment": "Upgrade V02 2013"
                          }
                        ],
                        "_id": "50ed68c4198bdca440000006"
                      },
                      {
                        "system": "D05",
                        "text": "RETAIL",
                        "statuslines": [
                          {
                            "start": "20121017",
                            "end": "20121019",
                            "status": "upgrade",
                            "comment": ""
                          }
                        ],
                        "_id": "507ff2b365058a7c32000001"
                      }
                    ];


      var systemnames = [
                          {
                            "_id": "50ed683b198bdca440000005",
                            "name": "T03",
                            "text": "TREX",
                            "systemgroup": "TREX",
                            "order": 2,
                            "tags": "Development"
                          },
                          {
                            "_id": "50bf4e6aad9ca7941700000d",
                            "name": "D05",
                            "text": "Retail",
                            "order": 3,
                            "systemgroup": "Retail",
                            "tags": "Development;Version line;Quality"
                          }
                        ];

      var systemstatuses = [
                            {
                              "status": "Downtime",
                              "_id": "50814bbe4a86037c22000001"
                            },
                            {
                              "status": "Maybe down",
                              "_id": "50814bc54a86037c22000002"
                            },
                            {
                              "status": "Ready for test",
                              "_id": "50814bcb4a86037c22000003"
                            },
                            {
                              "_id": "51026fbbc518e1a97d2b0517",
                              "status": "Information"
                            }
                          ]; 

      var alertlines = [
                    {
                      "title": "Browser support",
                      "alerttype": "success",
                      "expdate": "20991231",
                      "comment": "Best viewed in Chrome/Firefox, but IE9 should be fully supported",
                      "timestamp": 1352366019053,
                      "_id": "509b77c5fd6a956025000002"
                    },
                    {
                      "title": "Version 01 2013",
                      "alerttype": "warning",
                      "expdate": "20990112",
                      "comment": "P07 will go live with version release 1 2013 11.01 - 12.01. This means downtime beteen 11.01 23:00 - 12.01 23:00 CET.",
                      "timestamp": 1355901703757,
                      "_id": "50d16b0ac620d0443c000005"
                    }
                   ]; 

      var alerttypes = [
                          {
                            "type": "warning",
                            "_id": "506ad0c1a4c2d48830000003"
                          },
                          {
                            "type": "error",
                            "_id": "506ad179a4c2d48830000004"
                          },
                          {
                            "type": "success",
                            "_id": "506ad18ca4c2d48830000006"
                          }
                       ];

      var systemgroups = [  
                            {
                              "name": "Production",
                              "text": "Production",
                              "order": 5,
                              "_id": "50e56e30c5a0484013000004"
                            },
                            {
                              "name": "TREX",
                              "text": "TREX",
                              "order": 17,
                              "_id": "50ed67b6198bdca440000002"
                            },
                            {
                              "name": "Retail",
                              "text": "Retail",
                              "order": 6,
                              "_id": "50e56e30c5a0484013000003"
                            }
                          ];

      //var sysJSON = JSON.stringify(systemlines); 

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(/systems*/).respond(JSON.stringify(systemlines));
      $httpBackend.expectGET(/systemnames*/).respond(JSON.stringify(systemnames));
      $httpBackend.expectGET(/systemstatuses*/).respond(JSON.stringify(systemstatuses));
      $httpBackend.expectGET(/systemgroups*/).respond(JSON.stringify(systemgroups));
      $httpBackend.expectGET(/alerts*/).respond(JSON.stringify(alertlines));
      //$httpBackend.when('GET', '/alerts*/').respond(JSON.stringify(alertlines));
      $httpBackend.expectGET(/alerttypes*/).respond(JSON.stringify(alerttypes));
      $httpBackend.expectGET(/userdata*/).respond();

      scope = $rootScope.$new();
      ctrl = $controller('TimelineCtrl', {$scope: scope});

    })
  );

/*
  it('should', function() {
    $httpBackend.flush();
    expect(scope.).toBe("");
  }); 

*/


  /*************************************************************


    Tests for Normal layout


  *************************************************************/


  it('should fetch all systems', function() {
    $httpBackend.flush();
    expect(scope.messageAreaClass()).toBe("FV");
  });  


  it('should return class for element if exist', function() {
    $httpBackend.flush();
    expect(scope.getClassForElement(0,0)).toBe('element-inner element-click downtime');
  }); 


  it('should test if an element is selected', function() {
    $httpBackend.flush();
    scope.selectElement("",1 ,0 );
    expect(scope.selectedElement._id).toBe('507ff2b365058a7c32000001');
  }); 


  it('should return class for month html element', function() {
    $httpBackend.flush();
    scope.selectedMonth = 5;
    expect(scope.getClassForMonth(5)).toBe("span1 month selectedmonth");
  }); 


  it('should', function() {
    scope.activeGroupTags = [{Tag:"tag"}];
    expect(scope.getClassForTableRowSystemGroup("")).toBe("hidden");
  }); 


  it('should determine if calendar row is hidden or shown', function() {
    $httpBackend.flush();

    /*************************************************************
      Test with only regular Tags active
    *************************************************************/
    scope.activeTags = ["Production"];
    expect(scope.getClassForSystemTableRow(1)).toBe("hidden");
    //Element must be part of both tags
    scope.activeTags = ["Production", "Development"];
    expect(scope.getClassForSystemTableRow(1)).toBe("hidden");
    scope.activeTags = ["Development"];
    expect(scope.getClassForSystemTableRow(1)).toBe("systemrow ");


    /*************************************************************
      Test with only Group Tags active
    *************************************************************/
    scope.activeTags = [];
    scope.activeGroupTags = ["TREX"];
    expect(scope.getClassForSystemTableRow(1)).toBe("hidden");
    //Needs only one match in active tag group
    scope.activeGroupTags = ["Retail", "TREX"];
    expect(scope.getClassForSystemTableRow(1)).toBe("systemrow ");

    /*************************************************************
      Test with both Group Tags and regular Tags active
    *************************************************************/
    scope.activeTags = ["Production", "Development"];
    scope.activeGroupTags = ["TREX"];
    expect(scope.getClassForSystemTableRow(1)).toBe("hidden");
    //Element must be part of both regular tags
    scope.activeGroupTags = ["Retail", "TREX"];
    expect(scope.getClassForSystemTableRow(1)).toBe("hidden");
    //Needs only one match in active tag group
    scope.activeTags = ["Development"];
    scope.activeGroupTags = ["Retail", "TREX"];
    expect(scope.getClassForSystemTableRow(1)).toBe("systemrow ");
  }); 


  it('should return status for GroupTag button', function() {
    scope.activeGroupTags = ["Retail", "TREX"];
    expect(scope.getClassForGroupTagButton("Retail")).toBe("btn btn-small selected");
  }); 


  it('should test if day of table cell text is weekend', function() {
    //16.02.2013 is a Saturday
    //02.02.2013 is a Friday
    scope.selectedYear = "2013"
    scope.selectedMonth = 1;
    expect(scope.getClassForDayNameHeaderCell(15)).toBe("weekend");
    expect(scope.getClassForDayNameHeaderCell(0)).toBe("");
  }); 


  it('should test if day of table cell number is weekend and if current day', function() {
    //16.02.2013 is a Saturday
    //02.02.2013 is a Friday
    scope.selectedYear = "2013"
    scope.selectedMonth = 1;
    expect(scope.getClassForDayHeaderCell(15)).toBe("weekend");
    expect(scope.getClassForDayHeaderCell(0)).toBe("");

    //Use new js date with current date to test the currentday functionality. 
    //found it difficult to change the Calendar.currentDate in scope
    var testDate = new Date();
    if(date.getDay() === 6 || date.getDay() === 0) {
      expect(scope.getClassForDayHeaderCell(testDate.getDate() - 1)).toBe("currentday weekend");
    }else {
      expect(scope.getClassForDayHeaderCell(testDate.getDate() - 1)).toBe("currentday ");
    }

  });


  it('should add GroupTag to active groupTagArray on click', function() {
    $httpBackend.flush();
    scope.groupBadgeClick("TREX");
    expect(scope.activeGroupTags.length).toBe(1);
    expect(scope.activeGroupTags[0]).toBe("TREX");
  }); 


  it('should add Tag to active tagArray on click', function() {
    $httpBackend.flush();
    scope.tagBadgeClick("Quality");
    expect(scope.activeTags.length).toBe(1);
    expect(scope.activeTags[0]).toBe("Quality");
  });


  it('should change month for normal layout', function() {
    $httpBackend.flush();
    $httpBackend.expectGET(/systems*/).respond();

    scope.gotoMonth("N/A", 5)
    expect(scope.selectedMonth).toBe(5);

    //$httpBackend.flush();
  });


  it('should decrement current viewed year', function() {
    $httpBackend.flush();
    $httpBackend.expectGET(/systems*/).respond();

    scope.selectedYear = 1999;
    scope.gotoPreviousYear();
    expect(scope.selectedYear).toBe(1998);

    $httpBackend.flush();
  }); 


  it('should increment current viewed year', function() {
    $httpBackend.flush();
    $httpBackend.expectGET(/systems*/).respond();

    scope.selectedYear = 1999;
    scope.gotoNextYear();
    expect(scope.selectedYear).toBe(2000);

    $httpBackend.flush();
  });


  it('should decrement current viewed month', function() {
    $httpBackend.flush();
    scope.selectedYear = 1999;
    scope.selectedMonth = 5;

    scope.gotoPreviousMonth();
    expect(scope.selectedMonth).toBe(4);

    scope.selectedMonth = 0;
    scope.gotoPreviousMonth();
    expect(scope.selectedMonth).toBe(11);
    expect(scope.selectedYear).toBe(1998);
  }); 


  it('should increment current viewed month', function() {
    $httpBackend.flush();
    scope.selectedYear = 1999;
    scope.selectedMonth = 5;

    scope.gotoNextMonth();
    expect(scope.selectedMonth).toBe(6);

    scope.selectedMonth = 11;
    scope.gotoNextMonth();
    expect(scope.selectedMonth).toBe(0);
    expect(scope.selectedYear).toBe(2000);
  }); 





  /*************************************************************


    Tests for Compact layout


  *************************************************************/

  it('should return status for month bar in compact layout', function() {
    scope.currentCompactpage = scope.page.status
    expect(scope.getClassForCompactMonthBar()).toBe("months");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactMonthBar()).toBe("months hidden");
  }); 


  it('should return status for each element in month bar in compact layout', function() {
    scope.selectedMonthCompact = 1;
    expect(scope.getClassForCompactMonthElement(5)).toBe("btn btn-primary month");
    scope.selectedMonthCompact = 5;
    expect(scope.getClassForCompactMonthElement(5)).toBe("btn btn-success month selectedmonth");
  }); 


  it('should return status for year button in compact layout', function() {
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForCompactYearButton()).toBe("btn btn-primary yearbtn-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactYearButton()).toBe("btn btn-primary yearbtn-compact hidden");
  }); 


  it('should return status for home button in compact layout', function() {
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForCompactHomeButton()).toBe("btn btn-primary homebtn-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactHomeButton()).toBe("btn btn-primary homebtn-compact hidden");
  }); 


  it('should return status for system back button in compact layout', function() {
    scope.currentCompactpage = scope.page.system;
    expect(scope.getClassForCompactSystemBackButton()).toBe("btn btn-primary system-backbtn-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactSystemBackButton()).toBe("btn btn-primary system-backbtn-compact hidden");
  }); 


  it('should return status for status back button in compact layout', function() {
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForCompactStatusBackButton()).toBe("btn btn-primary status-backbtn-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactStatusBackButton()).toBe("btn btn-primary status-backbtn-compact hidden");
  }); 


  it('should return status for message button in compact layout', function() {
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactMessageButton()).toBe("btn btn-primary messagebtn-compact");
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForCompactMessageButton()).toBe("btn btn-primary messagebtn-compact hidden");
  }); 


  it('should return status for status heading in compact layout', function() {
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForCompactStatusViewLabel()).toBe("systemview-heading-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForCompactStatusViewLabel()).toBe("systemview-heading-compact hidden");
  }); 


  it('should return status for statusgroup view in compact layout', function() {
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForSystemgroupCompactView()).toBe("systemgroup-view-compact");
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForSystemgroupCompactView()).toBe("systemgroup-view-compact hidden");
  }); 


  it('should return status for system compact view heading in compact layout', function() {
    scope.currentCompactpage = scope.page.system;
    expect(scope.getClassForSystemCompactView()).toBe("status-view-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForSystemCompactView()).toBe("status-view-compact hidden");
  }); 


  it('should return status of active system element in compact layout', function() {
    var element = {name: "P03" };
    scope.systemlinesActive = [ {system: "P04"} ];
    expect(scope.getClassForActiveSystemIndicator(element)).toBe("system-active-indicator hidden");
    scope.systemlinesActive = [ {system: "P03"} ];
    expect(scope.getClassForActiveSystemIndicator(element)).toBe("system-active-indicator pull-right show");
  }); 


  it('should return status of active status element in compact layout', function() {
    var element = {isActive: "true" };
    expect(scope.getClassForActiveStatusIndicator(element)).toBe("");
  }); 


  it('should return status of view element in compact layout', function() {
    var element = {type: "error" };
    expect(scope.getClassForStatusCompactViewElement(element)).toBe("error");
  }); 


  it('should return status of status view element in compact layout', function() {
    scope.currentCompactpage = scope.page.status;
    expect(scope.getClassForStatusCompactView()).toBe("status-view-compact");
    scope.currentCompactpage = scope.page.main;
    expect(scope.getClassForStatusCompactView()).toBe("status-view-compact hidden");
  }); 


  it('should reset all selection data on home button click', function() {
    scope.compactHomeButtonClick();
    expect(scope.currentCompactpage).toBe("pg1");
  }); 


  it('should reset all selection data on systemback button click', function() {
    scope.compactSystemBackButtonClick();
    expect(scope.currentCompactpage).toBe("pg1");
  }); 


  it('should reset all selection data on statusback button click', function() {
    scope.compactStatusBackButtonClick();
    expect(scope.currentCompactpage).toBe("pg2");
  });


  it('should fill and change page to message view on message button click', function() {
    scope.compactMessageViewClick();
    expect(scope.displayCompactMessageView).toBe(true);
    expect(scope.currentCompactpage).toBe("pg4");
  }); 


  it('should fill and change page to systemgroup on systemgroup element click', function() {
    $httpBackend.flush();

    scope.compactSystemGroupElementClick(1);
    expect(scope.systemgroupCompactViewList.length).toBe(1);
    expect(scope.systemgroupCompactViewList[0].name).toBe("D05");
    expect(scope.systemgroupCompactViewList[0].text).toBe("Retail");
    expect(scope.systemgroupCompactViewList[0].systemgroup).toBe("Retail");

    scope.compactSystemGroupElementClick(0);
    expect(scope.systemgroupCompactViewList.length).toBe(1);
    expect(scope.systemgroupCompactViewList[0].name).toBe("");
    expect(scope.systemgroupCompactViewList[0].text).toBe("");
    expect(scope.systemgroupCompactViewList[0].systemgroup).toBe("");

    expect(scope.currentCompactpage).toBe("pg2");
  }); 


  it('should fill and change page to status view on system element click', function() {
    $httpBackend.flush();

    scope.selectedMonthCompact = 9;
    scope.selectedYearCompact = 2012;

    scope.compactSystemElementClick(1);
    expect(scope.systemCompactViewList.length).toBe(1);
    expect(scope.systemCompactViewList[0].status).toBe("upgrade");
    expect(scope.systemCompactViewList[0].isActive).toBe("false");
    expect(scope.systemCompactViewList[0].startText).toBe("17 October");
    expect(scope.systemCompactViewList[0].endText).toBe("19 October");

    scope.compactSystemElementClick(0);
    expect(scope.systemCompactViewList.length).toBe(1);
    expect(scope.systemCompactViewList[0].status).toBe("");
    expect(scope.systemCompactViewList[0].error).toBe("No data");
    expect(scope.systemCompactViewList[0].type).toBe("error");

    expect(scope.currentCompactpage).toBe("pg3");
  });


  it('should change month for compact layout', function() {
    $httpBackend.flush();
    var monthList = [7, 8, 9, 10, 11];

    scope.selectedYearCompact = 2012;

    scope.selectedCompactSystem.sysNameIndex = 1;
    scope.selectedCompactSystem.hasValue = true;

    scope.gotoMonthCompact("N/A", 9)

    expect(scope.selectedMonthCompact).toBe(9);
    expect(scope.monthListCompact).toEqual(monthList);

    expect(scope.selectedCompactSystem.name).toBe("D05");
    expect(scope.selectedCompactSystem.text).toBe("Retail");
    expect(scope.selectedCompactSystem.sysIndex).toBe(1);

    expect(scope.systemCompactViewList.length).toBe(1);
    expect(scope.systemCompactViewList[0].status).toBe("upgrade");
    expect(scope.systemCompactViewList[0].isActive).toBe("false");
    expect(scope.systemCompactViewList[0].startText).toBe("17 October");
    expect(scope.systemCompactViewList[0].endText).toBe("19 October");
  }); 

});
