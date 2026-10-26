/* ==========================================================================
   Все данные клиента находятся в CONFIG.
   Для нового клиента меняем только этот объект.
   ========================================================================== */
const CONFIG = {
  name: "Шина-Сервис",
  phone: "+7 (900) 000-00-00",
  phoneHref: "+79000000000", // для ссылки tel: (только цифры и +)
  telegram: "https://t.me/example", // ссылка на Telegram клиента (меняется здесь)
  address: "г. Москва, ул. Примерная, д. 1",
  hours: "Ежедневно, 08:00–21:00",
  coords: { lat: 55.7512, lon: 37.6184 }, // координаты для карты и маршрута

  radii: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],

  // k: коэффициент к цене легкового авто
  carTypes: [
    { id: "car", name: "Легковой", k: 1 },
    { id: "suv", name: "Кроссовер / внедорожник", k: 1.25 },
    { id: "van", name: "Микроавтобус", k: 1.5 },
  ],

  // Цена услуги = base + (радиус - 13) * step
  services: [
    { id: "swap", name: "Снятие и установка", base: 600, step: 40 },
    { id: "mount", name: "Шиномонтаж", base: 1200, step: 100 },
    { id: "balance", name: "Балансировка", base: 800, step: 80 },
    { id: "repair", name: "Ремонт прокола (1 колесо)", base: 350, step: 0 },
    { id: "storage", name: "Сезонное хранение", base: 2000, step: 120 },
  ],

  facts: [
    { title: "от 30 минут", text: "на замену комплекта" },
    { title: "6 месяцев", text: "гарантия на работы" },
    { title: "Каждый день", text: "с 08:00 до 21:00" },
  ],

  // icon: путь для SVG (viewBox 24x24)
  why: [
    {
      title: "Честная цена",
      text: "Называем стоимость до начала работ и не добавляем лишнего.",
      icon: "M20 12l-8 8-9-9V3h8z",
    },
    {
      title: "Быстро",
      text: "Заменим комплект шин за 30–60 минут, пока вы пьёте кофе.",
      icon: "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z",
    },
    {
      title: "Гарантия",
      text: "Даём гарантию на все работы и исправляем бесплатно.",
      icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
    },
    {
      title: "Современное оборудование",
      text: "Станки для шин низкого профиля и литых дисков.",
      icon: "M8 12l3 3 5-6M12 3a9 9 0 100 18 9 9 0 000-18z",
    },
  ],

  reviews: [
    {
      name: "Алексей",
      stars: 5,
      date: "12 октября",
      text: "Записался онлайн, приехал в назначенное время и уехал через 40 минут. Цена совпала с калькулятором.",
    },
    {
      name: "Марина",
      stars: 5,
      date: "3 октября",
      text: "Поменяли резину на кроссовере, аккуратно, без царапин на дисках. Приеду весной.",
    },
    {
      name: "Игорь",
      stars: 4,
      date: "21 сентября",
      text: "Хорошо отремонтировали прокол. В выходной было немного людей, но подождал недолго.",
    },
    {
      name: "Ольга",
      stars: 5,
      date: "15 сентября",
      text: "Оставила шины на хранение, весной заберу. Удобно, что не нужно держать их дома.",
    },
  ],
};

/* ==========================================================================
   Вспомогательные функции
   ========================================================================== */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Округляем до 10 ₽ и добавляем разделители тысяч
function formatPrice(value) {
  return (Math.round(value / 10) * 10).toLocaleString("ru-RU") + " ₽";
}

// Цена услуги для легкового авто при заданном радиусе
function getPrice(service, radius) {
  return service.base + (radius - 13) * service.step;
}

// Сегодняшняя дата в формате YYYY-MM-DD (по местному времени)
function today() {
  const offset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - offset).toISOString().slice(0, 10);
}

/* ==========================================================================
   Данные из CONFIG в разметку
   ========================================================================== */
function bindConfig() {
  const { lat, lon } = CONFIG.coords;

  const links = {
    tel: "tel:" + CONFIG.phoneHref,
    tg: CONFIG.telegram,
    route: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
  };

  $$("[data-cfg]").forEach((el) => {
    el.textContent = CONFIG[el.dataset.cfg];
  });

  $$("[data-href]").forEach((el) => {
    el.href = links[el.dataset.href];
  });

  // Карта OpenStreetMap: область вокруг точки + маркер
  const bbox = [lon - 0.006, lat - 0.004, lon + 0.006, lat + 0.004].join(",");
  $("#map").src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

function renderFacts() {
  $("#facts").innerHTML = CONFIG.facts
    .map((fact) => `<li><b>${fact.title}</b><span>${fact.text}</span></li>`)
    .join("");
}

function renderWhy() {
  $("#whyList").innerHTML = CONFIG.why
    .map(
      (item) => `
        <div class="card">
          <div class="ico">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${item.icon}" /></svg>
          </div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>`
    )
    .join("");
}

function renderReviews() {
  $("#reviewList").innerHTML = CONFIG.reviews
    .map((review) => {
      const stars = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);
      return `
        <figure class="card" style="margin: 0">
          <div class="stars" role="img" aria-label="Оценка ${review.stars} из 5">${stars}</div>
          <p>${review.text}</p>
          <p class="who"><b>${review.name}</b>, ${review.date}</p>
        </figure>`;
    })
    .join("");
}

