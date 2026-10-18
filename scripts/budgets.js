const form_trigger = document.getElementById("add_budget");
const form_close = document.getElementById("form_close");
const form_container = document.getElementById("form-container");
const form = document.getElementById("form");
const exportButton = document.getElementById("export");
const options = document.getElementById("options");
const error = document.getElementById("error");

form_trigger.addEventListener("click", () => {
    form_container.classList.remove("hidden");
});

form_close.addEventListener("click", () => {
    form_container.classList.add("hidden");
});

const formHandle = () => {
    let data = JSON.parse(localStorage.getItem("data")) || null;
    const name = document.getElementById("name");
    const start_date = document.getElementById("start_date");
    const end_date = document.getElementById("end_date");
    const food = document.getElementById("food");
    const books = document.getElementById("books");
    const transport = document.getElementById("transport");
    const entertainment = document.getElementById("entertainment");
    const fees = document.getElementById("fees");
    const others = document.getElementById("others");
    const date = new Date();
    const advancedReg = /\b(\w+)\s+\1\b/;

    if (advancedReg.test(name.value)) {
        error.innerText = "Names can't have duplicate words."
        error.classList.remove("hidd");
        return;
    }

    const budget = {
        id: data == null || data.budgets == null || data.budgets.length == 0 ? 1 : data.budgets[data.budgets.length - 1].id + 1,
        name: name.value,
        start_date: start_date.value,
        end_date: end_date.value,
        food: parseFloat(food.value),
        books: parseFloat(books.value),
        transport: parseFloat(transport.value),
        entertainment: parseFloat(entertainment.value),
        createdAt: `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()).padStart(2, "0")}-${String(date.getFullYear()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds())}`,
        fees: parseFloat(fees.value),
        others: parseFloat(others.value)
    }

    if (data == null || data.budgets == null) {
        data = { ...data, budgets: [budget] };
        localStorage.setItem("data", JSON.stringify(data));
    } else {
        data.budgets.push(budget);
        localStorage.setItem("data", JSON.stringify(data));
    }

    name.value = "";
    start_date.value = "";
    end_date.value = "";
    food.value = "";
    books.value = "";
    transport.value = "";
    entertainment.value = "";
    fees.value = "";
    others.value = "";
    const newData = JSON.parse(localStorage.getItem("data")) || null;
    if (newData.budgets != null) showData(newData.budgets, "", data.currency || "$");
    error.innerText = "";
    error.classList.add("hidd");
    form_container.classList.add("hidden");
    exportButton.classList.remove("hid");
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    formHandle();
})

