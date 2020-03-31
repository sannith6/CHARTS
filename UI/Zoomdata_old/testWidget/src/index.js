import './index.css';
import { find, findIndex, sortBy } from 'lodash';
/**
 * Global controller object is described on Zoomdata knowledge base
 * @see https://www.zoomdata.com/developers/docs/custom-chart-api/controller/
 */

/* global controller */

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/creating-chart-container/
 */
const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-container');
controller.element.appendChild(chartContainer);

//var todayCount = Math.floor(100 + Math.random() * 900);
//var yesterdayCount = Math.floor(100 + Math.random() * 900);

/*

const yesterdayContainer = document.createElement('p');
yesterdayContainer.classList.add('yesterday-count-container');
yesterdayContainer.innerHTML = "<span class='yesterday-total-count-text'>Yesterday</span><br/><span class='yesterday-total-count-total'>" + comparisonValue + "</span>";
chartContainer.appendChild(yesterdayContainer);

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/updating-queries-axis-labels/
 */
// controller.createAxisLabel({
//     picks: 'Group By',
//     orientation: 'horizontal',
//     position: 'bottom',
//     popoverTitle: 'Group'
// });



controller.createAxisLabel({
    picks: 'Metric',
    orientation: 'horizontal',
    position: 'bottom'
});

controller.createAxisLabel({
    picks: 'comparision-metric',
    orientation: 'horizontal',
    position: 'bottom'
});


/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */

const metricAccessor = controller.dataAccessors.Metric;
const comparisonMetricAccessor = controller.dataAccessors['comparision-metric'];
// const comparisonMetricAccessor = controller.dataAccessors['comparision-metric'];

var linkMap = {
    "Access Notables":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed4d5754e8702f7a8ad063?__target=embedded&key=NLGLqlDEtC",
    "EndPoint Notables":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed506154e8702f7a8ad0c2?__target=embedded&key=fTylI2ireZ",
    "Identity Notables":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed53e654e8702f7a8ad11e?__target=embedded&key=Apc9IqQ4EO",
    "Outliers UEBA":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed54e854e8702f7a8ad1cd?__target=embedded&key=RrhYhtR83x",
    "Network Notables":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed552b54e8702f7a8ad1d5?__target=embedded&key=4kV97hPBon",
    "Threat Notables":"http://10.10.150.30:8080/zoomdata/visualization/5b2b9d19bd8cd1acdde7a213+5bed561154e8702f7a8ad249?__target=embedded&key=BYMhTgBiAk"
}

