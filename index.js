const menu = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const items = document.querySelectorAll('.nav-item');
const form = document.getElementById("transactionForm");
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const transactionList = document.getElementById("transactionList");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const addBudgetBtn = document.getElementById("addBudgetBtn");
const addGoalBtn = document.getElementById("addGoalBtn");
const budgetList = document.getElementById("budgetList");
const goalList = document.getElementById("goalList");
let transactions = [];
menu.addEventListener('click', () => {

  sidebar.classList.toggle('hide');
  style = getComputedStyle(sidebar);
  if (style.width === '250px') {
    menu.textContent = 'Menu';
  } else {
    menu.textContent = 'Close';
  }
});
items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const transaction = {
    amount: Number(amount),
    category: category,
    type: type,
    date: date
  };
  transactions.push(transaction);
  renderTransactions();
  updateSummary(); // 🔥 MUST BE HERE
  form.reset();
});
navItems.forEach(item => {
  item.addEventListener('click', () => {
    // remove active from all
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    // hide all sections
    sections.forEach(section => section.classList.add('hidden'));
    // show selected section
    const target = item.getAttribute('data-target');
    document.getElementById(target).classList.remove('hidden');
  });
});
function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((txn) => {
    const div = document.createElement("div");
    div.classList.add("txn-item");
    div.innerHTML = `
      <p>${txn.category} - ₹${txn.amount}</p>
      <span>${txn.type}</span>
      <span>${txn.date}</span>
      <button onclick="deleteTransaction(${transactions.indexOf(txn)})">❌</button>
    `;
    transactionList.appendChild(div);
  });
}
function deleteTransaction(index) {
  transactions.splice(index, 1); 
  renderTransactions(); 
  updateSummary(); 
}
// calucation function
function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(txn => {
    if (txn.type === "income") {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });
  const balance = income - expense;
  balanceEl.textContent = "₹ " + balance;
  incomeEl.textContent = "₹ " + income;
  expenseEl.textContent = "₹ " + expense;
}

let budgets = [];
let goals = [];
addBudgetBtn.addEventListener("click", () => {
  const category = document.getElementById("budgetCategory").value;
  const amount = document.getElementById("budgetAmount").value;

  // check if category already exists
  const existing = budgets.find(b => b.category === category);

  if (existing) {
    existing.limit = Number(amount); // update instead of duplicate
  } else {
    budgets.push({
      category: category,
      limit: Number(amount)
    });
  }

  renderBudgets();
});
function renderBudgets() {
  budgetList.innerHTML = "";

  budgets.forEach((b) => {
    const div = document.createElement("div");

    div.classList.add("budget-item");

    div.innerHTML = `
      <p>${b.category} - ₹${b.limit}</p>
    `;

    budgetList.appendChild(div);
    document.getElementById("budgetCategory").value = "";
document.getElementById("budgetAmount").value = "";
  });
}
addGoalBtn.addEventListener("click", () => {
  const name = document.getElementById("goalName").value;
  const amount = document.getElementById("goalAmount").value;

  const goal = {
    name: name,
    target: Number(amount),
    saved: 0
  };

  goals.push(goal);
document.getElementById("goalName").value = "";
document.getElementById("goalAmount").value = "";
  renderGoals(); // 🔥 important
});
function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((g) => {
    const div = document.createElement("div");

    div.classList.add("goal-item");

    div.innerHTML = `
      <p>${g.name} - ₹${g.target}</p>
    `;

    goalList.appendChild(div);
  });
}