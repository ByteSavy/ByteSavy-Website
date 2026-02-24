const { createRoot } = ReactDOM;
const { motion } = Motion;

function App() {
  return <Links />;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

function Links() {
  return (
    <section className="grid place-content-center h-screen bg-green-300 text-black">
      <Link href="#">Voyage</Link>
      <Link href="#">Mystic</Link>
      <Link href="#">Ember</Link>
      <Link href="#">Twilight</Link>
    </section>
  );
}

function Link({ href, children }) {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hovered: { y: "-100%" }
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        variants={{
          initial: { y: "100%" },
          hovered: { y: 0 }
        }}
      >
        {children}
      </motion.div>
    </motion.a>
  );
}
