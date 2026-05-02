const STORAGE_KEYS = {
  transactions: "pula-portfolio-transactions",
  investments: "pula-portfolio-investments",
  bankAccounts: "pula-portfolio-bank-accounts",
  cards: "pula-portfolio-cards",
  debts: "pula-portfolio-debts",
};

const defaultBankAccounts = [
  { name: "Account 1", balance: 0 },
  { name: "Account 2", balance: 0 },
  { name: "Account 3", balance: 0 },
];

const BWP_TO_USD_RATE = 0.074572;
const EXCHANGE_RATE_DATE = "2026-04-16";

const state = {
  transactions: [],
  investments: [],
  bankAccounts: [...defaultBankAccounts],
  cards: [],
  debts: [],
};

const els = {
  appShell: document.getElementById("appShell"),
  form: document.getElementById("transactionForm"),
  type: document.getElementById("type"),
  amount: document.getElementById("amount"),
  category: document.getElementById("category"),
  date: document.getElementById("date"),
  description: document.getElementById("description"),
  duplicateHint: document.getElementById("duplicateHint"),
  investmentForm: document.getElementById("investmentForm"),
  investmentDate: document.getElementById("investmentDate"),
  investmentName: document.getElementById("investmentName"),
  investmentAmount: document.getElementById("investmentAmount"),
  investmentRate: document.getElementById("investmentRate"),
  investmentExpected: document.getElementById("investmentExpected"),
  investmentReceived: document.getElementById("investmentReceived"),
  investmentLoss: document.getElementById("investmentLoss"),
  investmentNotes: document.getElementById("investmentNotes"),
  investmentPreviewInterest: document.getElementById("investmentPreviewInterest"),
  investmentPreviewExpected: document.getElementById("investmentPreviewExpected"),
  bankForm: document.getElementById("bankForm"),
  bankName1: document.getElementById("bankName1"),
  bankBalance1: document.getElementById("bankBalance1"),
  bankName2: document.getElementById("bankName2"),
  bankBalance2: document.getElementById("bankBalance2"),
  bankName3: document.getElementById("bankName3"),
  bankBalance3: document.getElementById("bankBalance3"),
  bankAccountsSummary: document.getElementById("bankAccountsSummary"),
  cardForm: document.getElementById("cardForm"),
  cardLabel: document.getElementById("cardLabel"),
  cardBank: document.getElementById("cardBank"),
  cardLast4: document.getElementById("cardLast4"),
  cardNetwork: document.getElementById("cardNetwork"),
  cardNotes: document.getElementById("cardNotes"),
  cardList: document.getElementById("cardList"),
  debtForm: document.getElementById("debtForm"),
  debtCreditor: document.getElementById("debtCreditor"),
  debtPrincipal: document.getElementById("debtPrincipal"),
  debtInterestRate: document.getElementById("debtInterestRate"),
  debtDueDate: document.getElementById("debtDueDate"),
  debtAmountPaid: document.getElementById("debtAmountPaid"),
  debtType: document.getElementById("debtType"),
  debtNotes: document.getElementById("debtNotes"),
  debtPreviewInterest: document.getElementById("debtPreviewInterest"),
  debtPreviewTotalDue: document.getElementById("debtPreviewTotalDue"),
  debtPreviewOutstanding: document.getElementById("debtPreviewOutstanding"),
  debtPreviewStatus: document.getElementById("debtPreviewStatus"),
  debtPreviewPercent: document.getElementById("debtPreviewPercent"),
  debtPreviewBar: document.getElementById("debtPreviewBar"),
  debtTableBody: document.getElementById("debtTableBody"),
  debtPrincipalTotal: document.getElementById("debtPrincipalTotal"),
  debtInterestTotal: document.getElementById("debtInterestTotal"),
  debtTotalDue: document.getElementById("debtTotalDue"),
  debtTotalPaid: document.getElementById("debtTotalPaid"),
  debtOutstanding: document.getElementById("debtOutstanding"),
  collapseAllBtn: document.getElementById("collapseAllBtn"),
  expandAllBtn: document.getElementById("expandAllBtn"),
  exportStatementBtn: document.getElementById("exportStatementBtn"),
  totalIncome: document.getElementById("totalIncome"),
  totalExpense: document.getElementById("totalExpense"),
  netSavings: document.getElementById("netSavings"),
  transactionCount: document.getElementById("transactionCount"),
  currentBalance: document.getElementById("currentBalance"),
  balanceNote: document.getElementById("balanceNote"),
  bankTotal: document.getElementById("bankTotal"),
  bankAccountsTotal: document.getElementById("bankAccountsTotal"),
  totalDebtOutstanding: document.getElementById("totalDebtOutstanding"),
  totalAssets: document.getElementById("totalAssets"),
  totalAssetsBwp: document.getElementById("totalAssetsBwp"),
  exchangeRateLabel: document.getElementById("exchangeRateLabel"),
  exchangeRateNote: document.getElementById("exchangeRateNote"),
  universalTotal: document.getElementById("universalTotal"),
  categorySummary: document.getElementById("categorySummary"),
  monthlySummary: document.getElementById("monthlySummary"),
  quickTemplates: document.getElementById("quickTemplates"),
  transactionTableBody: document.getElementById("transactionTableBody"),
  investmentTableBody: document.getElementById("investmentTableBody"),
  filterType: document.getElementById("filterType"),
  searchInput: document.getElementById("searchInput"),
  exportBtn: document.getElementById("exportBtn"),
  importFile: document.getElementById("importFile"),
  seedDemoBtn: document.getElementById("seedDemoBtn"),
  totalInvested: document.getElementById("totalInvested"),
  totalExpected: document.getElementById("totalExpected"),
  totalReceived: document.getElementById("totalReceived"),
  totalLosses: document.getElementById("totalLosses"),
  investmentProfit: document.getElementById("investmentProfit"),
  stillExpected: document.getElementById("stillExpected"),
  chartEmpty: document.getElementById("chartEmpty"),
  portfolioChart: document.getElementById("portfolioChart"),
};

