import "./AboutUs.css";
import logo from "./logo.png"; // adjust path if needed
import kapil from "./kapil.jpeg"; // add your photo
import amber from "./amber.jpeg"; // add Amber’s photo

const AboutUs = () => {
  return (
    <div className="aboutUs">
      <h1 className="aboutTitle">About Us</h1>

      {/* Site info section */}
      <div className="aboutIntro">
        <img src={logo} alt="Techify Logo" className="siteLogo" />
        <p>
          <strong>Learnify</strong> is an AI-powered learning and practice platform designed to
          revolutionize education. Students can ask questions, get instant AI-generated answers, 
          and practice topic-based questions using advanced AI technology — powered by Google Gemini.
        </p>
      </div>

      {/* Developer Section */}
      <h2 className="devTitle">Meet the Developers</h2>

      <div className="devSection">
        {/* Kapil Card */}
        <div className="devCard">
          <img src={kapil} alt="Kapil Yadav" />
          <h3>Kapil Yadav</h3>
          <span className="tag">Founder</span>
          <p>IIEST Shibpur</p>
        </div>

        {/* Amber Card */}
        <div className="devCard">
          <img src={amber} alt="Amber Jauhari" />
          <h3>Amber Jauhari</h3>
          <span className="tag">Co-Founder</span>
          <p>IIEST Shibpur</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
