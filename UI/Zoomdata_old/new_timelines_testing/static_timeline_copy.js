looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
			*,
			*::before,
			*::after {
			  margin: 0;
			  padding: 0;
			  box-sizing: border-box;
			}

			body {
			  font: normal 16px/1.5 "Helvetica Neue", sans-serif;
			  background: #456990;
			
			  overflow-x: hidden;
			  padding-bottom: 50px;
			}  



			.container {
			  width: 90%;
			  max-width: 1200px;
			  margin: 0 auto;
			  text-align: center;
			}


			.timeline ul {
			  background: #456990;
			  padding: 50px 0;
			}

			.timeline ul li {
			  list-style-type: none;
			  position: relative;
			  width: 6px;
			  margin: 0 auto;
			  padding-top: 50px;
			  background: #fff;
			}

			.timeline ul li::after {
			  content: '';
			  position: absolute;
			  left: 50%;
			  bottom: 0;
			  transform: translateX(-50%);
			  width: 30px;
			  height: 30px;
			  border-radius: 50%;
			  background: inherit;
			}

			.timeline ul li div {
			  position: relative;
			  bottom: 0;
			  width: 400px;
			  padding: 15px;
			  background: #c7c9d3;
			}

			.timeline ul li div::before {
			  content: '';
			  position: absolute;
			  bottom: 7px;
			  width: 0;
			  height: 0;
			  border-style: solid;
			}

			.timeline ul li:nth-child(odd) div {
			  left: 45px;
			}

			.timeline ul li:nth-child(odd) div::before {
			  left: -15px;
			  border-width: 8px 16px 8px 0;
			  border-color: transparent #c7c9d3 transparent transparent;
			}

			.timeline ul li:nth-child(even) div {
			  left: -439px;
			}

			.timeline ul li:nth-child(even) div::before {
			  right: -15px;
			  border-width: 8px 0 8px 16px;
			  border-color: transparent transparent transparent #c7c9d3;
			}

			time {
			  display: block;
			  font-size: 1.2rem;
			  font-weight: bold;
			  margin-bottom: 8px;
			}



			.timeline ul li::after {
			  transition: background .5s ease-in-out;
			}


			.timeline ul li.in-view::after {
			  background: #F45B69;
			}

			.timeline ul li div {
			  visibility: hidden;
			  opacity: 0;
			  transition: all .5s ease-in-out;
			}

			.timeline ul li:nth-child(odd) div {
			  transform: translate3d(200px, 0, 0);
			}

			.timeline ul li:nth-child(even) div {
			  transform: translate3d(-200px, 0, 0);
			}

			.timeline ul li.in-view div {
			  transform: none;
			  visibility: visible;
			  opacity: 1;
			}


			@media screen and (max-width: 900px) {
			  .timeline ul li div {
				width: 250px;
			  }
			  .timeline ul li:nth-child(even) div {
				left: -289px;
				/*250+45-6*/
			  }
			}

			@media screen and (max-width: 600px) {
			  .timeline ul li {
				margin-left: 20px;
			  }
			  .timeline ul li div {
				width: calc(100vw - 91px);
			  }
			  .timeline ul li:nth-child(even) div {
				left: 45px;
			  }
			  .timeline ul li:nth-child(even) div::before {
				left: -15px;
				border-width: 8px 16px 8px 0;
				border-color: transparent #F45B69 transparent transparent;
			  }
			}

		
			.timeline ul li.in-view1::after {
			  background: #0ebeff;
			}

			.timeline ul li.in-view1 div {
			  transform: none;
			  visibility: visible;
			  opacity: 1;
			}


			.timeline ul li.in-view2::after {
			  background: #ffdd40;
			}

			.timeline ul li.in-view2 div {
			  transform: none;
			  visibility: visible;
			  opacity: 1;
			}


			.timeline ul li.in-view3::after {
			  background: red;
			}

			.timeline ul li.in-view3 div {
			  transform: none;
			  visibility: visible;
			  opacity: 1;
			}


			.timeline ul li.in-view4::after {
			  background: #47cf73;
			}

			.timeline ul li.in-view4 div {
			  transform: none;
			  visibility: visible;
			  opacity: 1;
			}


			button{
			  user-select:none;
			  -webkit-user-select:none;
			  -moz-user-select:none;
			  -ms-user-select:none;
			  cursor:pointer;
			  border:none;
			  padding:3px;
			  font-size:15px;
			
			  font-family:cursive;
			  box-sizing:border-box;
			}

   </style>


	`;

	var chartContainer = element.appendChild(document.createElement("div"));
	chartContainer.className = 'chart-container';
	chartContainer.id = 'chartContainer';
	
  },
  
   updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    // Clear any errors from previous updates:
		this.clearErrors();

		

	
	// (function() {

		 
		var x;
		var y;
		var email = "data:image/png;base64,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"; 
		  
		var vpn = "data:image/png;base64,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";

		var windows = "data:image/png;base64,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";

		var alerts = "https://when2pray.net/wp-content/uploads/2018/03/newimage-600x300.jpg";
		  
		var dates1 = ['19 October 2016','20 October 2016','21 October 2016','22 October 2016','24 november 2020','25 december 2020','19 december 2020','20 december 2020'];
		  
		var types = ['email', 'vpn', 'alerts', 'windows']  ;

		var view = `
			<section class="intro">
			  <div class="container">
			   
			  </div>
			</section>

			<section class="timeline">
			  <ul id="test1">  
			  </ul>
			</section>
