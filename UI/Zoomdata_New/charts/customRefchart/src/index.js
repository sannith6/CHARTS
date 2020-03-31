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

var getDashboard = function (param, value) {
    var dashboardLink = `http://10.10.110.242:8983/solr/banana/index.html#/dashboard/solr/search?server=%2Fsolr%2F`

    return dashboardLink
}



var contextMenu = function (m, k) {
    return `<ul class="menu"><li id="selectLinked" ><a tabindex="-1" href="${getDashboard(m, k)}"">360 Ip View</a></li></ul>`
}


function graphbuild(response ,chartContainer) {

    console.log("check the response", response)

    var echarts = require('echarts');

    var neCustomchart = document.createElement('div');
    neCustomchart.style.height = '80px';
    neCustomchart.style.width = '130px';
    neCustomchart.style.position = 'absolute';
    neCustomchart.style.bottom = '0px'

    response.map((data, i) => {
        // initialize echarts instance with prepared DOM
        var neChart = echarts.init(neCustomchart);
        neChart.setOption({
            xAxis: {
                type: 'category',
                data: data.Sparkline,
                show: false
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [{
                data: data.count,
                type: 'line',
                symbolSize: 0
            }],
            color: '#a5c78a',
            height: 25,
            width: '80%'

        });

        chartContainer.appendChild(neCustomchart)

    })
}


function getDevicesData(response, chartContainer) {
    if (response.length !== 0) {

        var headers = ''
        var clickableTD = ["Ip Address"]
        var SparklineTd = ["Sparkline", "Count"]

        Object.keys(response[0]).map((k) => !SparklineTd.includes(k) && (headers += `<th>${k}</th>`))

        headers += `<th>Sparkline</th>`

        var body = ''
        response.map((k, i) => {
            body += `<tr id="row${i}">`

            Object.keys(k).map((m) => {
                if (clickableTD.includes(m)) {
                    !SparklineTd.includes(m) && (body += `<td class="contextMenulist">${contextMenu(m, k[m])}${k[m]}</td>`)
                }
                else {
                    !SparklineTd.includes(m) && (body += `<td>${k[m]}</td>`)
                }
            })


            // body += `<td>
            //            ${k[SparklineTd[0]]}
            //            ${k[SparklineTd[1]]}
            //         </td>`


            body += '</tr>'
        })

        // graphbuild(Response, chartContainer)

        var view = `
               <div>
                    <table class="table tabeldash" id="usertable_id">
                        <thead style="background-color: #258cca;color: white;">
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
        addOnClickHandler()
    }
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

function addOnClickHandler() {
    var z = document.getElementsByClassName('contextMenulist').length
    for (var i = 0; i < z; i++) {
        document.getElementsByClassName('contextMenulist')[i].onclick = function (e) {
            // console.log("opened context menu")
            showMenu(e.target)
        }
    }
}


controller.update = data => {
    console.log("DATA >>>>", data)
    console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var response = []

        console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
            response.push({
                "IP Address": item[1],
                "Sparkline": item[0].split(','),
                "Count": item[2].split(',').map(s => parseInt(s)),
                "Average Score": Math.round(item[3]),
            })
        })

        getDevicesData(response, chartContainer)
        graphbuild(Response, chartContainer)
    }
}