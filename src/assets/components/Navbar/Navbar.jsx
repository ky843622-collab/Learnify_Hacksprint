import "./Navbar.css";
import myImage from "./logo.png";

const Navbar = () => {

  // smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={myImage} alt="logo" />
      </div>

      <div className="glass">
        <ul>
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("askAI")}>Ask AI</li>
          <li onClick={() => scrollToSection("learn")}>Practice</li>
          <li onClick={() => scrollToSection("about")}>About Us</li>
        </ul>
      </div>

      <div className="btn">
        <button onClick={() => scrollToSection("askAI")}>Try Now</button>
      </div>
    </div>
  );
};

export default Navbar;
