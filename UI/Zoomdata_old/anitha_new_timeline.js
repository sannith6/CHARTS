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
		
		var maxLength = 25;



		var finalData =
			response &&
				response.map((item, index) => {
					return {
						rf: "data"+index,
						abc: "dots"+index,
						btn: "btn"+index,
						x: Date.parse(item.date+" "+item.hourday),
						name: item.hostname,
						label: "user:"+item.hostname.substring(0, maxLength) + '...',
						description: "this data is at hour:::: "+item.hourday
					};
			});
			

		

		function myfunction(id, dots, btn){
			console.log('entered here');
			console.log(id);
			console.log(dots);
			console.log(btn);
			var dots = document.getElementById(dots);
			var moreText = document.getElementById(id);
			var btnText = document.getElementById(btn);

			if (dots.style.display === "none") {
				dots.style.display = "inline";
				btnText.innerHTML = "Read more";
				moreText.style.display = "none";
			} else {
				dots.style.display = "none";
				btnText.innerHTML = "Read less";
				moreText.style.display = "inline";
			}
		}

		Highcharts.chart('container', {

		  chart: {
			zoomType: 'x',
			type: 'timeline',
			inverted: true,
			height: '800px'
		  },

		  xAxis: {
			type: 'datetime',
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
			text: 'History and timeline of the ISS'
		  },

		  subtitle: {
			text: 'Source: <a href="https://www.issnationallab.org/">ISS National Lab</a>'
		  },

		  tooltip: {
			enabled: false,
			style: {
			  width: 300
			}
		  },

		  series: [{
			dataLabels: {
			  allowOverlap: false,
			  format: `<span style="color:{point.color}">● </span><span style="font-weight: bold;" >{point.x:%d %b %Y}</span><img style="margin-left: 20px; margin-bottom: -5px;"  src="https://www.google.com/images/srpr/logo11w.png" height=15px /><br/><div>{point.label}<br/><span id='{point.abc}'>...</span><br\><span style="display: none;" id="{point.rf}">erisque enim lvccc<br> cccccccccccccccccccccc<br></span><br><button onclick="myfunction('{point.rf}','{point.abc}','{point.btn}')" id='{point.btn}'>Read more...</button></div>`,
			  useHTML: true
			},
			marker: {
			  symbol: 'circle'
			},
			data: finalData
		  }]
		});


		

			



		}
})
