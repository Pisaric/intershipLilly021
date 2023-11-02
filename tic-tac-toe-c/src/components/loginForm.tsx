import React, { Component } from "react";
import Joi from 'joi';
import Input from "./common/input";
import { login } from "../service/authService";
import http from "../service/httpService";

const apiEndpoint = "http://localhost:3000/api/";

class LoginForm extends Component {
    state = {
        data: {
            email: "",
            password: "",
            name: "",
            surname: "",
            username: ""
        },
        registerRender: false,
        errors: {
            email: "",
            password: "",
            name: "",
            surname: "",
            username: ""
        }
    };

    schema = Joi.object({
        email: Joi.string()
            .required()
            .label('Email'),
        password: Joi.string()
            .required()
            .label('Password'),
    });

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // const errors = this.validate();
        // this.setState({ errors: errors || {} });
        // if (errors) return;

        try {
            console.log('prosao');
            const { data } = this.state;
            await login(data.email, data.password);
            window.location.reload();
        } catch (ex) {

        }
    }

    handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = this.state;

        try {
            await http.post(apiEndpoint + 'users', { data })
                .catch(ex => {
                    alert('User already registered.');
                });
            await login(data.email, data.password);
            window.location.reload();
        } catch (ex) {
            
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const data: any = { ...this.state.data };
        data[name] = value;
        this.setState({ data });
    }

    validate = () => {
        const options = { abortEarly: false };
    //    const { error } = Joi.validate(this.state.data, this.schema, options);
    //    if (!error) return null;

        const errors: { [key: string]: string } = {};
    //    for (let item of error.details)
    //        errors[item.path[0]] = item.message;

        return errors;
    }

    loginOrRegister = () => {
        const { data, errors } = this.state;

        if (!this.state.registerRender) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <form onSubmit={this.handleSubmit} className="text-center">
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
                            <p className="text-center mt-3">
                                Not a member?{" "}
                                <button className="btn btn-primary" onClick={this.handleRegister}>
                                    Register
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <form onSubmit={this.handleRegisterSubmit} className="text-center">
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
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                Already have an account?{" "}
                                <button className="btn btn-primary" onClick={this.handleRegister}>
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    handleRegister = () => {
        this.setState({ registerRender: !this.state.registerRender });
    }

    render() {
        return (
            <React.Fragment>
                {this.loginOrRegister()}
            </React.Fragment>
        );
    }
}

export default LoginForm;
