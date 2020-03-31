import './index.css';

import { find, findIndex, sortBy } from 'lodash';


const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-containerTable');
controller.element.appendChild(chartContainer);

controller.query
    .set(['aggregate'], false)
    .unset(['aggregateFilters'])
    .set(['limit'], 1000)
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
    console.log("SORTED FIELDS >>>>>> ", sortedFields, controller.getAllFields(), controller.variables.listall)

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


function getDevicesData(response, eventDate, name, riskLevel, score, type, chartContainer) {

    var echarts = require('echarts');


    var neTable = document.createElement('div')
    neTable.setAttribute('id', 'table')
    neTable.style.width = '100%'


    chartContainer.appendChild(neTable)

    var neCustomchart = document.createElement('div');
    neCustomchart.style.height = '450px';
    neCustomchart.style.width = '1000px';

    response.map((data, i) => {
        console.log(data.name, "mydata")
        console.log(data.riskLevel, "riskLevel")
        document.getElementById('table').innerHTML = `<div id="graph${i}"></div>`

        var neChart = echarts.init(neCustomchart);
        neChart.setOption({
            title: {
                text: 'Notable Events by Urgency'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['Name', 'Scores', 'Risklevel']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    // axisLabel: {
                    //     textStyle: {
                    //         color: '#bababa'
                    //     }
                    // },
                    // axisLine: {
                    //     lineStyle: {
                    //         color: "#bababa"
                    //     }
                    // },
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Name',
                    type: 'line',
                    stack: 'Total amount',
                    areaStyle: {},
                    data: score,
                    itemStyle: {
                        normal: {
                            color: '#2981d1'
                        }
                    },
                },
                {
                    name: 'Scores',
                    type: 'line',
                    stack: 'Total amount',
                    areaStyle: {},
                    data:riskLevel,
                    itemStyle: {
                        normal: {
                            color: '#2981d1'
                        }
                    },
                },
                {
                    name: 'Risklevel',
                    type: 'line',
                    stack: '',
                    areaStyle: {},
                    data:score
                },
            ]
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

        var eventDate = []
        var name = []
        var riskLevel = []
        var score = []
        var type = []
        console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
            eventDate.push(
                item[0],
            )
            name.push(
                item[1],
            )
            riskLevel.push(
                item[2],
            )
            score.push(
                item[3],
            )
            type.push(
                item[4],
            )
            fullResponse.push({
                "eventDate": item[0],
                "name": item[1],
                "riskLevel": item[2],
                "score": item[3],
                "type": item[4],
            })
        })
        getDevicesData(fullResponse, eventDate, name, riskLevel, score, type, chartContainer)
    }
};