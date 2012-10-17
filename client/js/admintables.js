
angular.module('adminModule', ['utilsModule']).
	run(function(admin) {
	
		var dom = $('#systemNamesTable');
		$('#systemNamesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 20,
	
			"aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 1, 4 ] }
                    ]
		});
		
		
		$('#statusTypesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] }
                    ]
		});
		
		$('#alertTypesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] }
                    ]
		});
		
		
		$('#alertLogTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 4 ] }
                    ]
		});
	}).
	factory('admin', function(Utils) {


		var admin = admin || {};

		(function(ns) {



			var previousSystemNameRowData = {
				classObject: 0,
				referance: 0
			};
			
			
			var previousStatusTypeRowData = {
				classObject: 0,
				referance: 0
			};
			
			
			var previousAlertTypeRowData = {
				classObject: 0,
				referance: 0
			};
			
			
			var previousAlertLogRowData = {
				classObject: 0,
				referance: 0
			};
			
			
			var selectedRowSystemName = {
				index:"",
				tabPosition:"",
				name:"",
				id:"",
				hasValue:false
			};
			
			
			var selectedRowStatusType = {
				index:"",
				tabPosition:"",
				type:"",
				id:"",
				hasValue:false
			};
			
			
			var selectedRowAlertType = {
				index:"",
				tabPosition:"",
				name:"",
				id:"",
				hasValue:false
			};
			
			
			var selectedRowAlertLog = {
				index:"",
				tabPosition:"",
				title:"",
				id:"",
				hasValue:false
			};
			
			function addLineToTable(tableId, value, id)
			{
				var tableLength = $(tableId).dataTable().fnGetData().length;
				
				$(tableId).dataTable().fnAddData( [tableLength + 1, value, id]);// + '<button jq-test type="button" class="close" onClick="deleteTableRow('+tableLength+');">x</button>'] );
				$(tableId).dataTable().fnPageChange('last');
			}
		
			ns.setSystemNameSelected = function(index, tabPosition, id)
			{
				selectedRowSystemName.index = index;
				selectedRowSystemName.tabPosition = tabPosition;
				//selectedRowSystemName.name = name;
				selectedRowSystemName.id = id;
				selectedRowSystemName.hasValue = true;
			};
			
			
			ns.setStatusTypeSelected = function(index, tabPosition, id)
			{
				selectedRowStatusType.index = index;
				selectedRowStatusType.tabPosition = tabPosition;
				//selectedRowStatusType.type = type;
				selectedRowStatusType.id = id;
				selectedRowStatusType.hasValue = true;
			};
					
			
			ns.setAlertTypeSelected = function(index, tabPosition, id)
			{
				selectedRowAlertType.index = index;
				selectedRowAlertType.tabPosition = tabPosition;
				//selectedRowAlertType.name = name;
				selectedRowAlertType.id = id;
				selectedRowAlertType.hasValue = true;
			};
			
			
			ns.setAlertLogSelected = function(index, tabPosition, id)
			{
				selectedRowAlertLog.index = index;
				selectedRowAlertLog.tabPosition = tabPosition;
				//selectedRowAlertLog.title = title;
				selectedRowAlertLog.id = id;
				selectedRowAlertLog.hasValue = true;
			};
			
			
			ns.clearSystemNameSelected = function()
			{
				selectedRowSystemName.index = "";
				selectedRowSystemName.tabPosition = "";
				selectedRowSystemName.name = "";
				selectedRowSystemName.id = "";
				selectedRowSystemName.hasValue = false;
			};
			
			
			ns.clearStatusTypeSelected = function()
			{
				selectedRowStatusType.index = "";
				selectedRowStatusType.tabPosition = "";
				selectedRowStatusType.type = "";
				selectedRowStatusType.id = "";
				selectedRowStatusType.hasValue = false;
			};
			
			
			ns.clearAlertTypeSelected = function()
			{
				selectedRowAlertType.index = "";
				selectedRowAlertType.tabPosition = "";
				selectedRowAlertType.name = "";
				selectedRowAlertType.id = "";
				selectedRowAlertType.hasValue = false;
			};
			
			
			ns.clearAlertLogSelected = function()
			{
				selectedRowAlertLog.index = "";
				selectedRowAlertLog.tabPosition = "";
				selectedRowAlertLog.title = "";
				selectedRowAlertLog.id = "";
				selectedRowAlertLog.hasValue = false;
			};
			
			
			ns.getSystemNameSelected = function()
			{
				return selectedRowSystemName;
			};
			
			
			ns.getStatusTypeSelected = function()
			{
				return selectedRowStatusType;
			};
			
			
			ns.getAlertTypeSelected = function()
			{
				return selectedRowAlertType;
			};
			
			
			ns.getAlertLogSelected = function()
			{
				return selectedRowAlertLog;
			};
			
			
			ns.updateSystemNamesTable = function(data)
			{
				$('#systemNamesTable').dataTable().fnClearTable();
			
				$.each(data, function(index, value){
					if(value.type == undefined) {
						value.type = "";
					}
					
					if(value.text == undefined) {
						value.text = "";
					}
					
					$('#systemNamesTable').dataTable().fnAddData([index + 1, value.type, value.name, value.text, value._id]);// + '<button id="delbut" jq-test type="button" class="close" ng-click="rowButtonClicked('+ index +');">x</button>'] );

				});	
			
			
			ns.updateStatusTypesTable = function(data)
			{
				$('#statusTypesTable').dataTable().fnClearTable();
				
				$.each(data, function(index, value){
						$('#statusTypesTable').dataTable().fnAddData([index + 1, value.status, value._id]);
				});
			};
			
			
			ns.updateAlertTypesTable = function(data)
			{
			
				$('#alertTypesTable').dataTable().fnClearTable();
				
				$.each(data, function(index, value){
						$('#alertTypesTable').dataTable().fnAddData( [index + 1, value.type, value._id]);
				});
				
			};
			
			
			ns.updateAlertLogTable = function(data)
			{
			
				$('#alertLogTable').dataTable().fnClearTable();
				
				$.each(data, function(index, value){
										
						$('#alertLogTable').dataTable().fnAddData( [index + 1, value.title, value.expdate, value.alerttype, value._id]);
						
						today = new Date();
						if(value.expdate > Utils.getDateString(today)){
							$('#alertLogTable tbody tr:last td').addClass('alertrow_active');
						}else if(value.expdate == Utils.getDateString(today)){
							$('#alertLogTable tbody tr:last td').addClass('alertrow_lastday');
						}else{
							$('#alertLogTable tbody tr:last td').addClass('alertrow_expired');
						}
							
				});
			};
			
			
			ns.addLineToSystemNamesTable = function(systemname)
			{
				//addLineToTable('#systemNamesTable', systemname.name, systemname.id);
				var tableLength = $('#systemNamesTable').dataTable().fnGetData().length;
				$('#systemNamesTable').dataTable().fnAddData( [tableLength + 1, systemname.type, systemname.name, systemname.text, systemname.id]);// + '<button jq-test type="button" class="close" onClick="deleteTableRow('+tableLength+');">x</button>'] );
				$('#systemNamesTable').dataTable().fnPageChange('last');
			
			
			ns.addLineToStatusTypesTable = function(systemstatus)
			{
				addLineToTable('#statusTypesTable', systemstatus.status, systemstatus.id);
			};
			
			
			ns.addLineToAlertTypesTable = function(alerttype)
			{
				addLineToTable('#alertTypesTable', alerttype.type, alerttype.id);
			};
			
			
			
			
			ns.removeSelectedSystemNamesRow = function()
			{
				$('#systemNamesTable').dataTable().fnDeleteRow(selectedRowSystemName.tabPosition);
			};
			
			
			ns.removeSelectedStatusTypesRow = function()
			{
				$('#statusTypesTable').dataTable().fnDeleteRow(selectedRowStatusType.tabPosition);
			};
			
			
			ns.removeSelectedAlertTypesRow = function()
			{
				$('#alertTypesTable').dataTable().fnDeleteRow(selectedRowAlertType.tabPosition);
			};
			
			
			ns.removeSelectedAlertLogRow = function()
			{
				$('#alertLogTable').dataTable().fnDeleteRow(selectedRowAlertLog.tabPosition);
			};
			
		
			$('#systemNamesTable tbody tr').live('click', function (event) {
				
				
				unColorPreviousRow(previousSystemNameRowData);
				
				if(previousSystemNameRowData.referance != this){
					
					previousSystemNameRowData.referance = this;
					previousSystemNameRowData.classObject = getRowClassAttributes(this);
					
					colorRowAsSelected(this, previousSystemNameRowData.classObject);

					admin.setSystemNameSelected($('#systemNamesTable').dataTable().fnGetData(this, 0),
												$('#systemNamesTable').dataTable().fnGetPosition(this),
													  $('#systemNamesTable').dataTable().fnGetData(this, 4));
				} else {
					previousSystemNameRowData.referance = 0;
					previousSystemNameRowData.classObject = 0;
					admin.clearSystemNameSelected();
				}
				
			});
			
			
			$('#statusTypesTable tbody tr').live('click', function (event) {
				unColorPreviousRow(previousStatusTypeRowData);
				
				if(previousStatusTypeRowData.referance != this){
					
					previousStatusTypeRowData.referance = this;
					previousStatusTypeRowData.classObject = getRowClassAttributes(this);
					
					colorRowAsSelected(this, previousStatusTypeRowData.classObject);

					admin.setStatusTypeSelected($('#statusTypesTable').dataTable().fnGetData(this, 0),
												$('#statusTypesTable').dataTable().fnGetPosition(this),
												$('#statusTypesTable').dataTable().fnGetData(this, 2));
				} else {
					previousStatusTypeRowData.referance = 0;
					previousStatusTypeRowData.classObject = 0;
					admin.clearStatusTypeSelected();
				}
			});
			
			
			$('#alertTypesTable tbody tr').live('click', function (event) {

				unColorPreviousRow(previousAlertTypeRowData);
				
				if(previousAlertTypeRowData.referance != this){
					
					previousAlertTypeRowData.referance = this;
					previousAlertTypeRowData.classObject = getRowClassAttributes(this);
					
					colorRowAsSelected(this, previousAlertTypeRowData.classObject);

					admin.setAlertTypeSelected($('#alertTypesTable').dataTable().fnGetData(this, 0),
												$('#alertTypesTable').dataTable().fnGetPosition(this),
												$('#alertTypesTable').dataTable().fnGetData(this, 2));
				} else {
					previousAlertTypeRowData.referance = 0;
					previousAlertTypeRowData.classObject = 0;
					admin.clearAlertTypeSelected();
				}
			});
			
			
			$('#alertLogTable tbody tr').live('click', function (event) {

				unColorPreviousRow(previousAlertLogRowData);
						
				if(previousAlertLogRowData.referance != this){
				
					previousAlertLogRowData.referance = this;
					previousAlertLogRowData.classObject = getRowClassAttributes(this);
					
					colorRowAsSelected(this, previousAlertLogRowData.classObject);

					admin.setAlertLogSelected($('#alertLogTable').dataTable().fnGetData(this, 0),
												$('#alertLogTable').dataTable().fnGetPosition(this),
												$('#alertLogTable').dataTable().fnGetData(this, 4));
				
				} else {
					previousAlertLogRowData.referance = 0;
					previousAlertLogRowData.classObject = 0;
					admin.clearAlertLogSelected();
				}
				
			});
			
			
			function getRowClassAttributes(row)
			{
				var classAttribute;
				
				$("td:first", row).parent().children().each(function(){
					classAttribute = $(this).attr('class');
				});
				
				return classAttribute;
			}
			
			
			function colorRowAsSelected(row, rowClass)
			{
				$("td:first", row).parent().children().each(function(){$(this).removeClass(rowClass);});
				$("td:first", row).parent().children().each(function(){$(this).addClass('clickedrow');});
			}
			
			
			function unColorPreviousRow(rowData)
			{
				if (rowData.referance){
					$("td:first", rowData.referance).parent().children().each(function(){$(this).removeClass('clickedrow');});
					$("td:first", rowData.referance).parent().children().each(function(){$(this).addClass(rowData.classObject);});
				}
			}
		
		})(admin);

		return admin;

	});