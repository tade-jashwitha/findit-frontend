// src/utils/constants.js
export const CATEGORIES = [
  "All","Electronics","Bags","ID/Cards","Clothing","Keys","Books","Jewelry","Other"
];

export const CAT_EMOJI = {
  Electronics:"📱", Bags:"🎒", "ID/Cards":"🪪",
  Clothing:"👕", Keys:"🔑", Books:"📚", Jewelry:"💍", Other:"📦",
};

export const MOCK_ITEMS = [
  { id:1,  title:"AirPods Pro Case",      type:"found", category:"Electronics", location:"Canteen",         description:"White AirPods Pro case, name sticker inside lid",                    date:"2025-05-02", contact:"finder1@campus.edu", saved:false, emoji:"🎧", time:"1h ago"  },
  { id:2,  title:"Student ID — Priya M.", type:"found", category:"ID/Cards",    location:"Admin Block",     description:"Student ID for Priya Mehta, CSE 2nd year, photo ID",               date:"2025-05-02", contact:"admin@campus.edu",   saved:false, emoji:"🪪", time:"3h ago"  },
  { id:3,  title:"Honda Key Chain",       type:"found", category:"Keys",        location:"Parking Lot B",   description:"Honda bike keys with red keychain and small flashlight attached",   date:"2025-05-02", contact:"security@campus.edu",saved:false, emoji:"🔑", time:"5h ago"  },
  { id:4,  title:"Black Nike Backpack",   type:"lost",  category:"Bags",        location:"Main Library",    description:"Black backpack with red Nike logo, laptop + charger inside",        date:"2025-05-01", contact:"aryan@campus.edu",   saved:false, emoji:"🎒", time:"2h ago"  },
  { id:5,  title:"Blue Fastrack Watch",   type:"found", category:"Jewelry",     location:"Sports Complex",  description:"Blue dial, round face, brown leather strap, found near basketball court", date:"2025-05-01", contact:"sports@campus.edu",  saved:false, emoji:"⌚", time:"1d ago"  },
  { id:6,  title:"Sony WH-1000XM5",       type:"lost",  category:"Electronics", location:"Library 2F",      description:"Black Sony headphones, left earbud has a small scratch, in original case", date:"2025-04-30", contact:"riya@campus.edu",    saved:false, emoji:"🎧", time:"2d ago"  },
  { id:7,  title:"Calculus Textbook",     type:"lost",  category:"Books",       location:"Lab 3",           description:"Red cover, name written inside front page",                         date:"2025-04-30", contact:"student7@campus.edu",saved:false, emoji:"📚", time:"2d ago"  },
  { id:8,  title:"Blue Water Bottle",     type:"found", category:"Other",       location:"Library",         description:"Blue Hydro Flask bottle, stickers on side",                         date:"2025-05-02", contact:"library@campus.edu", saved:false, emoji:"🍶", time:"2h ago"  },
];