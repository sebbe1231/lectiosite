// Run when date is clicked
const dateClick = (e) => {
    const clicked_date = e.currentTarget.attributes;

    if (clicked_date["class"].value.includes("clickable") === false) {
        return
    }
    $("#sched-list").empty();
    $(".clicked").removeClass("clicked");
    clicked_date["class"].value = `${clicked_date["class"].value} clicked`;
    date = new Date(clicked_date["data-date"].value); 

    fetch(`/get_sched`, {
        method: "POST",
        body: JSON.stringify({date}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => rep.json()).then(data => {
        $("#sched-date").text(clicked_date["data-date"].value)
        if (data.length === 0){
            $("#sched-list").append(`
                <li>
                    <span class="text-success">No school this day!</span>
                </li>
            `)
            return
        }
        data.forEach(i => {
            $("#sched-list").append(`
            <li class="list-group-item clickable" onclick="clickedModule(event)"
                data-subject="${i["subject"]}" 
                data-title="${i["title"]}" 
                data-teacher="${i["teacher"]}" 
                data-room="${i["room"]}" 
                data-extra-info="${i["extra_info"]}" 
                data-start-time="${i["start_time"]}" 
                data-end-time="${i["end_time"]}" 
                data-status="${i["status"]}" 
                data-url="${i["url"]}">
                <div style="white-space: nowrap; overflow-x: hidden;">
                    <span id="sched-subject">${i["subject"]}</span>
                </div>
                <p class="text-muted" id="sched-time">${i["start_time"].slice(16, -7)} - ${i["end_time"].slice(16, -7)}</p>
            </li>
            `)
        });
    })
}

// Run when module is clicked
const clickedModule = e => {
    const clicked_module = e.currentTarget.attributes;

    $("#modal-header").text(clicked_module["data-subject"].value);
    $("#modal-body-time").text(`${clicked_module["data-start-time"].value.slice(16, -7)} - ${clicked_module["data-end-time"].value.slice(16, -7)}`);
    console.log()
    if (clicked_module["data-title"].value !== "null"){
        $("#modal-title").text(clicked_module["data-title"].value);
    }
    $("#modal-body-room").text(clicked_module["data-room"].value);
    $("#modal-body-teacher").text(clicked_module["data-teacher"].value);
    if (clicked_module["data-extra-info"].value !== "null"){
        $("#modal-body-extra").text(clicked_module["data-extra-info"].value);
    }
    $("#modal-footer-url").attr("href", clicked_module["data-url"].value);

    $("#sched-modal").modal('show');
}

window.onload = () => {

    // Set default sched to the current day
    $("#sched-list").empty();
    date = new Date($("#sched-date").text()); 

    fetch(`/get_sched`, {
        method: "POST",
        body: JSON.stringify({date}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(rep => rep.json()).then(data => {
        data.forEach(i => {
            $("#sched-list").append(`
            <li class="list-group-item clickable"
                data-subject="${i['subject']}" 
                data-title="${i['title']}" 
                data-teacher="${i['teacher']}" 
                data-room="${i['room']}" 
                data-extra-info="${i['extra_info']}" 
                data-start-time="${i['start_time']}" 
                data-end-time="${i['end_time']}" 
                data-status="${i['status']}" 
                data-url="${i['url']}"
                onclick="clickedModule(event)">
                <div style="white-space: nowrap; overflow-x: hidden;">
                    <span>${i["subject"]}</span>
                </div>
                <p class="text-muted">${i["start_time"].slice(16, -7)} - ${i["end_time"].slice(16, -7)}</p>
            </li>
            `)
        });
    })
}