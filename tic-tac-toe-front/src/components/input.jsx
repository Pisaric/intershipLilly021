import React from "react";

const Input = ({ name, label, value, onChange, error }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <input 
                value={value} 
                onChange={onChange}
                id={name} type="text" 
                name={name}
                className="form-control"  
                placeholder="Enter email" />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}

export default Input;