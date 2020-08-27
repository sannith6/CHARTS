looker.plugins.visualizations.add({
  create: function(element, config) {
	  element.innerHTML = `
      <style>
			#container {
			  width: 100%;
			  display: inline-block;
			}

			@media (max-width: 576px) {
			  #container {
				width: 100%;
				display: block;
			  }
			}
			#more {display: none;}

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
	hourday = config.query_fields.dimensions[2].name;
	logintype = config.query_fields.dimensions[3].name;

	var timelinedata = [];

    for(var row of data) {
		var cell = row[queryResponse.fields.dimensions[0].name]

        timelinedata.push([
            row[date].value,
			row[hostname].value,
			row[hourday].value,
			row[logintype].value
		]	
        );
		
    }




	//converting input data
	// console.log("<<<< DATA Checking >>>>", JSON.stringify(timelinedata))
	
	if (timelinedata.length > 0) {
		var reducedDataSource = timelinedata
		var response = []
	    reducedDataSource.map((item, index) => {
			test_0bj = {}
			test_0bj['date'] = item[0];
			test_0bj['hostname'] = item[1];
			test_0bj['hourday'] = item[2];
			test_0bj['logintype'] = item[3];
		    response.push(test_0bj)
		})
		
		
		}
		
		var view = `
					<div id="parent">
					  <div id="container"></div>

					</div>
	`

		chartContainer.innerHTML = view
		
		//defining our own variables
		
		var maxLength = 25;
		var type = ['email','vpn','iis','windows','multi','filemanager'];

		var email = "data:image/png;base64,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";
		var vpn = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAKy0lEQVR4XtVbDYwdVRX+zuy8tttqtaWlWNrumzsv2+IGWigiVNCCiCSEloISNRYBwQooCYr8VEEpYkGB0DSCaRQKNEqD0vJjRBFSFQUlVdK42m7e3Pt2t62Wn7b8LLvt284xZ72zmX19b9+83Xmv7Uk22d25c+853z333PM3hENESqkPALhflncc56p8Pv/2oWCFDsWiSqlPAvgpgKxdvwDgCq31843mp6EA5HK5qWEY3gng8gqC/sx13Zs6OjreaBQQDQEgl8uNDcPwGgC3AhDVH472Aritubn5/vb29v31BqKuALS1tY3p7e39IoDvApgVF4aZNRF9Rf7HzGuISJUI2wlgxaRJkx7dvHlzsV5A1AWAOXPmHFUsFr/MzNcCOLaE+T5mvnvfvn0rd+7c+Z48mz59+vixY8feTETXAxhXMn4HEa3KZDIPbt269c20gUgTAEcpdRYRXcLMny0jCAN4LAzD5YVCQYzeQZTNZrOO4/wAwOcAlPLWR0SPM/MjWusXAIRpgDEqAGTnxo0bdyaA8wEsAvChMkyJ4Bsdx7k9n8//IwnTuVzuxDAMxV4sLgOETPEfAE/JT19f36ZIk5LMXTqmFgCclpaWFtd15zHzR4hoATOfBmBMhYXfBbAuDMNVhUJh60iYa2lpOa6pqUmO0VIAEyrMsZ+IXmLmvxDRK/39/a92dnaK/UikIUMA8DzvM0R0LBGNZebJRDSZmWcAmAnAB9BcTRAiepmZH3Yc5+dpOTe5XG5iGIZfIKIvMfOp1XgA0AsgANBNRNuZeTcR7Wbmfcy8wxjzy2iOIQAopV4G8NEEC8SHiIWWHXgqk8ls6Ojo0DW+X9Pw1tZWVSwWlxCRHDnRwEwtE8gGBUEg7w1QKQAvAvhYlQnfIqJXmfklAH9ubm7e1N7eLurecGpra3tfb2/vJ4RnOY5EdGICP+NFrfUZlQD4PQBxU4Xa5WwB2AWgy97b24Ig6G64pDUs6Pv+TGaebf2KFmaeZjXlw3aa57XWZ1cC4AkAS+zDlVrr5TWsfdgOVUqtBHCTZfAJrfVFlQB4CMCl8lC8M2PMssNWqhoY831/DTNfaV95SGs9GIuU2oC7ANxgAXjSGHNBDesctkM9z9tIROJTCN2ltY60YagR9H3/WmZeZQdu1lqffNhKVQNjSqnNAE6SV4jo2iAIVlc6AhcC+JV9+JrWWgzIEU9KKTHkR1sALgyCYENZADzPmytXXPQwk8lM3LZt2ztHMgLWiXorkoGZ5xpjtpQFYNq0aRMmTJgweKcT0clBEIj6HLGklJJj/EokQF9f34R47HBQLKCUknte3F+5CZYaY9YdTtL7vp8D8HYQBK8l4cvzvKVE9Igd2621HpKXKAfAMwDOs+flniAIJEY/LMjzvBVEdIv4+mEYLigUCoPHtRKDSql7AHzDPn9Gay2R6yAdBIDv+3cwc+QAvaC1jjzDQwqC53m3E9F3Ykxcp7W+rxpTSinJHUjILjfAHUEQxOc4KOmAXC63OAzDjXbid7XWHwRwoNpC9XxeRviuYrF4Wnd3987h1l24cKHb1dUlOcaBUJqZFxtjJI9QWQNs5jZ+vk7RWg8akXoKWm7ucsK7rntmkqjT87xTiOiv0byu604tzTiXTYgopSSBMduqzY1BEPyw0YLLerEzHy3flVR4ecH3/RuYWbxboa1a6+NK5agEwI8BXG0HD4meGgXEaIUXPpVSUmg5y6r/amOMZJeGUFkAfN9fwswSGQrt6+npOWrXrl09R5Lw1qeRLPJYC8AiY8zTiQCYPXv2+4vFolRnBvJ9zHyxMebxRgCQxs7b43MxEa23PPf19PRMKbeJFZOinuf9hojOtQCsN8ZIqrqupJS6zVaPRnTm48z5vr9eNs7+72mttaTQDqLhALiSiNbYN3qam5uPSZr6UkqdJ7UBZv5JoVCQPGNVSlN4myr7byyTfLnWWnIdyQGYMWPG5DFjxkj+feAYENGlQRA8XE2SmTNnTs9kMlL4kGTle0R0fhAE4oxUpDSFl0V835fiTMTrPgDTtNaDAVGckWHrAkopCRsHkiLMvMkYM+BRDUfZbPYYx3EkLx/VC4YFIW3hhbe49QcwJAVWyvuwAHiet4iInoxeYuY5xpht1UCwt4gYoChlXRYEpdT3bOE0mrKme74cH9lsdo7jOP+O8VzW+kfPq1WGmpRSos4D0SGA+7TW11UDwO6CJFcEBNeOHwJCPYS36r+amb9m15TozxvOla8GgJynW5h5hZ3wnf7+/paurq49owGBmT+e9s4LP7NmzZrkuq6E8wO+PxHdGgTB7cPxWhWA1tbWKf39/V1RWUzC0SAIvp8EgAqa0B/TChkyarWPePE8b7lEfPbvXtd1Z1XrNqkKgBVCmpmukt+Z+c3x48dnk16J9n3Jwz9WIniqwlvPzwCYagF4QGsdufMV9ysRALZu3xEZNWb+tjFG6viJyRZefxEDIbWdtyDfDCDiqRiGYWulPoQ404kAsMYlXlzYs3///tz27dt3J0bg/9eTGEbpDtvhuu7iJCFtkvmtz5IHMMlqaeKiTi0ASM1NtGCghYWZy0ZXSRhOe4zv+3HLL50krUlrmIkBsGo2WDkC0O84ztx8Pv+vtAWqZb5cLtcWhqHkBqPrdkjlp9pctQIgLW6ialPsxH/SWkt5WtpgDgWRUuqPAE63i7/uOE6ulsaMmgCwWnAZgAcjaaXoaIyRc91w8jwvHrDJvX9ZEARra2GkZgDEv1BK/QFA1GQgDRPHJz1ztTA33FjbB/BPABNHo40jAQDW35aOr6in73daa8kdNOooyCb8FsCnrPDSezgvSZxSCuqIALBH4UYA0vc7QMx8vTFGihB1J8/zrieiH8XW/pYx5u6RLDxiAABIoCQGaIFduMjMpxtj/jYSRpK+Y1Pd0ssURZpiiBcmbYtLTQNkIs/zWmw1WYonQt2O48zP5/OvJxWolnG+7x/NzFKsjaLTvUR0wmjsz2g0YIB3691FPQUDiZPJkyefk3aD8/z58zN79+59jpnl2o3oIq11lL2uBcvBsaMGwIIgtkBsQkRrtdZyXaZGnuetlUbJ2IR3aq3F/x8VpQKA2APf93/NzJ+OcbNCay1t8qOm0lQ5Mz9rjJEKdqJ22OEYSAsAKapKO6sYp+NjCyaq4A7HoFJKMlD3xsZsyWQyp6fVuZIaAMKgdU6kuXLwGwEiWhYEQZRer0kbfN9fJqn12EvbpUl7NEavlIFUAZDJbYe3XI9RvCDO0TVa6wdqkV4p9VX7VVnE4xthGJ4x0s7zSmunDoAslMvlTgrDUAqT0fUot0NiZ0UpJR0d4thE/O1xHOfsfD7/91pATDK2LgDY4zCfmZ+LkhSWmXu11tJyU8llFhdXBI9aWuS1ugkvk9cNAJk8m83OcxznWanMxHZjQ09Pz9LSQqUtZz0aFWLs+F1hGJ6bpBcoyW6XG1NXAOxx8MMwlMBFPriIaMuBAwcu6OzslCSm2A2vqalJ2nJOiI0JXNc9J620WUNtQOli4sJK3xERDX6oIKoN4BI7VnZ+0F4AkM9fliRthRvp7tf9CMQZsx9PSuJEviOMKLIFcU1c5zjOFfl8Xoqadae6H4Ey2vB1ZpawufRTlyIRfTPeyFx36ettBCsJkM1mT3UcR2oEgx9Ph2H4+aS9BGkC03ANiJi3rnP0+fzVtSQy0wTgf79bkX0p2m0YAAAAAElFTkSuQmCC";
		var iis = "data:image/png;base64,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";
		var windows = "data:image/png;base64,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";
		var multi = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADlElEQVR4Xu1b3UtUQRT/zf3yKyzUIkpS6KEiogejf6IPiIxKTaLMDKmeKuixhyB7qsjyowjalTQjKKUCe+ipHlJREosCM6Iiywpyd917dybu6l538wN3u/fObXf2de6cOec3v/mds8Mcggz/kfniDx6sK5V1tgOEbSBgywEy77fexJAxBjIGRoYjKnmYc+v6+7n8nBVUoLputcJoAxgqvBlYil4RtOm6cSrvzs1P8RYSAAhX1JQxSeoiwMoUl/H0NAZ8IZRu19pae2OOWgCYOy9T+jJdg48FbIJgGEZZjAkWAOEDtf60o/28fCR+zddUZQ5HAYgKnkFHPM1fm52L0EhpTtuN0SgA4cqjx0HYZZvX8LY5Rk5o/qYrUwBU1TYCOOZtj+32jjRqvqb6KAB61ZG7DKTc7iW8bI+Adaq+lj3TANR2MmC3lx222zcC3FN9zeUCgKkjIBggjoDQACGCIguINGh3rvWyPVEHiEJIVIIulsIM0EMRKJoEInvjbtVVDQj+1BH6FQYhBNoSBTn5KojCFwhXAfg9FoIeiFhJwQtAcAXAupHlyAhuAKj1+6F3PAHGxrkyghsA2d3XwHQdtOcF9PbH3IDgCoB1R68boD3PYbQ/Ahv7kcCIvCINaq7iWDHpCQBi0dH+YYTPtwCBoBWwmS3yCrPSGwD66i0Mfzfo4JuEQNUsGblFGiRFSk8A6NA7GP4u0IHZgWcvU6Fky44FbmUgN/8LxNcB0uZ1XAPnDkD81ppUd2vH/6aUyyI4CT1gWD7wDJwLA8zgJ75PQlH57ThXBjiuaCks4OoRSME/x6cIANxMg45vZwoLCAYIBohLURcvRVM4o05PERogNEBogNAAWx5J6Xt3IbJpI7SO+5AGh5zWLtvs2yaCwasXo60Ect8AtNbbtjnotKFFAcAKC0BLihf0JVxTHR2XRkahPH1mu9/k2zikDx8tu2xpPuja0pkb5CTHF30fQNcUY/LMSf6NIowh68IlC4TQubNgRQUzQCc5LgCYRkAcgcRCKPXH0v+vCMY9lv6X5/LRNLi1DKqvA3L/oO0i6JzBuOfyGd8wkfEtMybNMrppygRgYt+hVYqi9GZA29xnwzC2zGqbi7IgExongW2ar7kvriBK1FmTCaqiNgCs0jkF5mGZ+HVDP71g62y8W8GKwyUyUXaCYD0BXcG/Jk4WNLN5WvoKhtcRZjwwewTnssD3sV6yMTnw/R/jCKpfQZeXyAAAAABJRU5ErkJggg==";
		var filemanager ="data:image/png;base64,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";

		// function myfunction(id, dots, btn){

			// var dots = document.getElementById(dots);
			// var moreText = document.getElementById(id);
			// var btnText = document.getElementById(btn);

			// if (dots.style.display === "none") {
				// dots.style.display = "inline";
				// btnText.innerHTML = "Read more";
				// moreText.style.display = "none";
			// } else {
				// dots.style.display = "none";
				// btnText.innerHTML = "Read less";
				// moreText.style.display = "inline";
			// }
		// }

		var finalData =
			response &&
				response.map((item, index) => {
					labelname = "This is for user::::"+item.hostname
					return {
						x: Date.parse(item.date+" "+item.hourday),
						name: item.hostname,
						label: '<b>'+labelname.substring(0,maxLength)+'-'+'<br/>'+labelname.substring(maxLength,labelname.length)+'<b>',
						description: "data at:: "+item.hourday,
						logintype: item.logintype
					};
			});


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
			gridLineWidth: 7,
			title: null,
			labels: {
			  enabled: false
			}
		  },

		  legend: {
			enabled: false
		  },

		  title: {
			text: "History and timeline Chart"
		  },

		 

		  tooltip: {
			enabled: false,
			style: {
			  width: 300
			}
		  },

		  series: [
			{
			  dataLabels: {
				allowOverlap: false,
				useHTML: true,
				formatter: function () {
				var image2;
				var colorset;
				console.log('========================');
				console.log(this.point.logintype);
				if(this.point.logintype == "FILE"){
					console.log('enterd into file session');
					var image2 = filemanager;
				}
				else if(this.point.logintype == "WINDOWS_SESSION"){
					console.log('enterd into windows session');
					var image2 = windows;
				}
				else if(this.point.logintype == "IIS"){
					console.log('enterd into iis session');
					var image2 = iis;
				}
				else if(this.point.logintype == "VPN"){
					console.log('enterd into vpn session');
					var image2 = vpn;
				}
				else if(this.point.logintype == "multi"){
					console.log('enterd into multimedia session');
					var image2 = multi;
				}
				else if(this.point.logintype == "EMAIL"){
					console.log('enterd into email session');
					var image2 = email;  
					var colorset = "#008000	";
				}
				else{
					console.log('no image for this file type');
				}
				
				return "<span style='color:"+colorset+"'>● </span><span style='font-weight: bold;' >"+Highcharts.dateFormat('%d %b %Y',new Date(this.point.x))+"</span>"+"<img  style='margin-left: 20px; margin-bottom: -5px;'    src='"+image2+"' height=20 />"+"<br/><div>"+this.point.label+"<br/><span id='"+this.point.abc+"'>...</span><br\><span style='display: none;' id='"+this.point.rf+"'>erisque enim lvccc<br> cccccccccccccccccccccc<br></span><br>"+`<button onclick="myfunction(`+"'"+this.point.rf+"','"+this.point.abc+"','"+this.point.btn+"'"+")"+'"'+"id='"+this.point.btn+"'>Read more..."+"</button></div>"
				}
				// format:
				  // `<span style="color:{point.color}">● </span><span style="font-weight: bold;" >{point.x:%d %b %Y}</span><img style="margin-left: 20px; margin-bottom: -5px;"  src="https://www.google.com/images/srpr/logo11w.png" height=15px /><br/><div>{point.label}<br/><span id='{point.abc}'></span><span style="display: none;" id="{point.rf}">{point.description}</span><br><button onclick="myfunction('{point.rf}','{point.abc}','{point.btn}')" id='{point.btn}'>Read more...</button></div>`,
				  // enabled: true,
                  // useHTML: true
			  },
			  marker: {
				symbol: "circle"
			  },
			  data: 
				finalData
				
			}
		  ]
		})



		}
})