function formatCurrency(value) {
  return `P${Number(value || 0).toLocaleString("en-BW", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatUsd(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
}

function byDateDesc(a, b, field = "date") {
  const dateCompare = (b[field] || "").localeCompare(a[field] || "");
  if (dateCompare !== 0) {
    return dateCompare;
  }
  return (b.createdAt || "").localeCompare(a.createdAt || "");
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions));
  localStorage.setItem(STORAGE_KEYS.investments, JSON.stringify(state.investments));
  localStorage.setItem(STORAGE_KEYS.bankAccounts, JSON.stringify(state.bankAccounts));
  localStorage.setItem(STORAGE_KEYS.cards, JSON.stringify(state.cards));
  localStorage.setItem(STORAGE_KEYS.debts, JSON.stringify(state.debts));
}

function loadState() {
  state.transactions = safeParse(localStorage.getItem(STORAGE_KEYS.transactions), []);
  state.investments = safeParse(localStorage.getItem(STORAGE_KEYS.investments), []);
  state.cards = safeParse(localStorage.getItem(STORAGE_KEYS.cards), []);
  state.debts = safeParse(localStorage.getItem(STORAGE_KEYS.debts), []);
  const bankAccounts = safeParse(localStorage.getItem(STORAGE_KEYS.bankAccounts), defaultBankAccounts);
  state.bankAccounts = [...defaultBankAccounts].map((fallback, index) => ({
    name: bankAccounts[index]?.name || fallback.name,
    balance: Number(bankAccounts[index]?.balance || 0),
  }));
}

function migrateLegacyData() {
  state.transactions = state.transactions.map((item) => ({
    ...item,
    amount: Number(item.amount),
    createdAt: item.createdAt || new Date().toISOString(),
  }));
  state.investments = state.investments.map((item) => ({
    ...item,
    amount: Number(item.amount),
    expected: Number(item.expected),
    received: Number(item.received),
    loss: Number(item.loss),
    createdAt: item.createdAt || new Date().toISOString(),
  }));
  state.cards = state.cards.map((item) => ({
    ...item,
    last4: String(item.last4 || "").slice(-4),
    createdAt: item.createdAt || new Date().toISOString(),
  }));
  state.debts = state.debts.map((item) => ({
    ...item,
    principal: Number(item.principal),
    interestRate: Number(item.interestRate || 0),
    amountPaid: Number(item.amountPaid || 0),
    createdAt: item.createdAt || new Date().toISOString(),
  }));
  saveState();
}

function sortedTransactions() {
  return [...state.transactions].sort((a, b) => byDateDesc(a, b, "date"));
}

function sortedInvestments() {
  return [...state.investments].sort((a, b) => byDateDesc(a, b, "date"));
}

function sortedDebts() {
  return [...state.debts].sort((a, b) => byDateDesc(a, b, "dueDate"));
}

function debtMetrics(item) {
  const interest = item.principal * (item.interestRate / 100);
  const totalDue = item.principal + interest;
  const outstanding = Math.max(totalDue - item.amountPaid, 0);
  return { interest, totalDue, outstanding };
}

function previewDebtMetrics() {
  const principal = Number(els.debtPrincipal.value || 0);
  const interestRate = Number(els.debtInterestRate.value || 0);
  const amountPaid = Number(els.debtAmountPaid.value || 0);
  const interest = principal * (interestRate / 100);
  const totalDue = principal + interest;
  const outstanding = Math.max(totalDue - amountPaid, 0);
  const progress = totalDue > 0 ? Math.min((amountPaid / totalDue) * 100, 100) : 0;

  let status = "Awaiting debt values";
  if (totalDue > 0 && amountPaid <= 0) {
    status = "Not paid yet";
  } else if (totalDue > 0 && progress > 0 && progress < 100) {
    status = "Partially paid";
  } else if (totalDue > 0 && progress >= 100) {
    status = "Fully paid";
  }

  return { interest, totalDue, outstanding, progress, status };
}

function personalTotals() {
  const income = state.transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = state.transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, balance: income - expense };
}

function investmentTotals() {
  const invested = state.investments.reduce((sum, item) => sum + item.amount, 0);
  const expected = state.investments.reduce((sum, item) => sum + item.expected, 0);
  const received = state.investments.reduce((sum, item) => sum + item.received, 0);
  const losses = state.investments.reduce((sum, item) => sum + item.loss, 0);
  const profit = received - invested - losses;
  const outstanding = Math.max(expected - received - losses, 0);
  return { invested, expected, received, losses, profit, outstanding };
}

function previewInvestmentMetrics() {
  const amount = Number(els.investmentAmount.value || 0);
  const rate = Number(els.investmentRate.value || 0);
  const interest = amount * (rate / 100);
  const expected = amount + interest;
  return { interest, expected };
}

function debtTotals() {
  return state.debts.reduce((totals, item) => {
    const metrics = debtMetrics(item);
    totals.principal += item.principal;
    totals.interest += metrics.interest;
    totals.totalDue += metrics.totalDue;
    totals.paid += item.amountPaid;
    totals.outstanding += metrics.outstanding;
    return totals;
  }, { principal: 0, interest: 0, totalDue: 0, paid: 0, outstanding: 0 });
}

function bankTotal() {
  return state.bankAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
}

function similarTransactions(date, category, description, amount, type) {
  const normalizedCategory = normalizeText(category);
  const normalizedDescription = normalizeText(description);
  const numericAmount = Number(amount || 0);

  return state.transactions.filter((item) => {
    const sameDate = item.date === date;
    const sameType = item.type === type;
    const sameCategory = normalizeText(item.category) === normalizedCategory;
    const descriptionSimilar =
      normalizeText(item.description) === normalizedDescription ||
      normalizeText(item.description).includes(normalizedDescription) ||
      normalizedDescription.includes(normalizeText(item.description));
    const amountClose = Math.abs(Number(item.amount) - numericAmount) < 0.01;
    return sameDate && sameType && ((sameCategory && descriptionSimilar) || (sameCategory && amountClose));
  });
}

function frequentTemplates() {
  const map = new Map();
  state.transactions.forEach((item) => {
    const key = [item.type, normalizeText(item.category), normalizeText(item.description), Number(item.amount).toFixed(2)].join("|");
    if (!map.has(key)) {
      map.set(key, {
        type: item.type,
        category: item.category,
        description: item.description,
        amount: Number(item.amount),
        count: 0,
      });
    }
    map.get(key).count += 1;
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.amount - b.amount).slice(0, 6);
}

function filteredTransactions() {
  const filterType = els.filterType.value;
  const searchTerm = normalizeText(els.searchInput.value);
  return sortedTransactions().filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const haystack = `${item.category} ${item.description}`.toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    return matchesType && matchesSearch;
  });
}

function monthlyBuckets() {
  const map = new Map();

  state.transactions.forEach((item) => {
    const month = item.date.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, { income: 0, expense: 0, investmentProfit: 0, debtOutstanding: 0 });
    }
    map.get(month)[item.type] += item.amount;
  });

  state.investments.forEach((item) => {
    const month = item.date.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, { income: 0, expense: 0, investmentProfit: 0, debtOutstanding: 0 });
    }
    map.get(month).investmentProfit += item.received - item.amount - item.loss;
  });

  state.debts.forEach((item) => {
    const month = item.dueDate.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, { income: 0, expense: 0, investmentProfit: 0, debtOutstanding: 0 });
    }
    map.get(month).debtOutstanding += debtMetrics(item).outstanding;
  });

  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function renderDuplicateHint() {
  const matches = similarTransactions(els.date.value, els.category.value, els.description.value, els.amount.value, els.type.value);
  if (!els.date.value || !els.category.value.trim() || !els.description.value.trim() || !els.amount.value || !matches.length) {
    els.duplicateHint.textContent = "";
    els.duplicateHint.className = "inline-note hidden full-width";
    return;
  }
  const sample = matches[0];
  els.duplicateHint.textContent = `Similar entry found on ${sample.date}: ${sample.category} - ${sample.description} (${formatCurrency(sample.amount)}).`;
  els.duplicateHint.className = "inline-note full-width";
}

function renderKPIs() {
  const personal = personalTotals();
  const investment = investmentTotals();
  const debts = debtTotals();
  const banks = bankTotal();
  const assets = banks + investment.outstanding;
  const assetsUsd = assets * BWP_TO_USD_RATE;
  const universal = banks + investment.outstanding - debts.outstanding;

  els.totalIncome.textContent = formatCurrency(personal.income);
  els.totalExpense.textContent = formatCurrency(personal.expense);
  els.netSavings.textContent = formatCurrency(personal.balance);
  els.transactionCount.textContent = String(state.transactions.length);
  els.currentBalance.textContent = formatCurrency(banks || personal.balance);
  els.bankTotal.textContent = formatCurrency(banks);
  els.bankAccountsTotal.textContent = formatCurrency(banks);
  els.totalDebtOutstanding.textContent = formatCurrency(debts.outstanding);
  els.totalAssetsBwp.textContent = formatCurrency(assets);
  els.totalAssets.textContent = formatUsd(assetsUsd);
  els.exchangeRateLabel.textContent = `1 BWP = ${formatUsd(BWP_TO_USD_RATE)}`;
  els.exchangeRateNote.textContent = `Using a BWP to USD reference rate of ${BWP_TO_USD_RATE.toFixed(6)} from April 16, 2026.`;
  els.universalTotal.textContent = formatCurrency(universal);
  els.balanceNote.textContent = banks
    ? "Live account balances are now driving your main balance view."
    : personal.balance >= 0
      ? "Your personal cashflow is currently positive."
      : "Your personal spending is currently ahead of your income.";

  els.totalInvested.textContent = formatCurrency(investment.invested);
  els.totalExpected.textContent = formatCurrency(investment.expected);
  els.totalReceived.textContent = formatCurrency(investment.received);
  els.totalLosses.textContent = formatCurrency(investment.losses);
  els.investmentProfit.textContent = formatCurrency(investment.profit);
  els.stillExpected.textContent = formatCurrency(investment.outstanding);

  els.debtPrincipalTotal.textContent = formatCurrency(debts.principal);
  els.debtInterestTotal.textContent = formatCurrency(debts.interest);
  els.debtTotalDue.textContent = formatCurrency(debts.totalDue);
  els.debtTotalPaid.textContent = formatCurrency(debts.paid);
  els.debtOutstanding.textContent = formatCurrency(debts.outstanding);
}

function renderInvestmentPreview() {
  const metrics = previewInvestmentMetrics();
  els.investmentExpected.value = metrics.expected ? metrics.expected.toFixed(2) : "";
  els.investmentPreviewInterest.textContent = formatCurrency(metrics.interest);
  els.investmentPreviewExpected.textContent = formatCurrency(metrics.expected);
}

function renderCategorySummary() {
  const expenseMap = new Map();
  state.transactions.filter((item) => item.type === "expense").forEach((item) => {
    expenseMap.set(item.category, (expenseMap.get(item.category) || 0) + item.amount);
  });
  const items = [...expenseMap.entries()].sort((a, b) => b[1] - a[1]);
  if (!items.length) {
    els.categorySummary.className = "summary-list empty-state";
    els.categorySummary.textContent = "No spending categories yet.";
    return;
  }
  els.categorySummary.className = "summary-list";
  els.categorySummary.innerHTML = items.map(([category, amount]) => `
    <div class="summary-item">
      <span>${category}</span>
      <strong>${formatCurrency(amount)}</strong>
    </div>
  `).join("");
}

function renderQuickTemplates() {
  const templates = frequentTemplates();
  if (!templates.length) {
    els.quickTemplates.className = "chip-list empty-state";
    els.quickTemplates.textContent = "Your common transactions will appear here.";
    return;
  }
  els.quickTemplates.className = "chip-list";
  els.quickTemplates.innerHTML = templates.map((template, index) => `
    <button class="chip-button" type="button" data-template-index="${index}">
      ${template.description} &middot; ${formatCurrency(template.amount)} &middot; x${template.count}
    </button>
  `).join("");
}

function renderMonthlySummary() {
  const items = monthlyBuckets();
  if (!items.length) {
    els.monthlySummary.className = "summary-list empty-state";
    els.monthlySummary.textContent = "Your monthly summary will appear once you start adding entries.";
    return;
  }
  els.monthlySummary.className = "summary-list";
  els.monthlySummary.innerHTML = items.map(([month, values]) => {
    const personalNet = values.income - values.expense;
    const universalNet = personalNet + values.investmentProfit - values.debtOutstanding;
    return `
      <div class="summary-item">
        <div>
          <strong>${month}</strong>
          <div class="summary-meta">Personal Net ${formatCurrency(personalNet)} | Investment Profit ${formatCurrency(values.investmentProfit)} | Debt ${formatCurrency(values.debtOutstanding)}</div>
        </div>
        <strong class="${universalNet >= 0 ? "amount-income" : "amount-expense"}">${formatCurrency(universalNet)}</strong>
      </div>
    `;
  }).join("");
}

function renderBankAccounts() {
  els.bankName1.value = state.bankAccounts[0]?.name || "";
  els.bankBalance1.value = state.bankAccounts[0]?.balance || "";
  els.bankName2.value = state.bankAccounts[1]?.name || "";
  els.bankBalance2.value = state.bankAccounts[1]?.balance || "";
  els.bankName3.value = state.bankAccounts[2]?.name || "";
  els.bankBalance3.value = state.bankAccounts[2]?.balance || "";
  els.bankAccountsSummary.innerHTML = state.bankAccounts.map((account) => `
    <div class="summary-item">
      <span>${account.name || "Unnamed Account"}</span>
      <strong>${formatCurrency(account.balance)}</strong>
    </div>
  `).join("");
}

function renderCards() {
  if (!state.cards.length) {
    els.cardList.className = "summary-list bank-summary empty-state";
    els.cardList.textContent = "No masked card profiles yet.";
    return;
  }
  els.cardList.className = "summary-list bank-summary";
  els.cardList.innerHTML = [...state.cards].sort((a, b) => byDateDesc(a, b, "createdAt")).map((card) => `
    <div class="summary-item">
      <div>
        <strong>${card.label}</strong>
        <div class="summary-meta">${card.bank} ${card.network} ending ${card.last4}${card.notes ? ` | ${card.notes}` : ""}</div>
      </div>
      <button class="delete-button" type="button" data-card-id="${card.id}">Delete</button>
    </div>
  `).join("");
}

function renderTransactionTable() {
  const items = filteredTransactions();
  if (!items.length) {
    els.transactionTableBody.innerHTML = '<tr><td colspan="6" class="empty-row">No matching transactions.</td></tr>';
    return;
  }
  els.transactionTableBody.innerHTML = items.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td><span class="type-pill ${item.type === "income" ? "type-income" : "type-expense"}">${item.type}</span></td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td class="${item.type === "income" ? "amount-income" : "amount-expense"}">${item.type === "income" ? "+" : "-"}${formatCurrency(item.amount)}</td>
      <td><button class="delete-button" type="button" data-transaction-id="${item.id}">Delete</button></td>
    </tr>
  `).join("");
}

