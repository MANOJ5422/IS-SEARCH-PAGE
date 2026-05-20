// App.js

import React, { useEffect, useMemo, useState } from "react";

export default function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [profile, setProfile] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");

  // Fetch internships
  useEffect(() => {
    fetch("https://internshala.com/hiring/search")
      .then((res) => res.json())
      .then((data) => {
        let internshipsData = [];

        if (data?.internships_meta) {
          internshipsData = Object.values(data.internships_meta);
        } else if (data?.internships) {
          internshipsData = data.internships;
        }

        setInternships(internshipsData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const profileMatch = profile
        ? item.profile_name
            ?.toLowerCase()
            .includes(profile.toLowerCase())
        : true;

      const locationMatch = location
        ? item.location_names
            ?.join(", ")
            .toLowerCase()
            .includes(location.toLowerCase())
        : true;

      const durationMatch = duration
        ? item.duration
            ?.toLowerCase()
            .includes(duration.toLowerCase())
        : true;

      const stipendValue =
        item.stipend?.salary?.replace(/[^0-9]/g, "") || "";

      const stipendMatch = stipend
        ? Number(stipendValue) >= Number(stipend)
        : true;

      return (
        profileMatch &&
        locationMatch &&
        durationMatch &&
        stipendMatch
      );
    });
  }, [internships, profile, location, duration, stipend]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Internship Search</h1>
      </header>

      <div style={styles.container}>
        {/* Filters */}
        <aside style={styles.sidebar}>
          <h2>Filters</h2>

          <div style={styles.filterGroup}>
            <label>Profile</label>
            <input
              type="text"
              placeholder="e.g. React Developer"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Delhi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label>Duration</label>
            <input
              type="text"
              placeholder="e.g. 6 Months"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label>Minimum Stipend</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              style={styles.input}
            />
          </div>
        </aside>

        {/* Internship Cards */}
        <main style={styles.main}>
          <div style={styles.topBar}>
            <h2>Latest Internships</h2>
            <span>{filteredInternships.length} internships</span>
          </div>

          {loading ? (
            <h3>Loading internships...</h3>
          ) : filteredInternships.length === 0 ? (
            <h3>No internships found.</h3>
          ) : (
            filteredInternships.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.profile}>
                      {item.profile_name}
                    </h3>

                    <p style={styles.company}>
                      {item.company_name}
                    </p>
                  </div>

                  {item.work_from_home && (
                    <span style={styles.remoteBadge}>
                      Work From Home
                    </span>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <div>
                    <p style={styles.label}>Location</p>
                    <p>
                      {item.location_names?.join(", ") ||
                        "Remote"}
                    </p>
                  </div>

                  <div>
                    <p style={styles.label}>Duration</p>
                    <p>{item.duration}</p>
                  </div>

                  <div>
                    <p style={styles.label}>Stipend</p>
                    <p>
                      {item.stipend?.salary ||
                        "Not Disclosed"}
                    </p>
                  </div>
                </div>

                <div style={styles.footer}>
                  <span>
                    Start Date:{" "}
                    {item.start_date || "Immediately"}
                  </span>

                  <button style={styles.button}   onClick={() =>
    window.open(
      `https://internshala.com/${item.url}`,
      "_blank"
    )
  }>
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

// Styles
const styles = {
  page: {
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "#fff",
    padding: "20px 40px",
    borderBottom: "1px solid #ddd",
  },

  logo: {
    margin: 0,
    color: "#007bff",
  },

  container: {
    display: "flex",
    gap: "20px",
    padding: "20px 40px",
  },

  sidebar: {
    width: "300px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    height: "fit-content",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  filterGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px",
    marginTop: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  main: {
    flex: 1,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
  },

  profile: {
    margin: 0,
    fontSize: "22px",
  },

  company: {
    color: "#666",
    marginTop: "6px",
  },

  remoteBadge: {
    background: "#e8f1ff",
    color: "#007bff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  cardBody: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  label: {
    color: "#777",
    marginBottom: "5px",
    fontSize: "14px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },

  button: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};






// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
