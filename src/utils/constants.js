export const CATEGORIES = [
  "All","Electronics","Bags","ID/Cards","Clothing",
  "Keys","Books","Jewelry","Water Bottle","Other"
];

export const CATEGORY_EMOJI = {
  Electronics:"📱", Bags:"🎒", "ID/Cards":"🪪", Clothing:"👕",
  Keys:"🔑", Books:"📚", Jewelry:"💍", "Water Bottle":"🫗", Other:"📦"
};

export const MOCK_ITEMS = [
  { id:1, type:"lost", category:"Electronics", title:"AirPods Pro (White)", description:"Lost near Library Block B, last seen on Tuesday around 3pm. Has a small scratch on the case lid.", location:"Library Block B", date:"2024-01-15", contact:"riya@campus.edu", status:"open", saved:false },
  { id:2, type:"found", category:"ID/Cards", title:"Student ID Card", description:"Found in the cafeteria near the sandwich counter. Belongs to someone from CSE department, third year.", location:"Central Cafeteria", date:"2024-01-16", contact:"admin@campus.edu", status:"open", saved:false },
  { id:3, type:"lost", category:"Bags", title:"Black Jansport Backpack", description:"Left in Seminar Hall 3 during the tech fest. Has a keychain of a small camera on the front zip.", location:"Seminar Hall 3", date:"2024-01-14", contact:"arjun@campus.edu", status:"open", saved:false },
  { id:4, type:"found", category:"Electronics", title:"Casio Scientific Calculator", description:"Found near the exam hall exit door. Model FX-991EX, has initials 'M.K.' written in marker inside.", location:"Exam Hall A", date:"2024-01-17", contact:"priya@campus.edu", status:"open", saved:false },
  { id:5, type:"lost", category:"Clothing", title:"Navy Blue Hoodie (L)", description:"Left on a bench near the sports complex after evening practice. Has 'MIT' printed on the front.", location:"Sports Complex", date:"2024-01-13", contact:"karan@campus.edu", status:"claimed", saved:false },
  { id:6, type:"found", category:"Keys", title:"Set of 3 Keys on Ring", description:"Found near the hostel main entrance gate on the steps. The ring has a distinctive small green tag.", location:"Hostel Gate", date:"2024-01-18", contact:"security@campus.edu", status:"open", saved:false },
  { id:7, type:"lost", category:"Books", title:"Engineering Mathematics Vol. II", description:"Green cover, has my name 'Sneha Patel' written inside front cover. Lost after the afternoon lecture.", location:"Lecture Hall 4", date:"2024-01-19", contact:"sneha@campus.edu", status:"open", saved:false },
  { id:8, type:"found", category:"Water Bottle", title:"Grey Hydro Flask 32oz", description:"Found near the gym lockers. Has stickers of mountains on it. Grey with black lid.", location:"Campus Gym", date:"2024-01-20", contact:"raj@campus.edu", status:"open", saved:false },
];

export const STATS = [
  { label:"Items Reported", value:248, icon:"📦", color:"#D4531A" },
  { label:"Items Returned", value:189, icon:"✅", color:"#15803D" },
  { label:"Active Listings", value:59,  icon:"🔍", color:"#1D4ED8" },
  { label:"Success Rate",    value:"76%", icon:"🎯", color:"#B45309" },
];