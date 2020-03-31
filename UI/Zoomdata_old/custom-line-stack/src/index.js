import './index.css';
import {find, findIndex, sortBy} from 'lodash';
import Moment from 'moment'
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
chartContainer.id = 'netLineGraph'
controller.element.appendChild(chartContainer);
var netChart = null

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
        controller.variables.netListall,
        column => column.name === sourceField.name,
      ),
    );
console.log('line graph fields::::',sortedFields);
    return sortedFields
      .filter(sourceField => {
        return find(
          controller.variables.netListall,
          column => column.name === sourceField.name,
        );
      })
      .map(sourceField => ({
        type: 'FIELD',
        field: { name: sourceField.name },
      }));
  }


var echarts = require('echarts');
var header = document.createElement('h4')
header.style.padding = '2px 5px 12px 10px';
header.style.margin = '0px'
header.innerText = ''

chartContainer.appendChild(header);

function createNeLineStack(legendData, data, xAxisData) {
    
var netLineGraph = document.createElement('div');
netLineGraph.style.height = `${document.getElementById('netLineGraph').offsetHeight - 10}px`;
netLineGraph.style.width = `${document.getElementById('netLineGraph').offsetWidth -20 }px`;
netLineGraph.style.minHeight = '200px'
netLineGraph.style.minWidth = '300px'
netLineGraph.style.paddingBottom = '5px';

netChart = echarts.init(netLineGraph);

//var attrMap = ['access',  'audit', 'endpoint', 'identity', 'network', 'threat' ]
var colorMap = ['#5378ad', '#98bf3b', '#d25b3b', '#794b85', '#25ae93', '#ec9e14' ]



var seriesData = Object.keys(data).map( (item, i) => {
    return {
            name: item,
            type: 'line',
            barWidth: '30',
            data: data[item],
            symbolSize: 0,
            itemStyle: {
                color: colorMap[i]
            }
        }
})


netChart.setOption({
   
    tooltip: {
        trigger: 'axis'
    },  
    legend: {
        data: legendData, 
        orient: 'horizontal',
        //top: '30%',
       // right: '0',
        itemWidth: 20,
        itemHeight: 4 
    },
    xAxis: {
        type: 'category',
         boundaryGap: false,
         nameGap: 30,
         axisTick: {
             show: false
         },
         axisLabel: {
            formatter: function(value, index) {
               // console.log(value)
               // return value
                return `${Moment(parseInt(value)).format('h:mm a')} \n ${Moment(parseInt(value)).format('MMM DD YYYY')}`
            }
         }, 
         name: 'count',
         nameGap: 40,
         nameLocation: 'middle',
         data: xAxisData
     },
     yAxis: {
         type: 'value',
         name: 'urgency',
         nameGap: 40,
         axisLine: {
             show: false
         },
         nameLocation: 'middle'
     },
    series: seriesData,
    width: '75%',
    height:'35%'
});

chartContainer.appendChild(netLineGraph)

}




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
//     picks: 'Tread attr',
//     orientation: 'horizontal',
//     position: 'bottom'
// });

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */
controller.update = data => {
   
    console.log('data line stack', data)
    var legendData = []
    var attrMap = []
    var xAxisData = []
    var yAxisData = { }
    var legendData = []

    data.map( (item, i) => {
      
        //xAxisData.push(Moment(parseInt(item[0])).format('MMM Do YYYY'))
        xAxisData.push(item[0])
        var attrArr = item[1].split(',')

        attrArr.map( (a, j) => {
        var objPos = attrMap.indexOf(a)
        var countValueArr = item[2].split(',')
    
            if (objPos <= -1) {
              attrMap.push(a)
              yAxisData = {
                  ...yAxisData,
                  [a]: [parseInt(countValueArr[j])]
              }
            } else  {
               // console.log('lol:::', yAxisData)
                yAxisData[a].push(parseInt(countValueArr[j]))
            }
       })

        legendData = attrMap.map( item => {
            return {name: item, icon: 'rect'}
        })
    }) 

    console.log('modified line stack::::', attrMap, yAxisData)
    createNeLineStack(legendData, yAxisData, xAxisData )
};

controller.resize = function(newWidth, newHeight) {
    // If needed, use the newWidth and newHeight values to re-size chart  
   // console.log('line stack resize:::::', newWidth, newHeight)
    netChart && netChart.resize({ width: newWidth, height: newHeight});
   
  }

  