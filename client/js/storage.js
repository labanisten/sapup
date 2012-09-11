
		function load()
         {
			  var value = localStorage.getItem("myKey");
			  
			  if(!value)
			  {
				alert("No item found, adding to localStorage");
				localStorage.setItem("myKey", "myValue");
			  }
			  else
			  {
				alert("Item found: " + value);
			  }
         }