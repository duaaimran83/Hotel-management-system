import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reviews from '../Reviews/Reviews';
import './Welcome.css';

const Welcome = ({ onNavigateToLogin }) => {
  const navigate = useNavigate();
  const [activeFAQ, setActiveFAQ] = useState(null);

  const scrollToTestimonials = () => {
    document.getElementById('testimonials-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const testimonials = [
    {
      quote: "The RoomSync platform is very user friendly and the onboarding process was very seamless and flexible. It only took about a week. Above all, the customer service proposition was elite.",
      author: "Hotel Grandeur, Paris",
      rating: "★★★★★"
    },
    {
      quote: "We have been so happy to find a hotel management service that caters to small boutique hotels and has customer service responses that keep our business flowing.",
      author: "Miracle Manor, California",
      rating: "★★★★★"
    },
    {
      quote: "RoomSync does a great job of managing all of my channels and giving me real-time information. I also like how I can send confirmations, charge credit cards and send folios from my phone.",
      author: "Pioneer Inn, Alaska",
      rating: "★★★★★"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to set up RoomSync?",
      answer: "Most hotels are fully operational within 1-2 weeks. Our seamless onboarding process includes dedicated support to ensure a smooth transition."
    },
    {
      question: "Can RoomSync integrate with my existing systems?",
      answer: "Yes, we offer integrations with most major PMS, payment gateways, and channel managers. Our team ensures seamless integration."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 customer support, dedicated account managers, and comprehensive training for your team."
    },
    {
      question: "Is my data secure with RoomSync?",
      answer: "Absolutely. We use enterprise-grade encryption, regular security audits, and comply with global data protection regulations."
    },
    {
      question: "How does RoomSync increase direct bookings?",
      answer: "Our platform includes a powerful booking engine, guest marketing CRM, and optimized website templates that typically increase direct bookings by 25%."
    }
  ];

  return (
    <div className="welcome-page">
      {/* NAVIGATION */}
      <nav className="welcome-nav">
        <div className="nav-container">
          <h1 className="welcome-logo">RoomSync</h1>
          <div className="nav-menu">
            <button 
              className="nav-link"
              onClick={scrollToTestimonials}
            >
              Testimonials
            </button>
            <button 
              className="nav-link"
              onClick={() => document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' })}
            >
              FAQ
            </button>
            <button className="nav-btn primary" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="nav-btn secondary" onClick={() => navigate('/login')}>
              Get Demo
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="welcome-hero">
        <div className="hero-content">
          <div className="hero-badge">Trusted by 1,200+ Properties</div>
          <h1 className="hero-title">Elevate Your Hotel Management</h1>
          <p className="hero-subtitle">
            All-in-one platform for modern hospitality excellence
          </p>
          <p className="hero-description">
            RoomSync combines sophisticated technology with intuitive design to 
            streamline operations, maximize revenue, and deliver exceptional 
            guest experiences.
          </p>
          
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => navigate('/login')}>
              Start Free Trial
            </button>
            <button className="hero-btn secondary" onClick={scrollToTestimonials}>
              <span className="btn-icon">▸</span>
              Watch Success Stories
            </button>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">25%</div>
            <div className="stat-label">More Direct Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Guest Satisfaction</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">35%</div>
            <div className="stat-label">Revenue Growth</div>
          </div>
        </div>
      </section>
// Replace the entire welcome-features section with this:

{/* WHY CHOOSE US / ABOUT */}
<section id="about-section" className="welcome-why">
  <div className="section-header">
    <h2>Why Choose RoomSync?</h2>
    <p>The intelligent platform trusted by forward-thinking hotels worldwide</p>
  </div>
  
  <div className="features-showcase">
    <div className="feature-highlight">
      <div className="feature-visual">
        <div className="visual-icon">🏨</div>
        <div className="visual-line"></div>
      </div>
      <div className="feature-text">
        <span className="feature-label">Core Advantage</span>
        <h3>Unified Hotel Operations</h3>
        <p>
          Seamlessly manage reservations, guest profiles, housekeeping, and billing 
          from one intuitive dashboard. Replace multiple systems with a single source of truth.
        </p>
        <ul className="feature-benefits">
          <li> Real-time occupancy tracking</li>
          <li> Integrated guest communication</li>
          <li> Automated daily reports</li>
        </ul>
      </div>
    </div>
    
    <div className="feature-highlight reverse">
      <div className="feature-visual">
        <div className="visual-icon">📈</div>
        <div className="visual-line"></div>
      </div>
      <div className="feature-text">
        <span className="feature-label">Revenue Growth</span>
        <h3>Intelligent Profit Optimization</h3>
        <p>
          Our AI analyzes market trends, competitor pricing, and demand patterns 
          to recommend optimal rates and maximize your revenue potential.
        </p>
        <ul className="feature-benefits">
          <li> Dynamic pricing automation</li>
          <li> Revenue forecasting</li>
          <li> Channel performance insights</li>
        </ul>
      </div>
    </div>
  </div>

  {/* QUICK FEATURES GRID */}
  <div className="quick-features">
    <div className="quick-feature">
      <div className="quick-icon">
        <div className="icon-wrapper">
          <span className="material-icons">security</span>
        </div>
      </div>
      <h4>Bank-Level Security</h4>
      <p>GDPR compliant with encrypted transactions and regular security audits</p>
    </div>
    
    <div className="quick-feature">
      <div className="quick-icon">
        <div className="icon-wrapper">
          <span className="material-icons">auto_awesome</span>
        </div>
      </div>
      <h4>Smart Automation</h4>
      <p>Automate check-ins, confirmations, and reporting to focus on guests</p>
    </div>
    
    <div className="quick-feature">
      <div className="quick-icon">
        <div className="icon-wrapper">
          <span className="material-icons">support_agent</span>
        </div>
      </div>
      <h4>24/7 Premium Support</h4>
      <p>Dedicated account managers and round-the-clock technical assistance</p>
    </div>
    
    <div className="quick-feature">
      <div className="quick-icon">
        <div className="icon-wrapper">
          <span className="material-icons">sync_alt</span>
        </div>
      </div>
      <h4>Seamless Integrations</h4>
      <p>Connect with 100+ tools including PMS, payment systems, and OTAs</p>
    </div>
  </div>
</section>

      {/* TESTIMONIALS */}
      <section id="testimonials-section" className="welcome-testimonials">
        <div className="section-header">
          <h2>Trusted by Hospitality Leaders</h2>
          <p>See what hoteliers say about their RoomSync experience</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">{testimonial.rating}</div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <div className="author-name">{testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonials-cta">
          <button className="cta-btn" onClick={() => navigate('/login')}>
            Join Our Success Stories
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="welcome-faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions about RoomSync</p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFAQ === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{activeFAQ === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact-section" className="welcome-cta">
        <h2>Ready to Transform Your Hotel Operations?</h2>
        <p>Join thousands of hotels that trust RoomSync for their success</p>
        <div className="cta-buttons">
          <button className="cta-btn primary" onClick={() => navigate('/login')}>
            Get Started Free
          </button>
          <button className="cta-btn secondary" onClick={() => navigate('/login')}>
            Schedule a Demo
          </button>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(246, 244, 239, 0.2)' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>Contact Us:</p>
          <p style={{ marginBottom: '0.5rem' }}>
            <a href="mailto:support@roomsync.com" style={{ color: '#f6f4ef', textDecoration: 'none' }}>
              📧 support@roomsync.com
            </a>
          </p>
          <p>
            <a href="tel:+1234567890" style={{ color: '#f6f4ef', textDecoration: 'none' }}>
              📞 +1 (234) 567-890
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="welcome-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">RoomSync</h2>
            <p>Elevating hotel management since 2024</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#integrations">Integrations</a>
            </div>
            
            <div className="link-group">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#blog">Blog</a>
              <a href="#help">Help Center</a>
              <a href="#api">API Docs</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 RoomSync. All rights reserved. Built for modern hospitality teams.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;