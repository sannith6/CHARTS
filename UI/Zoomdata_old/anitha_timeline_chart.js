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
	hourday = config.query_fields.dimensions[3].name;
	hour = config.query_fields.dimensions[4].name;

	var timelinedata = [];

    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]

        timelinedata.push([
            row[date].value,
			row[hostname].value,
			row[hourday].value,
			row[hour].value
		]	
        );
		
    }

	//converting input data
	console.log("<<<< DATA Checking >>>>", JSON.stringify(timelinedata))
	
	if (timelinedata.length > 0) {
		var reducedDataSource = timelinedata
		var response = []
	    reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj['date'] = item[0];
			test_0bj['hostname'] = item[1];
			test_0bj['hourday'] = item[2];
			test_0bj['hour'] = item[3];
		    response.push(test_0bj)
		})
		console.log('-------------response data is------------',response);
		
		}
		
		var view = `
					<div id="parent">
					  <div id="container"></div>

					</div>
	`

		chartContainer.innerHTML = view
		console.log("-------------entered into this method-----------------------");
		
		response.map((amData, i) => { 
			Highcharts.chart("container", {
			  chart: {
				zoomType: "x",
				type: "timeline",
				inverted: true,
				height: "800px"
			  },

			  xAxis: {
				type: "datetime",
				visible: false
			  },

			  yAxis: {
				gridLineWidth: 1,
				title: null,
				labels: {
				  enabled: false
				}
			  },

			  legend: {
				enabled: false
			  },

			  title: {
				text: "History and timeline of the ISS"
			  },

			  subtitle: {
				text:
				  'Source: <a href="https://www.issnationallab.org/">ISS National Lab</a>'
			  },

			  tooltip: {
				style: {
				  width: 300
				}
			  },

			  series: [
				{
				  dataLabels: {
					allowOverlap: false,
					format:
					  '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
					  "{point.x:%d %b %Y}</span><br/>{point.label}"
				  },
				  marker: {
					symbol: "circle"
				  },
				  data: [
					{
					  x: Date.UTC(1998, 10, 20),
					  name: "First ISS Segment Launches",
					  label: "First ISS <br/>Segment Launches",
					  description:
						"The first segment of the ISS launches: a Russian proton rocket named Zarya ('sunrise')."
					},
					{
					  x: Date.UTC(1998, 11, 4),
					  name: "First U.S.-built component launches",
					  label: "First U.S.-built <br/>component launches",
					  description:
						"Unity, the first U.S.-built component of the International Space Station launches—the first Space Shuttle mission dedicated to assembly of the station."
					},
					{
					  x: Date.UTC(2000, 10, 2),
					  name: "First Crew to Reside on Station",
					  label: "First Crew <br/>to Reside on Station",
					  description:
						"Astronaut Bill Shepherd and cosmonauts Yuri Gidzenko and Sergei Krikalev become the first crew to reside onboard the station, staying several months."
					},
					{
					  x: Date.UTC(2001, 1, 7),
					  name: "U.S. Lab Module Added",
					  label: "U.S. Lab Module Added",
					  description:
						"Destiny, the U.S. Laboratory module, becomes part of the station. Destiny continues to be the primary research laboratory for U.S. payloads."
					},
					{
					  x: Date.UTC(2005, 0, 1),
					  name: "U.S. Lab Module Recognized as Newest U.S. National Laboratory",
					  label:
						"U.S. Lab Module <br/>Recognized as Newest U.S.<br/> National Laboratory",
					  description:
						"Congress designates the U.S. portion of the ISS as the nation's newest national laboratory to maximize its use for other U.S. government agencies and for academic and private institutions."
					},
					{
					  x: Date.UTC(2008, 1, 7),
					  name: "European Lab Joins the ISS",
					  label: "European Lab Joins the ISS",
					  description:
						"The European Space Agency’s Columbus Laboratory becomes part of the station."
					},
					{
					  x: Date.UTC(2008, 2, 11),
					  name: "Japanese Lab Joins the ISS",
					  label: "Japanese Lab Joins the ISS",
					  description:
						"The first Japanese Kibo laboratory module becomes part of the station."
					},
					{
					  x: Date.UTC(2010, 10, 2),
					  name: "ISS 10-Year Anniversary",
					  label: "ISS 10-Year Anniversary",
					  description:
						"The ISS celebrates its 10-year anniversary of continuous human occupation. Since Expedition 1 in the fall of 2000, 202 people had visited the station."
					},
					{
					  x: Date.UTC(2011, 1, 14),
					  name: "NASA Issues Cooperative Agreement",
					  label: "NASA Issues<br/> Cooperative Agreement",
					  description:
						"NASA issues a cooperative agreement notice for a management partner."
					},
					{
					  x: Date.UTC(2011, 13, 6),
					  name: "NASA Selects the ISS National Lab",
					  label: "NASA Selects<br/> the ISS National Lab",
					  description:
						"NASA selects the Center for the Advancement of Science in Space to manage the ISS National Lab."
					},
					{
					  x: Date.UTC(2013, 0, 1),
					  name: "First ISS Lab Research Flight",
					  label: "First ISS Lab Research Flight",
					  description:
						"Proteins can be grown as crystals in space with nearly perfect three-dimensional structures useful for the development of new drugs. The ISS National Lab's protein crystal growth (PCG) series of flights began in 2013, allowing researchers to utilize the unique environment of the ISS."
					}
				  ]
				}
			  ]
			})
			})
		})
