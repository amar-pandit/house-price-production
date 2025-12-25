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

// ---------------- MAIN ENGINE (STABLE + RETRY + TIMEOUT) ----------------
async function runEngine() {
    const sqft = val('sqft');
    if (sqft < 100) {
        alert("Area must be > 100 sqft");
        return;
    }

    // Loader ON
    get('btnText').style.display = 'none';
    get('ldr').style.display = 'block';
    get('price').innerText = "⏳ Waking up server...";

    const payload = {
        area: sqft,
        bedrooms: val('beds'),
        bathrooms: val('baths'),
        location: "Tier-" + get('tier').value
    };

    const API_URL = "https://house-price-production.onrender.com/predict";

    // Try up to 3 times (Render free-tier cold start)
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            // ---- Timeout control (30s) ----
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // ---- Safe JSON parse (Render may return HTML while waking) ----
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Non-JSON response");
            }

            console.log("Backend Response:", data);

            // ---- Final validation ----
            if (typeof data.predicted_price !== "number") {
                throw new Error("Prediction missing");
            }

            const formatter = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            });

            get('price').innerText =
                formatter.format(data.predicted_price);

            updateAnalytics();
            break; // ✅ SUCCESS

        } catch (err) {
            console.warn(`Attempt ${attempt} failed`, err);

            if (attempt === 3) {
                get('price').innerText =
                    "⚠️ Server warming up. Please wait 10–20 sec and click again";
            }

            // Wait before retry
            await new Promise(r => setTimeout(r, 7000));
        }
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
