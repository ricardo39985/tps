const API_URL = "https://script.google.com/macros/s/AKfycbxihvruoxLX5TRdNprw6yeNjzb-cHP8lVHkuX9fdwJv90qD-2N-zswxZywvVwSiUIVeeg/exec";

let items = [];
let staff = [];
let filteredItems = [];
let cart = [];
let dashboard = null;
let transactions = [];
let adminTab = "items";
let adminOpen = false;
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
    summaryTotal: document.getElementById("summary_total"),
    dashRevenue: document.getElementById("dash_revenue"),
    dashTransactions: document.getElementById("dash_transactions"),
    dashStaff: document.getElementById("dash_staff"),
    dashUnits: document.getElementById("dash_units"),
    adminModal: document.getElementById("admin_modal"),
    adminBackdrop: document.getElementById("admin_backdrop"),
    adminPanel: document.getElementById("admin_panel"),
    adminCloseBtn: document.getElementById("admin_close_btn"),
    adminItemsList: document.getElementById("admin_items_list"),
    adminItemsCount: document.getElementById("admin_items_count"),
    adminStaffList: document.getElementById("admin_staff_list"),
    adminStaffCount: document.getElementById("admin_staff_count"),
    adminTransactionsList: document.getElementById("admin_transactions_list"),
    adminTransactionsCount: document.getElementById("admin_transactions_count"),
    adminTxnSearch: document.getElementById("admin_txn_search"),
    adminTxnDate: document.getElementById("admin_txn_date"),
    adminTxnStaff: document.getElementById("admin_txn_staff"),
    adminTxnSearchBtn: document.getElementById("admin_txn_search_btn"),
    adminItemCode: document.getElementById("admin_item_code"),
    adminItemName: document.getElementById("admin_item_name"),
    adminItemDescription: document.getElementById("admin_item_description"),
    adminItemPrice: document.getElementById("admin_item_price"),
    adminAddItemBtn: document.getElementById("admin_add_item_btn"),
    adminStaffName: document.getElementById("admin_staff_name"),
    adminAddStaffBtn: document.getElementById("admin_add_staff_btn"),
    loadingSpinner: document.getElementById("loading_spinner"),
    adminOpenBtn: document.getElementById("admin_open_btn"),
};

function showSpinner() {
    if (elements.loadingSpinner) {
        elements.loadingSpinner.classList.remove("hidden");
        elements.loadingSpinner.classList.add("flex");
    }
}

function hideSpinner() {
    if (elements.loadingSpinner) {
        elements.loadingSpinner.classList.add("hidden");
        elements.loadingSpinner.classList.remove("flex");
    }
}

async function postAction(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    });

    return response;
}

async function reloadCoreData() {
    await Promise.all([
        loadItems(),
        loadStaff(),
        loadDashboard(),
        loadTransactions()
    ]);

    elements.itemsCount.textContent = String(items.length);

    refreshItemViews();
    renderCartUI();
    renderStaffOptions();
    renderDashboardSummary();
    refreshAdminViews();
}
async function loadTransactions() {
    const result = await jsonpRequest("getTransactions");
    if (!result.success) throw new Error(result.error || "Failed to load transactions.");
    transactions = result.transactions || [];
}
function setAdminTab(tabName) {
    adminTab = tabName;

    document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
        const isActive = btn.dataset.tab === tabName;
        btn.className = isActive
            ? "admin-tab-btn rounded-xl bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-200"
            : "admin-tab-btn rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300";
    });

    document.querySelectorAll(".admin-tab").forEach((section) => {
        const isActive = section.dataset.tabContent === tabName;
        section.classList.toggle("hidden", !isActive);
    });
}

function openAdminModal() {
    adminOpen = true;
    elements.adminModal.classList.remove("hidden");

    if (window.gsap) {
        gsap.fromTo(
            elements.adminBackdrop,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "power2.out" }
        );

        gsap.fromTo(
            elements.adminPanel,
            { opacity: 0, y: 16, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "power2.out" }
        );
    }

    refreshAdminViews();
}

function closeAdminModal() {
    adminOpen = false;

    if (window.gsap) {
        gsap.timeline({
            onComplete: () => elements.adminModal.classList.add("hidden")
        })
            .to(elements.adminBackdrop, {
                opacity: 0,
                duration: 0.16,
                ease: "power2.inOut"
            }, 0)
            .to(elements.adminPanel, {
                opacity: 0,
                y: 12,
                scale: 0.985,
                duration: 0.18,
                ease: "power2.in"
            }, 0);
        return;
    }

    elements.adminModal.classList.add("hidden");
}

