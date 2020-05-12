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

/* menu */

.contextMenulist{
    position: relative;
    color: blue;
    cursor: pointer;
    }
    
    .menu{
      position: absolute;
      top: 100%;
      z-index: 10001;
      display: none;
      top: 33px;
      padding: 5px 0px;
      margin-left:20px;
      list-style: none;
      background-color: #ffff;
      border: 1px solid #cacdcf;
      -webkit-background-clip: padding-box;
      -moz-background-clip: padding;
      background-clip: padding-box;
    }
    
    .menu:after{
    content: '';
    border: 7px solid transparent;
    border-bottom: 8px solid #E5E5E5;
    position: absolute;
    top: -15px;
    left: 48%;
    }
    
    .menu > li > a {
    display: block;
    padding: 3px 10px;
    clear: both;
    font-weight: normal;
    line-height: 20px;
    color: #333;
    white-space: nowrap;
    text-decoration:none;
    text-align: left;
    }
    
    #selectLinked:hover,#selectLinked.highlight {
    text-decoration: none;
    background-color: #E5E5E5;
    }

        
      </style>
    `;
    // var container = element.appendChild(document.createElement("div"));
	// container.className = "sannith";
    // container.id = 'amContainer';
	
	
	var chartContainer = element.appendChild(document.createElement("div"));
	chartContainer.className = 'chart-container';
	chartContainer.id = 'chartContainer';

	

	//this.container = element.appendChild(document.createElement("div"));
	
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
	score = config.query_fields.dimensions[2].name;
	// dst_name = config.query_fields.dimensions[2].name;
	// userid = config.query_fields.dimensions[3].name;
	
	var amData = [];
	// var colorSet = new am4core.ColorSet();
    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[1].name]
		xyz = LookerCharts.Utils.htmlForCell(cell);
        amData.push({
            date: row[date].value,
			name: row[name].value,
			score: row[score].value
			
        });
		
    }
	
	console.log('amChart data', amData)
	
	// var amData = [];
	// // var colorSet = new am4core.ColorSet();
    // for(var row of data) {
		// var cell = row[queryResponse.fields.dimensions[1].name]
		// xyz = LookerCharts.Utils.htmlForCell(cell);
        // amData.push({
            // category: row[scores].value,
			// start: row[start_date].value,
			// end : row[end_date].value,
			// color: colorSet.next() ,
			// //task: row[userid].value,
			// task: xyz
        // });
		
    // }
	
	
	function chartChart(response) {
	  var echarts = require('echarts');
	  response.map((amData, i) => {
		var neCustomchart = document.createElement('div');
		neCustomchart.style.height = '80px';
		neCustomchart.style.width = '80px';
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
  // console.log(response, "chartResponse")
  // var echarts = require('echarts');
	  if (response.length !== 0) {

		var headers = ''
		var clickableTD = ["IP ADDRESS"]
		var SparklineTd = ["SPARKLINE"]

		Object.keys(response[0]).map((k) => !SparklineTd.includes(k) && (headers += `<th style="text-align:center !important">${k}</th>`))

		headers += `<th style="text-align:center !important">SPARKLINE</th>`

		var body = ''
		response.map((k, i) => {
		  body += `<tr id="row${i}" style="border:8px solid #f2f3f7">`

		  Object.keys(k).map((m) => {
			if (clickableTD.includes(m)) {
			  !SparklineTd.includes(m) && (body += `<td class="contextMenulist">${contextMenu(m, k[m])}${k[m]}</td>`)
			}
			else {
			  !SparklineTd.includes(m) && (body += `<td style="text-align:center !important">${k[m]}</td>`)
			}
		  })

		  body += `<td style="padding: 4px; position: relative;" id="graph${i}"></td>`
		  body += '</tr>'
		})


		var view = `
			   <div>
					<table class="table tabeldash" id="usertable_id" style="margin-top:20px">
						<thead style="background-color: #dadee7;color: black;">
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
		addOnClickHandler()
	  }
	}

	
	  console.log("DATA >>>>", JSON.stringify(amData))
	  if (amData.length > 0) {
		var reducedDataSource = amData
		var response = []

		console.log('reducedData >> ', reducedDataSource)
		console.log(typeof(reducedDataSource));
		reducedDataSource.map((item, index) => {
		  response.push({
			
			"IP ADDRESS": item[1][name]
			// "SPARKLINE": {
			  // "date": item[0].split(','),
			  // "score": item[2].split(',').map(s => parseInt(s))
			// },
			// "AVERAGE SCORE": Math.round(item[3]),
		  })
		})
		console.log('response data is------------',response);
		createChartTable(response)
	  }
	

	

    // // get the names of the first dimension and measure available in data
    // start_date = config.query_fields.dimensions[0].name;
    // end_date = config.query_fields.dimensions[1].name;
	// dst_name = config.query_fields.dimensions[2].name;
	// userid = config.query_fields.dimensions[3].name;
	
	
    // // build data array for the chart, by iterating over the Looker data object
    // var amData = [];
	// var colorSet = new am4core.ColorSet();
    // for(var row of data) {
		// var cell = row[queryResponse.fields.dimensions[3].name]
		// xyz = LookerCharts.Utils.htmlForCell(cell);
        // amData.push({
            // category: row[dst_name].value,
			// start: row[start_date].value,
			// end : row[end_date].value,
			// color: colorSet.next() ,
			// task: row[userid].value,
			// task: xyz
        // });
		
    // }
	
	// element.innerHTML = xyz;
	
	// console.log('amChart data', amData)




	// let chart = am4core.create("amContainer", am4plugins_timeline.SerpentineChart);
	// chart.curveContainer.padding(50, 20, 50, 20);
	// chart.levelCount = 4;
	// chart.yAxisRadius = am4core.percent(25);
	// chart.yAxisInnerRadius = am4core.percent(-25);
	// chart.maskBullets = false;

	// colorSet.saturation = 0.5;

	// chart.data = amData;

	// chart.dateFormatter.dateFormat = "yyyy-MM-dd HH";
	// chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH";
	// chart.fontSize = 11;

	// let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	// categoryAxis.dataFields.category = "category";
	// categoryAxis.renderer.grid.template.disabled = true;
	// categoryAxis.renderer.labels.template.paddingRight = 25;
	// categoryAxis.renderer.minGridDistance = 10;
	// categoryAxis.renderer.innerRadius = -60;
	// categoryAxis.renderer.radius = 60;
	// categoryAxis.labelsEnabled = false;

	// let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	// dateAxis.renderer.minGridDistance = 70;
	// dateAxis.baseInterval = { count: 1, timeUnit: "hour" };
	// dateAxis.renderer.tooltipLocation = 0;
	// dateAxis.startLocation = -0.5;
	// dateAxis.renderer.line.strokeDasharray = "1,4";
	// dateAxis.renderer.line.strokeOpacity = 0.6;
	// dateAxis.tooltip.background.fillOpacity = 0.2;
	// dateAxis.tooltip.background.cornerRadius = 5;
	// dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
	// dateAxis.tooltip.label.paddingTop = 7;

	// let labelTemplate = dateAxis.renderer.labels.template;
	// labelTemplate.verticalCenter = "middle";
	// labelTemplate.fillOpacity = 0.7;
	// labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
	// labelTemplate.background.fillOpacity = 1;
	// labelTemplate.padding(7, 7, 7, 7);

	// let series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
	// series.columns.template.height = am4core.percent(20);
	// series.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";
	// series.columns.template.tooltipHTML = '{task}: <b>{openDateX}:00</b> - <b>{dateX}:00</b>';
        // series.tooltip.label.interactionsEnabled = true;
        // series.tooltip.keepTargetHover = true;

	// series.dataFields.openDateX = "start";
	// series.dataFields.dateX = "end";
	// series.dataFields.categoryY = "category";
	// series.columns.template.propertyFields.fill = "color"; // get color from data
	// series.columns.template.propertyFields.stroke = "color";
	// series.columns.template.strokeOpacity = 0;

	// let bullet = series.bullets.push(new am4charts.CircleBullet());
	// bullet.circle.radius = 3;
	// bullet.circle.strokeOpacity = 0;
	// bullet.propertyFields.fill = "color";
	// bullet.locationX = 0;


	// let bullet2 = series.bullets.push(new am4charts.CircleBullet());
	// bullet2.circle.radius = 3;
	// bullet2.circle.strokeOpacity = 0;
	// bullet2.propertyFields.fill = "color";
	// bullet2.locationX = 1;


	// let imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
	// imageBullet1.disabled = true;
	// imageBullet1.propertyFields.disabled = "disabled1";
	// imageBullet1.locationX = 1;
	// imageBullet1.circle.radius = 20;
	// imageBullet1.propertyFields.stroke = "color";
	// imageBullet1.background.propertyFields.fill = "color";
	// imageBullet1.image = new am4core.Image();
	// imageBullet1.image.propertyFields.href = "image1";

	// let imageBullet2 = series.bullets.push(new am4plugins_bullets.PinBullet());
	// imageBullet2.disabled = true;
	// imageBullet2.propertyFields.disabled = "disabled2";
	// imageBullet2.locationX = 0;
	// imageBullet2.circle.radius = 20;
	// imageBullet2.propertyFields.stroke = "color";
	// imageBullet2.background.propertyFields.fill = "color";
	// imageBullet2.image = new am4core.Image();
	// imageBullet2.image.propertyFields.href = "image2";

   
	// let eventSeries = chart.series.push(new am4plugins_timeline.CurveLineSeries());
	// eventSeries.dataFields.dateX = "eventDate";
	// eventSeries.dataFields.categoryY = "category";
	// eventSeries.data = [
		// { category: "", eventDate: "openDateX", letter: "", description: "" },
		// { category: "", eventDate: "dateX", letter: "", description: "" }];
	// eventSeries.strokeOpacity = 0;

	// let flagBullet = eventSeries.bullets.push(new am4plugins_bullets.FlagBullet())
	// flagBullet.label.propertyFields.text = "letter";
	// flagBullet.locationX = 0;
	// flagBullet.tooltipText = "{description}";

	// chart.scrollbarX = new am4core.Scrollbar();
	// chart.scrollbarX.align = "center"
	// chart.scrollbarX.width = am4core.percent(85);

	// let cursor = new am4plugins_timeline.CurveCursor();
	// chart.cursor = cursor;
	// cursor.xAxis = dateAxis;
	// cursor.yAxis = categoryAxis;
	// cursor.lineY.disabled = true;
	// cursor.lineX.strokeDasharray = "1,4";
	// cursor.lineX.strokeOpacity = 1;

	// dateAxis.renderer.tooltipLocation2 = 0;
	// categoryAxis.cursorTooltipEnabled = false;

	doneRendering();
}
})
