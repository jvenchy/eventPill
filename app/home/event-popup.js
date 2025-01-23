"use client";

import { X, RotateCw, Calendar, MapPin, Link2, Instagram } from "lucide-react";
import { Card, CardContent } from "./card";
import { useState, useEffect } from "react";
import { EventCard } from "./event-card";
import confetti from "canvas-confetti";

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

export function EventPopup({ event, onClose, buttonRef, onRsvpUpdate }) {
  const {
    title,
    date,
    location,
    description,
    image,
    eventTypes = [],
    categories = [],
    eventLink = "#",
    socialLink = "#",
    synopsis,
    background,
    isRsvped,
  } = event;

  const textColor = getTextColor(background);
  const [emoji, setEmoji] = useState(emojis[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [localIsRsvped, setLocalIsRsvped] = useState(isRsvped);

  useEffect(() => {
    setEmoji(getRandomEmoji());
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRsvp = () => {
    const newRsvpStatus = !localIsRsvped;
    setLocalIsRsvped(newRsvpStatus);
    
    // Update the parent component
    const updatedEvent = { ...event, isRsvped: newRsvpStatus };
    onRsvpUpdate(updatedEvent);

    if (newRsvpStatus && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = rect.top / window.innerHeight;

      confetti({
        particleCount: 150,
        spread: 90,
        startVelocity: 60,
        gravity: 1,
        scalar: 0.8,
        origin: { x, y },
      });
    }
  };

  const scaleX = 400 / 300;
  const scaleY = 640 / 480;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-50 mx-4">
        <div className="absolute right-[-6rem] top-4 flex items-center gap-2 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-full p-2 hover:bg-black/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
            <span>close</span>
          </button>
        </div>

        <div className="absolute right-[-7rem] top-16 flex items-center gap-2 z-10">
          <button
            onClick={handleFlip}
            className="flex items-center gap-1 rounded-full p-2 hover:bg-black/10"
            aria-label="Flip Card"
          >
            <RotateCw className="h-5 w-5" />
            <span>flip card</span>
          </button>
        </div>

        <div className="absolute right-[-8rem] top-28 flex items-center gap-2 z-10">
          <button
            ref={buttonRef}
            onClick={handleRsvp}
            className={`rounded-full px-6 py-2 text-center text-white shadow-lg transition-all ${
              localIsRsvped ? 'bg-sky-950' : 'bg-blue-400 hover:bg-blue-500'
            }`}
            style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {localIsRsvped ? '✨ going!' : 'rsvp me'}
          </button>
        </div>

        {/* Rest of your component remains the same */}
        {isFlipped ? (
          <div className="w-[400px] h-[640px] relative transition-all duration-300 hover:scale-105">
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                transform: `scale(${scaleX}, ${scaleY})`,
                transformOrigin: "top left",
              }}
            >
              <EventCard
                title={title}
                date={date}
                location={location}
                description={description}
                image={image}
                background={background}
                eventTypes={eventTypes}
                categories={categories}
                eventLink={eventLink}
                socialLink={socialLink}
                onEventClick={() => {}}
              />
            </div>
          </div>
        ) : (
          <Card className={`w-[400px] h-[640px] rounded-[46px] overflow-hidden ${background} transition-all duration-300 hover:scale-105`}>
            <CardContent className={`p-6 relative ${textColor}`}>
              <div className="flex items-start gap-4 mb-6 mt-8">
                {image ? (
                  <img src={image} alt="" className="h-16 w-16 mr-2 rounded-lg object-cover" />
                ) : (
                  <div className="h-16 w-16 mr-2 flex items-center justify-center">
                    <span className="text-[3rem]">{emoji}</span>
                  </div>
                )}
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {eventTypes.map((type) => (
                  <span key={type} className="px-3 py-1 rounded-full bg-black text-white text-sm">
                    {type}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <span key={category} className="px-3 py-1 rounded-full bg-white text-black text-sm">
                    {category}
                  </span>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <a href={eventLink} className="flex items-center gap-2 text-sm hover:underline">
                  <Link2 className="h-4 w-4" />
                  <span>link to event</span>
                </a>
                <a href={socialLink} className="flex items-center gap-2 text-sm hover:underline">
                  <Instagram className="h-4 w-4" />
                  <span>view post</span>
                </a>
              </div>

              <p className="text-sm leading-relaxed mb-6">{synopsis}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}