const moduleModal = (e) => {
    const module = e.currentTarget.attributes;

    // All of this is to set the modal
    
    $("#modal-header").text(module["data-subject"].value)
    $("#modal-body-time").text(module["data-start"].value.slice(10, 16) + " - " + module["data-end"].value.slice(10, 16))
    if (module["data-title"].value !== "None"){
        $("#modal-title").text(module["data-title"].value)
    }
    else{
        $("#modal-title").text(" ")
    }
    $("#modal-body-room").text(module["data-room"].value)
    $("#modal-body-teacher").text(module["data-teacher"].value)
    if (module["data-extra"].value !== "None"){
        $("#modal-body-extra-div").css('display', 'block')
        $("#modal-body-extra").text(module["data-extra"].value)
    }
    else{
        $("#modal-body-extra-div").css('display', 'none')
    }
    $("#modal-footer-url").attr("href", module["data-url"].value)

    $("#sched-modal").modal("show");
}