const showData = (data, mark, currency) => {
    const tableBody = document.getElementById('table');
    const htmlCode = data.map((data) => `
        <tr>
            <td>${(mark && mark.includes(data) ? "<mark>" + data.name + "</mark>" : data.name)}</td>
            <td>${currency || "$"}${data.food}</td>
            <td>${currency || "$"}${data.books}</td>
            <td>${currency || "$"}${data.transport}</td>
            <td>${currency || "$"}${data.entertainment}</td>
            <td>${currency || "$"}${data.fees}</td>
            <td>${currency || "$"}${data.others}</td>
            <td>${data.start_date}</td>
            <td>${data.end_date}</td>
            <td>
                <div class="del-pop hidden-pop" id="${data.id}">
                    <div class="message-container">
                        Are you sure you want to delete "${data.name}" budget?
                        <div>
                            <button class="yes" onclick="deleteBudget(${data.id})">Yes</button>
                            <button class="no" onClick="closeDelPopUp(${data.id})">No</button>
                        </div>
                    </div>
                </div>
                <div id="${data.id}-container" class="hidden form-container">
                    <div class="head">
                        <h2>Edit budget</h2>
                        <button id="form_close" onclick="closeEditForm(${data.id})">
                            <img src="../assets/icons/black_plus.png" alt="Black plus icon">
                        </button>
                    </div>
                    <form id="${data.id}-form">
                        <div class="error hidd" id="${data.id}-error"></div>
                        <div class="field">
                            <label for="${data.id}-name">Budget name:</label>
                            <input type="text" pattern="^[A-Za-z]+(?:[ \\-][A-Za-z]+)*$" title="Names can only contain letters, spaces and hyphens '-'" value="${data.name}" name="${data.id}-name" id="${data.id}-name" placeholder="Ex: June Budget" required autocomplete="name">
                        </div>
                        <div class="group">
                            <div class="field">
                                <label for="${data.id}-start_date">Start date:</label>
                                <input type="text" value="${data.start_date}" pattern="^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$" title="Date pattern is YYYY-MM-DD" name="${data.id}-start_date" id="${data.id}-start_date" placeholder="Ex: 2026-08-03" required>
                            </div>
                            <div class="field">
                                <label for="${data.id}-end_date">End date:</label>
                                <input type="text" value="${data.end_date}" pattern="^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$" title="Date pattern is YYYY-MM-DD" name="end_date" id="${data.id}-end_date" placeholder="Ex: 2026-08-03" required>
                            </div>
                        </div>
                        <div class="group">
                            <div class="field">
                                <label for="${data.id}-food">Food budget ($)</label>
                                <input type="text" value="${parseFloat(data.food)}" name="${data.id}-food" id="${data.id}-food" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 500" required>
                            </div>
                            <div class="field">
                                <label for="${data.id}-books">Books budget($)</label>
                                <input type="text" value="${parseFloat(data.books)}" name="${data.id}-books" id="${data.id}-books" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 500" required>
                            </div>
                        </div>
                        <div class="field">
                            <label for="${data.id}-transport">Transport budget ($)</label>
                            <input type="text" value="${parseFloat(data.transport)}" name="${data.id}-transport" id="${data.id}-transport" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 5" required>
                        </div>
                        <div class="field">
                            <label for="entertainment">Entertainment budget ($)</label>
                            <input type="text" value="${parseFloat(data.entertainment)}" name="${data.id}-entertainment" id="${data.id}-entertainment" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 3" required>
                        </div>
                        <div class="group">
                            <div class="field">
                                <label for="${data.id}-fees">Fees budget ($)</label>
                                <input type="text" value="${parseFloat(data.fees)}" name="fees" id="${data.id}-fees" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 660" required>
                            </div>
                            <div class="field">
                                <label for="${data.id}-others">Others ($)</label>
                                <input type="text" value="${parseFloat(data.others)}" name="others" id="${data.id}-others" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 40" required>
                            </div>
                        </div>
                        <button type="submit" class="primary" onClick="editBudget(${data.id})">Submit</button>
                    </form>
                </div>
                <div class="buttons">
                    <button id="edit" onclick="openEditForm(${data.id})">Edit</button>
                    <button id="delete" onclick="openDelPopUp(${data.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    tableBody.innerHTML = htmlCode;
}

const data = JSON.parse(localStorage.getItem("data")) || null;
if (data != null && data.budgets) {
    showData(data.budgets, "", data.currency || "$");
    exportButton.classList.remove("hid")
    options.classList.remove("hidd");
}

const deleteBudget = (id) => {
    let data = JSON.parse(localStorage.getItem("data")) || null;
    data.budgets = data.budgets.filter((budget) => budget.id != id);
    localStorage.setItem("data", JSON.stringify(data));
    showData(data.budgets, "", data.currency || "$");
}

const openDelPopUp = (id) => {
    const popUp = document.getElementById(id);
    popUp.classList.remove("hidden-pop");
}

const closeDelPopUp = (id) => {
    const popUp = document.getElementById(id);
    popUp.classList.add("hidden-pop");
}

const openEditForm = (id) => {
    const form = document.getElementById(`${id}-container`);
    form.classList.remove("hidden");
}

const closeEditForm = (id) => {
    const form = document.getElementById(`${id}-container`);
    form.classList.add("hidden");
}

const editBudget = (id) => {
    document.getElementById(`${id}-form`).addEventListener("submit", (event) => {
        event.preventDefault();
        let data = JSON.parse(localStorage.getItem("data")) || null;
        const name = document.getElementById(`${id}-name`);
        const start_date = document.getElementById(`${id}-start_date`);
        const end_date = document.getElementById(`${id}-end_date`);
        const food = document.getElementById(`${id}-food`);
        const books = document.getElementById(`${id}-books`);
        const transport = document.getElementById(`${id}-transport`);
        const entertainment = document.getElementById(`${id}-entertainment`);
        const fees = document.getElementById(`${id}-fees`);
        const others = document.getElementById(`${id}-others`);
        const error = document.getElementById(`${id}-error`);
        const advancedReg = /\b(\w+)\s+\1\b/;
        const date = new Date();

        if (advancedReg.test(name.value)) {
            error.innerText = "Names can't have duplicate words.";
            error.classList.remove("hidd");
            return;
        }

        let budget = data.budgets.find((item) => item.id == id);

        budget.name = name.value;
        budget.start_date = start_date.value;
        budget.end_date = end_date.value;
        budget.food = parseFloat(food.value);
        budget.books = parseFloat(books.value);
        budget.transport = parseFloat(transport.value);
        budget.entertainment = parseFloat(entertainment.value);
        budget.fees = parseFloat(fees.value);
        budget.others = parseFloat(others.value);
        budget.updatedAt = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()).padStart(2, "0")}-${String(date.getFullYear()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds())}`;


        data = { ...data, budgets: data.budgets.filter((item) => item.id != id) };
        data.budgets = [...data.budgets, budget];
        data.budgets = data.budgets.sort((a, b) => a.id - b.id);
        error.innerText = "";
        error.classList.add("hidd");
        showData(data.budgets, "", data.currency || "$");
        closeEditForm(id);
        localStorage.setItem("data", JSON.stringify(data));
    });
}

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (event) => {
    try {
        const re = new RegExp(event.target.value, "i");
        const data = JSON.parse(localStorage.getItem("data")) || null;
        const newBudgets = event.target.value ? data.budgets.filter((item) => (item.name).match(re)) : null;

        showData(data.budgets, newBudgets, data.currency || "$");
    } catch (err) {
        console.log("Sorry, there was an error!")
        console.log(err.message);
    }
})

