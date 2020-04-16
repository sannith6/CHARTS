		looker.plugins.visualizations.add({
		  create: function(element, config) {
			  element.innerHTML = `
			  <style>
				body{
					font-family:Arial, sans-serif;
					font-size:14px;
				}
				table{
					border-spacing:0;
					padding:0;
				}
				th{
				  text-align:left;
				  font-weight:normal !important;
				  border-top:1px solid #ddd;
				  border-left:1px solid #ddd;
				  border-bottom:1px solid #ddd;
					height:25px;
					padding-left:5px;
					width: 50px;
				}
				td{
				  border:1px solid #ddd;
					width:30px !important;
					height:25px;
					padding-left:5px;
				}
				tr.row-odd,
				.row-odd{
					background: #eee;
				}

			</style>
			`;
			
		var container = element.appendChild(document.createElement("div"));
			container.className = "sannith";
			container.id = 'amContainer';
			

			//this.container = element.appendChild(document.createElement("div"));
			
		  },

		updateAsync: function(data, element, config, queryResponse, details, done) {
			// Clear any errors from previous updates:
			this.clearErrors();

			// Dump data and metadata to console:
			console.log('updateAsync() data', data)
			console.log('updateAsync() config', config)
			console.log('updateAsync() queryResponse', queryResponse)

            event_date = config.query_fields.dimensions[0].name;
			name = config.query_fields.dimensions[1].name;
			risk_score = config.query_fields.measures[0].name;
			
			
			var Data = [];
			for(var row of data) {
			Data.push({
						year: row[event_date].value,
						value: row[risk_score].value,
						state : row[name].value,
					});
					
				}
				
			console.log('looker data',Data)

		var line = d3.svg.line()
			.x(function(d){return xScale(d.year);})
			.y(function(d){return yScale(d.value);});

                    json = Data;
					Data.forEach(function(d) {
					  d.value = Math.round((+d.value + 0.00001) * 1000) / 1000;
					  d.year = +d.year;
					});

					// add years for select indicator
					var nestyr = d3.nest()
						.key(function(d) { return d.year; })
						.sortKeys(d3.ascending)
						.map(json);

					var yearstring = Object.keys(nestyr);
					
					console.log("date",yearstring)

					// //////////////////////////
					var width = 200, height = 25;
					var minInd = d3.min(json, function(d) { return d.value;} )
					var maxInd = d3.max(json, function(d) { return d.value;} )

					xScale = d3.scale.linear().range([0, width - 10]).domain(d3.extent(json, function(d) { return d.year; })),
					yScale = d3.scale.linear().range([height, 0]).domain([minInd,maxInd]),

					xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.format('0f')),
					yAxis = d3.svg.axis().scale(yScale).orient("left");

					var type = d3.nest()
						  .key(function(d) { return d.state; })
							.sortKeys(d3.ascending)
						  .entries(json);

								console.log("type:", type);

				var tableData = [],
					states = {};
					json.forEach(function (d) {
					var state = states[d.state];
					if (!state) {
						tableData.push(state = states[d.state] = {});
						}
					state[d.year] = d.value,
					states[d.state].State = d.state;
				});

				console.log("tableData", tableData)

				yearstring.unshift("State");
				yearstring.push("Sparkline");

				updateGraph(Data);

				// render the table(s)
				tabulate(tableData, yearstring);

		 // close json


		function updateGraph(Data) {

		// add years for select indicator
			var nestyr = d3.nest()
					.key(function(d) { return d.year; })
					.sortKeys(d3.ascending)
					.map(jsonData);

			var yearstring = Object.keys(nestyr);

			minyear = d3.min(yearstring);
			maxyear = d3.max(yearstring);

		};

		function tabulate(newData, columns) {

					var type = d3.nest()
				  .key(function(d) { return d.state; })
					.sortKeys(d3.ascending)
				  .entries(jsonData);

					var table = d3.select('#indcontent').append('table')
					var thead = table.append('thead')
					var	tbody = table.append('tbody');

					// append the header row
					thead.append('tr')
					  .selectAll('th')
					  .Data(columns).enter()
					  .append('th')
						.text(function (column) { return column; });

					// create a row for each object in the data
					var rows = tbody.selectAll('tr')
					  .Data(newData)
					  .enter()
					  .append('tr');

					  // add stripes to the table
					rows.attr("class", function(d, i){ if (i++ % 2 === 0){return 'row-even'}else {return 'row-odd'}});


					// create a cell in each row for each column
					var cells = rows.selectAll('td')
					  .Data(function (row) {
						return columns.map(function (column) {
						  return {column: column, value: row[column]};
						});
					  })
					  .enter()
					  .append('td')
							.attr("class", function (d,i) { return columns[i]; })
						.html(function (d) { return d.value; });

							rows.selectAll("td.Sparkline")
													.selectAll(".spark")
													.Data(function(d,i){ return [type[i]]; })
													.enter()
										.append("svg")
										.attr("class", "spark")
													.attr("height", 25)
													.attr("width", 200)
													.append("path")
													.attr("d", function(d,i){ d.line = this; return line(d.values); })
													.attr("stroke-width", 1)
													.attr("stroke", "#c00000")
													.attr("fill", "none");

		console.log("newData", newData);

				  return table;
		};
		done();
		}
		})