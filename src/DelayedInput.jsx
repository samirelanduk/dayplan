import { useState, useRef } from "react";
import PropTypes from "prop-types";

const DelayedInput = props => {

  const { value, onChange, ...rest } = props;

  const [displayValue, setDisplayValue] = useState(null);

  const timeoutRef = useRef(null);

  const valueChanged = e => {
    setDisplayValue(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(e);
    }, 1500);
  }

  return (
    <input
      value={displayValue === null ? value : displayValue}
      onChange={valueChanged}
      {...rest}
    />
  );
};

DelayedInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DelayedInput;