window.onload = () =>{
    const class2 = document.querySelector("#class2");
    const modules = document.getElementById("modules").getElementsByTagName("li");

    for (let index = 0; index < modules.length; index++) {
        modules[index].addEventListener("mouseover", e => {
            console.log(e.target.attributes);
            console.log(index);

            
        })
    }
}