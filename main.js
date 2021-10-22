currentPage = 1
let APIs = "http://localhost:8000/students/"
let API = "http://localhost:8000/students?_page=1&_limit=6"

let addLastName = $('#addLastName')
let addFirstName = $('#addFirstName')
let addKpi = $('#addKpi')
let addDesc = $('#addDesc')
let addImg = $('#addImg')
let modal = $('.modal')
let next = $('.next')
let prev = $('.prev')

let btnSaveChanges = $('.btn-save-changes')
btnSaveChanges.on("click", (e) => {
    let lastname = addLastName.val()
    let firstname = addFirstName.val()
    let kpi = addKpi.val()
    let desc = addDesc.val()
    let img = addImg.val()
    let student = {
        lastname,
        firstname,
        kpi,
        desc,
        img,
    }
    addStudent(student)
})
async function addStudent(student) {
    try {
        let result = await axios.post(APIs, student)
        console.log(result);
        modal.modal('hide')
    } catch (e) {
        console.log(e)
        modal.modal('hide')
    }
    render("http://localhost:8000/students?_page=" + currentPage + "&_limit=6");
}
async function render(url) {
    try {
        const response = await axios(url)
        console.log(response.data)
        let list = $('.list')
        list.html('')
        response.data.forEach((item) => {
            list.append(`<div class="card" style="width: 18rem;">
                <img style="width: 100%; object-fit: contain; height:250px" src='${item.img}' class="card-img-top" alt="...">
                <div class ="card-body">
                <p class ="card-text">Lastname: ${item.lastname}</p>
                <p class ="card-text">Firstname: ${item.firstname}</p>
                <p class ="card-text">KPI: ${item.kpi}</p>
                <p class ="card-text">description: ${item.desc}</p>
                 <button id="${item.id}"type="button" class="btn btn-info edit-btn" data-bs-toggle="modal"
                            data-bs-target="#editModal">
                            Edit student
                        </button>
                    <button id="${item.id}" type="button" class="btn btn-danger delete-btn">Delete student</button>
                </div>
            </div>`)
        })

        let links = response.headers.link.match(
            /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
        );
        if (!links) {

            prev.attr("disabled", "true");
            next.attr("disabled", "true");
            return;
        }
        if (links[0] === links[1]) {
            prev.removeAttr("disabled");
        }
        if (links[1] === links[2]) {
            next.removeAttr("disabled");
        }
        if (links.length === 4) {
            prev.attr("id", links[1]);
            next.attr("id", links[2]);
            prev.removeAttr("disabled");
            next.removeAttr("disabled");
        } else if (links.length === 3 && currentPage === 1) {
            prev.attr("disabled", "true");
            next.attr("id", links[1]);
        } else if (links.length === 3 && currentPage != 1) {
            next.attr("disabled", "true");
            prev.attr("id", links[1]);
        }
    } catch (e) {

    }
}

render(API)
next.on("click", (e) => {
    let url = e.target.id;
    render(url);
    currentPage++;
});
prev.on("click", (e) => {
    let url = e.target.id;
    render(url);
    currentPage--;
});

let searchInput = $("#searchInput");
searchInput.on("input", function (e) {
    let val = e.target.value;
    let url = API + `&q=${val}`;
    render(url);
    currentPage = 1;
});

let searchInputBtn = $("#searchInputBtn");
searchInputBtn.on("click", function (e) {
    e.preventDefault()
    let val = $('#searchInput').val()
    let url = API + `&q=${val}`;
    render(url);
    currentPage = 1;
});

let editLastName = $('#editLastName')
let editFirstName = $('#editFirstName')
let editKpi = $('#editKpi')
let editDesc = $('#editDesc')
let editImg = $('#editImg')
let editStud = $('.edit-stud')

$(document).on("click", ".edit-btn", async (e) => {
    let id = e.target.id
    editStud.attr("id", id)


    try {
        let result = await axios.get(APIs + id)
        editLastName.val(result.data.firstname)
        editFirstName.val(result.data.lastname)
        editKpi.val(result.data.kpi)
        editDesc.val(result.data.desc)
        editImg.val(result.data.img)



    } catch (e) {

    }

})

$(document).on("click", ".edit-stud", async (e) => {
    let id = e.target.id
    let lastname = editLastName.val()
    let firstname = editFirstName.val()
    let kpi = editKpi.val()
    let desc = editDesc.val()
    let img = editImg.val()
    student = {
        lastname,
        firstname,
        kpi,
        desc,
        img,
    }

    try {
        let result = await axios.put(APIs + id, student)




    } catch (e) {

    }
    modal.modal("hide")
    render("http://localhost:8000/students?_page=" + currentPage + "&_limit=6");
})
$(document).on("click", ".delete-btn", async (e) => {
    console.log("here")
    let id = e.target.id
    try {
        let result = await axios.delete(APIs + id)
        let response = await axios(APIs)

        if (response.data.length % 6 === 0) {
            console.log('qwe')
            currentPage--;
        }
    } catch (e) {

    }

    render("http://localhost:8000/students?_page=" + currentPage + "&_limit=6");
})
