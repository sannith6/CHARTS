import './index.css';
import { find, findIndex, sortBy } from 'lodash';


// import '../libs/echartscd ba.min.js';
import * as d3 from 'd3';

// import _ from 'lodash';

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



// let mockData = [
//     {report_name: 'Watchlisted Event Observed', data: {date: [1, 4, 6, 9, 12, 13, 14, 15 ,17, 19, 20, 22, 24, 26 ], score: [20, 25, 40, 30, 65, 0, 25, 40, 85 , 65, 25, 40, 100, 65] }, total_score: 650 },
//     {report_name: 'Threat activity detected', data: {date: [1, 4, 6, 9, 12, 13, 14, 15 ,17, 19, 20, 22, 24, 26], score: [20, 25, 40, 39,94, 39,20 ,20 ,29 ,0, 95, 94, 65, 10] }, total_score: 590 }
// ]

function createChartTable(receivedData, chartContainer) {

    var echarts = require('echarts');

    var header = document.createElement('h4')
    header.style.padding = '2px 5px 12px 10px';
    header.style.margin = '0px'
    header.innerText = 'Top Notable Events'
    
    chartContainer.appendChild(header)
    
    var neTable = document.createElement('table')
    neTable.setAttribute('id', 'table')
    neTable.style.width = '100%'
    neTable.innerHTML = '<tr style="background: #f1f1f1; border: 1.2px solid grey; border-left: 0; border-right: 0; "><th style="width: 55%; font-size: 14px; padding-left: 10px; text-align: left; border-right: 1.2px solid grey; text-align: left;">rule_name</th><th style="font-size: 14px; width: 35%; padding-left: 10px; text-align: left; border-right: 1.2px solid grey; text-align: left;">sparkline</th><th style="width: 10%; font-size: 14px; text-align: right; padding-right: 8px;">count</th></tr>'
    
    chartContainer.appendChild(neTable)
    
    receivedData.map( (data, i) => {
        // this.createTableRow = (id) => {
            var tr = document.createElement('tr')
            tr.style.paddingLeft = '5px'
            tr.setAttribute('id', `tr${i}`)
            tr.className = (i % 2 != 0) ? 'table-row' : ''
            tr.style.borderBottom = '1.2px solid #adadad'
            //return tr
        // }
        document.getElementById('table').appendChild(tr)
        document.getElementById(`tr${i}`).innerHTML = `<td style="color: #4d90fe; padding: 8px; padding-left: 10px;">${data.report_name}</td><td id="graph${i}" style="padding: 4px; position: relative; "></td><td style="color: #4d90fe; text-align: right; padding-right: 8px;">${parseInt(data.total_score)}</td>`
    
        var neCustomchart = document.createElement('div');
        neCustomchart.style.height = '80px';
        neCustomchart.style.width = '130px';
        neCustomchart.style.position = 'absolute';
        neCustomchart.style.bottom = '0px'
        
        //neCustomchart.style.paddingBottom = '5px';
       // console.log('ele::', mycustomchart);
        // initialize echarts instance with prepared DOM
        var neChart = echarts.init(neCustomchart);
        neChart.setOption({
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
                data: data.data.score,
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

controller.update = data => {
    console.log('table data ::', data);
    let reqData = []
    reqData = data.map( item => {
                    return {
                        report_name: item[1],
                        data: {
                            date: item[0].split(','),
                            score: item[2].split(',').map( s => parseInt(s))
                        },
                        total_score: item[3]
                    }
                })    

    console.log('modified table data::::', reqData)
    createChartTable(reqData, chartContainer)

};
