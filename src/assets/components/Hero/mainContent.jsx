import "./mainContent.css";
import myImage from "./logo.png";
import { TfiArrowCircleLeft } from "react-icons/tfi";

const MainContent = () => {
  return (
    <div className="mainWrapper">
      <div className="mainContent">
        <h2>Welcome to the Future of Smart Learning</h2>
        <h1>
          Step Into <span className="clickable">LEARNIFY</span>
          <span className="arrowKapil">
            <TfiArrowCircleLeft />
          </span>
        </h1>
      </div>

      <div className="infoCard">
        <div className="mainInfo">
          <img src={myImage} alt="Kapil" />
          <h1>LEARNIFY</h1>
        </div>
        <div className="infoPara">
          <p>
            Learnify is an AI-powered learning platform that makes education
            smarter and more interactive. It generates clear explanations,
            visuals, and voice-based lessons for any subject — helping learners
            understand complex concepts with ease.
          </p>
          <button className="btnCollaborate">Lets Learn</button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
