const API_URL = "https://script.google.com/macros/s/AKfycbxihvruoxLX5TRdNprw6yeNjzb-cHP8lVHkuX9fdwJv90qD-2N-zswxZywvVwSiUIVeeg/exec";

const items = [
  { item_code: "ITM-001", item_name: "Soda", description: "Soft drink bottle", unit_price: 2.5, accent: "from-cyan-500/25 to-sky-500/10" },
  { item_code: "ITM-002", item_name: "Water", description: "Bottled water", unit_price: 1.5, accent: "from-blue-500/25 to-indigo-500/10" },
  { item_code: "ITM-003", item_name: "Chips", description: "Potato chips", unit_price: 3.0, accent: "from-amber-500/25 to-orange-500/10" },
  { item_code: "ITM-004", item_name: "Sandwich", description: "Ham sandwich", unit_price: 5.5, accent: "from-emerald-500/25 to-teal-500/10" },
  { item_code: "ITM-005", item_name: "Juice", description: "Fruit juice", unit_price: 4.0, accent: "from-fuchsia-500/25 to-violet-500/10" }
];

const elements = {
  itemsGrid: document.getElementById("items_grid"),
  searchInput: document.getElementById("search_input"),
  itemsCount: document.getElementById("items-count"),
  liveDate: document.getElementById("live-date"),
  liveTime: document.getElementById("live-time"),
  form: document.getElementById("transaction-form"),
  staffName: document.getElementById("staff_name"),
  statusMessage: document.getElementById("status_message"),
  totalCard: document.getElementById("total_card"),
  submitBtn: document.getElementById("submit_btn"),
  toast: document.getElementById("toast"),
  selectedItemName: document.getElementById("selected_item_name"),
  selectedItemDesc: document.getElementById("selected_item_desc"),
  selectedPriceBadge: document.getElementById("selected_price_badge"),
  itemCode: document.getElementById("item_code"),
  unitPriceText: document.getElementById("unit_price_text"),
  totalPriceDisplay: document.getElementById("total_price_display"),
  summaryItem: document.getElementById("summary_item"),
  summaryQuantity: document.getElementById("summary_quantity"),
  summaryQuantitySecondary: document.getElementById("summary_quantity_secondary"),
  summaryTotal: document.getElementById("summary_total")
};

let filteredItems = [...items];
let cart = [];

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function generateTransactionId() {
  return `TXN-${Date.now()}`;
}

function getCurrentDateISO() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function updateLiveClock() {
  const now = new Date();
  elements.liveDate.textContent = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  elements.liveTime.textContent = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
}

function getCartDistinctCount() {
  return cart.length;
}

function addToCart(itemCode) {
  const item = items.find((i) => i.item_code === itemCode);
  if (!item) return;

  const existing = cart.find((i) => i.item_code === itemCode);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }

  renderItemsGrid();
  renderCartUI();
  animateCartAction(itemCode);
}

function updateCartQuantity(itemCode, delta) {
  const cartItem = cart.find((i) => i.item_code === itemCode);
  if (!cartItem) return;

  cartItem.quantity += delta;

  if (cartItem.quantity <= 0) {
    cart = cart.filter((i) => i.item_code !== itemCode);
  }

  renderItemsGrid();
  renderCartUI();
}

function removeFromCart(itemCode) {
  cart = cart.filter((i) => i.item_code !== itemCode);
  renderItemsGrid();
  renderCartUI();
}

function getCartQuantityForItem(itemCode) {
  const cartItem = cart.find((i) => i.item_code === itemCode);
  return cartItem ? cartItem.quantity : 0;
}

