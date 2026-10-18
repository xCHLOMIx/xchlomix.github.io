const form_trigger = document.getElementById("add_transaction");
const form_close = document.getElementById("form_close");
const form_container = document.getElementById("form-container");
const form = document.getElementById("form");
const exportButton = document.getElementById("export");

form_trigger.addEventListener("click", () => {
    form_container.classList.remove("hidden");
});

form_close.addEventListener("click", () => {
    form_container.classList.add("hidden");
});

const formHandle = () => {
    let data = JSON.parse(localStorage.getItem("data")) || null;
    const amount = document.getElementById("amount");
    const description = document.getElementById("description");
    const category = document.getElementById("category");
    const othersInput = document.getElementById("others");

    const date = new Date();

    const transaction = {
        id: data == null || data.transactions == null ? 1 : data.transactions[data.transactions.length - 1].id + 1,
        amount: parseFloat(amount.value),
        description: description.value,
        category: category.value == "other" ? othersInput.value : category.value,
        createdAt: `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()).padStart(2, "0")}-${String(date.getFullYear()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`
    };

    if (data == null || data.transactions == null) {
        data = { ...data, transactions: [transaction] };
        localStorage.setItem("data", JSON.stringify(data));
    } else {
        data.transactions = [...data.transactions, transaction];
        localStorage.setItem("data", JSON.stringify(data));
    }
    amount.value = "";
    description.value = "";
    category.value = "";
    const newData = JSON.parse(localStorage.getItem("data")) || null;
    if (newData.transactions != null) showData(newData.transactions, "", data.currency || "$");
    form_container.classList.add("hidden");
    exportButton.classList.remove("hidden");
}

form.addEventListener("submit", (event) => {
    event.preventDefault()
    formHandle();
});

const showData = (data, mark, currency) => {
    let rate = 1;

    switch (currency) {
        case "$":
            rate = 1;
            break;
        case "RWF":
            rate = 1478.18
            break;
        case "KSH":
            rate = 130.10
    }

    const tableBody = document.getElementById("table");
    const htmlCode = data.map((data) => `
        <tr>
            <td>${(mark && mark.includes(data) ? "<mark>" + data.description + "</mark>" : data.description)}</td>
            <td>${currency} ${(data.amount * rate).toLocaleString()}</td>
            <td style="text-transform: capitalize;">${data.category}</td>
            <td>${data.createdAt}</td>
            <td>
                <div class="del-pop hidden-pop" id="${data.id}">
                    <div class="message-container">
                        Are you sure you want to delete "${data.description}" transaction?
                        <div>
                            <button class="yes" onclick="deleteTransaction(${data.id})">Yes</button>
                            <button class="no" onclick="closeDelPopUp(${data.id})">No</button>
                        </div>
                    </div>
                </div>
                <div id="${data.id}-container" class="hidden form-container">
                    <div class="head">
                        <h2>Edit transaction</h2>
                        <button id="form_close" onclick="closeEditForm(${data.id})">
                            <img src="../assets/icons/black_plus.png" alt="Black plus icon">
                        </button>
                    </div>
                    <form id="${data.id}-form">
                        <div class="field">
                            <label for="${data.id}-amount">Amount ($):</label>
                            <input type="text" pattern="^(0|[1-9]\\d*)(\\.\\d{1,2})?$" value=${parseFloat(data.amount)} id="${data.id}-amount" title="Must be a numeric value with max 2 decimal places" placeholder="Example: 500"required>
                        </div>
                        <div class="field">
                            <label for="${data.id}-description">Description:</label>
                            <input type="text" value="${data.description}" pattern="^\\S(?:.*\\S)?$" title="No trailing/leading spaces or collapse doubles allowed." minlength="5" id="${data.id}-description" placeholder="Example: Lunch at KFC" required>
                        </div>
                        <div class="selects" id="select_container">
                            <div class="field">
                                <label for="category">Category:</label>
                                <select name="category" onchange="handleEditCategory(${data.id})" value="${data.category}" id="${data.id}-category" required>
                                    <option value="">Select category</option>
                                    <option value="food">Food</option>
                                    <option value="books">Books</option>
                                    <option value="transport">Transport</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="fees">Fees</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="field hidd" id="${data.id}-others-input">
                            <label for="${data.id}-others">Others</label>
                            <input type="text" pattern="^[A-Za-z]+(?:[ \\-][A-Za-z]+)*$" title="Only letters, spaces and hyphens '-'" id="${data.id}-others" placeholder="Others: Clothing">
                        </div>
                        <button type="submit" onClick="editTransaction(${data.id})" class="primary">Submit</button>
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
};

const options = document.getElementById("options-container");
const data = JSON.parse(localStorage.getItem("data")) || null;

if (data && data.transactions) {
    showData(data.transactions, "", data.currency || "$");
    exportButton.classList.remove("hid");
    options.classList.remove("hidd");
};

const select = document.getElementById("category");
const othersField = document.getElementById("others-input");
const othersInput = document.getElementById("others");

select.addEventListener("change", (event) => {
    if (event.target.value == "other") {
        othersInput.setAttribute("required", "");
        othersField.classList.remove("hidd");
    } else {
        othersInput.removeAttribute("required", "");
        othersField.classList.add("hidd");
    }
})

const deleteTransaction = (id) => {
    let data = JSON.parse(localStorage.getItem("data")) || null;
    data.transactions = data.transactions.filter((transaction) => transaction.id != id);
    localStorage.setItem("data", JSON.stringify(data));
    showData(data.transactions, "", data.currency || "$");
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

const editTransaction = (id) => {
    document.getElementById(`${id}-form`).addEventListener("submit", (event) => {
        event.preventDefault();
        let data = JSON.parse(localStorage.getItem("data")) || null;
        const amount = document.getElementById(`${id}-amount`);
        const description = document.getElementById(`${id}-description`);
        const category = document.getElementById(`${id}-category`);
        const othersInput = document.getElementById(`${id}-others`);

        const date = new Date();

        let transaction = data.transactions.find((item) => item.id == id);
        transaction.amount = parseFloat(amount.value);
        transaction.description = description.value;
        transaction.category = category.value == "other" ? othersInput.value : category.value;
        transaction.updatedAt = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()).padStart(2, "0")}-${String(date.getFullYear()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds())}`;

        data = { ...data, transactions: data.transactions.filter((item) => item.id != id) };
        data.transactions = [...data.transactions, transaction];
        data.transactions = data.transactions.sort((a, b) => a.id - b.id)
        showData(data.transactions, "", data.currency || "$");
        closeEditForm(id);
        localStorage.setItem("data", JSON.stringify(data));
    })
}

