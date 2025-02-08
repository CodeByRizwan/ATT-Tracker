"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";

const AttendanceCalendar = ({ attendanceFetcher, onDateClick, attendanceRecords }) => {
  const [currentMonthYear, setCurrentMonthYear] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    const map = {};
    attendanceRecords.forEach((entry) => {
      map[entry.date] = entry.status;
    });
    setAttendanceMap(map);
  }, [attendanceRecords]);
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    const newMonthYear = format(activeStartDate, "yyyy-MM");
    setCurrentMonthYear(newMonthYear);
    attendanceFetcher(format(activeStartDate, "yyyy-MM-dd"));
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg">
      <Calendar
        showNeighboringMonth={false}
        onClickDay={onDateClick}
        onActiveStartDateChange={handleActiveStartDateChange}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const formattedDate = format(date, "yyyy-MM-dd");

            if (attendanceMap[formattedDate] == "full") {
              return "!bg-green-500 text-white";
            }
            else if (attendanceMap[formattedDate] == "half") {
              return "!bg-yellow-500 text-black";
            }
            else if (attendanceMap[formattedDate] == "absent") {
              return "!bg-red-500 text-white";
            }
          }
          return "";
        }}
        className="w-full bg-white rounded-lg shadow text-sm sm:text-base"
      />
    </div>
  );
};

export default AttendanceCalendar;
