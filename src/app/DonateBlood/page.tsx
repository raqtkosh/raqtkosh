"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DonateBloodForm() {
  const [donationType, setDonationType] = useState("home");

  return (
    <Card className="max-w-2xl mx-auto mt-10 border rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-red-600">
          Donate Blood
        </h2>

        {/* Donation Type */}
        <div>
          <Label className="text-base font-medium mb-2 block">Donation Type</Label>
          <RadioGroup
            defaultValue="home"
            className="flex gap-6"
            onValueChange={setDonationType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home">Donate at Home</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="center" id="center" />
              <Label htmlFor="center">Donate at Center</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Conditional Fields Based on Selection */}
        {donationType === "home" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter your address" />
            </div>
            <div>
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Input id="preferredTime" type="time" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Select Donation Center</Label>
              <Input id="location" placeholder="Search nearby centers" />
              {/* Optional: Replace with searchable dropdown in future */}
            </div>
            <div>
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input id="appointmentTime" type="datetime-local" />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Confirm Donation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
