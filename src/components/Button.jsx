import React from 'react';
import PropTypes from 'prop-types';
import '../styles/global/button.sass'

const Button = ({ variant, children, onClick }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['fill', 'outline', 'text']).isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Button;
