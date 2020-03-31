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




var get360User = function (param, value) {
    var link = `http://10.10.110.248:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5da43d449c0c7745566b47d7?inheritSourceId=5da43c199c0c7745566b4787&filters=[{%22path%22:%22userid%22,%22value%22:[%22${value}%22],%22operation%22:%22IN%22,%22editable%22:true,%22label%22:%22Userid%22}]&from=+$now_-365_day&to=+$now&timeField=timeofevent?__target=embedded&key=YxwF2fWvVC`

    return link
}


var contextMenu = function (m, k) {
        return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${get360User(m, k)}">360 user View</a></li></ul>`
}


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




function getDevicesData(response) {
    if (response.length !== 0) {

        var headers = ''
        var clickableTD = ["User Name"]
        var shodanItems = ["a"]

        Object.keys(response[0]).map((k) => !shodanItems.includes(k) && (headers += `<th>${k}</th>`))


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

            body += '</tr>'
        })

        var view = `
               <div>
                    <div class="inputdiv">
                        <input type="search" class="universal" id="searchbar" placeholder= "Search"/>
                    </div>

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
                searchFunction(e.target, 'table_id')
        }
    }
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
            response.push({
                "Timestamp MINUTE": item[1],
                "User Name": item[2],
                "Activity": item[3],
                "Updn Ratio": item[4],
                "Time Window": item[0],
            })
        })

        getDevicesData(response)
    }
};