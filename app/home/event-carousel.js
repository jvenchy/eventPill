"use client"

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { EventCard } from "./event-card";

export function EventCarousel({ events, onEventClick, onRsvpUpdate }) {
  const [rsvpStatus, setRsvpStatus] = useState(Array(events.length).fill(false));
  const buttonRefs = useRef([]);

  const handleRsvpClick = (index) => {
    const newRsvpStatus = [...rsvpStatus];
    newRsvpStatus[index] = !newRsvpStatus[index];
    setRsvpStatus(newRsvpStatus);

    // Update the actual event data
    const updatedEvent = { ...events[index], isRsvped: !events[index].isRsvped };
    onRsvpUpdate(index, updatedEvent);

    if (newRsvpStatus[index]) {
      const button = buttonRefs.current[index];
      if (button) {
        const rect = button.getBoundingClientRect();
        const x = (rect.left + rect.right) / 2 / window.innerWidth; // Normalize x-coordinate
        const y = rect.top / window.innerHeight; // Normalize y-coordinate

        confetti({
          particleCount: 150,
          spread: 90,
          startVelocity: 60,
          gravity: 1,
          scalar: 0.8, // Smaller confetti size
          origin: { x, y },
        });
      }
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-6 p-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1 md:-ml-2 group">
          {events.map((event, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:pl-2 md:basis-1/3 lg:basis-1/3"
            >
              <div className="scale-95 transition-all duration-300 group-hover:[&:not(:hover)]:translate-y-1 hover:scale-100 cursor-pointer">
                <div>
                  <EventCard
                    {...event}
                    onEventClick={() => onEventClick(event)}
                  />
                  <button
                    ref={(el) => (buttonRefs.current[index] = el)} // Store button reference
                    onClick={() => handleRsvpClick(index)}
                    className={`mt-8 rounded-full px-10 py-2 text-center text-white shadow-lg transition-all ${
                      rsvpStatus[index] ? 'bg-sky-950' : 'bg-blue-400 hover:bg-blue-500'
                    }`}
                    style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {rsvpStatus[index] ? '✨ going!' : 'rsvp me'}
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}