function renderPrices() {
  const head = CONFIG.services.map((s) => `<th>${s.name}</th>`).join("");

  const rows = CONFIG.radii
    .map((radius) => {
      const cells = CONFIG.services.map((s) => `<td>${formatPrice(getPrice(s, radius))}</td>`).join("");
      return `<tr><td>R${radius}</td>${cells}</tr>`;
    })
    .join("");

  $("#priceTable").innerHTML = `<thead><tr><th>Радиус</th>${head}</tr></thead><tbody>${rows}</tbody>`;

  const extras = CONFIG.carTypes
    .slice(1)
    .map((car) => `${car.name}: +${Math.round((car.k - 1) * 100)}%`)
    .join(", ");
  $("#priceNote").textContent = `Цены для легковых авто. ${extras}.`;
}

/* ==========================================================================
   Калькулятор
   ========================================================================== */
function getCalcSummary() {
  const car = CONFIG.carTypes.find((c) => c.id === $("#carType").value);
  const radius = Number($("#radius").value);
  const chosen = CONFIG.services.filter((s) => $(`#calcServices input[value="${s.id}"]`).checked);

  const total = chosen.reduce((sum, s) => sum + getPrice(s, radius), 0) * car.k;
  const names = chosen.map((s) => s.name).join(", ");

  return {
    total,
    isEmpty: chosen.length === 0,
    text: `${names} (R${radius}, ${car.name.toLowerCase()}), от ${formatPrice(total)}`,
  };
}

function updateCalc() {
  $("#sum").textContent = "от " + formatPrice(getCalcSummary().total);
}

function initCalculator() {
  $("#carType").innerHTML = CONFIG.carTypes.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");

  $("#radius").innerHTML = CONFIG.radii
    .map((r) => `<option value="${r}" ${r === 16 ? "selected" : ""}>R${r}</option>`)
    .join("");

  // По умолчанию отмечены шиномонтаж и балансировка
  $("#calcServices").innerHTML = CONFIG.services
    .map((s) => {
      const checked = s.id === "mount" || s.id === "balance" ? "checked" : "";
      return `<label class="chk-i"><input type="checkbox" value="${s.id}" ${checked} /> ${s.name}</label>`;
    })
    .join("");

  $$("#carType, #radius, #calcServices").forEach((el) => el.addEventListener("change", updateCalc));
  updateCalc();
}

/* ==========================================================================
   Меню
   ========================================================================== */
function initMenu() {
  const nav = $("#nav");
  const burger = $(".burger");

  function setOpen(isOpen) {
    nav.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
  }

  burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));

  // После выбора раздела закрываем мобильное меню
  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") setOpen(false);
  });

  // Подсветка пункта меню для раздела, который сейчас на экране
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  nav.querySelectorAll("a").forEach((link) => observer.observe($(link.getAttribute("href"))));
}

/* ==========================================================================
   Онлайн-запись
   ========================================================================== */
function initBooking() {
  const dialog = $("#dlg");
  const form = $("#form");
  const note = $("#dlgNote");
  let selectedServices = ""; // что выбрали в калькуляторе (если выбрали)

  // Список времени: с 08:00 до 20:00 каждый час
  const slots = Array.from({ length: 13 }, (_, i) => String(8 + i).padStart(2, "0") + ":00");
  $("#f-time").innerHTML =
    '<option value="">Выберите время</option>' + slots.map((t) => `<option>${t}</option>`).join("");

  function clearErrors() {
    form.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  }

  function openBooking(summary = "") {
    form.reset();
    form.hidden = false;
    $("#ok").hidden = true;
    clearErrors();

    selectedServices = summary;
    note.hidden = !summary;
    note.textContent = summary ? "Вы выбрали: " + summary : "";

    $("#f-date").min = today();
    dialog.showModal();
  }

  $$("[data-book]").forEach((btn) => btn.addEventListener("click", () => openBooking()));

  $("#calcBook").addEventListener("click", () => {
    const summary = getCalcSummary();
    openBooking(summary.isEmpty ? "" : summary.text);
  });

  // Закрытие: крестик, кнопка «Закрыть», клик по фону (Esc работает сам)
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.hasAttribute("data-close")) dialog.close();
  });

  // Правила проверки: возвращают текст ошибки или false
  const rules = {
    name: (value) => value.trim().length < 2 && "Введите имя",
    phone: (value) => !/^\+?[\d\s()-]{10,18}$/.test(value.trim()) && "Введите телефон, например +7 900 000-00-00",
    date: (value) => {
      if (!value) return "Выберите дату";
      return value < today() && "Дата не может быть в прошлом";
    },
    time: (value) => !value && "Выберите время",
    consent: (value, el) => !el.checked && "Нужно ваше согласие",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      const message = rules[name](field.value, field);

      field.closest(".f").querySelector(".err").textContent = message || "";

      if (message) {
        field.setAttribute("aria-invalid", "true");
        firstInvalid = firstInvalid || field;
      } else {
        field.removeAttribute("aria-invalid");
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (selectedServices) data.services = selectedServices;

    /* ДЕМО: заявка никуда не отправляется.
       Для реального проекта здесь подключаем отправку
       (Telegram-бот, email или CRM) вместо console.log. */
    console.log("Новая запись:", data);

    form.hidden = true;
    $("#ok").hidden = false;
  });
}

/* ==========================================================================
   Запуск
   ========================================================================== */
bindConfig();
renderFacts();
renderWhy();
renderReviews();
renderPrices();
initCalculator();
initMenu();
initBooking();
