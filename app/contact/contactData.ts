export type Office = {
  id: string;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  placeholder?: boolean;
};

export const CONTACT_EMAIL = "info@tractrac.co";
export const CONTACT_PHONE = "07019898493";

export const OFFICES: Office[] = [
  {
    id: "abuja",
    name: "Abuja Office",
    address: "11 Vanern Crescent, Wuse, FCT 904101, Federal Capital Territory",
    position: { lat: 9.081999, lng: 7.48 },
  },
  {
    id: "nasarawa",
    name: "Nasarawa Office",
    address: "Coming soon",
    position: { lat: 8.4926, lng: 8.515 },
    placeholder: true,
  },
];
