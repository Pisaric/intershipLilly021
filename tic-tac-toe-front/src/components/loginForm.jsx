import React, { Component } from 'react';
import Input from './input';
import Joi from 'joi-browser';
import config from '../config.json'
import { login } from '../services/authService'

class LoginForm extends Component {
    state = {
        account: 
        {
            email: '',
            password: ''
        },
        errors: {}
        
    };

    schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    };

    validate = () => {
        return this.schema.validate(this.state.account);
    }

    handlerSubmit = e => {
        e.preventDefault();

        const errors= this.validate();
        this.setState({ errors });
        if(errors) return;

        const email = this.username.current.value;
        console.log("Submitted");
    };

    handleChange = ({ currentTarget: input }) => {
        const account = {...this.state.account };
        account[input.name] = input.value;
        this.setState({ account });
    };

    render() { 
        const { account, errors } = this.state;

        return ( 
            <div>
                <h1>Login</h1>
                <form>
                    <Input 
                        name="email"
                        value={account.email}
                        label="Email"
                        onChange={this.handleChange}
                        error={errors.email}/>
                    <Input name="password"
                        value={account.password}
                        label="Password"
                        onChange={this.handleChange}
                        error={errors.password}/>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

        );
    }
}
 
export default LoginForm;