controller.update = data => {
    console.log('hello');
    console.log('Notables DATA>>>>>', data)
    var typeName = data[0].group[0]
    const datum = data[0];
    const metricValue = metricAccessor.raw(datum);
    const comparisonValue = comparisonMetricAccessor.raw(datum);
    console.log(metricValue, comparisonValue,typeName,linkMap[typeName]);

    var diffOverDay = metricValue - comparisonValue;

    const todayText = document.createElement('div');
    todayText.classList.add('today-total-text');
    todayText.innerText = "Total Count";
    chartContainer.appendChild(todayText);

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container');

    const todayTotalCount = document.createElement('div');
    todayTotalCount.classList.add('today-total-count-total');
    if (metricValue >= 100) {
        //todayTotalCount.style.color = 'orange'
    }
    todayTotalCount.innerText = metricValue;
    mainContainer.appendChild(todayTotalCount);

    const updateContainer = document.createElement('div');
    updateContainer.classList.add('udpate-container');

    const directionArrow = document.createElement("div");
    if (metricValue < comparisonValue) {
        directionArrow.classList.add('arrow-down');
        directionArrow.innerHTML = `<a href="${linkMap[typeName]}" target="_blank"><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAABhlij+3J2+AAAAAnRSTlMA/1uRIrUAAAFrSURBVHic7dU9coMwEIZhaSgodQQdRUeDm0VH0REoKYg2rD797Mo4RaoU1owz5gmJX5u1MOZ/L0u0K1iJkgJHdCjwD3AqCETXBz7wN1j3Bjbht0cDh7N43AA+87Hlp4BQxnmh3GCjaMpUN8B8rzz3BSzgHvMIWDDfnr3AivkOEi7AAXCAjU8scP8xlxE/D/VHhQy4zyUAAWjAzmAFRIZFQGJYBRwM7jc4GXwFfvUr4FHCGDLDJoAYqAKfSV9E30R4t+V/tXXiIxzrwIc8VirXRaxYrpxYu6mpbZWLvY3j/AxhAOZDlGFjEmXYukQZZkyURWN02Y65nLpESB5jLDMeoJe1DbOXtS21l6UKvSxW6GV7+8ZMXb0sdwg6o4ec78Hprl6WOiy6q5f1rlY2jlGWBQTdVUPk/cTpjAdYdVctiwLs1GXM1FXKsoIw71J+vs+93Bpfbp4vsOiuhxuwmbrusjxBuCbw5wRLe5EfJL/65/u290IAAAAASUVORK5CYII=' style='height: 25px; width: 26px; transform: rotate(-45deg);' /></a>`;
    } else if (metricValue > comparisonValue) {
        directionArrow.classList.add('arrow-up');
        //  directionArrow.innerHTML = "&#x2197;";

        directionArrow.innerHTML = `<a href="${linkMap[typeName]}" target="_blank"><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAADNNycJHamDAAAAAnRSTlMA/1uRIrUAAAFaSURBVHic7dVNbsMgEIbhIBYsOQJH4Wj4ZvVRcgQvvXDztcPnKTPkR2ql7oLkyHkW4Q0m4XL584jrBGWfoB4TtNsEgH8fgMVPAvhpEnB9DRnYfBfgyyrgyxrgywBfFgRsWRSwZUnAhmSB7RUUAVtWBWxZE7BlgC8LhFEWCaMsEUZZJoyQQtifQyWMskYYZYAvCwpaFhW0LCloWVbQsqKgIVXheAZNQcvwM6YuLYsDVt+lZXnA5ru0rA44fIaG3AHMmLpYFi2svotl2cLmu1jWuz6ATy3rGd96aIjATaAZOCqvDv2zBMqZ2mcTyK/gKpAMrALRwCIQDPBXOeBGaIQm9/V8OWEnFJZWWYUOmd+2yjp1SIRiYecSroTIJUyy+B0CFznJXB0uhChzEVp/LkFuCZV7qu0KhbuubgqZ+yMtCkF3/4M/pTe84VdQ5nMuPwB/NN4dnncH8D+PL+Mz+eGCGPAXAAAAAElFTkSuQmCC' style='height: 25px; width: 26px; transform: rotate(45deg);' /></a>`
    } else {
        updateContainer.style.display = 'none';
    }

    const chartDescriptorText = document.createElement('div');
    chartDescriptorText.classList.add('chart-descriptor-text');
    diffOverDay = diffOverDay > 0 ? `+${diffOverDay}` : diffOverDay;
    chartDescriptorText.innerHTML = diffOverDay;
    chartDescriptorText.style.color = diffOverDay > 0 ? '#cd3727' : '#619628';


    updateContainer.appendChild(directionArrow);
    updateContainer.appendChild(chartDescriptorText);

    mainContainer.appendChild(updateContainer);
    chartContainer.appendChild(mainContainer);

    //const yesterdayCountTotal = document.createElement('div');
    //yesterdayCountTotal.classList.add("yesterday-count-total");
    //yesterdayCountTotal.innerHTML = comparisonValue;

    //   const thresholdTextField = document.createElement('div')
    // thresholdTextField.innerHTML = `<input type='number' id="threshold${metricValue}${comparisonValue}" name='thresholdValue' placeholder='Threshold Value' min='0' /><input type='button' value='Submit' id='submitBtn${metricValue}${comparisonValue}' />`
    //      chartContainer.appendChild(thresholdTextField)

    // const yesterdayContainer = document.createElement('div');
    //yesterdayContainer.classList.add("yesterday-count-container");


    //chartContainer.appendChild(yesterdayContainer);
    //yesterdayContainer.appendChild(chartDescriptorText);
    //yesterdayContainer.appendChild(directionArrow);
    //yesterdayContainer.appendChild(yesterdayCountText)

    //      document.getElementById(`submitBtn${metricValue}${comparisonValue}`).onclick = function() {
    //              let threshold = document.getElementById(`threshold${metricValue}${comparisonValue}`).value
    //console.log(threshold)
    //console.log(metricValue)
    //console.log(todayTotalCount.style.color)
    //              if (metricValue >= threshold){
    //                      todayTotalCount.style.color = 'orange'
    //              }else{
    //                      todayTotalCount.style.color = 'black'
    //              }
    //      }

};
