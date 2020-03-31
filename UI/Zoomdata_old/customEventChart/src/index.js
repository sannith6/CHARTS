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




var get360User = function (param, value) {
    var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5da43d449c0c7745566b47d7?inheritSourceId=5da43c199c0c7745566b4787&filters=[{%22path%22:%22userid%22,%22value%22:[%22${value}%22],%22operation%22:%22IN%22,%22editable%22:true,%22label%22:%22Userid%22}]&from=+$now_-365_day&to=+$now&timeField=timeofevent?__target=embedded&key=YxwF2fWvVC`

    return link
}


var contextMenu = function (m, k) {
    return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${get360User(m, k)}">360 User View</a></li></ul>`
}


function graphbuild(chartdata) {


    console.log("check the response", aa, bb)
    var echarts = require('echarts');


    chartdata.map((data, i) => {

        var neCustomchart = document.createElement('div');
        neCustomchart.style.height = '80px';
        neCustomchart.style.width = '130px';
        neCustomchart.style.position = 'absolute';
        neCustomchart.style.bottom = '0px'


        // initialize echarts instance with prepared DOM
        var neChart = echarts.init(neCustomchart);
        neChart.setOption({
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                show: true,
            },
            yAxis: {
                type: 'value',
                show: true
            },
            series: [{
                data: [1, 2, 3, 1, 0, 1, 2],
                type: 'line',
                symbolSize: 2
            }],
            color: '#a5c78a',
            height: 25,
            width: '80%'

        });
        return neCustomchart.innerHTML
    })
}

function getDevicesData(response, chad) {
    if (response.length !== 0) {

        var headers = ''
        var clickableTD = ["User Name"]
        var sparklinetd = ["Sparkline", "count"]

        Object.keys(response[0]).map((k) => !sparklinetd.includes(k) && (headers += `<th>${k}</th>`))

        headers += `<th>Sparkline</th>`

        var body = ''
        response.map((k, i) => {
            body += `<tr id="row${i}">`

            Object.keys(k).map((m) => {
                if (clickableTD.includes(m)) {
                    !sparklinetd.includes(m) && (body += `<td class="contextMenulist">${contextMenu(m, k[m])}${k[m]}</td>`)
                }
                else {
                    !sparklinetd.includes(m) && (body += `<td>${k[m]}</td>`)
                }
            })

            body += `<td style="padding: 4px; position: relative;">${graphbuild(chartdata)}</td>`
            body += `</tr>`

        })



        var view = `
               <div>
                    <div>
                        <table class="table tabeldash" id="table_id">
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
        var chartdata = []

        reducedDataSource.map((item, index) => {
            response.push({
                "User Name": item[1],
                "Sparkline": item[0].split(','),
                "count": item[2].split(',').map(s => parseInt(s)),
                "Total Count": Math.round(item[3]),
            })
        })

        chartdata = data.map(item => {
            return {
                data: {
                    date: item[0].split(','),
                    score: item[2].split(',').map(s => parseInt(s))
                },
            }
        })

        getDevicesData(response, chartdata)
    }
};