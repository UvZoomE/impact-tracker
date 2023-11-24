import "../css/SignIn.css"

const SignIn = () => {
    return (
            <form className="rux-form">
                <h6 className="body-quote">
                Measure your success in the Space Force!
                </h6>
                <div className="sign-in-inputs">
                    <label>Email</label>
                    <input
                    type="text"
                    placeholder="Email@astro.com"
                    name="email"
                    required
                    className="email-input"
                    />
                    <input 
                    type="text"
                    placeholder="password"
                    name="password"
                    required
                    className="password-input"
                    />
                </div>
                <div className="sign-in-helper-functions">
                    <label className="checkbox-control">
                    <input type="checkbox" name="checkbox" className="remember-me"/>
                    Remember me
                    </label>
                    <p className="forgot-password">Forgot Password?</p>
                </div>
                <div className="sign-in-btn-container">
                    <button className="sign-in-btn" type="submit">
                    Sign in
                    </button>
                    <p className="smaller-forgot-password">Forgot Password?</p>
                </div>
            </form>
    )
}

export default SignIn;