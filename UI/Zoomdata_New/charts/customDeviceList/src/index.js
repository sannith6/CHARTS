import './index.css';
import './tabs.css';
import { find, findIndex, sortBy } from 'lodash';


const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-containerTable');
controller.element.appendChild(chartContainer);

controller.query
    .set(['aggregate'], false)
    .unset(['aggregateFilters'])
    .set(['limit'], 10000)
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
    // console.log("SORTED FIELDS >>>>>> ", sortedFields, controller.getAllFields(), controller.variables.listall)

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
    return s
}


var getLink = function (param, value) {
    var link = `http://10.10.110.243:8081/?for=${value}&graph=fe_2`
    return link
}


var contextMenu = function (type, m, k) {
        return `<ul class="menu" ><li id="selectLinked" ><a tabindex="-1" href="${getLink(m, k)}">Threat Hunt</a></li></ul>`
}



function searchFunction(param, tableid) {
    // console.log(param.value, tableid, "checked")

    // Declare variables 
    var input, filter, table, tr, td, i, j;
    input = param.value;
    filter = input.toUpperCase();
    // console.log(filter, "filter 1")
    table = document.getElementById(tableid);
    // console.log(table, "table 1")

    tr = table.getElementsByTagName("tr");
    // console.log(tr, "table 1")

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        // console.log(td, "table td")
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
        var clickableTD = ["Source IP Address" , "Hostname"]
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


        var view = `
               <div>
                    <div class="inputdiv">
                        <input type="search" class="universal" id="searchbar" placeholder= "Search"/>
                    </div>
                          
                    <table class="table tabeldash" id="table_id">
                        <thead style="background-color:black; color: white;">
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
    // console.log("DATA >>>>", data)
    // console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var response = []
        var UserResponse = []
        // console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
                response.push({
                    "Event Time": item[0] ? item[0] :'-' ,
                    "Source IP Address": item[1] ? item[1] :'-' ,
                    "Hostname": item[5] ? item[5] :'-' ,
                    "User ID": item[2]? item[2] :'-' ,
                    "Image":item[6] ? item[6] :'-' ,
                    "Category": item[4] ? item[4] :'-' ,
                })

        })

        getDevicesData(response)
    }
};