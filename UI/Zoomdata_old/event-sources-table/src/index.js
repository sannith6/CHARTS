import './index.css';
import { find, findIndex, sortBy } from 'lodash';

/**
 * Global controller object is described on Zoomdata knowledge base
 * @see https://www.zoomdata.com/developers/docs/custom-chart-api/controller/
 */

/* global controller */

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/creating-chart-container/
 */
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

function  getRequestFields() {
    // sort fields based on the order specified in Columns variable
    const sortedFields = sortBy(controller.getAllFields(), sourceField =>
      findIndex(
        controller.variables.listAllData,
        column => column.name === sourceField.name,
      ),
    );
console.log('this is sparkline', sortedFields)
    return sortedFields
      .filter(sourceField => {
        let x= find(
          controller.variables.listAllData,
          column => column.name === sourceField.name,
        );
        console.log("x>>>>>>>>",x)
        return x
      })
      .map(sourceField => ({
        type: 'FIELD',
        field: { name: sourceField.name },
      }));

      
  }




let mockData = [
    {   src: '10.11.36.20', 
        data: {date: [1, 4, 6, 9, 12, 13, 14, 15 ,17, 19, 20, 22, 24, 26 ], 
                scrore: [20, 25, 40, 30, 65, 0, 25, 40, 85 , 65, 25, 40, 100, 65] }, 
        total_score: 650, 
        correlation_count: 6,
        sd_count: 4
    },
    {   src: '10.11.36.5', 
        data: {date: [1, 4, 6, 9, 12, 13, 14, 15 ,17, 19, 20, 22, 24, 26], 
                scrore: [20, 25, 40, 39,94, 39,20 ,20 ,29 ,0, 95, 94, 65, 10] },
        total_score: 590,
        correlation_count: 3,
        sd_count: 2
    }
]


var echarts = require('echarts');


var header = document.createElement('h4')
header.style.padding = '2px 5px 12px 10px';
header.style.margin = '0px'
header.innerText = 'Top Notable Events Sources'

chartContainer.appendChild(header)

var table = document.createElement('table')
table.setAttribute('id', 'table')
table.style.width = '100%'
table.innerHTML = '<tr style="background: #f1f1f1; border: 1.2px solid grey; border-left: 0; border-right: 0; "> \
                    <th style="width: 15%; font-size: 14px; padding-left: 10px; text-align: left; \
                        border-right: 1.2px solid grey; text-align: left;">src</th> \
                    <th style="font-size: 14px; width: 35%; padding-left: 10px; text-align: left; \
                        border-right: 1.2px solid grey; text-align: left;">sparkline</th> \
                    <th style="width: 20%; font-size: 14px; text-align: right; border-right: 1.2px solid grey; padding-right: 8px;">correlation_search_count</th> \
                    <th style="width: 20%; font-size: 14px; text-align: right; border-right: 1.2px solid grey; padding-right: 8px;">security_domain_count</th> \
                    <th style="width: 10%; font-size: 14px; text-align: right; padding-right: 8px;">count</th> \
                </tr>'

chartContainer.appendChild(table)


mockData.map( (data, i) => {
    // this.createTableRow = (id) => {
        var tr = document.createElement('tr')
        tr.style.paddingLeft = '5px'
        tr.setAttribute('id', `tr${i}`)
        tr.className = (i % 2 != 0) ? 'table-row' : ''
        tr.style.borderBottom = '1.2px solid #adadad'
        //return tr
    // }
    document.getElementById('table').appendChild(tr)
    document.getElementById(`tr${i}`).innerHTML = `<td style="color: #4d90fe;  padding-left: 10px;">${data.src}</td>
                            <td id="graph${i}" style="padding: 4px; "></td>
                            <td style="color: #4d90fe; text-align: right; padding-right: 8px;">${data.correlation_count}</td>
                            <td style="color: #4d90fe; text-align: right; padding-right: 8px;">${data.sd_count}</td>
                            <td style="color: #4d90fe; text-align: right; padding-right: 8px;">${data.total_score}</td>`

    var mycustomchart = document.createElement('div');
    mycustomchart.style.height = '100px';
    mycustomchart.style.width = '100px';
    // mycustomchart.style.position = 'relative';
    // mycustomchart.style.top = '-45px';
    mycustomchart.style.paddingBottom = '5px';
   // console.log('ele::', mycustomchart);
    // initialize echarts instance with prepared DOM
    var myChart = echarts.init(mycustomchart);
    myChart.setOption({
        xAxis: {
            type: 'category',
            data: data.data.date,
            show: false
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [{
            data: data.data.scrore,
            type: 'line',
            symbolSize: 0
        }],
        color: '#a5c78a',
        height: 25,
        width: '80%'
       
    });

    document.getElementById(`graph${i}`).appendChild(mycustomchart)

})






/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/updating-queries-axis-labels/
 */
// controller.createAxisLabel({
//     picks: 'Group By',
//     orientation: 'horizontal',
//     position: 'bottom',
//     popoverTitle: 'Group'
// });

// controller.createAxisLabel({
//     picks: 'Metric',
//     orientation: 'horizontal',
//     position: 'bottom'
// });

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */
controller.update = data => {
    // const groupAccessor = controller.dataAccessors['Group By'];
    // const metricAccessor = controller.dataAccessors['Metric'];

    // var d = data.map(item => {
    //     return [groupAccessor.raw(item), metricAccessor.raw(item)];
    // }).join('\r\n');

    console.log("event sources data::", data )
};
