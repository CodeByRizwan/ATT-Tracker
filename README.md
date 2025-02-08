# ATT-Tracker

ATT-Tracker is an attendance tracking web application that allows users to register, log in, and track their attendance.

## Features

- **User Authentication:** Register and log in with a username and password.
- **Attendance Tracking:** Mark attendance with different statuses (full, half, absent) for specific dates.
- **RESTful API:** Endpoints for user management and attendance tracking.
- **Security:** Uses Helmet for HTTP headers, CORS for cross-origin requests, and HTTP-only cookies for JWT storage.
- **Health Check:** Provides endpoints for checking the server health.

## Technologies Used

- **Backend:** Node.js, Express, Mongoose, JWT, Helmet, CORS, cookie-parser
- **Frontend:** Next.js, React, Tailwind CSS, react-calendar, date-fns
- **Database:** MongoDB
