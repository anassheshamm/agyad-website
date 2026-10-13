# Project image uploads

The admin uploads JPG, PNG, or WebP files to `POST /api/uploads` as multipart form data in the `images` field. The endpoint requires the existing admin bearer token, accepts up to 10 files per request, and limits each file to 2 MB. Uploaded files are stored in `backend/uploads/` with generated names and served from `/uploads/<filename>`. Project documents save only the returned image URLs.

For local development, start the backend from `backend/` with `npm run dev` and the frontend from `frontend/` with `npm run dev`. Set `VITE_API_URL` to the deployed API's `/api` URL when building the frontend; the frontend uses that URL's origin to resolve uploaded image paths.

For Hostinger deployment, ensure the Node process can write to `backend/uploads/` and that the directory persists across releases, restarts, and redeployments. Keep the backend's `/uploads` static route reachable publicly (or configure the web server to serve the same persistent directory at `/uploads`). Back up this directory together with the MongoDB data. This repository does not configure Hostinger storage persistence, permissions, or reverse proxy rules, so confirm those settings in the deployed environment before relying on uploads.
