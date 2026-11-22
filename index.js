const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let currentUserId = "";

async function init() {
  currentUserId = uidFromUrl; // URL me ?uid=123456789 hai to wo use hoga
  document.getElementById("userName").textContent = API.getUserName();
  document.getElementById("userId").textContent = currentUserId;
  await loadBalance();
  await loadTransactions(10, 0);
}

async function loadBalance() {
  try {
    const res = await API.getBalance(currentUserId);
    if (res.ok) {
      document.getElementById("balAmt").textContent = "₹" + res.balance.toFixed(2);
    }
  } catch (e) {
    console.error("Balance load failed", e);
  }
}

async function loadTransactions(limit, offset) {
  try {
    const res = await API.getTransactions(currentUserId, limit, offset);
    if (res.ok) {
      renderTransactions(res.transactions);
    }
  } catch (e) {
    console.error("Transactions load failed", e);
  }
}

function renderTransactions(txns) {
  const container = document.getElementById("txList");
  if (txns.length === 0) {
    container.innerHTML = '<p class="empty">No transactions yet</p>';
    return;
  }
  container.innerHTML = txns.map(t => `
    <div class="tx-item" onclick="openTxDetail(${JSON.stringify(t).replace(/"/g, '&quot;')})">
      <div class="tx-icon">${iconForKind(t.kind)}</div>
      <div class="tx-details">
        <div class="tx-title">${escapeHtml(t.kind)}</div>
        <div class="tx-sub">${escapeHtml(t.note)} · ${t.date}</div>
      </div>
      <div class="tx-amount ${t.amount >= 0 ? 'pos' : 'neg'}">${t.amount >= 0 ? '+' : ''}₹${Math.abs(t.amount).toFixed(2)}</div>
    </div>
  `).join("");
}

function iconForKind(kind) {
  const k = kind.toLowerCase();
  if (k.includes("payment") || k.includes("sent")) return "➤";
  if (k.includes("bonus") || k.includes("gift")) return "🎁";
  if (k.includes("withdraw")) return "💸";
  if (k.includes("received")) return "⬅";
  return "📝";
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function openTxDetail(t) {
  document.getElementById("txModalContent").innerHTML = `
    <h3>Transaction Details</h3>
    <div class="detail-row"><span>Type</span><strong>${escapeHtml(t.kind)}</strong></div>
    <div class="detail-row"><span>Amount</span><strong class="${t.amount >= 0 ? 'pos' : 'neg'}">${t.amount >= 0 ? '+' : ''}₹${Math.abs(t.amount).toFixed(2)}</strong></div>
    <div class="detail-row"><span>Note</span><strong>${escapeHtml(t.note)}</strong></div>
    <div class="detail-row"><span>Status</span><strong>${escapeHtml(t.status)}</strong></div>
    <div class="detail-row"><span>Date</span><strong>${escapeHtml(t.date)}</strong></div>
  `;
  document.getElementById("txModal").style.display = "flex";
}

function closeTxModal() {
  document.getElementById("txModal").style.display = "none";
}

function openViewAll() {
  window.location.href = "transactions.html";
}

init();
