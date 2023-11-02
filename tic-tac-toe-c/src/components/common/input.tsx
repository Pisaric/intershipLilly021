import React from "react";

interface InputProps {
    name: string;
    label: string;
    value: string;
    error: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
}

const Input: React.FC<InputProps> = ({ name, label, value, error, onChange, type }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                value={value}
                onChange={onChange}
                autoFocus
                name={name}
                type={type}
                id={name}
                className="form-control"
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}

export default Input;
