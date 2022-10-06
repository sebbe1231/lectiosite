window.onload = () => {
    const countdown = document.querySelector("#countdown");
    const modules = document.getElementById("modules").getElementsByTagName("li");
    const rooms = document.querySelector("#rooms");
    const room_search = document.querySelector("#room-search");
    const room_form = document.querySelector("#room-form")
    const room_list = document.querySelector("#room-list")

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

    room_search.addEventListener("click", e => {
        const room = rooms.value
        
        fetch(`/search_rooms/${room}`).then(rep => console.log(rep))
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