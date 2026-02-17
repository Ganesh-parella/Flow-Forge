import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Button = ({ children, onClick, disabled, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50
      disabled:pointer-events-none ring-offset-background bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 py-2 px-4 ${className}`}
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${className}`}
    ref={ref}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${className}`}
    ref={ref}
    {...props}
  />
));

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border bg-white text-slate-900 shadow ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export default function TriggerDemoPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [customerName, setCustomerName] = useState("Jane Doe");
  const [customerEmail, setCustomerEmail] = useState("jane.doe@example.com");
  const [message, setMessage] = useState("This is a test message from the demo form.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!webhookUrl.trim()) {
      toast.error("Please enter a valid webhook URL.");
      return;
    }

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Webhook triggered successfully!");
      } else {
        let errorMessage = "Failed to trigger webhook.";
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (_) {
          // JSON parsing failed - keep generic message
        }
        toast.error(`Error ${response.status} - ${errorMessage}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Network error occurred. Check console and backend status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-4">
        <Link to="/flows" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          &larr; Back to Flows
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Demo Form Trigger</CardTitle>
          <p className="text-sm text-slate-500 pt-1">
            Use this form to send data to your workflow&apos;s webhook trigger. Save your flow in the builder to get its unique webhook URL.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="webhookUrl" className="text-sm font-medium">
                Webhook URL
              </label>
              <Input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Paste your webhook URL from the trigger node settings"
                required
                autoComplete="off"
                spellCheck={false}
                aria-describedby="webhook-url-desc"
              />
              <p id="webhook-url-desc" className="text-xs text-slate-400">
                e.g., https://yourapi.com/api/webhooks/your-flow-id
              </p>
            </div>

            <hr />

            <h3 className="text-lg font-semibold text-slate-800">Form Data Payload</h3>

            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Customer Name
              </label>
              <Input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                autoComplete="name"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="customerEmail" className="text-sm font-medium">
                Customer Email
              </label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                autoComplete="email"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                spellCheck={true}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full" aria-busy={isSubmitting}>
              {isSubmitting ? "Triggering..." : "Trigger Workflow"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
