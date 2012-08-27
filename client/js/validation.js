	$.validator.addMethod(
		"endDateOffset",
			function(value, element) {
				var prevDate = convertDateToDatabaseFormat($("#elementStartDate").attr('value'));
				var date = convertDateToDatabaseFormat(value);

				if(date < prevDate){
					return false;
				}else{
					return true;
				}	

			},
		"Enddate must be equal or higher then the startdate"
	);


	function formValidation()
	{
		$("#elementForm").validate({
		
			rules: {
	 
				system: "required",
				status: "required",
				elementStartDate: "required",
				elementEndDate: {required: true, endDateOffset: true}

			},
	/*
			messages:{
				system:{
					minlength:"Select a system",
					required:"asd"
				},
				
				status:{
					minlength:"Select elementstatus",
					required:"fjasd"
				}
	*/

				/*sidebarStartDate:{
					required:"Enter confirm password",
					equalTo:"Password and Confirm Password must match"
				}*/
	//		},

			errorClass: "help-inline",
			errorElement: "span",
			
			highlight:function(element, errorClass, validClass)
			{
				if($(element).parent('.control-group').hasClass('success')){
					$(element).parent('.control-group').removeClass('success');
					$(element).parent('.control-group').addClass('error');
				}else{
					$(element).parent('.control-group').addClass('error');
				}
				//$(element).parents("div.clearfix").addClass('error').removeClass('success');
			},
			
			unhighlight: function(element, errorClass, validClass)
			{
				if($(element).parent('.control-group').hasClass('error')){
					$(element).parent('.control-group').removeClass('error');
					$(element).parent('.control-group').addClass('success');
				}else{
				
				}
				//$(element).parent('.control-group').removeClass('error');
				//$(element).parent('.control-group').addClass('success');
			}
			
		});
		
		
		alertValidator = $("#alertForm").validate({
		
			rules: {
	 
				title: "required",
				alerttype: "required",
				alertDialogExpDate: "required",

			},
	/*
			messages:{
				system:{
					minlength:"Select a system",
					required:"asd"
				},
				
				status:{
					minlength:"Select elementstatus",
					required:"fjasd"
				}
	*/

				/*sidebarStartDate:{
					required:"Enter confirm password",
					equalTo:"Password and Confirm Password must match"
				}*/
	//		},

			errorClass: "help-inline",
			errorElement: "span",
			
			highlight:function(element, errorClass, validClass)
			{
				if($(element).parent('.control-group').hasClass('success')){
					$(element).parent('.control-group').removeClass('success');
					$(element).parent('.control-group').addClass('error');
				}else{
					$(element).parent('.control-group').addClass('error');
				}
				//$(element).parents("div.clearfix").addClass('error').removeClass('success');
			},
			
			unhighlight: function(element, errorClass, validClass)
			{
				if($(element).parent('.control-group').hasClass('error')){
					$(element).parent('.control-group').removeClass('error');
					$(element).parent('.control-group').addClass('success');
				}else{
				
				}
				//$(element).parent('.control-group').removeClass('error');
				//$(element).parent('.control-group').addClass('success');
			}
			
		});
	}