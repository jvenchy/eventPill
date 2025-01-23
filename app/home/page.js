"use client";

import React, { useState, useEffect, useRef } from 'react';
import { EventCarousel } from "./event-carousel";
import { SidebarNav } from "./sidebar";
import { EventPopup } from "./event-popup";


const recommendedEvents = [
  {
    title: "Rotman Commerce Career Seminar",
    date: "Jan 9th, 5pm - 7pm",
    location: "UTSU 4th Floor",
    description: "perfect for anyone looking to network.",
    image: "/eventcards/1.png",
    isPopular: true,
    background: "bg-gradient-to-b from-emerald-300 to-purple-300",
    synopsis: "Join us for the Rotman Commerce Career Seminar, an exciting opportunity to connect, learn, and grow within the Rotman Commerce community! This event is designed to help students and professionals alike explore key topics in commerce, enhance their professional skills, and network with like-minded individuals.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "AC Soccer Tryouts",
    date: "Tuesday, 1pm - 4pm",
    location: "AC Field",
    description: "come out and show out.",
    spotsRemaining: 5,
    background: "bg-gradient-to-b from-red-400 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "CS Student Union Beginner Night",
    date: "Next Friday, 7pm-9pm",
    location: "Bahen 4th Floor",
    description: "50% discount!",
    image: "/eventcards/3.png",
    rsvpsLastDay: 23,
    background: "bg-gradient-to-b from-sky-400 to-blue-500",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  }
];

const popularEvents = [
  {
    title: "NCSC Barbecue and Mixer",
    date: "Jan 18th, 6pm - 9pm",
    location: "UTSU 4th Floor",
    description: "mingle and much on some good eats.",
    image: "/eventcards/4.png",
    isHot: true,
    background: "bg-gradient-to-b from-purple-300 to-indigo-400",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Hart House Presents: Hamilton",
    date: "Tuesday, 8pm - 11pm",
    location: "UTSU 4th Floor",
    description: "tickets selling fast!",
    isHot: true,
    background: "bg-gradient-to-b from-orange-300 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Innis College Resume Workshop",
    date: "Monday, 6pm - 8pm",
    location: "UTSU 4th Floor",
    description: "fix your resume.",
    image: "/eventcards/6.png",
    isHot: true,
    background: "bg-gradient-to-b from-green-50 to-purple-50",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  }
];

