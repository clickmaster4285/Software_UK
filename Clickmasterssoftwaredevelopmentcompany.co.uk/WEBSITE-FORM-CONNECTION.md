# Connect your website form to ERP

Send leads from your site into ClickMasters ERP. You only change the **API URL** and add an **API key**. Keep the same form field names.

> For ERP developers (hooks, features, admin UI): see `WEB-LEAD-INTAKE.md`.

---

## What you need from ERP admin

1. Your site registered under **Configurations → Web Lead Websites**
2. The **API key** (shown once when created — ask admin if you lost it; they can rotate)
3. The exact **domain** they registered (e.g. `yoursite.com`)

---

## Endpoint

```http
POST https://apierp.clickmasters.pk/public/web-leads
Content-Type: application/json
X-Website-Key: YOUR_API_KEY
```

No key / wrong key / inactive site → **401**. Leads are not created without a valid key.

---

## Copy-paste example

```js
fetch("https://apierp.clickmasters.pk/public/web-leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Website-Key": "YOUR_API_KEY", // from ERP admin
  },
  body: JSON.stringify({
    name: document.querySelector('[name="name"]').value,
    email: document.querySelector('[name="email"]').value,
    phone: document.querySelector('[name="phone"]')?.value || "",
    company: document.querySelector('[name="company"]')?.value || "",
    message: document.querySelector('[name="message"]')?.value || "",
    website: "yoursite.com", // MUST match the domain registered in ERP
    service: "Web Development", // optional — see list below
    landingPage: window.location.href,
    referrer: document.referrer,
    utm_source: new URLSearchParams(location.search).get("utm_source") || "",
    utm_medium: new URLSearchParams(location.search).get("utm_medium") || "",
    utm_campaign: new URLSearchParams(location.search).get("utm_campaign") || "",
  }),
})
  .then((r) => r.json())
  .then((data) => {
    if (!data.success) throw new Error(data.message || "Submit failed");
    // show thank-you
  })
  .catch((err) => console.error(err));
```

If you already POST to CRM (`https://crm.clickmasters.pk/api/leads`): same JSON body — only swap the URL and add `X-Website-Key`.

---

## Fields

| Field | Required | Notes |
|-------|----------|--------|
| `name` | Yes | Visitor name |
| `email` | Yes | Valid email |
| `website` | Yes | Domain only, e.g. `yoursite.com` (no `https://`, no `www.`, no path) — must match ERP registry |
| `phone` | No | |
| `company` | No | |
| `message` | No | |
| `service` | No | If sent, use exact string from list below |
| `landingPage` | No | Usually `window.location.href` |
| `referrer` | No | Usually `document.referrer` |
| `source` | No | Free text |
| `utm_source` / `utm_medium` / `utm_campaign` / `utm_term` / `utm_content` | No | |

**Do not send** `browser`, `os`, `deviceType`, `ipAddress` — ERP fills those from the request.

### Allowed `service` values (if you send one)

- Software Development  
- Web Development  
- Mobile App Development  
- Artificial Intelligence  
- Blockchain  
- Digital Marketing  
- Automation  

---

## Checklist

- [ ] Use the ERP URL above (not CRM)
- [ ] Header `X-Website-Key` set to your key
- [ ] `website` matches the registered domain exactly
- [ ] Required: `name`, `email`, `website`
- [ ] Form input `name` attributes unchanged if migrating from CRM

---

## Common errors

| Problem | Meaning |
|---------|---------|
| `401` Missing / invalid key | Wrong or missing `X-Website-Key`, or site deactivated |
| `400` domain must match | `website` in JSON ≠ registered domain |
| `400` Validation failed | Missing name/email/website or bad email |
| `429` Too many requests | Slow down; retry later |

Success → **201** with `{ "success": true, "data": { ... } }`.

---

## Questions?

Ask your ERP admin for a new key (**Web Lead Websites → Rotate key**) or to confirm the registered domain.
