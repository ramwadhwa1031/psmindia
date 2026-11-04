# PS MESSAGE INDIA — Multi-Page Enterprise Website

**Brand Name:** PS MESSAGE INDIA  
**Tagline:** Communication Solutions  
**Domain:** `https://psmessageindia.com`  
**Phone / WhatsApp:** `+91 8264800254`

---

## 1. Project Overview & Architecture

This is a production-ready, static multi-page HTML5, CSS3, and Vanilla JavaScript website built for **PS Message India**. It focuses strictly on the brand's **four core communication services**:

1. **Bulk SMS** (`bulk-sms.html`)
2. **Bulk WhatsApp** (`bulk-whatsapp.html`)
3. **Voice Calls** (`voice-calls.html`)
4. **RCS Messaging** (`rcs-messaging.html`)

### File Structure

```text
/
├── index.html                        # Homepage (Marquee, Sticky Nav, 3-Slide Hero, 4 Services, Showcase, Industries, Steps, Blogs, CTA)
├── about.html                        # About Us Page
├── services.html                     # All 4 Services Overview Page
├── bulk-sms.html                     # Service 1: Bulk SMS Dedicated Landing Page
├── bulk-whatsapp.html                # Service 2: Bulk WhatsApp Dedicated Landing Page
├── voice-calls.html                  # Service 3: Voice Calls Dedicated Landing Page
├── rcs-messaging.html                # Service 4: RCS Messaging Dedicated Landing Page
├── blog.html                         # Blog Listing Page (Featured Post, Category Filter, Search)
├── contact.html                      # Contact & Enquiry Page (Validated Form + Demo Mode)
├── privacy-policy.html               # Privacy Policy
├── terms-and-conditions.html         # Terms & Conditions
├── 404.html                          # Custom 404 Page
├── robots.txt                        # Search Engine Crawler Rules
├── sitemap.xml                       # Full XML Sitemap
├── .htaccess                         # Apache Caching, Compression & Security Headers
│
├── /blog/
│   ├── benefits-of-bulk-sms.html
│   ├── whatsapp-business-messaging.html
│   ├── what-is-rcs-messaging.html
│   └── voice-call-marketing.html
│
└── /assets/
    ├── /css/
    │   ├── style.css                 # Core Design System & Components
    │   ├── responsive.css            # Breakpoints (320px to 1920px+)
    │   └── animations.css            # Bidirectional Scroll & Keyframe Animations
    ├── /js/
    │   ├── main.js                   # Navigation, Mobile Drawer, Showcase Tabs, FAQs, Blog Search/Filter
    │   ├── slider.js                 # 3-Slide Hero Carousel (Autoplay, Arrows, Dots, Touch Swipe)
    │   ├── animations.js             # Bidirectional IntersectionObserver & ScrollTrigger Support
    │   └── forms.js                  # Centralized Lead Form Validation & Integration Architecture
    ├── /images/
    │   ├── logo.png                  # Original Transparent Brand Logo
    │   ├── logo-light.png            # Footer Logo Optimized for Deep Purple Background
    │   ├── favicon.png               # Brand Symbol Favicon
    │   ├── /hero/                    # Hero Slider Visuals (.webp & .png)
    │   ├── /services/                # 4 Service Illustrations (.webp & .png)
    │   ├── /blog/                    # 4 Blog Article Thumbnails (.webp & .png)
    │   └── /about/                   # About Us Banner (.webp & .png)
    └── /fonts/
```

---

## 2. Deployment Instructions

1. **Shared Hosting / cPanel / Apache:**
   - Upload all files and folders directly into your `public_html/` directory.
   - If SSL is active on `psmessageindia.com`, uncomment the HTTPS redirect block in `.htaccess`.
2. **Nginx / Cloud Static Hosting:**
   - Point the server root to the project folder and set `index.html` as the index document and `/404.html` as the `error_page 404`.

---

## 3. Connecting Google Sheets Integration Later (`assets/js/forms.js`)

The contact form in `contact.html` is powered by `assets/js/forms.js`. By default, it runs in **`DEMO` mode** so no fake submission claims are made before your backend is connected.

### Step 1: Create a Google Sheet & Apps Script Web App
1. Create a new Google Sheet with column headers in Row 1:
   `Lead ID | Timestamp | Full Name | Business Name | Mobile Number | Email Address | Interested Service | Monthly Requirement | Message | Source Page`
2. In your Google Sheet, click **Extensions → Apps Script** and paste:

```javascript
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var lead = body.lead || {};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      lead.leadId || '',
      lead.submittedAtISO || new Date().toISOString(),
      lead.fullName || '',
      lead.businessName || '',
      lead.mobileNumber || '',
      lead.emailAddress || '',
      lead.interestedService || '',
      lead.monthlyRequirement || '',
      lead.message || '',
      lead.sourcePage || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, result: 'Saved to Google Sheets' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy → New deployment → Select type: Web app**.
4. Set **Execute as:** `Me` and **Who has access:** `Anyone`. Copy the generated **Web App URL**.

### Step 2: Update `assets/js/forms.js`
Open `assets/js/forms.js` and update `LEAD_INTEGRATION_CONFIG` at the top of the file:

```javascript
var LEAD_INTEGRATION_CONFIG = {
  mode: 'LIVE', // Changed from 'DEMO' to 'LIVE'
  allowedServices: ['Bulk SMS', 'Bulk WhatsApp', 'Voice Calls', 'RCS Messaging'],
  endpoints: {
    googleSheetsWebhookUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec',
    emailServiceEndpointUrl: ''
  },
  enableGoogleSheets: true,
  enableEmailNotification: false
};
```
Also remove or hide the `.demo-mode-banner` element in `contact.html`.

---

## 4. Connecting Email Notification Integration Later (`assets/js/forms.js`)

To receive email notifications for new leads without exposing SMTP or API credentials in frontend JavaScript:

1. Create a lightweight backend endpoint (e.g., on your server or serverless function at `/api/send-enquiry`) that accepts a `POST` request with JSON body `{ integrationTarget: "EMAIL_NOTIFICATION", lead: { ... } }`.
2. Store your SMTP credentials or transactional email API key strictly in server-side environment variables.
3. Update `LEAD_INTEGRATION_CONFIG` in `assets/js/forms.js`:

```javascript
  mode: 'LIVE',
  endpoints: {
    googleSheetsWebhookUrl: '...',
    emailServiceEndpointUrl: 'https://psmessageindia.com/api/send-enquiry'
  },
  enableGoogleSheets: true,
  enableEmailNotification: true
```

