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
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let financialChart;
let budgetChart;
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("budgets", JSON.stringify(budgets));
  localStorage.setItem("goals", JSON.stringify(goals));
}
menu.addEventListener('click', () => {

  sidebar.classList.toggle('hide');
 const style = getComputedStyle(sidebar);
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
  if (!amount || amount <= 0) {
  alert("Enter valid amount");
  return;
}
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const transaction = {
    amount: Number(amount),
    category: category.toLowerCase(),
    type: type,
    date: date
  };
transactions.push(transaction);
saveData();
renderTransactions();
updateSummary();
renderBudgets();
renderGoals();
renderFinancialChart();
renderBudgetChart();
updateDataSummary();
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

  const searchTerm =
    document.getElementById("searchTransaction")
    .value
    .toLowerCase();

  const filterType =
    document.getElementById("filterType")
    .value;

  const filteredTransactions =
    transactions.filter(txn => {

      const matchesSearch =
        txn.category
          .toLowerCase()
          .includes(searchTerm);

      const matchesType =
        filterType === "all" ||
        txn.type === filterType;

      return matchesSearch && matchesType;
    });

  filteredTransactions.forEach(txn => {

    const div = document.createElement("div");

    div.classList.add("txn-item");

    div.innerHTML = `
      <p>${txn.category} - ₹${txn.amount}</p>
      <span>${txn.type}</span>
      <span>${txn.date}</span>

      <button onclick="deleteTransaction(${transactions.indexOf(txn)})">
        ❌
      </button>
    `;

    transactionList.appendChild(div);
  });
}
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  renderTransactions();
  updateSummary();
  renderBudgets();
  renderGoals();
  renderFinancialChart();
  updateDataSummary();
  renderBudgetChart();
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
 renderGoals();
}
addBudgetBtn.addEventListener("click", () => {
  const category = document.getElementById("budgetCategory").value;
  const amount = document.getElementById("budgetAmount").value;
  if (!amount || amount <= 0) {
  alert("Enter valid budget amount");
  return;
}
  const existing = budgets.find(b => b.category === category.toLowerCase());
  if (existing) {
    existing.limit = Number(amount); // update instead of duplicate
  } else {
    budgets.push({
      category: category.toLowerCase(),
      limit: Number(amount)
    });
  }
  renderBudgets();
  renderBudgetChart();
  renderGoals();
  document.getElementById("budgetCategory").value = "";
document.getElementById("budgetAmount").value = "";
saveData();
updateDataSummary();
});
addGoalBtn.addEventListener("click", () => {
  const name = document.getElementById("goalName").value;
  const amount = document.getElementById("goalAmount").value;
 if (!name.trim() || !amount || amount <= 0) {
    alert("Please enter Goal Name and Amount");
    return;
  }
  goals.push({
    name: name,
    target: Number(amount)
  });
 saveData();
  document.getElementById("goalName").value = "";
  document.getElementById("goalAmount").value = "";
  renderGoals();
  updateDataSummary();
});
function renderGoals() {
  goalList.innerHTML = "";
  let income = 0;
  let expense = 0;
  transactions.forEach(txn => {
    if (txn.type === "income") {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });
  const currentBalance = income - expense;
  goals.forEach((g) => {
    const percent = Math.max(
    0,
    Math.min((currentBalance / g.target) * 100,100)
    );
    const remaining = g.target - currentBalance;
    let message = "";
    let color = "#ef4444";
    if (currentBalance >= g.target) {
     message = "🎉 Goal Completed";
  color = "#22c55e";
    } else {
      message = `❌ More ₹${remaining.toLocaleString()} is needed`;
    }

    const div = document.createElement("div");

    div.classList.add("goal-item");

div.innerHTML = `
  <h3>${g.name} - ₹${g.target.toLocaleString()}</h3>

  <div class="progress-bar">
    <div class="progress"
         style="width:${percent}%; background:${color};">
    </div>
  </div>

  <p style="margin-top:10px;color:${color};font-weight:bold;">
    ${message}
  </p>
  <div style="margin-top:10px;">
    <button style="background-color:#3b82f6; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer;" onclick="editGoal(${goals.indexOf(g)})">
      Edit
    </button>

    <button style="background-color:#ef4444; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer;" onclick="deleteGoal(${goals.indexOf(g)})">
      Delete
    </button>
  </div>
  ${
    currentBalance >= g.target
      ? `<button class="goal-complete-btn"
           onclick="completeGoal(${goals.indexOf(g)})">
           Goal Completed
         </button>`
      : ""
  }
   
`;
    goalList.appendChild(div);
  });
}
function completeGoal(index) {
  goals.splice(index, 1);
 saveData();
  renderGoals();
  updateDataSummary();
}
function renderBudgets() {
  budgetList.innerHTML = "";
  budgets.forEach((b) => {
    let spent = 0;
    transactions.forEach(txn => {
      if (
        txn.type === "expense" &&
       txn.category.trim().toLowerCase() ===
b.category.trim().toLowerCase()
      ) {
        spent += txn.amount;
      }
    });
    const remaining = b.limit - spent;
  const percent =
  b.limit > 0
  ? Math.min((spent / b.limit) * 100,100)
  : 0;
    const isExceeded = spent > b.limit;
    const div = document.createElement("div");
    div.classList.add("budget-item");
    div.innerHTML = `
      <h3>
        ${b.category.charAt(0).toUpperCase() + b.category.slice(1)}
      </h3>
      <p>
        <span style="
          color:${isExceeded ? '#ef4444' : '#22c55e'};
          font-weight:bold;
        ">
          ₹${spent}
        </span>
        / ₹${b.limit}
      </p>
      <p style="
        color:${isExceeded ? '#ef4444' : '#22c55e'};
        font-weight:bold;
      ">
        ${
          isExceeded
            ? `⚠️ Exceeded By ₹${Math.abs(remaining)}`
            : `Remaining ₹${remaining}`
        }
      </p>
      <div class="progress-bar">
        <div
          class="progress"
          style="
            width:${percent}%;
            background:${isExceeded ? '#ef4444' : '#22c55e'};
          "
        ></div>
      </div>
      <div style="margin-top:10px;">
        <button style="background-color:#3b82f6; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer;" onclick="editBudget(${budgets.indexOf(b)})">
          Edit
        </button>
      
        <button  style="background-color:#ef4444; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer;" onclick="deleteBudget(${budgets.indexOf(b)})">
          Delete
        </button>
      </div>
    `;
    budgetList.appendChild(div);
  });
}
function deleteBudget(index) {
  budgets.splice(index, 1);

  saveData();
  renderBudgets();
  renderBudgetChart();
  updateDataSummary();
}
function editBudget(index) {

  const newAmount = prompt(
    "Enter new budget amount",
    budgets[index].limit
  );

  if (!newAmount || newAmount <= 0) return;

  budgets[index].limit = Number(newAmount);

  saveData();
  renderBudgets();
  renderBudgetChart();
  updateDataSummary();
}
function deleteGoal(index) {
  goals.splice(index, 1);
  saveData();
  renderGoals();
  updateDataSummary();
}
function editGoal(index) {

  const newTarget = prompt(
    "Enter new target amount",
    goals[index].target
  );

  if (!newTarget || newTarget <= 0) return;

  goals[index].target = Number(newTarget);

  saveData();
  renderGoals();
  updateDataSummary();
}

function renderFinancialChart() {

  const monthlyData = {};

  transactions.forEach(txn => {

    if (!txn.date) return;

    const month = txn.date.slice(0, 7);

    if (!monthlyData[month]) {
      monthlyData[month] = {
        income: 0,
        expense: 0
      };
    }

    if (txn.type === "income") {
      monthlyData[month].income += txn.amount;
    } else {
      monthlyData[month].expense += txn.amount;
    }

  });

  const labels = Object.keys(monthlyData).sort();

  const incomeData = [];
  const expenseData = [];
  const balanceData = [];

  labels.forEach(month => {

    const income = monthlyData[month].income;
    const expense = monthlyData[month].expense;
    const balance = income - expense;

    incomeData.push(income);
    expenseData.push(expense);
    balanceData.push(balance);

  });
  const ctx = document.getElementById("financialChart");

if (financialChart) {
  financialChart.destroy();
}

financialChart = new Chart(ctx, {
  type: "line",

  data: {
    labels: labels,

    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#22c55e",
        tension: 0.3
      },

      {
        label: "Expense",
        data: expenseData,
        borderColor: "#ef4444",
        tension: 0.3
      },

      {
        label: "Balance",
        data: balanceData,
        borderColor: "#3b82f6",
        tension: 0.3
      }
    ]
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },

      y: {
        ticks: {
          color: "white"
        }
      }
    }
  }
});

}
function renderBudgetChart() {

  const labels = [];
  const budgetData = [];
  const spentData = [];

  budgets.forEach((b) => {

    let spent = 0;

    transactions.forEach((txn) => {

      if (
        txn.type === "expense" &&
        txn.category.trim().toLowerCase() ===
        b.category.trim().toLowerCase()
      ) {
        spent += txn.amount;
      }

    });

    labels.push(
      b.category.charAt(0).toUpperCase() +
      b.category.slice(1)
    );

    budgetData.push(b.limit);
    spentData.push(spent);

  });
  const ctx = document.getElementById("budgetChart");

if (budgetChart) {
  budgetChart.destroy();
}

budgetChart = new Chart(ctx, {
  type: "bar",

  data: {
    labels: labels,

    datasets: [
      {
        label: "Budget",
        data: budgetData,
        backgroundColor: "#3b82f6"
      },

      {
        label: "Actual Spending",
        data: spentData,
        backgroundColor: "#ef4444"
      }
    ]
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },

      y: {
        ticks: {
          color: "white"
        }
      }
    }
  }
});

}
function updateDataSummary(){

  const summary = document.getElementById("dataSummary");

  summary.innerHTML = `
     <div class="summary-grid">

    <div class="summary-box">
      <h4>Transactions</h4>
      <p>${transactions.length}</p>
    </div>

    <div class="summary-box">
      <h4>Budgets</h4>
      <p>${budgets.length}</p>
    </div>

    <div class="summary-box">
      <h4>Goals</h4>
      <p>${goals.length}</p>
    </div>

  </div>
  `;
}
function clearAllData() {

  const confirmDelete = confirm(
    "Are you sure you want to delete all data?"
  );

  if (!confirmDelete) return;

  transactions = [];
  budgets = [];
  goals = [];

  localStorage.removeItem("transactions");
  localStorage.removeItem("budgets");
  localStorage.removeItem("goals");

  renderTransactions();
  renderBudgets();
  renderGoals();
  updateSummary();

  renderFinancialChart();
  renderBudgetChart();

  updateDataSummary();
}
document
.getElementById("clearDataBtn")
.addEventListener("click", clearAllData);

document
.getElementById("exportBtn")
.addEventListener("click", exportData);

document
.getElementById("searchTransaction")
.addEventListener("input", renderTransactions);

document
.getElementById("filterType")
.addEventListener("change", renderTransactions);

renderTransactions();
updateSummary();
renderBudgets();
renderGoals();
renderFinancialChart();
renderBudgetChart();
updateDataSummary();
function exportData() {

  const data = {
    transactions,
    budgets,
    goals
  };

  const jsonData = JSON.stringify(data, null, 2);

  const blob = new Blob(
    [jsonData],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "cookiefinance-data.json";

  link.click();

  URL.revokeObjectURL(url);
}