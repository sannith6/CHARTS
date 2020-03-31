//Initializing all the variables

var width = 1024;
var height = 800;
var graphVar = "fe_2";

var zoom = d3.zoom();

var clickedObjects = []
var clickedIds = []

var loaderdiv = `<div class="loader">
                    <div class="dot"></div>
                    <div class="dot d2"></div>
                    <div class="dot d3"></div>
                    <div class="dot d4"></div>
                    <div class="dot d5"></div>
                </div>`

var topIpDiv = document.getElementById('topIpTable');

var SessionArray = []
var SessionPointer = -1

var linkColorMap = {
  "createdProcess": "#1f77b4",
  "hasIP": "#aec7e8",
  "clickdRel": "#ff7f0e",
  "otherClickdRel": "#ffbb78",
  "clicked": "#273b66",
  "userInteracted": "#98df8a",
  "assignedInternalIP": "#d62728",
  "isEvent": "#ff9896",
  "causedEvent": "#9467bd",
  "runningProcess": "#c5b0d5",
  "sentEmail": "#8c564b",
  "receivedEmail": "#c49c94",
  "processCommunicated": "#e377c2",
  "sourceWithIP": '#f7b6d2',
  "destinationWithIP": '#7f7f7f',
  "senderBelongsTo": '#c7c7c7',
  "receiverBelongsTo": '#bcbd22',
  "withIP": '#dbdb8d',
  "emailed": '#17becf',
  "gotEmail": '#9edae5',
  "resolved": '#244a3e',
  "IPsCommunicated": '#e5b72d',
  "downloadedBy": '#518561',
  "downloadedFrom": '#ee7631',
  "loggedIn": '#906cb2',
  "downloadedOn": '#d8bdf2',
  "childProcessOn": '#56ef78',
  "childProcessCreated": '#f3565a',
  "emailOriginatedFrom":"blue",
  "emailSentTo":"violet",
  "createdChildProcess": '#f3565a',
  "clickedRel":'#f3565a',
  "otherClickedRel":'#f3565a',
}

// image paths
var ipImage = '/images/ip-icon.png';
var pImage = '/images/host-icon.png';
var iconImage = '/images/icon.png';
var emailImage = '/images/Emails-icon.png';
var hostsImage = '/images/new/host-icon.png';
var processImage = 'images/process.png';
var childProcessImage = 'images/new/Child_process-icon.png'
var urlIcon = 'images/new/URLs-icon.png'


// Date function
var dateValues = {
  startDate: moment(Date()).format('YYYY-MM-DD'),
  endDate: moment(Date()).format('YYYY-MM-DD')
}

function datePickerValues(startDate, endDate) {
  localStorage.setItem('startDate', startDate)
  localStorage.setItem('endDate', endDate)
  dateValues.startDate = startDate.format('YYYY-MM-DD')
  dateValues.endDate = endDate.format('YYYY-MM-DD')
}

function checkSessionForDates() {
  let sessionStartDate = localStorage.getItem('startDate')
  let sessionEndDate = localStorage.getItem('endDate')
  if (sessionStartDate && sessionEndDate) {
    dateValues.startDate = moment(sessionStartDate).format('YYYY-MM-DD')
    dateValues.endDate = moment(sessionEndDate).format('YYYY-MM-DD')
    $('#config-demo').val(moment(sessionStartDate).format('MM[/]DD[/]YYYY') + ' - ' + moment(sessionEndDate).format('MM[/]DD[/]YYYY'))
  }
}


function getRequiredDates(dateType) {
  if (dateType === 'startDate') {
    return localStorage.getItem('startDate') && moment(localStorage.getItem('startDate')).format('MM[/]DD[/]YYYY') || moment().subtract(29, 'days')
  } else if (dateType === 'endDate') {
    return localStorage.getItem('endDate') && moment(localStorage.getItem('endDate')).format('MM[/]DD[/]YYYY') || moment()
  }
}

// end of date function 


