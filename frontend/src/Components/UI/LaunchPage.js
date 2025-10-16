import "./LaunchPage.css";
import Button from "react-bootstrap/Button";

const LaunchPage = (props) => {
  if (props.visible === "false") {
    return;
  } else {
    return (
      <div className="launchContainer">
        <div className="launchTitles">
          <img
            className="loginBrand"
            src="SnapAndMixLogo.png"
            alt="company-brand"
          ></img>

          <div class="ageVeificationDiv">
            <h2>Age Verification</h2>
            <p>
              By clicking enter, you certify that you are of legal drinking age
              in the state / province in which you currently reside.
            </p>

            <Button variant="customEnter" onClick={props.handler}>
              ENTER
            </Button>
            <small>Always enjoy responsibly</small>
          </div>
        </div>
        <div className="developerSignature">
          <p className="developedbyText">Developed By</p>
          <img
            className="companyBrand"
            src="Scan5Logo.png"
            alt="company-brand"
          ></img>
        </div>
      </div>
    );
  }
};

export default LaunchPage;