function renderItemsGrid() {
  elements.itemsGrid.innerHTML = "";

  if (!filteredItems.length) {
    elements.itemsGrid.innerHTML = `
      <div class="col-span-full rounded-[26px] border border-white/10 bg-white/5 p-8 text-center">
        <p class="text-lg font-bold text-white">No items found</p>
        <p class="mt-2 text-sm text-slate-300">Try a different search term.</p>
      </div>
    `;
    return;
  }

  filteredItems.forEach((item, index) => {
    const qtyInCart = getCartQuantityForItem(item.item_code);

    const card = document.createElement("button");
    card.type = "button";
    card.dataset.code = item.item_code;
    card.className = `
      item-card group relative overflow-hidden rounded-[26px] border p-4 text-left transition duration-300
      ${qtyInCart > 0
        ? "border-cyan-300/50 bg-white/14 shadow-[0_20px_50px_rgba(34,211,238,0.18)]"
        : "border-white/10 bg-white/8 hover:border-white/20 hover:bg-white/10"}
    `;

    card.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80"></div>
      <div class="relative z-10">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.18em] text-slate-300">${item.item_code}</p>
            <h3 class="mt-2 text-xl font-black text-white">${item.item_name}</h3>
          </div>

          <div class="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm font-black text-white">
            ${formatCurrency(item.unit_price)}
          </div>
        </div>

        <p class="min-h-[40px] text-sm text-slate-200">${item.description}</p>

        <div class="mt-4 flex items-center justify-between">
          <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
            ${qtyInCart > 0 ? `${qtyInCart} in cart` : "Add to cart"}
          </span>

          <span class="text-sm font-semibold text-cyan-200 transition group-hover:translate-x-1">
            + Add
          </span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => addToCart(item.item_code));

    elements.itemsGrid.appendChild(card);

    if (window.gsap) {
      gsap.from(card, {
        opacity: 0,
        y: 24,
        scale: 0.96,
        duration: 0.45,
        delay: index * 0.05,
        ease: "power2.out"
      });
    }
  });
}

function renderCartUI() {
  let cartContainer = document.getElementById("cart_items");

  if (!cartContainer) {
    const markup = `
      <div id="cart_block" class="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Cart</p>
            <h3 class="mt-1 text-2xl font-black text-white">Current Basket</h3>
          </div>
          <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-200">
            <span id="cart_distinct_count">0</span> items
          </div>
        </div>
        <div id="cart_items" class="space-y-3"></div>
      </div>
    `;
    elements.form.insertAdjacentHTML("afterbegin", markup);
    cartContainer = document.getElementById("cart_items");
  }

  const cartDistinctCount = document.getElementById("cart_distinct_count");

  if (cartDistinctCount) {
    cartDistinctCount.textContent = String(getCartDistinctCount());
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-center">
        <p class="text-base font-bold text-white">Your cart is empty</p>
        <p class="mt-1 text-sm text-slate-300">Tap product cards to add items here.</p>
      </div>
    `;
  } else {
    cartContainer.innerHTML = cart.map((item) => {
      const lineTotal = item.quantity * item.unit_price;
      return `
        <div class="cart-row rounded-2xl border border-white/10 bg-white/5 p-4" data-code="${item.item_code}">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">${item.item_code}</p>
              <h4 class="mt-1 text-lg font-bold text-white">${item.item_name}</h4>
              <p class="mt-1 text-sm text-slate-300">${item.description}</p>
            </div>
            <button
              type="button"
              data-remove="${item.item_code}"
              class="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/15"
            >
              Remove
            </button>
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button
                type="button"
                data-dec="${item.item_code}"
                class="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-lg font-bold text-white transition hover:bg-white/15"
              >−</button>

              <div class="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-2 text-sm font-bold text-white min-w-[56px] text-center">
                ${item.quantity}
              </div>

              <button
                type="button"
                data-inc="${item.item_code}"
                class="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-lg font-bold text-white transition hover:bg-white/15"
              >+</button>
            </div>

            <div class="text-right">
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Line Total</p>
              <p class="mt-1 text-lg font-black text-cyan-200">${formatCurrency(lineTotal)}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  cartContainer.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.dataset.inc, 1));
  });

  cartContainer.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.dataset.dec, -1));
  });

  cartContainer.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
  });

  const firstItem = cart[0] || null;

  if (firstItem) {
    elements.selectedItemName.textContent = `${getCartDistinctCount()} item${getCartDistinctCount() === 1 ? "" : "s"} in cart`;
    elements.selectedItemDesc.textContent = `First item: ${firstItem.item_name}. Total units in basket: ${getCartItemCount()}.`;
    elements.selectedPriceBadge.textContent = formatCurrency(getCartTotal());
    elements.itemCode.textContent = firstItem.item_code;
    elements.unitPriceText.textContent = formatCurrency(firstItem.unit_price);
    elements.summaryItem.textContent = `${getCartDistinctCount()} product${getCartDistinctCount() === 1 ? "" : "s"}`;
  } else {
    elements.selectedItemName.textContent = "No items in cart";
    elements.selectedItemDesc.textContent = "Choose product cards to build a sale.";
    elements.selectedPriceBadge.textContent = "$0.00";
    elements.itemCode.textContent = "--";
    elements.unitPriceText.textContent = "$0.00";
    elements.summaryItem.textContent = "None";
  }

  elements.totalPriceDisplay.textContent = formatCurrency(getCartTotal());
  elements.summaryQuantity.textContent = `${getCartItemCount()} ${getCartItemCount() === 1 ? "unit" : "units"}`;
  elements.summaryQuantitySecondary.textContent = String(getCartItemCount());
  elements.summaryTotal.textContent = formatCurrency(getCartTotal());

  animateTotalChange();
}

