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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/custom/Header";

export default function LandingPage() {
  return (
    <main className="pt-20 min-h-screen bg-white text-neutral-900">
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
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
        FlowForge
      </h1>

      <p className="mt-6 mx-auto max-w-2xl text-lg text-neutral-600">
        A visual workflow automation engine powered by a persistent DAG
        scheduler. Built with React, .NET Core, and MySQL.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Link to="/flows">
          <Button size="lg">Launch Builder</Button>
        </Link>

        <a
          href="https://github.com/Ganesh-parella/Flow-Forge"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline" size="lg">
            <Github className="mr-2 h-4 w-4" />
            View Source
          </Button>
        </a>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */

function Features() {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Webhook Triggers",
      desc: "Start workflows from HTTP endpoints.",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Gmail Integration",
      desc: "Send emails securely using OAuth.",
    },
    {
      icon: <Table2 className="h-5 w-5" />,
      title: "Google Sheets",
      desc: "Add structured rows programmatically.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Delay Nodes",
      desc: "Control time-based execution.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Core Capabilities
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-neutral-200 shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <div className="mb-3 text-neutral-700">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
              {feature.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Architecture ---------------- */

function Architecture() {
  return (
    <section className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          System Architecture
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <Workflow className="h-6 w-6 mb-3 text-neutral-700" />
              <CardTitle>DAG Execution Engine</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
              Topological scheduling with fan-in dependency handling and
              failure tracking.
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <Database className="h-6 w-6 mb-3 text-neutral-700" />
              <CardTitle>Persistent State</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
              FlowInstance and NodeExecution tables ensure crash recovery and
              execution continuity.
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <Zap className="h-6 w-6 mb-3 text-neutral-700" />
              <CardTitle>Async Execution</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
              Non-blocking node execution designed for scalable orchestration.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
      Built by Ganesh · FlowForge · {new Date().getFullYear()}
    </footer>
  );
}
