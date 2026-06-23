export type SubscriberStatus = "Active" | "Inactive" | "Unsubscribed";
export type Engagement = "High" | "Medium" | "Low";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: SubscriberStatus;
  joinedDate: string;
  engagement: Engagement;
}

// The visible table only ever shows recently-joined subscribers — a real list
// of 48k+ rows isn't rendered. This is the bulk of the base that sits behind it.
export const BASE_SUBSCRIBER_COUNT = 48200;
export const BASE_UNSUBSCRIBE_COUNT = 307;

export const PREVIOUS_PERIOD = {
  subscriberCount: 42930,
  openRate: 41.5,
  clickRate: 6.61,
  unsubscribes: 309,
};

const FIRST_NAMES = [
  "Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Mason",
  "Isabella", "Lucas", "Mia", "James", "Amelia", "Benjamin", "Harper",
  "Elijah", "Evelyn", "Logan", "Abigail", "Daniel", "Ella", "Henry",
  "Scarlett", "Jack", "Grace", "Owen", "Chloe", "Wyatt", "Lily", "Leo",
];

const LAST_NAMES = [
  "Carter", "Reyes", "Bennett", "Foster", "Hayes", "Brooks", "Morgan",
  "Price", "Sanders", "Coleman", "Ward", "Wells", "Fisher", "Powell",
  "Russell", "Simmons", "Patel", "Nguyen", "Kim", "Diaz",
];

const DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "proton.me", "fastmail.com"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const TODAY = new Date("2026-06-19");

function buildSubscribers(count: number): Subscriber[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i * 7 + 3);
    const status: SubscriberStatus = r1 > 0.9 ? "Unsubscribed" : r1 > 0.72 ? "Inactive" : "Active";
    const engagement: Engagement = r2 > 0.66 ? "High" : r2 > 0.33 ? "Medium" : "Low";
    const daysAgo = Math.floor(seededRandom(i * 11 + 5) * 58) + 1;
    const joined = new Date(TODAY);
    joined.setDate(joined.getDate() - daysAgo);

    return {
      id: `s${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${DOMAINS[i % DOMAINS.length]}`,
      status,
      joinedDate: joined.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      engagement,
    };
  });
}

export const subscribers: Subscriber[] = buildSubscribers(50);
