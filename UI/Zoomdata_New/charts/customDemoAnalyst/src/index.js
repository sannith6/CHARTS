import './index.css';
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


var getLink = function (param, value) {
    // var link = `http://10.10.110.243:8081/?for=${value}&graph=demo_g2`
    var link = `http://ats-384.mitre.org:8005/?for=${value}&graph=g`
    return link
}

var getDashboard = function (param, value) {

    var newkey
    if (param === "IP SRC ADDR") {
        newkey = "ip_src_addr"
    }
    else if (param === "Dst IP") {
        newkey = "ip_dest_addr"
    }
    else {
        newkey = "source.type"
    }


    var dashboardLink = `http://10.10.110.243:8083/?${newkey}=%22${value}%22`
    return dashboardLink
}



var contextMenu = function (m, k) {
    return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${getLink(m, k)}">Threat Hunt</a></li>
    </ul>`
    // <li id="selectLinked" ><a tabindex="-1" href="${getDashboard(m, k)}"">Search</a></li>
}


// function sortFunction(n) {
//     console.log(n, "n")
// }

function sort_table(tableId, columnNumber) {

    console.log(columnNumber, 'column number')

    var tableElement = document.getElementById(tableId);
    [].slice.call(tableId.tBodies[0].rows).sort(function (a, b) {
        return (
            a.cells[columnNumber - 1].textContent > b.cells[columnNumber - 1].textContent ? -1 :
                a.cells[columnNumber - 1].textContent < b.cells[columnNumber - 1].textContent ? 1 :
                    0);
    }).forEach(function (val, index) {
        tableId.tBodies[0].appendChild(val);
    });
}




function searchFunction(param) {
    console.log(param.value, "checked")

    // Declare variables 
    var input, filter, table, tr, td, i, j;
    input = param.value;
    filter = input.toUpperCase();
    console.log(filter, "filter 1")
    table = document.getElementById("table_id");
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



function getDevicesData(response) {
    if (response.length !== 0) {

        var headers = ''
        var clickableTD = ["IP SRC ADDR", "Userid", "Dst IP"]
        var shodanItems = ["Shodan ISP", "Shodan Hostname", "Shodan Country", "Shodan Port", "Shodan Product"]

        Object.keys(response[0]).map((k) => !shodanItems.includes(k) && (headers += `<th>${k}</th>`))

        headers += `<th>Shodan</th>`
        headers += `<th>Actions</th>`


        var body = ''
        response.map((k, i) => {
            body += `<tr id="row${i}">`

            Object.keys(k).map((m) => {
                if (clickableTD.includes(m)) {
                    !shodanItems.includes(m) && (body += `<td class="contextMenulist">${contextMenu(m, k[m])}${k[m]}</td>`)
                }
                else {
                    !shodanItems.includes(m) && (body += `<td>${k[m]}</td>`)
                }
            })

            // console.log(`${k[shodanItems[0]]}`,
            //     `${k[shodanItems[1]]}`,
            //     `${k[shodanItems[2]]}`,
            //     `${k[shodanItems[3]]}`,
            //     `${k[shodanItems[4]]}`, "shodan values")

            if (`${k[shodanItems[0]]}` != "-" || `${k[shodanItems[1]]}` != "-" || `${k[shodanItems[2]]}` != "-" || `${k[shodanItems[3]]}` != "-" || `${k[shodanItems[4]]}` != "-") {
                body += `<td>
                                <button class="createShodanView removeBorderRadius" style="padding: 5px;">
                                    <input type="hidden" class=shodanText" value="${k[shodanItems[0]]}" > 
                                    <input type="hidden" class=shodanText" value="${k[shodanItems[1]]}">
                                    <input type="hidden" class=shodanText" value="${k[shodanItems[2]]}">
                                    <input type="hidden" class=shodanText" value="${k[shodanItems[3]]}">
                                    <input type="hidden" class=shodanText" value="${k[shodanItems[4]]}">
                                    <img alt="Create Ticket" style="height:16px ;padding-left: 3px;" src="${viewMore}"/>
                                </button>
                        </td>`
            }
            else {
                body += `<td> - </td>`
            }

            // body += `<td>${k[shodanItems[0]]}<BR>${k[shodanItems[1]]}</td>`

            body += `<td><button class="createTicket removeBorderRadius"><img alt="Create Ticket" style="height:30px" src="${ticketImage}"/></button></td>`
            body += '</tr>'
        })

        var view = `
               <div>
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: none";>
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <span ><b>Shodan Details</b></span>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <div><b>Shodan ISP :</b> <span id="shodanisp"></span> </div>
                                    <div><b>Shodan Hostname :</b> <span id="shodanhost"></span> </div>
                                    <div><b>Shodan Country :</b> <span id="shodancountry"></span> </div>
                                    <div><b>Shodan Product :</b> <span id="shodanproduct"></span> </div>
                                    <div><b>Shodan Port :</b> <span id="shodanport"></span> </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary"
                                        data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="inputdiv">
                        <input type="search" class="universal" id="searchbar" placeholder= "Search"/>
                    </div>

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
    `

        chartContainer.innerHTML = view
        addOnClickHandler()
    }
}

// function reduceDataSource(response) {
//     console.log(response, "new response")
//     var reducedData = []
//     response.map((k) => {
//         // if (reducedData.length > 0) {
//         //     var elm = reducedData.filter((t) => t["IP SRC ADDR"] === k["IP SRC ADDR"])
//         //     if (elm.length === 0) reducedData.push(k)
//         // } else {
//             reducedData.push(k)
//         // }
//     })
//     return reducedData
// }

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

function shodanModal(items) {
    // console.log(items[8].firstChild.firstChild.value ,"value")
    console.log(items[8].childNodes[1], "d[0].")
    $('#exampleModal').modal('show')

    $("#shodanisp").text(items[8].childNodes[1].children[0].value)
    $("#shodanhost").text(items[8].childNodes[1].children[1].value)
    $("#shodancountry").text(items[8].childNodes[1].children[2].value)
    $("#shodanport").text(items[8].childNodes[1].children[3].value)
    $("#shodanproduct").text(items[8].childNodes[1].children[4].value)
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
    var x = document.getElementsByClassName('createTicket').length
    for (var i = 0; i < x; i++) {
        document.getElementsByClassName('createTicket')[i].onclick = function (e) {
            console.log("create ticket View")
            let childNodes = e.currentTarget.parentNode.parentNode.childNodes
            sendForm(childNodes)
        }
    }

    var y = document.getElementsByClassName('createShodanView').length
    for (var i = 0; i < y; i++) {
        document.getElementsByClassName('createShodanView')[i].onclick = function (e) {
            let childNode = e.currentTarget.parentNode.parentNode.childNodes
            shodanModal(childNode)
        }
    }

    var z = document.getElementsByClassName('contextMenulist').length
    for (var i = 0; i < z; i++) {
        document.getElementsByClassName('contextMenulist')[i].onclick = function (e) {
            // console.log("opened context menu")
            showMenu(e.target)
        }
    }

    var a = document.getElementsByClassName('universal').length
    for (var i = 0; i < a; i++) {
        document.getElementsByClassName('universal')[i].onkeyup = function (e) {
            // console.log(childNodes, "child")
            searchFunction(e.target)
        }
    }

    // var b = document.getElementsByClassName('tableTd').length
    // for (var i = 0; i < b; i++) {
    //     document.getElementsByClassName('tableTd')[i].onclick = function (e) {
    //         sortFunction(e.target.cellIndex)
    //     }
    // }

    var c = document.getElementsByClassName('tableHead').length
    for (var i = 0; i < c; i++) {
        document.getElementsByClassName('tableHead')[i].onclick = function (e) {
            var tId = document.getElementById('table_id')
            sort_table(tId, e.target.cellIndex + 1)
        }
    }
}


const highestScore = {
    "JohnWhiteDistVPN1GB@sstech.us": '96',
    "JohnWhiteLateralMove@sstech.us": '94',
    "JohnWhiteDistVPN1GB@local": '96',
    "JohnWhiteLateralMove@local": '94',
    "JohnWhiteDistVPN1GB": '96',
    "JohnWhiteLateralMove": '94',
    "news@baidu1.com": '92',
    "103.235.46.39": '84',
    "192.168.0.85": '89',
    "192.168.0.103": '90',
    "192.168.0.70": '88',
}

const randomScore = ['69', '66', '70', '68', '47', '51', '63', '63', '65', '69', '65', '70', '68', '62', '61', '66']
const randomUserID = ["ethan.hunt", "john.wick", "kevin.fiege", "clark.ethan", "freddie.king", "ben.snow", "ron.hunt", "ben.kent", "jon.hunt", "brodas.clay", "arthur.rich", "jerry.gordon", "king.ben", "richie.rich", "steve.hunt", "mark.stark"]


var counter = -1
function getRandomName(index) {
    counter += 1
    // console.log(randomUserID[counter % 16],index,"Index")
    return randomUserID[counter % 16]
}

function getRandomScore(index) {
    counter += 1
    // console.log(randomUserID[counter % 16],index,"Index")
    return randomScore[counter % 16]
}


function getRandomScoreuser(index) {
    counter += 1
    // console.log(randomUserID[counter % 16],index,"Index")
    return randomScore[counter % 16]
}





controller.update = data => {
    console.log("DATA >>>>", data)
    console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var response = []
        console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
            console.log(item[10], "username test")
            if (item[9] != null) {
                if (!highestScore.hasOwnProperty(item[4]) && !highestScore.hasOwnProperty(item[10])) {
                    scoreIp = getRandomScore(index),
                        scoreUser = getRandomScoreuser(index)
                } else {
                    if (highestScore.hasOwnProperty(item[4]) && !highestScore.hasOwnProperty(item[10])) {
                        scoreUser = getRandomScoreuser(index),
                            scoreIp = highestScore[item[4]]
                    }
                    else if (highestScore.hasOwnProperty(item[10]) && !highestScore.hasOwnProperty(item[4])) {
                        scoreIp = getRandomScore(index),
                            scoreUser = highestScore[item[10]]
                    }
                    else {
                        scoreUser = highestScore[item[10]]
                        scoreIp = highestScore[item[4]]
                    }
                }


                response.push({
                    "Timestamp": item[3],
                    "Alerts Description": "Exceeded Score Threshold",
                    "IP SRC ADDR": item[4],
                    "Score_IP": scoreIp,
                    "Source Type": item[9],
                    "Userid": item[10] === null ? getRandomName(index) : item[10],
                    "Score_User": scoreUser,
                    "Dst IP": item[1] === null ? '-' : item[1],
                    "Shodan ISP": item[6] === null ? '-' : item[6],
                    "Shodan Hostname": item[5] === null ? '-' : item[5],
                    "Shodan Country": '-',
                    "Shodan Port": item[7] === null ? '-' : item[7],
                    "Shodan Product": item[8] === null ? '-' : item[8],
                })
            }

        })

        // response = reduceDataSource(response)
        getDevicesData(response)
    }
};