

import { useEffect, useState } from "react";

import api from "./api";

import "./App.css";



const HERO_IMAGE =

  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85";



const CAR_IMAGES = [

  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",

  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",

  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",

  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",

  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",

  "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",

];



function getCarImage(car) {

  const text = `${car.make} ${car.model}`.toLowerCase();



  if (/bmw|mercedes|audi|benz|lexus|luxury/.test(text)) {

    return CAR_IMAGES[2];

  }

  if (/creta|nexon|suv|rav4|fortuner|xuv|seltos/.test(text)) {

    return CAR_IMAGES[4];

  }

  if (/swift|honda|civic|sedan|corolla|toyota/.test(text)) {

    return CAR_IMAGES[0];

  }



  return CAR_IMAGES[(Number(car.id) || 1) % CAR_IMAGES.length];

}



function formatPrice(rate) {

  return Number(rate).toLocaleString("en-IN", {

    maximumFractionDigits: 2,

  });

}



function formatRentalDate(dateStr) {

  if (!dateStr) return "";

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) return String(dateStr);

  return d.toLocaleDateString("en-IN", {

    month: "short",

    day: "numeric",

    year: "numeric",

  });

}



function getErrorMessage(err, fallback) {

  const detail = err.response?.data?.detail;

  return typeof detail === "string" ? detail : fallback;

}