function renderAdminItems() {
    elements.adminItemsCount.textContent = `${items.length} items`;

    if (!items.length) {
        elements.adminItemsList.innerHTML = `
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
        No items found.
      </div>
    `;
        return;
    }

    elements.adminItemsList.innerHTML = items.map((item) => `
    <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div class="min-w-0">
        <p class="text-sm font-bold text-white">${item.item_name}</p>
        <p class="text-xs text-slate-400">${item.item_code} • ${formatCurrency(item.unit_price)}</p>
      </div>
      <button
        type="button"
        data-delete-item-row="${item._rowNumber}"
        class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
      >
        Delete
      </button>
    </div>
  `).join("");

    elements.adminItemsList.querySelectorAll("[data-delete-item-row]").forEach((btn) => {
        btn.addEventListener("click", () => deleteItem(btn.dataset.deleteItemRow));
    });
}

function renderAdminStaff() {
    elements.adminStaffCount.textContent = `${staff.length} staff`;

    if (!staff.length) {
        elements.adminStaffList.innerHTML = `
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
        No staff found.
      </div>
    `;
        return;
    }

    elements.adminStaffList.innerHTML = staff.map((member) => `
    <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div class="min-w-0">
        <p class="text-sm font-bold text-white">${member.name}</p>
      </div>
      <button
        type="button"
        data-delete-staff-row="${member._rowNumber}"
        class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
      >
        Delete
      </button>
    </div>
  `).join("");

    elements.adminStaffList.querySelectorAll("[data-delete-staff-row]").forEach((btn) => {
        btn.addEventListener("click", () => deleteStaff(btn.dataset.deleteStaffRow));
    });
}

function renderAdminTransactions(list = transactions) {
    elements.adminTransactionsCount.textContent = `${list.length} results`;

    if (!list.length) {
        elements.adminTransactionsList.innerHTML = `
      <div class="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
        No transactions found.
      </div>
    `;
        return;
    }

    elements.adminTransactionsList.innerHTML = list.slice(0, 100).map((txn) => `
    <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div class="min-w-0">
        <p class="truncate text-sm font-bold text-white">${txn.item_name} • ${formatCurrency(txn.total_price)}</p>
        <p class="truncate text-xs text-slate-400">
          ${txn.transaction_id} • ${txn.date} ${txn.time} • ${txn.staff_name} • qty ${txn.quantity}
        </p>
      </div>
      <button
        type="button"
        data-delete-txn-row="${txn._rowNumber}"
        class="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300"
      >
        Delete
      </button>
    </div>
  `).join("");

    elements.adminTransactionsList.querySelectorAll("[data-delete-txn-row]").forEach((btn) => {
        btn.addEventListener("click", () => deleteTransaction(btn.dataset.deleteTxnRow));
    });
}

function renderAdminStaffFilter() {
    elements.adminTxnStaff.innerHTML = `<option value="">All staff</option>`;

    staff.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.name;
        option.textContent = member.name;
        option.className = "bg-slate-950 text-white";
        elements.adminTxnStaff.appendChild(option);
    });
}

function refreshAdminViews() {
    renderAdminItems();
    renderAdminStaff();
    renderAdminTransactions(transactions);
    renderAdminStaffFilter();
}
function jsonpRequest(action) {
    return new Promise((resolve, reject) => {
        const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const script = document.createElement("script");

        window[callbackName] = (data) => {
            resolve(data);
            cleanup();
        };

        function cleanup() {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        }

        script.onerror = () => {
            reject(new Error(`JSONP request failed for action: ${action}`));
            cleanup();
        };

        script.src = `${API_URL}?action=${encodeURIComponent(action)}&callback=${callbackName}`;
        document.body.appendChild(script);
    });
}
async function loadItems() {
    const result = await jsonpRequest("getItems");
    if (!result.success) throw new Error(result.error || "Failed to load items.");

    items = (result.items || []).map((item, index) => ({
        _rowNumber: Number(item._rowNumber),
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        unit_price: Number(item.unit_price || 0),
        accent: [
            "from-cyan-500/25 to-sky-500/10",
            "from-blue-500/25 to-indigo-500/10",
            "from-amber-500/25 to-orange-500/10",
            "from-emerald-500/25 to-teal-500/10",
            "from-fuchsia-500/25 to-violet-500/10"
        ][index % 5]
    }));

    filteredItems = [...items];
}

async function loadStaff() {
    showSpinner();
    try {
        const result = await jsonpRequest("getStaff");
        if (!result.success) throw new Error(result.error || "Failed to load staff.");
        staff = result.staff || [];
    } finally {
        hideSpinner();
    }
}

