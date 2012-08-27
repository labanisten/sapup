
	function AdminTables(){
	
	
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
		
		
		this.setSystemNameSelected = function(index, tabPosition, id)
		{
			selectedRowSystemName.index = index;
			selectedRowSystemName.tabPosition = tabPosition;
			//selectedRowSystemName.name = name;
			selectedRowSystemName.id = id;
			selectedRowSystemName.hasValue = true;
		}
		
		
		this.setStatusTypeSelected = function(index, tabPosition, id)
		{
			selectedRowStatusType.index = index;
			selectedRowStatusType.tabPosition = tabPosition;
			//selectedRowStatusType.type = type;
			selectedRowStatusType.id = id;
			selectedRowStatusType.hasValue = true;
		}
				
		
		this.setAlertTypeSelected = function(index, tabPosition, id)
		{
			selectedRowAlertType.index = index;
			selectedRowAlertType.tabPosition = tabPosition;
			//selectedRowAlertType.name = name;
			selectedRowAlertType.id = id;
			selectedRowAlertType.hasValue = true;
		}
		
		
		this.setAlertLogSelected = function(index, tabPosition, id)
		{
			selectedRowAlertLog.index = index;
			selectedRowAlertLog.tabPosition = tabPosition;
			//selectedRowAlertLog.title = title;
			selectedRowAlertLog.id = id;
			selectedRowAlertLog.hasValue = true;
		}
		
		
		this.clearSystemNameSelected = function()
		{
			selectedRowSystemName.index = "";
			selectedRowSystemName.tabPosition = "";
			selectedRowSystemName.name = "";
			selectedRowSystemName.id = "";
			selectedRowSystemName.hasValue = false;
		}
		
		
		this.clearStatusTypeSelected = function()
		{
			selectedRowStatusType.index = "";
			selectedRowStatusType.tabPosition = "";
			selectedRowStatusType.type = "";
			selectedRowStatusType.id = "";
			selectedRowStatusType.hasValue = false;
		}
		
		
		this.clearAlertTypeSelected = function()
		{
			selectedRowAlertType.index = "";
			selectedRowAlertType.tabPosition = "";
			selectedRowAlertType.name = "";
			selectedRowAlertType.id = "";
			selectedRowAlertType.hasValue = false;
		}
		
		
		this.clearAlertLogSelected = function()
		{
			selectedRowAlertLog.index = "";
			selectedRowAlertLog.tabPosition = "";
			selectedRowAlertLog.title = "";
			selectedRowAlertLog.id = "";
			selectedRowAlertLog.hasValue = false;
		}
		
		
		this.getSystemNameSelected = function()
		{
			return selectedRowSystemName;
		}
		
		
		this.getStatusTypeSelected = function()
		{
			return selectedRowStatusType;
		}
		
		
		this.getAlertTypeSelected = function()
		{
			return selectedRowAlertType;
		}
		
		
		this.getAlertLogSelected = function()
		{
			return selectedRowAlertLog;
		}
		
		
		this.updateSystemNamesTable = function(data)
		{
		
			$('#systemNamesTable').dataTable().fnClearTable();
			
			//angular.compile('<p>asd</p>');
			
			$.each(data, function(index, value){
				//var qwe = angular.element('<button id="delbut'+ index +'" jq-test type="button" class="close" onClick="deleteTableRow('+ index +');">x</button>');
				//angular.bootstrap(qwe, ['myModule']);
				//$scope.$apply(function(){
					$('#systemNamesTable').dataTable().fnAddData([index + 1, value.name, value._id.$oid]);// + '<button id="delbut" jq-test type="button" class="close" ng-click="rowButtonClicked('+ index +');">x</button>'] );
				//});
				//$("#systemNamesTable").append('<button id="delbut'+ index +'" jq-test type="button" class="close" onClick="deleteTableRow('+ index +');">x</button>');
				
				//var wqer = angular.element(document.id('systemNamesTable'));
				//var replacementHTML = '<div id="partialHtml">{{salute}} There!<br/><button ng-click=\'sayHello()\'>say hello</button></div>';
				//angular.scope.$bind("<p>asd</p>");
			});	
			

		}
		
		/*
		function updateTable(tableId, value)
		{
			$(tableId).dataTable().fnClearTable();
			
			$.each(data, function(index, value){
					$(tableId).dataTable().fnAddData( [index + 1, value]);// + '<button id="deletebutton" jq-test type="button" class="close" ng-click="rowButtonClicked('+index+');">x</button>'] );
			});	
		
		}
		*/
		
		this.updateStatusTypesTable = function(data)
		{
			$('#statusTypesTable').dataTable().fnClearTable();
			
			$.each(data, function(index, value){
					$('#statusTypesTable').dataTable().fnAddData([index + 1, value.status, value._id.$oid]);
			});	
		}
		
		
		this.updateAlertTypesTable = function(data)
		{
		
			$('#alertTypesTable').dataTable().fnClearTable();
			
			$.each(data, function(index, value){
					$('#alertTypesTable').dataTable().fnAddData( [index + 1, value.type, value._id.$oid]);
			});	
			
		}
		
		
		this.updateAlertLogTable = function(data)
		{
		
			$('#alertLogTable').dataTable().fnClearTable();
			
			$.each(data, function(index, value){
									
					$('#alertLogTable').dataTable().fnAddData( [index + 1, value.title, value.expdate, value.alerttype, value._id.$oid]);
					
					today = new Date();
					if(value.expdate > getDateString(today)){
						$('#alertLogTable tbody tr:last td').addClass('alertrow_active');
					}else if(value.expdate == getDateString(today)){
						$('#alertLogTable tbody tr:last td').addClass('alertrow_lastday');
					}else{
						$('#alertLogTable tbody tr:last td').addClass('alertrow_expired');
					}
						
			});
			
			
			/*$('#alertLogTable tbody tr').parent().children().each(function(){
				$('#alertLogTable tbody tr td').addClass('alertrow_active');
			});*/
			
		}
		
		
		this.addLineToSystemNamesTable = function(name, id)
		{
			addLineToTable('#systemNamesTable', name, id);
		}
		
		
		this.addLineToStatusTypesTable = function(status, id)
		{
			addLineToTable('#statusTypesTable', status, id);
		}
		
		
		this.addLineToAlertTypesTable = function(type, id)
		{
			addLineToTable('#alertTypesTable', type, id);
		}
		
		/*
		this.addLineToAlertLogTable = function(title, expDate, id)
		{

			var tableLength = $('#alertLogTable').dataTable().fnGetData().length;
			
			$('#alertLogTable').dataTable().fnAddData( [tableLength + 1, title, expDate, id]);// + '<button jq-test type="button" class="close" onClick="deleteTableRow('+tableLength+');">x</button>'] );
			$('#alertLogTable').dataTable().fnPageChange('last');
		}
		*/
		
		function addLineToTable(tableId, value, id)
		{
			var tableLength = $(tableId).dataTable().fnGetData().length;
			
			$(tableId).dataTable().fnAddData( [tableLength + 1, value, id]);// + '<button jq-test type="button" class="close" onClick="deleteTableRow('+tableLength+');">x</button>'] );
			$(tableId).dataTable().fnPageChange('last');
		}
		
		
		this.removeSelectedSystemNamesRow = function()
		{
			$('#systemNamesTable').dataTable().fnDeleteRow(selectedRowSystemName.tabPosition);
		}
		
		
		this.removeSelectedStatusTypesRow = function()
		{
			$('#statusTypesTable').dataTable().fnDeleteRow(selectedRowStatusType.tabPosition);
		}
		
		
		this.removeSelectedAlertTypesRow = function()
		{
			$('#alertTypesTable').dataTable().fnDeleteRow(selectedRowAlertType.tabPosition);
		}
		
		
		this.removeSelectedAlertLogRow = function()
		{
			$('#alertLogTable').dataTable().fnDeleteRow(selectedRowAlertLog.tabPosition);
		}
		
	
		$('#systemNamesTable tbody tr').live('click', function (event) {        
/*
			if (previousSelectedSysNameTab)
				$("td:first", previousSelectedSysNameTab).parent().children().each(function(){$(this).removeClass('clickedrow');});
				
			previousSelectedSysNameTab = this;
			$("td:first", this).parent().children().each(function(){$(this).addClass('clickedrow');});

			var index = systemNamesTable.fnGetData(this, 0);
			var name = systemNamesTable.fnGetData(this, 1);
			var id = systemNamesTable.fnGetData(this, 2);
			var aPos = systemNamesTable.fnGetPosition(this);

			adminTables.setSystemNameSelected(index, aPos, name, id);			
			*/
			
			
			unColorPreviousRow(previousSystemNameRowData);
			
			if(previousSystemNameRowData.referance != this){
				
				previousSystemNameRowData.referance = this;
				previousSystemNameRowData.classObject = getRowClassAttributes(this);
				
				colorRowAsSelected(this, previousSystemNameRowData.classObject);

				adminTables.setSystemNameSelected(systemNamesTable.fnGetData(this, 0), 
												  systemNamesTable.fnGetPosition(this),
												  systemNamesTable.fnGetData(this, 2));
			}else{
				previousSystemNameRowData.referance = 0;
				previousSystemNameRowData.classObject = 0;
				adminTables.clearSystemNameSelected();
			};
			
		});
		
		
		$('#statusTypesTable tbody tr').live('click', function (event) {        
/*
			unColorPreviousRow(previousAlertTypeRowData);
			//if (previousSelectedStatTypTab)
			//	$("td:first", previousSelectedStatTypTab).parent().children().each(function(){$(this).removeClass('clickedrow');});
				
			previousSelectedStatTypTab = this;
			$("td:first", this).parent().children().each(function(){$(this).addClass('clickedrow');});

			var index = statusTypesTable.fnGetData(this, 0);
			var name = statusTypesTable.fnGetData(this, 1);
			var id = statusTypesTable.fnGetData(this, 2);
			var aPos = statusTypesTable.fnGetPosition(this);

			adminTables.setStatusTypeSelected(index, aPos, name, id);
*/
			unColorPreviousRow(previousStatusTypeRowData);
			
			if(previousStatusTypeRowData.referance != this){
				
				previousStatusTypeRowData.referance = this;
				previousStatusTypeRowData.classObject = getRowClassAttributes(this);
				
				colorRowAsSelected(this, previousStatusTypeRowData.classObject);

				adminTables.setStatusTypeSelected(statusTypesTable.fnGetData(this, 0), 
												  statusTypesTable.fnGetPosition(this),
												  statusTypesTable.fnGetData(this, 2));
			}else{
				previousStatusTypeRowData.referance = 0;
				previousStatusTypeRowData.classObject = 0;
				adminTables.clearStatusTypeSelected();
			};
		});
		
		
		$('#alertTypesTable tbody tr').live('click', function (event) {        

			unColorPreviousRow(previousAlertTypeRowData);
			
			if(previousAlertTypeRowData.referance != this){
				
				previousAlertTypeRowData.referance = this;
				previousAlertTypeRowData.classObject = getRowClassAttributes(this);
				
				colorRowAsSelected(this, previousAlertTypeRowData.classObject);

				adminTables.setAlertTypeSelected(alertTypesTable.fnGetData(this, 0), 
												 alertTypesTable.fnGetPosition(this),
												 alertTypesTable.fnGetData(this, 2));
			}else{
				previousAlertTypeRowData.referance = 0;
				previousAlertTypeRowData.classObject = 0;
				adminTables.clearAlertTypeSelected();
			};
		});
		
		
		$('#alertLogTable tbody tr').live('click', function (event) {        

			unColorPreviousRow(previousAlertLogRowData);
					
			if(previousAlertLogRowData.referance != this){
			
				previousAlertLogRowData.referance = this;		
				previousAlertLogRowData.classObject = getRowClassAttributes(this);
				
				colorRowAsSelected(this, previousAlertLogRowData.classObject);

				adminTables.setAlertLogSelected(alertLogTable.fnGetData(this, 0), 
												alertLogTable.fnGetPosition(this),
												alertLogTable.fnGetData(this, 4));
			
			}else{
				previousAlertLogRowData.referance = 0;
				previousAlertLogRowData.classObject = 0;
				adminTables.clearAlertLogSelected();
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
		
	
	}