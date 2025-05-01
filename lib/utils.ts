import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string) {
  if (string.length === 0) return string; // Check if the string is empty
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatCedula(ci: string): string {
  // Remove any non-digit characters
  const digits = ci.replace(/\D/g, '');

  // Check if the input has exactly 8 digits
  if (digits.length !== 8) {
    return ci
  }

  // Format the string as 1.234.567-8
  return `${digits.slice(0, 1)}.${digits.slice(1, 4)}.${digits.slice(4, 7)}-${digits.slice(7)}`;
}