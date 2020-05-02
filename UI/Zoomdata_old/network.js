
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
		
		amData1 = [];
		//var colorSet = new am4core.ColorSet();
		for(var row of data) {
			//var cell = row[queryResponse.fields.dimensions[3].name]
			//xyz = LookerCharts.Utils.htmlForCell(cell);
			amData1.push({
				names: row[user_name].value,
			  child: row[login_id].value
			});
			
		}
		
			console.log('amChart data', amData1)
			
			let groups = Object.create(null);

	amData1.forEach(item => {
		if (!groups[item.names]) {
			groups[item.names] = [];
		}

		groups[item.names].push({
			name: item.child
		});
	});

	let result =
		Object.entries(groups)
			.map(([name, children]) => ({name, children}));
			
	  console.log('test result',result)
	   


		
	let chart = am4core.create("amContainer", am4plugins_forceDirected.ForceDirectedTree);
	chart.legend = new am4charts.Legend();

	let amData = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
	
	amData.data = amData1;


	amData.dataFields.linkWith = "linkWith";
	amData.dataFields.name = "name";
	amData.dataFields.id = "name"
	amData.dataFields.value = "value";
	amData.dataFields.children = "children";

	amData.nodes.template.tooltipText = "{name}";
	amData.nodes.template.fillOpacity = 1;

	amData.nodes.template.label.text = "{name}"
	amData.fontSize = 8;
	amData.maxLevels = 2;
	amData.maxRadius = am4core.percent(6);
	amData.manyBodyStrength = -16;
	amData.nodes.template.label.hideOversized = true;
	amData.nodes.template.label.truncate = true;
	doneRendering();
	}
	})