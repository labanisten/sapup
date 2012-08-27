	
	
	var adminTables = new AdminTables();
  
  
	$(document).ready(function() {
	
		//formValidation();
		
		/*
		$("#systemNamesTable").click(function() {
			console.log("dirclick!!");
		});
		*/
		
	
		systemNamesTable = $('#systemNamesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 20,
	
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] }
                    ]
		});
		
		
		statusTypesTable = $('#statusTypesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] }
                    ]
		});
		
		alertTypesTable = $('#alertTypesTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] }
                    ]
		});
		
		
		alertLogTable = $('#alertLogTable').dataTable({
			"bFilter": false,
			"bLengthChange": false,
			"iDisplayLength": 30,
				
			"aoColumnDefs": [ 
                        { "bSearchable": false, "bVisible": false, "aTargets": [ 4 ] }
                    ]
		});
		
		
	});
	