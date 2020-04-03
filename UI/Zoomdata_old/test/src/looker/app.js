looker.plugins.visualizations.add({

// Call this with your data to render a PhoenixChart
	function chartIt(data){
	  // Set a chart type using the correct enum: https://domoapps.github.io/domo-phoenix/#/domo-phoenix/properties
	  var chartType = DomoPhoenix.CHART_TYPE.BAR;

	  // Set your "Chart Options": https://domoapps.github.io/domo-phoenix/#/domo-phoenix/api
	  var options = {
		width: 650,
		height: 400
	  };

	  // Create the Phoenix Chart
	  var chart = new DomoPhoenix.Chart(chartType, data, options);

	  // Append the canvas element to your app
	  document.getElementById('phoenix-chart').appendChild(chart.canvas);
	  
	  // Render the chart when you're ready for the user to see it
	  chart.render();
	}


	// Set this to use the columns in your dataset: 
	var columns = [
	  {
		  type: DomoPhoenix.DATA_TYPE.STRING,
		  name: 'NAME',
		  mapping: DomoPhoenix.MAPPING.SERIES
	  },
	  {
		  type: DomoPhoenix.DATA_TYPE.STRING,
		  name: 'EVENT_DATE',
		  mapping: DomoPhoenix.MAPPING.ITEM
	  },
	  {
		  type: DomoPhoenix.DATA_TYPE.DOUBLE,
		  name: 'RISK_SCORE',
		  mapping: DomoPhoenix.MAPPING.VALUE
	  }
	];



	// Start get data from Threat_Users_Behavior
	// /* Remove this line to chart data from your "Threat_Users_Behavior" dataset
	getData('Threat_Users_Behavior', columns).catch(displayError).then(function(data){
	  if(data){
		var phoenixData = { columns: columns, rows: data };
		console.log('-------final data-------')
		console.log(phoenixData)
		chartIt(phoenixData);
	  }
	});
	/* End get data from Threat_Users_Behavior */







	////// Query Data ////////////
	function getData(datasetAlias, columns){
	  // Create a query object
	  // For a full list of "query operators" see: https://developer.domo.com/docs/dev-studio-references/data-api
	  var query = {
		"fields": getColumnNames(columns)
	  };
	  console.log("---query fiels testing------",query)
	  // Handle date grains
	  processGrains(columns, query);

	  // Some DataSets are massive and will bring any web browser to its knees if you
	  // try to load the entire thing. To keep your app performing optimally, take
	  // advantage of filtering, aggregations, and group by's to bring down just the
	  // data your app needs. Do not include all columns in your data mapping file,
	  // just the ones you need. Setting the limit to 1000 will prevent enormous result
	  // sets while you are experimenting.
	  return domo.get(makeQueryString(datasetAlias, query) + '&limit=1000');
	}


	////// Helper functions ////////////
	function makeQueryString(datasetAlias, queryObject){
	  var query = '/data/v1/' + datasetAlias + '?';
	  for(var key in queryObject){
		if (queryObject.hasOwnProperty(key)) {
		  var value = queryObject[key];
		  if(typeof value === "object" && value.join != null){
			value = value.join(",");
		  }
		  query +=  key + "=" + value;
		}
	  }

	  return query;
	}

	function getColumnNames(cols){ 
	  var names = [];
	  for(var i in cols){
		if(cols[i] && cols[i].name) names.push(cols[i].name);
	  }
	  return names;
	}

	function processGrains(cols, query) {
	  var grainColumn = null;
	  for(var i in cols){
		if(cols[i] && cols[i].dateGrain != null){
		  grainColumn = cols[i];
		  break;
		}
	  }
	  if(grainColumn){
		query.dategrain = "'" + grainColumn.name + "' by " + grainColumn.dateGrain;
		var groupBys = [];
		for(var i in cols){
		  if(cols[i] && cols[i].type === DomoPhoenix.DATA_TYPE.STRING){
			groupBys.push(cols[i] && ("'" + cols[i].name + "'"));
		  }
		}
		if(query.groupby != null){
		  typeof query.groupby === "string" && (query.groupby = query.groupby.split(","));
		  for(var i in groupBys){
			const withoutParens = groupBys[i].replace(/'/g, "");
			if(query.groupby.indexOf(groupBys[i]) === -1 && query.groupby.indexOf(withoutParens) === -1){
			  query.groupby.push(groupBys[i]);
			}
		  }
		}
		else{
		  query.groupby = groupBys;
		}
	  }
	}

	function displayError(){
	  document.body.appendChild(document.createTextNode('Error getting data'));
	}
});