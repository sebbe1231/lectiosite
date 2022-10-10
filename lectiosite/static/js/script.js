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
    const user_search_bar = document.querySelector("#user-search-bar");

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

        fetch(`/get_user_sched`, {
            method: "POST",
            body: JSON.stringify({user_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                console.log(typeof(i["start_time"]));
                console.log(i["start_time"])
                start_time = new Date(i["start_time"]).toISOString().split("T")[1].split(".")[0]
                end_time = new Date(i["end_time"]).toISOString().split("T")[1].split(".")[0]
                
                //append sched list items
                $("#usermodal-sched-list").append(`
                    <div>
                        <div class="card" style="width: 18rem;">
                            <div class="card-header">
                            ${i["start_time"].slice()}
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" id="usermodal-sched-list">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <span>${i["subject"]}</span>
                                            <div id="time" class="text-muted">
                                                ${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column justify-content-start">
                                        <span class="text-muted">${i["room"]}</span>
                                        <span class="text-muted">${i["teacher"]}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                `);
            });
        })
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

    // Hide user sched when modal is closed
    $( "#usermodal-close" ).click(e => {
        $('#usermodal-collapse').collapse("hide")
    });

    // Make user sched only show, and not toggle
    $("#usermodal-sched-btn").click(e => {
        $("#usermodal-collapse").collapse("show")
    });

    
    room_search.addEventListener("submit", e => {
        e.preventDefault();
        
        const room = rooms.value
        document.getElementById('room-list').innerHTML = ""
        
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
                node.setAttribute('id',i["room_id"])
                room_list.appendChild(node);
            });
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