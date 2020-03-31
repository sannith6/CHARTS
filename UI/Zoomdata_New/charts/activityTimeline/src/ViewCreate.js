export default function viewCreate(params){
    return `
    <div class="row">
        <div class="col-md-12">
            <div class="activity-timeline">
                <div class="left">
                    <h2 style="width:100%" class="h2activity">
                        Activity Timeline
                        <!-- <span>{{toggledResp}}</span> -->
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </h2>
                    <div id="activityTimelineAxis">
                        <p>
                            <span>Logon</span>
                        </p>
                        <p>
                            <span>Download</span>
                        </p>
                        <p>
                            <span>Receive</span>
                        </p>
                        <p>
                            <span>Send</span>
                        </p>
                        <p>
                            <span>Upload</span>
                        </p>
                        <p>
                            <span>Logoff</span>
                        </p>
                    </div>
                    <div id="activityTimeline"></div>
                </div>
                <div class="right">
                    <h2>Event Details</h2>
                    <p id="eventData">
                        <span></span>
                        <strong></strong>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `

}
