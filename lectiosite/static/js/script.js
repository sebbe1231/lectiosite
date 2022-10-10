window.onload = () => {
    const countdown = document.querySelector("#countdown");
    const modules = document.getElementById("modules").getElementsByTagName("li");
    const rooms = document.querySelector("#rooms");
    const room_search = document.querySelector("#room-search");
    const room_list = document.querySelector("#room-list")
    const user_search = document.querySelector("#user-search")
    const users = document.querySelector("#users")
    const user_list = document.querySelector("#user-list")
    const student_search = document.querySelector("#student-search")
    const teacher_search = document.querySelector("#teacher-search")
    const initial_search = document.querySelector("#initial-search")

    // FUNCTIONS
    // Prepare user modal
    function userModal(data) {
        document.querySelector("#usermodal").attributes["data-user-id"].value = data["user_id"]

        $("#usermodal-name").text(data["name"]);

        if (data["initials"] === null) {
            $("#usermodal-class-initial-text").text("Class:");
            $("#usermodal-class-initial").text(data["class"]);
        }
        else {
            $("#usermodal-class-initial-text").text("Initials:");
            $("#usermodal-class-initial").text(data["initials"]);
        }
        
        $("#usermodal-type").text(data["type"]);
        $("#usermodal-id").text(data["user_id"]);
    }

    // Room sched function
    function getRoom(room_id, room_name) {
        let last_date = null;
        let last_end = "00:00";

        $("#room-modal-card-holder").text("")

        // Function for adding available time, so i dont have to type this out like 3 times lol
        function availableTime(start, end, date_last) {
            $(`#room-modal-card-${date_last}`).append(`
                    <li class="list-group-item" id="available-time">
                        <div class="d-flex flex-column justify-content-start">
                            <div>
                                <div class="text-muted">
                                    <p>${start} - ${end}</p>
                                </div>
                            </div>
                            <p class="text-success">AVAILABLE</p>
                        </div>
                    </li>
                `);
        }

        $("#room-modal-header").text(room_name);

        fetch(`/get_room_sched`, {
            method: "POST",
            body: JSON.stringify({room_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {

            // Add alert based on availability
            $("#room-available").removeClass();
            if (data[0] === true){
                $("#room-available").addClass("alert alert-success");
                $("#room-available").text("Currently Available");
            }
            else {
                $("#room-available").addClass("alert alert-danger");
                $("#room-available").text("Currently Unavailable");
            }

            data[1].forEach(i => {
                start_time = i["start_time"].split(" ")[1].slice(0, 5)
                end_time = i["end_time"].split(" ")[1].slice(0, 5)
                let teacher;

                // Shorten teacher to initials
                try {
                    teacher = i["teacher"].split('(')[1].split(')')[0];
                } 
                catch (TypeError) {
                    teacher = i["teacher"]
                }

                // If a card for that date does not exist, make one
                if (last_date !== i["start_time"].slice(0, 10)){
                    // Add available time at end of day
                    availableTime(last_end, "00:00", last_date);

                    // Add new date card
                    last_date = i["start_time"].slice(0, 10)

                    $("#room-modal-card-holder").append(`
                    <div>
                        <div class="card" style="width: 13.5rem;">
                            <div class="card-header text-white bg-dark">
                            ${last_date}
                            </div>
                            <ul class="list-group list-group-flush" id="room-modal-card-${last_date}">
                            </ul>
                        </div>
                    </div>
                    `)
                    last_end = "00:00"
                }

                // Append available time between classes
                if (last_end !== start_time){
                    availableTime(last_end, start_time, last_date)
                }

                // Append time to matching date
                $(`#room-modal-card-${last_date}`).append(`
                    <li class="list-group-item" id="not-available-time">
                        <div class="d-flex flex-column justify-content-start">
                            <div>
                                <div class="text-muted">
                                    <p>${start_time} - ${end_time}</p>
                                    <p>${teacher}</p>
                                </div>
                            </div>
                            <p class="text-danger">NOT AVAILABLE</p>
                        </div>
                    </li>
                `); 

                last_end = end_time;
            });
            availableTime(last_end, "00:00", last_date)
        })
    }

    // Function for the user search bar
    function searchUsers(search_type) {
        const user = users.value
        user_list.innerHTML = "";
        document.querySelector("#user-search-results").style.display = "none";
        document.querySelector("#user-search-load").style.display = "block";

        fetch(`/search_users/${search_type}`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode)
                node.classList.add("list-group-item");
                node.classList.add("clickable");
                node.setAttribute('id',i["user_id"]);
                node.addEventListener("click", e => {
                    e.preventDefault();
    
                    userModal(i)
                    $('#usermodal').modal('show');
                })
                user_list.appendChild(node);
            });
        }).then(e => {
            document.querySelector("#user-search-load").style.display = "none";
            document.querySelector("#user-search-results").style.display = "block";
        })
        
    }

    //EVENT LISTENERS 
    // Run when button to get a users sched is pressed
    document.querySelector("#usermodal-sched-btn").addEventListener("click", e => {
        e.preventDefault();

        document.querySelector('#usermodal-sched-list').innerHTML = ""

        user_id =document.querySelector("#usermodal").attributes["data-user-id"].value
        $("#usermodal-sched-id").text(user_id);
        $("#user-sched-modal-name").text(document.querySelector("#usermodal-name").textContent);
        let last_date = null;

        fetch(`/get_user_sched`, {
            method: "POST",
            body: JSON.stringify({user_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                start_time = i["start_time"].split(" ")[1].slice(0, 5)
                end_time = i["end_time"].split(" ")[1].slice(0, 5)
                let teacher;
                
                // Shorten room to number only
                if (i["room"] == null){
                    room = "None"
                }
                else{
                    room = i["room"].split('(')[0];
                }

                // Shorten teacher to initials
                try {
                    teacher = i["teacher"].split('(')[1].split(')')[0];
                } 
                catch (TypeError) {
                    teacher = i["teacher"]
                }
                

                // If a card for that date does not exist, make one
                if (last_date !== i["start_time"].slice(0, 10)){
                    last_date = i["start_time"].slice(0, 10)
                    $("#usermodal-sched-list").append(`
                    <div>
                        <div class="card" style="width: 13.5rem;">
                            <div class="card-header text-white bg-dark">
                            ${last_date}
                            </div>
                            <ul class="list-group list-group-flush" id="user-sched-card-${last_date}">
                            </ul>
                        </div>
                    </div>
                    `)
                }
                
                // Append class to matching date
                $(`#user-sched-card-${last_date}`).append(`
                    <li class="list-group-item">
                        <div class="d-flex justify-content-between">
                            <div>
                                <span>${i["subject"]}</span>
                                <div class="text-muted">
                                    <p>${start_time} - ${end_time}</p>
                                    <p>${teacher}</p>
                                </div>
                            </div>
                            <div class="d-flex flex-column justify-items-start ps-3">
                                <div>
                                    <span class="badge rounded-pill text-bg-secondary">${room}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                `);
            });
        })
    })

    // Show all room sched times
    document.querySelector("#room-sched-all").addEventListener("click", e => {
        $('[id=available-time]').css( 'display', 'block');
        $('[id=not-available-time]').css( 'display', 'block');
    })

    // Show available room sched times
    document.querySelector("#room-sched-available").addEventListener("click", e => {
        $('[id=available-time]').css( 'display', 'block');
        $('[id=not-available-time]').css( 'display', 'none');
    })

    // Show not available room sched times
    document.querySelector("#room-sched-not-available").addEventListener("click", e => {
        $('[id=available-time]').css( 'display', 'none');
        $('[id=not-available-time]').css( 'display', 'block');
    })

    // Unfold sched when hover
    for (let index = 0; index < modules.length; index++) {
        modules[index].addEventListener("mouseover", e => {
            e.currentTarget.lastElementChild.style.display = "block"
        })
        modules[index].addEventListener("mouseleave", e => {
            e.currentTarget.lastElementChild.style.display = "none"
        })
        modules[index].addEventListener("click", e => {
            e.preventDefault();

            $('#classmodal' + modules[index].attributes["data-id"].value).modal('show');
        })
    }
    
    room_search.addEventListener("submit", e => {
        e.preventDefault();
        
        const room = rooms.value
        document.getElementById('room-list').innerHTML = ""
        document.querySelector("#room-search-load").style.display = "block";
        document.querySelector("#room-search-results").style.display = "none";
        
        fetch(`/search_rooms`, {
            method: "POST",
            body: JSON.stringify({room}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                node.classList.add("clickable");
                node.setAttribute('id',i["room_id"]);
                node.addEventListener("click", e => {
                    e.preventDefault();
                    
                    getRoom(i["room_id"], i["name"]);
                    $('#room-modal').modal('show');
                })
                room_list.appendChild(node);
            });
        }).then(e => {
            document.querySelector("#room-search-load").style.display = "none";
            document.querySelector("#room-search-results").style.display = "block";
        })
    })

    user_search.addEventListener("submit", e => {
        e.preventDefault();

        searchUsers("users")
    })

    student_search.addEventListener("click", e => {
        e.preventDefault();

        searchUsers("students")
    })

    teacher_search.addEventListener("click", e => {
        e.preventDefault();

        searchUsers("teachers")
    })

    initial_search.addEventListener("click", e => {
        e.preventDefault();

        searchUsers("initials")
    })

    setInterval(() => {
        let last_module
        let module_time
        let end
        try {
            last_module = modules[modules.length - 1]
            module_time = last_module.querySelector("#time").attributes["data-endtime"]
            end = new Date(module_time.value) - new Date();
        } catch (TypeError) {
            countdown.innerHTML = "No school today! Sit back and relax"
        }

        if (new Date(module_time.value) < new Date()) {
            countdown.innerHTML = "No more school today! Isn't that nice?";
        }
        else {
            countdown.innerHTML = new Date(end).toISOString().split("T")[1].split(".")[0] + " until school is done";
        }
    }, 1000);
}