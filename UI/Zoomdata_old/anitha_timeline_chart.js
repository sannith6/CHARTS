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
	hourday = config.query_fields.dimensions[3].name;
	hour = config.query_fields.dimensions[4].name;

	var timelinedata = [];

    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]

        timelinedata.push([
            row[date].value,
			row[hostname].value,
			row[hourday].value,
			row[hour].value
		]	
        );
		
    }

	//converting input data
	console.log("<<<< DATA Checking >>>>", JSON.stringify(timelinedata))
	
	if (timelinedata.length > 0) {
		var reducedDataSource = timelinedata
		var response = []
	    reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj['date'] = item[0];
			test_0bj['hostname'] = item[1];
			test_0bj['hourday'] = item[2];
			test_0bj['hour'] = item[3];
		    response.push(test_0bj)
		})
		console.log('-------------response data is------------',response);
		
		}
		
		var view = `
					<div id="parent">
					  <div id="container"></div>

					</div>
	`

		chartContainer.innerHTML = view
		console.log("-------------entered into this method-----------------------");

		response.map((timelinedata, i) => { 

			var date_var = response[i].date+" "+response[i].hourday;
			var parseddate =  Date.parse(date_var);
			console.log(parseddate);
			console.log('entered into main fucnton');
			charts(parseddate);
			
			// Highcharts.chart("container", {
              
			  // chart: {
				// zoomType: "x",
				// type: "timeline",
				// inverted: true,
				// height: "800px"
			  // },

			  // xAxis: {
				// type: "datetime",
				// visible: false
			  // },

			  // yAxis: {
				// gridLineWidth: 1,
				// title: null,
				// labels: {
				  // enabled: false
				// }
			  // },

			  // legend: {
				// enabled: false
			  // },

			  // title: {
				// text: "History and timeline Chart"
			  // },

			 

			  // tooltip: {
				// style: {
				  // width: 300
				// }
			  // },

			  // series: [
				// {
				  // dataLabels: {
					// allowOverlap: false,
					// format:
					  // '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
					  // "{point.x:%d %b %Y}</span><br/>{point.label}"
				  // },
				  // marker: {
					// symbol: "circle"
				  // },
				  // data: [
					// {
					  // x: parseddate,
					  // name: response[i].hostname,
					  // label: "this is for hour::::"+response[i].hour,
					  // description:
						// "hi showing "+response[i].hour+"th hour data"
					// }
					
				  // ]
				// }
			  // ]
			// })
			})
			function charts(parseddata){
				console.log("---------");
				console.log(parseddata);
			}
		}
})
