import "./style/style.css";

export const Box = () => {
  return (
    <>
      <div className="object">
        <div className="box rounding">
          <div className="head-text">
            Sign Into<br></br> Your Account
          </div>
          <div className="feilds">
            <div className="company">
              <label className="block">Company ID</label>
              <input type="text" className="input rounded block" />
            </div>
            <div className="password">
              <label className="block">Password</label>
              <input type="text" className="input rounded block" />
            </div>
          </div>
          <div className="remember">
            <input type="checkbox" />
            <div className="inline remember-padding">Remember Me</div>
          </div>
          <div class="d-grid gap-2 col-7 mx-auto signin">
            <button class="btn btn-primary" type="button">
              Button
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Box;
