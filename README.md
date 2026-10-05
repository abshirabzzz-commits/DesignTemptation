# DESIGN TEMPTATION — Interiors & Architecture

An architectural and interior curation studio platform conceived with Next.js frontend and Django REST framework backend.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript
- **Backend**: Django 6.0, Django REST Framework, PostgreSQL / SQLite
- **Features**:
  - Architectural project showcase and case studies
  - Curated product catalog & bespoke furniture
  - Interactive project cost estimation calculator
  - Direct enquiry & brief submission flow with multi-part image uploads
  - Secure Django administration dashboard

## Getting Started

### 1. Frontend (Next.js)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend (Django)
```bash
cd backend
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```
API endpoints available at `http://127.0.0.1:8000/api/` and Admin at `http://127.0.0.1:8000/admin/`.

## Production Build
```bash
npm run build
```
