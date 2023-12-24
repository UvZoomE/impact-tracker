import "../css/SignIn.css"

const SignIn = () => {
    return (
            <form className="rux-form">
                <div className="sign-in-inputs">
                    <label className="email-label" htmlFor="email">Email</label>
                    <input
                    id="email"
                    type="text"
                    placeholder="Email@astro.com"
                    name="email"
                    required
                    className="email-input"
                    />
                    <label className="password-label" htmlFor="password">Password</label>
                    <input 
                    type="text"
                    placeholder="Password"
                    name="password"
                    required
                    className="password-input"
                    />
                </div>
                <label className="checkbox-control">
                <input type="checkbox" name="checkbox" className="remember-me"/>
                Remember me
                </label>
                <button className="sign-in-btn" type="submit">
                    Sign in
                </button>
                <p className="forgot-password">Forgot Password?</p>
            </form>
    )
}

export default SignIn;