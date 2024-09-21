const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = document.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button"); 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();
    document.querySelectorAll(".note").forEach(note => {
        const title = note.querySelector(".details p").textContent.toLowerCase();
        const description = note.querySelector(".details span").textContent.toLowerCase();
        if (title.includes(searchText) || description.includes(searchText)) {
            note.style.display = "";
        } else {
            note.style.display = "none";
        }
    });
});

let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a New Note";
    popupBox.classList.remove("show");
    
});

function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
            <div class="details">
                <p>${note.title}</p>
                <span>${note.description}</span>    
            </div>

            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i onclick = "showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="menu">
                        <li onclick= "updateNote(${index}, '${note.title}', '${note.description}')"> <i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>         
            </div>
        </li>`;  

        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e=> {
        //removing show class from the settings menu on document click.
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    notes.splice(noteId, 1); //removing selected note from array/tasks
    //saving notes to localstorage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update Note";
    console.log(noteId, title, desc);
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && popupBox.classList.contains("show")) {
        addBtn.click();  // Trigger the button click event
    }
});


addBtn.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if (noteTitle || noteDesc) {
        // get day, month, year from the current date
        let dateObj = new Date(),
            day = dateObj.getDate(),
            month = months[dateObj.getMonth()],
            year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle, 
            description: noteDesc,
            date: `${day} ${month}, ${year}`
        }

        if(!isUpdate) {
            notes.push(noteInfo); // adding new note 
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo //updating a specific note
        }

        localStorage.setItem("notes", JSON.stringify(notes)); // saving notes to localStorage

        titleTag.value = ""; // clear the input fields
        descTag.value = "";

        showNotes(); // show the updated list of notes
        popupBox.classList.remove("show"); // close the popup box
    }
});