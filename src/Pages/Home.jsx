import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for routing
import {
  Zap,
  Layers,
  Activity,
  Workflow,
  Clock,
  CheckCircle2,
  Quote,
  Twitter,
  Github,
  Linkedin,
  Lock, // For security feature
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/ui/custom/Header";

/* ------------------------------- animations ------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* ------------------------------- component ------------------------------ */

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Glow / grain / grid overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_center,#8b5cf6_0,transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.08]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.045)_1px,transparent_0)] bg-[length:24px_24px]" />

      <Header/>
      <HeroSection />
      <FlowMockupSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FooterSection />
    </main>
  );
}


/* --------------------------------- Hero --------------------------------- */
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white backdrop-blur border-white/20"
          >
            Enterprise-Grade Automation Platform
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold leading-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
        >
          Build Powerful Automations Visually
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl"
        >
          Seamlessly integrate your applications with our advanced visual flow builder. Create sophisticated workflows without coding expertise.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/flows">
            <Button size="lg" className="h-12 rounded-full px-8 text-base font-semibold shadow-lg">
              Start Your Free Trial
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/20 bg-transparent px-8 text-base text-white backdrop-blur hover:bg-white/10"
          >
            Schedule a Demo
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------------------- Flow Mockup Section ---------------------------- */
function FlowMockupSection() {
  return (
    <section className="relative -mt-10 mb-24 px-4 sm:px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur"
      >
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-white/60">
          Interactive Flow Builder
        </p>
        <div className="relative h-[460px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/0 p-6">
          <FlowMock />
        </div>
      </motion.div>
    </section>
  );
}

