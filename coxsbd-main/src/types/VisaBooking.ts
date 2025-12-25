import { VisaFromCountry } from "./VisaFromCountry";
import { VisaToCountry } from "./VisaToCountry";

export enum VisaStatus {
  WAITING = "WAITING",
  PROGRESS = "PROGRESS",
  DONE = "DONE",
}

export interface VisaBooking {
  id: string;
  status: VisaStatus;
  fromCountryId: string;
  toCountryId: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  days: number;
  entryType: string;
  visaType: string;
  createdAt?: string;
  updatedAt?: string;
  fromCountry?: VisaFromCountry;
  toCountry?: VisaToCountry;
  [key: string]: any;
}

export interface VisaBookingsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface VisaBookingsResult {
  visaBookings: VisaBooking[];
  meta: VisaBookingsMeta;
}

export interface VisaBookingPayload {
  status?: VisaStatus;
  fromCountryId: string;
  toCountryId: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  days: number;
  entryType: string;
  visaType: string;
  [key: string]: any;
}

export interface VisaBookingFilters {
  status?: VisaStatus;
  fromCountryId?: string;
  toCountryId?: string;
  email?: string;
  phone?: string;
  date?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
