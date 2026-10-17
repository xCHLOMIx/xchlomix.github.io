const transactions_amount = document.getElementById("transactions-amount");
const transactions_number = document.getElementById("transactions-number");
const topCategoryEl = document.getElementById("top-category");
const transactionList = document.getElementById("transactions");
const bars = document.getElementById("bars");
const labelsEl = document.getElementById("labels");
const messagePlace = document.getElementById("message-position")

const getRate = () => {
    const data = JSON.parse(localStorage.getItem("data"))
    let rate = 1;

    if (data == null || data.currency == null) {
        rate = 1;
    } else {
        switch (data.currency) {
            case "$":
                rate = 1;
                break;
            case "RWF":
                rate = 1478.18;
                break;
            case "KSH":
                rate = 130.10
                break;
        }
    }

    return rate;
}

const updateMessage = (data, total) => {
    let cap = 500 * getRate();
    let htmlCode;

    if (total * getRate() < cap) {
        htmlCode = `
            <div class="message" role="status" aria-live="polite" style="background: #BBF1D2;">
                <p style="color: black;">
                    Spent under ${data.currency || "$"} ${cap} nice!
                </p>
            </div>
        `;
    } else {
        htmlCode = `
            <div class="message" style="background: #FF9D9D;" rolate="status" aria-live="assertive">
                <p style="color: black;">
                    You spent over ${data.currency || "$"} ${cap.toLocaleString()}!
                </p>
            </div>
        `
    }

    messagePlace.innerHTML += htmlCode;
}

const updateTransactionsData = (data) => {
    let totalTransactionsAmount = 0;

    if (data == null || data.transactions == null) {
        transactions_amount.textContent = 0;
        transactions_number.textContent = 0;
    } else {
        for (i = 0; i < data.transactions.length; i++) {
            totalTransactionsAmount += data.transactions[i].amount;
        }

        function rankTransactionCategories(transactions) {
            let score = [];
            for (i = 0; i < transactions.length; i++) {
                let categoryRank = {
                    category: transactions[i].category,
                    count: 0
                }

                for (j = 0; j < transactions.length; j++) {
                    if (transactions[j].category == categoryRank.category) {
                        categoryRank.count += 1;
                    }
                }

                score.push(categoryRank);
            }

            return score;
        }

        const score = rankTransactionCategories(data.transactions).sort((a, b) => (a.category > b.category ? -1 : 0));
        const topCategory = score[0];
        
        updateMessage(data, totalTransactionsAmount);

        topCategoryEl.innerText = topCategory.category;
        transactions_amount.textContent = `${data.currency} ${(totalTransactionsAmount * getRate()).toLocaleString()}`;
        transactions_number.textContent = data.transactions.length;
    }
}

const updateTransactionList = (data) => {
    if (data == null || data.transactions == null) {
        transactionList.innerHTML = `
            <p style="color: grey; text-align: center;">
                No transactions yet.
            </p>
        `;
    } else {
        const sortedTransactions = data.transactions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 0));
        const topTransactions = sortedTransactions.filter((item, index) => index < 5);

        const htmlCode = topTransactions.map((item) => `
            <div class="item">
                <span class="first">${data.currency || "$"} ${(item.amount * getRate()).toLocaleString()}</span>
                <div class="text">
                    <h4>${item.description}</h4>
                    <span>${item.category}</span>
                </div>
            </div>
        `).join("");
        transactionList.innerHTML = htmlCode;
    }
}

const drawChart = (data, currency) => {
    if (data == null || data.transactions == null) { } else {
        const sortedData = data.transactions.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 0));
        let sorted = [];
        for (i = 0; i < sortedData.length; i++) {
            let day = `${(sortedData[i].createdAt).split("-")[0]}/${(sortedData[i].createdAt).split("-")[0]}`
            let transactionDay = {
                day: day,
                amount: 0
            }

            for (j = 0; j < sortedData.length; j++) {
                let innerDay = `${(sortedData[j].createdAt).split("-")[0]}/${(sortedData[j].createdAt).split("-")[0]}`;

                if (innerDay == transactionDay.day) {
                    transactionDay.amount += sortedData[j].amount;
                }
            }
            sorted.push(transactionDay);
        }
        const sevenTransactions = sorted.filter((item, index) => index < 7);

        let sum = 0;
        for (i = 0; i < sevenTransactions.length; i++) {
            sum += sevenTransactions[i].amount;
        }

        const htmlCode = sevenTransactions.map((item) => (
            `
            <div class="bar" style="height: ${item.amount / sum * 100}%"></div>
        `
        )).join("");

        bars.innerHTML = htmlCode;

        const labels = sevenTransactions.map((item) => (
            `
            <span>${item.day}</span>
        `
        )).join("");

        labelsEl.innerHTML = labels;
    }
};

const data = JSON.parse(localStorage.getItem("data")) || null;
updateTransactionsData(data);
updateTransactionList(data);
drawChart(data);