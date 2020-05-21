// line to enter into the js

// Test the imports:

// console.log(am4core)
// console.log(am4themes_animated)
// console.log(am4themes_dark)

// am4core.useTheme(am4themes_animated);
// am4core.useTheme(am4themes_dark);


looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
		.chart-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: pre;
}

.table-row {
    background: #f5f5f5;
}

.chart-container {
    white-space: normal !important;
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

    // Dump data and metadata to console:
    console.log('updateAsync() data', data)
    console.log('updateAsync() config', config)
    console.log('updateAsync() queryResponse', queryResponse)
	
	
	date = config.query_fields.dimensions[0].name;
    name = config.query_fields.dimensions[1].name;
	console.log(name);
	score = config.query_fields.dimensions[2].name;
	total = config.query_fields.dimensions[3].name;

	var amData = [];
	// var colorSet = new am4core.ColorSet();
    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[1].name]
		xyz = LookerCharts.Utils.htmlForCell(cell);
		console.log('---inside push method------');
		
        amData.push([
            row[date].value,
			xyz,
			 row[score].value,
			row[total].value
		]	
        );
		
    }
	
	console.log("-------------------------------");
	console.log('amChart data', amData)
	
	
	
	function chartChart(response) {
	
	  response.map((amData, i) => {
		var neCustomchart = document.createElement('div');
		neCustomchart.style.height = '80px';
		neCustomchart.style.width = '100px';
		neCustomchart.style.position = 'absolute';
		neCustomchart.style.bottom = '0px'

		// initialize echarts instance with prepared DOM
		var neChart = echarts.init(neCustomchart);
		neChart.setOption({
		  xAxis: {
			type: 'category',
			data: amData.SPARKLINE.date,
			show: false
		  },
		  yAxis: {
			type: 'value',
			show: false
		  },
		  series: [{
			data: amData.SPARKLINE.score,
			type: 'line',
			symbolSize: 0
		  }],
		  color: '#a5c78a',
		  height: 25,
		  width: '80%'
		});
		document.getElementById(`graph${i}`).appendChild(neCustomchart)
	  })
	}
	
	function createChartTable(response) {
 
	  if (response.length !== 0) {

		var headers = ''
		var clickableTD = ["IP ADDRESS"]
		var SparklineTd = ["SPARKLINE"]

		Object.keys(response[0]).map((k) => !SparklineTd.includes(k) && (headers += `<th style="text-align:center !important;font-size: small">${k}</th>`))

		headers += `<th style="text-align:center !important;width:100px;font-size: small"> SPARK  LINE </th>`

		var body = ''
		response.map((k, i) => {
		  body += `<tr id="row${i}" style="border:8px solid #f2f3f7">`

		  Object.keys(k).map((m) => {
			if (clickableTD.includes(m)) {
			  !SparklineTd.includes(m) && (body += `<td style="text-align:center !important;background-color: aliceblue;font-size: smaller">${k[m]}</td>`)
			}
			else {
			  !SparklineTd.includes(m) && (body += `<td style="text-align:center !important;background-color: aliceblue;font-size: smaller">${k[m]}</td>`)
			}
		  })

		  body += `<td style="padding: 4px; position: relative;background-color: aliceblue;" id="graph${i}"></td>`
		  body += '</tr>'
		})


		var view = `
			   <div>
					<table class="table tabeldash" id="usertable_id" style="margin-top:20px">
						<thead style="background-color: #dadee7;color: darkmagenta;font-size: small;">
							<tr class="tableHead">
							${headers}
							</tr>
						</thead>
						<tbody class="tableBody">
							${body}
						</tbody>
					</table>     
				</div>
	`

		chartContainer.innerHTML = view
		chartChart(response)
		
	  }
	}

	
	  console.log("DATA >>>>", JSON.stringify(amData))
	  if (amData.length > 0) {
		var reducedDataSource = amData
		var response = []

		console.log('reducedData >> ', reducedDataSource)
		console.log(typeof(reducedDataSource));
		
		console.log('testing inside a function');
		console.log(name);
		reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj[name.split('.')[1].toUpperCase()] = item[1];
			test_0bj['SPARKLINE'] = {
				"date": item[0].split(','),
				"score": item[2].split(',').map(s => parseInt(s))
			  // "date": "2020-02-29,2020-03-05,2020-03-22,2020-03-26,2020-03-27".split(','),
			  // "score": "82.5806,49.6353,78.3649,29.2346,47.3802".split(',').map(s => parseInt(s))
			};
			test_0bj["AVERAGE SCORE"] = Math.round(item[3]);
		  response.push(test_0bj)
		})
		console.log('response data is------------',response);
		createChartTable(response)
	  }


	doneRendering();
}
})