async function loadDashboard() {
    showSpinner();
    try {
        const result = await jsonpRequest("getDashboardSummary");
        if (!result.success) throw new Error(result.error || "Failed to load dashboard.");
        dashboard = result.dashboard || null;
    } finally {
        hideSpinner();
    }
}

async function loadTransactions() {
    showSpinner();
    try {
        const result = await jsonpRequest("getTransactions");
        if (!result.success) throw new Error(result.error || "Failed to load transactions.");
        transactions = result.transactions || [];
    } finally {
        hideSpinner();
    }
}
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
      <div class="col-span-full rounded-[22px] border border-white/10 bg-white/5 p-8 text-center">
        <p class="text-lg font-bold text-white">No items found</p>
        <p class="mt-2 text-sm text-slate-300">Try a different search term.</p>
      </div>
    `;
        return;
    }

    filteredItems.forEach((item) => {
        const qtyInCart = getCartQuantityForItem(item.item_code);

        const card = document.createElement("button");
        card.type = "button";
        card.dataset.code = item.item_code;
        card.className = `
      item-card relative overflow-hidden rounded-[20px] border p-4 text-left transition duration-200
      ${qtyInCart > 0
                ? "border-cyan-300/60 bg-slate-800/90 shadow-[0_12px_30px_rgba(34,211,238,0.14)]"
                : "border-white/10 bg-slate-800/70 hover:border-cyan-300/35 hover:bg-slate-800"}
    `;

        card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">${item.item_code}</p>
          <h3 class="mt-1 text-lg font-bold text-white">${item.item_name}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-slate-300">${item.description}</p>
        </div>

        <div class="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-bold text-cyan-200">
          ${formatCurrency(item.unit_price)}
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-[0.16em] ${qtyInCart > 0 ? "text-emerald-300" : "text-slate-400"
            }">
          ${qtyInCart > 0 ? `${qtyInCart} in cart` : "Tap to add"}
        </span>

        <span class="rounded-lg bg-white/8 px-3 py-1.5 text-sm font-semibold text-white">
          + Add
        </span>
      </div>
    `;

        card.addEventListener("click", () => addToCart(item.item_code));
        elements.itemsGrid.appendChild(card);
    });
}

