import React from "react";
import { Link } from "react-router-dom";
import {
  Workflow,
  Zap,
  Mail,
  Table2,
  Clock,
  Database,
  Github,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/custom/Header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-violet-200 selection:text-violet-900 overflow-hidden">
      <Header />
      <Hero />
      <Architecture />
      <Features />
      <Footer />
    </main>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Professional Gradient Background Mesh */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/60 via-white to-white" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-70" />
      
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Next-Gen Automation
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-neutral-900 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          Visual Workflow <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
            Automation Engine
          </span>
        </h1>

        <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-neutral-600 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both">
          Build, connect, and run automated workflows with a persistent DAG
          scheduler. Designed for developers, built with React, .NET Core, and MySQL.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <Link to="/flows" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-full px-8 h-12 text-base">
              Launch Builder
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <a
            href="https://github.com/Ganesh-parella/Flow-Forge"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-neutral-300 hover:bg-neutral-50 rounded-full px-8 h-12 text-base transition-all duration-200 hover:-translate-y-0.5">
              <Github className="h-5 w-5" />
              View Source
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Architecture ---------------- */

function Architecture() {
  const cards = [
    {
      icon: <Workflow className="h-6 w-6 text-violet-600" />,
      title: "DAG Execution Engine",
      desc: "Topological scheduling with fan-in dependency handling and failure tracking.",
    },
    {
      icon: <Database className="h-6 w-6 text-blue-600" />,
      title: "Persistent State",
      desc: "FlowInstance and NodeExecution tables ensure crash recovery and execution continuity.",
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Async Execution",
      desc: "Non-blocking node execution designed for highly scalable serverless orchestration.",
    },
  ];

  return (
    <section className="bg-neutral-50/50 border-y border-neutral-100 py-24 relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            System Architecture
          </h2>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Built from the ground up to handle complex logic, state persistence, and parallel processing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, idx) => (
            <Card 
              key={card.title} 
              className="border-neutral-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300 hover:-translate-y-1 bg-white"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-600 leading-relaxed">
                {card.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */

function Features() {
  const features = [
    {
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      title: "Webhook Triggers",
      desc: "Start workflows instantly from custom HTTP POST endpoints.",
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-500" />,
      title: "Gmail Integration",
      desc: "Send customized emails securely using Google OAuth tokens.",
    },
    {
      icon: <Table2 className="h-5 w-5 text-emerald-600" />,
      title: "Google Sheets",
      desc: "Add structured rows programmatically with dynamic payload data.",
    },
    {
      icon: <Clock className="h-5 w-5 text-rose-500" />,
      title: "Delay Nodes",
      desc: "Control time-based execution and pause flows precisely.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          Core Capabilities
        </h2>
        <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
          Everything you need to automate your repetitive tasks without writing infrastructure code.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => (
          <Card
            key={feature.title}
            className="group border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-violet-200 hover:-translate-y-1 bg-white"
          >
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600 leading-relaxed">
              {feature.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50/50 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="FlowForge" className="w-5 h-5 grayscale opacity-70" />
          <span className="font-semibold text-neutral-700 tracking-tight">FlowForge</span>
        </div>
        
        <p className="text-sm text-neutral-500">
          Built by Ganesh · {new Date().getFullYear()}
        </p>

        <a
          href="https://github.com/Ganesh-parella/Flow-Forge"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </footer>
  );
}