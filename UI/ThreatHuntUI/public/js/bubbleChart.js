$(document).ready(function () {

    //Inital Bubble chart call
    function getBubbleChart(url) {


        if(SessionArray.length !== 0){
             document.getElementById('backBtn').style.display = "inline"
             document.getElementById('forwardBtn').style.display = "inline"
        }

        // SessionArray.push(url);
        // SessionPointer = SessionPointer + 1;
        SessionPointer = SessionPointer + 1;

         if(SessionArray.length === SessionPointer){
                    document.getElementById('forwardBtn').style.display = "none"
         }

        if(SessionPointer !== SessionArray.length){
            SessionArray.splice(SessionPointer, 0, url);
            
        }else{
            SessionArray.push(url)
        }

    
            
        $(".loadertest").html(loaderdiv);
        console.log(url, "Checking the Initial Api")
        var request = new XMLHttpRequest();

        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', url, true)

        // Defining headers
        request.setRequestHeader("cache-control", "no-cache");
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

        request.onload = function () {
            if (this.readyState == this.DONE ) {
                $(".loadertest").html('');
                // console.log(JSON.parse(this.response.error), "bubble data")
                getBubbleData(JSON.parse(this.response))
            }
        };
        request.send();
    }

    // Calling API

    var location = window.location.href;
    var url = new URL(location);
    var nodeid = url.searchParams.get("id");
    var selection = url.searchParams.get("selection");
    var search_for = url.searchParams.get("for");
    var exact_query = url.searchParams.get("exact");

    if (url.searchParams.get("graph")) {
        graphVar = url.searchParams.get("graph");
    }

    if (nodeid && selection) {
        getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${nodeid}&selection=${selection}&graph=${graphVar}`)
    }
    else if (nodeid && search_for == null) {
        getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${nodeid}&graph=${graphVar}`)
    }
    else if (nodeid == null && search_for != null && exact_query == null) {
        getNewUserAndNewIP(`${rootUrl}/search_for?by=${search_for}&graph=${graphVar}`)
    }
    else if (nodeid == null && search_for != null && exact_query != null) {
        getNewUserAndNewIP(`${rootUrl}/search_for?by=${search_for}&exact=${exact_query}&graph=${graphVar}`)
    }
    // else {
    //     localStorage.setItem('id', n.id);
    //     var sDate = localStorage.getItem('startDate');
    //     var eDate = localStorage.getItem('endDate');
    //     console.log(sDate, eDate, "local storage");

    //     if (sDate && eDate) {
    //         console.log("heyey")
    //         window.localStorage.removeItem("startDate");
    //         window.localStorage.removeItem("endDate");
    //     }

    //     getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${n.id}&graph=${graphVar}`)
    // }
    else {
        getBubbleChart(`${rootUrl}/get_bubble_data?id=0&graph=${graphVar}`)
    }
})

