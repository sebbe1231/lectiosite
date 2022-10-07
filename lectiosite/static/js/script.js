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
                const textnode = document.createTextNode(i);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                room_list.appendChild(node);
            });
        })
    })

    user_search.addEventListener("submit", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_users`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                user_list.appendChild(node);
            });
        })
    })

    student_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_students`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                user_list.appendChild(node);
            });
        })
    })

    teacher_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_teachers`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                user_list.appendChild(node);
            });
        })
    })

    initial_search.addEventListener("click", e => {
        e.preventDefault();

        const user = users.value
        user_list.innerHTML = "";

        fetch(`/search_initials`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(rep => rep.json()).then(data => {
            data.forEach(i => {
                const node = document.createElement("li");
                const textnode = document.createTextNode(i);
                node.appendChild(textnode);
                node.classList.add("list-group-item");
                user_list.appendChild(node);
            });
        })
    })

    setInterval(() => {
        const last_module = modules[modules.length - 1]
        const module_time = last_module.querySelector("#time").attributes["data-endtime"]
        const end = new Date(module_time.value) - new Date();

        if (new Date(module_time.value) < new Date()) {
            countdown.innerHTML = "No more school today! Isn't that nice?";
        }
        else {
            countdown.innerHTML = new Date(end).toISOString().split("T")[1].split(".")[0] + " until school is done";
        }
    }, 1000);
}