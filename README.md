# 🚀 DriveX – BunnyCDN Image Uploader with Next.js 15

This project is a full-stack file uploader built using **Next.js 15 (App Router)** that allows users to upload multiple images to **BunnyCDN** via a custom backend API.

### ✨ Features

* 🔼 Upload multiple image files at once
* 🖼 Preview selected images before upload
* 📦 Stream files from disk to BunnyCDN storage via Axios
* 🌐 Get public BunnyCDN URLs after successful upload
* 📂 Temporary files stored in `/tmp` (ignored in Git)
* 📁 Built with App Router (`/app/api/upload/route.ts`)
* 🔒 Secure upload using BunnyCDN AccessKey via `.env`

---

## 💠 Tech Stack

* **Frontend**: React + TailwindCSS + Axios + Lucide Icons
* **Backend**: Next.js App Router API routes
* **Upload Parser**: `formidable` for multipart/form-data
* **CDN**: BunnyCDN storage zone

---

## 📂 Project Structure

```
/app
  /api
    /upload
      route.ts        # API route for uploading files to BunnyCDN

/components
  UploadFile.tsx      # UI component for file selection, preview, and upload

/tmp                  # Temporary local file uploads (git ignored)
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/geekymayur/nextjs-bunnycdn-file-upload
cd nextjs-bunnycdn-file-upload
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` and add:

```env
BUNNY_ACCESS_KEY=your_bunnycdn_storage_key
```

Make sure your BunnyCDN storage zone and pull zone are set up properly.

### 4. Run the development server

```bash
npm run dev
```

---

## ✅ Usage

1. Select multiple images using the UI
2. Click **Upload Files**
3. Uploaded image URLs from BunnyCDN will be shown below

---

## 📁 File Upload Notes

* Files are uploaded to:
  `https://<your-pull-zone>.b-cdn.net/test/<filename>`

* Uploaded using:
  `PUT https://storage.bunnycdn.com/<zone>/test/<filename>`

* All temporary files are saved in `/tmp` (ignored via `.gitignore`)

---

## 🔒 Security Tips

* Never expose `BUNNY_ACCESS_KEY` on frontend
* Use folder names (`test/`, `uploads/`, etc.) to organize uploads
* Consider adding size/type limits for files

---

## 📸 UI Snapshot

> Upload form built with TailwindCSS and Lucide icons
> Multi-file preview + CDN link listing

---

## 🤝 Credits

Built with ❤️ by Mayur Sharma
Powered by [Next.js](https://nextjs.org) + [BunnyCDN](https://bunny.net)

---

## 📄 License

MIT
