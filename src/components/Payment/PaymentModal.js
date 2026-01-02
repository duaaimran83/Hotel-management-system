import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ booking, onClose, onPayment }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      alert('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    
    const paymentDetails = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardName,
      expiryDate,
      cvv,
      amount: booking.totalAmount,
      timestamp: new Date().toISOString()
    };

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPayment(paymentDetails);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-summary">
          <h3>Booking Summary</h3>
          {booking.type === 'facility' ? (
            <>
              <div className="summary-item">
                <span>Facility:</span>
                <span>{booking.facilityName}</span>
              </div>
              {booking.title && (
                <div className="summary-item">
                  <span>Event:</span>
                  <span>{booking.title}</span>
                </div>
              )}
              {booking.date && (
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
              )}
              {booking.time && (
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{booking.time}</span>
                </div>
              )}
              {booking.numberOfPeople && (
                <div className="summary-item">
                  <span>Attendees:</span>
                  <span>{booking.numberOfPeople} people</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="summary-item">
                <span>Room:</span>
                <span>{booking.roomName}</span>
              </div>
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
            </>
          )}
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>${booking.totalAmount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setExpiryDate(value.match(/.{1,2}/g)?.join('/') || value);
                  }
                }}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="payment-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${booking.totalAmount}`}
          </button>
        </form>

        {isProcessing && (
          <div className="processing-overlay">
            <div className="processing-spinner"></div>
            <p>Processing your payment...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

