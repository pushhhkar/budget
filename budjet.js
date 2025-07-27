"use strict";

const errorMssgEl = document.querySelector('.error_message');
const budgetInputEl = document.querySelector('.budget_input');
const ExpenseDesEl = document.querySelector('.expense_input');
const ExpenseAmountEl = document.querySelector('.expense_amount');
const tblrecordEl = document.querySelector(".table_data");

const budgetcardEl = document.querySelector(".budget_card");
const expensescardEl = document.querySelector(".expenses-card");
const balancecardEl = document.querySelector(".balance-card");

let itemlist = [];

function loadExpensesFromAPI() {
    $.get("https://budget-backend-z56u.onrender.com/transactions/", function(data) {
        itemlist = data.map(item => ({
            id: item.id,
            title: item.title,
            amount: item.amount
        }));
        tblrecordEl.innerHTML = ""; 
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

        // Clear inputs
        ExpenseAmountEl.value = "";
        ExpenseDesEl.value = "";

        $.ajax({
            url: "https://budget-backend-z56u.onrender.com/add_transaction/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                title: expensesDescvalue,
                amount: amount,
                type: "expense"
            }),
            success: function() {
                loadExpensesFromAPI(); 
            }
        });
    }
}

function addExpenses(expense) {
    const html = `<ul class="tbl_tr_content">
        <li data-id=${expense.id}>${expense.id}</li>
        <li>${expense.title}</li>
        <li><span>Rs </span>${expense.amount}</li>
        <li>
            <button type="button" class="btn_edit">Edit</button>
            <button type="button" class="btn_delete">Delete</button>
        </li>
    </ul>`;

    tblrecordEl.insertAdjacentHTML("beforeend", html);

    const btnEdit = document.querySelectorAll('.btn_edit');
    const btnDel = document.querySelectorAll('.btn_delete');

    btnEdit.forEach((btnedit) => {
        btnedit.addEventListener("click", (el) => {
            let id = el.target.closest(".tbl_tr_content").querySelector("li").dataset.id;

            let element = el.target.closest(".tbl_tr_content");
            element.remove();

            let expenses = itemlist.filter(item => item.id == id);
            ExpenseDesEl.value = expenses[0].title;
            ExpenseAmountEl.value = expenses[0].amount;

            itemlist = itemlist.filter(item => item.id != id);
            showBalance();
        });
    });

    btnDel.forEach((btnDel) => {
        btnDel.addEventListener("click", (el) => {
            let id = el.target.closest(".tbl_tr_content").querySelector("li").dataset.id;

            let element = el.target.closest(".tbl_tr_content");
            element.remove();

            itemlist = itemlist.filter(item => item.id != id);
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
        total = itemlist.reduce((acc, curr) => acc + curr.amount, 0);
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