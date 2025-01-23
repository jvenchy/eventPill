"use client";

import { Card, CardContent } from "./card";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

// Array of emojis to randomly choose from
const emojis = ["🎉", "🏀", "📚", "🎶", "🍔", "💻", "🚀", "🌟", "⚽️", "🎬"];

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function getLuminance(color) {
  let r, g, b;

  if (color.startsWith("#")) {
    const bigint = parseInt(color.slice(1), 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return 1;
  }

  [r, g, b] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateGradientLuminance(gradient) {
  const match = gradient.match(/from-([\w-]+) to-([\w-]+)/);
  if (!match) return 1;

  const [fromColor, toColor] = match.slice(1);
  const tailwindColors = {
    "emerald-300": "#6ee7b7",
    "purple-300": "#d8b4fe",
    "red-400": "#f87171",
    "pink-300": "#f9a8d4",
    "sky-400": "#38bdf8",
    "blue-500": "#3b82f6",
    "purple-950": "#2e1065",
    "green-950": "#052e16",
    "orange-300": "#fbbf24",
  };

  const fromHex = tailwindColors[fromColor] || "#ffffff";
  const toHex = tailwindColors[toColor] || "#ffffff";

  const avgLuminance = (getLuminance(fromHex) + getLuminance(toHex)) / 2;
  return avgLuminance;
}

function getTextColor(background) {
  return calculateGradientLuminance(background) < 0.5 ? "text-white" : "text-black";
}

export function EventCard({ title, date, location, description, image, background, isRsvped, synopsis, eventTypes, categories, eventLink, socialLink, onEventClick}) {
  const textColor = getTextColor(background);
  const [emoji, setEmoji] = useState(emojis[0]); // Start with a consistent emoji

  useEffect(() => {
    // Only set random emoji after component mounts on client
    setEmoji(getRandomEmoji());
  }, []);

  return (
    <Card
      className={`w-[300px] h-[480px] rounded-[32px] overflow-hidden ${background} transition-all`}
      style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
      onClick={onEventClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className={`flex-grow space-y-4 p-4 overflow-hidden ${textColor}`}>
          <div className="space-y-1 min-h-[56px] flex flex-col justify-center">
            <h3 className="text-xl font-bold tracking-tight text-center mt-2">{title}</h3>
          </div>

          <p className="text-center">{date}</p>

          <div className="flex items-center justify-center gap-1 text-xs">
            <MapPin className="h-4 w-4" />
            {location}
          </div>

          <p className="text-xs line-clamp-3 mb-2 text-center">{description}</p>

          <div className="flex items-center justify-center mt-auto mb-auto">
            {image ? (
              <div className="relative h-[240px] w-[240px] bg-gray-100 rounded-[12px]">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover rounded-[12px] mb-4"
                />
              </div>
            ) : (
              <div className="h-[240px] w-[240px] flex items-center justify-center">
                <span className="text-[10rem]">{emoji}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}