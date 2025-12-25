// ---------------- HELPERS ----------------
const get = id => document.getElementById(id);
const val = id => Number(get(id).value);

// ---------------- MAIN ENGINE ----------------
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

    try {
        const res = await fetch(
            "https://house-price-production.onrender.com/predict",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        if (!res.ok) {
            throw new Error("API not ready");
        }

        const data = await res.json();
        console.log("Backend Response:", data);

        // ✅ SAFE CHECK FIRST
        if (!data || typeof data.predicted_price !== "number") {
            get('price').innerText = "❌ Prediction Failed (Try again)";
            return;
        }

        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });

        get('price').innerText =
            formatter.format(data.predicted_price);

        updateAnalytics();

    } catch (err) {
        console.error(err);
        get('price').innerText =
            "⚠️ Server sleeping. Click again in 5–10 sec";
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
