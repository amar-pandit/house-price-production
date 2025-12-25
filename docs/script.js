async function runEngine() {
    const sqft = val('sqft');
    if (sqft < 100) {
        alert("Area must be > 100 sqft");
        return;
    }

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

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            // ❌ Backend not ready / HTML response
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // 🛡️ SAFE JSON PARSE
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Non-JSON response");
            }

            console.log("Backend Response:", data);

            // ✅ FINAL CHECK
            if (typeof data.predicted_price !== "number") {
                throw new Error("Prediction missing");
            }

            const formatter = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            });

            get("price").innerText =
                formatter.format(data.predicted_price);

            updateAnalytics();
            break; // ✅ SUCCESS, exit loop

        } catch (err) {
            console.warn(`Attempt ${attempt} failed`, err);

            if (attempt === 3) {
                get("price").innerText =
                    "⚠️ Server waking up. Please click again";
            }

            // ⏳ wait before retry (Render cold start)
            await new Promise(r => setTimeout(r, 7000));
        }
    }

    get('btnText').style.display = 'block';
    get('ldr').style.display = 'none';
}
