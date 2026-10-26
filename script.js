/* Все данные клиента живут здесь. Для нового клиента меняем только CONFIG. */
const CONFIG = {
  name: "Шина-Сервис",
  phone: "+7 (900) 000-00-00",
  phoneHref: "+79000000000",
  telegram: "https://t.me/example",
  whatsapp: "https://wa.me/79000000000",
  address: "г. Москва, ул. Примерная, д. 1",
  hours: "Ежедневно, 08:00–21:00",
  coords: { lat: 55.7512, lon: 37.6184 },
  radii: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  carTypes: [
    { id: "car", name: "Легковой", k: 1 },
    { id: "suv", name: "Кроссовер / внедорожник", k: 1.25 },
    { id: "van", name: "Микроавтобус", k: 1.5 },
  ],
  /* цена = base + (радиус - 13) * step, для легкового авто */
  services: [
    { id: "swap", name: "Снятие и установка", base: 600, step: 40 },
    { id: "mount", name: "Шиномонтаж", base: 1200, step: 100 },
    { id: "balance", name: "Балансировка", base: 800, step: 80 },
    { id: "repair", name: "Ремонт прокола (1 колесо)", base: 350, step: 0 },
    { id: "storage", name: "Сезонное хранение", base: 2000, step: 120 },
  ],
  facts: [
    { t: "от 30 минут", d: "на замену комплекта" },
    { t: "6 месяцев", d: "гарантия на работы" },
    { t: "Каждый день", d: "с 08:00 до 21:00" },
  ],
  why: [
    {
      t: "Честная цена",
      d: "Называем стоимость до начала работ и не добавляем лишнего.",
      i: "M20 12l-8 8-9-9V3h8z",
    },
    {
      t: "Быстро",
      d: "Заменим комплект шин за 30–60 минут, пока вы пьёте кофе.",
      i: "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z",
    },
    {
      t: "Гарантия",
      d: "Даём гарантию на все работы и исправляем бесплатно.",
      i: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
    },
    {
      t: "Современное оборудование",
      d: "Станки для шин низкого профиля и литых дисков.",
      i: "M8 12l3 3 5-6M12 3a9 9 0 100 18 9 9 0 000-18z",
    },
  ],
  reviews: [
    {
      n: "Алексей",
      s: 5,
      t: "Записался онлайн, приехал в назначенное время и уехал через 40 минут. Цена совпала с калькулятором.",
      d: "12 октября",
    },
    {
      n: "Марина",
      s: 5,
      t: "Поменяли резину на кроссовере, аккуратно, без царапин на дисках. Приеду весной.",
      d: "3 октября",
    },
    {
      n: "Игорь",
      s: 4,
      t: "Хорошо отремонтировали прокол. В выходной было немного людей, но подождал недолго.",
      d: "21 сентября",
    },
    {
      n: "Ольга",
      s: 5,
      t: "Оставила шины на хранение, весной заберу. Удобно, что не нужно держать их дома.",
      d: "15 сентября",
    },
  ],
};

const $ = (s) => document.querySelector(s);
const rub = (n) => (Math.round(n / 10) * 10).toLocaleString("ru-RU") + " ₽";
const price = (s, r) => s.base + (r - 13) * s.step;
const C = CONFIG;

/* привязка данных из CONFIG к разметке */
const links = {
  tel: "tel:" + C.phoneHref,
  tg: C.telegram,
  wa: C.whatsapp,
  route: `https://www.google.com/maps/dir/?api=1&destination=${C.coords.lat},${C.coords.lon}`,
};
document
  .querySelectorAll("[data-cfg]")
  .forEach((e) => (e.textContent = C[e.dataset.cfg]));
document
  .querySelectorAll("[data-href]")
  .forEach((e) => (e.href = links[e.dataset.href]));
const { lat, lon } = C.coords;
$("#map").src =
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.006},${lat - 0.004},${lon + 0.006},${lat + 0.004}&layer=mapnik&marker=${lat},${lon}`;

/* факты, преимущества, отзывы */
$("#facts").innerHTML = C.facts
  .map((f) => `<li><b>${f.t}</b><span>${f.d}</span></li>`)
  .join("");
$("#whyList").innerHTML = C.why
  .map(
    (w) =>
      `<div class="card"><div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${w.i}"/></svg></div><h3>${w.t}</h3><p>${w.d}</p></div>`,
  )
  .join("");
$("#reviewList").innerHTML = C.reviews
  .map(
    (r) =>
      `<figure class="card" style="margin:0"><div class="stars" role="img" aria-label="Оценка ${r.s} из 5">${"★".repeat(r.s)}${"☆".repeat(5 - r.s)}</div><p>${r.t}</p><p class="who"><b>${r.n}</b>, ${r.d}</p></figure>`,
  )
  .join("");

