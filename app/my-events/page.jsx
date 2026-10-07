"use client";

import Link from "next/link";
import { Plus, Calendar, MapPin, Building, Loader2 } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/event-card";

export default function MyEventsPage() {
  const { data: myEvents, isLoading } = useConvexQuery(api.events.getMyEvents);

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Events</h1>
          <p className="text-muted-foreground">
            Manage and monitor the events you have organized
          </p>
        </div>
        <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Link href="/create-event">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : myEvents && myEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardContent className="space-y-4 pt-6">
            <Building className="w-12 h-12 mx-auto text-purple-400 opacity-60" />
            <h2 className="text-2xl font-semibold">No events created yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You haven't published any events. Host your first event today!
            </p>
            <Button asChild className="gap-2">
              <Link href="/create-event">
                <Plus className="w-4 h-4" /> Create First Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