// Populate on click results
function sideResults(d, typeOfGraph) {
  // console.log(d, "sideresults")

  if (typeOfGraph === "network") {
    document.getElementById('sourcesId').innerHTML = d.dataSourceName || "  -  "
    // document.getElementById('serverityId').innerHTML = "  -  "
    // document.getElementById('newRecordId').innerHTML = "  -  "

    if (d.node_label === '') {
      document.getElementById('valueId').innerHTML = d.userName || "  -  "
    }
    else if (d.node_label === 'IP') {
      document.getElementById('valueId').innerHTML = d.ip || "  -  "
    }
    else if (d.node_label === 'URLs') {
      document.getElementById('urlCount').innerHTML = d.URL || "  -  "
    }
    else {
      document.getElementById('valueId').innerHTML = d.fullFileName || "  -  "
    }
  }
  else {
    document.getElementById('sourcesId').innerHTML = d.properties.dataSourceName || "  -  "
    // document.getElementById('serverityId').innerHTML = "  -  "
    // document.getElementById('newRecordId').innerHTML = "  -  "

    if (d.properties.userName) {
      document.getElementById('valueId').innerHTML = d.properties.userName || "  -  "
    }
    else {
      document.getElementById('valueId').innerHTML = d.properties.ip || "  -  "
    }
  }
}


// Populate image counter
function populateCounter(data) {
  var entityCounts = {
    emailCount: 0,
    userCount: 0,
    ipCount: 0,
    processCount: 0,
    hostCount: 0,
    urlCount: 0,
    childprocessCount:0,
  }

  data.data.nodes.forEach(function (element) {
    if (element.node_label === 'IP') {
      entityCounts.ipCount += 1
    }
    else if (element.node_label === 'user') {
      entityCounts.userCount += 1
    }
    else if (element.node_label === 'process') {
      entityCounts.processCount += 1
    }
    else if (element.node_label === 'email') {
      entityCounts.emailCount += 1
    }
    else if (element.node_label === 'hosts') {
      entityCounts.hostCount += 1
    }
    else if (element.node_label === 'URLs') {
      entityCounts.urlCount += 1
    }
    else if (element.node_label === 'childProcess') {
      entityCounts.childprocessCount += 1
    }
    
  })
  document.getElementById("emailCount").innerHTML = entityCounts.emailCount
  document.getElementById("userCount").innerHTML = entityCounts.userCount
  document.getElementById("ipCount").innerHTML = entityCounts.ipCount
  document.getElementById("processCount").innerHTML = entityCounts.processCount
  document.getElementById("childprocessCount").innerHTML = entityCounts.childprocessCount
  document.getElementById("hostCount").innerHTML = entityCounts.hostCount
  document.getElementById("urlCount").innerHTML = entityCounts.urlCount
}


function stasticalAPi(id) {
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint

  request.open('GET', `${rootUrl}/get_graph_statistics?id=${id}&graph=${graphVar}`, true)

  request.setRequestHeader("cache-control", "no-cache");
  request.setRequestHeader('Content-Type', 'application/json');

  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

  request.onload = function () {
    if (this.readyState == this.DONE) {
      var dataResponse = JSON.parse(this.response)
      console.log(JSON.parse(this.response), "Statistical data here")

      // Table creation start
      if (this.response.length > 0) {

        document.getElementById('users1Hour').innerHTML = dataResponse.data.usersConnectedInHour
        document.getElementById('users24Hour').innerHTML = dataResponse.data.usersConnectedInDay

        document.getElementById('ip1Hour').innerHTML = dataResponse.data.endpointsConnectedInHour
        document.getElementById('ip24Hour').innerHTML = dataResponse.data.endpointsConnectedInDay

        var ipRow = dataResponse.data.topIPsConnected

        console.log(ipRow, "my ipRow")
        var tableBody = "<table border='1|1'>";
        tableBody += `<tr>
            <th><b>IP</b></th>
            <th><b>No of conn</b></th>
          </tr>`
        if (ipRow.length > 0) {
          for (var i = 0; i < ipRow.length; i++) {
            tableBody += "<tr>";
            tableBody += "<td>" + ipRow[i].ip + "</td>";
            tableBody += "<td>" + ipRow[i].conn + "</td>";
            tableBody += "</tr>";
          }
        }
        else {
          tableBody += "<tr>";
          tableBody += "<td>" + "No data" + "</td>";
          tableBody += "<td>" + "found" + "</td>";
          tableBody += "</tr>";
        }
        tableBody += "</table>";
        tableBody += "<hr/>";
        document.getElementById("topIpTable").innerHTML = tableBody;

        

        var freqRow = dataResponse.data.topIPsFrequency

        console.log(freqRow, "my freqRow")
        var tableBodyF = "<table border='1|1'>";
        tableBodyF += `<tr>
            <th><b>Frequency</b></th>
            <th><b>IP</b></th>
          </tr>`
        if (freqRow.length > 0) {
          for (var i = 0; i < freqRow.length; i++) {
            tableBodyF += "<tr>";
            tableBodyF += "<td>" + freqRow[i].frequency + "</td>";
            tableBodyF += "<td>" + freqRow[i].ip + "</td>";
            tableBodyF += "</tr>";
          }
        }
        else {
          tableBodyF += "<tr>";
          tableBodyF += "<td>" + "No data" + "</td>";
          tableBodyF += "<td>" + "found" + "</td>";
          tableBodyF += "</tr>";
        }
        tableBodyF += "</table>";
        document.getElementById("topFreqTable").innerHTML = tableBodyF;
        // Table creation end
      }
    }
  };
  request.send();
}


