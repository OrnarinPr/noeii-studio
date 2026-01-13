# NOEII Studio Website

NOEII Studio Website is a full-stack web application designed for an architecture and design studio to present, manage, and curate its works and products through a visually driven experience.

## Purpose

This project serves as:
- A public-facing portfolio website for architectural and design works
- An internal content management system for studio administrators
- A scalable foundation for long-term project and asset management

## Key Features

- Full-screen, visual-first homepage with scroll-based navigation
- Projects listing and detailed project pages
- Shop page for studio-designed products
- Admin mode for creating, editing, and deleting content
- Image upload system connected to the backend
- Clear separation between frontend and backend

## System Architecture

### Frontend
- React + TypeScript
- Vite build system
- Tailwind CSS
- React Query for data fetching
- Designed for desktop, tablet, and mobile screens

### Backend
- FastAPI (Python)
- REST API for projects, products, uploads, and admin authentication
- Static file serving for uploaded images

## Intended Use

- Architecture and interior design studios
- Creative studios requiring a self-managed portfolio
- Projects that may evolve into a custom CMS or studio platform

## Project Structure

- `frontend/` — User interface and client-side logic
- `backend/` — API, authentication, uploads, and data handling

---

This project is designed to be simple, extensible, and visually focused, prioritizing clarity, performance, and long-term maintainability.
