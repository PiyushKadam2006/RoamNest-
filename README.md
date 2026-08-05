# 🧭 RoamNest

> A full-stack Airbnb-inspired property listing platform — built with Node.js, Express, MongoDB, and EJS.

![Node.js](https://img.shields.io/badge/Node.js-24.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-blue?logo=cloudinary)
![Render](https://img.shields.io/badge/Deployed-Render-purple?logo=render)

---

## 🌐 Live Demo

🔗 **[roamnest.onrender.com](https://wandernest-77yo.onrender.com)** (https://wandernest-77yo.onrender.com/listings)

---


> 

---

## ✨ Features

- 🔐 **User Authentication** — Signup, login, logout using Passport.js with secure password hashing
- 🏠 **Listings CRUD** — Create, view, edit, and delete property listings
- 🖼️ **Cloud Image Uploads** — Images stored on Cloudinary via Multer
- ⭐ **Reviews & Star Ratings** — Logged-in users can leave and delete reviews
- 🛡️ **Authorization** — Only listing owners can edit/delete their listings; only review authors can delete their reviews
- 🔍 **Search** — Search listings by title, location, country, or description
- 🏷️ **Category Filters** — Filter by Trending, Hotels, Mountains, Beaches, Castles, and more
- 💾 **Persistent Sessions** — Sessions stored in MongoDB via connect-mongo
- ⚡ **Flash Messages** — Success and error feedback on every action
- 🗺️ **RESTful Routing** — Clean URL structure following REST conventions
- ✅ **Dual Validation** — Joi server-side + HTML5 client-side validation
- 🚨 **Custom Error Pages** — Branded 404, 403, and 500 error pages
- 📱 **Responsive UI** — Bootstrap 5 with mobile-friendly design

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Templating | EJS + EJS-Mate (layouts) |
| Authentication | Passport.js + passport-local-mongoose |
| Sessions | express-session + connect-mongo |
| Image Storage | Cloudinary + Multer |
| Validation | Joi + HTML5 |
| Styling | Bootstrap 5 + Custom CSS |
| Deployment | Render (backend) + MongoDB Atlas (DB) |

---

## 📁 Project Structure

```
RoamNest/
├── controllers/
│   ├── listings.js       # Listing logic (CRUD + search + filter)
│   ├── reviews.js        # Review create & delete
│   └── users.js          # Signup, login, logout
├── models/
│   ├── listing.js        # Listing schema (with cascade delete)
│   ├── review.js         # Review schema
│   └── user.js           # User schema (passport-local-mongoose)
├── routes/
│   ├── listing.js        # /listings routes
│   ├── review.js         # /listings/:id/reviews routes
│   └── user.js           # /signup /login /logout routes
├── views/
│   ├── layouts/          # boilerplate.ejs (base layout)
│   ├── includes/         # nav, footer, flash partials
│   ├── listings/         # index, show, new, edit templates
│   └── users/            # login, signup templates
├── public/
│   ├── css/              # style.css, rating.css
│   └── js/               # script.js (Bootstrap validation)
├── utils/
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async error wrapper
├── init/
│   ├── data.js           # Sample listings seed data
│   └── index.js          # DB seeder script
├── cloudConfig.js        # Cloudinary + Multer storage config
├── middleware.js         # isLoggedIn, isOwner, validateListing etc.
├── schema.js             # Joi validation schemas
└── app.js                # Entry point — server setup
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/PiyushKadam2006/RoamNest-.git
cd RoamNest-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DB_URL=mongodb://localhost:27017/wanderlust
SECRET=your_session_secret_here
CLOUDE_NAME=your_cloudinary_cloud_name
CLOUDE_API_KEY=your_cloudinary_api_key
CLOUDE_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the database *

```bash
node init/index.js
```

### 5. Start the server

```bash
node app.js
```

Visit **http://localhost:8080/listings** 🎉

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | MongoDB connection string (Atlas or local) |
| `SECRET` | Session secret key |
| `CLOUDE_NAME` | Cloudinary cloud name |
| `CLOUDE_API_KEY` | Cloudinary API key |
| `CLOUDE_API_SECRET` | Cloudinary API secret |

> ⚠️ Never commit your `.env` file — it's listed in `.gitignore`

---

## 🔄 RESTful Routes

### Listings

| Method | Route | Description |
|---|---|---|
| GET | `/listings` | Show all listings (supports `?search=` and `?category=`) |
| GET | `/listings/new` | Show create form |
| POST | `/listings` | Create new listing |
| GET | `/listings/:id` | Show single listing |
| GET | `/listings/:id/edit` | Show edit form |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |

### Reviews

| Method | Route | Description |
|---|---|---|
| POST | `/listings/:id/reviews` | Create review |
| DELETE | `/listings/:id/reviews/:review_id` | Delete review |

### Users

| Method | Route | Description |
|---|---|---|
| GET/POST | `/signup` | Register |
| GET/POST | `/login` | Login |
| GET | `/logout` | Logout |

---

## 🧠 Key Implementation Details

### Cascade Delete
When a listing is deleted, all its associated reviews are automatically deleted using a Mongoose `post('findOneAndDelete')` middleware.

### Authorization Layers
- `isLoggedIn` — blocks unauthenticated access
- `isOwner` — blocks non-owners from editing/deleting listings
- `isReviewAuthor` — blocks non-authors from deleting reviews

### Session Persistence
Sessions are stored in MongoDB using `connect-mongo` so they survive server restarts and work correctly on Render.

### Image Handling
Multer intercepts file uploads and streams them directly to Cloudinary via `multer-storage-cloudinary`. The returned URL is saved to MongoDB. On edit, if no new image is uploaded, the existing image is preserved.

---

## 🌍 Deployment

This project is deployed on **Render** with **MongoDB Atlas**.

To deploy your own:
1. Push code to GitHub
2. Create a new Web Service on Render
3. Set all environment variables in Render dashboard
4. Allow all IPs (`0.0.0.0/0`) in MongoDB Atlas Network Access
5. Deploy 🚀

---

## 👨‍💻 Author

**Piyush Kadam**
- GitHub: [@PiyushKadam2006](https://github.com/PiyushKadam2006)

---

---

*Built with ❤️ as a learning project to master full-stack web development with the MERN stack (without React).*
