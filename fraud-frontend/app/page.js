"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import * as THREE from "three";

const API_URL = "http://127.0.0.1:8000/predict";
const CATEGORY_OPTIONS = [
  "shopping_pos",
  "food_pos",
  "restaur_pos",
  "gas_transport",
  "grocery_pos",
  "health_fitness",
  "entertainment",
  "electronics",
];
const GENDER_OPTIONS = ["M", "F", "O"];
const STATE_OPTIONS = ["NY", "CA", "TX", "FL", "WA", "IL", "NJ", "PA"];
const DAY_OPTIONS = [
  { value: "0", label: "0 - Sunday" },
  { value: "1", label: "1 - Monday" },
  { value: "2", label: "2 - Tuesday" },
  { value: "3", label: "3 - Wednesday" },
  { value: "4", label: "4 - Thursday" },
  { value: "5", label: "5 - Friday" },
  { value: "6", label: "6 - Saturday" },
];

function formatTimestamp(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function Home() {
  const [form, setForm] = useState({
    amt: "",
    city_pop: "",
    trans_hour: "",
    trans_day_of_week: "",
    time_diff: "",
    distance_km: "",
    category: CATEGORY_OPTIONS[0],
    gender: GENDER_OPTIONS[0],
    state: STATE_OPTIONS[0],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const bgRef = useRef(null);
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const donutRef = useRef(null);
  const lineRef = useRef(null);
  const donutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("fraudHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!donutChartRef.current || !lineChartRef.current) {
      return;
    }
    const fraudCount = history.filter((item) => item.result === "Fraud").length;
    const safeCount = history.length - fraudCount;
    donutChartRef.current.data.datasets[0].data = [safeCount, fraudCount];
    donutChartRef.current.update();

    const recent = [...history].slice(-8);
    lineChartRef.current.data.labels = recent.map((item) => item.timestamp);
    lineChartRef.current.data.datasets[0].data = recent.map((item) => item.amt);
    lineChartRef.current.update();
  }, [history]);

  useEffect(() => {
    const timer = toast.message
      ? window.setTimeout(() => setToast({ message: "", type: "" }), 3600)
      : null;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    if (!donutRef.current || !lineRef.current) {
      return;
    }

    const fraudCount = history.filter((item) => item.result === "Fraud").length;
    const safeCount = history.length - fraudCount;

    donutChartRef.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: ["Safe", "Fraud"],
        datasets: [
          {
            data: [safeCount, fraudCount],
            backgroundColor: ["#38bdf8", "#fb7185"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#cbd5e1" },
          },
        },
      },
    });

    lineChartRef.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: [...history].slice(-8).map((item) => item.timestamp),
        datasets: [
          {
            label: "Recent Transaction Amount",
            data: [...history].slice(-8).map((item) => item.amt),
            borderColor: "#a855f7",
            backgroundColor: "rgba(168,85,247,0.22)",
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: "#38bdf8",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "rgba(148,163,184,0.12)" },
          },
          y: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "rgba(148,163,184,0.12)" },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }, [history]);

  useEffect(() => {
    if (!bgRef.current) return;

    const canvas = bgRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particles = new THREE.BufferGeometry();
    const count = 220;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
    });
    const pointCloud = new THREE.Points(particles, pointsMaterial);
    scene.add(pointCloud);

    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.94,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x2b6cb0,
      emissiveIntensity: 0.4,
    });
    const card = new THREE.Mesh(new THREE.BoxGeometry(12, 7.2, 0.35), cardMaterial);
    card.rotation.x = Math.PI * 0.08;
    card.rotation.y = Math.PI * 0.15;
    card.position.set(-1.5, 0.75, -1);
    scene.add(card);

    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x93c5fd, linewidth: 1, opacity: 0.45, transparent: true });
    const ringGeometry = new THREE.RingGeometry(6.2, 6.4, 64);
    const ring = new THREE.LineLoop(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.5;
    ring.position.set(0, 0, -2);
    scene.add(ring);

    const lightA = new THREE.PointLight(0x60a5fa, 1.2, 80);
    lightA.position.set(12, 10, 8);
    scene.add(lightA);
    const lightB = new THREE.PointLight(0x22c55e, 0.75, 60);
    lightB.position.set(-12, -9, 12);
    scene.add(lightB);

    let frameId;
    const animate = () => {
      pointCloud.rotation.y += 0.0009;
      card.rotation.y += 0.0025;
      ring.rotation.z += 0.0018;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const handlePointer = (event) => {
      const { clientX, clientY } = event;
      cursor.style.transform = `translate3d(${clientX - 10}px, ${clientY - 10}px, 0)`;
      trail.style.transform = `translate3d(${clientX - 24}px, ${clientY - 24}px, 0)`;
    };

    document.addEventListener("pointermove", handlePointer);
    return () => document.removeEventListener("pointermove", handlePointer);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amt: Number(form.amt),
          city_pop: Number(form.city_pop),
          trans_hour: Number(form.trans_hour),
          trans_day_of_week: Number(form.trans_day_of_week),
          time_diff: Number(form.time_diff),
          distance_km: Number(form.distance_km),
          category: form.category,
          gender: form.gender,
          state: form.state,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend is unavailable. Please start the API server.");
      }

      const data = await response.json();
      const status = data.fraud ? "Fraud" : "Not Fraud";
      const item = {
        timestamp: formatTimestamp(new Date()),
        amt: Number(form.amt),
        city_pop: Number(form.city_pop),
        trans_hour: Number(form.trans_hour),
        trans_day_of_week: Number(form.trans_day_of_week),
        time_diff: Number(form.time_diff),
        distance_km: Number(form.distance_km),
        category: form.category,
        gender: form.gender,
        state: form.state,
        result: status,
        score: data.score?.toFixed(1) ?? "N/A",
      };

      const nextHistory = [item, ...history].slice(0, 18);
      setHistory(nextHistory);
      setResult(data);
      showToast(`Prediction complete: ${status}`, data.fraud ? "error" : "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fraudCount = history.filter((item) => item.result === "Fraud").length;
  const totalTransactions = history.length;
  const averageAmount =
    history.length === 0
      ? 0
      : history.reduce((sum, item) => sum + item.amt, 0) / history.length;

  return (
    <main className="page">
      <canvas ref={bgRef} className="hero-canvas" aria-hidden="true" />
      <div className="gradient-overlay" />
      <div className="custom-cursor" ref={cursorRef} />
      <div className="cursor-trail" ref={trailRef} />
      <div className="page-frame">
        <header className="site-header">
          <div className="brand-panel">
            <span className="brand-mark" />
            <div>
              <p className="eyebrow">Credit Card Fraud Detection</p>
              <h1 className="brand-title">AI Fraud Detection System</h1>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#hero">Home</a>
            <a href="#prediction">Predict</a>
            <a href="#history">History</a>
            <a href="#dashboard">Dashboard</a>
          </nav>
        </header>

        {toast.message ? (
          <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
            {toast.message}
          </div>
        ) : null}

        <section className="hero-section" id="hero">
          <div className="hero-copy">
            <p className="eyebrow">Real-time classification, secure transactions</p>
            <h2>Protect every payment with predictive fraud intelligence.</h2>
            <p className="hero-text">
              Transparent fraud detection for credit card transactions, with instant scoring, predictive history, and visual dashboards.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => document.getElementById("prediction")?.scrollIntoView({ behavior: "smooth" })}>
                Start Detection
              </button>
              <a className="btn-secondary" href="#dashboard">
                View Dashboard
              </a>
            </div>
          </div>

          <div className="hero-panel glass-panel">
            <div className="panel-header">
              <span className="panel-dot red" />
              <span className="panel-dot yellow" />
              <span className="panel-dot green" />
            </div>
            <div className="panel-card">
              <div className="panel-card__row">
                <p>Transaction risk</p>
                <span className="badge">Live</span>
              </div>
              <h3>AI score: 92%</h3>
              <div className="panel-metrics">
                <div>
                  <strong>25ms</strong>
                  <span>Response latency</span>
                </div>
                <div>
                  <strong>4.3k</strong>
                  <span>Transactions analyzed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block" id="prediction">
          <div className="section-header">
            <p className="eyebrow">Prediction Engine</p>
            <h2>Input transaction details to detect fraud.</h2>
          </div>

          <div className="section-grid">
            <div className="glass-panel form-panel">
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="field">
                  <label>Amount</label>
                  <input name="amt" value={form.amt} onChange={handleChange} placeholder="e.g. 2499" required />
                </div>
                <div className="field">
                  <label>City Population</label>
                  <input name="city_pop" value={form.city_pop} onChange={handleChange} placeholder="e.g. 58000" required />
                </div>
                <div className="field">
                  <label>Transaction Hour</label>
                  <input name="trans_hour" value={form.trans_hour} onChange={handleChange} placeholder="0–23" required />
                </div>
                <div className="field">
                  <label>Day of Week</label>
                  <select name="trans_day_of_week" value={form.trans_day_of_week} onChange={handleChange} required>
                    <option value="">Select day</option>
                    {DAY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Time Difference</label>
                  <input name="time_diff" value={form.time_diff} onChange={handleChange} placeholder="seconds since last transaction" required />
                </div>
                <div className="field">
                  <label>Distance (km)</label>
                  <input name="distance_km" value={form.distance_km} onChange={handleChange} placeholder="e.g. 12.5" required />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} required>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>State</label>
                  <select name="state" value={form.state} onChange={handleChange} required>
                    {STATE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-footer">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <span className="spinner" /> : "Predict"}
                  </button>
                  <span className="hint">All fields are sent securely to the backend for analysis.</span>
                </div>

                {error ? <div className="alert alert-error">{error}</div> : null}
              </form>
            </div>

            <div className="glass-panel result-panel">
              <div className="result-card">
                <p className="eyebrow">Prediction result</p>
                <h3>{result ? (result.fraud ? "Fraudulent Transaction" : "Transaction Looks Safe") : "Awaiting input"}</h3>
                <p className="result-copy">
                  {result
                    ? result.fraud
                      ? "The system detected suspicious behavior. Review the displayed risk score and transaction details."
                      : "This transaction appears normal. Keep monitoring and stay protected."
                    : "Submit a transaction above to get a fraud prediction in real time."}
                </p>
                <div className="result-badge-row">
                  <span className={result ? `status-badge ${result.fraud ? "danger" : "safe"}` : "status-badge muted"}>
                    {result ? (result.fraud ? "Fraud" : "Not Fraud") : "No output"}
                  </span>
                  {result ? <span className="score-card">Risk score: {result.score?.toFixed(1)}%</span> : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block" id="history">
          <div className="section-header">
            <p className="eyebrow">History</p>
            <h2>Past predictions saved locally.</h2>
          </div>

          <div className="glass-panel history-panel">
            <div className="history-header">
              <div>
                <span className="history-count">{totalTransactions}</span>
                <p>Total saved transactions</p>
              </div>
              <button className="btn-tertiary" onClick={() => setHistory([])}>
                Clear history
              </button>
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                <p>No saved transactions yet. Make a prediction to start building history.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>State</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={`${item.timestamp}-${index}`}>
                        <td>{item.timestamp}</td>
                        <td>${item.amt.toFixed(2)}</td>
                        <td>{item.category}</td>
                        <td>{item.state}</td>
                        <td>
                          <span className={`history-status ${item.result === "Fraud" ? "danger" : "safe"}`}>
                            {item.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="section-block" id="dashboard">
          <div className="section-header">
            <p className="eyebrow">Dashboard</p>
            <h2>Transaction insights and fraud distribution.</h2>
          </div>

          <div className="dashboard-grid">
            <div className="glass-panel metrics-panel">
              <div className="metric-card">
                <p>Total transactions</p>
                <strong>{totalTransactions}</strong>
              </div>
              <div className="metric-card">
                <p>Fraud cases</p>
                <strong>{fraudCount}</strong>
              </div>
              <div className="metric-card">
                <p>Average amount</p>
                <strong>${averageAmount.toFixed(2)}</strong>
              </div>
            </div>

            <div className="glass-panel chart-panel">
              <div className="chart-header">
                <h3>Fraud vs Non-fraud</h3>
              </div>
              <div className="chart-wrap">
                <canvas ref={donutRef} />
              </div>
            </div>

            <div className="glass-panel chart-panel chart-wide">
              <div className="chart-header">
                <h3>Recent transaction amounts</h3>
              </div>
              <div className="chart-wrap chart-line">
                <canvas ref={lineRef} />
              </div>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div>
            <p className="footer-title">AI Fraud Detection System</p>
            <p className="footer-copy">Designed for secure credit card monitoring, real-time alerts, and interactive analytics.</p>
          </div>
          <div className="footer-meta">
            <span>Built with Next.js, Three.js, Chart.js, and FastAPI</span>
            <span>API: http://127.0.0.1:8000/predict</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
