import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-testid="page-home"
    >
      <HeroSection />
    </motion.div>
  );
}
