import './index.css';
import './tabs.css';
import { find, findIndex, sortBy } from 'lodash';
import ticketImage from './openTicket.png'
import viewMore from './viewMore.png'
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
var scoreIp;
var scoreUser;



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


var get360Ip = function (param, value) {
    var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5d54eef19c0c775e11bad0ee?inheritSourceId=5d54e6899c0c775e11bacfad&filters=[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Ip%20Src%20Addr%22,%22path%22:%22ip_src_addr%22,%22value%22:[%22${value}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=v4vUkLu7a0`

    return link
}

var get360User = function (param, value) {
    var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5da43d449c0c7745566b47d7?inheritSourceId=5da43c199c0c7745566b4787&filters=[{%22path%22:%22userid%22,%22value%22:[%22${value}%22],%22operation%22:%22IN%22,%22editable%22:true,%22label%22:%22Userid%22}]&from=+$now_-365_day&to=+$now&timeField=timeofevent?__target=embedded&key=YxwF2fWvVC`

    return link
}

var getScoringUserView = function (param, value) {
    var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5da06c809c0c7745566b4750?inheritSourceId=5da0686c9c0c7745566b46fb&filters=[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22User%20Name%22,%22path%22:%22user_name%22,%22value%22:[%22${value}%22]}]&from=+$now_-365_day&to=+$now&timeField=timestamp?__target=embedded&key=9eiRgngUms`

    return link
}


var contextMenu = function (type, m, k) {

    if (type == 'ip') {
        return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${get360Ip(m, k)}">360 IP View</a></li></ul>`
    }
    else if (type == 'user') {
        return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${get360User(m, k)}">360 User View</a></li><li id="selectLinked" ><a tabindex="-1" href="${getScoringUserView(m, k)}"> Scoring User View</a></li></ul>`
    }
}


// function sort_table(tableId, columnNumber) {

//     console.log(columnNumber, 'column number')

//     var tableElement = document.getElementById(tableId);
//     [].slice.call(tableId.tBodies[0].rows).sort(function (a, b) {
//         return (
//             a.cells[columnNumber - 1].textContent > b.cells[columnNumber - 1].textContent ? -1 :
//                 a.cells[columnNumber - 1].textContent < b.cells[columnNumber - 1].textContent ? 1 :
//                     0);
//     }).forEach(function (val, index) {
//         tableId.tBodies[0].appendChild(val);
//     });
// }


// function sort_scoreIP() {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("table_id");
//     switching = true;
//     while (switching) {
//         switching = false;
//         rows = table.rows;
//         for (i = 1; i < (rows.length - 1); i++) {
//             shouldSwitch = false;
//             x = rows[i].getElementsByTagName("TD")[4];
//             y = rows[i + 1].getElementsByTagName("TD")[4];
//             if (Number(y.innerHTML) > Number(x.innerHTML)) {
//                 shouldSwitch = true;
//                 break;
//             }
//         }
//         if (shouldSwitch) {
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//         }
//     }
// }

// function sort_scoreUser() {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("usertable_id");
//     switching = true;
//     while (switching) {
//         switching = false;
//         rows = table.rows;
//         for (i = 1; i < (rows.length - 1); i++) {
//             shouldSwitch = false;
//             x = rows[i].getElementsByTagName("TD")[5];
//             y = rows[i + 1].getElementsByTagName("TD")[5];
//             if (Number(y.innerHTML) > Number(x.innerHTML)) {
//                 shouldSwitch = true;
//                 break;
//             }
//         }
//         if (shouldSwitch) {
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//         }
//     }
// }



