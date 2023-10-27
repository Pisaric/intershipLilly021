import React, { Component } from "react";
import Joi from 'joi-browser';
import Input from "./common/input";
import { login } from "../services/authService";
import http from "../services/httpService";

const apiEndpoint = "http://localhost:3000/api/";

class loginForm extends Component {
    state = {
        data: {
            email: "",
            password: "",
            name: "",
            surname: "",
            username: ""
        },
        registerRedner: false,
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
       // const errors = this.validate();
        //this.setState({ errors: errors || {} });
        //if(errors) return;
        try {
            const { data } = this.state;
            await login(data.email, data.password);
            window.location.reload(false);

           // this.setState({ data });
           //props.history.push("/singleplayer");
        } catch(ex) {
            alert('Invalid email or password.');
        }
    }
    
    handlerRegisterSubmit = async (e) => {
        e.preventDefault();
        const { data } = this.state; 
       // const errors = this.validate();
       // this.setState({ errors: errors || {} });  
       // if(errors) return;
        try {
            await http.post(apiEndpoint + 'users', { data }).then(async (res) =>{
                await login(data.email, data.password);
            });
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

    handleRegister = () => {
        let { registerRedner } = this.state;
        registerRedner = !registerRedner;
        this.setState({ registerRedner });
    }

    loginOrRegister = () => {
        const {data, errors} = this.state;

        if(!this.state.registerRedner) 
        {
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
                                    type="password"
                                />
                            </div>
                            <div className="form-group mt-3">
                            <button 
                                //disabled={this.validate()}
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                            </div>
                        </form>
                        <p className="text-center mt-3">Not a member? <button className="btn btn-primary" onClick={this.handleRegister.bind(this)} >Register</button></p>
                        </div>
                    </div>
                </div>
            ); 
        }
        return (
            <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                <form onSubmit={this.handlerRegisterSubmit} className="text-center"> 
                    <div className="form-group">
                        <Input 
                            name="name"
                            value={data.name}
                            label="Name"
                            onChange={this.handleChange}
                            error={errors.name}
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            name="surname"
                            value={data.surname}
                            label="Surname"
                            onChange={this.handleChange}
                            error={errors.surname}
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            name="username"
                            value={data.username}
                            label="Username"
                            onChange={this.handleChange}
                            error={errors.username}
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            name="email"
                            value={data.email}
                            label="Email"
                            onChange={this.handleChange}
                            error={errors.email}
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            name="password"
                            value={data.password}
                            label="Password"
                            onChange={this.handleChange}
                            error={errors.password}
                            type="password"
                        />
                    </div>
                    <div className="form-group mt-3">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                    >
                        Submit
                    </button>
                    </div>
                </form>
                <p className="text-center mt-3">Already have an account? <button className="btn btn-primary" onClick={this.handleRegister.bind(this)} >Login</button></p>
                </div>
            </div>
        </div>
        );
    }

    render() { 
        

        return (
            <React.Fragment>
                { this.loginOrRegister() }
            </React.Fragment>
        );
    }
}
 
export default loginForm;
