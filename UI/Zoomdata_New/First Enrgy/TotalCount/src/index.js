import './index.css';
import { find, findIndex, sortBy } from 'lodash';

const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-container');
controller.element.appendChild(chartContainer);

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


const metricAccessor = controller.dataAccessors.Metric;
const comparisonMetricAccessor = controller.dataAccessors['comparision-metric'];

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
};