function renderCartUI() {
    let cartContainer = document.getElementById("cart_items");

    if (!cartContainer) {
        const markup = `
      <div id="cart_block" class="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Cart</p>
            <h3 class="mt-1 text-xl font-black text-white">Current Basket</h3>
          </div>
          <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-200">
            <span id="cart_distinct_count">0</span> items
          </div>
        </div>

        <div id="cart_items" class="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"></div>
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
      <div class="p-5 text-center">
        <p class="text-base font-bold text-white">Your cart is empty</p>
        <p class="mt-1 text-sm text-slate-300">Tap product cards to add items here.</p>
      </div>
    `;
    } else {
        cartContainer.innerHTML = cart.map((item) => {
            const lineTotal = item.quantity * item.unit_price;

            return `
        <div class="cart-row flex items-center justify-between gap-3 px-4 py-3" data-code="${item.item_code}">
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-base font-black leading-tight text-white">${item.item_name}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">${item.item_code}</p>
              </div>

              <div class="shrink-0 text-right">
                <p class="text-lg font-black leading-none text-cyan-200">${formatCurrency(lineTotal)}</p>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <div class="flex items-center rounded-xl border border-white/10 bg-white/[0.04]">
              <button
                type="button"
                data-dec="${item.item_code}"
                class="flex h-9 w-9 items-center justify-center text-slate-200 transition hover:bg-white/10"
                aria-label="Decrease quantity"
              >
                <i data-lucide="chevron-down" class="h-4 w-4"></i>
              </button>

              <div class="min-w-[28px] px-1 text-center text-sm font-black text-white">
                ${item.quantity}
              </div>

              <button
                type="button"
                data-inc="${item.item_code}"
                class="flex h-9 w-9 items-center justify-center text-slate-200 transition hover:bg-white/10"
                aria-label="Increase quantity"
              >
                <i data-lucide="chevron-up" class="h-4 w-4"></i>
              </button>
            </div>

            <button
              type="button"
              data-remove="${item.item_code}"
              class="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/8 text-rose-300 transition hover:bg-rose-400/15"
              aria-label="Remove item"
            >
              <i data-lucide="trash-2" class="h-4 w-4"></i>
            </button>
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

    if (window.lucide) {
        lucide.createIcons();
    }

    const firstItem = cart[0] || null;

    if (firstItem) {
        if (elements.selectedItemName) elements.selectedItemName.textContent = `${getCartDistinctCount()} item${getCartDistinctCount() === 1 ? "" : "s"} in cart`;
        if (elements.selectedItemDesc) elements.selectedItemDesc.textContent = `First item: ${firstItem.item_name}. Total units in basket: ${getCartItemCount()}.`;
        if (elements.selectedPriceBadge) elements.selectedPriceBadge.textContent = formatCurrency(getCartTotal());
        if (elements.itemCode) elements.itemCode.textContent = firstItem.item_code;
        if (elements.unitPriceText) elements.unitPriceText.textContent = formatCurrency(firstItem.unit_price);
        if (elements.summaryItem) elements.summaryItem.textContent = `${getCartDistinctCount()} product${getCartDistinctCount() === 1 ? "" : "s"}`;
    } else {
        if (elements.selectedItemName) elements.selectedItemName.textContent = "No items in cart";
        if (elements.selectedItemDesc) elements.selectedItemDesc.textContent = "Choose product cards to build a sale.";
        if (elements.selectedPriceBadge) elements.selectedPriceBadge.textContent = "$0.00";
        if (elements.itemCode) elements.itemCode.textContent = "--";
        if (elements.unitPriceText) elements.unitPriceText.textContent = "$0.00";
        if (elements.summaryItem) elements.summaryItem.textContent = "None";
    }

    if (elements.totalPriceDisplay) elements.totalPriceDisplay.textContent = formatCurrency(getCartTotal());
    if (elements.summaryQuantity) elements.summaryQuantity.textContent = `${getCartItemCount()} ${getCartItemCount() === 1 ? "unit" : "units"}`;
    if (elements.summaryQuantitySecondary) elements.summaryQuantitySecondary.textContent = String(getCartItemCount());
    if (elements.summaryTotal) elements.summaryTotal.textContent = formatCurrency(getCartTotal());

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
    refreshItemViews();
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
        showSpinner();
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
    } finally {
        hideSpinner();
    }
}
function renderDashboardSummary() {
    if (!dashboard) return;

    elements.dashRevenue.textContent = formatCurrency(dashboard.total_revenue || 0);
    elements.dashTransactions.textContent = String(dashboard.total_transactions || 0);
    elements.dashStaff.textContent = String(dashboard.total_staff || 0);
    elements.dashUnits.textContent = String(dashboard.total_units_sold || 0);
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
function renderStaffOptions() {
    if (!elements.staffName) return;

    elements.staffName.innerHTML = `<option value="">Select staff</option>`;

    staff.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.name;
        option.textContent = member.name;
        elements.staffName.appendChild(option);
    });
}
async function addItem() {
    const item_code = elements.adminItemCode.value.trim();
    const item_name = elements.adminItemName.value.trim();
    const description = elements.adminItemDescription.value.trim();
    const unit_price = Number(elements.adminItemPrice.value || 0);

    if (!item_code || !item_name || !unit_price) {
        setStatus("Admin: item code, item name, and price are required.", "error");
        return;
    }

    const optimisticItem = {
        _rowNumber: Date.now(),
        item_code,
        item_name,
        description,
        unit_price,
        accent: "from-cyan-500/25 to-sky-500/10"
    };

    items = [optimisticItem, ...items];
    elements.itemsCount.textContent = String(items.length);
    refreshItemViews();

    elements.adminItemCode.value = "";
    elements.adminItemName.value = "";
    elements.adminItemDescription.value = "";
    elements.adminItemPrice.value = "";

    await postAction({
        action: "createItem",
        item_code,
        item_name,
        description,
        unit_price: unit_price.toFixed(2)
    });

    await syncAfterWrite("Item added.");
}


async function deleteItem(rowNumber) {
    rowNumber = Number(rowNumber);

    if (!rowNumber) {
        setStatus("Delete failed: invalid item row.", "error");
        return;
    }

    items = items.filter((item) => Number(item._rowNumber) !== rowNumber);
    elements.itemsCount.textContent = String(items.length);
    refreshItemViews();

    await postAction({
        action: "deleteItem",
        rowNumber
    });

    await syncAfterWrite("Item deleted.");
}
async function deleteItem(rowNumber) {
    console.log("delete item rowNumber", rowNumber);

    await postAction({
        action: "deleteItem",
        rowNumber: Number(rowNumber)
    });

    await reloadCoreData();
    setStatus("Item deleted.", "success");
}

async function deleteStaff(rowNumber) {
    rowNumber = Number(rowNumber);
    if (!rowNumber) {
        setStatus("Delete failed: invalid staff row.", "error");
        return;
    }

    staff = staff.filter((member) => Number(member._rowNumber) !== rowNumber);
    renderStaffOptions();
    renderAdminStaff();
    renderAdminStaffFilter();

    await postAction({
        action: "deleteStaff",
        rowNumber
    });

    await syncAfterWrite("Staff deleted.");
}
async function addStaff() {
    const name = elements.adminStaffName.value.trim();

    if (!name) {
        setStatus("Admin: staff name is required.", "error");
        return;
    }

    staff.unshift({
        _rowNumber: `temp-${Date.now()}`,
        name
    });

    renderStaffOptions();
    renderAdminStaff();
    renderAdminStaffFilter();

    elements.adminStaffName.value = "";

    await postAction({
        action: "createStaff",
        name
    });

    await syncAfterWrite("Staff added.");
}
async function deleteTransaction(rowNumber) {
    rowNumber = Number(rowNumber);
    if (!rowNumber) {
        setStatus("Delete failed: invalid transaction row.", "error");
        return;
    }

    transactions = transactions.filter((txn) => Number(txn._rowNumber) !== rowNumber);
    renderAdminTransactions(transactions);

    await postAction({
        action: "deleteTransaction",
        rowNumber
    });

    await syncAfterWrite("Transaction deleted.");
}
function refreshItemViews() {
    const query = (elements.searchInput?.value || "").trim().toLowerCase();

    filteredItems = !query
        ? [...items]
        : items.filter((item) => {
            return (
                String(item.item_name || "").toLowerCase().includes(query) ||
                String(item.item_code || "").toLowerCase().includes(query) ||
                String(item.description || "").toLowerCase().includes(query)
            );
        });

    renderItemsGrid();
    renderAdminItems();
}
async function searchAdminTransactions() {
    const query = elements.adminTxnSearch.value.trim();
    const date = elements.adminTxnDate.value;
    const staff_name = elements.adminTxnStaff.value;

    const callbackName = `jsonp_callback_search_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    showSpinner();
    try {
        const result = await new Promise((resolve, reject) => {
            const script = document.createElement("script");

            window[callbackName] = (data) => {
                resolve(data);
                cleanup();
            };

            function cleanup() {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            }

            script.onerror = () => {
                reject(new Error("Transaction search failed."));
                cleanup();
            };

            const params = new URLSearchParams({
                action: "searchTransactions",
                callback: callbackName
            });

            if (query) params.set("query", query);
            if (date) params.set("date", date);
            if (staff_name) params.set("staff_name", staff_name);

            script.src = `${API_URL}?${params.toString()}`;
            document.body.appendChild(script);
        });

        if (!result.success) {
            throw new Error(result.error || "Search failed.");
        }

        renderAdminTransactions(result.transactions || []);
    } catch (error) {
        setStatus(`Search failed: ${error.message}`, "error");
    } finally {
        hideSpinner();
    }
}
async function init() {
    try {
        setStatus("Loading data...", "neutral");

        await Promise.all([
            loadItems(),
            loadStaff(),
            loadDashboard(),
            loadTransactions()
        ]);

        elements.itemsCount.textContent = String(items.length);
        renderStaffOptions();
        renderDashboardSummary();
        updateLiveClock();
        setInterval(updateLiveClock, 1000);

        refreshItemViews();
        renderCartUI();
        introAnimation();

        elements.searchInput.addEventListener("input", filterItems);
        elements.form.addEventListener("submit", submitTransaction);

        document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
            btn.addEventListener("click", () => setAdminTab(btn.dataset.tab));
        });

        elements.adminCloseBtn.addEventListener("click", closeAdminModal);
        elements.adminBackdrop.addEventListener("click", closeAdminModal);
        elements.adminAddItemBtn.addEventListener("click", addItem);
        elements.adminAddStaffBtn.addEventListener("click", addStaff);
        elements.adminTxnSearchBtn.addEventListener("click", searchAdminTransactions);
        elements.adminOpenBtn.addEventListener("click", openAdminModal);

        document.addEventListener("keydown", (event) => {
            if (event.shiftKey && event.key.toLowerCase() === "d") {
                event.preventDefault();
                if (adminOpen) closeAdminModal();
                else openAdminModal();
            }

            if (event.key === "Escape" && adminOpen) {
                closeAdminModal();
            }
        });

        setAdminTab("items");
        setStatus("Ready.", "success");
    } catch (error) {
        console.error(error);
        setStatus(`Failed to initialize app: ${error.message}`, "error");
    }
}

init();