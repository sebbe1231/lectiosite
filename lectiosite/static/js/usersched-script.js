const moduleModal = (e) => {
    module = e.currentTarget.attributes["data-module"].value
    
    $("#sched-modal").modal("show");
    console.log(typeof(module))
    console.log(module)
}