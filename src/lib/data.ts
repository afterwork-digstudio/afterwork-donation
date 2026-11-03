export interface Universe {
  id: string;
  name: string;
  placeId: string;
  status: "ACTIVE" | "INACTIVE";
  totalRevenue: number;
  totalDonations: number;
  lastActive: string;
}

export interface DonationItem {
  id: string;
  provider: "SAWERIA" | "SOCIABUZZ" | "BAGIBAGI";
  donator: string;
  robloxUsername: string;
  robloxUserId: string;
  amount: number;
  cashReward: number;
  message: string;
  status: "CLAIMED" | "PENDING" | "FAILED";
  timestamp: string;
  universeId: string;
}

export interface PlayerDataStore {
  userId: string;
  username: string;
  cashBalance: number;
  totalDonated: number;
  rank: string;
  lastSeen: string;
}

export const initialUniverses: Universe[] = [
  {
    id: "10765129159",
    name: "NEW VERFECT SPACE",
    placeId: "18291038102",
    status: "ACTIVE",
    totalRevenue: 2850000,
    totalDonations: 142,
    lastActive: "Baru saja",
  },
  {
    id: "10771421228",
    name: "RBLX WITH EXT DB",
    placeId: "18299102812",
    status: "ACTIVE",
    totalRevenue: 1420000,
    totalDonations: 68,
    lastActive: "12 menit lalu",
  },
  {
    id: "10770703228",
    name: "DEV SANDBOX LAB",
    placeId: "18300192811",
    status: "INACTIVE",
    totalRevenue: 350000,
    totalDonations: 15,
    lastActive: "2 hari lalu",
  },
];

export const initialDonations: DonationItem[] = [
  {
    id: "tx_sw_99182",
    provider: "SAWERIA",
    donator: "Rian_Sultan",
    robloxUsername: "RianRobloxID",
    robloxUserId: "281920192",
    amount: 100000,
    cashReward: 100000,
    message: "Semangat update terus game nya bang!",
    status: "CLAIMED",
    timestamp: "2026-11-03 20:45:10",
    universeId: "10765129159",
  },
  {
    id: "tx_sb_88291",
    provider: "SOCIABUZZ",
    donator: "Budi_Gamer",
    robloxUsername: "BudiSpeedrun",
    robloxUserId: "192830192",
    amount: 50000,
    cashReward: 50000,
    message: "Titip salam buat anak-anak guild",
    status: "CLAIMED",
    timestamp: "2026-11-03 19:30:22",
    universeId: "10765129159",
  },
  {
    id: "tx_sw_77190",
    provider: "SAWERIA",
    donator: "Anonim_99",
    robloxUsername: "GuestPlayer123",
    robloxUserId: "391029101",
    amount: 25000,
    cashReward: 25000,
    message: "Buat beli VIP gamepass",
    status: "CLAIMED",
    timestamp: "2026-11-03 18:15:00",
    universeId: "10771421228",
  },
  {
    id: "tx_bb_66102",
    provider: "BAGIBAGI",
    donator: "Fajar_Pro",
    robloxUsername: "FajarSniper",
    robloxUserId: "449102912",
    amount: 15000,
    cashReward: 15000,
    message: "Keren map barunya",
    status: "PENDING",
    timestamp: "2026-11-03 16:20:45",
    universeId: "10765129159",
  },
  {
    id: "tx_sb_55019",
    provider: "SOCIABUZZ",
    donator: "Dika_YT",
    robloxUsername: "DikaGamerz",
    robloxUserId: "551029192",
    amount: 200000,
    cashReward: 200000,
    message: "Top global donation malam ini!",
    status: "CLAIMED",
    timestamp: "2026-11-03 14:05:12",
    universeId: "10765129159",
  },
  {
    id: "tx_sw_44918",
    provider: "SAWERIA",
    donator: "Hendra_01",
    robloxUsername: "HendraBlock",
    robloxUserId: "661920191",
    amount: 10000,
    cashReward: 10000,
    message: "Mantap",
    status: "CLAIMED",
    timestamp: "2026-11-03 11:40:00",
    universeId: "10771421228",
  },
];

export const initialPlayers: PlayerDataStore[] = [
  {
    userId: "551029192",
    username: "DikaGamerz",
    cashBalance: 450000,
    totalDonated: 550000,
    rank: "VIP Sultan",
    lastSeen: "10 menit lalu",
  },
  {
    userId: "281920192",
    username: "RianRobloxID",
    cashBalance: 120000,
    totalDonated: 350000,
    rank: "Sultan",
    lastSeen: "25 menit lalu",
  },
  {
    userId: "192830192",
    username: "BudiSpeedrun",
    cashBalance: 85000,
    totalDonated: 150000,
    rank: "Donatur Setia",
    lastSeen: "1 jam lalu",
  },
  {
    userId: "449102912",
    username: "FajarSniper",
    cashBalance: 32000,
    totalDonated: 50000,
    rank: "Donatur",
    lastSeen: "3 jam lalu",
  },
  {
    userId: "391029101",
    username: "GuestPlayer123",
    cashBalance: 25000,
    totalDonated: 25000,
    rank: "Member",
    lastSeen: "5 jam lalu",
  },
];