/* прайс */
$("#priceTable").innerHTML =
  "<thead><tr><th>Радиус</th>" +
  C.services.map((s) => `<th>${s.name}</th>`).join("") +
  "</tr></thead><tbody>" +
  C.radii
    .map(
      (r) =>
        `<tr><td>R${r}</td>` +
        C.services.map((s) => `<td>${rub(price(s, r))}</td>`).join("") +
        "</tr>",
    )
    .join("") +
  "</tbody>";
$("#priceNote").textContent =
  "Цены для легковых авто. " +
  C.carTypes
    .slice(1)
    .map((c) => `${c.name}: +${Math.round((c.k - 1) * 100)}%`)
    .join(", ") +
  ".";

/* калькулятор */
$("#carType").innerHTML = C.carTypes
  .map((c) => `<option value="${c.id}">${c.name}</option>`)
  .join("");
$("#radius").innerHTML = C.radii
  .map(
    (r) => `<option value="${r}" ${r === 16 ? "selected" : ""}>R${r}</option>`,
  )
  .join("");
$("#calcServices").innerHTML = C.services
  .map(
    (s) =>
      `<label class="chk-i"><input type="checkbox" value="${s.id}" ${s.id === "mount" || s.id === "balance" ? "checked" : ""}> ${s.name}</label>`,
  )
  .join("");
function calc() {
  const car = C.carTypes.find((c) => c.id === $("#carType").value),
    r = +$("#radius").value;
  const chosen = C.services.filter(
    (s) => $(`#calcServices input[value="${s.id}"]`).checked,
  );
  const total = chosen.reduce((sum, s) => sum + price(s, r), 0) * car.k;
  $("#sum").textContent = "от " + rub(total);
  return {
    text: `${chosen.map((s) => s.name).join(", ") || "Услуги не выбраны"} (R${r}, ${car.name.toLowerCase()}), от ${rub(total)}`,
    empty: !chosen.length,
  };
}
document
  .querySelectorAll("#carType,#radius,#calcServices")
  .forEach((e) => e.addEventListener("change", calc));
calc();

/* меню */
const nav = $("#nav"),
  burger = $(".burger");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  }
});
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        nav
          .querySelectorAll("a")
          .forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + e.target.id,
            ),
          );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
nav.querySelectorAll("a").forEach((a) => io.observe($(a.getAttribute("href"))));

/* запись */
const dlg = $("#dlg"),
  form = $("#form"),
  svc = $("#f-service");
$("#f-time").innerHTML =
  '<option value="">Выберите время</option>' +
  Array.from({ length: 13 }, (_, i) => {
    const h = String(8 + i).padStart(2, "0") + ":00";
    return `<option>${h}</option>`;
  }).join("");
const today = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);
function openBooking(prefill) {
  form.reset();
  form.hidden = false;
  $("#ok").hidden = true;
  form.querySelectorAll(".err").forEach((e) => (e.textContent = ""));
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((e) => e.removeAttribute("aria-invalid"));
  $("#f-date").min = today();
  svc.innerHTML =
    C.services.map((s) => `<option>${s.name}</option>`).join("") +
    "<option>Другое или не знаю</option>";
  if (prefill) {
    svc.insertAdjacentHTML(
      "afterbegin",
      `<option selected>${prefill}</option>`,
    );
  }
  dlg.showModal();
}
document
  .querySelectorAll("[data-book]")
  .forEach((b) => b.addEventListener("click", () => openBooking()));
$("#calcBook").addEventListener("click", () => {
  const c = calc();
  openBooking(c.empty ? "" : c.text);
});
dlg.addEventListener("click", (e) => {
  if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close();
}); /* фон, крестик; Esc работает сам */

const rules = {
  name: (v) => v.trim().length < 2 && "Введите имя",
  phone: (v) =>
    !/^\+?[\d\s()-]{10,18}$/.test(v.trim()) &&
    "Введите телефон, например +7 900 000-00-00",
  car: (v) => !v.trim() && "Укажите марку и модель",
  date: (v) =>
    !v ? "Выберите дату" : v < today() && "Дата не может быть в прошлом",
  time: (v) => !v && "Выберите время",
  consent: (v, el) => !el.checked && "Нужно ваше согласие",
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let first = null;
  Object.keys(rules).forEach((k) => {
    const el = form.elements[k],
      msg = rules[k](el.value, el);
    el.closest(".f").querySelector(".err").textContent = msg || "";
    if (msg) {
      el.setAttribute("aria-invalid", "true");
      first = first || el;
    } else el.removeAttribute("aria-invalid");
  });
  if (first) return first.focus();
  const data = Object.fromEntries(new FormData(form));
  /* ДЕМО: здесь подключаем отправку (Telegram-бот, email, CRM) вместо console.log */
  console.log("Новая запись:", data);
  form.hidden = true;
  $("#ok").hidden = false;
});
