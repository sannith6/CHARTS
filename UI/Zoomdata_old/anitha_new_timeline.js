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
	// hour = config.query_fields.dimensions[4].name;

	var timelinedata = [];

    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]

        timelinedata.push([
            row[date].value,
			row[hostname].value,
			row[hourday].value
			// row[hour].value
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
			// test_0bj['hour'] = item[3];
		    response.push(test_0bj)
		})
		
		
		}
		
		var view = `
					<div id="parent">
					  <div id="container"></div>
					</div>
	`

		chartContainer.innerHTML = view

		var finalData =
			response &&
				response.map((item, index) => {
					return {
						x: Date.parse(item.date+" "+item.hourday),
						name: item.hostname,
						label: "this is for user::::"+item.hostname,
						description: "data at:: "+item.hourday
					};
			});
			
		var myFunction =  function() {
			console.log("entered into a function");
			}			

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
				  "<span style='color:{point.color};'> </span><span style='font-weight: bold;display:inline-block;float:left;' > " + "{point.x:%d %b %Y}" + "<img src='https://www.google.com/images/srpr/logo11w.png'  width='40' height='10' style='float:right;display:inline-block;'></span><br/>"+"{point.label}<br/><p>{point.description}<span id='dots'>...</span><span id='more'>erisque</span></p><button onclick='myFunction()' id='myBtn'>Read more</button>",
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