`

		chartContainer.innerHTML = view

		for(var i = 0; i< dates1.length; i++){
		   x= dates1[i];
		   for(var j = 0;j < types.length; j++){
			 y = types[j];
			 
			if(y == "email"){
			  
			  $("#test1").append("<li class='in-view1'><div class='in-view-div'><time>"+x+"<img src='"+email+"' height=20/ style='float:right;'>"+'</time>'+'this is for tetsing purpose.so we added data dynamically to some of these events'+"<br><span id='text1' style='display:none;'>CSS is designed primarily to enable the separation of document content from document presentation, including aspects such. </span>"+"<br/><button id='toggle1'>Read More</button>"+'</div></li>'); 
			  
			  // $('.in-view-div').css('background', 'darkmagenta');
			  // $('.timeline ul li:nth-child(odd) div::before').css({"left": "-15px","border-width": "8px 16px 8px 0","border-color": "transparent darkmagenta transparent transparent"})      

			}
			else if(y == "vpn"){
			  
			  $("#test1").append("<li class='in-view2'><div><time>"+x+"<img src='"+vpn+"' height=20/ style='float:right;'>"+'</time>'+'this is for tetsing purpose...so we added data dynamically to some of these events'+"<br><span id='text2' style='display:none;'>CSS is designed primarily to enable the separation of document content from document presentation, including aspects such. </span>"+"<br/><button id='toggle2'>Read More</button>"+'</div></li>'); 

			}
			else if(y == "alerts"){
			  
			  $("#test1").append("<li class='in-view3'><div><time>"+x+"<img src='"+alerts+"' height=20/ style='float:right;'>"+'</time>'+'this is for tetsing purpose...so we added data dynamically to some of these events'+"<br><span id='text3' style='display:none;'>CSS is designed primarily to enable the separation of document content from document presentation, including aspects such. </span>"+"<br/><button id='toggle3'>Read More</button>"+'</div></li>'); 

			}
			else if(y == "windows"){
			  
			  $("#test1").append("<li class='in-view4'><div><time>"+x+"<img src='"+windows+"' height=20/ style='float:right;'>"+'</time>'+'this is for tetsing purpose...so we added data dynamically to some of these events'+"<br><span id='text4' style='display:none;'>CSS is designed primarily to enable the separation of document content from document presentation, including aspects such. </span>"+"<br/><button id='toggle4'>Read More</button>"+'</div></li>'); 

			}
			else{
				console.log("nothing is tehre to display");
			}

		 }
		}
		  // define variables
		  var items = document.querySelectorAll(".timeline li");

		  // check if an element is in viewport
		  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		  function isElementInViewport(el) {
			var rect = el.getBoundingClientRect();
			return (
			  rect.top >= 0 &&
			  rect.left >= 0 &&
			  rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			  rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		  }

		  function callbackFunc() {
			for (var i = 0; i < items.length; i++) {
			  if (isElementInViewport(items[i])) {
				items[i].classList.add("in-view");
			  }
			}
		  }
		  
		  
		  $("#toggle1").click(function() {
			var elem = $("#toggle1").text();
			if (elem == "Read More") {
			  //Stuff to do when btn is in the read more state
			  $("#toggle1").text("Read Less");
			  $("#text1").slideDown();
			} else {
			  //Stuff to do when btn is in the read less state
			  $("#toggle1").text("Read More");
			  $("#text1").slideUp();
			}
		  });
		  
			$("#toggle2").click(function() {
			var elem = $("#toggle2").text();
			if (elem == "Read More") {
			  //Stuff to do when btn is in the read more state
			  $("#toggle2").text("Read Less");
			  $("#text2").slideDown();
			} else {
			  //Stuff to do when btn is in the read less state
			  $("#toggle2").text("Read More");
			  $("#text2").slideUp();
			}
		  });


		  $("#toggle3").click(function() {
			var elem = $("#toggle3").text();
			if (elem == "Read More") {
			  //Stuff to do when btn is in the read more state
			  $("#toggle3").text("Read Less");
			  $("#text3").slideDown();
			} else {
			  //Stuff to do when btn is in the read less state
			  $("#toggle3").text("Read More");
			  $("#text3").slideUp();
			}
		  });
		  
			$("#toggle4").click(function() {
			var elem = $("#toggle4").text();
			if (elem == "Read More") {
			  //Stuff to do when btn is in the read more state
			  $("#toggle4").text("Read Less");
			  $("#text4").slideDown();
			} else {
			  //Stuff to do when btn is in the read less state
			  $("#toggle4").text("Read More");
			  $("#text4").slideUp();
			}
		  });
		  
		  
		  // listen for events
		  window.addEventListener("load", callbackFunc);
		  window.addEventListener("resize", callbackFunc);
		  window.addEventListener("scroll", callbackFunc);

		// })();
				


		}
})
