//Inital call
function getNewUserAndNewIP(url) {
    if(SessionArray.length !== 0){
            document.getElementById('backBtn').style.display = "inline"
            document.getElementById('forwardBtn').style.display = "inline"
    }
 
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
    console.log(url)
    sessionStorage.setItem("lasturl", url);

    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', url, true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            console.log(JSON.parse(this.response), "data")
        
            // if(JSON.parse(this.response).data.nodes.length > 100){
            //     getTreeData(url)
            // }else{
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            // }
        }
    };
    request.send();
}


var forceLink = d3.forceLink().id(function (d) {
    return d.id;
}).distance(function (d) {
    // return GetNodeDefaults(d).linkDistance;
    return 170;
}).strength(1);


function startSimulation(nodes, links) {

    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();

    document.getElementById('accordion').style.display = "inline";
    nodes.forEach(function (element) {
        if (element.node_label === 'IP') {
            element.image = ipImage
        }
        else if (element.node_label === 'user') {
            element.image = iconImage
        }
        else if (element.node_label === 'process') {
            element.image = processImage
        }
        else if (element.node_label === 'email') {
            element.image = emailImage
        }
        else if (element.node_label === 'hosts') {
            element.image = hostsImage
        }
        else if (element.node_label === 'URLs') {
            element.image = urlIcon
        }
        else if (element.node_label === 'childProcess') {
            element.image = childProcessImage
        }
    })


    function dragstart(d) {
        d.fixed = true;
    }

    function dragstarted(d) {
        console.log("drag started");
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        console.log("drag ended");
        if (!d3.event.active) simulation.alphaTarget(0);
    }

    var simulation = d3.forceSimulation()
        .force("link", forceLink)
        // .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(function (d, i) {
            var a = (i == 0) ? -50 : -10;
            return a;
        }).distanceMin(100).distanceMax(2000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(function (d) { return 50 }).iterations(50))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .force("charge", d3.forceManyBody().strength(-30))

    let zoom = d3.zoom().on("zoom", zoomed);

    var svg = d3.select(".cichart")
        // Container class to make it responsive.
        .classed("svg-container", true)
        .append("svg")
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 100 1024 600")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .on("dblclick.zoom", null)
        .append("g");

    d3.select("#zoom_in").on("click", function () {
        zoom.scaleBy(svg.transition().duration(750), 1.2);
    });
    d3.select("#zoom_out").on("click", function () {
        zoom.scaleBy(svg.transition().duration(750), 0.8);
    });


    function zoomed() {
        svg.attr("transform", d3.event.transform);
    }

    // here

    // Zoom slider 
    // var zoom = d3.zoom()
    //     .scaleExtent([0, 10])
    //     .on("zoom", zoomed);


    // var slider = d3.select("#zoombtn").append("p").append("input")
    //     .datum({})
    //     .attr("type", "range")
    //     .attr("value", zoom.scaleExtent()[1])
    //     .attr("min", zoom.scaleExtent()[0])
    //     .attr("max", zoom.scaleExtent()[1])
    //     .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
    //     .on("input", slided);


    // var svg = d3.select(".cichart")
    //     // Container class to make it responsive.
    //     .classed("svg-container", true)
    //     .append("svg")
    //     // Responsive SVG needs these 2 attributes and no width and height attr.
    //     .attr("preserveAspectRatio", "xMidYMid meet")
    //     .attr("viewBox", "0 100 1024 600")
    //     .call(zoom)
    //     .append("g");


    // function zoomed() {
    //     const currentTransform = d3.event.transform;
    //     svg.attr("transform", currentTransform);
    //     svg.property("value", currentTransform.k);
    // }

    // function slided(d) {
    //     zoom.scaleTo(svg, d3.select(this).property("value")/5);
    // }

    // here

    var svg2 = d3.select(".legends")
        .append("svg")
        .attr("width", "300px")
        .attr("height", "600px")

    var counter = {};

    links.forEach(function (obj) {
        var key = JSON.stringify(obj);
        counter[key] = (counter[key] || 0) + 1
    });

    var finalArray = [];

    for (var key in counter) {
        var tempkey = key.substring(0, key.length - 1) + ",\"value\":" + counter[key] + "}";
        finalArray.push(tempkey)
    };

    finalArray.forEach(function (d, i, array) {
        array[i] = (JSON.parse(d))
    })

    var lookup = {}
    var linkLabels = []
    var linkLabelColorMap = {}
    finalArray.forEach(function (l) {
        var label = l.label;
        if (!(label in lookup)) {
            lookup[label] = 1;
            linkLabels.push(label);
            linkLabelColorMap[label] = linkColorMap[label];
        }
    });

    // Build the arrow.
    console.log(linkLabels)

    svg.append("svg:defs").selectAll("marker")
        .data(linkLabels)      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 40)
        .attr("refY", -4)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("stroke-width", 'userSpaceOnUse')
        .style("fill", function (l) {
            return linkLabelColorMap[l];
        });


    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(finalArray)
        // .enter().append("line") // For Straight lines 
        .enter().append("path")  // For curvy lines 
        .attr("marker-end", function (l) {
            return "url(#" + l.label + ")"
        })
        .attr('stroke', function (d) {
            return linkLabelColorMap[d.label];
        })
        // .style("stroke-dasharray", ("6, 6"))  //For Dahsed links
        .style('fill', 'none')
    // Manage stroke width / link width

    // .attr("stroke-width" , 1)
    // .attr("stroke-width", function (d) {
    //     if (Math.sqrt(d.value) < 15)
    //         return Math.sqrt(Math.sqrt(d.value))
    //     else
    //         return Math.sqrt(Math.sqrt(225))
    // });

    link.append("title")
        .text(function (l) { return l.label; })


    // Add the Legend menu
    var legend = svg2.append("g")
        .attr("class", "legend")
        // .attr("x",0)
        // .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

    legend.selectAll('g').data(linkLabels)
        .enter()
        .append('g')
        .each(function (l, i) {
            var g = d3.select(this);
            g.append("rect")
                .attr("x", 30)
                .attr("y", 390 + i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function () { // Add the colours dynamically
                    return linkLabelColorMap[l];
                })

            g.append("text")
                .attr("x", 50)  // space legend
                .attr("y", 400 + i * 20)
                .attr("class", "legend")    // style the legend
                .style("fill", function () { // Add the colours dynamically
                    return linkLabelColorMap[l];
                })
                .text(l);
        });


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g");

    // var circles = node.append("circle")
    //     .attr("fill", "white")
    //     .attr("class", "foo")
    //     .attr('r', 30);

    var circles = node.append("circle")
        .style("fill", function (d) {
            if (d.severity === 'red') {
                return "#FFE5E5";
            } else {
                return "white"
            }
        })
        // .style("opacity", function (d) {
        //     if (d.severity === 'red') {
        //         return 0.1 ;
        //     }
        // })
        .attr("class", "foo")
        .attr('r', 30);

    var nodeImage = node.append("image")
        .attr("xlink:href", d => d.image)
        .attr("height", "50")
        .attr("width", "50")
        .attr("x", -25)
        .attr("y", -25)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    var lables = node.append("text")
        .text(function (d) {
            if (d.node_label == "user") {
                return d.userName;
            } else if (d.node_label == "IP") {
                return d.ip;
            }
            else if (d.node_label == "email") {
                return d.emailSubject;
            }
            else if (d.node_label == "hosts") {
                return d.hostname;
            }
            else if (d.node_label == "URLs") {
                return d.URL;
            }
            else if (d.node_label == "childProcess") {
                return d.fileName;
            }
            else {
                return d.fileName;
            }

        })
        .attr('x', -40)
        .attr('y', 40)
        .style("font-size", "13px")

    node.append("title")
        .text(function (d) { return d.lable; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(finalArray);

    node.on('mouseover', function (d) {
        link.style('stroke', function (l) {
            if (d === l.source || d === l.target)
                return 'grey';
            else
                return linkLabelColorMap[d.label];;
        })
    });
    node.on('mouseout', function () {
        link.style('stroke', function (d) {
            return linkLabelColorMap[d.label];
        })
        svg.attr('stroke', function (l) {
            return linkLabelColorMap[l];
        })
    });

    node.on("contextmenu", function (d, i, nodes, finalArray) {
        rightClicknode(d, i, nodes, finalArray)
    });

    nodeImage.on("dblclick", function (d) {
        doubleClicknode(d)
    });

    svg.on("mousedown", function () {
        d3.select('#contextMenuNode').style("display", "none");
    });

    nodeImage.on("click", function (n) {
        if (d3.event.ctrlKey) {

            clickedObjects.push(n)
            clickedIds.push(n.id)

            console.log(clickedObjects , clickedIds , "clicked objects")

            circles.style("stroke", function (d) {
                if (clickedIds.includes(d.id))
                    return "#c83531";
            })
            circles.style("stroke-dasharray", function (d) {
                if (clickedIds.includes(d.id))
                    return 5;
            })
            circles.style("stroke-width", function (d) {
                if (clickedIds.includes(d.id))
                    return 3;
            })
        }
        else {

            callOnClickAPI(n.id , n)
            // stasticalAPi(n.id)
            // profilerData(n)

            clickedObjects = []
            clickedIds = []
            circles.style("stroke", function (d) {
                if (d.id == n.id)
                    return "#4f4f5f";
                else
                    return "white";
            })
            circles.style("stroke-dasharray", function (d) {
                if (d.id == n.id)
                    return 5;
                else
                    return 0;
            })
            circles.style("stroke-width", function (d) {
                if (d.id == n.id)
                    return 3;
                else
                    return 0;
            })
            sideResults(n, "network")
        }
    })


    function rightClicknode(d, i, nodes, links) {
        var view = d3.select('#contextMenuNode')

        if (d.node_label === 'IP') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Has IP</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 2); return false;"><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 3);return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>IP's Communicated</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'IPsCommunicated' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'IPsCommunicated' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'IPsCommunicated' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Process Communicated</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>

                <li><a>Downloaded On</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>

              </ul>
    
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li style="margin-top:70px" onclick="callCollapseApi(${d.id} , 'ip_user'); return false;"><a>IP-User</a></li>
                </ul>
            </li>
    
          </ul>`)
        }
        else if (d.node_label === 'process' || d.node_label === 'childProcess') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Created Process</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Running Process</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Process Communicated</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
              </ul>
    
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callMultipleCollapseApi('background_process'); return false;"><a>Background Process</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'process_downloaded_on'); return false;"><a>Process Downloaded On</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'collapse_process_communicated'); return false;"><a>Process-IP-Communicated</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'process_ip'); return false;"><a>Process-Ip</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_process_user'); return false;"><a>User-Process-User</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'process_user'); return false;"><a>Process-User</a></li>
                </ul>
            </li>
    
          </ul>`)
        }
        else if (d.node_label === 'URLs') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Clicked</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'clicked' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'clicked' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'clicked' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Downloaded From</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'downloadedFrom' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedFrom' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedFrom' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
              </ul>
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callMultipleCollapseApi('background_process'); return false;"><a>Background Process</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'collapse_user_clicked_url'); return false;"><a>Collapse User Clicked URL</a></li>
                    <li onclick="callMultipleCollapseApi('collapse_user_url_process'); return false;"><a>User Downloaded Process</a></li>
                    <li onclick="callCollapseApi(${d.id}, 'user_email_user'); return false;"><a>User-Email-User</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_URL_user'); return false;"><a>User-URL-User</a></li>
                </ul>
            </li>
    
          </ul>`)
        }
        else if (d.node_label === 'hosts') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Logged In</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>

                <li><a>Running Process</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Downloaded On</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'downloadedOn' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
              </ul>
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                     <li style="margin-top:70px" onclick="callCollapseApi(${d.id} , 'collapse_host_user'); return false;"><a>Collapse Host User</a></li>
                </ul>
            </li>
    
          </ul>`)
        }
        else if (d.node_label === 'user') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Has IP</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 2); return false;"><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 3);return false;"><a>3</a></li>
                    </ul>
                </li>

                <li><a>Logged In</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>


                <li><a>Sent Email</a>
                   <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Received Email</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>

                <li><a>Created Process</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'createdProcess' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'createdProcess' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'createdProcess' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>

              </ul>
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callMultipleCollapseApi('background_process'); return false;"><a>Background Process</a></li>
                    <li onclick="callMultipleCollapseApi('collapse_user_url_process'); return false;"><a>User Downloaded Process</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'collapse_user_clicked_url'); return false;"><a>Collapse User Clicked URL</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_process_user'); return false;"><a>User-Process-User</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_process'); return false;"><a>User-Process</a></li>
                    <li onclick="callCollapseApi(${d.id}, 'user_email_user'); return false;"><a>User-Email-User</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_URL_user'); return false;"><a>User-URL-User</a></li>
                    <li onclick="callCollapseApi(${d.id} , 'user_touched_host'); return false;"><a>User Touched Host</a></li>
                </ul>
            </li>
    
          </ul>`)
        }
        else if (d.node_label === 'email') {
            view.html(`<ul class="contextmenu">

            <li><a href="#">Analytics <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li><a href="#">Statistics</a></li>
                    <li><a href=${goToIPViewDashboard(d)}>360 IP View</a></li>
                    <li><a href=${goToUserViewDashboard(d)}>360 User View</a></li>
                </ul>
            </li>
    
            <li><a href="#">Bubble <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callBubbleApi(${d.id} , 1); return false;"><a>1</a></li>
                    <li onclick="callBubbleApi(${d.id} , 2); return false;"><a>2</a></li>
                    <li onclick="callBubbleApi(${d.id} , 3); return false;"><a>3</a></li>
                </ul>
            </li>
    
            <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Sent Email</a>
                   <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Received Email</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>

              </ul>
            </li>
    
            <li><a>Collapse <i class="arrow right-arrow"></i></a>
                <ul class="submenu">
                    <li onclick="callCollapseApi(${d.id} , 'collapse_user_clicked_url'); return false;"><a>Collapse User Clicked URL</a></li>          
                </ul>
            </li>
    
          </ul>`)
        }


        $(document).contextmenu(function (e) {
            //Display contextmenu:
            $(".contextmenu").css({
                //   "left": posLeft,
                //   "top": posTop
            }).show();
            //Prevent browser default contextmenu.
            return false;
        });
        //Hide contextmenu:
        $(document).click(function () {
            $(".contextmenu").hide();
        });

        // console.log('right clicked!!' + d.userName + ":" + d.label);

        d3.select('#contextMenuNode')
            .style('position', 'absolute')
            .style('left', (d3.event.pageX) + "px")
            .style('top', (d3.event.pageY) + "px")
            .style('display', 'inline');
        d3.event.preventDefault();
    }

    function doubleClicknode(d) {
        d3.select('.cichart').selectAll('*').remove();
        d3.select('.legends').selectAll('*').remove();
        getDrilldowndata(d)
    }


    // add the curvy lines
    function ticked() {
        link.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        //  for straight link
        // link
        //     .attr("x1", function (d) { return d.source.x; })
        //     .attr("y1", function (d) { return d.source.y; })
        //     .attr("x2", function (d) { return d.target.x; })
        //     .attr("y2", function (d) { return d.target.y; });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }
}


function getData(jsondata) {
    console.log(jsondata, "jsondata")
    startSimulation(jsondata.data.nodes, jsondata.data.links)
}



{/* <li><a>Expand <i class="arrow right-arrow"></i></a>
              <ul class="submenu">
                <li><a>All</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'all' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'all' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Created Process</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'createdProcess' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Has IP</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 2); return false;"><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'hasIP' , 3);return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Logged In</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 1); return false;" ><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 2); return false;" ><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'loggedIn' , 3); return false;" ><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Assigned Internal IP</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'assignedInternalIP' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'assignedInternalIP' , 2); return false;"><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'assignedInternalIP' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Is Event</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'isEvent' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'isEvent' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'isEvent' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Caused Event</a>
                    <ul class="submenusub">
                        <li onclick="callExpandApi(${d.id} , 'causedEvent' , 1); return false;"><a>1</a></li>
                        <li onclick="callExpandApi(${d.id} , 'causedEvent' , 2); return false;"><a>2</a></li>
                        <li onclick="callExpandApi(${d.id} , 'causedEvent' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Running Process</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'runningProcess' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Sent Email</a>
                   <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'sentEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Received Email</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'receivedEmail' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
    
                <li><a>Process Communicated</a>
                    <ul class="submenusub">
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 1); return false;"><a>1</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 2); return false;"><a>2</a></li>
                        <li  onclick="callExpandApi(${d.id} , 'processCommunicated' , 3); return false;"><a>3</a></li>
                    </ul>
                </li>
              </ul>
    
            </li> */}