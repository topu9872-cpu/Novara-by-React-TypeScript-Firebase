export interface Address {
    id?:string | undefined
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: "Home" | "Work" | "Other";
  createdAt:number | Date
   uid?: string
  email?:string
  displayName?:string
}