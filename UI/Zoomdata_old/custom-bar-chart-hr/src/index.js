import './index.css';

/**
 * Global controller object is described on Zoomdata knowledge base
 * @see https://www.zoomdata.com/developers/docs/custom-chart-api/controller/
 */

/* global controller */

var mockData = {

}

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/creating-chart-container/
 */
const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-container');
chartContainer.id = 'neBarGraph'
controller.element.appendChild(chartContainer);

var echarts = require('echarts');
var header = document.createElement('h4')
header.style.padding = '2px 5px 12px 10px';
header.style.margin = '0px'
header.innerText = ''

chartContainer.appendChild(header);


var mycustomchart = document.createElement('div');
mycustomchart.style.height = `${document.getElementById('neBarGraph').offsetHeight - 20}px`;
mycustomchart.style.width = `${document.getElementById('neBarGraph').offsetWidth - 20}px`;
mycustomchart.style.paddingBottom = '5px';
// mycustomchart.style.minHeight = '200px'
// mycustomchart.style.minWidth = '300px'
var myChart = null
// initialize echarts instance with prepared DOM


/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/updating-queries-axis-labels/
 */
controller.createAxisLabel({
    picks: 'Group By',
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Group'
});

controller.createAxisLabel({
    picks: 'Metric',
    orientation: 'horizontal',
    position: 'bottom'
});

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */

controller.update = data => {
    const groupAccessor = controller.dataAccessors['Group By'];
    const metricAccessor = controller.dataAccessors['Metric'];
    console.log("data:::", data 
    )
    var reqDataArr = [{name: 'critical', value: [0]}, {name: 'high', value: [0]}, 
                    {name: 'medium', value: [0]}, {name: 'low', value: [0]}, 
                    {name: 'informational', value: [0]}, {name: 'unknown', value: [0]}]
    var urgencyMap = ['critical',  'high', 'medium', 'low', 'informational', 'unknown' ]

    var colorMap = ['#d25b3b', '#ff8800', '#f0be1a', '#98bf3b', '#5378ad', '#999999' ]
    myChart = echarts.init(mycustomchart);
    var legendData = reqDataArr.map( item => {
        return {name: item.name, icon: 'rect'}
    })

    data.map( item => {

        if (urgencyMap.includes(groupAccessor.raw(item))) {
            var reqData = groupAccessor.raw(item)
            var pos = urgencyMap.indexOf(reqData)
            reqDataArr[pos] = {
                ...reqDataArr[pos],
                value: [metricAccessor.raw(item)]
            }
        }
    })

    var seriesData = reqDataArr.map( (item, i) => {
        return {
                name: item.name,
                type: 'bar',
                barWidth: '30',
                data: item.value,
                itemStyle: {
                    color: colorMap[i]
                }
            }
    })

    console.log('customData::', reqDataArr, legendData, seriesData)

myChart.setOption({
   
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: legendData, 
        orient: 'horizontal',
        //bottom: '0',
        // left: '0' 
    },
   
    xAxis: {
        type: 'value',
        boundaryGap: [0,0],
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        name: 'count',
        nameGap: 30,
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'category',
        // data: ['urgency'],
        name: 'urgency',
        nameGap: 30,
        axisLine: {
            show: false
        },
        nameLocation: 'middle'
    },
    series: seriesData,
    width: '70%'
});

chartContainer.appendChild(mycustomchart)

  
};

controller.resize = function(newWidth, newHeight) {
    // If needed, use the newWidth and newHeight values to re-size chart  
   // console.log('line stack resize:::::', newWidth, newHeight)
    myChart && myChart.resize({ width: document.getElementById('neBarGraph').offsetWidth - 20, height: document.getElementById('neBarGraph').offsetHeight - 20});
    
    mycustomchart.style.height = `${document.getElementById('neBarGraph').offsetHeight - 20}px`;
    mycustomchart.style.width = `${document.getElementById('neBarGraph').offsetWidth - 20}px`;
  }