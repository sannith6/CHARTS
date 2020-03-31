//360 Dashboard view
function goToUserViewDashboard(item) {
    if (item.label === 'user') {
        let username = encodeURI(item.userName)
        return `${userViewUrl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Userid%22,%22path%22:%22userid%22,%22value%22:[%22${username}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=fgxoPaHQIv`

    } else if (item.label === 'IP') {
        let IP_Address = encodeURI(item.ip)

        return `${userViewUrl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Userid%22,%22path%22:%22userid%22,%22value%22:[%22${IP_Address}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=fgxoPaHQIv`

    }
    else {
        let IP_Address = encodeURI(item.ip)

        return `${userViewUrl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Userid%22,%22path%22:%22userid%22,%22value%22:[%22${IP_Address}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=fgxoPaHQIv`

    }
}


//360 Dashboard view
function goToIPViewDashboard(item) {
    console.log(item)
    if (item.label === 'user') {
        var username = encodeURI(item.userName)

        return `${ipViewurl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Ip%20Src%20Addr%22,%22path%22:%22ip_src_addr%22,%22value%22:[%22${username}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=v4vUkLu7a0`

    } else if (item.label === 'IP') {
        var IP_Address = encodeURI(item.ip)
        console.log(IP_Address)

        return `${ipViewurl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Ip%20Src%20Addr%22,%22path%22:%22ip_src_addr%22,%22value%22:[%22${IP_Address}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=v4vUkLu7a0`
    }
    else {
        var IP_Address = encodeURI(item.ip)
        console.log(IP_Address)


        return `${ipViewurl}[{%22editable%22:true,%22operation%22:%22IN%22,%22label%22:%22Ip%20Src%20Addr%22,%22path%22:%22ip_src_addr%22,%22value%22:[%22${IP_Address}%22]}]&from=+$now_-365_day&to=+$now&timeField=event_time1?__target=embedded&key=v4vUkLu7a0`

    }
}

// Calling Expand API here
function callExpandApi(id, selection, hops) {
    $(".loadertest").html(loaderdiv);
    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', `${rootUrl}/generate_graph?id=${id}&graph=${graphVar}&selection=${selection}&hops=${hops}`, true)
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

