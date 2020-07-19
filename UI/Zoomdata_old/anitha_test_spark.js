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
    width:100%;
	height:100%;
	overflow-x:hidden;
    white-space: pre;
	display: block;

}
.chart-container
{
  white-space: normal !important;
}
.fixed_header{
   table-layout:fixed;
   boarder-collapse:collapse;
   
   }
  .fixed_header tbody{
	  display:block;
	  overflow:auto;
	  height:100px;
  }
           
        
   

   .fixed_header thead tr {
   display: block;
   background: #f5f5f5;
   }

   .fixed_header thead {
   background: black;
   color:#fff;
   }

   .fixed_header th, .fixed_header td {
   width:100%;
   padding: 10px;
   text-align: left;
   width:357px;
  border: 1px solid #ddd;
   }
    table{
		boarder-collapse:collapse;
		width:100%;
	}
	
   
 
body {
	font-family: "Open Sans","Noto Sans JP","Noto Sans CJK KR","Noto Sans Arabic UI","Noto Sans Devanagari UI","Noto Sans Hebrew","Noto Sans Thai UI",Helvetica,Arial,sans-serif,"Noto Sans";
font-size: 12px;
line-height: 1.53846;
color: #3a4245;
background-color: #fff;

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


    Name = config.query_fields.dimensions[0].name;
    date = config.query_fields.measures[0].name;
	console.log(Name);
	score = config.query_fields.measures[1].name;
	total = config.query_fields.measures[2].name;

	var amData = [];
	// var colorSet = new am4core.ColorSet();
    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]
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
		  height: 35,
		  width: '100%'
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

		headers += `<th style="text-align:center !important;font-size: small;"> SparkLine </th>`

		var body = ''
		response.map((k, i) => {
		  body += `<tr id="row${i}" >`

		  Object.keys(k).map((m) => {
			if (clickableTD.includes(m)) {
			  !SparklineTd.includes(m) && (body += `<td style="text-align:center !important;color: rgba(0,0,0,0.54);">${k[m]}</td>`)
			}
			else {
			  !SparklineTd.includes(m) && (body += `<td style="text-align:center !important;color: rgba(0,0,0,0.54);">${k[m]}</td>`)
			}
		  })

		  body += `<td id="graph${i}"></td>`
		  body += '</tr>'
		})


		var view = `
			   <div >
					<table class="fixed_header" id="usertable_id" style="width:100%;height:100%;border-spacing: 5px;" >
						<thead style="color: rgba(0,0,0,0.54);font-size: small;font-weight: bold;" id="top">
							<tr class="tableHead" >
							${headers}
							</tr>
						</thead>
						<tbody class="tableBody" >
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
		console.log(Name);
		reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj[Name.split('.')[1].charAt(0).toUpperCase() + Name.split('.')[1].slice(1)] = item[1];
			test_0bj['SPARKLINE'] = {
				"date": item[0].toString().split(','),
				"score": item[2].toString().split(',').map(s => parseInt(s))
			  // "date": "2020-02-29,2020-03-05,2020-03-22,2020-03-26,2020-03-27".split(','),
			  // "score": "82.5806,49.6353,78.3649,29.2346,47.3802".split(',').map(s => parseInt(s))
			};
			test_0bj["MaxScore"] = Math.round(item[3]);
		  response.push(test_0bj)
		})
		console.log('response data is------------',response);
		createChartTable(response)
	  }


	doneRendering();
}
})
