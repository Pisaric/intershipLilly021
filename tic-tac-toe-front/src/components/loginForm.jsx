import React, { Component } from "react";
import Joi from 'joi-browser';
import Input from "./common/input";
import { login } from "../services/authService";

class loginForm extends Component {
    state = {
        data: {
            email: "",
            password: ""
        },
        errors: {}
    };

    schema = Joi.object({
        email: Joi.string()
                  .email()
                  .required()
                  .label('Email'),
        password: Joi.string()
                     .required()
                     .label('Password'),
    });

    handlerSumbit = async (e) => {
        e.preventDefault();

        //Pozovi server
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if(errors) return;
        try {
            const { data } = this.state;
            await login(data.email, data.password);
            window.location.reload(false);
           // this.setState({ data });
           //props.history.push("/singleplayer");
        } catch(ex) {

        }
    }
    
    
    
    handleChange = ({ currentTarget: input }) => {

        const data = {...this.state.data};
        data[input.name] = input.value;

        this.setState({ data });
    }

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if(!error) return null;

        const errors = {};
        for(let item of error.details) errors[item.path[0]] = item.message;

        return errors;
    }

    validateProperty = ({name, value}) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const {error} = Joi.validate(obj, schema, {abortEarly: false});
        if(error) return null;
        return error.details[0].message;
    }


    render() { 
        const {data, errors} = this.state;


        return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                <form onSubmit={this.handlerSumbit} className="text-center"> 
                    <div className="form-group">
                    <Input 
                        name="email"
                        value={data.email}
                        label="Email"
                        onChange={this.handleChange}
                        error={errors.email}
                    />
                    </div>
                    <div className="form-group">
                    <Input 
                        name="password"
                        value={data.password}
                        label="Password"
                        onChange={this.handleChange}
                        error={errors.password}
                    />
                    </div>
                    <div className="form-group mt-3">
                    <button 
                        disabled={this.validate()}
                        type="submit" 
                        className="btn btn-primary"
                    >
                        Submit
                    </button>
                    </div>
                </form>
                <p className="text-center mt-3">Not a member? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
        );
    }
}
 
export default loginForm;


/*
                <form onSubmit={this.handlerSumbit}>
                    <Input 
                        name="email"
                        value={data.email}
                        label="Email"
                        onChange={this.handleChange}
                        error={errors.email}
                    />
                    <Input 
                        name="password"
                        value={data.password}
                        label="Password"
                        onChange={this.handleChange}
                        error={errors.password}
                    />
                    <button 
                        disabled={this.validate()}
                        type="submit" 
                        className="btn btn-primary">Submit
                    </button>
                </form>
*/

/*
<div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto">
                    <form onSubmit={this.handlerSubmit} className="text-center"> 
                        <div className="form-group">
                        <Input 
                            name="email"
                            value={data.email}
                            label="Email"
                            onChange={this.handleChange}
                            error={errors.email}
                        />
                        </div>
                        <div className="form-group">
                        <Input 
                            name="password"
                            value={data.password}
                            label="Password"
                            onChange={this.handleChange}
                            error={errors.password}
                        />
                        </div>
                        <div className="form-group mt-3">
                        <button 
                            disabled={this.validate()}
                            type="submit" 
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                        </div>
                    </form>
                    <p className="text-center mt-3">Not a member? <a href="/register">Register</a></p>
                    </div>
                </div>
            </div>
*/