function FlowMock() {
  const nodes = [
    { id: 1, x: 60, y: 60, label: "Trigger: New Form Submission", color: "from-pink-500 to-rose-500" },
    { id: 2, x: 340, y: 60, label: "Send Notification Email", color: "from-blue-500 to-indigo-500" },
    { id: 3, x: 620, y: 60, label: "Update Google Sheet", color: "from-emerald-500 to-green-500" },
    { id: 4, x: 340, y: 230, label: "Delay: 5 Minutes", color: "from-slate-500 to-gray-500" },
    { id: 5, x: 620, y: 230, label: "Send Follow-up Notification", color: "from-blue-500 to-indigo-500" },
  ];

  const lines = [
    { from: nodes[0], to: nodes[1] },
    { from: nodes[1], to: nodes[2] },
    { from: nodes[0], to: nodes[3] },
    { from: nodes[3], to: nodes[4] },
  ];

  return (
    <div className="relative h-full w-full">
      <svg className="absolute left-0 top-0 h-full w-full" aria-hidden="true">
        {lines.map((l, i) => {
          const x1 = l.from.x + 160;
          const y1 = l.from.y + 36;
          const x2 = l.to.x;
          const y2 = l.to.y + 36;
          const midX = (x1 + x2) / 2;
          return (
            <motion.path
              key={i}
              d={`M ${x1},${y1} C ${midX},${y1} ${midX},${y2} ${x2},${y2}`}
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: "easeInOut" }}
            />
          );
        })}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={n.id}
          className={`absolute w-40 rounded-xl bg-gradient-to-br p-4 shadow-xl`}
          style={{ left: n.x, top: n.y }}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
        >
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${n.color} opacity-80`} />
          <div className="relative z-10">
            <p className="text-sm font-semibold text-white drop-shadow">{n.label}</p>
            <div className="mt-2 h-2 w-16 rounded-full bg-white/40" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------- Features ------------------------------- */
function FeaturesSection() {
  const features = [
    {
      icon: <Workflow className="h-5 w-5" />,
      title: "Intuitive Visual Builder",
      desc: "Effortlessly drag, drop, and connect nodes using our React Flow-powered interface.",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Secure Integrations",
      desc: "Safely connect Gmail and Google Sheets with enterprise-level OAuth2 security.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Webhook Triggers",
      desc: "Initiate workflows from any webhook-compatible service, including Google Forms.",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Real-Time Monitoring",
      desc: "Access live logs and execution insights for rapid debugging and optimization.",
    },
  ];

  return (
    <section className="mx-auto mb-24 max-w-6xl px-6">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature, i) => (
          <motion.div key={feature.title} variants={fadeUp} custom={i}>
            <Card className="h-full border-white/10 bg-white/[0.03] text-white backdrop-blur transition hover:bg-white/[0.06]">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-white/60">{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ----------------------------- How It Works ----------------------------- */
function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: "Select a Trigger",
      desc: "Choose a webhook trigger and generate a unique endpoint for your workflow.",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      step: 2,
      title: "Design Your Flow",
      desc: "Drag and connect action nodes such as 'Send Email' or 'Update Sheet'.",
      icon: <Workflow className="h-5 w-5" />,
    },
    {
      step: 3,
      title: "Deploy and Monitor",
      desc: "Execute flows manually or automatically, with real-time performance tracking.",
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  return (
    <section className="mx-auto mb-24 max-w-5xl px-6">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <motion.h2 variants={fadeUp} className="mb-10 text-center text-3xl font-bold sm:text-4xl">
          How It Works
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div key={step.step} variants={fadeUp} custom={i}>
              <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur">
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    {step.icon}
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-white/50">0{step.step}</span> {step.title}
                  </CardTitle>
                  <CardDescription className="text-white/60">{step.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------ Testimonials ----------------------------- */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Aditi Sharma",
      role: "Product Manager, FinSync",
      quote: "We streamlined onboarding processes with automated emails, alerts, and data updates in minutes. Transformative for our operations.",
    },
    {
      name: "Rohan Verma",
      role: "CTO, NextOps",
      quote: "The intuitive builder empowered our team to create and deploy complex automations from day one.",
    },
    {
      name: "Priya Kapoor",
      role: "Founder, MarketerX",
      quote: "This platform democratizes automation, enabling non-technical teams to optimize marketing workflows efficiently.",
    },
  ];

  return (
    <section className="mx-auto mb-24 max-w-6xl px-6">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center text-3xl font-bold sm:text-4xl"
      >
        Trusted by Leading Organizations
      </motion.h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {testimonials.map((t, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}>
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur">
              <CardContent className="pt-6">
                <Quote className="mb-3 h-6 w-6 text-white/30" />
                <p className="text-white/80">{t.quote}</p>
                <div className="mt-6">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/50">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------- Pricing -------------------------------- */
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      features: ["Up to 3 active flows", "100 tasks/month", "Basic templates", "Community support"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      features: ["Unlimited flows", "10,000 tasks/month", "Premium templates", "Priority email support"],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited resources", "Custom deployment options", "SSO/SAML integration", "Dedicated account manager"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section className="mx-auto mb-24 max-w-6xl px-6">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-center text-3xl font-bold sm:text-4xl"
      >
        Flexible Pricing for Every Scale
      </motion.h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
        Begin with our free tier and upgrade as your needs grow. Transparent pricing with no hidden fees.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card
              className={`relative h-full border-white/10 bg-white/[0.03] backdrop-blur transition hover:bg-white/[0.06] ${
                plan.highlight ? "ring-2 ring-violet-500/70" : ""
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600">
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="text-white/60">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="ml-1 text-white/50">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm text-white/70">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  className={`w-full ${
                    plan.highlight
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- Footer -------------------------------- */
function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] py-12 text-white/70 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-white">AutoTask Builder</h4>
          <p className="text-sm">
            Empowering businesses with visual automation tools powered by cutting-edge technology.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-white">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/integrations" className="hover:text-white">Integrations</Link></li>
            <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-white">Connect</h4>
          <ul className="flex items-center gap-4 text-white/60">
            <li><Twitter className="h-5 w-5 hover:text-white" /></li>
            <li><Github className="h-5 w-5 hover:text-white" /></li>
            <li><Linkedin className="h-5 w-5 hover:text-white" /></li>
          </ul>
        </div>
      </div>

      <Separator className="mx-auto my-8 max-w-6xl bg-white/10" />
      <p className="text-center text-xs text-white/40">
        © {new Date().getFullYear()} AutoTask Builder. All rights reserved.
      </p>
    </footer>
  );
}