// Live Searching ??

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (event) => {
    try {
        const re = new RegExp(event.target.value, "i");
        const data = JSON.parse(localStorage.getItem("data")) || null;
        const newTransactions = event.target.value ? data.transactions.filter((item) => (item.description).match(re)) : null;

        showData(data.transactions, newTransactions, data.currency || "$");
    } catch (err) {
        console.log("Sorry, there was an error!")
    }
});

// Handling others category in edit
const handleEditCategory = (id) => {
    const select = document.getElementById(`${id}-category`);
    const othersField = document.getElementById(`${id}-others-input`);
    const othersInput = document.getElementById(`${id}-others`);
    select.addEventListener("change", (event) => {
        console.log(event.target.value)
        if (event.target.value == "other") {
            othersInput.setAttribute("required", "");
            othersField.classList.remove("hidd");
        } else {
            othersInput.setAttribute("required", "");
            othersField.classList.add("hidd");
        }
    });
}

// Sorting functionality
const sortingSelect = document.getElementById("sorting");
sortingSelect.addEventListener("change", (event) => {
    const data = JSON.parse(localStorage.getItem("data")) || null;
    const transactions = data.transactions;
    let newTransactions;

    switch (event.target.value) {
        case 'amount-a':
            newTransactions = transactions.sort((a, b) => a.amount - b.amount);
            break;
        case 'amount-d':
            newTransactions = transactions.sort((a, b) => b.amount - a.amount);
            break;
        case 'createdAt-a':
            newTransactions = transactions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 0));
            break;
        case 'createdAt-d':
            newTransactions = transactions.sort((a, b) => (a.createdAt > b.createdAt ? 0 : -1));
            break;
        case 'description-d':
            newTransactions = transactions.sort((a, b) => (a.description.toUpperCase() > b.description.toUpperCase() ? -1 : 0));
            break;
        case 'description-a':
            newTransactions = transactions.sort((a, b) => (a.description.toUpperCase() > b.description.toUpperCase() ? 0 : -1));
            break;
    }

    showData(newTransactions, "", data.currency || "$");
})

// Importing JSON

const importBtn = document.getElementById("import");
let fileHandle;
importBtn.addEventListener("click", async () => {
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
    const json = JSON.parse(fileText).transactions;

    function verifyJSON(json) {
        if (!json) {
            alert("No transaction data found!");
            return false;
        } else {
            for (i = 0; i < json.length; i++) {
                if (
                    Object.keys(json[i]).includes("id")
                    && Object.keys(json[i]).includes("amount")
                    && Object.keys(json[i]).includes("description")
                    && Object.keys(json[i]).includes("category")
                    && Object.keys(json[i]).includes("createdAt")
                    && typeof (json[i].id) == "number"
                    && typeof (json[i].amount) == "number"
                    && typeof (json[i].description) == "string"
                    && typeof (json[i].category) == "string"
                    && typeof (json[i].createdAt) == "string"
                ) {
                    continue;
                } else {
                    return false;
                }
            }
            return true;
        }
    }

    if (verifyJSON(json)) {
        let data = JSON.parse(localStorage.getItem("data")) || null;

        if (data == null || data.transactions == null) {
            data = { ...data, transactions: json };
        } else {
            let newJSON = json;
            for (i = 0; i < json.length; i++) {
                newJSON[i].id = data.transactions[data.transactions.length - 1].id + (i + 1);
            }
            let newTransactions = data.transactions.concat(newJSON);

            data = { ...data, transactions: newTransactions };
        }

        localStorage.setItem("data", JSON.stringify(data));
        showData(data.transactions, "", data.currency || "$");
        exportButton.classList.remove("hid");
        options.classList.remove("hidd")
    }
});

let exportHandle;
exportButton.addEventListener("click", async () => {
    const data = JSON.stringify(JSON.parse(localStorage.getItem("data")).transactions);
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
    await stream.close()
})