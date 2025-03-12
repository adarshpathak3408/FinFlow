import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WalletCards, ChevronRight, PieChart, Shield, Zap, Users } from 'lucide-react';

const teamMembers = [
  {
    name: "Sneha Gawande",
    role: "Team Lead & Frontend Developer",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    github: "https://github.com/adarshpathak"
  },
  {
    name: "Prerna",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    github: "https://github.com/priyasharma"
  },
  {
    name: "Name 3",
    role: "Tester",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    github: "https://github.com/rahulkumar"
  },
  {
    name: "Name 4",
    role: "Data Validator",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    github: "https://github.com/nehapatel"
  }
];

const faqs = [
  {
    question: "How secure is my financial data?",
    answer: "Your data is stored locally on your device and is never transmitted to any server. We use modern encryption standards to ensure your information remains private."
  },
  {
    question: "Can I export my transaction history?",
    answer: "Yes, you can export your transaction history as a CSV file for further analysis or record-keeping."
  },
  {
    question: "Is there a limit to how many transactions I can track?",
    answer: "No, there's no limit to the number of transactions you can track. The app is designed to handle years of financial data efficiently."
  },
  {
    question: "Can I categorize my expenses?",
    answer: "Currently, transactions are categorized as income or expenses. We're working on adding custom categories in a future update."
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#21262d] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletCards className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">Finflow</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#team" className="text-gray-300 hover:text-cyan-400 transition-colors">Team</a>
              <a href="#faq" className="text-gray-300 hover:text-cyan-400 transition-colors">FAQ</a>
              <Link 
                to="/app"
                className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full border border-cyan-400/20 hover:bg-cyan-500/20 transition-all"
              >
                Visit Tool
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full border border-cyan-400/20 mb-8"
            >
              <span className="text-sm">✨ Introducing AI-Powered Finance Management</span>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Smart Finance Tracking
              <br />
              for Modern Life
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Lightning-fast, accurate, and reliable expense tracking system offering comprehensive financial management for individuals and businesses.
            </p>

            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25"
            >
              Get Started ✨
            </Link>
          </motion.div>
        </div>
      </div>

{/* Features Section */}
<section id="features" className="py-32">
  <div className="container mx-auto px-4 relative">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold mb-4">Key Features</h2>
      <p className="text-gray-400">Explore the core features of our application</p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8">
      {[{
        title: "Task Management",
        description: "Easily manage and organize your tasks efficiently."
      }, {
        title: "Data Storage",
        description: "Save and retrieve your tasks and projects securely."
      }, {
        title: "Real-time Updates",
        description: "Get instant updates on your task progress."
      }, {
        title: "User-Friendly Interface",
        description: "A clean and intuitive interface for smooth navigation."
      }].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/80 transition-all"
        >
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Team Section */}
      <motion.section 
        id="team"
        className="py-32 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-400">The brilliant minds behind Finflow</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:bg-gray-800/80 transition-all"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-cyan-400">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                  <div className="mt-4">
                    <a
                      href={member.github}
                      className="text-cyan-400 hover:text-cyan-500 transition-colors"
                    >
                      View GitHub Profile
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-900 py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find answers to common questions below</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50"
              >
                <h3 className="text-xl font-semibold text-cyan-400">{faq.question}</h3>
                <p className="mt-2 text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
