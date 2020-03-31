import './index.css';

import { find, findIndex, sortBy } from 'lodash';


const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-containerTable');
controller.element.appendChild(chartContainer);

controller.query
    .set(['aggregate'], false)
    .unset(['aggregateFilters'])
    .set(['limit'], 100)
    .set(['offset'], 0)
    .unset(['dimensions'])
    .unset(['metrics'])
    .set(['fields'], getRequestFields())

var fieldNames = []

function getRequestFields() {
    // sort fields based on the order specified in Columns variable
    const sortedFields = sortBy(controller.getAllFields(), sourceField =>
        findIndex(
            controller.variables,
            column => column.name === sourceField.name,
        ),
    );
    fieldNames = controller.variables
    // console.log("SORTED FIELDS >>>>>> ", sortedFields, controller.getAllFields(), controller.variables.listall)

    var s = sortedFields
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
    // console.log("S >>>>> ", s)
    return s
}


function getDevicesData(response, a, b, c, d, chartContainer) {

    var echarts = require('echarts');


    var neTable = document.createElement('div')
    neTable.setAttribute('id', 'table')
    neTable.style.width = '100%'


    chartContainer.appendChild(neTable)

    var neCustomchart = document.createElement('div');
    neCustomchart.style.height = '450px';
    neCustomchart.style.width = '1000px';

    response.map((data, i) => {
        document.getElementById('table').innerHTML = `<div id="graph${i}"></div>`

        var neChart = echarts.init(neCustomchart);
        neChart.setOption({

            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            },
            {
                data: [0, 93, 9, 94, 190, 130, 130],
                type: 'line',
                smooth: true
            }]

            //     xAxis: [
            //         {
            //             type: 'category',
            //             boundaryGap: false,
            //             data: c
            //         }
            //     ],
            //     yAxis: [
            //         {
            //             type: 'value'
            //         }
            //     ],
            //     series: [
            //         {
            //             name: 'Name',
            //             type: 'line',
            //             stack: '',
            //             areaStyle: {},
            //             data: a
            //         },
            //         {
            //             name: 'Scores',
            //             type: 'line',
            //             stack: '',
            //             areaStyle: {},
            //             data: c
            //         },
            //         {
            //             name: 'Count',
            //             type: 'line',
            //             stack: '',
            //             areaStyle: {},
            //             data: c
            //         },
            //     ]
        });

        document.getElementById(`graph${i}`).appendChild(neCustomchart)
    })
}


controller.update = data => {
    // console.log("DATA >>>>", data)
    // console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var fullResponse = []
        var response = []
        var response1 = []
        var response2 = []
        var response3 = []
        // console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
            response.push(
                item[0],
            )
            response1.push(
                item[1],
            )
            response2.push(
                item[2],
            )
            response3.push(
                item[3],
            )
            fullResponse.push({
                "A": item[0],
                "B": item[1],
                "C": item[2],
                "D": item[3],
            })
        })

        console.log(response.length)
        console.log(response1.length)

        console.log(response2.length)

        console.log(response3.length)

        getDevicesData(fullResponse, response, response1, response2, response3, chartContainer)
    }
};