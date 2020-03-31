import './index.css';
// import './css/style.css'
import * as d3 from "d3"
import moment from 'moment'
import mailImage from './images/mail.png'
import globeImage from './images/globe1.png'
import keyImage from './images/key1.png'
import 'bootstrap/dist/css/bootstrap.css'

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

var chartSVGComponent

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


var chartMap = {
    calc_risky_email: { index: 2, imageName: mailImage, chartComponentName: 'riskyEmail', chartValueName: 'riskyEmailValue' },
    calc_risky_http2: { index: 3, imageName: keyImage, chartComponentName: 'riskyWebActivity', chartValueName: 'riskyWebActivityValue' },
    calc_risky_logon: { index: 4, imageName: globeImage, chartComponentName: 'riskyLogon', chartValueName: 'riskyLogonValue' },
    calc_count_risky: { index: 1, imageName: mailImage, chartComponentName: 'riskyEmailCount', chartValueName: 'riskyEmailCountValue' }
}


function createBarGraphs(chartSVGComponent, barChartValue, response, i, imageName) {

    const view = `   
        <div class="row">
            <div id="${chartSVGComponent}modal" class="modal">    
                <!-- Modal content -->
                <div id="${chartSVGComponent}modal-content" class="modal-content">
                <span id="${chartSVGComponent}closeBtn" class="close">&times;</span>
                <p>Some text in the Modal..</p>
                </div>
            </div>
            <div class="col-md-12 noPadding">
                <div class="box bgWhite pad0>
                        <div class="">
                            <div class="value" id="${barChartValue}" style="display:inline;"></div>
                            <img style="display:inline;float:right;" id="blockImage" src="${imageName}" alt="Mail" style="float:right;margin-top:25px" />
                        </div>
                        <div class="row" style="margin-right:0px;margin-left:0px">
                            <div class="col-md-12 te" style="height:200px;">
                                <svg id="${chartSVGComponent}"></svg>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        `
    chartContainer.innerHTML = view
    console.log("CHART RESPONSE from bar >>>", response)
    var data = toDays(response);
    if (data.length > 7) {
        let len = data.length - 7;
        for (let i = 0; i < len; i++) {
            data.splice(i, 1);
        }
    }
    var colors = ['', '#F1156D', '#0078FF', '#F3A823', '#F1156D'];
    var parent = document.getElementsByClassName('te')[0];

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = parent.clientWidth - margin.left - margin.right,
        height = parent.clientHeight - margin.top - margin.bottom;

    var svg = d3.select("#" + chartSVGComponent) //("#webTraffic, #loginPatterns")
        .attr("width", '100%')
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var g = svg.append("g");
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);
    console.log("VALUESSS >>>> ")
    let valuess = data.map(function (d) { return d.dateNew; })

    x.domain(valuess);
    y.domain([0, d3.max(data, function (d) { return d.count; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.1em")
        .attr("text-anchor", "end")
        .text("Frequency");

    data[data.length - 1].color = colors[i];
    document.getElementById(barChartValue).innerHTML = ''
    document.getElementById(barChartValue).insertAdjacentText('afterbegin', data[data.length - 1].count);
    var bars = g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar");

    bars.attr("fill", function (d) { return d.color ? d.color : '#9B9B9B'; })
        .attr("x", function (d) { return x(d.dateNew); })
        .attr("y", function (d) { return y(d.count); })
        .attr("width", x.bandwidth() / 1.5)
        .attr("height", function (d) { return height - y(d.count); })
        .on("click", function (d) {
            console.log(d)
            console.log(event)
            controller.menu.show({
                x: event.x,
                y: event.y,
                // data: function () {
                //     return event.zdDataElement;
                // },
                menu: {
                    items: ['Zoom', 'Filter All', 'Info'],
                },
                // });
            });
            d3.event.stopPropagation();
            event.stopPropagation();
            event.stopImmediatePropagation();
        });

}

function radialMenu() {

}

// $(`#${chartSVGComponent}`).on('click', param => {
//     console.log("PARAMS >>>> ",param)

// });


//convert dates into days
function toDays(data) {
    console.log("HIT toDays() >>>>>", data)
    // data = JSON.parse(data)
    var weeks = ['Week1', 'Week2', 'Week4', 'Week5', 'Week6', 'Week7', 'Week8'];
    return data.map(function (d) {
        d.dateNew = moment(d.date).format('MM[/]DD');
        return d;
    });
}


function groupBy(elements, duration) {
    const formatted = elements.map(elem => {
        return { date: moment(elem.date).startOf(duration).format('YYYY-MM-DD'), count: elem.count }
    })

    const dates = formatted.map(elem => elem.date)
    const uniqueDates = dates.filter((date, index) => dates.indexOf(date) === index)

    return uniqueDates.map(date => {
        const count = formatted.filter(elem => elem.date === date).reduce((count, elem) => count + elem.count, 0)
        return { date, count }
    })
}




controller.update = data => {
    console.log("BAR CHART  DATA >>>>> ", data)
    const groupAccessor = controller.dataAccessors['Group By'];
    const metricAccessor = controller.dataAccessors['Metric'];


    let response = []
    data.map(item => {
        console.log(groupAccessor.raw(item), metricAccessor.raw(item));
        response.push({ date: groupAccessor.raw(item), count: metricAccessor.raw(item) })
    })
    console.log(response, ">>>>>>", JSON.stringify(response))
    if (response.length > 0) {
        // let newResponse = response.slice(Math.max(response.length - 7, 1))
        var newResponse = response.length > 7 ? groupBy(response, 'week') : response
        var metric = Object.keys(data[0].current.metrics)
        chartSVGComponent = `te1${metric}`//chartMap[metric] && chartMap[metric].chartComponentName || ''
        var barChartValue = `t1${metric}`//chartMap[metric] && chartMap[metric].chartValueName || ''
        var i = chartMap[metric] && chartMap[metric].index || 1
        var imageName = chartMap[metric] && chartMap[metric].imageName || globeImage
        console.log("NewResponses >>>>", newResponse)
        createBarGraphs(chartSVGComponent, barChartValue, newResponse, i, imageName)
    } else {

    }
};