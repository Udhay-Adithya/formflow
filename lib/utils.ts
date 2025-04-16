import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return uuidv4();
}

export function getAuthToken() {
  // Retrieve your authentication token from wherever it's stored
  return localStorage.getItem('token')
}