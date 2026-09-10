/**
 * Google Forms wrapper
 *
 * HOW TO FIND YOUR ENTRY IDs (one-time setup):
 *   1. Open your form URL in a browser
 *   2. Right-click the page → "View Page Source"
 *   3. Ctrl+F and search for "entry."
 *   4. You'll find strings like entry.123456789 — the first one maps to
 *      the first question ("code"), the second to "handshake"
 *   5. Paste those numbers into the constants below
 */

const FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSczbtmfgP5kyf8vz77Igvel2ziLW0l1jr7Cel77l8YHEWkpMQ/formResponse";

const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRidRwfdVBWvYAHwmxu7lY3n1QFf_wOszlJgzozu1LEztBAfb0Ta2gdXTeVqla6f-YIgwZeTeyYtNLa/pub?gid=601327777&single=true&output=csv";

// ← Replace these with the real entry IDs from your form source
const ENTRY_CODE = "entry.XXXXXXXXX";
const ENTRY_HANDSHAKE = "entry.YYYYYYYYY";

class Form {
    /**
     * Submit a new response to the Google Form.
     * Google Forms doesn't return a useful body (just a confirmation page),
     * so we use no-cors mode and resolve on network success.
     *
     * @param {string} code
     * @param {string} handshake
     * @returns {Promise<void>}
     */
    async post(code, handshake) {
        const body = new URLSearchParams({
            [ENTRY_CODE]: code,
            [ENTRY_HANDSHAKE]: handshake,
        });

        await fetch(FORM_ACTION_URL, {
            method: "POST",
            mode: "no-cors",           // Google Forms requires this from browsers
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        });
        // no-cors responses are opaque — we can't read status, but if fetch
        // doesn't throw the submission went through
    }

    /**
     * Fetch the latest N responses from the published Google Sheet CSV.
     *
     * @param {number} n  Number of most-recent rows to return
     * @returns {Promise<Array<{ timestamp: string, code: string, handshake: string }>>}
     */
    async get(n) {
        const res = await fetch(CSV_URL);
        if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);

        const text = await res.text();
        const rows = this._parseCSV(text);

        // rows[0] is the header row; slice from the end for the latest N
        const dataRows = rows.slice(1);
        const latest = dataRows.slice(-n);

        return latest.map((cols) => ({
            timestamp: cols[0] ?? "",
            code: cols[1] ?? "",
            handshake: cols[2] ?? "",
        }));
    }

    // ---------------------------------------------------------------------------
    // Minimal CSV parser — handles quoted fields that contain commas or newlines
    // ---------------------------------------------------------------------------
    _parseCSV(text) {
        const rows = [];
        let row = [];
        let field = "";
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];

            if (inQuotes) {
                if (ch === '"' && next === '"') { field += '"'; i++; }
                else if (ch === '"') { inQuotes = false; }
                else { field += ch; }
            } else {
                if (ch === '"') { inQuotes = true; }
                else if (ch === ',') { row.push(field); field = ""; }
                else if (ch === '\n' || (ch === '\r' && next === '\n')) {
                    if (ch === '\r') i++;
                    row.push(field); field = "";
                    rows.push(row); row = [];
                } else {
                    field += ch;
                }
            }
        }

        // last field / row if file doesn't end with newline
        if (field || row.length) { row.push(field); rows.push(row); }

        return rows;
    }
}

// ---------------------------------------------------------------------------
// Export for both ESM and CommonJS environments
// ---------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
    module.exports = { Form };
} else {
    // ESM / browser
    // export { Form };   ← uncomment if using as an ES module
}