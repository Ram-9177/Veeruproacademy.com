const React = require('react');

const QRCodeSVG = ({ value, size }) => {
  return React.createElement(
    'div',
    { 'data-testid': 'qrcode', style: { width: size, height: size } },
    String(value || '')
  );
};

// Provide both named and default exports to satisfy different import styles
module.exports = {
  QRCodeSVG,
  default: QRCodeSVG,
};