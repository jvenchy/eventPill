"use client"

import { useState, useRef } from 'react';
import { EventCard } from '../home/event-card'; // Ensure the path is correct
import confetti from 'canvas-confetti';

const events = [
  // Your event data goes here
  { title: 'Event 1', date: '2023-10-01', location: 'Location 1', description: 'Description 1', image: null, background: 'bg-gradient-to-r from-emerald-300 to-purple-300', isRsvped: false },
  { title: 'Event 2', date: '2023-10-02', location: 'Location 2', description: 'Description 2', image: null, background: 'bg-gradient-to-r from-red-400 to-pink-300', isRsvped: false },
  // Add more events as needed
];

export default function Page() {
  const [rsvpStatus, setRsvpStatus] = useState(events.map(event => event.isRsvped));
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

  const onRsvpUpdate = (index, updatedEvent) => {
    // Handle RSVP update logic here, e.g., update state or send to server
    console.log(`Event ${index} RSVP status updated:`, updatedEvent);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative"
         style={{
           background: 'linear-gradient(to bottom, #DCFFD8, #C2FFBB)',
           fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
         }}>
      <div className="grid grid-cols-2 gap-4">
        {events.map((event, index) => (
          <div key={index} className="flex flex-col items-center">
            <EventCard
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              image={event.image}
              background={event.background}
              isRsvped={event.isRsvped}
              onEventClick={() => console.log(`Event ${index} clicked`)}
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
        ))}
      </div>
    </div>
  );
}