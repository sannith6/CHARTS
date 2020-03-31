//Drill Down Function
function getDrilldowndata(newData) {
    d3.select('.legends').selectAll('*').remove();
    $(".loadertest").html(loaderdiv);
    $("#universalsearch").val('');

    localStorage.setItem('id', newData.id);
    console.log("ID Stored: ", localStorage.getItem("id"))
    var request = new XMLHttpRequest();
    var url = `${rootUrl}/generate_graph?id=${newData.id}&graph=${graphVar}`
    // Open a new connection, using the GET request on the URL endpoint


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

// Universal search
$('.search-label').click(function () {
    $(".loadertest").html(loaderdiv);
    localStorage.removeItem('id')
    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();
    var searchVal = document.getElementById('universalsearch').value
    console.log(searchVal, "search val")
    var API_URL;
    if (searchVal.includes("http://")) {
        API_URL = searchVal;
    }
    else {
        localStorage.setItem('searchVal', searchVal);
        API_URL = `${rootUrl}/search_for?by=${searchVal}&exact=true&graph=${graphVar}`;
    }

    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', API_URL, true)


    if(SessionArray.length !== 0){
            document.getElementById('backBtn').style.display = "inline"
            document.getElementById('forwardBtn').style.display = "inline"
    }

    SessionPointer = SessionPointer + 1;

      if(SessionArray.length === SessionPointer){
        document.getElementById('forwardBtn').style.display = "none"
    }


    if(SessionPointer !== SessionArray.length){
        SessionArray.splice(SessionPointer, 0, API_URL);
    }else{
        SessionArray.push(API_URL)
    }



    // SessionPointer = SessionPointer + 1;
    // SessionArray.splice(SessionPointer, 0, API_URL);
    // SessionArray.push(API_URL)
    // SessionPointer = SessionPointer + 1;

    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            var checkData = JSON.parse(this.response)
            if (checkData.data.links.length > 0) {
                console.log(JSON.parse(this.response), this.response.link.length, "data here")
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            }
            else {
                $('#exampleModal').modal('show')
                $('#errorDes').text('No data found');
            }
        }
    };
    request.send();
})

// Source Filter 
function checkBoxValidation() {
    $(".loadertest").html(loaderdiv);
    let link;

    let activeSources = []
    $('#semanticSource').prop("checked") && activeSources.push('sepc')
    $('#watchgSource').prop("checked") && activeSources.push('watchguard')
    $('#windowsSource').prop("checked") && activeSources.push('windows')
    $('#sysmon').prop("checked") && activeSources.push('sysmon')
    $('#msExchange').prop("checked") && activeSources.push('msexchange')

    console.log(activeSources)
    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();


    var location = window.location.href;
    var url = new URL(location);
    var search_for = url.searchParams.get("for");

    console.log(search_for ,"search_for")


    if (url.searchParams.get("graph")) {
        graphVar = url.searchParams.get("graph");
    }
    
    if (search_for !== null) {
        link = `${rootUrl}/search_for?by=${search_for}&data_source_name=${activeSources}&graph=${graphVar}`
    }
    else {
        let sessionSDate = (localStorage.getItem('startDate'));
        let sessionEDate = (localStorage.getItem('endDate'));
        if (sessionSDate && sessionEDate) {
            sessionSDate = sessionSDate.substr(0, 24)
            sessionEDate = sessionEDate.substr(0, 24)
        }
        console.log("selected dates ", sessionEDate, sessionSDate)

        let sessionId = localStorage.getItem('id')
        let searchVal = document.getElementById('universalsearch').value
        if (sessionSDate && sessionEDate) {
            if (sessionId != null) {
                link = `${rootUrl}/generate_graph?id=${sessionId}&startTime=${sessionSDate}&endTime=${sessionEDate}&data_source_name=${activeSources}&graph=${graphVar}`
            }
            else if (searchVal != "") {
                link = `${rootUrl}/search_for?by=${searchVal}&exact=true&startTime=${sessionSDate}&endTime=${sessionEDate}&data_source_name=${activeSources}&graph=${graphVar}`
            }
            else {
                console.log("Error")
                $('#exampleModal').modal('show')
                $('#errorDes').text('No data found');

            }
        }
        else {
            if (sessionId != null) {
                link = `${rootUrl}/generate_graph?id=${sessionId}&data_source_name=${activeSources}&graph=${graphVar}`
            }
            else if (searchVal != "") {
                link = `${rootUrl}/search_for?by=${searchVal}&exact=true&data_source_name=${activeSources}&graph=${graphVar}`
            }
            else {
                console.log("Error")
                $('#exampleModal').modal('show')
                $('#errorDes').text('No data found');
            }
        }
    }
    console.log(link)


    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', link, true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            console.log(JSON.parse(this.response), "data here")
            getData(JSON.parse(this.response))
            populateCounter(JSON.parse(this.response))
        }
    };
    request.send();
}


