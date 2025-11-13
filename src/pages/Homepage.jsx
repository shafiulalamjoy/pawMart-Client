// src/pages/Homepage.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Homepage: Banner Slider, Categories, Recent Listings, Extras
 * - Replace placeholder images and API endpoints with your real assets/backend.
 */

const SLIDES = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a0f0b58d8e7a6d7a7f3d9c8b1fdc9b4",
    title: "Find Your Furry Friend Today!",
    subtitle: "Adopt, Don’t Shop — Give a Pet a Home.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5d2e6df4e0f6ad3b6a9a38d9e4a4b6d0",
    title: "Because Every Pet Deserves Love and Care.",
    subtitle: "Healthy pets, happy families.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c6d3bfa3b7b3b6b02eec3ab2b8e1f8a",
    title: "Match. Adopt. Love.",
    subtitle: "Start your adoption journey right here.",
  },
];

const CATEGORIES = [
  { key: "Pets", label: "Pets (Adoption)", emoji: "🐶" },
  { key: "Food", label: "Pet Food", emoji: "🍖" },
  { key: "Accessories", label: "Accessories", emoji: "🦴" },
  { key: "Care", label: "Pet Care Products", emoji: "🧴" },
];

export default function Homepage() {
  const navigate = useNavigate();

  // Slider state
  const [index, setIndex] = useState(0);
  const sliderIntervalRef = useRef(null);

  // Listings state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-play slider
  useEffect(() => {
    sliderIntervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000); // 5s
    return () => clearInterval(sliderIntervalRef.current);
  }, []);

  // Fetch recent listings (latest 6)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Replace with your real backend endpoint
    fetch("/api/listings?limit=6")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load listings");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Expecting an array of listing objects
        setListings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError("Unable to load recent listings.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryKey) => {
    // navigate to category-filtered page
    navigate(`/category-filtered-product/${encodeURIComponent(categoryKey)}`);
  };

  const handleSeeDetails = (listing) => {
    navigate(`/listing/${listing._id || listing.id}`, { state: { listing } });
  };

  return (
    <div className="space-y-12">
      {/* Banner / Slider */}
      <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={s.img}
              alt={s.title}
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 lg:px-32 text-white">
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-md">{s.title}</h2>
              <p className="mt-3 md:mt-4 text-lg md:text-xl max-w-2xl drop-shadow-sm">
                {s.subtitle}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/pets-supplies")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-3"
                >
                  Browse Listings
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white/90 hover:bg-white text-blue-700 px-4 py-2 rounded-md"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* controls */}
        <div className="absolute left-4 bottom-6 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              aria-label={`go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-6">Shop by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => handleCategoryClick(c.key)}
              className="group bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col items-start gap-3 text-left"
            >
              <div className="text-4xl">{c.emoji}</div>
              <div className="text-lg font-semibold">{c.label}</div>
              <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-700">
                View {c.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Recent Listings</h3>
          <Link to="/pets-supplies" className="text-blue-600 hover:underline text-sm">
            View all listings →
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">Loading recent listings...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : listings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((l) => (
              <article key={l._id || l.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={l.imageUrl || l.image || placeholderFor(l)}
                  alt={l.title || l.name || "listing image"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{l.title || l.name}</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Category: {l.category}</div>
                    <div>Location: {l.location}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-700">
                      {l.price === 0 || l.price === "0" ? "Free for Adoption" : `৳ ${l.price}`}
                    </div>
                    <button
                      onClick={() => handleSeeDetails(l)}
                      className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Extra Section 1: Why Adopt */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-6 items-center">
          <img
            src="https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b0f2b1e9d7e2a0a1b2f6b3c4d5e6f7a"
            alt="adopt"
            className="w-full md:w-1/2 h-56 object-cover rounded-lg"
          />
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-3">Why Adopt from PawMart?</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li>Save a life — adopt a pet instead of buying.</li>
              <li>Transparent histories: medical records and temperament notes.</li>
              <li>We support responsible rehoming and safe adoptions.</li>
              <li>Post-adoption support and care tips available on our platform.</li>
            </ul>
            <div className="mt-4">
              <Link to="/pets-supplies" className="text-blue-600 hover:underline">
                Browse adoptable pets →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Meet Our Pet Heroes */}
      <section className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6">Meet Our Pet Heroes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Rashed & Milo", role: "Adopter", img: "https://images.unsplash.com/photo-1548198145-3d8a0f9a1b7e?q=80&w=600" },
            { name: "Sadia & Poppy", role: "Foster", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600" },
            { name: "Amina & Luna", role: "Caregiver", img: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?q=80&w=600" },
            { name: "Farhan & Roxy", role: "Volunteer", img: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=600" },
          ].map((p, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4 text-center">
              <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded-md mb-3" />
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">{p.role}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// helper to provide a placeholder when listing image is missing
function placeholderFor(listing) {
  return "https://via.placeholder.com/800x500?text=No+Image";
}

