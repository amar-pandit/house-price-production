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

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const res = await fetch(
                "https://house-price-production.onrender.com/predict",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const data = await res.json();

            if (!data || typeof data.predicted_price !== "number") {
                throw new Error("Invalid response");
            }

            const formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            });

            get('price').innerText =
                formatter.format(data.predicted_price);

            updateAnalytics();
            break; // success

        } catch (err) {
            console.warn(`Attempt ${attempt} failed`);
            if (attempt === 2) {
                get('price').innerText =
                    "⚠️ Server waking up. Click again";
            }
            await new Promise(r => setTimeout(r, 8000));
        }
    }

    get('btnText').style.display = 'block';
    get('ldr').style.display = 'none';
}
