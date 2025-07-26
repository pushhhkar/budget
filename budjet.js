"use strict";

const errorMssgEl = document.querySelector('.error_message');
const budgetInputEl = document.querySelector('.budget_input');
const ExpenseDesEl = document.querySelector('.expense_input');
const ExpenseAmountEl = document.querySelector('.expense_amount');
const tblrecordEl = document.querySelector(".table_data");
const cardscontainer = document.querySelector(".cards");

const budgetcardEl = document.querySelector(".budget_card");
const expensescardEl = document.querySelector(".expenses-card");
const balancecardEl = document.querySelector(".balance-card");

let itemlist = [];
let itemId = 0;

function loadExpensesFromAPI() {
    fetch("https://budget-backend-z56u.onrender.com/transactions/")
        .then(res => res.json())
        .then(data => {
            itemlist = data.map((item) => ({
                id: item.id,
                title: item.title,
                amount: item.amount
            }));
            tblrecordEl.innerHTML = ""; // clear table
            itemlist.forEach(exp => addExpenses(exp));
            showBalance();
        });
}

function btnEvents() {
    const btnBudgetCal = document.querySelector('#btn_budget');
    const btnExpensesCal = document.querySelector('#btn_expenses');

    btnBudgetCal.addEventListener('click', (e) => {
        e.preventDefault();
        budgetFunc();
    });
    btnExpensesCal.addEventListener('click', (e) => {
        e.preventDefault();
        expensesFun();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    btnEvents();           
    loadExpensesFromAPI(); 
});

function expensesFun() {
    let expensesDescvalue = ExpenseDesEl.value;
    let expensesAmountValue = ExpenseAmountEl.value;

    if (expensesDescvalue === "" || expensesAmountValue === "" || parseInt(budgetInputEl.value) < 0) {
        errorMessage("please Enter Expenses Desc or Expenses Amount!");
    } else {
        let amount = parseInt(expensesAmountValue);
        ExpenseAmountEl.value = "";
        ExpenseDesEl.value = "";


        fetch("https://budget-backend-z56u.onrender.com/add_transaction/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: expensesDescvalue,
                amount: amount,
                type: "expense"
            })
        })
        .then(res => res.json())
        .then(() => {
            loadExpensesFromAPI(); 
        });

    }
}

function addExpenses(expenesesPara) {
    const html = `<ul class="tbl_tr_content">
        <li data-id=${expenesesPara.id}>${expenesesPara.id}</li>
        <li>${expenesesPara.title}</li>
        <li><span>Rs </span>${expenesesPara.amount}</li>
        <li>
            <button type="button" class="btn_edit">Edit</button>
            <button type="button" class="btn_delete">Delete</button>
        </li>
    </ul>`;

    tblrecordEl.insertAdjacentHTML("beforeend", html);

    const btnEdit = document.querySelectorAll('.btn_edit');
    const btnDel = document.querySelectorAll('.btn_delete');
    const content_id = document.querySelectorAll('.tbl_tr_content');

    btnEdit.forEach((btnedit) => {
        btnedit.addEventListener("click", (el) => {
            let id = el.target.closest(".tbl_tr_content").querySelector("li").dataset.id;

            let element = el.target.closest(".tbl_tr_content");
            element.remove();

            let expenses = itemlist.filter(function (item) {
                return item.id == id;
            });
            ExpenseDesEl.value = expenses[0].title;
            ExpenseAmountEl.value = expenses[0].amount;

            let templist = itemlist.filter(function (item) {
                return item.id != id;
            });
            itemlist = templist;
            showBalance();
        });
    });

    btnDel.forEach((btnDel) => {
        btnDel.addEventListener("click", (el) => {
            let id = el.target.closest(".tbl_tr_content").querySelector("li").dataset.id;

            let element = el.target.closest(".tbl_tr_content");
            element.remove();

            let templist = itemlist.filter(function (item) {
                return item.id != id;
            });
            itemlist = templist;
            showBalance();
        });
    });
}

function budgetFunc() {
    const budgetvalue = budgetInputEl.value;

    if (!budgetvalue || budgetvalue <= 0) {
        errorMessage("Please Enter Your Budget or more than 0");
    } else {
        budgetcardEl.textContent = budgetvalue;
        budgetInputEl.value = "";
        showBalance();
    }
}

function showBalance() {
    const expenses = totalExpenses();
    const total = parseInt(budgetcardEl.textContent) - expenses;
    balancecardEl.textContent = total;
}

function totalExpenses() {
    let total = 0;

    if (itemlist.length > 0) {
        total = itemlist.reduce(function (acc, curr) {
            acc += curr.amount;
            return acc;
        }, 0);
    }
    expensescardEl.textContent = total;
    return total;
}

function errorMessage(message) {
    errorMssgEl.innerHTML = `<p>${message}</p>`;
    errorMssgEl.classList.add('error');
    setTimeout(() => {
        errorMssgEl.classList.remove("error");
    }, 2500);
}