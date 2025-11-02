const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

// 🔹 Button component
const ContactBtn = () => {
  return (
    <div className="contactBtn btn">
      <button onClick={() => scrollToSection("contact")}>Contact Us</button>
    </div>
  );
};

export default ContactBtn;