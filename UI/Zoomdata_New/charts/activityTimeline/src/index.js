import './css/index.css';
import './css/style.css';
// import './vendors/bootstrap'
import b_globe from './images/b_globe.png'
import b_key from './images/b_key.png'
import b_mail from './images/b_mail.png'
import * as d3 from 'd3'
// import sampleData from '../src/SampleData'
// import viewCreate from './ViewCreate'
import { find, findIndex, sortBy } from 'lodash';


$(document).ready(function () {
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    controller.element.appendChild(chartContainer);

    console.log("WINDOW LOCATION >>>>", window.location.href)
    var x = window.location.href
    var k = x.split("%22")
    var user = k && k[7] ? k[7] : ''
    console.log(k && k[7] ? k[7] : '')
    var recurringEvents = {}

    controller.query
        .set(['aggregate'], false)
        .unset(['aggregateFilters'])
        .set(['limit'], 10000)
        .set(['offset'], 0)
        .unset(['dimensions'])
        .unset(['metrics'])
        .set(['fields'], getRequestFields())
        .set(['filters'], [
            {
                "operation": "IN",
                "path": {
                    "name": "userid"
                },
                "value": [
                    user
                ]
            }]
        );

    function getRequestFields() {
        // sort fields based on the order specified in Columns variable
        const sortedFields = sortBy(controller.getAllFields(), sourceField =>
            findIndex(
                controller.variables.listAll,
                column => column.name === sourceField.name,
            ),
        );
        // console.log("SORTED FIELDS >>>>>> ", sortedFields, controller.getAllFields(), controller.variables.listAll)

        var s = sortedFields
            .filter(sourceField => {
                return find(
                    controller.variables.listAll,
                    column => column.name === sourceField.name,
                );
            })
            .map(sourceField => ({
                type: 'FIELD',
                field: { name: sourceField.name },
            }));
        console.log("S >>>>> ", s)
        return s
    }



    chartContainer.innerHTML = viewCreate()

    var globalMaxDate, globalMinDate
    var activityData = []//sampleData
    getActvityTimeline()

    function getActvityTimeline() {
        buildTimeLine();
    }


    function buildTimeLine() {
        let sDate = new Date;
        var floorDate = sDate.setHours(0, 0, 0, 0);
        var ceilDate = sDate.setHours(24, 0, 0, 0);
        var millisInDay = 60 * 60 * 1000;
        var dateRangeSlider = {
            minValue: floorDate,
            maxValue: ceilDate,
            options: {
                floor: floorDate,
                ceil: ceilDate,
                step: millisInDay,
                showTicks: false,
                draggableRange: true,
                translate: function (date_millis) {
                    if ((date_millis !== null)) {
                        var dateFromMillis = new Date(date_millis);
                        return formatDate(dateFromMillis);
                    }
                    return '';
                },
                onChange: function () {
                    createScatterPlot(dateRangeSlider.minValue, dateRangeSlider.maxValue);
                }
            }
        }
        createScatterPlot(dateRangeSlider.minValue, dateRangeSlider.maxValue);
        function formatDate(date_millis) {
            let date = new Date(date_millis);
            let hours = date.getHours();
            if (hours > 12) {
                return (hours - 12) + ' PM';
            } else if (hours < 12) {
                if (hours == 0) {
                    return '12 AM'
                } else {
                    return hours + ' AM';
                }
            } else {
                return '12 PM';
            }
        }

        function reduceDataSource(arr) {
            let reducedArray = arr.reduce((total, num) => {
                if (total.length > 0) {
                    recurringEvents[total[total.length - 1].date] = recurringEvents[total[total.length - 1].date] && recurringEvents[total[total.length - 1].date].length > 0 ? recurringEvents[total[total.length - 1].date] : []
                    if (num.activity !== total[total.length - 1].activity || num.userid !== total[total.length - 1].userid)
                        return total.concat(num)
                    else {
                        recurringEvents[total[total.length - 1].date].push(num)
                        return total
                    }

                }
                return total.concat(num)
            }, [])

            return reducedArray
        }

        function createScatterPlot(minDates, maxDates) {
            var myNode = document.getElementById("activityTimeline");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            // var dateDiff = (maxDates - minDates) / 3600000;
            var dateDiff = (globalMaxDate - globalMinDate) / 3600000;
            dateDiff++;
            var data2 = [];
            activityData = reduceDataSource(activityData)


            activityData.forEach(function (a) {
                console.log("a >>>>", a)
                data2.push([a.date,
                a.activity.toUpperCase(), a.userid,
                a.destinationDomain, a.emailSize, a.recievedBytes, a.reciever, a.reportingHost, a.sender, a.sentBytes
                ]);
            })
            function getImage(d) {
                if (d === 'LOGON' || d === 'LOGOFF') return b_key;
                if (d === 'DOWNLOAD' || d === 'UPLOAD') return b_globe;
                if (d === 'RECEIVE' || d === 'SEND') return b_mail;
            }
            var data = data2//[];
            // data2.forEach(function (d) {
            //     var dateTemp = new Date(d[0]);
            //     if (dateTemp >= new Date(minDates) && dateTemp <= new Date(maxDates)) data.push([d[0], d[1]]);
            // })
            if (data.length === 0) {
                var elm = document.createElement('span');
                elm.insertAdjacentText('beforeEnd', 'No date availible for this range');
                myNode.appendChild(elm);
                myNode.classList.add("noDataClass");
                return;
            }
            myNode.classList.remove("noDataClass");

            var color = d3.scaleOrdinal(d3.schemeCategory10);
            var statuses = ['', 'LOGON', 'DOWNLOAD', 'RECEIVE', 'SEND', 'UPLOAD', 'LOGOFF'];
            var dates = [];
            data.forEach(function (d) {
                dates.push(new Date(d[0]));
            })
            var minDate = new Date(Math.min.apply(null, dates));
            var maxDate = new Date(Math.max.apply(null, dates));
            minDate.setHours(minDate.getHours() - 1);
            maxDate.setHours(maxDate.getHours() + 1);

            //var multiplier = 550
            var multiplier = dateDiff < 5 ? (dateDiff < 3 ? (dateDiff === 1 ? 500 : 2000) : 1000) : 600
            multiplier = data.length < 30 && dateDiff > 5 ? 220 : multiplier
            var margin = { top: 20, right: 15, bottom: 60, left: 70 }
                , width = myNode.clientWidth - margin.left - margin.right
                , height = multiplier * dateDiff - margin.top - margin.bottom;

            var x = d3.scalePoint()
                .domain(statuses)
                .range([0, width]);

            // var y = d3.scaleTime()
            //     .domain([minDate, maxDate])
            //     .range([height, 0]);

            // var ticks = y.ticks();
            // ticks.length = 0;
            // data.forEach(function (d) {
            //     ticks.push(new Date(d[0]));
            // })

            var ticks = []
            ticks.length = 0;
            data.forEach(function (d) {
                ticks.push(new Date(d[0]));
            })

            var y = d3.scalePoint()
                .domain(ticks)
                .range([height, 0]);

            var lineFunction = d3.line()
                .y(function (d) { return y(new Date(d[0])); })
                .x(function (d) { return x(d[1]); })
                .curve(d3.curveCardinal);

            var div = d3.select("#activityTimeline")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var chart = d3.select('#activityTimeline')
                .append('svg:svg')
                .attr('width', width * 0.99 + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'chart')

            var lineGraph = chart.append("path")
                .attr("d", lineFunction(data))
                .attr('transform', 'translate(0,0)')
                .attr("stroke", "#627078")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            var main = chart.append('g')
                .attr('transform', 'translate(0,0)')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'main');

            var yAxis = d3.axisLeft()
                .scale(y)
                .tickFormat(d3.timeFormat('%d %b %Y - %I:%M:%S'))
                .tickSize(0)
                .tickPadding(50)
                .tickValues(ticks);

            main.append('g')
                .attr('transform', 'translate(70,0)')
                .attr('class', 'main axis date')
                .call(yAxis)
                .selectAll("text")
                .call(function (t) {
                    t.each(function (d) {
                        var self = d3.select(this);
                        var s = self.text().split('-');
                        self.text('');
                        self.append("tspan")
                            .attr("x", 0)
                            .attr("dy", ".8em")
                            .text(s[0]);
                        self.append("tspan")
                            .attr("x", -10)
                            .attr("dy", "1.2em")
                            .text(s[1]);
                    })
                })
                .attr("dy", "0")
                .attr("dx", "-.3em")
                .attr('transform', 'translate(0,0) rotate(0)')
                .style('font-size', '9px')
                .style('letter-spacing', '1');

            var xAxis = d3.axisTop()
                .scale(x);

            var g = main.append("svg:g");

            g.selectAll("scatter-dots")
                .data(data)
                .enter()
                .append("svg:image")
                .attr("ylink:href", function (d) { return getImage(d[1]); })
                .attr("y", function (d) { return y(new Date(d[0])); })
                .attr("x", function (d) { return x(d[1]); })
                .style('fill', function (d) { return color(d[1]); })
                .style('cursor', 'pointer')
                .on("click", function (d) {
                    d3.event.stopPropagation();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    onClickActivityTimeline(d);
                });
        }
    }


    function displayRecurringEvents(data) {
        console.log("Reccurring events", data)
        data.map((item) => {
            var extraData = ''
            if (item.activity.toUpperCase() === 'DOWNLOAD' || item.activity.toUpperCase() === 'UPLOAD') {
                extraData = `<span style="font-weight:bold;">User Id : </span><span>${item.userid}</span><br/>
                        <span style="font-weight:bold;">Time Of Event : </span><span>${item.date}</span><br/>
                        <span style="font-weight:bold;">Destination Domain : </span><span>${item.destinationDomain}</span><br/>
                        <span style="font-weight:bold;">Sent Bytes : </span><span>${item.sentBytes}</span><br/>
                        <span style="font-weight:bold;">Recieved Bytes : </span><span>${item.recievedBytes}</span><br/><br/>   
                        `
            } else if (item.activity.toUpperCase() === 'SEND' || item.activity.toUpperCase() === 'RECEIVE') {
                extraData = `<span style="font-weight:bold;">User Id : </span><span>${item.userid}</span><br/>
            <span style="font-weight:bold;">Time Of Event : </span><span>${item.date}</span><br/>
            <span style="font-weight:bold;">Destination Domain : </span><span>${item.destinationDomain}</span><br/>
            <span style="font-weight:bold;">Sender : </span><span>${item.sender}</span><br/>
            <span style="font-weight:bold;">Reciever : </span><span>${item.reciever}</span><br/>
            <span style="font-weight:bold;">Email Size : </span><span>${item.emailSize}</span><br/><br/>
            `
            } else if (item.activity.toUpperCase() === 'LOGON' || item.activity.toUpperCase() === 'LOGOFF') {
                extraData = `<span style="font-weight:bold;">User Id : </span><span>${item.userid}</span><br/>
            <span style="font-weight:bold;">Time Of Event : </span><span>${item.date}</span><br/>
            <span style="font-weight:bold;">Destination Domain : </span><span>${item.destinationDomain}</span><br/>
            <span style="font-weight:bold;">Reporting Host : </span><span>${item.reportingHost}</span><br/><br/>
            `
            }
            document.getElementById('eventData').innerHTML +=  extraData
        })
    }





    function onClickActivityTimeline(data) {
        console.log(data)
        console.log("All Datas >> ", recurringEvents[data[0]])
        var extraData = ''
        if (data[1] === 'DOWNLOAD' || data[1] === 'UPLOAD') {
            extraData = `<span style="font-weight:bold;">User Id : </span><span>${data[2]}</span><br/>
                        <span style="font-weight:bold;">Time Of Event : </span><span>${data[0]}</span><br/>
                        <span style="font-weight:bold;">Destination Domain : </span><span>${data[3]}</span><br/>
                        <span style="font-weight:bold;">Sent Bytes : </span><span>${data[9]}</span><br/>
                        <span style="font-weight:bold;">Recieved Bytes : </span><span>${data[5]}</span><br/><br/>   
                        `
        } else if (data[1] === 'SEND' || data[1] === 'RECEIVE') {
            extraData = `<span style="font-weight:bold;">User Id : </span><span>${data[2]}</span><br/>
            <span style="font-weight:bold;">Time Of Event : </span><span>${data[0]}</span><br/>
            <span style="font-weight:bold;">Destination Domain : </span><span>${data[3]}</span><br/>
            <span style="font-weight:bold;">Sender : </span><span>${data[8]}</span><br/>
            <span style="font-weight:bold;">Reciever : </span><span>${data[6]}</span><br/>
            <span style="font-weight:bold;">Email Size : </span><span>${data[4]}</span><br/><br/>
            `
        } else if (data[1] === 'LOGON' || data[1] === 'LOGOFF') {
            extraData = `<span style="font-weight:bold;">User Id : </span><span>${data[2]}</span><br/>
            <span style="font-weight:bold;">Time Of Event : </span><span>${data[0]}</span><br/>
            <span style="font-weight:bold;">Destination Domain : </span><span>${data[3]}</span><br/>
            <span style="font-weight:bold;">Reporting Host : </span><span>${data[7]}</span><br/><br/>
            `
        }
        document.getElementById('eventData').innerHTML = extraData
        displayRecurringEvents(recurringEvents[data[0]])

    }



    controller.update = data => {
        console.log("ACTIVITY TIMELINE DATA >>>>> ", data)
        if (data.length > 0) {
            let responses = []
            var dates = []
            data.map((item) => {
                if (item[0] !== '-' && user === item[9]) {
                    responses.push({
                        "userid": item[7] ? item[7] : '',
                        "eventtime": item[6] ? item[6] : '',
                        "activity": item[2] ? item[2] : '',
                        "destinationDomain": item[1] ? item[1] : '',
                        "emailSize": item[1] ? item[1] : '',
                        "recievedBytes": item[3] ? item[3] : '',
                        "reciever": item[4] ? item[4] : '',
                        "reportingHost": item[5] ? item[5] : '',
                        "sender": item[6] ? item[6] : '',
                        "sentBytes": item[0] ? item[0] : '',
                    })
                    dates.push(new Date(item[6]))
                }
            })

            globalMaxDate = new Date(Math.max.apply(null, dates));
            globalMinDate = new Date(Math.min.apply(null, dates));
            console.log("RESPOSE >>", responses, globalMaxDate, globalMinDate)
            activityData = responses
            getActvityTimeline()
        }

    }


})


/*
************ Array Mapping ********
0:activity,
1:destinationdomain
2:email_size
3:recievedbytes
4:reciever
5:reportinghost
6:sender
7:sentbytes
8:timeofevent
9:userid




*/