// Calling Checkbox source filter
$('#filterSources').click(function () {
    checkBoxValidation()
})


// Date Filter function
function dateFilter() {
    $(".loadertest").html(loaderdiv);
    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();
    let sessionSDate = (localStorage.getIsearch_forsearch_forsearch_fortem('startDate'))
    let sessionEDate = (localStorage.getItem('endDate'))
    let sessionId = localStorage.getItem('id')
    var searchVal = document.getElementById('universalsearch').value


    if (sessionSDate && sessionEDate) {
        sessionSDate = sessionSDate.substr(0, 24)
        sessionEDate = sessionEDate.substr(0, 24)
    }
    else {
        console.log("no session date")
    }

    console.log(sessionSDate, sessionEDate, sessionId, " are sessions")
    if (sessionSDate && sessionEDate) {
        let link;
        if (sessionId != null && searchVal == "") {
            link = `${rootUrl}/date_filter?id=${sessionId}&startTime=${sessionSDate}&endTime=${sessionEDate}&graph=${graphVar}`
        }
        else {
            link = `${rootUrl}/search_for?by=${searchVal}&exact=true&startTime=${sessionSDate}&endTime=${sessionEDate}&graph=${graphVar}`
        }

        //Search val null condition to be added

        console.log(link)

        var request = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', link, true)
        request.setRequestHeader("cache-control", "no-cache");
        request.setRequestHeader('Content-Type', 'application/json');

        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

        request.onload = function () {
            if (this.readyState == this.DONE) {
                $(".loadertest").html('');
                console.log(JSON.parse(this.response), "data here")
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            }
        };
        request.send();
    }
}

//Recent Time filters
$("#recentTimeFilter").click(function () {
    $(".loadertest").html(loaderdiv);
    d3.select('.cichart').selectAll('*').remove();
    d3.select('.legends').selectAll('*').remove();

    let sessionId = localStorage.getItem('id')
    var searchVal = document.getElementById('universalsearch').value

    console.log(sessionId, "Time filter id")

    var symbol = $("#timeFiltersymbol option:selected").val();
    var time = $("#inputTimeFilter").val();


    if (symbol !== "" && time !== "") {
        let link;
        if (sessionId != null && searchVal == "") {
            link = `${rootUrl}/get_recent_data?&graph=${graphVar}&id=${sessionId}&type=${symbol}&range=${time}`
        }
        else {
            link = `${rootUrl}/get_recent_data?&graph=${graphVar}&by=${searchVal}&type=${symbol}&range=${time}`
        }

        console.log(link, "link")

        var request = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', link, true)
        request.setRequestHeader("cache-control", "no-cache");
        request.setRequestHeader('Content-Type', 'application/json');

        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

        request.onload = function () {
            if (this.readyState == this.DONE) {
                $(".loadertest").html('');
                console.log(JSON.parse(this.response), "data here")
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            }
        };
        request.send();
    }
})

// Calling Bubble Context menu Api Function here
function callBubbleApi(id, hops) {
    $(".loadertest").html(loaderdiv);
    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', `${rootUrl}/get_bubble_data?id=${id}&graph=${graphVar}`, true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            var datalength = JSON.parse(this.response)
            console.log(JSON.parse(this.response), "data here")
            getBubbleData(JSON.parse(this.response))
        }
    };
    request.send();
}


