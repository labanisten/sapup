	
	angular.module('validationModule', ['utilsModule']).
		run(function(Utils) {

			$.validator.addMethod(
				"endDateOffset",
					function(value, element) {
						var prevDate = Utils.viewDateToDBDate($("#elementStartDate").attr('value'));
						var date = Utils.viewDateToDBDate(value);

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

					},
					
					unhighlight: function(element, errorClass, validClass)
					{
						if($(element).parent('.control-group').hasClass('error')){
							$(element).parent('.control-group').removeClass('error');
							$(element).parent('.control-group').addClass('success');
						}else{
						
						}
					}
					
				});
				
				
				alertValidator = $("#alertForm").validate({
				
					rules: {
			 
						title: "required",
						alerttype: "required",
						alertDialogExpDate: "required"

					},

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
					},
					
					unhighlight: function(element, errorClass, validClass)
					{
						if($(element).parent('.control-group').hasClass('error')){
							$(element).parent('.control-group').removeClass('error');
							$(element).parent('.control-group').addClass('success');
						}else{
						
						}
					}
					
				});
			}
		}).run('Validation', function() {});