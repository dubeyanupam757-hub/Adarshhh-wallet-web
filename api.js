const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

if (user) {
    document.getElementById("homeName").textContent =
        [user.first_name, user.last_name].filter(Boolean).join(" ");

    document.getElementById("homeUsername").textContent =
        user.username ? "@" + user.username : "Username not set";

    document.getElementById("homeUserId").textContent =
        "User ID: " + user.id;
}
