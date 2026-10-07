"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, MapPin, Sparkles, Image as ImageIcon, Ticket, Loader2 } from "lucide-react";
import { State, City } from "country-state-city";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { CATEGORIES } from "@/lib/data";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateEventPage() {
  const router = useRouter();
  const { mutate: createEvent, isLoading: isSubmitting } = useConvexMutation(
    api.events.createEvent
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    tags: "tech, coding",
    startDate: "",
    endDate: "",
    timezone: "Asia/Kolkata",
    locationType: "physical",
    venue: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    capacity: 50,
    ticketType: "free",
    ticketPrice: 0,
    coverImage: "",
    themeColor: "#4c1d95",
  });

  const indianStates = State.getStatesOfCountry("IN");
  const selectedStateIso = indianStates.find((s) => s.name === formData.state)?.isoCode;
  const cities = selectedStateIso ? City.getCitiesOfState("IN", selectedStateIso) : [];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in event title and description.");
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const startTimestamp = formData.startDate
        ? new Date(formData.startDate).getTime()
        : Date.now() + 86400000;
      const endTimestamp = formData.endDate
        ? new Date(formData.endDate).getTime()
        : startTimestamp + 7200000;

      await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray.length > 0 ? tagsArray : [formData.category],
        startDate: startTimestamp,
        endDate: endTimestamp,
        timezone: formData.timezone,
        locationType: formData.locationType,
        venue: formData.venue || undefined,
        address: formData.address || undefined,
        city: formData.city || "Bangalore",
        state: formData.state || "Karnataka",
        country: formData.country,
        capacity: Number(formData.capacity) || 50,
        ticketType: formData.ticketType,
        ticketPrice: formData.ticketType === "paid" ? Number(formData.ticketPrice) || 0 : undefined,
        coverImage: formData.coverImage || undefined,
        themeColor: formData.themeColor,
      });

      toast.success("Event created successfully!");
      router.push("/explore");
    } catch (err) {
      toast.error(err.message || "Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 pt-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">
          Fill out the details below to host your event on Eventra
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Event Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title" className="mb-2 block font-medium">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g. React 19 Workshop & Meetup"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="h-11 px-3.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block font-medium">Event Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of what attendees can expect..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="p-3.5"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block font-medium">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleChange("category", val)}
                >
                  <SelectTrigger className="w-full h-11 px-3.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags" className="mb-2 block font-medium">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="tech, coding"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  className="h-11 px-3.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate" className="mb-2 block font-medium">Start Date & Time *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="h-11 px-3.5 text-sm [color-scheme:dark] bg-background/50 cursor-pointer"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-2 block font-medium">End Date & Time *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="h-11 px-3.5 text-sm [color-scheme:dark] bg-background/50 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-500" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block font-medium">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(val) => {
                    handleChange("state", val);
                    handleChange("city", "");
                  }}
                >
                  <SelectTrigger className="w-full h-11 px-3.5">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((s) => (
                      <SelectItem key={s.isoCode} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block font-medium">City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(val) => handleChange("city", val)}
                  disabled={!formData.state}
                >
                  <SelectTrigger className="w-full h-11 px-3.5">
                    <SelectValue placeholder={formData.state ? "Select City" : "Select State First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="mb-2 block font-medium">Venue Address / Online Link</Label>
              <Input
                id="address"
                placeholder="e.g. WeWork Embassy Golf Links, Bangalore"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="h-11 px-3.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Capacity & Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-500" />
              Tickets & Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="capacity" className="mb-2 block font-medium">Capacity (Max attendees)</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="h-11 px-3.5"
              />
            </div>
            <div>
              <Label className="mb-2 block font-medium">Ticket Type</Label>
              <Select
                value={formData.ticketType}
                onValueChange={(val) => handleChange("ticketType", val)}
              >
                <SelectTrigger className="w-full h-11 px-3.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.ticketType === "paid" && (
              <div>
                <Label htmlFor="ticketPrice" className="mb-2 block font-medium">Ticket Price (₹)</Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  min={0}
                  value={formData.ticketPrice}
                  onChange={(e) => handleChange("ticketPrice", e.target.value)}
                  className="h-11 px-3.5"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media & Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              Cover Image & Styling
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="coverImage" className="mb-2 block font-medium">Cover Image URL</Label>
              <Input
                id="coverImage"
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={(e) => handleChange("coverImage", e.target.value)}
                className="h-11 px-3.5"
              />
            </div>
            <div>
              <Label htmlFor="themeColor" className="mb-2 block font-medium">Theme Color</Label>
              <Input
                id="themeColor"
                type="color"
                className="h-11 cursor-pointer p-1"
                value={formData.themeColor}
                onChange={(e) => handleChange("themeColor", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()} className="h-11 px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white min-w-36 h-11 px-6 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Publish Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
