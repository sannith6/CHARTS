import styles from './index.css';

/**
 * Global controller object is described on Zoomdata knowledge base
 * @see https://www.zoomdata.com/developers/docs/custom-chart-api/controller/
 */

/* global controller */

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/creating-chart-container/
 */
const chartContainer = document.createElement('div');
chartContainer.classList.add(styles.chartContainer);
controller.element.appendChild(chartContainer);

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/updating-queries-axis-labels/
 */
controller.createAxisLabel({
    picks: 'Group By',
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Group'
});

controller.createAxisLabel({
    picks: 'Metric',
    orientation: 'horizontal',
    position: 'bottom'
});

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */
controller.update = data => {
    const groupAccessor = controller.dataAccessors['Group By'];
    const metricAccessor = controller.dataAccessors['Metric'];

    chartContainer.textContent = data.map(item => {
        return [groupAccessor.raw(item), metricAccessor.raw(item)];
    }).join('\r\n');


    var request = new XMLHttpRequest();
    request.open('GET', 'https://jsonplaceholder.typicode.com/todos', true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            console.log(JSON.parse(this.response), "data here")
        }
    };
    request.send();
};
