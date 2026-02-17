import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFlowApi } from "../Apis/flowApi";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Link as LinkIcon, LogOut, Clock } from "lucide-react";

const ConnectionsManager = () => {
  const { user, isLoaded } = useUser();
  const { getConnections, disconnectGoogle, getGoogleConnectUrl } = useFlowApi();

  const [connections, setConnections] = useState({ google: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchConnections = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      toast.error("Could not load connection status.");
      console.error("Failed to fetch connections:", error);
    } finally {
      setIsLoading(false);
    }
  }, [ user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchConnections();
    }
  }, [isLoaded]);

  const handleConnectGoogle = async () => {
    if (!isLoaded || !user) {
      toast.error("User session not ready. Please wait and try again.");
      return;
    }
    try {
      const { url } = await getGoogleConnectUrl();
      window.location.href = url; // Redirect to Google OAuth consent page
    } catch (error) {
      toast.error("Failed to get Google connect URL.");
      console.error(error);
    }
  };

  const confirmDisconnect = (service) => {
    setSelectedService(service);
    setShowDisconnectDialog(true);
  };

  const handleDisconnect = async () => {
    if (!selectedService) return;
    try {
      if (selectedService === "Google") {
        await disconnectGoogle();
      }
      toast.success(`${selectedService} account disconnected.`);
      await fetchConnections();
    } catch (error) {
      toast.error(`Failed to disconnect ${selectedService}.`);
      console.error("Disconnect failed:", error);
    } finally {
      setShowDisconnectDialog(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh] space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-label="Loading" />
        <p className="text-gray-500 text-sm select-none">Loading your connections...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 select-none">Manage Your Connections</h1>
        <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">Connect your accounts to unlock integrations for your workflows.</p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Google Card */}
        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Google logo" className="w-6 h-6" />
              Google
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 select-none">
              Connect Gmail and Google Sheets.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            {connections.google ? (
              <Button variant="destructive" className="w-full" onClick={() => confirmDisconnect("Google")}>
                <LogOut className="w-4 h-4 mr-2" /> Disconnect
              </Button>
            ) : (
              <Button variant="default" className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleConnectGoogle}>
                <LinkIcon className="w-4 h-4 mr-2" /> Connect Google
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Slack Card Placeholder */}
        <Card className="border border-gray-200 bg-gray-50 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png" alt="Slack logo" className="w-6 h-6" />
              Slack
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 select-none">
              Team messaging and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <Button variant="secondary" className="w-full bg-gray-300 cursor-not-allowed" disabled>
              <Clock className="w-4 h-4 mr-2" /> Coming Soon
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {selectedService}?</DialogTitle>
            <DialogDescription>
              This will disable all workflows connected to {selectedService}. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectionsManager;