function searchFunction(param, tableid) {
    console.log(param.value, tableid, "checked")

    // Declare variables 
    var input, filter, table, tr, td, i, j;
    input = param.value;
    filter = input.toUpperCase();
    console.log(filter, "filter 1")
    table = document.getElementById(tableid);
    console.log(table, "table 1")

    tr = table.getElementsByTagName("tr");
    console.log(tr, "table 1")

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        console.log(td, "table td")
        for (j = 0; j < td.length; j++) {
            let tdata = td[j];
            if (tdata) {
                if (tdata.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}




function getDevicesData(response, UserResponse) {
    if (response.length !== 0 || UserResponse.length !== 0) {

        var headers = ''
        var clickableTD = ["User", "Ip"]
        var shodanItems = ["a"]

        Object.keys(response[0]).map((k) => !shodanItems.includes(k) && (headers += `<th>${k}</th>`))


        var body = ''
        response.map((k, i) => {
            body += `<tr id="row${i}">`

            Object.keys(k).map((m) => {
                if (clickableTD.includes(m)) {
                    !shodanItems.includes(m) && (body += `<td class="contextMenulist">${contextMenu("ip", m, k[m])}${k[m]}</td>`)
                }
                else {
                    !shodanItems.includes(m) && (body += `<td>${k[m]}</td>`)
                }
            })

            body += '</tr>'
        })


        var userHeaders = ''

        Object.keys(UserResponse[0]).map((k) => !shodanItems.includes(k) && (userHeaders += `<th>${k}</th>`))


        var userbody = ''
        UserResponse.map((k, i) => {
            body += `<tr id="row${i}">`

            Object.keys(k).map((m) => {
                if (clickableTD.includes(m)) {
                    !shodanItems.includes(m) && (userbody += `<td class="contextMenulist">${contextMenu("user", m, k[m])}${k[m]}</td>`)
                }
                else {
                    !shodanItems.includes(m) && (userbody += `<td>${k[m]}</td>`)
                }
            })

            userbody += '</tr>'
        })


        var view = `
               <div>
                    <div class="inputdiv">
                        <input type="search" class="universal" id="searchbar" placeholder= "Search"/>
                    </div>

                    <div>
                        <div id="exTab2" class="tableBox">
                            <ul class="nav nav-tabs">
                                <li class="active">
                                    <a href="#1" data-toggle="tab"><b>IP Details</b></a>
                                </li>
                                <li><a href="#2" data-toggle="tab"><b>User Details</b></a>
                                </li>
                            </ul>

                            <div class="tab-content ">
                                <div class="tab-pane active" id="1">

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

                                <div class="tab-pane" id="2">

                                    <table class="table tabeldash" id="usertable_id">
                                        <thead style="background-color: #258cca;color: white;">
                                            <tr class="tableHead">
                                            ${userHeaders}
                                            </tr>
                                        </thead>
                                        <tbody class="tableBody">
                                            ${userbody}
                                        </tbody>
                                    </table>

                               </div>

                            </div>
                        </div>
                </div>

                </div>
    `

        chartContainer.innerHTML = view
        // sort_scoreIP()
        // sort_scoreUser()
        addOnClickHandler()
    }
}

function sendForm(items) {
    // console.log(items, "ITEMS")

    var idInput = items[4].firstChild.innerHTML
    var dateInput = items[0].innerHTML
    var short_description = `Need to investigate for User ID ${idInput} on Date  ${dateInput}`
    var comments = "SAMPLE COMMENTS"
    var requestBody = {
        description: comments,
        short_description: short_description
    }

    var stringifyBody = JSON.stringify(requestBody)
    var client = new XMLHttpRequest();
    client.open("post", "https://dev70697.service-now.com/api/now/table/incident");

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    //Eg. UserName="admin", Password="snistjhps24T!" for this code sample.
    // client.setRequestHeader('Authorization', 'Basic ' + btoa('admin' + ':' + 'snistjhps24T!'));
    // client.setRequestHeader('Authorization', 'Basic YWRtaW46YmlnRGF0YTEyMyQ=');

    client.setRequestHeader('Authorization', 'Basic YWRtaW46YmlnRGF0YTEyMyQh');


    client.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            let response = JSON.parse(this.response)
            // console.log(response)
            if (!response.error) {
                alert("Ticket Created Successfully")
                window.open('https://dev70697.service-now.com/nav_to.do?uri=%2Fincident_list.do%3Fsysparm_first_row%3D1%26sysparm_query%3D%26sysparm_view%3Dess', '_blank')
            }
        }
    };
    client.send(stringifyBody);
};


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
    // var x = document.getElementsByClassName('createTicket').length
    // for (var i = 0; i < x; i++) {
    //     document.getElementsByClassName('createTicket')[i].onclick = function (e) {
    //         console.log("create ticket View")
    //         let childNodes = e.currentTarget.parentNode.parentNode.childNodes
    //         sendForm(childNodes)
    //     }
    // }


    var z = document.getElementsByClassName('contextMenulisearst').length
    for (var i = 0; i < z; i++) {
        document.getElementsByClassName('contextMenulist')[i].onclick = function (e) {
            // console.log("opened context menu")
            showMenu(e.target)
        }
    }

    var a = document.getElementsByClassName('universal').length

    for (var i = 0; i < a; i++) {
        document.getElementsByClassName('universal')[i].onkeyup = function (e) {
            var activeTabId = document.getElementsByClassName('tab-pane active')[0].getAttribute("id")

            if (activeTabId === '1') {
                searchFunction(e.target, 'table_id')
            }
            else {
                searchFunction(e.target, 'usertable_id')
            }
        }
    }

    // var c = document.getElementsByClassName('tableHead').length
    // for (var i = 0; i < c; i++) {
    //     document.getElementsByClassName('tableHead')[i].onclick = function (e) {
    //         var tId1 = document.getElementById('table_id')
    //         var tId2 = document.getElementById('usertable_id')
    //         var activeTabId = document.getElementsByClassName('tab-pane active')[0].getAttribute("id")
    //         if (activeTabId === '1') {
    //             sort_table(tId1, e.target.cellIndex + 1)
    //         }
    //         else {
    //             sort_table(tId2, e.target.cellIndex + 1)
    //         }
    //     }
    // }
}


controller.update = data => {
    console.log("DATA >>>>", data)
    console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var response = []
        var UserResponse = []
        console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {

            if (item[6] === 'entity') {
                response.push({
                    "Timestamp": item[5],
                    "Time Window": item[4],
                    "Type": item[6],
                    "Ip": item[2],
                    "Score": Math.round(item[3]),
                    "As Bluecoat": Math.round(item[0]),
                    "As Wgtraffic": Math.round(item[1]),
                })
            }

            if (item[6] === 'user') {
                UserResponse.push({
                    "Timestamp": item[5],
                    "Time Window": item[4],
                    "Type": item[6],
                    "User": item[2],
                    "Score": Math.round(item[3]),
                    "As Bluecoat": Math.round(item[0]),
                    "As Wgtraffic": Math.round(item[1]),
                })
            }
        })

        getDevicesData(response, UserResponse)
    }
};