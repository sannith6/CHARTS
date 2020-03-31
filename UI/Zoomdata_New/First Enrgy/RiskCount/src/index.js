import './index.css';
import icon from './icon.png'
import arrowdown from './arrow-down.png'
import arrowup from './arrow-up.png'

import { find, findIndex, sortBy } from 'lodash';


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
var a;
var b;
var c;
var arrowIcon;


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
    return s
}


function getDevicesData(response) {
    if (response.length !== 0) {
        console.log(response, "responese")

        response.map((item, i) => {
            a = item.Today
            b = item.Today - item.Yesterday
            c = item.Yesterday
        })


        if (a > c) {
            arrowIcon = arrowup
        }
        else {
            arrowIcon = arrowdown
        }

        var view = `
               <div class="maindiv3">
                 <div style="width:200px;position:relative;height:115px">
                    <div class="chartTitle3">Risk scores</div>
                    <div class="innerdiv">
                        <p>${a}</p>
                        <div class="diifrencedivgreen">
                            ${b}+
                        </div>
                        <img alt="Alertarrow" style="height:20px;margin-top:25px" src="${arrowIcon}"/>
                    </div>
                  </div>
                  <div>
                     <img alt="Alert" style="height:90px;padding:5px" src="${icon}"/>
                  </div>
               </div>
    `

        chartContainer.innerHTML = view
    }
}


controller.update = data => {
    console.log("DATA >>>>", data)
    console.log("DATA >>>>", JSON.stringify(data))
    if (data.length > 0) {
        var reducedDataSource = data
        var response = []
        console.log('reducedData >> ', reducedDataSource)
        reducedDataSource.map((item, index) => {
            response.push({
                "Today": item[0],
                "Type": item[1],
                "Yesterday": item[2],
            })
        })
        getDevicesData(response)
    }
};