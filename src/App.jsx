import "./App.css";
import AboutUs from "./assets/components/About Page/about";
import AskAI from "./assets/components/Ask Ai/askAnime";
import PageTwo from "./assets/components/Ask Ai/PageTwo";
import ContactPage from "./assets/components/Contact Page/contactPage";
import ContactBtn from "./assets/components/Hero/contactBtn";
import Hero from "./assets/components/Hero/hero";
import MainContent from "./assets/components/Hero/mainContent";
import Hover from "./assets/components/hoverEffect/hover";
import VideoGenerator from "./assets/components/Image generator/ImageGenerator";
import Navbar from "./assets/components/Navbar/Navbar";
import Practice from "./assets/components/PracticePage/Practice";

function App() {
  return (
    <>
      {/* 🏠 Home Section */}
      <div className="landingPage" id="home">
        <Navbar />
        <MainContent />
        <ContactBtn />
        <div className="hero">
          <Hero />
        </div>
      </div>

      {/* 🤖 Ask AI Section */}
      <div className="pageTwo" id="askAI">
        <AskAI />
        <PageTwo />
      </div>

      {/* 📘 Practice Section */}
      <div className="pageThree" id="learn">
        <Practice />
      </div>

      <div className="pageAbout" id="about">
        <AboutUs> </AboutUs>
        <Hover></Hover>
        <ContactBtn></ContactBtn>
      </div>

      <div className="pageContactfour" id="contact">
        <ContactPage></ContactPage>
      </div>

    </>
  );
}

export default App;
