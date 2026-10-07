"use client";

import Link from "next/link";
import { Ticket, Calendar, MapPin, Loader2, QrCode } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useConvexQuery(api.events.getMyTickets);

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View your event registrations and entry passes
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/explore">Browse Events</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id} className="overflow-hidden border border-purple-500/20">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={ticket.status === "confirmed" ? "default" : "secondary"}>
                      {ticket.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Registered: {format(ticket.registeredAt, "PPP")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{ticket.event?.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      {ticket.event?.startDate && format(ticket.event.startDate, "PPP p")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      {ticket.event?.city}, {ticket.event?.state}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/40 p-4 rounded-lg border border-purple-500/30 text-center flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-purple-400 mb-2" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {ticket.qrCode}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardContent className="space-y-4 pt-6">
            <Ticket className="w-12 h-12 mx-auto text-purple-400 opacity-60" />
            <h2 className="text-2xl font-semibold">No tickets yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You haven't registered for any events. Discover amazing events and claim your tickets!
            </p>
            <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Link href="/explore">Explore Events</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
