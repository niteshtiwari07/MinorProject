"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingTable } from "@clerk/nextjs";

class PricingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Gracefully catch Clerk billing disabled notice
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FallbackPricingCard({ onClose }) {
  return (
    <div className="bg-linear-to-b from-purple-900/30 to-background border border-purple-500/30 rounded-xl p-6 text-center shadow-lg my-2">
      <Badge className="bg-linear-to-r from-pink-500 to-purple-500 text-white mb-2">
        PRO PLAN
      </Badge>
      <h3 className="text-3xl font-bold text-white mb-2">
        $9.99 <span className="text-sm font-normal text-muted-foreground">/ month</span>
      </h3>
      <ul className="text-sm text-left max-w-sm mx-auto space-y-2.5 my-6 text-gray-300">
        <li className="flex items-center gap-2">✨ <strong>Unlimited Event Creation</strong></li>
        <li className="flex items-center gap-2">🎨 <strong>Custom Theme Colors & Covers</strong></li>
        <li className="flex items-center gap-2">🎫 <strong>Paid & Free Ticketing Options</strong></li>
        <li className="flex items-center gap-2">⚡ <strong>Priority Support</strong></li>
      </ul>
      <Button
        className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg"
        onClick={onClose}
      >
        Upgrade to Pro
      </Button>
    </div>
  );
}

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription>
            {trigger === "header" && "Create Unlimited Events with Pro! "}
            {trigger === "limit" && "You've reached your free event limit. "}
            {trigger === "color" && "Custom theme colors are a Pro feature. "}
            Unlock unlimited events and premium features!
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Cards */}
        <PricingErrorBoundary fallback={<FallbackPricingCard onClose={onClose} />}>
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
              },
            }}
          />
        </PricingErrorBoundary>

        {/* Footer */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}