function App() {

  const [cars, setCars] = useState([]);

  const [analytics, setAnalytics] = useState({
    total_cars: 0,
    available_cars: 0,
    active_rentals: 0,
    cancelled_rentals: 0,
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsUpdatedAt, setAnalyticsUpdatedAt] = useState(null);

  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);


  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [userName, setUserName] = useState("");

  const [selectedCar, setSelectedCar] = useState(null);

  const [carDetails, setCarDetails] = useState(null);

  const [rentalId, setRentalId] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false);

  const [addingCar, setAddingCar] = useState(false);

  const [cancelling, setCancelling] = useState(false);

  const [activeSection, setActiveSection] = useState("home");

  const [showAddCar, setShowAddCar] = useState(false);



  const [newCar, setNewCar] = useState({

    make: "",

    model: "",

    year: "",

    daily_rate: "",

    available: true,

  });



  async function loadRentals() {
    try {
      setRentalsLoading(true);
      const response = await api.get("/rentals/");
      setRentals(response.data);
    } catch (err) {
      console.error("Unable to load rentals:", err);
    } finally {
      setRentalsLoading(false);
    }
  }

  async function loadAnalytics() {
    try {
      const response = await api.get("/analytics/summary");
      setAnalytics(response.data);
      setAnalyticsUpdatedAt(new Date());
    } catch (err) {
      console.error("Unable to load analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadCars(start = startDate, end = endDate, isBackground = false) {

    try {

      if (!isBackground) {
        setLoading(true);
      }



      const params = {};

      if (start && end) {

        params.start_date = start;

        params.end_date = end;

      }



      const response = await api.get("/cars/", { params });

      setCars(response.data);

    } catch (err) {

      if (!isBackground) {
        setError(getErrorMessage(err, "Unable to load cars. Check the backend."));
      }

    } finally {

      if (!isBackground) {
        setLoading(false);
      }

    }

  }



  useEffect(() => {
    loadCars(startDate, endDate);
    loadAnalytics();
    loadRentals();

    const intervalId = setInterval(() => {
      loadCars(startDate, endDate, true);
      loadAnalytics();
      loadRentals();
    }, 4000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);



  function clearNotices() {

    setMessage("");

    setError("");

  }



  async function handleSearch(event) {

    event.preventDefault();

    clearNotices();



    if (!startDate || !endDate) {

      setError("Please select both your start and end dates.");

      return;

    }



    if (endDate <= startDate) {

      setError("The end date must be after the start date.");

      return;

    }



    setCarDetails(null);

    setSelectedCar(null);

    await loadCars(startDate, endDate);

  }



  async function handleViewDetails(car) {

    clearNotices();

    setCarDetails(null);

    setSelectedCar(null);

    setDetailsLoading(true);



    try {

      const params = {};
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await api.get(`/cars/${car.id}`, { params });

      setCarDetails(response.data);

    } catch (err) {

      setError(getErrorMessage(err, "Unable to load car details."));

    } finally {

      setDetailsLoading(false);

    }

  }



  function handleStartBooking(car) {

    clearNotices();



    if (!startDate || !endDate || endDate <= startDate) {

      setError("Choose a valid rental date range before booking.");

      document.querySelector("#availability")?.scrollIntoView({

        behavior: "smooth",

        block: "center",

      });

      return;

    }



    setSelectedCar(car);

    setCarDetails(null);



    document.querySelector("#booking")?.scrollIntoView({

      behavior: "smooth",

      block: "center",

    });

  }



  async function handleRent(event) {

    event.preventDefault();

    clearNotices();



    if (!selectedCar || !userName.trim() || !startDate || !endDate) {

      setError("Enter your name and select a car and rental dates.");

      return;

    }



    if (endDate <= startDate) {

      setError("The end date must be after the start date.");

      return;

    }



    try {

      setBookingLoading(true);



      const response = await api.post(`/cars/${selectedCar.id}/rent`, {

        user_name: userName.trim(),

        start_date: startDate,

        end_date: endDate,

      });



      setMessage(

        `Booking confirmed! Your rental ID is ${response.data.id}. Keep this ID if you need to cancel.`

      );

      setSelectedCar(null);

      setUserName("");

      await loadCars(startDate, endDate);
      await loadRentals();
      await loadAnalytics();

    } catch (err) {

      const serverDetail = getErrorMessage(err, "");
      let friendlyMessage = "Booking conflict: This car is already booked for the requested dates. Please choose different dates.";

      if (serverDetail) {
        if (/already booked/i.test(serverDetail)) {
          friendlyMessage = `Booking conflict: ${selectedCar?.make} ${selectedCar?.model} is already booked for your selected dates. Please choose different dates.`;
        } else if (/all cars/i.test(serverDetail)) {
          friendlyMessage = "Booking conflict: All cars in the fleet are currently rented for the requested dates. Please choose a different date range.";
        } else {
          friendlyMessage = `Booking error: ${serverDetail}`;
        }
      }

      setError(friendlyMessage);

      await loadCars(startDate, endDate, true);

    } finally {

      setBookingLoading(false);

    }

  }



  async function handleAddCar(event) {

    event.preventDefault();

    clearNotices();



    const year = Number(newCar.year);

    const dailyRate = Number(newCar.daily_rate);



    if (

      !newCar.make.trim() ||

      !newCar.model.trim() ||

      !Number.isInteger(year) ||

      year <= 1885 ||

      year > 2100 ||

      !Number.isFinite(dailyRate) ||

      dailyRate <= 0

    ) {

      setError("Enter a valid make, model, year, and positive daily rate.");

      return;

    }



    try {

      setAddingCar(true);



      const response = await api.post("/cars/", {

        make: newCar.make.trim(),

        model: newCar.model.trim(),

        year,

        daily_rate: dailyRate,

        available: newCar.available,

      });



      setMessage(

        `${response.data.make} ${response.data.model} was added successfully.`

      );

      setNewCar({

        make: "",

        model: "",

        year: "",

        daily_rate: "",

        available: true,

      });

      setShowAddCar(false);

      setActiveSection("home");

      await loadCars(startDate, endDate);

    } catch (err) {

      setError(getErrorMessage(err, "Unable to add the car."));

    } finally {

      setAddingCar(false);

    }

  }



  async function handleCancelRental(idToCancel) {
    clearNotices();

    const id = String(idToCancel || "").trim();

    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      setError("Enter a valid rental ID.");
      return;
    }

    try {
      setCancelling(true);
      const response = await api.delete(`/rentals/${id}`);

      setMessage(`Rental #${response.data.id} was cancelled successfully.`);
      if (rentalId === id) {
        setRentalId("");
      }

      await loadCars(startDate, endDate);
      await loadRentals();
      await loadAnalytics();
    } catch (err) {
      setError(getErrorMessage(err, "Cancellation failed. Check the rental ID."));
    } finally {
      setCancelling(false);
    }
  }

  async function handleCancel(event) {
    event.preventDefault();
    await handleCancelRental(rentalId);
  }



  function navigateTo(section) {

    setActiveSection(section);



    const element = document.querySelector(`#${section}`);

    element?.scrollIntoView({ behavior: "smooth", block: "start" });



    if (section === "add-car") {

      setShowAddCar(true);

    }

  }



  return (

    <div className="app-shell">

      <header className="topbar">

        <div className="topbar-inner">

          <a

            className="brand"

            href="#home"

            onClick={() => setActiveSection("home")}

          >

            <span className="brand-icon">✦</span>

            <span>Pranaesh <span className="brand-light">Rental cars</span></span>

          </a>



          <nav className="main-nav" aria-label="Main navigation">

            <button

              className={activeSection === "home" ? "nav-link active" : "nav-link"}

              onClick={() => navigateTo("home")}

            >

              Home

            </button>

            <button

              className={activeSection === "cars" ? "nav-link active" : "nav-link"}

              onClick={() => navigateTo("cars")}

            >

              Browse Cars

            </button>

            <button

              className={activeSection === "rentals" ? "nav-link active" : "nav-link"}

              onClick={() => navigateTo("rentals")}

            >

              My Rentals

            </button>

            <button

              className={activeSection === "add-car" ? "nav-link active" : "nav-link"}

              onClick={() => {

                setShowAddCar(true);

                navigateTo("add-car");

              }}

            >

              Add Car

            </button>

          </nav>



          <a className="topbar-cta" href="#availability">

            <span className="status-dot" />

            Find a car

          </a>

        </div>

      </header>



      <main id="home">

        <section className="hero">

          <img className="hero-image" src={HERO_IMAGE} alt="Premium car on a scenic road" />

          <div className="hero-overlay" />



          <div className="hero-content page-width">

            <span className="eyebrow hero-eyebrow">

              YOUR JOURNEY STARTS HERE

            </span>

            <h1>

              Every road has a story.

              <br />

              <span>Find your ride.</span>

            </h1>

            <p className="hero-description">

              Discover the right car for every journey, from daily drives

              to unforgettable getaways.

            </p>



            <div className="hero-points">

              <span><span className="point-check">✓</span> Flexible dates</span>

              <span><span className="point-check">✓</span> Easy booking</span>

              <span><span className="point-check">✓</span> Your next adventure</span>

            </div>

          </div>



          <div className="availability-wrap page-width" id="availability">

            <form className="availability-card" onSubmit={handleSearch}>

              <div className="availability-heading">

                <div>

                  <span className="eyebrow">PLAN YOUR TRIP</span>

                  <h2>Find your perfect car</h2>

                </div>

                <span className="availability-icon">⌕</span>

              </div>



              <div className="availability-fields">

                <label className="field">

                  <span className="field-label">Pick-up date</span>

                  <input

                    type="date"

                    value={startDate}

                    onChange={(event) => setStartDate(event.target.value)}

                    required

                  />

                </label>



                <label className="field">

                  <span className="field-label">Return date</span>

                  <input

                    type="date"

                    value={endDate}

                    min={startDate || undefined}

                    onChange={(event) => setEndDate(event.target.value)}

                    required

                  />

                </label>



                <button className="button button-primary search-button" type="submit">

                  <span>⌕</span> Search cars

                </button>

              </div>

              <p className="availability-hint">

                Choose your dates to see cars available for your trip.

              </p>

            </form>

          </div>

        </section>



        <section className="content page-width">

          <section className="analytics-section" aria-label="Fleet analytics">
            <div className="analytics-heading">
              <div>
                <span className="eyebrow">LIVE OVERVIEW</span>
                <h2>Fleet dashboard</h2>
                <p>Monitor your fleet and rental activity at a glance.</p>
              </div>

              <div className="analytics-refresh">
                <span className="live-dot" />
                <span>
                  {analyticsUpdatedAt
                    ? `Updated ${analyticsUpdatedAt.toLocaleTimeString()}`
                    : "Connecting to analytics..."}
                </span>
              </div>
            </div>

            <div className="analytics-grid">
              <article className="analytics-card">
                <div className="analytics-card-top">
                  <span className="analytics-icon" aria-hidden="true">🚘</span>
                  <span className="analytics-label">TOTAL FLEET</span>
                </div>
                <strong className="analytics-value">
                  {analyticsLoading ? "—" : analytics.total_cars}
                </strong>
                <span className="analytics-caption">Registered vehicles</span>
              </article>

              <article className="analytics-card">
                <div className="analytics-card-top">
                  <span className="analytics-icon" aria-hidden="true">✓</span>
                  <span className="analytics-label">AVAILABLE</span>
                </div>
                <strong className="analytics-value">
                  {analyticsLoading ? "—" : analytics.available_cars}
                </strong>
                <span className="analytics-caption">Marked available in fleet</span>
              </article>

              <article className="analytics-card">
                <div className="analytics-card-top">
                  <span className="analytics-icon" aria-hidden="true">🔑</span>
                  <span className="analytics-label">ACTIVE RENTALS</span>
                </div>
                <strong className="analytics-value">
                  {analyticsLoading ? "—" : analytics.active_rentals}
                </strong>
                <span className="analytics-caption">Not cancelled</span>
              </article>

              <article className="analytics-card">
                <div className="analytics-card-top">
                  <span className="analytics-icon" aria-hidden="true">↩</span>
                  <span className="analytics-label">CANCELLED</span>
                </div>
                <strong className="analytics-value">
                  {analyticsLoading ? "—" : analytics.cancelled_rentals}
                </strong>
                <span className="analytics-caption">Cancelled rental records</span>
              </article>
            </div>
          </section>

          {(message || error) && (

            <div

              className={error ? "alert alert-error" : "alert alert-success"}

              role="status"

            >

              <span className="alert-icon">{error ? "!" : "✓"}</span>

              <span>{error || message}</span>

              <button

                className="alert-close"

                onClick={() => {

                  setMessage("");

                  setError("");

                }}

                aria-label="Dismiss notification"

              >

                ×

              </button>

            </div>

          )}



          <div className="section-intro" id="cars">

            <div>

              <span className="eyebrow">HANDPICKED FOR YOUR JOURNEY</span>

              <h2>Explore our fleet</h2>

              <p>Find the right companion for wherever life takes you.</p>

            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>

              <span className="analytics-refresh">

                <span className="live-dot" /> Live availability updates

              </span>

              <div className="fleet-count">

                <span className="fleet-count-number">{cars.length}</span>

                <span>cars available</span>

              </div>

            </div>

          </div>



          {loading ? (

            <div className="state-card">

              <span className="loader" />

              <p>Finding your perfect ride...</p>

            </div>

          ) : cars.length === 0 ? (

            <div className="state-card empty-state">

              <span className="empty-icon">⌕</span>

              <h3>No cars available for these dates</h3>

              <p>Try another date range, or check back soon.</p>

              <button

                className="button button-outline"

                onClick={() => {

                  setStartDate("");

                  setEndDate("");

                  loadCars("", "");

                }}

              >

                Show all cars

              </button>

            </div>

          ) : (

            <div className="fleet-layout">

              <div className="car-grid">

                {cars.map((car, index) => (

                  <article className="car-card" key={car.id}>

                    <button

                      className="car-image-button"

                      onClick={() => handleViewDetails(car)}

                      aria-label={`View details for ${car.make} ${car.model}`}

                    >

                      <img

                        className="car-image"

                        src={getCarImage(car)}

                        alt={`${car.make} ${car.model}`}

                        loading={index > 2 ? "lazy" : "eager"}

                        onError={(event) => {

                          event.currentTarget.onerror = null;

                          event.currentTarget.src = HERO_IMAGE;

                        }}

                      />

                      <span className="car-image-label">Explore car ↗</span>

                    </button>



                    <div className="car-card-body">

                      <div className="car-title-row">

                        <div>

                          <span className="car-make">{car.make}</span>

                          <h3>{car.model}</h3>

                        </div>

                        <div className="car-badges">

                          <span className="year-pill">{car.year}</span>

                          {car.is_booked && (

                            <span className="rental-status status-cancelled">Booked</span>

                          )}

                        </div>

                      </div>



                      <div className="car-meta">

                        <span><span className="meta-icon">◷</span> {car.year} model</span>

                        <span className="car-price">

                          ₹{formatPrice(car.daily_rate)}

                          <small> / day</small>

                        </span>

                      </div>



                      {car.is_booked && (

                        <p className="car-booked-note">

                          ⚠️ Booked for {car.booked_range || "selected dates"}

                        </p>

                      )}



                      <div className="car-card-actions">

                        <button

                          className="button button-outline"

                          onClick={() => handleViewDetails(car)}

                        >

                          View details <span>↗</span>

                        </button>



                        <button

                          className="button button-primary"

                          onClick={() => handleStartBooking(car)}

                        >

                          Book now

                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>



              <aside className="side-column">

                <section className="side-card detail-card">

                  <div className="side-card-heading">

                    <div>

                      <span className="eyebrow">YOUR NEXT RIDE</span>

                      <h3>Car details</h3>

                    </div>

                    {carDetails && (

                      <button

                        className="icon-button"

                        onClick={() => setCarDetails(null)}

                        aria-label="Close car details"

                      >

                        ×

                      </button>

                    )}

                  </div>



                  {detailsLoading ? (

                    <div className="inline-loading">

                      <span className="loader" /> Loading details...

                    </div>

                  ) : carDetails ? (

                    <>

                      <img

                        className="detail-image"

                        src={getCarImage(carDetails)}

                        alt={`${carDetails.make} ${carDetails.model}`}

                        onError={(event) => {

                          event.currentTarget.onerror = null;

                          event.currentTarget.src = HERO_IMAGE;

                        }}

                      />

                      <div className="detail-title-row">

                        <div>

                          <h4>{carDetails.make} {carDetails.model}</h4>

                          <p>Vehicle ID #{carDetails.id}</p>

                        </div>

                        <span className="year-pill">{carDetails.year}</span>

                      </div>



                      <div className="detail-stats">

                        <div>

                          <span>Model year</span>

                          <strong>{carDetails.year}</strong>

                        </div>

                        <div>

                          <span>Daily rate</span>

                          <strong>₹{formatPrice(carDetails.daily_rate)}</strong>

                        </div>

                      </div>



                      {carDetails.is_booked && (

                        <div className="alert alert-error" style={{ marginBottom: "16px" }}>

                          <span>⚠️ Reserved for {carDetails.booked_range || "the selected dates"}. Pick another date range or vehicle.</span>

                        </div>

                      )}



                      <p className="detail-description">

                        A great choice for your next trip. Select your rental

                        dates to check availability and reserve this vehicle.

                      </p>



                      <button

                        className="button button-primary button-full"

                        onClick={() => handleStartBooking(carDetails)}

                      >

                        Book this car <span>→</span>

                      </button>

                      <button

                        className="button button-text button-full"

                        onClick={() => setCarDetails(null)}

                      >

                        Close details

                      </button>

                    </>

                  ) : (

                    <div className="detail-placeholder">

                      <div className="placeholder-icon">↗</div>

                      <h4>Your next ride awaits</h4>

                      <p>Select any car to see its details, year, and daily rental price here.</p>

                    </div>

                  )}

                </section>



                <section className="side-card booking-card" id="booking">

                  <div className="side-card-heading">

                    <div>

                      <span className="eyebrow">MAKE IT YOURS</span>

                      <h3>Complete your booking</h3>

                    </div>

                    <span className="booking-step">01</span>

                  </div>



                  {selectedCar ? (

                    <>

                      <div className="booking-car">

                        <img

                          src={getCarImage(selectedCar)}

                          alt={`${selectedCar.make} ${selectedCar.model}`}

                          onError={(event) => {

                            event.currentTarget.onerror = null;

                            event.currentTarget.src = HERO_IMAGE;

                          }}

                        />

                        <div>

                          <strong>{selectedCar.make} {selectedCar.model}</strong>

                          <span>{selectedCar.year} · ₹{formatPrice(selectedCar.daily_rate)}/day</span>

                        </div>

                        <button

                          className="icon-button"

                          onClick={() => setSelectedCar(null)}

                          aria-label="Remove selected car"

                        >

                          ×

                        </button>

                      </div>



                      <form className="stacked-form" onSubmit={handleRent}>

                        <label className="field">

                          <span className="field-label">Full name</span>

                          <input

                            value={userName}

                            onChange={(event) => setUserName(event.target.value)}

                            placeholder="Enter your full name"

                            maxLength={100}

                            required

                          />

                        </label>



                        <div className="booking-date-grid">

                          <label className="field">

                            <span className="field-label">Pick-up</span>

                            <input

                              type="date"

                              value={startDate}

                              onChange={(event) => setStartDate(event.target.value)}

                              required

                            />

                          </label>

                          <label className="field">

                            <span className="field-label">Return</span>

                            <input

                              type="date"

                              min={startDate || undefined}

                              value={endDate}

                              onChange={(event) => setEndDate(event.target.value)}

                              required

                            />

                          </label>

                        </div>



                        {error && (

                          <div

                            className="alert alert-error"

                            style={{

                              margin: "16px 0 12px",

                              padding: "12px 14px",

                              borderRadius: "14px",

                              display: "flex",

                              alignItems: "flex-start",

                              gap: "10px",

                            }}

                          >

                            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>⚠️</span>

                            <div style={{ flex: 1 }}>

                              <strong style={{ display: "block", marginBottom: "2px", fontSize: "0.86rem" }}>

                                Booking Conflict

                              </strong>

                              <span style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>

                                {error}

                              </span>

                            </div>

                            <button

                              type="button"

                              className="alert-close"

                              onClick={() => setError("")}

                              aria-label="Dismiss error"

                            >

                              ×

                            </button>

                          </div>

                        )}



                        <button

                          className="button button-primary button-full"

                          type="submit"

                          disabled={bookingLoading}

                        >

                          {bookingLoading ? "Confirming..." : "Confirm booking →"}

                        </button>

                        <p className="form-note">

                          Your rental ID will appear after booking confirmation.

                        </p>

                      </form>

                    </>

                  ) : (

                    <div className="detail-placeholder booking-placeholder">

                      <div className="placeholder-icon">✓</div>

                      <h4>Ready when you are</h4>

                      <p>Choose a car and rental dates, then book it here.</p>

                      <button

                        className="button button-outline button-full"

                        onClick={() => navigateTo("cars")}

                      >

                        Browse available cars

                      </button>

                    </div>

                  )}

                </section>

              </aside>

            </div>

          )}



          <section className="rentals-section" id="rentals">

            <div className="section-intro rentals-intro">

              <div>

                <span className="eyebrow">YOUR RESERVATIONS</span>

                <h2>My Rentals</h2>

                <p>View your booked vehicles, rental periods, and reservation statuses.</p>

              </div>

              <div className="fleet-count">

                <span>Bookings:</span>

                <span className="fleet-count-number">{rentals.length}</span>

              </div>

            </div>



            {rentalsLoading && rentals.length === 0 ? (

              <div className="inline-loading">

                <span className="loader" /> Loading rentals...

              </div>

            ) : rentals.length === 0 ? (

              <div className="detail-placeholder">

                <div className="placeholder-icon">📋</div>

                <h4>No rentals yet</h4>

                <p>Select dates and book a vehicle to see your reservations here.</p>

              </div>

            ) : (

              <div className="rental-list">

                {rentals.map((item) => {

                  const carTitle = item.car

                    ? `${item.car.make} ${item.car.model}`

                    : `Vehicle #${item.car_id}`;

                  const isCancelled = Boolean(item.cancelled_at);



                  return (

                    <div key={item.id} className="rental-row">

                      <div className="rental-row-main">

                        <span className="rental-id">RENTAL #{item.id}</span>

                        <h3>{carTitle}</h3>

                        <p>

                          Rented by {item.user_name} · {formatRentalDate(item.start_date)} to {formatRentalDate(item.end_date)}

                        </p>

                      </div>



                      <span

                        className={`rental-status ${

                          isCancelled ? "status-cancelled" : "status-active"

                        }`}

                      >

                        {isCancelled ? "Cancelled" : "Active"}

                      </span>



                      {!isCancelled ? (

                        <button

                          type="button"

                          className="button button-outline"

                          onClick={() => handleCancelRental(item.id)}

                          disabled={cancelling}

                        >

                          {cancelling ? "Cancelling..." : "Cancel rental"}

                        </button>

                      ) : (

                        <span />

                      )}

                    </div>

                  );

                })}

              </div>

            )}

          </section>



          <section className="management-grid" id="add-car">

            <div className="management-card add-car-card">

              <div className="management-heading">

                <span className="management-icon blue-icon">＋</span>

                <div>

                  <h3>Add a new car</h3>

                  <p>Grow your fleet by adding a vehicle.</p>

                </div>

                <button

                  className="button button-outline management-toggle"

                  onClick={() => setShowAddCar(!showAddCar)}

                >

                  {showAddCar ? "Close" : "Add vehicle"}

                </button>

              </div>



              {showAddCar && (

                <form className="management-form" onSubmit={handleAddCar}>

                  <label className="field">

                    <span className="field-label">Make</span>

                    <input

                      value={newCar.make}

                      onChange={(event) =>

                        setNewCar({ ...newCar, make: event.target.value })

                      }

                      placeholder="e.g. Toyota"

                      maxLength={100}

                      required

                    />

                  </label>

                  <label className="field">

                    <span className="field-label">Model</span>

                    <input

                      value={newCar.model}

                      onChange={(event) =>

                        setNewCar({ ...newCar, model: event.target.value })

                      }

                      placeholder="e.g. Corolla"

                      maxLength={100}

                      required

                    />

                  </label>

                  <label className="field">

                    <span className="field-label">Year</span>

                    <input

                      type="number"

                      min="1886"

                      max="2100"

                      step="1"

                      value={newCar.year}

                      onChange={(event) =>

                        setNewCar({ ...newCar, year: event.target.value })

                      }

                      placeholder="2025"

                      required

                    />

                  </label>

                  <label className="field">

                    <span className="field-label">Daily rate (₹)</span>

                    <input

                      type="number"

                      min="0.01"

                      step="0.01"

                      value={newCar.daily_rate}

                      onChange={(event) =>

                        setNewCar({ ...newCar, daily_rate: event.target.value })

                      }

                      placeholder="1800"

                      required

                    />

                  </label>

                  <label className="field">

                    <span className="field-label">Status</span>

                    <select

                      value={String(newCar.available)}

                      onChange={(event) =>

                        setNewCar({

                          ...newCar,

                          available: event.target.value === "true",

                        })

                      }

                    >

                      <option value="true">Available</option>

                      <option value="false">Unavailable</option>

                    </select>

                  </label>

                  <button

                    className="button button-primary"

                    type="submit"

                    disabled={addingCar}

                  >

                    {addingCar ? "Adding..." : "＋ Add car"}

                  </button>

                </form>

              )}

            </div>



            <div className="management-card cancel-card" id="cancel-rental">

              <div className="management-heading">

                <span className="management-icon red-icon">↶</span>

                <div>

                  <h3>Cancel a rental</h3>

                  <p>Enter the rental ID from your confirmation.</p>

                </div>

              </div>



              <form className="cancel-form" onSubmit={handleCancel}>

                <label className="field">

                  <span className="field-label">Rental ID</span>

                  <input

                    type="number"

                    min="1"

                    step="1"

                    value={rentalId}

                    onChange={(event) => setRentalId(event.target.value)}

                    placeholder="e.g. 2"

                    required

                  />

                </label>

                <button

                  className="button button-danger"

                  type="submit"

                  disabled={cancelling}

                >

                  {cancelling ? "Cancelling..." : "Cancel rental"}

                </button>

              </form>

            </div>

          </section>

        </section>

      </main>



      <footer className="footer">

        <div className="footer-inner page-width">

          <a className="brand footer-brand" href="#home">

            <span className="brand-icon">✦</span>

            <span>Pranaesh <span className="brand-light">Rental cars</span></span>

          </a>

          <p>Made for the journey ahead.</p>

          <span className="footer-tech">React <i /> FastAPI <i /> SQLite</span>

        </div>

      </footer>

    </div>

  );

}



export default App;