const socialEvents = [
  {
    title: "UofT Greek Life Social",
    date: "Jan 9th, 5pm - 7pm",
    location: "Some Frat",
    description: "perfect for anyone looking to network.",
    isPopular: true,
    background: "bg-gradient-to-b from-yellow-400 to-sky-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Hart House Presents: Hamilton",
    date: "Tuesday, 8pm - 11pm",
    location: "UTSU 4th Floor",
    description: "tickets selling fast!",
    isHot: true,
    background: "bg-gradient-to-b from-orange-300 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "NCSC Barbecue and Mixer",
    date: "Jan 18th, 6pm - 9pm",
    location: "UTSU 4th Floor",
    description: "mingle and much on some good eats.",
    image: "/eventcards/4.png",
    isHot: true,
    background: "bg-gradient-to-b from-purple-300 to-indigo-400",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
];

const careerEvents = [
  {
    title: "Rotman Commerce Career Seminar",
    date: "Jan 9th, 5pm - 7pm",
    location: "UTSU 4th Floor",
    description: "perfect for anyone looking to network.",
    image: "/eventcards/1.png",
    isPopular: true,
    background: "bg-gradient-to-b from-emerald-300 to-purple-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false,
  },
  {
    title: "CS Student Union Beginner Night",
    date: "Next Friday, 7pm-9pm",
    location: "Bahen 4th Floor",
    description: "50% discount!",
    image: "/eventcards/3.png",
    rsvpsLastDay: 23,
    background: "bg-gradient-to-b from-sky-400 to-blue-500",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Innis College Resume Workshop",
    date: "Monday, 6pm - 8pm",
    location: "UTSU 4th Floor",
    description: "fix your resume.",
    image: "/eventcards/6.png",
    isHot: true,
    background: "bg-gradient-to-b from-green-50 to-purple-50",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  }
];

const academicEvents = [
  {
    title: "CS Student Union Beginner Night",
    date: "Next Friday, 7pm-9pm",
    location: "Bahen 4th Floor",
    description: "50% discount!",
    image: "/eventcards/3.png",
    rsvpsLastDay: 23,
    background: "bg-gradient-to-b from-sky-400 to-blue-500",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Innis College Resume Workshop",
    date: "Monday, 6pm - 8pm",
    location: "UTSU 4th Floor",
    description: "fix your resume.",
    image: "/eventcards/6.png",
    isHot: true,
    background: "bg-gradient-to-b from-green-50 to-purple-50",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "NCSC Barbecue and Mixer",
    date: "Jan 18th, 6pm - 9pm",
    location: "UTSU 4th Floor",
    description: "mingle and much on some good eats.",
    image: "/eventcards/4.png",
    isHot: true,
    background: "bg-gradient-to-b from-purple-300 to-indigo-400",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  }
];

const upcomingEvents = [
  {
    title: "NCSC Barbecue and Mixer",
    date: "Jan 18th, 6pm - 9pm",
    location: "UTSU 4th Floor",
    description: "mingle and much on some good eats.",
    image: "/eventcards/4.png",
    isHot: true,
    background: "bg-gradient-to-b from-purple-300 to-indigo-400",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Hart House Presents: Hamilton",
    date: "Tuesday, 8pm - 11pm",
    location: "UTSU 4th Floor",
    description: "tickets selling fast!",
    isHot: true,
    background: "bg-gradient-to-b from-orange-300 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Innis College Resume Workshop",
    date: "Monday, 6pm - 8pm",
    location: "UTSU 4th Floor",
    description: "fix your resume.",
    image: "/eventcards/6.png",
    isHot: true,
    background: "bg-gradient-to-b from-green-50 to-purple-50",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  }
];

const campusFun = [
  {
    title: "AC Soccer Tryouts",
    date: "Tuesday, 1pm - 4pm",
    location: "AC Field",
    description: "come out and show out.",
    spotsRemaining: 5,
    background: "bg-gradient-to-b from-red-400 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Hart House Presents: Hamilton",
    date: "Tuesday, 8pm - 11pm",
    location: "UTSU 4th Floor",
    description: "tickets selling fast!",
    isHot: true,
    background: "bg-gradient-to-b from-orange-300 to-pink-300",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "NCSC Barbecue and Mixer",
    date: "Jan 18th, 6pm - 9pm",
    location: "UTSU 4th Floor",
    description: "mingle and much on some good eats.",
    image: "/eventcards/4.png",
    isHot: true,
    background: "bg-gradient-to-b from-purple-300 to-indigo-400",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
  {
    title: "Foresty Club Recruitment Day",
    date: "Tomorrow, 1pm - 4pm",
    location: "SS 2117",
    description: "come out and join, snip snip!",
    spotsRemaining: 5,
    background: "bg-gradient-to-b from-green-400 to-emerald-600",
    synopsis: "nothing here.",
    eventTypes: ["networking", "seminar"],
    categories: ["economics", "banking", "consulting"],
    eventLink: "#",
    socialLink: "#",
    isRsvped: false
  },
];


export default function Home() {
  const [activeSection, setActiveSection] = useState("recommended");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState({
    recommended: recommendedEvents,
    popular: popularEvents,
    social: socialEvents,
    career: careerEvents,
    campus: campusFun,
    academic: academicEvents,
    upcoming: upcomingEvents,
  });
  const mainRef = useRef(null);
  const scrolling = useRef(false);
  const scrollTimeout = useRef(null);
  const buttonRef = useRef(null);

  const submenuOrder = [
    "recommended",
    "popular",
    "social",
    "career",
    "campus",
    "academic",
    "upcoming",
  ];

  const handleRsvpUpdate = (section, index, updatedEvent) => {
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      newEvents[section][index] = updatedEvent;
      return newEvents;
    });
  };

  const smoothScrollTo = (element, duration = 1000) => {
    if (!element || !mainRef.current) return;

    const container = mainRef.current;
    const start = container.scrollTop;
    const target = element.offsetTop;
    const startTime = performance.now();

    const scroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      container.scrollTop = start + (target - start) * ease(progress);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        setTimeout(() => {
          scrolling.current = false;
        }, 100);
      }
    };

    requestAnimationFrame(scroll);
  };

  const handleScroll = () => {
    if (scrolling.current) return;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      let closestSection = null;
      let minDistance = Infinity;
      let isInBetweenSections = true;

      submenuOrder.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportMiddle = window.innerHeight / 2;
          const distance = Math.abs(rect.top - viewportMiddle);

          // Check if we're directly on a section (within a small threshold)
          if (Math.abs(rect.top) < 20 || Math.abs(rect.bottom - window.innerHeight) < 20) {
            isInBetweenSections = false;
          }

          if (distance < minDistance) {
            minDistance = distance;
            closestSection = sectionId;
          }
        }
      });

      // Only trigger snap if we're between sections and not already centered
      if (closestSection && closestSection !== activeSection && isInBetweenSections) {
        scrolling.current = true;
        const targetElement = document.getElementById(closestSection);
        smoothScrollTo(targetElement);
        setActiveSection(closestSection);
      }
    }, 150);
  };

  useEffect(() => {
    const observerOptions = {
      root: mainRef.current,
      rootMargin: "-45% 0px -45% 0px", // Adjusted to be more strict about center position
      threshold: [0, 0.5, 1],
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !scrolling.current) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    submenuOrder.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        mainElement.removeEventListener("scroll", handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }
  }, [activeSection]);

  const handleSubmenuClick = (submenu) => {
    if (submenu === activeSection) return;

    scrolling.current = true;
    setActiveSection(submenu);
    const element = document.getElementById(submenu);
    if (element) {
      smoothScrollTo(element);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(to bottom, #DCFFD8, #C2FFBB)",
        fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <SidebarNav
        onSubmenuClick={handleSubmenuClick}
        activeSubmenuItem={activeSection}
      />
      <main
        ref={mainRef}
        className="flex-1 flex flex-col items-center justify-start px-4 text-center text-black overflow-y-scroll"
        style={{ height: '100vh' }}
      >
        {submenuOrder.map((submenu, index) => (
          <div
            key={index}
            id={submenu}
            className="min-h-screen flex flex-col items-center justify-center"
          >
            {renderContent(submenu, handleEventClick, handleRsvpUpdate)}
          </div>
        ))}
      </main>

      {/* render popup when an event is selected */}
      {selectedEvent && (
        <EventPopup
        event={selectedEvent}
        onClose={handleClosePopup}
        buttonRef={buttonRef}  // you'll need to add useRef at the top
        onRsvpUpdate={(updatedEvent) => {
          // Find the section this event belongs to
          Object.keys(events).forEach((section) => {
            const index = events[section].findIndex(
              event => event.title === updatedEvent.title
            );
            if (index !== -1) {
              handleRsvpUpdate(section, index, updatedEvent);
            }
          });
        }}
      />
    )}

    </div>
  );
}

const renderContent = (submenu, onEventClick, onRsvpUpdate) => {
  let events = [];

  switch (submenu) {
    case "recommended":
      events = recommendedEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">💡 recommended events.</h1>
          <p className="mt-2 mb-4">
            ... we've seen what you like.
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("recommended", index, updatedEvent)} />
        </div>
      );
    case "popular":
      events = popularEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🔥 popular events.</h1>
          <p className="mt-2 mb-4">
            ... your classmates really seem to like these.
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("popular", index, updatedEvent)} />
        </div>
      );
    case "social":
      events = socialEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🏖️ social events.</h1>
          <p className="mt-2 mb-4">
            ... isn't this what college is all about?
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("social", index, updatedEvent)}/>
        </div>
      );
    case "career":
      events = careerEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🛩️ career events.</h1>
          <p className="mt-2 mb-4">
            ... boost your career with these gems.
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("career", index, updatedEvent)}/>
        </div>
      );

    case "campus":
      events = campusFun;
      return (
          <div>
            <h1 className="mt-4 md:text-3xl">🍿 campus events.</h1>
            <p className="mt-2 mb-4">
              ... a pretty broad category, but you get the idea.
            </p>
            <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("campus", index, updatedEvent)}/>
          </div>
        );

    case "academic":
      events = academicEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🛰️ academic events.</h1>
          <p className="mt-2 mb-4">
            ... expand your knowledge.
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("academic", index, updatedEvent)}/>
        </div>
      );
    case "upcoming":
      events = upcomingEvents;
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🌱 upcoming events.</h1>
          <p className="mt-2 mb-4">
            ... don't miss out on these.
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("upcoming", index, updatedEvent)}/>
        </div>
      );
    default:
      return (
        <div>
          <h1 className="mt-4 md:text-3xl">🌎 all events.</h1>
          <p className="mt-2 mb-4">
            ... whoa, how'd you get here?
          </p>
          <EventCarousel events={events} onEventClick={onEventClick} onRsvpUpdate={(index, updatedEvent) => onRsvpUpdate("all", index, updatedEvent)}/>
        </div>
      );
  }
};