const sortingSelect = document.getElementById("sorting");
sortingSelect.addEventListener("change", (event) => {
    const data = JSON.parse(localStorage.getItem("data")) || null;
    const budgets = data.budgets;
    let newBudgets;

    switch (event.target.value) {
        case 'name-a':
            newBudgets = budgets.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? -1 : 0));
            break;
        case 'name-d':
            newBudgets = budgets.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 0 : -1));
            break;
        case 'start_date-a':
            newBudgets = budgets.sort((a, b) => (a.name.start_date > b.name.toUpperCase() ? -1 : 0));
            break;
        case 'start_date-d':
            newBudgets = budgets.sort((a, b) => (a.name.start_date > b.name.toUpperCase() ? 0 : -1));
            break;
    }

    showData(newBudgets, "", data.currency || "$");
})

// Import Budget data
const importButton = document.getElementById("import");
let fileHandle;
importButton.addEventListener("click", async () => {
    [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: "JSON",
                accept: {
                    "json/*": [".json"]
                }
            }
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    });
    const file = await fileHandle.getFile();
    const fileText = await file.text();
    const json = JSON.parse(fileText).budgets || undefined;

    function verifyJSON(json) {
        const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

        if (!json) {
            alert("No budget data found!");
            return false;
        } else {
            for (i = 0; i < json.length; i++) {
                if (
                    Object.keys(json[i]).includes("id")
                    && Object.keys(json[i]).includes("name")
                    && Object.keys(json[i]).includes("start_date")
                    && Object.keys(json[i]).includes("end_date")
                    && Object.keys(json[i]).includes("food")
                    && Object.keys(json[i]).includes("books")
                    && Object.keys(json[i]).includes("transport")
                    && Object.keys(json[i]).includes("entertainment")
                    && Object.keys(json[i]).includes("fees")
                    && Object.keys(json[i]).includes("others")
                    && Object.keys(json[i]).includes("createdAt")
                    && typeof (json[i].id) == "number"
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].food)
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].books)
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].transport)
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].entertainment)
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].fees)
                    && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(json[i].others)
                    && typeof (json[i].name) == "string"
                    && typeof (json[i].start_date) == "string"
                    && typeof (json[i].end_date) == "string"
                    && re.test(json[i].start_date)
                    && re.test(json[i].end_date)
                    && typeof (json[i].food) == "number"
                    && typeof (json[i].books) == "number"
                    && typeof (json[i].transport) == "number"
                    && typeof (json[i].entertainment) == "number"
                    && typeof (json[i].fees) == "number"
                    && typeof (json[i].others) == "number"
                    && typeof (json[i].createdAt) == "string"
                ) {
                    continue;
                } else {
                    alert("Invalid JSON");
                    return false;
                }
            }
        }
        return true;
    }

    if (verifyJSON(json)) {
        let data = JSON.parse(localStorage.getItem("data")) || null;

        if (data == null || data.budgets == null) {
            data = { ...data, budgets: json };
        } else {
            let newJSON = json;
            for (i = 0; i < json.length; i++) {
                newJSON[i].id = data.budgets[data.budgets.length - 1].id + (i + 1);
            }

            let newBudgets = data.budgets.concat(newJSON);
            data = { ...data, budgets: newBudgets };
        }

        localStorage.setItem("data", JSON.stringify(data));
        showData(data.budgets, "", data.currency || "$");
        exportButton.classList.remove("hid");
        options.classList.remove("hidd");
    }
});

let exportHandle;
exportButton.addEventListener("click", async () => {
    const data = JSON.stringify(JSON.parse(localStorage.getItem("data")).budgets);
    exportHandle = await window.showSaveFilePicker({
        types: [{
            description: "JSON",
            accept: {
                "json/*": [".json"]
            }
        }], 
        excludeAcceptAllOption: true,
        multiple: false,
    });

    let stream = await exportHandle.createWritable();
    await stream.write(data);
    await stream.close();
});