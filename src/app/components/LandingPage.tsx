import { motion } from "motion/react";
import { 
  Activity, 
  Heart, 
  Shield, 
  Stethoscope, 
  Brain, 
  TrendingUp,
  Check,
  Sparkles,
  CheckCircle,
  Users
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#26A69A] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#26A69A] bg-clip-text text-transparent">
                HealthBridge 3.0
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button onClick={onLogin} variant="outline" className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white">
                Login
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-[#1E88E5] mb-6 border border-blue-200">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Health Prediction</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Predict Your Health,<br />
                <span className="bg-gradient-to-r from-[#1E88E5] to-[#26A69A] bg-clip-text text-transparent">
                  Protect Your Future
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-xl leading-relaxed">
                Advanced AI analytics to monitor your health metrics, predict potential risks, 
                and provide personalized medical guidance.
              </p>
              <p className="text-sm text-gray-500 mb-8 italic">
                ⓘ Not a substitute for professional medical diagnosis
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:opacity-90 text-white px-8 py-7 text-lg rounded-xl shadow-xl shadow-blue-500/30 relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
                <Button 
                  onClick={onLogin}
                  variant="outline"
                  className="border-2 border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white px-8 py-7 text-lg rounded-xl transition-all duration-300"
                >
                  Login
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#26A69A]" />
                  <span className="text-sm text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#26A69A]" />
                  <span className="text-sm text-gray-600">98% Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#26A69A]" />
                  <span className="text-sm text-red-600 font-bold">24/7 Available Service</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Animated circles */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1E88E5]/20 to-[#26A69A]/20 backdrop-blur-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full bg-gradient-to-br from-[#26A69A]/20 to-[#1E88E5]/20 backdrop-blur-xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Floating health icons */}
                <motion.div
                  className="absolute top-1/4 left-0 p-4 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Activity className="w-8 h-8 text-[#1E88E5]" />
                </motion.div>
                <motion.div
                  className="absolute top-1/4 right-0 p-4 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <Heart className="w-8 h-8 text-red-500" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 left-8 p-4 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Shield className="w-8 h-8 text-[#26A69A]" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-8 p-4 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <Brain className="w-8 h-8 text-purple-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Advanced Health Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology to monitor, analyze, and predict your health outcomes
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:border-[#1E88E5]/50 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you need more
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Freemium Card */}
            <motion.div
              className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-lg border-2 border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Freemium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/ month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started with health tracking</p>
              </div>
              <ul className="space-y-4 mb-8">
                {freemiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#26A69A] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={onGetStarted} variant="outline" className="w-full border-2 border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white py-6 rounded-xl">
                Get Started Free
              </Button>
            </motion.div>

            {/* Premium Card */}
            <motion.div
              className="relative p-8 rounded-3xl bg-gradient-to-br from-[#1E88E5] to-[#26A69A] text-white shadow-2xl shadow-blue-500/30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-lg text-sm">
                Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-white/80">/ month</span>
                </div>
                <p className="text-white/90">Complete health management with expert support</p>
              </div>
              <ul className="space-y-4 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white/95">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={onGetStarted} className="w-full bg-white text-[#1E88E5] hover:bg-gray-100 py-6 rounded-xl">
                Upgrade to Premium
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-gray-600">
              Advanced technology meets compassionate care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="relative rounded-2xl overflow-hidden h-80 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1758691462848-ba1e929da259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzY5MDQzNzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Medical Technology"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl mb-2">Cutting-Edge Technology</h3>
                  <p className="text-sm text-white/90">AI-powered health predictions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative rounded-2xl overflow-hidden h-80 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1758691462860-b1b9532c7394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB0ZWxlbWVkaWNpbmV8ZW58MXx8fHwxNzY5MTE1NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Telemedicine"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl mb-2">Expert Consultations</h3>
                  <p className="text-sm text-white/90">24/7 medical support</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative rounded-2xl overflow-hidden h-80 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1650822942135-1ef6f1820214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtb25pdG9yaW5nfGVufDF8fHx8MTc2OTEzNzk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Health Monitoring"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl mb-2">Real-Time Monitoring</h3>
                  <p className="text-sm text-white/90">Track your health 24/7</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#26A69A] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">HealthBridge 3.0</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering healthier lives through AI-powered predictions and personalized care.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2026 HealthBridge 3.0. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Brain className="w-7 h-7 text-white" />,
    title: "AI Health Prediction",
    description: "6-month forward-looking health analytics powered by advanced machine learning",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: <Activity className="w-7 h-7 text-white" />,
    title: "Real-time Monitoring",
    description: "Track vital signs, symptoms, and health metrics in real-time with instant alerts",
    gradient: "from-[#1E88E5] to-[#1565C0]"
  },
  {
    icon: <Stethoscope className="w-7 h-7 text-white" />,
    title: "Expert Consultations",
    description: "Connect with medical interns and doctors through chat and video calls",
    gradient: "from-[#26A69A] to-[#00897B]"
  },
  {
    icon: <Shield className="w-7 h-7 text-white" />,
    title: "Risk Assessment",
    description: "Comprehensive risk analysis for early disease detection and prevention",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    title: "Health Progress",
    description: "Gamified health improvement tracking with rewards and milestones",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: <Heart className="w-7 h-7 text-white" />,
    title: "Personalized Care",
    description: "Custom health recommendations based on your unique profile and goals",
    gradient: "from-red-500 to-red-600"
  }
];

const freemiumFeatures = [
  "Basic health tracking (Sugar, BP, BMI)",
  "AI health predictions (limited)",
  "3D body map visualization",
  "Patient-Intern chat support",
  "Basic disease guidance",
  "Health progress tracking"
];

const premiumFeatures = [
  "Everything in Freemium",
  "Advanced AI predictions (6 months)",
  "Priority doctor video consultations",
  "24/7 SOS emergency support",
  "Unlimited report uploads & analysis",
  "Personalized health game & rewards",
  "Family health monitoring",
  "Export health reports & data"
];