function renderDebtTable() {
  const items = sortedDebts();
  if (!items.length) {
    els.debtTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">No debt entries yet.</td></tr>';
    return;
  }
  els.debtTableBody.innerHTML = items.map((item) => {
    const metrics = debtMetrics(item);
    return `
      <tr>
        <td>${item.dueDate}</td>
        <td><strong>${item.creditor}</strong><div class="summary-meta">${item.type}${item.notes ? ` | ${item.notes}` : ""}</div></td>
        <td>${formatCurrency(item.principal)}</td>
        <td>${formatCurrency(metrics.interest)}</td>
        <td>${formatCurrency(metrics.totalDue)}</td>
        <td>${formatCurrency(item.amountPaid)}</td>
        <td class="${metrics.outstanding > 0 ? "amount-expense" : "amount-income"}">${formatCurrency(metrics.outstanding)}</td>
        <td><button class="delete-button" type="button" data-debt-id="${item.id}">Delete</button></td>
      </tr>
    `;
  }).join("");
}

function renderInvestmentTable() {
  const items = sortedInvestments();
  if (!items.length) {
    els.investmentTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">No investment entries yet.</td></tr>';
    return;
  }
  els.investmentTableBody.innerHTML = items.map((item) => {
    const profit = item.received - item.amount - item.loss;
    return `
      <tr>
        <td>${item.date}</td>
        <td><strong>${item.name}</strong><div class="summary-meta">${item.notes}</div></td>
        <td>${formatCurrency(item.amount)}</td>
        <td>${formatCurrency(item.expected)}</td>
        <td>${formatCurrency(item.received)}</td>
        <td>${formatCurrency(item.loss)}</td>
        <td class="${profit >= 0 ? "amount-income" : "amount-expense"}">${formatCurrency(profit)}</td>
        <td><button class="delete-button" type="button" data-investment-id="${item.id}">Delete</button></td>
      </tr>
    `;
  }).join("");
}

