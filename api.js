// api.js - WebApp initData के साथ webhook कॉल करता है
const API = {
  async call(command, data = {}, method = "GET") {
    const tg = window.Telegram.WebApp;
    const initData = tg?.initData || "";
    const url = `${window.BOT_CONFIG.webhookBase}/${command}`;
    
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData
      }
    };
    if (method !== "GET") options.body = JSON.stringify(data);
    
    const res = await fetch(url, options);
    return res.json();
  },
  
  // Convenience methods
  getBalance(uid) { return this.call("webhook_balance", { uid }, "GET"); },
  getTransactions(uid, limit = 10, offset = 0) { 
    return this.call(`webhook_transactions?uid=${uid}&limit=${limit}&offset=${offset}`); 
  },
  getGiftHistory(uid) { return this.call("webhook_gift_history", { uid }, "GET"); },
  doAction(action, payload) { 
    return this.call("webhook_action", { action, ...payload, uid: this.getUserId() }, "POST"); 
  },
  
  getUserId() {
    const tg = window.Telegram.WebApp;
    return tg?.initDataUnsafe?.user?.id || "";
  },
  
  getUserName() {
    const tg = window.Telegram.WebApp;
    const u = tg?.initDataUnsafe?.user;
    return u?.username || u?.first_name || "User";
  }
};
