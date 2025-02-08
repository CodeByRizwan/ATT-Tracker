"use client";
import { useState, useEffect } from "react";
import AttendanceCalendar from "@/components/calendar.jsx";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HomePage = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({ full: 0, half: 0, absent: 0 });
  const [user, setUser] = useState(null)
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, { method: 'POST', credentials: 'include' });
    if (response.ok) {
      alert('Logged out successfully')
      router.push('/login')
    }
    return
  };

  const fetchAttendance = async (date) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/${user._id}/all?date=${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setAttendanceData(data.attendanceData);
      calculateSummary(data.attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.authenticated == true) {
        setAuthStatus(true);
        setUser(result.user)
      } else {
        setAuthStatus(false);
      }
    } catch (err) {
      console.error("Error checking authentication:", err);
      setAuthStatus(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authStatus === false) {
      router.push("/login");
    }
  }, [authStatus, router]);

  const calculateSummary = (data) => {
    const summaryCount = { full: 0, half: 0, absent: 0 };
    data.forEach((entry) => {
      summaryCount[entry.status]++;
    });
    setSummary(summaryCount);
  };

  const handleDateClick = async (date) => {
    const statusInput = prompt("Enter status: full / half / absent");
    if (!["full", "half", "absent"].includes(statusInput)) {
      return alert("Invalid status!");
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: format(date, "yyyy-MM-dd"), status: statusInput }),
      });
      const data = await response.json();
      await fetchAttendance(format(date, "yyyy-MM-dd"));
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  useEffect(() => {
    if (user !== null) {
      const today = format(new Date(), "yyyy-MM-dd");
      fetchAttendance(today);
    }
  }, [user]);
  
  if (authStatus === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-teal-900 text-xl">Checking authentication...</p>
      </div>
    );
  }

  if (authStatus == false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ATT-Tracker</h2>
          <p className="text-gray-600 mb-6">Sign in to track your attendance efficiently.</p>
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:text-2xl">
        Hello, {user !== null && user.name ? user.name : "some random name"}!
      </h1>
      <AttendanceCalendar
        attendanceFetcher={fetchAttendance}
        onDateClick={handleDateClick}
        attendanceRecords={attendanceData}
      />
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-600">Summary</h2>
        <div className="flex justify-between text-sm sm:text-base">
          <div className="text-green-500 font-bold">Full: {summary.full}</div>
          <div className="text-yellow-500 font-bold">Half: {summary.half}</div>
          <div className="text-red-500 font-bold">Absent: {summary.absent}</div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
