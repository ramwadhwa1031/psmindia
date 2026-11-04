/**
 * PS MESSAGE INDIA — Centralized Enquiry & Lead Management Architecture (forms.js)
 *
 * ARCHITECTURE NOTE:
 * - Initial phase runs in clearly labelled DEMO MODE (`mode: 'DEMO'`).
 * - No API secrets or credentials are stored in frontend code.
 * - Ready for drop-in Google Sheets (Apps Script Web App) and Backend Email API integration.
 * - See README.md for step-by-step instructions to switch to LIVE production endpoints.
 */

(function () {
  'use strict';

  /**
   * 1. CENTRALIZED LEAD INTEGRATION CONFIGURATION
   * Change `mode` to `'LIVE'` only after configuring your backend/Apps Script endpoints.
   */
  var LEAD_INTEGRATION_CONFIG = {
    mode: 'DEMO', // 'DEMO' | 'LIVE'
    allowedServices: [
      'Bulk SMS',
      'Bulk WhatsApp',
      'Voice Calls',
      'RCS Messaging'
    ],
    endpoints: {
      // Replace with your deployed Google Apps Script Web App URL or proxy endpoint
      googleSheetsWebhookUrl: '',
      // Replace with your backend email dispatch endpoint (e.g., /api/send-enquiry)
      emailServiceEndpointUrl: ''
    },
    enableGoogleSheets: false,
    enableEmailNotification: false
  };

  /**
   * 2. CLEAN, STANDARDIZED LEAD DATA STRUCTURE
   */
  function buildLeadPayload(formElement) {
    var formData = new FormData(formElement);
    return {
      leadId: 'PSMI-' + Date.now(),
      submittedAtISO: new Date().toISOString(),
      sourcePage: window.location.pathname,
      fullName: (formData.get('fullName') || '').toString().trim(),
      businessName: (formData.get('businessName') || '').toString().trim(),
      mobileNumber: (formData.get('mobileNumber') || '').toString().trim(),
      emailAddress: (formData.get('emailAddress') || '').toString().trim(),
      interestedService: (formData.get('interestedService') || '').toString().trim(),
      monthlyRequirement: (formData.get('monthlyRequirement') || 'Not specified').toString().trim(),
      message: (formData.get('message') || '').toString().trim(),
      consentAccepted: formData.get('consent') === 'on' || formData.get('consent') === 'true'
    };
  }

  /**
   * 3. GOOGLE SHEETS INTEGRATION PLACEHOLDER
   * Sends structured JSON payload to a configured Google Apps Script Web App or backend proxy.
   */
  async function sendToGoogleSheetsEndpoint(leadPayload) {
    if (!LEAD_INTEGRATION_CONFIG.enableGoogleSheets || !LEAD_INTEGRATION_CONFIG.endpoints.googleSheetsWebhookUrl) {
      throw new Error('Google Sheets endpoint is not configured.');
    }

    var response = await fetch(LEAD_INTEGRATION_CONFIG.endpoints.googleSheetsWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        integrationTarget: 'GOOGLE_SHEETS',
        lead: leadPayload
      })
    });

    if (!response.ok) {
      throw new Error('Google Sheets webhook returned HTTP ' + response.status);
    }

    return await response.json();
  }

  /**
   * 4. EMAIL SERVICE INTEGRATION PLACEHOLDER
   * Sends structured JSON payload to a configured backend email endpoint.
   */
  async function sendToEmailServiceEndpoint(leadPayload) {
    if (!LEAD_INTEGRATION_CONFIG.enableEmailNotification || !LEAD_INTEGRATION_CONFIG.endpoints.emailServiceEndpointUrl) {
      throw new Error('Email service endpoint is not configured.');
    }

    var response = await fetch(LEAD_INTEGRATION_CONFIG.endpoints.emailServiceEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        integrationTarget: 'EMAIL_NOTIFICATION',
        lead: leadPayload
      })
    });

    if (!response.ok) {
      throw new Error('Email service endpoint returned HTTP ' + response.status);
    }

    return await response.json();
  }

  /**
   * 5. CENTRALIZED FORM SUBMISSION HANDLER
   */
  async function submitEnquiryLead(leadPayload) {
    if (LEAD_INTEGRATION_CONFIG.mode === 'DEMO') {
      // Simulate network processing latency in Demo Mode
      await new Promise(function (resolve) { setTimeout(resolve, 650); });
      return {
        status: 'DEMO_VALIDATED',
        lead: leadPayload
      };
    }

    var tasks = [];
    if (LEAD_INTEGRATION_CONFIG.enableGoogleSheets) {
      tasks.push(sendToGoogleSheetsEndpoint(leadPayload));
    }
    if (LEAD_INTEGRATION_CONFIG.enableEmailNotification) {
      tasks.push(sendToEmailServiceEndpoint(leadPayload));
    }

    if (tasks.length === 0) {
      throw new Error('Live mode is enabled, but no integration endpoint URL is configured.');
    }

    await Promise.all(tasks);
    return {
      status: 'LIVE_SUBMITTED',
      lead: leadPayload
    };
  }

  /**
   * 6. FIELD VALIDATION LOGIC
   */
  function validateEnquiryForm(form) {
    var isValid = true;

    function setFieldState(inputEl, errorEl, valid, message) {
      if (!inputEl) return;
      if (!valid) {
        inputEl.classList.add('is-invalid');
        if (errorEl) {
          if (message) errorEl.textContent = message;
          errorEl.classList.add('visible');
        }
        isValid = false;
      } else {
        inputEl.classList.remove('is-invalid');
        if (errorEl) {
          errorEl.classList.remove('visible');
        }
      }
    }

    // Full Name
    var fullNameInput = form.querySelector('[name="fullName"]');
    var fullNameErr = form.querySelector('[data-error-for="fullName"]');
    var fullNameVal = fullNameInput ? fullNameInput.value.trim() : '';
    setFieldState(fullNameInput, fullNameErr, fullNameVal.length >= 2, 'Please enter your full name (minimum 2 characters).');

    // Business Name
    var bizInput = form.querySelector('[name="businessName"]');
    var bizErr = form.querySelector('[data-error-for="businessName"]');
    var bizVal = bizInput ? bizInput.value.trim() : '';
    setFieldState(bizInput, bizErr, bizVal.length >= 2, 'Please enter your company or business name.');

    // Mobile Number (Supports Indian 10-digit mobile numbers with optional +91 / 0 prefix)
    var mobileInput = form.querySelector('[name="mobileNumber"]');
    var mobileErr = form.querySelector('[data-error-for="mobileNumber"]');
    var mobileVal = mobileInput ? mobileInput.value.replace(/[\s\-()]/g, '') : '';
    var mobileRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    setFieldState(mobileInput, mobileErr, mobileRegex.test(mobileVal), 'Please enter a valid 10-digit Indian mobile number.');

    // Email Address
    var emailInput = form.querySelector('[name="emailAddress"]');
    var emailErr = form.querySelector('[data-error-for="emailAddress"]');
    var emailVal = emailInput ? emailInput.value.trim() : '';
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    setFieldState(emailInput, emailErr, emailRegex.test(emailVal), 'Please enter a valid business email address.');

    // Interested Service (Strictly one of the 4 services)
    var serviceInput = form.querySelector('[name="interestedService"]');
    var serviceErr = form.querySelector('[data-error-for="interestedService"]');
    var serviceVal = serviceInput ? serviceInput.value.trim() : '';
    var isAllowedService = LEAD_INTEGRATION_CONFIG.allowedServices.indexOf(serviceVal) !== -1;
    setFieldState(serviceInput, serviceErr, isAllowedService, 'Please select one of our 4 primary communication services.');

    // Message
    var msgInput = form.querySelector('[name="message"]');
    var msgErr = form.querySelector('[data-error-for="message"]');
    var msgVal = msgInput ? msgInput.value.trim() : '';
    setFieldState(msgInput, msgErr, msgVal.length >= 10, 'Please share brief details about your requirement (at least 10 characters).');

    // Consent Checkbox
    var consentInput = form.querySelector('[name="consent"]');
    var consentErr = form.querySelector('[data-error-for="consent"]');
    var consentChecked = consentInput ? consentInput.checked : false;
    setFieldState(consentInput, consentErr, consentChecked, 'Please confirm your consent to be contacted by PS Message India.');

    return isValid;
  }

  /**
   * 7. INITIALIZE ENQUIRY FORMS ON PAGE LOAD
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Pre-select service dropdown if passed via URL query string (?service=bulk-sms)
    var urlParams = new URLSearchParams(window.location.search);
    var preselectedService = urlParams.get('service');
    var serviceSelect = document.querySelector('[name="interestedService"]');
    if (preselectedService && serviceSelect) {
      var map = {
        'bulk-sms': 'Bulk SMS',
        'bulk-whatsapp': 'Bulk WhatsApp',
        'voice-calls': 'Voice Calls',
        'rcs-messaging': 'RCS Messaging'
      };
      var mappedValue = map[preselectedService.toLowerCase()] || preselectedService;
      Array.prototype.slice.call(serviceSelect.options).forEach(function (opt) {
        if (opt.value === mappedValue) {
          serviceSelect.value = mappedValue;
        }
      });
    }

    var forms = document.querySelectorAll('.psmi-enquiry-form');
    forms.forEach(function (form) {
      var submitBtn = form.querySelector('button[type="submit"]');
      var statusBox = form.querySelector('.form-status-box');

      // Real-time clear validation on input
      form.querySelectorAll('.form-control, input[type="checkbox"]').forEach(function (field) {
        field.addEventListener('input', function () {
          field.classList.remove('is-invalid');
          var name = field.getAttribute('name');
          var errEl = form.querySelector('[data-error-for="' + name + '"]');
          if (errEl) errEl.classList.remove('visible');
        });
      });

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (statusBox) {
          statusBox.className = 'form-status-box';
          statusBox.innerHTML = '';
        }

        // Spam Honeypot Check
        var honeypot = form.querySelector('[name="website_url_hp"]');
        if (honeypot && honeypot.value.trim() !== '') {
          return;
        }

        if (!validateEnquiryForm(form)) {
          if (statusBox) {
            statusBox.className = 'form-status-box error';
            statusBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><div>Please review the highlighted fields above and complete all required details.</div>';
          }
          return;
        }

        var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Enquiry...';
        }

        try {
          var payload = buildLeadPayload(form);
          var result = await submitEnquiryLead(payload);

          if (result.status === 'DEMO_VALIDATED') {
            var waText = encodeURIComponent(
              'Hello PS Message India, I would like to enquire about ' + payload.interestedService + '.\n' +
              'Name: ' + payload.fullName + '\n' +
              'Business: ' + payload.businessName + '\n' +
              'Mobile: ' + payload.mobileNumber + '\n' +
              'Requirement: ' + payload.message
            );
            if (statusBox) {
              statusBox.className = 'form-status-box success';
              statusBox.innerHTML =
                '<i class="fa-solid fa-circle-check" style="font-size:1.25rem;margin-top:2px;"></i>' +
                '<div>' +
                '<strong>Demo Mode Validation Successful (' + payload.leadId + ')</strong><br>' +
                '<span style="font-weight:400;font-size:0.88rem;">Your enquiry payload for <strong>' + payload.interestedService + '</strong> has been validated locally. Note: External email and Google Sheets endpoints are currently in frontend Demo Mode (not yet connected). To connect immediately with our team, click below to send your enquiry via WhatsApp or call +91 8264800254.</span>' +
                '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:10px;">' +
                '<a href="https://wa.me/918264800254?text=' + waText + '" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm"><i class="fa-brands fa-whatsapp"></i> Send Directly on WhatsApp</a>' +
                '<a href="tel:+918264800254" class="btn btn-secondary btn-sm"><i class="fa-solid fa-phone"></i> Call +91 8264800254</a>' +
                '</div>' +
                '</div>';
            }
            form.reset();
          } else if (result.status === 'LIVE_SUBMITTED') {
            if (statusBox) {
              statusBox.className = 'form-status-box success';
              statusBox.innerHTML =
                '<i class="fa-solid fa-circle-check" style="font-size:1.25rem;margin-top:2px;"></i>' +
                '<div><strong>Thank you, ' + payload.fullName + '!</strong><br>' +
                '<span style="font-weight:400;">Your enquiry has been received by PS Message India. Our communication specialists will contact you shortly.</span></div>';
            }
            form.reset();
          }
        } catch (err) {
          if (statusBox) {
            statusBox.className = 'form-status-box error';
            statusBox.innerHTML =
              '<i class="fa-solid fa-circle-exclamation" style="font-size:1.2rem;margin-top:2px;"></i>' +
              '<div><strong>Submission Endpoint Notice:</strong> ' + (err.message || 'Unable to reach server endpoint.') +
              ' Please contact us directly at <a href="tel:+918264800254" style="text-decoration:underline;">+91 8264800254</a> or via <a href="https://wa.me/918264800254" target="_blank" rel="noopener" style="text-decoration:underline;">WhatsApp</a>.</div>';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
        }
      });
    });
  });
})();

