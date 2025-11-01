import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FiTrendingUp, FiUsers, FiBookOpen, FiStar } from "react-icons/fi";
import { authAPI, sessionsAPI } from "../utils/api";
function Dashboard() {
  const [userName, setUserName] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    mode: "Learning",
    topic: "",
    fromWhom: "",
    date: "",
    time: "",
    durationMinutes: "60",
  });
  useEffect(() => {
    const load = async () => {
      try {
        const me = await authAPI.getProfile();
        const name = me?.name || me?.username || "";
        setUserName(name);
      } catch (_) {
        setUserName("");
      }
    };
    load();
  }, []);
  useEffect(() => {
    const loadSessions = async () => {
      setLoadingSessions(true);
      setError("");
      try {
        const list = await sessionsAPI.list();
        setSessions(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e?.message || "Failed to load sessions");
      } finally {
        setLoadingSessions(false);
      }
    };
    loadSessions();
  }, []);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    try {
      if (!form.date || !form.time) throw new Error("Please select date and time");
      const startAt = new Date(`${form.date}T${form.time}:00`);
      await sessionsAPI.create({
        mode: form.mode,
        topic: form.topic,
        fromWhom: form.fromWhom,
        startAt: startAt.toISOString(),
        durationMinutes: Number(form.durationMinutes || 60),
      });
      const list = await sessionsAPI.list();
      setSessions(Array.isArray(list) ? list : []);
      closeModal();
      setForm({ mode: "Learning", topic: "", fromWhom: "", date: "", time: "", durationMinutes: "60" });
    } catch (e2) {
      setError(e2?.message || "Failed to create session");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-gray-800">{userName || "there"}!</span>
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your skill exchanges
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-orange-500 text-white rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <p className="text-sm">Available Credits</p>
            <h2 className="text-3xl font-bold mt-2">
              <CountUp end={85} duration={2} />
            </h2>
          </div>
          <FiTrendingUp className="text-2xl mt-4" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4">
          <FiUsers className="text-2xl text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <h2 className="text-3xl font-bold text-gray-900">
              <CountUp end={47} duration={2} />
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4">
          <FiBookOpen className="text-2xl text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Skills Teaching</p>
            <h2 className="text-3xl font-bold text-gray-900">
              <CountUp end={2} duration={2} />
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4">
          <FiStar className="text-2xl text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <h2 className="text-3xl font-bold text-gray-900">
              <CountUp end={4.9} decimals={1} duration={2} />
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
            {loadingSessions && (
              <div className="text-sm text-gray-500">Loading sessions…</div>
            )}
            {!loadingSessions && sessions.length === 0 && (
              <div className="text-sm text-gray-400">No sessions yet. Create one below.</div>
            )}
            {sessions.map((s) => {
              const d = new Date(s.startAt);
              const dateStr = d.toLocaleDateString();
              const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const isLearning = s.mode === "Learning";
              const badge = isLearning ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600";
              return (
                <div
                  key={s._id}
                  className="flex justify-between items-center border rounded-lg p-4 hover:shadow transition"
                >
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
                      {s.mode}
                    </span>
                    <h4 className="font-bold mt-1">{s.topic}</h4>
                    <p className="text-sm text-gray-500">from {s.fromWhom}</p>
                    <p className="text-sm text-gray-400">
                      {dateStr} • {timeStr} • {Math.max(1, Number(s.durationMinutes))}m
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                    View
                  </button>
                </div>
              );
            })}
            <button
              onClick={openModal}
              className="w-full text-center border-dashed border rounded-lg p-4 text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
            >
              Schedule New Session
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                title: "Completed session",
                detail: "Adobe Lightroom",
                time: "2 hours ago",
                value: "+20",
                color: "text-green-500",
              },
              {
                title: "Received 5-star review",
                detail: "Photography Basics",
                time: "1 day ago",
                value: "",
              },
              {
                title: "Learned from",
                detail: "Guitar Playing",
                time: "3 days ago",
                value: "-25",
                color: "text-red-500",
              },
              {
                title: "New student booked",
                detail: "Photography Basics",
                time: "1 week ago",
                value: "",
              },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.detail}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                {activity.value && (
                  <span className={`font-bold ${activity.color}`}>
                    {activity.value}
                  </span>
                )}
              </div>
            ))}
            <div className="text-center text-sm text-orange-500 cursor-pointer">
              View All Activity
            </div>
          </div>
        </div>
      </div>
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold">Schedule New Session</h4>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option>Learning</option>
                <option>Teaching</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Topic</label>
              <input
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g., React Basics"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">From whom</label>
              <input
                name="fromWhom"
                value={form.fromWhom}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g., Alex Chen"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="durationMinutes"
                min="1"
                max="1440"
                value={form.durationMinutes}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 border rounded-lg p-2 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600">Save</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
export default Dashboard;