function animateCartAction(itemCode) {
  if (!window.gsap) return;

  const card = document.querySelector(`.item-card[data-code="${itemCode}"]`);
  if (card) {
    gsap.fromTo(card, { scale: 0.97, y: 8 }, { scale: 1, y: 0, duration: 0.28, ease: "power2.out" });
  }

  const cartRows = document.querySelectorAll(".cart-row");
  if (cartRows.length) {
    gsap.fromTo(cartRows, { opacity: 0.7, y: 6 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: "power2.out" });
  }
}

function animateTotalChange() {
  if (!window.gsap) return;

  gsap.fromTo(
    elements.totalCard,
    { scale: 0.985 },
    { scale: 1, duration: 0.25, ease: "power2.out" }
  );

  gsap.fromTo(
    elements.totalPriceDisplay,
    { y: 6, opacity: 0.75 },
    { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }
  );
}

function filterItems() {
  const query = elements.searchInput.value.trim().toLowerCase();

  filteredItems = items.filter((item) => {
    return (
      item.item_name.toLowerCase().includes(query) ||
      item.item_code.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  renderItemsGrid();
}

function setStatus(message, tone = "neutral") {
  const toneClasses = {
    neutral: "text-slate-300",
    success: "text-emerald-300",
    error: "text-rose-300"
  };

  elements.statusMessage.className = `mt-4 text-sm ${toneClasses[tone] || toneClasses.neutral}`;
  elements.statusMessage.textContent = message;
}

function showToast() {
  if (!window.gsap) {
    elements.toast.classList.remove("opacity-0", "translate-y-6");
    setTimeout(() => {
      elements.toast.classList.add("opacity-0", "translate-y-6");
    }, 2200);
    return;
  }

  gsap.killTweensOf(elements.toast);

  gsap.timeline()
    .fromTo(
      elements.toast,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
    )
    .to(elements.toast, {
      opacity: 1,
      y: 0,
      duration: 1.2
    })
    .to(elements.toast, {
      opacity: 0,
      y: 24,
      duration: 0.28,
      ease: "power2.in"
    });
}

function shakeField(field) {
  if (!window.gsap) return;
  gsap.fromTo(field, { x: -6 }, { x: 0, duration: 0.32, ease: "elastic.out(1, 0.45)" });
}

function shakeSubmit() {
  if (!window.gsap) return;
  gsap.fromTo(elements.submitBtn, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.45)" });
}

function successBurst() {
  if (!window.gsap) return;

  gsap.fromTo(
    elements.submitBtn,
    { scale: 1 },
    { scale: 1.03, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" }
  );
}

async function submitTransaction(event) {
  event.preventDefault();

  const staffName = elements.staffName.value.trim();

  if (cart.length === 0) {
    setStatus("Add at least one item to the cart before submitting.", "error");
    shakeSubmit();
    return;
  }

  if (!staffName) {
    setStatus("Enter the staff name to continue.", "error");
    shakeField(elements.staffName);
    return;
  }

  const transactionId = generateTransactionId();
  const date = getCurrentDateISO();
  const time = getCurrentTime();

  try {
    setStatus("Submitting transaction to Google Sheets...", "neutral");

    for (const item of cart) {
      const payload = {
        transaction_id: transactionId,
        date,
        time,
        staff_name: staffName,
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        unit_price: Number(item.unit_price).toFixed(2),
        quantity: item.quantity,
        total_price: (item.quantity * item.unit_price).toFixed(2)
      };

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
    }

    setStatus("Cart submitted. Verify the grouped rows in Google Sheets.", "success");
    showToast();
    successBurst();

    elements.form.reset();
    cart = [];
    renderItemsGrid();
    renderCartUI();
  } catch (error) {
    setStatus(`Submission failed: ${error.message}`, "error");
    shakeSubmit();
  }
}

function introAnimation() {
  if (!window.gsap) return;

  gsap.from(".hero-panel", {
    opacity: 0,
    y: 22,
    duration: 0.55,
    ease: "power2.out"
  });

  gsap.from(".checkout-panel, .summary-panel", {
    opacity: 0,
    x: 18,
    duration: 0.55,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.08
  });
}

function init() {
  elements.itemsCount.textContent = String(items.length);
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  renderItemsGrid();
  renderCartUI();
  introAnimation();

  elements.searchInput.addEventListener("input", filterItems);
  elements.form.addEventListener("submit", submitTransaction);
}

init();