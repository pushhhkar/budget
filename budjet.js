"use strict";

const errorMssgEl = document.querySelector('.error_message');
const budgetInputEl = document.querySelector('.budget_input');
const ExpenseDelEl = document.querySelector('.expense_input');
const ExpenseAmountEl = document.querySelector('expense_amount');
const tblrecordEl = document.querySelector(".table_data");
const cardscontainer = document.querySelector(".cards");


const budgetcardEl = document.querySelector(".budget_card");
const expensescardEl = document.querySelector(".expenses-card");
const balancecardEl = document.querySelector(".balance-card");

let itemlist = [];
let itemId = 0;

function btnEvents(){
    const btnBudgetCal = document.querySelector('#btn_budget');
    const btnExpensesCal = document.querySelector('#btn_expenses');

    btnBudgetCal.addEventListener('click', (e) => {
        e.preventDefault();
        budgetFunc();
    });
    btnExpensesCal.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Expenses");
    });
}

document.addEventListener("DOMContentLoaded", btnEvents);

function budgetFunc() {
    const budgetvalue = budgetInputEl.value;

    if (!budgetvalue || budgetvalue <= 0){
            errorMessage("Please Enter Your Budget or more than 0")
    }else{
          budgetcardEl.textContent = budgetvalue;
          budgetInputEl.value = "";
          showBalance()
    }
}

function showBalance(){
    const expenses = totalExpenses();
    const total = parseInt(budgetcardEl.textContent) - expenses;
    balancecardEl.textContent = total;
}

function totalExpenses(){
    let total = 50;
    
   // if(itemlist.length > 0){
     //   total = itemlist.reduce(function(acc, curr){
       //     acc += curr.expensesAmountEl;
        //},0)
    //}
    return total;
}

function errorMessage(message) {
    errorMssgEl.innerHTML = ` <p>${message}</p>`;
        errorMssgEl.classList.add('error');
        setTimeout(()=>{
            errorMssgEl.classList.remove("error");
        }, 2500)

}