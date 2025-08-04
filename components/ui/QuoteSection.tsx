"use client";

import QuoteCard from "./QuoteCard";
import { useEffect, useState } from "react";

const quotes = [
  {
    avatar: "https://i.ibb.co/mV2HG5Z0/1754218627324.jpg",
    username: "Takashin",
    text: "because I love you very much.",
    likes: 978,
    comments: 96,
    shares: 10,
    verified: true,
  },
  {
    avatar: "https://i.ibb.co/VYtN4H7j/a16f8523c72a7218baffd1a8dd069322.jpg",
    username: "Riselia",
    text: "no one can stop our love.",
    likes: 740,
    comments: 134,
    shares: 89,
    verified: true,
  },
  {
    avatar: "https://i.ibb.co/Kx79km2R/images-9.jpg",
    username: "Brando Cipularang",
    text: "I know I'm black, even though I'm black, my love for you will never fade..",
    likes: 1320,
    comments: 232,
    shares: 132,
    verified: true,
  },
  {
    avatar: "https://i.ibb.co/ychwzC7M/images-10.jpg",
    username: "tuwir yapping",
    text: "Manhwa bukan sekadar bacaan. Ini seni, ini cerita, ini hidup.",
    likes: 2,
    comments: 1,
    shares: 0,
    verified: true,
  },
  {
    avatar: "https://i.ibb.co/Vc8fZn1Z/115b216e4a0c7500964bfa20e7df5e62-2.jpg",
    username: "Shorekeeper",
    text: "no matter how far apart we are i will always be by your side. maybe this feeling is love?.",
    likes: 9780,
    comments: 438,
    shares: 976,
    verified: true,
  },
];

export default function QuoteSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-16 px-4 bg-black">
      <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-10">
        Apa Kata Mereka?
      </h2>
      <div
        className={`${
          isMobile
            ? "flex overflow-x-auto gap-4 snap-x snap-mandatory"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }`}
      >
        {quotes.map((quote, i) => (
          <div
            key={i}
            className={`${isMobile ? "min-w-[85%] snap-center" : ""}`}
          >
            <QuoteCard {...quote} />
          </div>
        ))}
      </div>
    </section>
  );
}
