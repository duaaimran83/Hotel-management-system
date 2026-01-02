import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToFAQ = () => {
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const faq = document.getElementById('faq-section');
        if (faq) faq.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToTestimonials = () => {
    const testimonialsSection = document.getElementById('testimonials-section');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const testimonials = document.getElementById('testimonials-section');
        if (testimonials) testimonials.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const about = document.getElementById('about-section');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const contact = document.getElementById('contact-section');
        if (contact) contact.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">RoomSync</h2>
          <p>Elevating hotel management since 2024</p>
        </div>

        <div className="footer-links">
          <button onClick={scrollToContact} className="footer-link-btn">Contact Us</button>
          <button onClick={scrollToAbout} className="footer-link-btn">About Us</button>
          <button onClick={scrollToTestimonials} className="footer-link-btn">Testimonials</button>
          <button onClick={scrollToFAQ} className="footer-link-btn">FAQ</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 RoomSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

