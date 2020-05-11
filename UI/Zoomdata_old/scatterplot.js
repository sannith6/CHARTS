console.log(am4core)
console.log(am4themes_animated)


am4core.useTheme(am4themes_animated);



looker.plugins.visualizations.add({
create: function(element, config) {
  element.innerHTML = `
	<style>
	.sannith {
	width: 100%;
	height: 500px
	}
	</style>
	`;
	
    var container = element.appendChild(document.createElement("div"));
	container.className = "sannith";
    container.id = 'amContainer';
	

	//this.container = element.appendChild(document.createElement("div"));
	
  },

updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
// Clear any errors from previous updates:
this.clearErrors();

// Dump data and metadata to console:
console.log('updateAsync() data', data)
console.log('updateAsync() config', config)
console.log('updateAsync() queryResponse', queryResponse)


	

// get the names of the first dimension and measure available in data
id = config.query_fields.dimensions[0].name;
x = config.query_fields.measures[0].name;
y = config.query_fields.measures[1].name;
z = config.query_fields.measures[2].name;


// build data array for the chart, by iterating over the Looker data object
var amData = [];
var colorSet = new am4core.ColorSet();
for(var row of data) {
	amData.push({
		title: row[id].value,
		color: colorSet.next() ,
		x: row[x].value,
		y : row[y].value,
		value: row[z].value
		
	});
	
}
console.log('amChart data', amData)


let chart = am4core.create("amContainer", am4charts.XYChart);

let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
valueAxisX.renderer.ticks.template.disabled = true;
valueAxisX.renderer.axisFills.template.disabled = true;

let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.ticks.template.disabled = true;
valueAxisY.renderer.axisFills.template.disabled = true;

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "x";
series.dataFields.valueY = "y";
series.dataFields.value = "value";
series.strokeOpacity = 0;
series.sequencedInterpolation = true;
series.tooltip.pointerOrientation = "vertical";

let bullet = series.bullets.push(new am4core.Circle());
bullet.fill = am4core.color("#ff0000");
bullet.propertyFields.fill = "color";
bullet.strokeOpacity = 0;
bullet.strokeWidth = 2;
bullet.fillOpacity = 0.5;
bullet.stroke = am4core.color("#ffffff");
bullet.hiddenState.properties.opacity = 0;
bullet.tooltipText = "[bold]{title}:[/]\nScore: {value.value}\nNo of Sessions: {valueX.value}\nDeviating Distance:{valueY.value}";

let outline = chart.plotContainer.createChild(am4core.Circle);
outline.fillOpacity = 0;
outline.strokeOpacity = 0.8;
outline.stroke = am4core.color("#ff0000");
outline.strokeWidth = 2;
outline.hide(0);

let blurFilter = new am4core.BlurFilter();
outline.filters.push(blurFilter);

bullet.events.on("over", function(event) {
let target = event.target;
outline.radius = target.pixelRadius + 2;
outline.x = target.pixelX;
outline.y = target.pixelY;
outline.show();
})

bullet.events.on("out", function(event) {
outline.hide();
})

let hoverState = bullet.states.create("hover");
hoverState.properties.fillOpacity = 1;
hoverState.properties.strokeOpacity = 1;

series.heatRules.push({ target: bullet, min: 2, max: 60, property: "radius" });

bullet.adapter.add("tooltipY", function (tooltipY, target) {
return -target.radius;
})

chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomXY";
chart.cursor.snapToSeries = series;

//chart.scrollbarX = new am4core.Scrollbar();
//chart.scrollbarY = new am4core.Scrollbar();

chart.data = amData;

doneRendering();
}
})
