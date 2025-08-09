import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEnvelope, faComment, faQrcode, faCheck } from '@fortawesome/free-solid-svg-icons';

function InviteSection() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const inviteUrl = window.location.origin;
  const inviteMessage = "Hey! Check out SnipSlip!";
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${inviteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${inviteMessage}\n\n${inviteUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${inviteMessage}\n\n${inviteUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(`${inviteMessage}\n\n${inviteUrl}`)}`;
    window.open(smsUrl);
  };

  const shareEmail = () => {
    const subject = 'Join me on SnipSlip!';
    const body = `${inviteMessage}\n\nJoin here: ${inviteUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  const generateQRCode = () => {
    // Using a simple QR code service - in production you might want to use a more robust solution
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`;
  };

  return (
    <div className="card-elevated mb-4">
      <div className="card-header-custom">
        <strong>Invite Friends to SnipSlip</strong>
      </div>
      <div className="card-body-custom">
        {/* Share buttons */}
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <button
              onClick={copyToClipboard}
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
            >
              <FontAwesomeIcon 
                icon={copied ? faCheck : faCopy} 
                className="me-2" 
                style={{ color: copied ? '#10b981' : undefined }}
              /> 
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          
          <div className="col-6 col-md-3">
            <button
              onClick={shareWhatsApp}
              className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
            >
              <FontAwesomeIcon icon={faComment} className="me-2" />
              WhatsApp
            </button>
          </div>
          
          <div className="col-6 col-md-3">
            <button
              onClick={shareSMS}
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
            >
              <FontAwesomeIcon icon={faComment} className="me-2" />
              SMS
            </button>
          </div>
          
          <div className="col-6 col-md-3">
            <button
              onClick={shareEmail}
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
              style={{ fontSize: '0.85rem', padding: '0.5rem' }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email
            </button>
          </div>
        </div>

        {/* QR Code toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="btn btn-link btn-sm text-muted"
            style={{ fontSize: '0.8rem', textDecoration: 'none' }}
          >
            <FontAwesomeIcon icon={faQrcode} className="me-1" />
            {showQR ? 'Hide QR Code' : 'Share with QR Code'}
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="text-center mt-3">
            <img
              src={generateQRCode()}
              alt="QR Code for SnipSlip"
              style={{ maxWidth: '150px', border: '1px solid #e9ecef', borderRadius: '8px', marginBottom: '1rem' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InviteSection; 