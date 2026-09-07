# Product Search Automation — Auth Backend

A minimal Express + MongoDB (Mongoose) backend providing **register** and **login**
endpoints for the Product Search Automation frontend, using JWT for session tokens
and bcrypt for password hashing.

## Setup

```bash
cd backend
npm install
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The server reads its config from `.env` (already filled in with your MongoDB URI):

```
PORT=5000
MONGODB_URI="mongodb+srv://lahyavennapusa0104_db_user:****@cluster0.mrk0k3h.mongodb.net"
DB_NAME=product_search_automation
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

> ⚠️ Make sure your current IP address is added to your MongoDB Atlas cluster's
> Network Access allow-list, or the connection will fail with an
> "IP not whitelisted" error. In Atlas: **Network Access → Add IP Address**
> (use "Allow Access from Anywhere" for local dev/testing).

## Endpoints

| Method | Route              | Body                                              | Description                     |
|--------|--------------------|----------------------------------------------------|----------------------------------|
| POST   | `/api/auth/register` | `{ fullName, email, password, confirmPassword }` | Create a new account, returns `{ token, user }` |
| POST   | `/api/auth/login`    | `{ email, password }`                            | Log in, returns `{ token, user }` |
| GET    | `/api/auth/me`       | — (header `Authorization: Bearer <token>`)       | Returns the logged-in user       |
| GET    | `/api/health`        | —                                                 | Health check                     |

Passwords are hashed with bcrypt before being stored — the plain password is
never saved. Tokens are signed JWTs valid for `JWT_EXPIRES_IN` (default 7 days).

## Frontend wiring

The React frontend (`src/utils/api.js`) calls this backend at
`VITE_API_URL` (defaults to `http://localhost:5000/api`, set in the project's
root `.env`). The `Login` and `Register` pages (`src/Pages/Login.jsx`) now
submit to these endpoints and store the returned token/user in
`localStorage` (`token`, `user`) on success, then redirect to `/Home`.

To run everything locally:

```bash
# terminal 1
cd backend && npm run dev

# terminal 2 (project root)
npm install
npm run dev
```

## Notes / next steps

- CORS is restricted to `CLIENT_ORIGIN` in `.env` — update this if you deploy
  the frontend elsewhere.
- `/api/auth/me` is a protected example route — use the same `protect`
  middleware (`middleware/authMiddleware.js`) to guard any other backend
  routes you add later (wishlist, price alerts, etc.) tied to a user.
- For production, rotate `JWT_SECRET` to a value only you know, and never
  commit `.env` (it's already git-ignored).
