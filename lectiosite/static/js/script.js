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

    
    $( "#usermodal-close" ).click(e => {
        $('#usermodal-collapse').collapse("hide")
    });

    function userModal(data) {
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
            
        document.querySelector("#usermodal-sched-btn").addEventListener("click", e => {
            e.preventDefault();

            user_id = data["user_id"]

            fetch(`/get_user_sched`, {
                method: "POST",
                body: JSON.stringify({user_id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(rep => rep.json()).then(data => {
                data.forEach(i => {
                    start_time = new Date(i["start_time"]).toISOString().split("T")[1].split(".")[0]
                    end_time = new Date(i["end_time"]).toISOString().split("T")[1].split(".")[0]
                    $("#usermodal-sched-list").append(`
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
                    `);
                });
            })

            // I do this to remove the old event listener, or else 2 post requests would be sent
            const old_button = document.querySelector("#usermodal-sched-btn");
            const new_button = old_button.cloneNode(true);
            old_button.parentNode.replaceChild(new_button, old_button)
        })
    }

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

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_users/users`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                node.setAttribute('id',i["user_id"]);
                node.addEventListener("click", e => {
                    e.preventDefault();
                    
                    document.querySelector('#usermodal-sched-list').innerHTML = ""

                    userModal(i)
                    $('#usermodal').modal('show');
                })
                user_list.appendChild(node);
            });
        })
    })

    student_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_users/students`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                node.addEventListener("click", e => {
                    e.preventDefault();
                    
                    document.querySelector('#usermodal-sched-list').innerHTML = ""

                    userModal(i)
                    $('#usermodal').modal('show');
                })
                user_list.appendChild(node);
            });
        })
    })

    teacher_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_users/teachers`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                node.addEventListener("click", e => {
                    e.preventDefault();
                    
                    document.querySelector('#usermodal-sched-list').innerHTML = ""

                    userModal(i)
                    $('#usermodal').modal('show');
                })
                user_list.appendChild(node);
            });
        })
    })

    initial_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_users/initials`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i["name"]);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                node.addEventListener("click", e => {
                    e.preventDefault();
                    
                    document.querySelector('#usermodal-sched-list').innerHTML = ""

                    userModal(i)
                    $('#usermodal').modal('show');
                })
                user_list.appendChild(node);
            });
        })
    })

    setInterval(() => {
        try {
            const last_module = modules[modules.length - 1]
            const module_time = last_module.querySelector("#time").attributes["data-endtime"]
            const end = new Date(module_time.value) - new Date();
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