function renderChart() {
  const months = monthlyBuckets().reverse();
  if (!months.length) {
    els.chartEmpty.style.display = "block";
    els.portfolioChart.innerHTML = "";
    return;
  }
  els.chartEmpty.style.display = "none";
  const chartWidth = 760;
  const chartHeight = 320;
  const padding = 36;
  const barWidth = 18;
  const gap = 10;
  const monthGap = 28;
  const values = months.flatMap(([, entry]) => [entry.income - entry.expense, entry.investmentProfit, -entry.debtOutstanding]);
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1);
  const zeroY = chartHeight / 2;
  const scale = (chartHeight / 2 - padding) / maxAbs;
  const axis = `<line x1="${padding}" y1="${zeroY}" x2="${chartWidth - padding}" y2="${zeroY}" stroke="rgba(31,42,32,0.22)" stroke-width="2" />`;
  const bars = months.map(([month, entry], index) => {
    const valuesForMonth = [
      { value: entry.income - entry.expense, color: "#167c5a" },
      { value: entry.investmentProfit, color: "#c28b2c" },
      { value: -entry.debtOutstanding, color: "#b84c37" },
    ];
    const groupX = padding + index * (barWidth * 3 + gap * 2 + monthGap);
    const rects = valuesForMonth.map((bar, barIndex) => {
      const height = Math.abs(bar.value) * scale;
      const y = bar.value >= 0 ? zeroY - height : zeroY;
      const x = groupX + barIndex * (barWidth + gap);
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="6" fill="${bar.color}" opacity="0.9"></rect>`;
    }).join("");
    return `${rects}<text x="${groupX + barWidth + gap}" y="${chartHeight - 16}" text-anchor="middle" fill="#6d6c63" font-size="12">${month.slice(5)}</text>`;
  }).join("");
  els.portfolioChart.innerHTML = `${axis}${bars}`;
}

function renderDebtPreview() {
  const metrics = previewDebtMetrics();
  els.debtPreviewInterest.textContent = formatCurrency(metrics.interest);
  els.debtPreviewTotalDue.textContent = formatCurrency(metrics.totalDue);
  els.debtPreviewOutstanding.textContent = formatCurrency(metrics.outstanding);
  els.debtPreviewStatus.textContent = metrics.status;
  els.debtPreviewPercent.textContent = `${Math.round(metrics.progress)}%`;
  els.debtPreviewBar.style.width = `${metrics.progress}%`;
}

function render() {
  renderDuplicateHint();
  renderKPIs();
  renderCategorySummary();
  renderQuickTemplates();
  renderMonthlySummary();
  renderBankAccounts();
  renderCards();
  renderTransactionTable();
  renderDebtTable();
  renderDebtPreview();
  renderInvestmentPreview();
  renderInvestmentTable();
  renderChart();
}

function collapsePanel(panel, collapsed) {
  panel.classList.toggle("is-collapsed", collapsed);
}

function setupPanelToggles() {
  document.querySelectorAll(".panel").forEach((panel) => {
    const head = panel.querySelector(".panel-head");
    if (!head || head.querySelector(".panel-toggle")) {
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-button panel-toggle";
    button.textContent = "Minimize";
    button.addEventListener("click", () => {
      const collapsed = !panel.classList.contains("is-collapsed");
      collapsePanel(panel, collapsed);
      button.textContent = collapsed ? "Expand" : "Minimize";
    });
    head.appendChild(button);
  });
}

function setAllPanels(collapsed) {
  document.querySelectorAll(".panel").forEach((panel) => collapsePanel(panel, collapsed));
  document.querySelectorAll(".panel-toggle").forEach((button) => {
    button.textContent = collapsed ? "Expand" : "Minimize";
  });
}

function applyTemplate(index) {
  const template = frequentTemplates()[index];
  if (!template) {
    return;
  }
  els.type.value = template.type;
  els.amount.value = template.amount.toFixed(2);
  els.category.value = template.category;
  els.description.value = template.description;
  if (!els.date.value) {
    els.date.value = todayISO();
  }
  renderDuplicateHint();
}

function addTransaction(transaction) {
  state.transactions.push(transaction);
  saveState();
  render();
}

function addInvestment(investment) {
  state.investments.push(investment);
  saveState();
  render();
}

function addCard(card) {
  state.cards.push(card);
  saveState();
  render();
}

function addDebt(debt) {
  state.debts.push(debt);
  saveState();
  render();
}

function deleteById(listName, id) {
  state[listName] = state[listName].filter((item) => item.id !== id);
  saveState();
  render();
}

function handleTransactionSubmit(event) {
  event.preventDefault();
  const amount = Number(els.amount.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }
  addTransaction({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type: els.type.value,
    amount,
    category: els.category.value.trim(),
    date: els.date.value,
    description: els.description.value.trim(),
  });
  els.form.reset();
  els.date.value = todayISO();
  els.type.value = "income";
  renderDuplicateHint();
}

function handleInvestmentSubmit(event) {
  event.preventDefault();
  const amount = Number(els.investmentAmount.value);
  const expected = Number(els.investmentExpected.value);
  const interestRate = Number(els.investmentRate.value);
  const received = Number(els.investmentReceived.value);
  const loss = Number(els.investmentLoss.value);
  if ([amount, expected, interestRate, received, loss].some((value) => !Number.isFinite(value) || value < 0) || amount <= 0) {
    return;
  }
  addInvestment({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    date: els.investmentDate.value,
    name: els.investmentName.value.trim(),
    amount,
    interestRate,
    expected,
    received,
    loss,
    notes: els.investmentNotes.value.trim(),
  });
  els.investmentForm.reset();
  els.investmentDate.value = todayISO();
  els.investmentRate.value = "";
  els.investmentExpected.value = "";
  els.investmentReceived.value = "0";
  els.investmentLoss.value = "0";
  renderInvestmentPreview();
}

function handleBankSubmit(event) {
  event.preventDefault();
  state.bankAccounts = [
    { name: els.bankName1.value.trim() || "Account 1", balance: Number(els.bankBalance1.value || 0) },
    { name: els.bankName2.value.trim() || "Account 2", balance: Number(els.bankBalance2.value || 0) },
    { name: els.bankName3.value.trim() || "Account 3", balance: Number(els.bankBalance3.value || 0) },
  ];
  saveState();
  render();
}

function handleCardSubmit(event) {
  event.preventDefault();
  const last4 = els.cardLast4.value.trim();
  if (!/^\d{4}$/.test(last4)) {
    return;
  }
  addCard({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    label: els.cardLabel.value.trim(),
    bank: els.cardBank.value.trim(),
    last4,
    network: els.cardNetwork.value,
    notes: els.cardNotes.value.trim(),
  });
  els.cardForm.reset();
}

function handleDebtSubmit(event) {
  event.preventDefault();
  const principal = Number(els.debtPrincipal.value);
  const interestRate = Number(els.debtInterestRate.value || 0);
  const amountPaid = Number(els.debtAmountPaid.value || 0);
  if (![principal, interestRate, amountPaid].every((value) => Number.isFinite(value)) || principal <= 0) {
    return;
  }
  addDebt({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    creditor: els.debtCreditor.value.trim(),
    principal,
    interestRate,
    dueDate: els.debtDueDate.value,
    amountPaid,
    type: els.debtType.value,
    notes: els.debtNotes.value.trim(),
  });
  els.debtForm.reset();
  els.debtDueDate.value = todayISO();
  els.debtAmountPaid.value = "0";
  renderDebtPreview();
}

function exportJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    transactions: state.transactions,
    investments: state.investments,
    bankAccounts: state.bankAccounts,
    cards: state.cards,
    debts: state.debts,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `tumelo-live-financial-portfolio-${todayISO()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportStatement() {
  const personal = personalTotals();
  const investment = investmentTotals();
  const debts = debtTotals();
  const banks = bankTotal();
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Financial Statement</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1f2a20; }
        h1, h2 { margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>TUMELO UTLWANANG BOJOSI LIVE FINACIAL PORTFOLIO</h1>
      <p>Statement Date: ${todayISO()}</p>
      <h2>Summary</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Income</td><td>${formatCurrency(personal.income)}</td></tr>
        <tr><td>Total Spending</td><td>${formatCurrency(personal.expense)}</td></tr>
        <tr><td>Bank Total</td><td>${formatCurrency(banks)}</td></tr>
        <tr><td>Investment Outstanding</td><td>${formatCurrency(investment.outstanding)}</td></tr>
        <tr><td>Debt Outstanding</td><td>${formatCurrency(debts.outstanding)}</td></tr>
        <tr><td>Universal Total</td><td>${formatCurrency(banks + investment.outstanding - debts.outstanding)}</td></tr>
      </table>
      <h2>Transactions</h2>
      <table><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th></tr>${sortedTransactions().map((item) => `<tr><td>${item.date}</td><td>${item.type}</td><td>${item.category}</td><td>${item.description}</td><td>${formatCurrency(item.amount)}</td></tr>`).join("")}</table>
      <h2>Investments</h2>
      <table><tr><th>Date</th><th>Name</th><th>Invested</th><th>Expected</th><th>Received</th><th>Loss</th></tr>${sortedInvestments().map((item) => `<tr><td>${item.date}</td><td>${item.name}</td><td>${formatCurrency(item.amount)}</td><td>${formatCurrency(item.expected)}</td><td>${formatCurrency(item.received)}</td><td>${formatCurrency(item.loss)}</td></tr>`).join("")}</table>
      <h2>Debts</h2>
      <table><tr><th>Due Date</th><th>Creditor</th><th>Principal</th><th>Interest</th><th>Total Due</th><th>Paid</th><th>Outstanding</th></tr>${sortedDebts().map((item) => { const m = debtMetrics(item); return `<tr><td>${item.dueDate}</td><td>${item.creditor}</td><td>${formatCurrency(item.principal)}</td><td>${formatCurrency(m.interest)}</td><td>${formatCurrency(m.totalDue)}</td><td>${formatCurrency(item.amountPaid)}</td><td>${formatCurrency(m.outstanding)}</td></tr>`; }).join("")}</table>
    </body>
    </html>
  `;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `financial-statement-${todayISO()}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state.transactions = Array.isArray(parsed.transactions) ? parsed.transactions : [];
      state.investments = Array.isArray(parsed.investments) ? parsed.investments : [];
      state.cards = Array.isArray(parsed.cards) ? parsed.cards : [];
      state.debts = Array.isArray(parsed.debts) ? parsed.debts : [];
      state.bankAccounts = [...defaultBankAccounts].map((fallback, index) => ({
        name: parsed.bankAccounts?.[index]?.name || fallback.name,
        balance: Number(parsed.bankAccounts?.[index]?.balance || 0),
      }));
      migrateLegacyData();
      render();
      event.target.value = "";
    } catch {
      alert("That file could not be imported.");
    }
  };
  reader.readAsText(file);
}

function seedDemoData() {
  if (state.transactions.length || state.investments.length || state.debts.length) {
    return;
  }
  state.transactions = [
    { id: crypto.randomUUID(), createdAt: "2026-04-21T10:00:00.000Z", type: "income", amount: 5200, category: "Salary", date: "2026-04-01", description: "Monthly salary" },
    { id: crypto.randomUUID(), createdAt: "2026-04-21T10:01:00.000Z", type: "expense", amount: 18.48, category: "Food", date: "2026-04-03", description: "Pie and drink" },
    { id: crypto.randomUUID(), createdAt: "2026-04-21T10:02:00.000Z", type: "expense", amount: 18.48, category: "Food", date: "2026-04-06", description: "Pie and drink" },
    { id: crypto.randomUUID(), createdAt: "2026-04-21T10:03:00.000Z", type: "expense", amount: 1200, category: "Rent", date: "2026-04-12", description: "Room rent" },
    { id: crypto.randomUUID(), createdAt: "2026-04-21T10:04:00.000Z", type: "income", amount: 850, category: "Side Hustle", date: "2026-04-09", description: "Freelance payment" },
  ];
  state.investments = [
    { id: crypto.randomUUID(), createdAt: "2026-04-21T11:00:00.000Z", date: "2026-04-05", name: "Student Loan A", amount: 1000, interestRate: 30, expected: 1300, received: 900, loss: 0, notes: "Partially paid back" },
    { id: crypto.randomUUID(), createdAt: "2026-04-21T11:01:00.000Z", date: "2026-04-15", name: "Teacher Advance", amount: 1500, interestRate: 30, expected: 1950, received: 1950, loss: 0, notes: "Completed deal" },
  ];
  state.debts = [
    { id: crypto.randomUUID(), createdAt: "2026-04-21T11:10:00.000Z", creditor: "Family Loan", principal: 900, interestRate: 10, dueDate: "2026-04-28", amountPaid: 250, type: "borrowed", notes: "Short-term help" },
  ];
  state.cards = [
    { id: crypto.randomUUID(), createdAt: "2026-04-21T11:15:00.000Z", label: "Main Debit", bank: "FNB Botswana", last4: "4821", network: "Visa", notes: "Daily spending card" },
  ];
  state.bankAccounts = [
    { name: "FNB Main", balance: 2450.25 },
    { name: "Orange Money", balance: 680.10 },
    { name: "Savings", balance: 5000.00 },
  ];
  saveState();
  render();
}

function bindEvents() {
  els.form.addEventListener("submit", handleTransactionSubmit);
  els.investmentForm.addEventListener("submit", handleInvestmentSubmit);
  els.investmentForm.addEventListener("click", (event) => {
    const button = event.target.closest("[data-investment-rate]");
    if (!button) {
      return;
    }
    els.investmentRate.value = button.dataset.investmentRate;
    renderInvestmentPreview();
  });
  els.bankForm.addEventListener("submit", handleBankSubmit);
  els.cardForm.addEventListener("submit", handleCardSubmit);
  els.debtForm.addEventListener("submit", handleDebtSubmit);
  els.filterType.addEventListener("change", renderTransactionTable);
  els.searchInput.addEventListener("input", renderTransactionTable);
  els.exportBtn.addEventListener("click", exportJson);
  els.exportStatementBtn.addEventListener("click", exportStatement);
  els.importFile.addEventListener("change", importData);
  els.seedDemoBtn.addEventListener("click", seedDemoData);
  els.collapseAllBtn.addEventListener("click", () => setAllPanels(true));
  els.expandAllBtn.addEventListener("click", () => setAllPanels(false));
  [els.type, els.amount, els.category, els.date, els.description].forEach((element) => {
    element.addEventListener("input", renderDuplicateHint);
    element.addEventListener("change", renderDuplicateHint);
  });
  [els.investmentAmount, els.investmentRate].forEach((element) => {
    element.addEventListener("input", renderInvestmentPreview);
    element.addEventListener("change", renderInvestmentPreview);
  });

  els.quickTemplates.addEventListener("click", (event) => {
    const button = event.target.closest("[data-template-index]");
    if (button) {
      applyTemplate(Number(button.dataset.templateIndex));
    }
  });

  els.debtForm.addEventListener("click", (event) => {
    const button = event.target.closest("[data-debt-interest]");
    if (!button) {
      return;
    }
    els.debtInterestRate.value = button.dataset.debtInterest;
    renderDebtPreview();
  });

  [els.debtPrincipal, els.debtInterestRate, els.debtAmountPaid, els.debtDueDate, els.debtCreditor].forEach((element) => {
    element.addEventListener("input", renderDebtPreview);
    element.addEventListener("change", renderDebtPreview);
  });

  els.transactionTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-transaction-id]");
    if (button) {
      deleteById("transactions", button.dataset.transactionId);
    }
  });

  els.investmentTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-investment-id]");
    if (button) {
      deleteById("investments", button.dataset.investmentId);
    }
  });

  els.debtTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-debt-id]");
    if (button) {
      deleteById("debts", button.dataset.debtId);
    }
  });

  els.cardList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-id]");
    if (button) {
      deleteById("cards", button.dataset.cardId);
    }
  });
}

function init() {
  loadState();
  migrateLegacyData();
  els.date.value = todayISO();
  els.investmentDate.value = todayISO();
  els.investmentRate.value = "";
  els.investmentExpected.value = "";
  els.debtDueDate.value = todayISO();
  els.investmentReceived.value = "0";
  els.investmentLoss.value = "0";
  els.debtAmountPaid.value = "0";
  setupPanelToggles();
  bindEvents();
  render();
}

init();