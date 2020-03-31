
// Profiler data api calls
function callOnClickAPI(id , data) {
     stasticalAPi(id)
     activityPerUser(data)
     accessedWebsites(data)
     uploadDownRatioByentity(data)
    //  newlyAccessedWebsites(data)

}

function activityPerUser(data) {

if(data.userName){

    var url =`${ProfilerClientServiceDeployInstance}/activitybyuser?tenantid=demo&user=${data.userName}&value=20&unit=DAYS`

    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', url, true)
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader('Content-Type', 'application/json');

    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    request.onload = function () {
        if (this.readyState == this.DONE) {
            console.log(JSON.parse(this.response), "data")
            if(this.response.length > 0 ){
                document.getElementById('activityPerUser').innerHTML = this.response;
            }else{
               document.getElementById('activityPerUser').innerHTML ='No data';
            }
        }
    };
    request.send();
}
    else{
        document.getElementById('activityPerUser').innerHTML ='No data'
    }
}


function uploadDownRatioByentity(data) {

    if(data.ip ){
        var url =`${ProfilerClientServiceDeployInstance}/updnratiobyentity?tenantid=demo&entity=${data.ip}&value=100&unit=DAYS`
        var request = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        console.log(url)
        request.open('GET', url, true)
        request.setRequestHeader("cache-control", "no-cache");
        request.setRequestHeader('Content-Type', 'application/json');

        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

        request.onload = function () {
        if (this.readyState == this.DONE) {
            console.log(JSON.parse(this.response), "data")
            if(this.response.length > 0 ){
                document.getElementById('udRatio').innerHTML = this.response;
            }else{
               document.getElementById('udRatio').innerHTML ='No data';
            }
        }
    };
        request.send();
    }
    else{
       document.getElementById('udRatio').innerHTML ='No data';
    }
    
}



function accessedWebsites(data) {
    
    console.log(data , "activityPerUser params")

    if(data.userName || data.ip){
        var url;
         if(data.userName){
            url =`${ProfilerClientServiceDeployInstance}/accesswebsitesbyuser?tenantid=demo&username=${data.userName}&value=10`
         }
         else{
            url =`${ProfilerClientServiceDeployInstance}/accesswebsitesbyentity?tenantid=demo&entity=${data.ip}&value=10`
         }

            var request = new XMLHttpRequest();
            // Open a new connection, using the GET request on the URL endpoint
            console.log(url)
            request.open('GET', url, true)
            request.setRequestHeader("cache-control", "no-cache");
            request.setRequestHeader('Content-Type', 'application/json');

            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

            request.onload = function () {
                if (this.readyState == this.DONE) {
                    console.log(JSON.parse(this.response), "data")
                    if(this.response.length > 0 ){
                        document.getElementById('accessedWeb').innerHTML = this.response;
                    }else{
                    document.getElementById('accessedWeb').innerHTML ='No data';
                    }
                }
            };
            request.send();
    }
    else{
      document.getElementById('accessedWeb').innerHTML ='No data';
    }
    
}




// function newlyAccessedWebsites(data) {
    
//     console.log(data , "activityPerUser params")

//     if(data.userName || data.ip){
//         var url;
//          if(data.userName){
//             url =`${ProfilerClientServiceDeployInstance}/accesswebsitesbyuser?tenantid=demo&username=${data.userName}&value=10`
//          }
//          else{
//             url =`${ProfilerClientServiceDeployInstance}/accesswebsitesbyentity?tenantid=demo&entity=${data.ip}&value=10`
//          }

//             var request = new XMLHttpRequest();
//             // Open a new connection, using the GET request on the URL endpoint
//             console.log(url)
//             request.open('GET', url, true)
//             request.setRequestHeader("cache-control", "no-cache");
//             request.setRequestHeader('Content-Type', 'application/json');

//             request.setRequestHeader('Access-Control-Allow-Origin', '*');
//             request.setRequestHeader('Access-Control-Allow-Headers', 'authorization, content-type');

//             request.onload = function () {
//                 if (this.readyState == this.DONE) {
//                 // debugger
//                     console.log(JSON.parse(this.response), "data here")
//                     // getData(JSON.parse(this.response))
//                     // populateCounter(JSON.parse(this.response))
//                 }
//             };
//             request.send();
//     }
//     else{
//         alert('check')
//     }
    
// }