// Back and forth button logic 
document.getElementById("backBtn").onclick = function(){
    console.log(SessionArray ,"backbtn Clicked")
    console.log(SessionPointer,"SessionPointer Clicked")

    SessionPointer = SessionPointer - 1;
    var previousUrl = SessionArray[SessionPointer]

    console.log(previousUrl , "previousUrl")

        // if(previousUrl){
        //   SessionArray.push(previousUrl);
        //   SessionPointer = SessionPointer - 1;
        // }
        
            
        if(SessionPointer === -1){
          document.getElementById('backBtn').style.display = "none"
        }
         
        if(SessionArray.length !== SessionPointer){
            document.getElementById('forwardBtn').style.display = "inline"
        }

        if( previousUrl && previousUrl.includes("get_bubble_data")){
           $(".loadertest").html(loaderdiv);
            var request = new XMLHttpRequest();
            request.open('GET', previousUrl, true)

            // Defining headers
            request.setRequestHeader("cache-control", "no-cache");
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

            request.onload = function () {
                if (this.readyState == this.DONE) {
                    $(".loadertest").html('');
                    console.log(JSON.parse(this.response), "bubble data")
                    getBubbleData(JSON.parse(this.response))
                }
            };
            request.send();
        }
        else if(previousUrl){
              $(".loadertest").html(loaderdiv);
              var request = new XMLHttpRequest();
              request.open('GET', previousUrl, true)
              request.setRequestHeader("cache-control", "no-cache");
              request.setRequestHeader('Content-Type', 'application/json');

              request.setRequestHeader('Access-Control-Allow-Origin', '*');
              request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

              request.onload = function () {
                  if (this.readyState == this.DONE) {
                      $(".loadertest").html('');
                      console.log(JSON.parse(this.response), "data")
                      getData(JSON.parse(this.response))
                      populateCounter(JSON.parse(this.response))
                  }
              };
              request.send();
        }
}

document.getElementById("forwardBtn").onclick = function(){
   console.log("forwardBtn Clicked")

    console.log(SessionArray ,"backbtn Clicked")
    console.log(SessionPointer,"SessionPointer Clicked")

      SessionPointer = SessionPointer + 1;
      var nextUrl = SessionArray[SessionPointer]
      console.log(nextUrl , "nextUrl")

        if(SessionPointer ===  SessionArray.length -1 ){
          document.getElementById('forwardBtn').style.display = "none"
        }

         
        if(SessionPointer !== 0){
            document.getElementById('backBtn').style.display = "inline"
        }

        if( nextUrl && nextUrl.includes("get_bubble_data")){
           $(".loadertest").html(loaderdiv);
            var request = new XMLHttpRequest();
            request.open('GET', nextUrl, true)

            // Defining headers
            request.setRequestHeader("cache-control", "no-cache");
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

            request.onload = function () {
                if (this.readyState == this.DONE) {
                    $(".loadertest").html('');
                    console.log(JSON.parse(this.response), "bubble data")
                    getBubbleData(JSON.parse(this.response))
                }
            };
            request.send();
        }
        else if(nextUrl){
              $(".loadertest").html(loaderdiv);
              var request = new XMLHttpRequest();
              request.open('GET', nextUrl, true)
              request.setRequestHeader("cache-control", "no-cache");
              request.setRequestHeader('Content-Type', 'application/json');

              request.setRequestHeader('Access-Control-Allow-Origin', '*');
              request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

              request.onload = function () {
                  if (this.readyState == this.DONE) {
                      $(".loadertest").html('');
                      console.log(JSON.parse(this.response), "data")
                      getData(JSON.parse(this.response))
                      populateCounter(JSON.parse(this.response))
                  }
              };
              request.send();
        }
}
