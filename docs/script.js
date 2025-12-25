// ---------------- HELPERS ----------------
const get = id => document.getElementById(id);
const val = id => Number(get(id).value);

// ---------------- SIDEBAR NAV ----------------
function switchView(viewId) {
    document.querySelectorAll('.view-content')
        .forEach(v => v.classList.remove('active'));

    document.querySelectorAll('.nav-item')
        .forEach(i => i.classList.remove('active'));

    get(viewId + '-view')?.classList.add('active');
    event.currentTarget.classList.add('active');
}

// ---------------- MAIN ENGINE (FINAL STABLE VERSION) ----------------
async function runEngine() {
    const sqft = val('sqft');
    if (sqft < 100) {
        alert("Area must be > 100 sqft");
        return;
    }

    // Loader ON
    get('btnText').style.display = 'none';
    get('ldr').style.display = 'block';
    get('price').innerText = "⏳ Server warming up…";

    const payload = {
        area: sqft,
        bedrooms: val('beds'),
        bathrooms: val('baths'),
        location: "Tier-" + get('tier').value
    };

    const API_URL = "https://house-price-production.onrender.com/predict";

    try {
        // ---- Timeout control (45 sec for Render cold start) ----
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // If backend still waking up
        if (!res.ok) {
            get('price').innerText =
                "⏳ Server waking up (free tier). Please wait 20–30 sec and click again.";
            return;
        }

        // Safe JSON parse
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            get('price').innerText =
                "⏳ Server warming up. Please click again.";
            return;
        }

        console.log("Backend Response:", data);

        // Final validation
        if (typeof data.predicted_price !== "number") {
            get('price').innerText =
                "⏳ Server warming up. Please click again.";
            return;
        }

        const formatter = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        });

        get('price').innerText =
            formatter.format(data.predicted_price);

        updateAnalytics();

    } catch (err) {
        console.warn("Fetch error:", err);
        get('price').innerText =
            "⏳ Server warming up. Please wait a few seconds and try again.";
    }

    // Loader OFF
    get('btnText').style.display = 'block';
    get('ldr').style.display = 'none';
}

// ---------------- UI ANALYTICS ----------------
function updateAnalytics() {
    const tier = val('tier');
    const year = val('year');
    const age = new Date().getFullYear() - year;

    const liq = tier > 12000 ? 94 : tier > 7000 ? 76 : 48;
    const ret = Math.max(55, 100 - age * 2);
    const gro = tier > 10000 ? 88 : 64;

    updateBar('b-liq', 'v-liq', liq);
    updateBar('b-ret', 'v-ret', ret);
    updateBar('b-gro', 'v-gro', gro);

    const insights = [
        `AI model evaluated ${age} yrs old asset with ${ret}% value retention.`,
        `Regional tier shows ${liq}% liquidity for faster resale.`,
        `Market growth score at ${gro}% indicates stable appreciation.`
    ];

    get('insight').innerText =
        insights[Math.floor(Math.random() * insights.length)];
}

function updateBar(bar, text, value) {
    get(bar).style.width = value + '%';
    get(text).innerText = value + '%';
}
