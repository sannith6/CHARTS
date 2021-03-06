looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
			#container {
			  width: 70%;
			  display: inline-block;
			}

			@media (max-width: 576px) {
			  #container {
				width: 100%;
				display: block;
			  }
			}
			#more {display: none;}

   </style>


	`;

	var chartContainer = element.appendChild(document.createElement("div"));
	chartContainer.className = 'chart-container';
	chartContainer.id = 'chartContainer';
	
  },
  
   updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    // Clear any errors from previous updates:
    this.clearErrors();
	
    date = config.query_fields.dimensions[0].name;
	hostname = config.query_fields.dimensions[1].name;
	hourday = config.query_fields.dimensions[2].name;
	logintype = config.query_fields.dimensions[3].name;

	var timelinedata = [];

    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]

        timelinedata.push([
            row[date].value,
			row[hostname].value,
			row[hourday].value,
			row[logintype].value
		]	
        );
		
    }




	//converting input data
	// console.log("<<<< DATA Checking >>>>", JSON.stringify(timelinedata))
	
	if (timelinedata.length > 0) {
		var reducedDataSource = timelinedata
		var response = []
	    reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj['date'] = item[0];
			test_0bj['hostname'] = item[1];
			test_0bj['hourday'] = item[2];
			test_0bj['logintype'] = item[3];
		    response.push(test_0bj)
		})
		
		
		}
		
		var view = `
					<div id="parent">
					  <div id="container"></div>

					</div>
	`

		chartContainer.innerHTML = view
		
		var maxLength = 25;

		// function myfunction(id, dots, btn){

			// var dots = document.getElementById(dots);
			// var moreText = document.getElementById(id);
			// var btnText = document.getElementById(btn);

			// if (dots.style.display === "none") {
				// dots.style.display = "inline";
				// btnText.innerHTML = "Read more";
				// moreText.style.display = "none";
			// } else {
				// dots.style.display = "none";
				// btnText.innerHTML = "Read less";
				// moreText.style.display = "inline";
			// }
		// }

		var finalData =
			response &&
				response.map((item, index) => {
					labelname = "This is for user::::"+item.hostname
					return {
						x: Date.parse(item.date+" "+item.hourday),
						name: item.hostname,
						label: '<b>'+labelname.substring(0,maxLength)+'-'+'<br/>'+labelname.substring(maxLength,labelname.length)+'<b>',
						description: "data at:: "+item.hourday,
						logintype: item.logintype
					};
			});


		Highcharts.chart("container", {
		  
		  chart: {
			zoomType: "x",
			type: "timeline",
			inverted: true,
			height: "800px"
		  },

		  xAxis: {
			type: "datetime",
			visible: false
		  },

		  yAxis: {
			gridLineWidth: 7,
			title: null,
			labels: {
			  enabled: false
			}
		  },

		  legend: {
			enabled: false
		  },

		  title: {
			text: "History and timeline Chart"
		  },

		 

		  tooltip: {
			enabled: false,
			style: {
			  width: 300
			}
		  },

		  series: [
			{
			  dataLabels: {
				allowOverlap: false,
				format:
				  `<span style="color:{point.color}">● </span><span style="font-weight: bold;" >{point.x:%d %b %Y}</span><img style="margin-left: 20px; margin-bottom: -5px;"  src="https://www.google.com/images/srpr/logo11w.png" height=15px /><br/><div>{point.label}<br/><span id='{point.abc}'></span><span style="display: none;" id="{point.rf}">{point.description}</span><br><button onclick="myfunction('{point.rf}','{point.abc}','{point.btn}')" id='{point.btn}'>Read more...</button></div>`,
				  enabled: true,
                  useHTML: true
			  },
			  marker: {
				symbol: "circle"
			  },
			  data: 
				finalData
				
			}
		  ]
		})



		}
})
