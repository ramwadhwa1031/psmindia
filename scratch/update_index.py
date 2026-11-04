# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

start_marker = '    <!-- D. SERVICE OVERVIEW'
end_marker = '    <!-- F. INTERACTIVE COMMUNICATION SHOWCASE -->'

idx1 = content.find(start_marker)
idx2 = content.find(end_marker)

if idx1 == -1 or idx2 == -1:
    print('Error finding markers:', idx1, idx2)
    exit(1)

new_block = '''    <!-- D. SERVICE OVERVIEW — 4 CORE CHANNELS / OUR SERVICES -->
    <section class="section" id="servicesOverview">
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="eyebrow"><i class="fa-solid fa-layer-group"></i> 4 Core Channels</span>
          <h2>Our <span class="text-gradient">Services</span></h2>
          <p>Powerful and reliable channels to connect, engage, and grow your business.</p>
        </div>

        <div class="services-grid-4">
          <!-- Card 1: Bulk SMS -->
          <article class="service-card" data-service="sms" data-reveal data-delay="100">
            <a href="bulk-sms.html" class="service-card-thumb" aria-label="Explore Bulk SMS">
              <picture>
                <source srcset="assets/images/services/bulk-sms.webp" type="image/webp">
                <img src="assets/images/services/bulk-sms.png" alt="Bulk SMS Live Simulator - PS Message India" width="414" height="340" loading="lazy">
              </picture>
            </a>
            <div class="service-card-body">
              <div class="service-card-header">
                <span class="service-icon-badge" style="background:rgba(124,58,237,0.12);color:#7C3AED;"><i class="fa-solid fa-comment-sms"></i></span>
                <h3><a href="bulk-sms.html">Bulk SMS</a></h3>
              </div>
              <p>Instant promotional broadcasts, transactional updates, and OTP verification with DLT support.</p>
              <div class="service-feature-tags">
                <span class="service-tag">Promotional</span>
                <span class="service-tag">Transactional</span>
                <span class="service-tag">OTP &amp; DLT</span>
              </div>
              <div class="service-card-actions">
                <a href="contact.html" class="service-action-btn">
                  <span>Contact Us</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>

          <!-- Card 2: Bulk WhatsApp -->
          <article class="service-card" data-service="whatsapp" data-reveal data-delay="200">
            <a href="bulk-whatsapp.html" class="service-card-thumb" aria-label="Explore Bulk WhatsApp">
              <picture>
                <source srcset="assets/images/services/bulk-whatsapp.webp" type="image/webp">
                <img src="assets/images/services/bulk-whatsapp.png" alt="Bulk WhatsApp Campaign Simulator - PS Message India" width="414" height="340" loading="lazy">
              </picture>
            </a>
            <div class="service-card-body">
              <div class="service-card-header">
                <span class="service-icon-badge" style="background:rgba(16,185,129,0.12);color:#10B981;"><i class="fa-brands fa-whatsapp"></i></span>
                <h3><a href="bulk-whatsapp.html">Bulk WhatsApp</a></h3>
              </div>
              <p>Share rich media PDFs, product catalogs, automated alerts, and interactive customer updates.</p>
              <div class="service-feature-tags">
                <span class="service-tag">Rich Media</span>
                <span class="service-tag">Campaigns</span>
                <span class="service-tag">Automated</span>
              </div>
              <div class="service-card-actions">
                <a href="contact.html" class="service-action-btn">
                  <span>Contact Us</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>

          <!-- Card 3: Voice Calls -->
          <article class="service-card" data-service="voice" data-reveal data-delay="300">
            <a href="voice-calls.html" class="service-card-thumb" aria-label="Explore Voice Calls">
              <picture>
                <source srcset="assets/images/services/voice-calls.webp" type="image/webp">
                <img src="assets/images/services/voice-calls.png" alt="Voice Broadcast Simulator - PS Message India" width="414" height="340" loading="lazy">
              </picture>
            </a>
            <div class="service-card-body">
              <div class="service-card-header">
                <span class="service-icon-badge" style="background:rgba(37,99,235,0.12);color:#2563EB;"><i class="fa-solid fa-phone-volume"></i></span>
                <h3><a href="voice-calls.html">Voice Calls</a></h3>
              </div>
              <p>Broadcast pre-recorded voice messages, regional announcements, and automated call alerts.</p>
              <div class="service-feature-tags">
                <span class="service-tag">Broadcasting</span>
                <span class="service-tag">Regional Audio</span>
                <span class="service-tag">Reminders</span>
              </div>
              <div class="service-card-actions">
                <a href="contact.html" class="service-action-btn">
                  <span>Contact Us</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>

          <!-- Card 4: RCS Messaging -->
          <article class="service-card" data-service="rcs" data-reveal data-delay="400">
            <a href="rcs-messaging.html" class="service-card-thumb" aria-label="Explore RCS Messaging">
              <picture>
                <source srcset="assets/images/services/rcs-messaging.webp" type="image/webp">
                <img src="assets/images/services/rcs-messaging.png" alt="RCS Messaging Campaign Simulator - PS Message India" width="414" height="340" loading="lazy">
              </picture>
            </a>
            <div class="service-card-body">
              <div class="service-card-header">
                <span class="service-icon-badge" style="background:rgba(234,88,12,0.12);color:#EA580C;"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
                <h3><a href="rcs-messaging.html">RCS Messaging</a></h3>
              </div>
              <p>Deliver verified rich cards, swipeable carousels, and one-tap action buttons inside native messages.</p>
              <div class="service-feature-tags">
                <span class="service-tag">Rich Cards</span>
                <span class="service-tag">Carousels</span>
                <span class="service-tag">Tap Buttons</span>
              </div>
              <div class="service-card-actions">
                <a href="contact.html" class="service-action-btn">
                  <span>Contact Us</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- E. WHY CHOOSE PS MESSAGE INDIA? — REDESIGNED MODERN ENTERPRISE FEATURE SYSTEM -->
    <section class="section section-white" id="whyChooseUs">
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="eyebrow"><i class="fa-solid fa-bolt"></i> ENTERPRISE RELIABILITY</span>
          <h2>Why Choose <span class="text-gradient">PS Message India?</span></h2>
          <p>A reliable, scalable &amp; compliant communication platform for businesses across India.</p>
        </div>

        <!-- 1. Key Quantified Proof Strip -->
        <div class="why-stats-ribbon" data-reveal>
          <div class="why-stat-box">
            <div class="why-stat-icon"><i class="fa-solid fa-bolt"></i></div>
            <div class="why-stat-text">
              <span class="why-stat-value">&lt; 3s</span>
              <span class="why-stat-label">OTP Delivery</span>
            </div>
          </div>
          <div class="why-stat-box">
            <div class="why-stat-icon"><i class="fa-solid fa-tower-broadcast"></i></div>
            <div class="why-stat-text">
              <span class="why-stat-value">99.9%</span>
              <span class="why-stat-label">Uptime SLA</span>
            </div>
          </div>
          <div class="why-stat-box">
            <div class="why-stat-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="why-stat-text">
              <span class="why-stat-value">100%</span>
              <span class="why-stat-label">TRAI &amp; DLT Compliant</span>
            </div>
          </div>
          <div class="why-stat-box">
            <div class="why-stat-icon"><i class="fa-solid fa-headset"></i></div>
            <div class="why-stat-text">
              <span class="why-stat-value">24/7</span>
              <span class="why-stat-label">Expert Support</span>
            </div>
          </div>
        </div>

        <!-- 2. Modern 3x2 Value Grid Matching Screenshot 3 -->
        <div class="why-grid-modern" data-reveal>
          <div class="why-modern-card" data-delay="100">
            <img src="assets/images/why-choose/why-card-1.png" alt="Telecom Connectivity - Direct &amp; Reliable" width="636" height="270" loading="lazy">
          </div>
          <div class="why-modern-card" data-delay="150">
            <img src="assets/images/why-choose/why-card-2.png" alt="DLT Compliant Messaging - Safe &amp; Compliant" width="636" height="270" loading="lazy">
          </div>
          <div class="why-modern-card" data-delay="200">
            <img src="assets/images/why-choose/why-card-3.png" alt="High-Speed OTP - Sub-3s Delivery" width="636" height="270" loading="lazy">
          </div>
          <div class="why-modern-card" data-delay="250">
            <img src="assets/images/why-choose/why-card-4.png" alt="Easy Integrations - API &amp; Webhooks" width="636" height="270" loading="lazy">
          </div>
          <div class="why-modern-card" data-delay="300">
            <img src="assets/images/why-choose/why-card-5.png" alt="Campaign Dashboard - Track &amp; Optimize" width="636" height="270" loading="lazy">
          </div>
          <div class="why-modern-card" data-delay="350">
            <img src="assets/images/why-choose/why-card-6.png" alt="Dedicated Support - Always Available" width="636" height="270" loading="lazy">
          </div>
        </div>

        <!-- 3. Bottom Modern CTA Banner Matching Screenshot 3 -->
        <div class="why-bottom-cta-banner" data-reveal>
          <div class="why-banner-text">
            <h3>Ready to simplify your business communication?</h3>
            <p>Start sending SMS, WhatsApp, Voice &amp; RCS in minutes.</p>
          </div>
          <div class="why-banner-actions">
            <a href="contact.html" class="why-banner-btn-white">
              <span>Request a Free Demo</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
            <a href="https://wa.me/918264800254?text=Hello%20PS%20Message%20India%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20messaging%20platform." target="_blank" rel="noopener noreferrer" class="why-banner-btn-whatsapp">
              <i class="fa-brands fa-whatsapp"></i>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>

'''

updated_content = content[:idx1] + new_block + content[idx2:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print('Successfully updated index.html!')

