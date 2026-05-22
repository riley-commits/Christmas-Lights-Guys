import type { Customer } from "@/lib/types";

export const customers: Customer[] = [
  {
    id: "cust-roberts",
    name: "Daniel & Lisa Roberts",
    phone: "204-555-0102",
    email: "roberts.dl@gmail.com",
    address: {
      street: "812 Oakenwald Ave",
      city: "Winnipeg",
      postalCode: "R3T 1L6",
      coords: [-97.1488, 49.8351],
    },
    lastYear: {
      season: "2025",
      packageType: "Classic Warm White",
      sqft: 2400,
      notes: "Two-story Tudor. Power runs from west garage outlet — extension cord on hand. Last year used 8 strands.",
      priceCharged: 1820,
    },
  },
  {
    id: "cust-tremblay",
    name: "Marie Tremblay",
    phone: "204-555-0117",
    email: "marie.tremblay@outlook.com",
    address: {
      street: "245 Lyndale Dr",
      city: "Winnipeg",
      postalCode: "R2H 1A7",
      coords: [-97.1206, 49.8801],
    },
    lastYear: {
      season: "2025",
      packageType: "Multicolor Pro",
      sqft: 1800,
      notes: "River-facing house. Two large spruces in front. Customer prefers cool whites on roof, multicolor on trees.",
      priceCharged: 1450,
    },
  },
  {
    id: "cust-okafor",
    name: "Chinedu & Amaka Okafor",
    phone: "204-555-0136",
    email: "okafors@protonmail.com",
    address: {
      street: "1129 Wellington Cres",
      city: "Winnipeg",
      postalCode: "R3N 0A8",
      coords: [-97.1841, 49.8632],
    },
  },
  {
    id: "cust-friesen",
    name: "Henry Friesen",
    phone: "204-555-0148",
    email: "h.friesen@shaw.ca",
    address: {
      street: "62 Westridge Ave",
      city: "Winnipeg",
      postalCode: "R3R 0M1",
      coords: [-97.2667, 49.8542],
    },
    lastYear: {
      season: "2025",
      packageType: "C9 Premium",
      sqft: 3100,
      notes: "Bungalow with large peak over garage. Use C9s on roofline, mini-lights on shrubs. Customer is meticulous — leave a copy of the install map.",
      priceCharged: 2350,
    },
  },
  {
    id: "cust-nguyen",
    name: "Linh Nguyen",
    phone: "204-555-0155",
    email: "linh.nguyen@gmail.com",
    address: {
      street: "433 Aldine St",
      city: "Winnipeg",
      postalCode: "R3J 2K8",
      coords: [-97.2541, 49.8804],
    },
  },
  {
    id: "cust-wilson",
    name: "Jeremy & Kate Wilson",
    phone: "204-555-0164",
    email: "kate.wilson@hey.com",
    address: {
      street: "1502 St. Mary's Rd",
      city: "Winnipeg",
      postalCode: "R2M 3W6",
      coords: [-97.1126, 49.8278],
    },
    lastYear: {
      season: "2025",
      packageType: "Classic Warm White",
      sqft: 2050,
      notes: "Corner lot in St. Vital. Two front trees + roofline. Avoid east-side bedroom window — child sleeps early.",
      priceCharged: 1640,
    },
  },
  {
    id: "cust-armstrong",
    name: "Patrick Armstrong",
    phone: "204-555-0179",
    email: "patrick.a@mts.net",
    address: {
      street: "318 Park Blvd",
      city: "Winnipeg",
      postalCode: "R3P 0H4",
      coords: [-97.2356, 49.8517],
    },
  },
  {
    id: "cust-vanwell",
    name: "Greta Van Wel",
    phone: "204-555-0188",
    email: "g.vanwel@gmail.com",
    address: {
      street: "55 Niagara St",
      city: "Winnipeg",
      postalCode: "R3N 0V1",
      coords: [-97.1949, 49.8638],
    },
    lastYear: {
      season: "2025",
      packageType: "Multicolor Pro",
      sqft: 1600,
      notes: "Bungalow. Wreath on front door, lights on porch railing, tree-wrap on the big maple. Customer wants extra greenery garland this year.",
      priceCharged: 1280,
    },
  },
  {
    id: "cust-singh",
    name: "Harjeet Singh",
    phone: "204-555-0196",
    email: "h.singh@gmail.com",
    address: {
      street: "905 Tuxedo Ave",
      city: "Winnipeg",
      postalCode: "R3N 1A4",
      coords: [-97.2122, 49.8638],
    },
  },
  {
    id: "cust-davies",
    name: "Beth & Owen Davies",
    phone: "204-555-0211",
    email: "davies.bo@gmail.com",
    address: {
      street: "47 Lawndale Ave",
      city: "Winnipeg",
      postalCode: "R2H 1K2",
      coords: [-97.1182, 49.8842],
    },
  },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