// Simulation Function
function bubbleSimulation(nodeData) {
    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();
    document.getElementById('accordion').style.display = "none";
    // Defining Colors
    var color = d3.scaleOrdinal()
        .domain(["user", "IP"])
        .range(["#5688F0", "yellow"]);


    const forceX = d3.forceX(width / 2).strength(0.015)
    const forceY = d3.forceY(height / 2).strength(0.015)


    var force = d3.forceSimulation()
        .velocityDecay(0.2)
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", d3.forceCollide().radius(function (d) {
            return (d.edge_count * 0.009 + 3);
        }).iterations(5))
        .nodes(nodeData).on("tick", ticked);


    let zoom2 = d3.zoom().on("zoom", zoomed);

    var svg = d3.select(".cichart").append("svg")
        .attr("viewBox", "0 100 1024 600")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .on("dblclick.zoom", null)
        .append("g");;



    d3.select("#zoom_in").on("click", function () {
        zoom2.scaleBy(svg.transition().duration(750), 1.2);
    });
    d3.select("#zoom_out").on("click", function () {
        zoom2.scaleBy(svg.transition().duration(750), 0.8);
    });


    function zoomed() {
        svg.attr("transform", d3.event.transform);
    }


    // Zoom Function
    // function zoomed() {
    //     svg.attr("transform", d3.event.transform);
    // }

    // var zoom = d3.zoom().on("zoom", zoomed);


    // svg.call(zoom);

    // d3.select('#zoom-reset-button').on("click", function () {
    //     zoom.transform(svg, d3.zoomIdentity);
    // });
    // Zoom function ended


    // Adding Legends
    // var circleLegend = d3.symbol().type(d3.symbolCircle)()

    // var symbolScale = d3.scaleOrdinal()
    //     .domain(['IP', 'User'])
    //     .range([circleLegend, circleLegend]);

    // var svg = d3.select("svg");

    // svg.append("g")
    //     .attr("class", "legendSymbol")
    //     .attr("transform", "translate(20, 20)")


    // var legendPath = d3.legendSymbol()
    //     .scale(symbolScale)
    //     .orient("vertical")
    //     .labelWrap(30)
    //     .title("Symbol Legend Title")
    //     .on("cellclick", function (d) { alert("clicked " + d); });

    // svg.select(".legendSymbol")
    //     .call(legendPath);

    var circles = svg.selectAll("circle")
        .data(nodeData)
        .enter().append("circle")
        .attr("r", function (d) { return d.edge_count * 0.009 })
        .style("fill", function (d, i) {
            if (d.properties.node_label == 'IP') {
                return "#5688F0";
            }
            else if (d.properties.node_label == 'user') {
                return "#ff6074";
            }
            else {
                return "yellow";
            }
        })


    // Tooltip

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "13px sans-serif")
        .text("tooltip");


    circles.on("mouseover", function (n) {
        circles.style("stroke", function (d) {
            if (d.id == n.id)
                return "black";
            else
                return "white";
        })

        // stroke width
        circles.style("stroke-width", function (d) {
            if (d.id == n.id)
                return 2;
            else
                return 0;
        })

        labelbox(n)
        sideResults(n, "bubble")
    })



    circles.on("mousemove", function () {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden") });


    circles.on("dblclick", function (n) {

        d3.select('.cichart').selectAll('*').remove();
            d3.select('.legends').selectAll('*').remove();
        tooltip.style("visibility", "hidden");

        var location = window.location.href;
        var url = new URL(location);
        var nodeid = url.searchParams.get("id");
        var selection = url.searchParams.get("selection");
        var search_for = url.searchParams.get("for");
        var exact_query = url.searchParams.get("exact");

        if (url.searchParams.get("graph")) {
            graphVar = url.searchParams.get("graph");
        }

        if (nodeid && selection) {
            getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${nodeid}&selection=${selection}&graph=${graphVar}`)
        }
        else if (nodeid && search_for == null) {
            getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${nodeid}&graph=${graphVar}`)
        }
        else if (nodeid == null && search_for != null && exact_query == null) {
            getNewUserAndNewIP(`${rootUrl}/search_for?by=${search_for}&graph=${graphVar}`)
        }
        else if (nodeid == null && search_for != null && exact_query != null) {
            getNewUserAndNewIP(`${rootUrl}/search_for?by=${search_for}&exact=${exact_query}&graph=${graphVar}`)
        }
        else {
            localStorage.setItem('id', n.id);
            var sDate = localStorage.getItem('startDate');
            var eDate = localStorage.getItem('endDate');
            console.log(sDate, eDate, "local storage");

            if (sDate && eDate) {
                console.log("heyey")
                window.localStorage.removeItem("startDate");
                window.localStorage.removeItem("endDate");
            }

            getNewUserAndNewIP(`${rootUrl}/generate_graph?id=${n.id}&graph=${graphVar}`)
        }

    })


    function labelbox(d) {
        if (d.properties.node_label == 'user') {
            tooltip.html("User Name :  " + d.properties.userName + "<br/>" + "Number of connections :  " + d.edge_count);
            tooltip.style("visibility", "visible");
        }
        else if (d.properties.node_label == 'IP') {
            tooltip.html("Ip :  " + d.properties.ip + "<br/>" + "Number of connections :  " + d.edge_count);
            tooltip.style("visibility", "visible");
        }
        else {
            tooltip.html("File Name :  " + d.properties.fileName + "<br/>" + "Number of connections :  " + d.edge_count);
            tooltip.style("visibility", "visible");
        }
        // var view = d3.select('#abc')
        // view.html(`<div>Label :${d.properties.node_label}</div> <div>Number of connections :${d.edge_count}</div>  `)
    }



    function ticked(e) {
        svg.selectAll("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    };

}

// Calling data function
function getBubbleData(jsondata) {
    console.log(jsondata, "jsondata")
    bubbleSimulation(jsondata.data)
}


// $(".scaleTime").css("display", "none");


    // $("#slider-3").slider({
    //     range: true,
    //     min: 0,
    //     max: 1440,
    //     step: 15,
    //     slide: function (e, ui) {
    //         var hours = Math.floor(ui.value / 60);
    //         var minutes = ui.value - (hours * 60);

    //         if (hours.toString().length == 1) hours = '0' + hours;
    //         if (minutes.toString().length == 1) minutes = '0' + minutes;

    //         console.log("wbfewh", hours, minutes)
    //         $('#config-demo').val(hours + ':' + minutes);
    //     }
    // });


    // var startDate = new Date(2017, 12, 3);
    // var endDate = new Date();
    // var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    // var diffDays = Math.ceil(timeDiff / (100000 * 3600 * 24));
    // $("#slider-3").slider({
    //     range: true,
    //     min: 0,
    //     max: diffDays,
    //     step: 1,
    //     animate: true,
    //     slide: function (event, ui) {
    //         var fromDate = new Date(2017, 12, 3);
    //         var toDate = new Date();
    //         fromDate.setDate(startDate.getDate() + parseInt(ui.values[0]));
    //         toDate.setDate(startDate.getDate() + parseInt(ui.values[1]));

    //         $("#config-demo").val(fromDate.getDate() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getFullYear() + "  -  " + toDate.getDate() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getFullYear());
    //     }
    // });


