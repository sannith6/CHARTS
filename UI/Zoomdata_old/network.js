
console.log(am4core)
console.log(am4themes_animated)


am4core.useTheme(am4themes_animated);
// Themes end


looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
		.sannith {
		  width: 100%;
		  max-width: 100%;
		height:550px;
		}
	 </style>
    `;

    var container = element.appendChild(document.createElement("div"));
    container.id = 'amContainer';
	container.className = "sannith";
  },
 
  updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    // Clear any errors from previous updates:
    this.clearErrors();

    // Dump data and metadata to console:
    console.log('updateAsync() data', data)
    console.log('updateAsync() config', config)
    console.log('updateAsync() queryResponse', queryResponse)
	
	user_name = config.query_fields.dimensions[0].name;
    login_id = config.query_fields.dimensions[1].name;
	
	
    // build data array for the chart, by iterating over the Looker data object
    var amData = [];
	//var colorSet = new am4core.ColorSet();
    for(var row of data) {
		//var cell = row[queryResponse.fields.dimensions[3].name]
		//xyz = LookerCharts.Utils.htmlForCell(cell);
        amData.push({
            name: row[user_name].value,
            children: [{name: 'Berry'}, {name: 'Dried Fruit'}, {name: 'Other Fruit'}, {name: 'Citrus Fruit'}]
        });
		
	}
	//element.innerHTML = xyz;
	
	console.log('amChart data', amData)
	
	
	
let chart = am4core.create("amContainer", am4plugins_forceDirected.ForceDirectedTree);
chart.legend = new am4charts.Legend();

let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())



networkSeries.dataFields.linkWith = "linkWith";
networkSeries.dataFields.name = "name";
networkSeries.dataFields.id = "name";
networkSeries.dataFields.value = 1;
networkSeries.dataFields.children = "children";

networkSeries.nodes.template.tooltipText = "{name}";
networkSeries.nodes.template.fillOpacity = 1;

networkSeries.nodes.template.label.text = "{name}"
networkSeries.fontSize = 8;
networkSeries.maxLevels = 2;
networkSeries.maxRadius = am4core.percent(6);
networkSeries.manyBodyStrength = -16;
networkSeries.nodes.template.label.hideOversized = true;
networkSeries.nodes.template.label.truncate = true;
doneRendering();
}
})