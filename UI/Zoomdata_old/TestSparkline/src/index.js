import './index.css';
import { find, findIndex, sortBy } from 'lodash';
import * as d3 from 'd3';



const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-container');
controller.element.appendChild(chartContainer);


controller.query
  .set(['aggregate'], false)
  .unset(['aggregateFilters'])
  .set(['limit'], 100)
  .set(['offset'], 0)
  .unset(['dimensions'])
  .unset(['metrics'])
  .set(['fields'], getRequestFields());

function getRequestFields() {
  // sort fields based on the order specified in Columns variable
  const sortedFields = sortBy(controller.getAllFields(), sourceField =>
    findIndex(
      controller.variables.listall,
      column => column.name === sourceField.name,
    ),
  );

  return sortedFields
    .filter(sourceField => {
      return find(
        controller.variables.listall,
        column => column.name === sourceField.name,
      );
    })
    .map(sourceField => ({
      type: 'FIELD',
      field: { name: sourceField.name },
    }));
}

function showMenu(targetElement) {
  $('.menu').hide()
  $(targetElement).children('ul').show()
}

$(document).bind("mousedown", function (e) {
  // If the clicked element is not the menu
  if (!$(e.target).parents(".menu").length > 0) {
    // Hide it
    $(".menu").hide();
  }
});

// var get360Ip = function (param, value) {
//   var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5dbc04fe9c0c7745566b6e56?inheritSourceId=5dbbbc549c0c7745566b6c18&filters=[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Sourceip%22,%22path%22:%22sourceip%22,%22value%22:[%22${value}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1`

//   return link
// }

var get360User = function (param, value) {
  var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5da43d449c0c7745566b47d7?inheritSourceId=5dbbbc549c0c7745566b6c18&filters=[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Userid%22,%22path%22:%22userid%22,%22value%22:[%22${value}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1`

  return link
}

var contextMenu = function (m, k) {
  return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${get360User(m, k)}">360 User View</a></li></ul>`
}


function chartChart(response) {
  var echarts = require('echarts');
  response.map((data, i) => {
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
        data: data.SPARKLINE.date,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        data: data.SPARKLINE.score,
        type: 'line',
        symbolSize: 0
      }],
      color: '#a5c78a',
      height: 25,
      width: '80%'
    });
    document.getElementById(`graph2${i}`).appendChild(neCustomchart)
  })
}

function addOnClickHandler() {
  var z = document.getElementsByClassName('contextMenulist').length
  for (var i = 0; i < z; i++) {
    document.getElementsByClassName('contextMenulist')[i].onclick = function (e) {
      // console.log("opened context menu")
      showMenu(e.target)
    }
  }
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

      body += `<td style="padding: 4px; position: relative;" id="graph2${i}"></td>`
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


controller.update = data => {
  console.log("DATA >>>>", JSON.stringify(data))
  if (data.length > 0) {
    var reducedDataSource = data
    var response = []

    console.log('reducedData >> ', reducedDataSource)
    reducedDataSource.map((item, index) => {
      response.push({
        "IP ADDRESS": item[1],
        "SPARKLINE": {
          "date": item[0].split(','),
          "score": item[2].split(',').map(s => parseInt(s))
        },
        "AVERAGE SCORE": Math.round(item[3]),
      })
    })

    createChartTable(response)
  }
};