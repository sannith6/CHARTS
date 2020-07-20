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
height: 200px;
overflow-y: auto;
overflow-x: hidden;
white-space: pre;
display: block;
}
.chart-container
{
  white-space: normal !important;
}
section {
  position: relative;
  border: 1px solid #333;
  padding-top: 37px;
  background:#ffffff;
}
section.positioned {
  position: absolute;
  top:100px;
  left:100px;
  width:500px;
  box-shadow: 0 0 15px #333;
}
.container {
  overflow-y: auto;
  height: 200px;
}
table {

  width:100%;
}
td + td {
  border-left:1px solid #000;
}
td, th {
  border-bottom:1px solid #000;
  background: #ffffff;
  color: #000;
  padding: 10px 25px;
}
th {
  height: 0;
  line-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  color: transparent;
  border-left: #000;
  white-space: nowrap;
}
th div{
  position: absolute;
  background: #ffffff;
  color: #000;
  padding: 9px 25px;
  top: 0;
  margin-left: -25px;
  line-height: normal;
  border-left: 1px solid #000;
}
th:first-child div{
  border: #000;
}

body {
	font-family: "Open Sans","Noto Sans JP","Noto Sans CJK KR","Noto Sans Arabic UI","Noto Sans Devanagari UI","Noto Sans Hebrew","Noto Sans Thai UI",Helvetica,Arial,sans-serif,"Noto Sans";
  margin:0;
  padding:0;
  height:100%;


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
					<table class="table tablebash" id="usertable_id" style="width:100%;height:100%;border-spacing: 5px;" >
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