// User Process collapse api
function callCollapseApi(id, userUrl) {

    console.log(userUrl)
    $(".loadertest").html(loaderdiv);

    var request = new XMLHttpRequest();

    var newUrl = `${rootUrl}/collapse_data?collapse_by=${userUrl}&id=${id}&graph=${graphVar}`


    // Open a new connection, using the GET request on the URL endpoint
    // request.open('GET', `${rootUrl}/collapse_user_process?graph=${graphVar}&id=${id}`, true)

           if(SessionArray.length !== 0){
                    document.getElementById('backBtn').style.display = "inline"
                    document.getElementById('forwardBtn').style.display = "inline"
            }
            SessionPointer = SessionPointer + 1;

            if(SessionArray.length === SessionPointer){
                document.getElementById('forwardBtn').style.display = "none"
            }

            if(SessionPointer !== SessionArray.length){
                SessionArray.splice(SessionPointer, 0, newUrl);
            }else{
                SessionArray.push(newUrl)
            }

    request.open('GET', newUrl, true)

    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            var datalength = JSON.parse(this.response)
            if (datalength.data.links.length > 0) {
                console.log(JSON.parse(this.response), "data here")
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            }
            else {
                  $('#exampleModal').modal('show')
                  $('#errorDes').text('No data found');
            }
        }
    };
    request.send();
}

function run_gremlin_query() {
    var params = document.getElementById('apiCall').value
    console.log(params)
    $(".loadertest").html(loaderdiv);
    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', `http://10.10.110.198:8000/run_gremlin_query?&query=${params}`, true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            $(".loadertest").html('');
            var datalength = JSON.parse(this.response)
            if (datalength.data.links.length > 0) {
                console.log(JSON.parse(this.response), "data here")
                getData(JSON.parse(this.response))
                populateCounter(JSON.parse(this.response))
            }
            else {
                 $('#exampleModal').modal('show')
                 $('#errorDes').text('No data found');
            }
        }
    };
    request.send();
}


function callMultipleCollapseApi(param) {
    var username = ''
    var URL = ''
    var process = ''

    if (clickedObjects.length === 0) {
         $('#exampleModal').modal('show')
         $('#errorDes').text(`Please select multiple nodes using CLTR+Click for collapse ${param}`);
    }
    else {
        $(".loadertest").html(loaderdiv);

        var request = new XMLHttpRequest();

        // Open a new connection, using the GET request on the URL endpoint


        clickedObjects.map((item, i) => {
            if (item.node_label === 'user') {
                username = item.userName
            }
            if (item.node_label === 'URLs') {
                URL = item.URL
            }
            if (item.node_label === 'process') {
                process = item.fileName
            }
        })

        var API = ''

        if (param === 'collapse_user_url_process') {
            console.log(username, URL)
            if (username != "" && URL != '') {
                API = `${rootUrl}/collapse_data?collapse_by=${param}&username=${username}&URL=${URL}&graph=${graphVar}`
            }
            else {
                $('#exampleModal').modal('show')
                $('#errorDes').text('For calling Collapse User->URL-Process API, you need to pass User and URL info');
            }
        }
        else if (param === 'background_process') {
            if (username != "" && URL != '' && process != '') {
                API = `${rootUrl}/collapse_data?collapse_by=${param}&username=${username}&URL=${URL}&graph=${graphVar}&process=${process}`
            }
            else {
                $('#exampleModal').modal('show')
                $('#errorDes').text('For calling Collapse User->URL->Process - Background Process API, you need to pass User, Process and URL info');
            }
        }
        else {
              $('#exampleModal').modal('show')
              $('#errorDes').text('No data found');
        }

        if (API != '') {
            if(SessionArray.length !== 0){
                    document.getElementById('backBtn').style.display = "inline"
                    document.getElementById('forwardBtn').style.display = "inline"
            }
            SessionPointer = SessionPointer + 1;

            if(SessionArray.length === SessionPointer){
                document.getElementById('forwardBtn').style.display = "none"
            }

            if(SessionPointer !== SessionArray.length){
                SessionArray.splice(SessionPointer, 0, API);
            }else{
                SessionArray.push(API)
            }

            request.open('GET', API, true)

            request.setRequestHeader("cache-control", "no-cache");
            request.setRequestHeader('Content-Type', 'application/json');

            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

            request.onload = function () {
                if (this.readyState == this.DONE) {
                    $(".loadertest").html('');
                    var datalength = JSON.parse(this.response)
                    if (datalength.data.links.length > 0) {
                        console.log(JSON.parse(this.response), "data here")
                        getData(JSON.parse(this.response))
                        populateCounter(JSON.parse(this.response))
                        clickedObjects = []
                        clickedIds = []
                    }
                    else {
                         $('#exampleModal').modal('show')
                         $('#errorDes').text('No data found');
                    }
                }
            };
            request.send();
        }
        else {
             $('#exampleModal').modal('show')
             $('#errorDes').text('Found calling undefined Collapse API. Please check');
        }
    }
}