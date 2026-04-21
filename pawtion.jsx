import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   PAWTION — Dog Food Subscription Platform
   Multi-pet profiles · Smart recommendations · Product catalog
   ═══════════════════════════════════════════════════════════ */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
:root {
  --bg: #FAF7F2;
  --bg2: #F4EFE7;
  --surface: #FFFFFF;
  --bark: #2D1F14;
  --bark2: #4A3728;
  --amber: #D4912A;
  --amber-light: #E8AA42;
  --amber-glow: #F5CC7A;
  --amber-bg: rgba(212,145,42,0.07);
  --green: #4D8B5A;
  --green-light: #6AAF78;
  --green-bg: rgba(77,139,90,0.07);
  --rose: #C4574A;
  --rose-bg: rgba(196,87,74,0.07);
  --sky: #4A8BA8;
  --sky-bg: rgba(74,139,168,0.07);
  --plum: #7B5EA7;
  --plum-bg: rgba(123,94,167,0.07);
  --muted: #8C7E6F;
  --muted2: #B0A494;
  --border: rgba(45,31,20,0.08);
  --border2: rgba(45,31,20,0.14);
  --shadow-sm: 0 1px 3px rgba(45,31,20,0.06);
  --shadow-md: 0 4px 16px rgba(45,31,20,0.08);
  --shadow-lg: 0 12px 40px rgba(45,31,20,0.12);
  --radius: 16px;
  --radius-sm: 10px;
  --radius-lg: 22px;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--bark);-webkit-font-smoothing:antialiased;}
input,select,textarea{font-family:'Outfit',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
@keyframes progressGrow{from{width:0%}}
@keyframes dotPulse{0%,100%{opacity:.3}50%{opacity:1}}
button{cursor:pointer;border:none;font-family:'Outfit',sans-serif;}
input:focus,select:focus{outline:none;border-color:var(--amber)!important;box-shadow:0 0 0 3px rgba(212,145,42,.12)!important;}

/* ── Desktop layout ── */
@media(min-width:768px){
  /* Root grid: sidebar | scrollable main */
  .dash-root{display:grid!important;grid-template-columns:260px 1fr;padding-bottom:0!important;min-height:100vh;}
  .dash-topbar{display:none!important;}
  .dash-bottomnav{display:none!important;}
  .dash-sidebar{display:flex!important;position:sticky;top:0;height:100vh;overflow-y:auto;}

  /* Main scrollable column — full height, centered children */
  .dash-content{
    max-width:none!important;
    width:100%!important;
    padding:0!important;
    margin:0!important;
    height:100vh;
    overflow-y:auto;
  }
  /* Each tab's root <div> gets centered padding */
  .dash-content>div{
    max-width:920px;
    margin:0 auto;
    padding:44px 56px 80px;
    box-sizing:border-box;
  }

  /* Modals — centered dialog, not bottom sheet */
  .modal-positioner{align-items:center!important;}
  .modal-sheet{
    border-radius:var(--radius-lg)!important;
    max-width:600px!important;
    max-height:88vh!important;
  }

  /* Product catalog — 2-col grid with vertical cards */
  .products-grid{display:grid!important;grid-template-columns:1fr 1fr;gap:16px!important;}
  .product-card-inner{flex-direction:column!important;align-items:flex-start!important;}
  .product-card-inner .product-img{
    width:100%!important;height:96px!important;
    border-radius:12px!important;
    margin-bottom:14px!important;
    font-size:40px!important;
    flex-shrink:0!important;
  }
  .product-card-inner .product-body{width:100%!important;flex:1!important;}
  .product-card-inner .subscribe-btn{
    width:100%!important;margin-top:14px!important;
    padding:10px 0!important;align-self:stretch!important;
  }

  /* Subscriptions — 2-col grid */
  .subs-grid{display:grid!important;grid-template-columns:1fr 1fr;gap:16px!important;}

  /* Page headers — bigger on desktop */
  .page-h2{font-size:30px!important;}

  /* Landing */
  .landing-wrap{max-width:1160px!important;padding:0 72px!important;}
  .landing-hero{display:grid!important;grid-template-columns:1fr 1fr;gap:96px;align-items:center;padding-top:96px!important;padding-bottom:80px!important;}
  .landing-cta{text-align:left!important;}
  .landing-cta p,
  .landing-cta button{margin-left:0!important;margin-right:0!important;}
  .landing-cta .pill-row{justify-content:flex-start!important;}
  .landing-right-panel{display:flex!important;flex-direction:column;gap:16px;}
  .landing-features{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:16px!important;}
  .landing-brands-row{justify-content:flex-start!important;}

  /* Profile 2-col */
  .profile-grid{display:grid!important;grid-template-columns:1fr 1fr;gap:20px;align-items:start;}
  .profile-grid>div:first-child{margin-bottom:0!important;}

  /* Pets tab — recommendations in 3-col */
  .recs-grid{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:12px!important;}
  .recs-grid .product-card-inner{flex-direction:column!important;align-items:flex-start!important;}
  .recs-grid .product-card-inner .product-img{width:100%!important;height:80px!important;border-radius:10px!important;margin-bottom:10px!important;font-size:32px!important;}
  .recs-grid .product-card-inner .product-body{width:100%!important;}

  /* Auth pages */
  .auth-wrap{max-width:520px!important;}
}
`;

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const TOKEN_KEY = "pawtion_token";

async function apiRequest(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

function userAddress(user) {
  const parts = [user.address?.street, user.address?.city, user.address?.postal_code].filter(Boolean);
  return parts.join(", ");
}

function mapUserFromApi(apiUser, pets = [], subscriptions = []) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone || "",
    address: userAddress(apiUser),
    pets,
    subscriptions,
  };
}

function mapPetFromApi(pet) {
  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    size: pet.size,
    stage: pet.stage,
    activity: pet.activity,
    weight: pet.weight,
    healthTags: pet.health_tags || [],
    recommendedDailyGrams: pet.recommended_daily_grams,
  };
}

function mapBrandFromApi(brand) {
  return {
    id: brand.slug,
    name: brand.name,
    tagline: brand.tagline,
    color: brand.color || "#D4912A",
    logo: brand.logo_emoji || "🐾",
  };
}

function mapProductFromApi(product) {
  return {
    id: product.id,
    brand: product.brand?.slug || product.brand_id,
    name: product.name,
    desc: product.description,
    price: product.price,
    size: product.bag_size_kg,
    rating: product.rating,
    reviews: product.review_count,
    tags: product.tags || [],
    sizes: product.compatible_sizes || [],
    stages: product.compatible_stages || [],
    img: product.img_emoji || "🍖",
    bestseller: !!product.is_bestseller,
  };
}

function mapSubscriptionFromApi(sub) {
  return {
    id: sub.id,
    petId: sub.pet_id,
    productId: sub.product_id,
    dailyG: sub.daily_grams,
    bagDays: sub.bag_days,
    startDate: sub.start_date,
    nextDelivery: sub.next_delivery_date,
    status: sub.status,
    monthlyPrice: sub.monthly_price,
  };
}

// ─── ICONS ──────────────────────────────────────────────
const Paw = ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><ellipse cx="7" cy="8" rx="2.2" ry="2.8"/><ellipse cx="17" cy="8" rx="2.2" ry="2.8"/><ellipse cx="4.5" cy="13.5" rx="1.8" ry="2.2"/><ellipse cx="19.5" cy="13.5" rx="1.8" ry="2.2"/><path d="M12 21c-3.5 0-6.5-2.8-6.5-5.5 0-1.8 1.4-3.2 3.2-3.6 1-.3 1.8-.7 3.3-.7s2.3.4 3.3.7c1.8.4 3.2 1.8 3.2 3.6 0 2.7-3 5.5-6.5 5.5z"/></svg>;
const Plus = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Check = ({s=16,c="white"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Star = ({s=14,filled}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={filled?"var(--amber)":"none"} stroke="var(--amber)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>;
const Truck = ({s=20}) => <svg width={s} height={s} viewBox="0 0 32 32" fill="currentColor"><rect x="2" y="10" width="18" height="12" rx="2"/><path d="M20 14h6l4 5v3h-10z"/><circle cx="8" cy="24" r="2.5" fill="var(--amber)"/><circle cx="25" cy="24" r="2.5" fill="var(--amber)"/></svg>;
const Edit = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const X = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Bone = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" opacity=".12"><path d="M3.5 6.5a2.5 2.5 0 015 0c0 .5-.15.96-.4 1.35l5.55 5.55c.4-.25.85-.4 1.35-.4a2.5 2.5 0 010 5 2.5 2.5 0 01-2.5-2.5c0-.5.15-.96.4-1.35L7.35 8.6c-.4.25-.85.4-1.35.4A2.5 2.5 0 013.5 6.5zM17 3.5a2.5 2.5 0 012.5 2.5A2.5 2.5 0 0117 8.5c-.5 0-.96-.15-1.35-.4L10.1 13.65c.25.4.4.85.4 1.35a2.5 2.5 0 01-5 0 2.5 2.5 0 012.5-2.5c.5 0 .96.15 1.35.4l5.55-5.55c-.25-.4-.4-.85-.4-1.35A2.5 2.5 0 0117 3.5z"/></svg>;

// ─── DATA ───────────────────────────────────────────────
const DOG_SIZES = [
  {id:"toy",label:"Toy",range:"1–5 kg",emoji:"🐩",daily:80},
  {id:"small",label:"Small",range:"5–10 kg",emoji:"🐕",daily:150},
  {id:"medium",label:"Medium",range:"10–25 kg",emoji:"🐕‍🦺",daily:280},
  {id:"large",label:"Large",range:"25–40 kg",emoji:"🦮",daily:400},
  {id:"giant",label:"Giant",range:"40+ kg",emoji:"🐾",daily:560},
];

const LIFE_STAGES = [
  {id:"puppy",label:"Puppy",range:"< 1 year",icon:"🍼"},
  {id:"adult",label:"Adult",range:"1–7 years",icon:"🐕"},
  {id:"senior",label:"Senior",range:"7+ years",icon:"🤍"},
];

const ACTIVITY_LEVELS = [
  {id:"low",label:"Couch Potato",desc:"Low activity",icon:"😴"},
  {id:"moderate",label:"Moderate",desc:"Daily walks",icon:"🚶"},
  {id:"active",label:"Active",desc:"Runs & play",icon:"🏃"},
  {id:"athletic",label:"Athletic",desc:"Working/sport dog",icon:"⚡"},
];

const HEALTH_TAGS = ["Weight Management","Sensitive Stomach","Joint Support","Skin & Coat","Dental Health","Grain-Free","High Protein","Organic"];

const DOG_BREEDS = [
  "Africanis",
  "Airedale Terrier",
  "Akita",
  "Alaskan Malamute",
  "American Bully",
  "American Pit Bull Terrier",
  "Australian Cattle Dog",
  "Australian Shepherd",
  "Basenji",
  "Basset Hound",
  "Beagle",
  "Belgian Malinois",
  "Bernese Mountain Dog",
  "Bichon Frise",
  "Boerboel",
  "Border Collie",
  "Border Terrier",
  "Boston Terrier",
  "Boxer",
  "Bull Terrier",
  "Bulldog",
  "Bullmastiff",
  "Cane Corso",
  "Cavalier King Charles Spaniel",
  "Chihuahua",
  "Cocker Spaniel",
  "Collie",
  "Dachshund",
  "Dalmatian",
  "Doberman Pinscher",
  "English Springer Spaniel",
  "French Bulldog",
  "German Shepherd",
  "German Shorthaired Pointer",
  "Golden Retriever",
  "Great Dane",
  "Greyhound",
  "Jack Russell Terrier",
  "Labrador Retriever",
  "Maltese",
  "Miniature Schnauzer",
  "Mixed Breed",
  "Pekingese",
  "Pembroke Welsh Corgi",
  "Pomeranian",
  "Poodle",
  "Pug",
  "Rhodesian Ridgeback",
  "Rottweiler",
  "Saint Bernard",
  "Samoyed",
  "Scottish Terrier",
  "Shetland Sheepdog",
  "Shiba Inu",
  "Shih Tzu",
  "Siberian Husky",
  "Staffordshire Bull Terrier",
  "Vizsla",
  "Weimaraner",
  "West Highland White Terrier",
  "Whippet",
  "Yorkshire Terrier",
];

const BRANDS = [
  {id:"montego",name:"Montego",tagline:"South African everyday nutrition",color:"#8C5A2B",logo:"🦴"},
  {id:"ultra-dog",name:"Ultra Dog",tagline:"Complete nutrition for all life stages",color:"#B4472A",logo:"🐶"},
  {id:"royalcanin",name:"Royal Canin",tagline:"Breed- and size-specific nutrition",color:"#C4574A",logo:"👑"},
  {id:"hills",name:"Hill's Science Diet",tagline:"Science-led everyday nutrition",color:"#4A8BA8",logo:"🔬"},
  {id:"acana",name:"Acana",tagline:"Protein-rich recipes",color:"#4D8B5A",logo:"🌿"},
  {id:"orijen",name:"Orijen",tagline:"High-protein whole-prey inspired diets",color:"#7B5EA7",logo:"🥩"},
  {id:"purina-pro-plan",name:"Purina Pro Plan",tagline:"Performance-focused formulas",color:"#B98A23",logo:"🏅"},
  {id:"canidae",name:"Canidae",tagline:"Simple ingredient recipes",color:"#C9872A",logo:"🌾"},
];

const PRODUCTS = [
  {id:"p1",brand:"montego",name:"Montego Karoo Adult Lamb & Rice",desc:"Adult dry food with lamb and rice for everyday feeding.",price:619,size:20,rating:4.5,reviews:540,tags:[],sizes:["small","medium","large","giant"],stages:["adult"],img:"🦴",bestseller:true},
  {id:"p2",brand:"montego",name:"Montego Karoo Puppy Chicken",desc:"Puppy formula designed for growth and healthy development.",price:589,size:8,rating:4.5,reviews:300,tags:["High Protein"],sizes:["toy","small","medium","large"],stages:["puppy"],img:"🐕"},
  {id:"p3",brand:"montego",name:"Montego Classic Adult",desc:"General adult maintenance food with balanced nutrition.",price:479,size:25,rating:4.3,reviews:760,tags:[],sizes:["small","medium","large","giant"],stages:["adult"],img:"🥣"},
  {id:"p4",brand:"ultra-dog",name:"Ultra Dog Premium Recipe Adult",desc:"Adult kibble for maintenance, digestion, and coat support.",price:539,size:20,rating:4.4,reviews:410,tags:["Skin & Coat"],sizes:["small","medium","large","giant"],stages:["adult"],img:"🐶"},
  {id:"p5",brand:"ultra-dog",name:"Ultra Dog Superwoof Puppy",desc:"Puppy food with DHA support for early development.",price:519,size:8,rating:4.4,reviews:220,tags:["High Protein"],sizes:["toy","small","medium","large"],stages:["puppy"],img:"🍼"},
  {id:"p6",brand:"ultra-dog",name:"Ultra Dog Special Diet Sensitive",desc:"Sensitive-digestion formula for adult dogs needing a gentler recipe.",price:599,size:12,rating:4.5,reviews:180,tags:["Sensitive Stomach"],sizes:["small","medium","large"],stages:["adult"],img:"💛"},
  {id:"p7",brand:"royalcanin",name:"Royal Canin Mini Puppy",desc:"Small-breed puppy recipe with targeted growth support.",price:559,size:4,rating:4.7,reviews:860,tags:["High Protein"],sizes:["toy","small"],stages:["puppy"],img:"🐾"},
  {id:"p8",brand:"royalcanin",name:"Royal Canin Medium Adult",desc:"Adult maintenance formula for medium-sized dogs.",price:699,size:10,rating:4.6,reviews:1240,tags:[],sizes:["medium"],stages:["adult"],img:"🐕"},
  {id:"p9",brand:"royalcanin",name:"Royal Canin Maxi Adult",desc:"Large-breed adult food with joint-focused support.",price:819,size:15,rating:4.7,reviews:950,tags:["Joint Support"],sizes:["large","giant"],stages:["adult"],img:"👑"},
  {id:"p10",brand:"hills",name:"Hill's Science Diet Adult Chicken & Barley Recipe",desc:"Balanced adult recipe built around everyday digestion and muscle maintenance.",price:759,size:12,rating:4.5,reviews:2100,tags:[],sizes:["small","medium","large"],stages:["adult"],img:"🔬",bestseller:true},
  {id:"p11",brand:"hills",name:"Hill's Science Diet Sensitive Stomach & Skin",desc:"Adult formula aimed at gentle digestion and coat condition.",price:839,size:11,rating:4.7,reviews:670,tags:["Sensitive Stomach","Skin & Coat"],sizes:["small","medium","large"],stages:["adult"],img:"🛡️"},
  {id:"p12",brand:"hills",name:"Hill's Science Diet Perfect Weight Adult",desc:"Adult dry food for healthy weight management.",price:819,size:12,rating:4.6,reviews:980,tags:["Weight Management"],sizes:["medium","large","giant"],stages:["adult","senior"],img:"⚖️"},
  {id:"p13",brand:"acana",name:"Acana Adult Dog Recipe",desc:"Protein-rich adult recipe with poultry ingredients.",price:919,size:11.4,rating:4.8,reviews:620,tags:["High Protein"],sizes:["small","medium","large","giant"],stages:["adult"],img:"🌿"},
  {id:"p14",brand:"acana",name:"Acana Puppy Recipe",desc:"Growth-focused puppy recipe for developing dogs.",price:869,size:11.4,rating:4.8,reviews:310,tags:["High Protein"],sizes:["small","medium","large","giant"],stages:["puppy"],img:"🐶"},
  {id:"p15",brand:"acana",name:"Acana Senior Recipe",desc:"Senior formula with a leaner protein-forward profile.",price:949,size:11.4,rating:4.7,reviews:260,tags:["Joint Support","High Protein"],sizes:["medium","large","giant"],stages:["senior"],img:"🦴"},
  {id:"p16",brand:"orijen",name:"Orijen Original",desc:"Flagship adult recipe with a broad mix of animal proteins.",price:1029,size:11.4,rating:4.9,reviews:1450,tags:["Grain-Free","High Protein"],sizes:["small","medium","large","giant"],stages:["adult"],img:"🥩",bestseller:true},
  {id:"p17",brand:"orijen",name:"Orijen Puppy",desc:"Puppy formula with dense animal protein and rich nutrition.",price:1049,size:6,rating:4.9,reviews:380,tags:["Grain-Free","High Protein"],sizes:["small","medium","large"],stages:["puppy"],img:"🐾"},
  {id:"p18",brand:"orijen",name:"Orijen Senior",desc:"Senior recipe with higher protein and joint-conscious positioning.",price:1069,size:11.4,rating:4.8,reviews:540,tags:["Joint Support","Grain-Free","High Protein"],sizes:["medium","large","giant"],stages:["senior"],img:"🤍"},
  {id:"p19",brand:"purina-pro-plan",name:"Purina Pro Plan Puppy Chicken & Rice Formula",desc:"Puppy formula built around growth and brain development support.",price:729,size:8,rating:4.7,reviews:910,tags:["High Protein"],sizes:["toy","small","medium","large"],stages:["puppy"],img:"🐕‍🦺"},
  {id:"p20",brand:"purina-pro-plan",name:"Purina Pro Plan Adult Shredded Blend Chicken & Rice Formula",desc:"Adult formula with mixed kibble textures and high-protein positioning.",price:799,size:15,rating:4.7,reviews:1330,tags:["High Protein"],sizes:["small","medium","large","giant"],stages:["adult"],img:"🏅"},
  {id:"p21",brand:"purina-pro-plan",name:"Purina Pro Plan Sensitive Skin & Stomach Salmon & Rice Formula",desc:"Adult food centered on salmon and gentle digestion support.",price:829,size:13,rating:4.8,reviews:880,tags:["Sensitive Stomach","Skin & Coat"],sizes:["small","medium","large"],stages:["adult"],img:"🐟"},
  {id:"p22",brand:"canidae",name:"Canidae All Life Stages Multi-Protein",desc:"Multi-protein kibble suitable across life stages.",price:689,size:11.3,rating:4.5,reviews:720,tags:[],sizes:["small","medium","large","giant"],stages:["puppy","adult","senior"],img:"🌈"},
  {id:"p23",brand:"canidae",name:"Canidae PURE Petite Small Breed Salmon Recipe",desc:"Small-breed salmon recipe with a simplified ingredient profile.",price:619,size:4.5,rating:4.6,reviews:380,tags:["Sensitive Stomach"],sizes:["toy","small"],stages:["adult"],img:"✨"},
  {id:"p24",brand:"canidae",name:"Canidae PURE Healthy Weight",desc:"Weight-conscious adult formula with a simpler ingredient list.",price:709,size:10.8,rating:4.5,reviews:290,tags:["Weight Management"],sizes:["medium","large","giant"],stages:["adult","senior"],img:"🥕"},
];

// ─── HELPERS ────────────────────────────────────────────
const delay = (i=0) => ({animation:`fadeUp .45s ease ${i}s both`});
const calcBagDays = (bagKg, dailyG) => Math.floor((bagKg*1000)/dailyG);
const getRecommendations = (pet, products) => {
  if(!pet) return [];
  return products.filter(p =>
    p.sizes.includes(pet.size) &&
    p.stages.includes(pet.stage)
  ).sort((a,b) => {
    const aMatch = a.tags.filter(t => pet.healthTags?.includes(t)).length;
    const bMatch = b.tags.filter(t => pet.healthTags?.includes(t)).length;
    if(bMatch !== aMatch) return bMatch - aMatch;
    return b.rating - a.rating;
  });
};

// ─── STYLES ─────────────────────────────────────────────
const input = {width:"100%",padding:"12px 14px",borderRadius:"var(--radius-sm)",border:"1.5px solid var(--border2)",background:"var(--surface)",fontSize:14,color:"var(--bark)",transition:"all .2s"};
const btnPrimary = {padding:"13px 24px",borderRadius:"var(--radius-sm)",background:"linear-gradient(135deg,var(--amber),var(--amber-light))",color:"white",fontSize:15,fontWeight:600,boxShadow:"0 4px 14px rgba(212,145,42,.25)",transition:"all .2s",width:"100%"};
const btnSecondary = {padding:"12px 20px",borderRadius:"var(--radius-sm)",background:"var(--surface)",border:"1.5px solid var(--border2)",color:"var(--bark)",fontSize:14,fontWeight:500,transition:"all .2s"};
const card = {background:"var(--surface)",borderRadius:"var(--radius-lg)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)",overflow:"hidden"};
const sectionTitle = {fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,color:"var(--muted)",marginBottom:14};

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function Pawtion() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [booting, setBooting] = useState(true);
  const [brands, setBrands] = useState(BRANDS);
  const [products, setProducts] = useState(PRODUCTS);

  const loadCatalog = useCallback(async () => {
    const [brandsRes, productsRes] = await Promise.all([
      apiRequest("/api/products/brands"),
      apiRequest("/api/products"),
    ]);
    setBrands((brandsRes.brands || []).map(mapBrandFromApi));
    setProducts((productsRes.products || []).map(mapProductFromApi));
  }, []);

  const loadUserData = useCallback(async (jwt) => {
    const [profileRes, petsRes, subsRes] = await Promise.all([
      apiRequest("/api/auth/me", { token: jwt }),
      apiRequest("/api/pets", { token: jwt }),
      apiRequest("/api/subscriptions", { token: jwt }),
    ]);

    const pets = (petsRes.pets || []).map(mapPetFromApi);
    const subscriptions = (subsRes.subscriptions || []).map(mapSubscriptionFromApi);
    setUser(mapUserFromApi(profileRes.user, pets, subscriptions));
    setView("dashboard");
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadCatalog();
        if (token) {
          await loadUserData(token);
        }
      } catch (err) {
        if (token && active) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setView("landing");
        }
      } finally {
        if (active) setBooting(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token, loadCatalog, loadUserData]);

  const handleAuth = async ({ mode, payload }) => {
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const result = await apiRequest(endpoint, { method: "POST", body: payload });
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    await loadUserData(result.token);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setView("landing");
  };

  if (booting) {
    return (
      <>
        <style>{FONTS}</style>
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",color:"var(--muted)",fontSize:14}}>Loading Pawtion...</div>
      </>
    );
  }

  if(!user && view === "landing") return <><style>{FONTS}</style><Landing onSignup={() => setView("signup")} onLogin={() => setView("login")} /></>;
  if(!user && view === "signup") return <><style>{FONTS}</style><Signup onComplete={(payload) => handleAuth({ mode: "signup", payload })} onBack={() => setView("landing")} /></>;
  if(!user && view === "login") return <><style>{FONTS}</style><Login onComplete={(payload) => handleAuth({ mode: "login", payload })} onBack={() => setView("landing")} /></>;
  return <><style>{FONTS}</style><AppDashboard user={user} setUser={setUser} token={token} products={products} brands={brands} onLogout={handleLogout} /></>;
}

// ═══════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════
function Landing({ onSignup, onLogin }) {
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      {[...Array(5)].map((_,i)=><div key={i} style={{position:"fixed",top:`${10+i*18}%`,left:`${8+(i%3)*35}%`,animation:`float ${4+i}s ease-in-out infinite`,animationDelay:`${i*.6}s`,pointerEvents:"none",zIndex:0}}><Bone s={28+i*6}/></div>)}

      <div className="landing-wrap" style={{maxWidth:560,margin:"0 auto",padding:"0 24px",position:"relative",zIndex:1}}>
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 0",...delay(0)}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:12,background:"var(--amber)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(212,145,42,.3)"}}><Paw s={20} c="white"/></div>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700}}>Pawtion</span>
          </div>
          <button onClick={onLogin} style={{...btnSecondary,padding:"8px 18px",fontSize:13}}>Log In</button>
        </nav>

        <div className="landing-hero" style={{paddingTop:48,...delay(.1)}}>
          <div className="landing-cta" style={{textAlign:"center"}}>
            <div style={{fontSize:72,marginBottom:16,animation:"wiggle 3s ease-in-out infinite"}}>🐕</div>
            <h1 style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:800,lineHeight:1.12,marginBottom:16,letterSpacing:-.5}}>
              The right food,<br/><span style={{color:"var(--amber)"}}>always on time</span>
            </h1>
            <p style={{color:"var(--muted)",fontSize:16,lineHeight:1.6,maxWidth:400,margin:"0 auto 36px"}}>
              Personalised dog food subscriptions. We learn what your pets need and deliver before they run out.
            </p>
            <div className="pill-row" style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8,marginBottom:32,...delay(.2)}}>
              {["Multi-pet profiles","Smart recommendations","Auto-delivery","Free shipping"].map((f,i)=>(
                <span key={i} style={{padding:"7px 14px",borderRadius:24,background:"var(--surface)",border:"1px solid var(--border)",fontSize:13,fontWeight:500,color:"var(--bark2)",boxShadow:"var(--shadow-sm)"}}>{f}</span>
              ))}
            </div>
            <div style={delay(.3)}>
              <button onClick={onSignup} style={{...btnPrimary,fontSize:17,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,maxWidth:320,margin:"0 auto"}}>
                Get Started <Paw s={18} c="white"/>
              </button>
              <p style={{textAlign:"center",fontSize:13,color:"var(--muted)",marginTop:14}}>No commitment · Cancel anytime · Free delivery</p>
            </div>
          </div>

          <div className="landing-right-panel" style={{display:"none"}}>
            {[
              {title:"Create pet profiles",desc:"Add all your dogs — we tailor recommendations for each one.",icon:"🐾"},
              {title:"Pick their food",desc:"Browse our catalog or let us recommend based on breed, age & needs.",icon:"🍖"},
              {title:"We handle the rest",desc:"We calculate when they'll run out and ship fresh food right on time.",icon:"📦"},
            ].map((s,i)=>(
              <div key={i} style={{...card,padding:20,display:"flex",alignItems:"flex-start",gap:16,animation:`slideIn .45s ease ${.4+i*.12}s both`}}>
                <div style={{width:44,height:44,borderRadius:14,background:"var(--amber-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.5}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:56,textAlign:"center",...delay(.4)}}>
          <p style={{...sectionTitle,marginBottom:18}}>Brands we stock</p>
          <div className="landing-brands-row" style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
            {BRANDS.map(b=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,background:"var(--surface)",border:"1px solid var(--border)",fontSize:13,fontWeight:500}}>
                <span style={{fontSize:18}}>{b.logo}</span>{b.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:56,paddingBottom:60,...delay(.5)}}>
          <p style={{...sectionTitle,textAlign:"center",marginBottom:28}}>How Pawtion works</p>
          <div className="landing-features" style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              {title:"Create pet profiles",desc:"Add all your dogs — we tailor recommendations for each one.",icon:"🐾"},
              {title:"Pick their food",desc:"Browse our catalog or let us recommend based on breed, age & needs.",icon:"🍖"},
              {title:"We handle the rest",desc:"We calculate when they'll run out and ship fresh food right on time.",icon:"📦"},
            ].map((s,i)=>(
              <div key={i} style={{...card,padding:20,display:"flex",alignItems:"flex-start",gap:16,animation:`slideIn .45s ease ${.5+i*.1}s both`}}>
                <div style={{width:44,height:44,borderRadius:14,background:"var(--amber-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.5}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIGNUP / LOGIN
// ═══════════════════════════════════════════════════════════
function Signup({ onComplete, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valid0 = name && email && password.length >= 6;
  const valid1 = address && city && postal;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      <NavHeader onBack={onBack} title="Create Account" />
      <div className="auth-wrap" style={{maxWidth:460,margin:"0 auto",padding:"24px 24px 60px",width:"100%"}}>
        <div style={{display:"flex",gap:8,marginBottom:32,...delay(0)}}>
          {["Account","Address"].map((s,i)=>(
            <div key={s} style={{flex:1}}>
              <div style={{height:3,borderRadius:3,background:i<=step?"var(--amber)":"var(--border)",transition:"background .3s"}}/>
              <div style={{fontSize:11,fontWeight:i===step?600:400,color:i<=step?"var(--bark)":"var(--muted)",marginTop:6,textAlign:"center"}}>{s}</div>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,marginBottom:6,...delay(0)}}>Welcome to the pack</h2>
            <p style={{color:"var(--muted)",fontSize:14,marginBottom:28,...delay(.05)}}>Let's set up your account</p>
            <Field label="Full Name" value={name} set={setName} placeholder="Jane Doe" d={.1}/>
            <Field label="Email" value={email} set={setEmail} placeholder="jane@example.com" type="email" d={.15}/>
            <Field label="Phone (optional)" value={phone} set={setPhone} placeholder="+27 82 123 4567" d={.18}/>
            <Field label="Password" value={password} set={setPassword} placeholder="Min 6 characters" type="password" d={.2}/>
            <button onClick={()=>setStep(1)} disabled={!valid0} style={{...btnPrimary,marginTop:24,opacity:valid0?1:.4,...delay(.25)}}>Continue →</button>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,marginBottom:6,...delay(0)}}>Delivery address</h2>
            <p style={{color:"var(--muted)",fontSize:14,marginBottom:28,...delay(.05)}}>Where should we send the goods?</p>
            <Field label="Street Address" value={address} set={setAddress} placeholder="123 Bark Avenue" d={.1}/>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
              <Field label="City" value={city} set={setCity} placeholder="Cape Town" d={.15}/>
              <Field label="Postal Code" value={postal} set={setPostal} placeholder="8001" d={.2}/>
            </div>
            <InfoBox icon="🚚" text="Free delivery on all subscriptions — we ship 3–5 days before your pet runs out." d={.25}/>
            <div style={{display:"flex",gap:10,marginTop:24,...delay(.3)}}>
              <button onClick={()=>setStep(0)} style={btnSecondary}>← Back</button>
              <button onClick={async()=>{
                setError("");
                setSubmitting(true);
                try {
                  await onComplete({
                    name,
                    email,
                    password,
                    phone,
                    street_address: address,
                    city,
                    postal_code: postal,
                  });
                } catch (err) {
                  setError(err.message || "Signup failed");
                  setSubmitting(false);
                }
              }} disabled={!valid1 || submitting} style={{...btnPrimary,flex:1,opacity:(valid1 && !submitting)?1:.4}}>{submitting ? "Creating..." : "Create Account"}</button>
            </div>
            {error && <p style={{fontSize:13,color:"var(--rose)",marginTop:10}}>{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Login({ onComplete, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      <NavHeader onBack={onBack} title="Log In" />
      <div className="auth-wrap" style={{maxWidth:460,margin:"0 auto",padding:"24px 24px 60px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32,...delay(0)}}>
          <div style={{fontSize:48,marginBottom:12}}>👋</div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,marginBottom:4}}>Welcome back</h2>
          <p style={{color:"var(--muted)",fontSize:14}}>Your pets missed you</p>
        </div>
        <Field label="Email" value={email} set={setEmail} placeholder="jane@example.com" type="email" d={.1}/>
        <Field label="Password" value={password} set={setPassword} placeholder="••••••••" type="password" d={.15}/>
        <button onClick={async()=>{
          setError("");
          setSubmitting(true);
          try {
            await onComplete({ email, password });
          } catch (err) {
            setError(err.message || "Login failed");
            setSubmitting(false);
          }
        }} disabled={!email||!password||submitting} style={{...btnPrimary,marginTop:24,opacity:(email&&password&&!submitting)?1:.4,...delay(.2)}}>{submitting ? "Logging in..." : "Log In"}</button>
        {error && <p style={{fontSize:13,color:"var(--rose)",marginTop:10}}>{error}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function AppDashboard({ user, setUser, token, products, brands, onLogout }) {
  const [tab, setTab] = useState("pets");
  const [modal, setModal] = useState(null);
  const [activePetId, setActivePetId] = useState(null);
  const [shopPet, setShopPet] = useState(null);
  const [busy, setBusy] = useState(false);

  const addPet = async (pet) => {
    try {
      setBusy(true);
      const result = await apiRequest("/api/pets", {
        method: "POST",
        token,
        body: {
          name: pet.name,
          breed: pet.breed,
          size: pet.size,
          stage: pet.stage,
          activity: pet.activity,
          weight: pet.weight,
          health_tags: pet.healthTags,
        },
      });
      const newPet = mapPetFromApi(result.pet);
      setUser(u => ({ ...u, pets: [...u.pets, newPet] }));
      setModal(null);
      setActivePetId(newPet.id);
    } catch (err) {
      alert(err.message || "Could not add pet");
    } finally {
      setBusy(false);
    }
  };

  const updatePet = async (pet) => {
    try {
      setBusy(true);
      const result = await apiRequest(`/api/pets/${pet.id}`, {
        method: "PUT",
        token,
        body: {
          name: pet.name,
          breed: pet.breed,
          size: pet.size,
          stage: pet.stage,
          activity: pet.activity,
          weight: pet.weight,
          health_tags: pet.healthTags,
        },
      });
      const updatedPet = mapPetFromApi(result.pet);
      setUser(u => ({ ...u, pets: u.pets.map(p => p.id === pet.id ? updatedPet : p) }));
      setModal(null);
    } catch (err) {
      alert(err.message || "Could not update pet");
    } finally {
      setBusy(false);
    }
  };

  const removePet = async (id) => {
    try {
      setBusy(true);
      await apiRequest(`/api/pets/${id}`, { method: "DELETE", token });
      setUser(u => ({
        ...u,
        pets: u.pets.filter(p => p.id !== id),
        subscriptions: u.subscriptions.filter(s => s.petId !== id)
      }));
      if(activePetId === id) setActivePetId(null);
      setModal(null);
    } catch (err) {
      alert(err.message || "Could not remove pet");
    } finally {
      setBusy(false);
    }
  };

  const refreshSubs = async () => {
    const subsRes = await apiRequest("/api/subscriptions", { token });
    const subscriptions = (subsRes.subscriptions || []).map(mapSubscriptionFromApi);
    setUser(u => ({ ...u, subscriptions }));
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/payment/success") {
      window.history.replaceState({}, "", "/");
      refreshSubs().then(() => setTab("subscriptions"));
    } else if (path === "/payment/cancel") {
      window.history.replaceState({}, "", "/");
      alert("Payment was cancelled. Your subscription has not been activated.");
    }
  }, []);

  const subscribe = async (productId, petId, dailyG) => {
    try {
      setBusy(true);
      const result = await apiRequest("/api/subscriptions", {
        method: "POST",
        token,
        body: {
          pet_id: petId,
          product_id: productId,
          daily_grams: dailyG,
        },
      });

      const paymentResult = await apiRequest(`/api/payments/initiate/${result.subscription.id}`, {
        method: "POST",
        token,
      });

      setModal(null);
      window.location.href = paymentResult.checkout_url;
    } catch (err) {
      alert(err.message || "Could not create subscription");
    } finally {
      setBusy(false);
    }
  };

  const TABS = [
    {id:"pets",label:"My Pets",icon:"🐾"},
    {id:"shop",label:"Shop",icon:"🛒"},
    {id:"subscriptions",label:"Deliveries",icon:"📦"},
    {id:"profile",label:"Profile",icon:"👤"},
  ];

  return (
    <div className="dash-root" style={{minHeight:"100vh",background:"var(--bg)",paddingBottom:80}}>
      {/* Mobile top bar */}
      <div className="dash-topbar" style={{background:"var(--bark)",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",...delay(0)}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"var(--amber)",display:"flex",alignItems:"center",justifyContent:"center"}}><Paw s={17} c="white"/></div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:"white"}}>Pawtion</span>
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>Hi, {user.name?.split(" ")[0]} 👋</div>
      </div>

      {/* Desktop sidebar */}
      <aside className="dash-sidebar" style={{display:"none",flexDirection:"column",background:"var(--surface)",borderRight:"1px solid var(--border)"}}>
        {/* Logo */}
        <div style={{padding:"32px 24px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:13,background:"linear-gradient(135deg,var(--amber),var(--amber-light))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(212,145,42,.3)",flexShrink:0}}><Paw s={20} c="white"/></div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:21,fontWeight:800,lineHeight:1}}>Pawtion</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Dog food subscriptions</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"8px 16px",display:"flex",flexDirection:"column",gap:2}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:"var(--muted2)",padding:"0 12px 8px"}}>Menu</div>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              display:"flex",alignItems:"center",gap:14,padding:"11px 14px",borderRadius:12,
              background:tab===t.id?"var(--amber-bg)":"none",
              color:tab===t.id?"var(--amber)":"var(--bark)",
              fontWeight:tab===t.id?600:500,fontSize:14,textAlign:"left",
              border:tab===t.id?"1.5px solid rgba(212,145,42,.18)":"1.5px solid transparent",
              transition:"all .18s"
            }}>
              <span style={{fontSize:19,width:22,textAlign:"center",flexShrink:0}}>{t.icon}</span>
              {t.label}
              {t.id==="subscriptions" && user.subscriptions?.length>0 && (
                <span style={{marginLeft:"auto",background:tab===t.id?"var(--amber)":"var(--bg2)",color:tab===t.id?"white":"var(--muted)",fontSize:11,fontWeight:700,minWidth:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px"}}>
                  {user.subscriptions.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{margin:"16px",borderRadius:14,background:"var(--bg)",border:"1px solid var(--border)",padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,var(--amber),var(--amber-light))",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,flexShrink:0}}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{minWidth:0,flex:1}}>
              <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
              <div style={{fontSize:11,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="dash-content" style={{maxWidth:520,margin:"0 auto",padding:"20px 20px 0"}}>
        {tab === "pets" && <PetsTab user={user} products={products} brands={brands} activePetId={activePetId} setActivePetId={setActivePetId} onAddPet={()=>setModal({type:"addPet"})} onEditPet={p=>setModal({type:"editPet",data:p})} onShopFor={p=>{setShopPet(p);setTab("shop");}}/>}
        {tab === "shop" && <ShopTab user={user} products={products} brands={brands} shopPet={shopPet} setShopPet={setShopPet} onSubscribe={(prod,pet)=>setModal({type:"subscribe",data:{product:prod,pet}})}/>}
        {tab === "subscriptions" && <SubscriptionsTab user={user} setUser={setUser} token={token} products={products} brands={brands}/>}
        {tab === "profile" && <ProfileTab user={user} setUser={setUser} token={token} onLogout={onLogout}/>}
      </div>

      {busy && (
        <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",background:"var(--bark)",color:"white",padding:"8px 14px",borderRadius:999,fontSize:12,zIndex:120}}>
          Saving changes...
        </div>
      )}

      <nav className="dash-bottomnav" style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--surface)",borderTop:"1px solid var(--border)",display:"flex",padding:"6px 0 env(safe-area-inset-bottom,8px)",zIndex:50,boxShadow:"0 -2px 12px rgba(0,0,0,.04)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0",background:"none",color:tab===t.id?"var(--amber)":"var(--muted)",transition:"color .2s"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:11,fontWeight:tab===t.id?600:400}}>{t.label}</span>
          </button>
        ))}
      </nav>

      {modal?.type === "addPet" && <PetFormModal onSave={addPet} onClose={()=>setModal(null)} />}
      {modal?.type === "editPet" && <PetFormModal pet={modal.data} onSave={updatePet} onClose={()=>setModal(null)} onDelete={()=>removePet(modal.data.id)} />}
      {modal?.type === "subscribe" && <SubscribeModal product={modal.data.product} pet={modal.data.pet} onConfirm={subscribe} onClose={()=>setModal(null)} />}
    </div>
  );
}

// ─── PETS TAB ───────────────────────────────────────────
function PetsTab({ user, products, brands, activePetId, setActivePetId, onAddPet, onEditPet, onShopFor }) {
  const pet = user.pets.find(p => p.id === activePetId);
  const recs = pet ? getRecommendations(pet, products).slice(0,3) : [];
  const petSubs = pet ? (user.subscriptions||[]).filter(s=>s.petId===pet.id) : [];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,...delay(0)}}>
        <h2 className="page-h2" style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700}}>My Pets</h2>
        <button onClick={onAddPet} style={{...btnSecondary,padding:"8px 14px",fontSize:13,display:"flex",alignItems:"center",gap:6}}><Plus s={14}/> Add Pet</button>
      </div>

      {user.pets.length === 0 ? (
        <div style={{...card,padding:40,textAlign:"center",...delay(.1)}}>
          <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🐕</div>
          <h3 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:600,marginBottom:8}}>No pets yet</h3>
          <p style={{color:"var(--muted)",fontSize:14,marginBottom:24,lineHeight:1.5}}>Add your first furry friend to get personalised food recommendations</p>
          <button onClick={onAddPet} style={{...btnPrimary,maxWidth:260,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Plus s={16}/> Add Your Dog</button>
        </div>
      ) : (
        <>
          {/* Pet chips */}
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginBottom:20,...delay(.05)}}>
            {user.pets.map((p,i)=>(
              <button key={p.id} onClick={()=>setActivePetId(p.id)} style={{
                padding:"12px 18px",borderRadius:16,display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap",
                background:activePetId===p.id?"var(--amber)":"var(--surface)",
                color:activePetId===p.id?"white":"var(--bark)",
                border:activePetId===p.id?"none":"1px solid var(--border)",
                fontWeight:600,fontSize:14,boxShadow:activePetId===p.id?"0 4px 14px rgba(212,145,42,.3)":"var(--shadow-sm)",
                transition:"all .25s",animation:`slideIn .35s ease ${i*.06}s both`
              }}>
                <span style={{fontSize:22}}>{DOG_SIZES.find(s=>s.id===p.size)?.emoji||"🐕"}</span>
                {p.name}
              </button>
            ))}
          </div>

          {/* Active pet */}
          {pet && (
            <>
              <div style={{...card,marginBottom:16,...delay(.1)}}>
                <div style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{display:"flex",gap:14,alignItems:"center"}}>
                      <div style={{width:56,height:56,borderRadius:16,background:"var(--amber-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>
                        {DOG_SIZES.find(s=>s.id===pet.size)?.emoji}
                      </div>
                      <div>
                        <h3 style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700}}>{pet.name}</h3>
                        <p style={{fontSize:13,color:"var(--muted)"}}>{pet.breed || "Mixed breed"} · {LIFE_STAGES.find(s=>s.id===pet.stage)?.label} · {DOG_SIZES.find(s=>s.id===pet.size)?.label}</p>
                      </div>
                    </div>
                    <button onClick={()=>onEditPet(pet)} style={{background:"none",padding:6,color:"var(--muted)"}}><Edit s={18}/></button>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:18}}>
                    <MiniStat label="Weight" value={pet.weight ? `${pet.weight} kg` : "—"} color="var(--amber)"/>
                    <MiniStat label="Activity" value={ACTIVITY_LEVELS.find(a=>a.id===pet.activity)?.label||"—"} color="var(--green)"/>
                    <MiniStat label="Daily Need" value={`${DOG_SIZES.find(s=>s.id===pet.size)?.daily||"?"}g`} color="var(--sky)"/>
                  </div>

                  {pet.healthTags?.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:14}}>
                      {pet.healthTags.map(t=><span key={t} style={{fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:20,background:"var(--green-bg)",color:"var(--green)"}}>{t}</span>)}
                    </div>
                  )}
                </div>

                {/* Active subscriptions for this pet */}
                {petSubs.length > 0 && (
                  <div style={{borderTop:"1px solid var(--border)",padding:"14px 20px",background:"var(--bg)"}}>
                    <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1,color:"var(--muted)",marginBottom:10}}>Active Subscriptions</div>
                    {petSubs.map(sub=>{
                      const product = products.find(p=>p.id===sub.productId);
                      return (
                        <div key={sub.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}}>
                          <span style={{fontSize:18}}>{product?.img}</span>
                          <span style={{flex:1,fontSize:13,fontWeight:500}}>{product?.name}</span>
                          <span style={{fontSize:13,fontWeight:600,color:"var(--amber)"}}>R{sub.monthlyPrice}/mo</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{padding:"12px 20px",borderTop:"1px solid var(--border)"}}>
                  <button onClick={()=>onShopFor(pet)} style={{...btnPrimary,padding:"11px 0",fontSize:14}}>🛒 Shop for {pet.name}</button>
                </div>
              </div>

              {/* Recommendations */}
              {recs.length > 0 && (
                <div style={delay(.2)}>
                  <p style={sectionTitle}>Recommended for {pet.name}</p>
                  <div className="recs-grid" style={{display:"flex",flexDirection:"column",gap:10}}>
                    {recs.map((r,i)=><ProductCard key={r.id} product={r} brands={brands} recommended i={i}/>) }
                  </div>
                </div>
              )}
            </>
          )}

          {!pet && user.pets.length > 0 && (
            <div style={{...card,padding:32,textAlign:"center",...delay(.1)}}>
              <p style={{color:"var(--muted)",fontSize:14}}>Select a pet above to view their profile & recommendations</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SHOP TAB ───────────────────────────────────────────
function ShopTab({ user, products, brands, shopPet, setShopPet, onSubscribe }) {
  const [brandFilter, setBrandFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(p => {
    if(brandFilter !== "all" && p.brand !== brandFilter) return false;
    if(tagFilter !== "all" && !p.tags.includes(tagFilter)) return false;
    if(search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if(shopPet && (!p.sizes.includes(shopPet.size) || !p.stages.includes(shopPet.stage))) return false;
    return true;
  });

  const recs = shopPet ? getRecommendations(shopPet, products) : [];
  const recIds = new Set(recs.slice(0,3).map(r=>r.id));

  return (
    <div>
      <h2 className="page-h2" style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700,marginBottom:4,...delay(0)}}>
        {shopPet ? `Food for ${shopPet.name}` : "All Products"}
      </h2>
      {shopPet && (
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,...delay(.03)}}>
          <span style={{fontSize:13,color:"var(--muted)"}}>Filtered for {shopPet.name}'s needs</span>
          <button onClick={()=>setShopPet(null)} style={{fontSize:12,color:"var(--amber)",background:"none",fontWeight:600,padding:0}}>Show all →</button>
        </div>
      )}

      {user.pets.length > 0 && !shopPet && (
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",...delay(.04)}}>
          <span style={{fontSize:13,color:"var(--muted)",alignSelf:"center",marginRight:4}}>Shop for:</span>
          {user.pets.map(p=>(
            <button key={p.id} onClick={()=>setShopPet(p)} style={{...btnSecondary,padding:"6px 14px",fontSize:12,display:"flex",alignItems:"center",gap:6}}>
              {DOG_SIZES.find(s=>s.id===p.size)?.emoji} {p.name}
            </button>
          ))}
        </div>
      )}

      <div style={{position:"relative",marginBottom:14,...delay(.05)}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{...input,paddingLeft:38}}/>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,opacity:.4}}>🔍</span>
      </div>

      <div style={{marginBottom:6,...delay(.07)}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6}}>
          <FilterPill active={brandFilter==="all"} onClick={()=>setBrandFilter("all")}>All Brands</FilterPill>
          {brands.map(b=><FilterPill key={b.id} active={brandFilter===b.id} onClick={()=>setBrandFilter(b.id)}>{b.logo} {b.name}</FilterPill>)}
        </div>
      </div>
      <div style={{marginBottom:18,...delay(.09)}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6}}>
          <FilterPill active={tagFilter==="all"} onClick={()=>setTagFilter("all")}>All Needs</FilterPill>
          {HEALTH_TAGS.map(t=><FilterPill key={t} active={tagFilter===t} onClick={()=>setTagFilter(t)}>{t}</FilterPill>)}
        </div>
      </div>

      <div className="products-grid" style={{display:"flex",flexDirection:"column",gap:12}}>
        {filteredProducts.length === 0 && (
          <div style={{textAlign:"center",padding:40,color:"var(--muted)",gridColumn:"1/-1"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔍</div>
            <p>No products match your filters</p>
          </div>
        )}
        {filteredProducts.map((p,i)=>(
          <ProductCard key={p.id} product={p} brands={brands} pet={shopPet} recommended={recIds.has(p.id)} onSelect={shopPet?()=>onSubscribe(p,shopPet):null} i={i}/>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, brands, pet, recommended, onSelect, i=0 }) {
  const brand = brands.find(b=>b.id===product.brand);
  return (
    <div style={{
      ...card,padding:16,
      border:recommended?"2px solid var(--amber)":"1px solid var(--border)",
      position:"relative",animation:`slideIn .35s ease ${i*.05}s both`,transition:"box-shadow .2s"
    }}>
      {recommended && <div style={{position:"absolute",top:-1,right:16,background:"var(--amber)",color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 8px 8px",textTransform:"uppercase",letterSpacing:.5}}>Recommended</div>}
      {product.bestseller && !recommended && <div style={{position:"absolute",top:-1,right:16,background:"var(--green)",color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 8px 8px",textTransform:"uppercase",letterSpacing:.5}}>Best Seller</div>}

      <div className="product-card-inner" style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <div className="product-img" style={{width:52,height:52,borderRadius:14,background:`${brand?.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
          {product.img}
        </div>
        <div className="product-body" style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <span style={{fontSize:10,fontWeight:600,color:brand?.color,textTransform:"uppercase",letterSpacing:.5}}>{brand?.name}</span>
          </div>
          <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{product.name}</div>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.4,marginBottom:8}}>{product.desc}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:"var(--amber)"}}>R{product.price}</span>
            <span style={{fontSize:12,color:"var(--muted)"}}>{product.size}kg</span>
            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:"var(--muted)"}}>
              <Star s={12} filled/> {product.rating} ({product.reviews})
            </span>
          </div>
          {product.tags.length > 0 && (
            <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
              {product.tags.map(t=><span key={t} style={{fontSize:10,padding:"3px 8px",borderRadius:12,background:"var(--bg2)",color:"var(--bark2)",fontWeight:500}}>{t}</span>)}
            </div>
          )}
        </div>
        {onSelect && (
          <button className="subscribe-btn" onClick={onSelect} style={{...btnPrimary,width:"auto",padding:"8px 14px",fontSize:12,flexShrink:0,alignSelf:"center"}}>Subscribe</button>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:active?600:400,whiteSpace:"nowrap",
      background:active?"var(--bark)":"var(--surface)",color:active?"white":"var(--bark)",
      border:active?"none":"1px solid var(--border)",transition:"all .2s"
    }}>{children}</button>
  );
}

// ─── SUBSCRIPTIONS TAB ──────────────────────────────────
function SubscriptionsTab({ user, setUser, token, products, brands }) {
  const subs = user.subscriptions || [];

  const cancelSub = async (id) => {
    if (!confirm("Cancel this subscription?")) return;
    try {
      await apiRequest(`/api/subscriptions/${id}/cancel`, { method: "POST", token });
      setUser(u => ({ ...u, subscriptions: u.subscriptions.filter(s => s.id !== id) }));
    } catch (err) {
      alert(err.message || "Could not cancel subscription");
    }
  };

  return (
    <div>
      <h2 className="page-h2" style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700,marginBottom:20,...delay(0)}}>Deliveries</h2>

      {subs.length === 0 ? (
        <div style={{...card,padding:40,textAlign:"center",...delay(.1)}}>
          <div style={{fontSize:48,marginBottom:12}}>📦</div>
          <h3 style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:600,marginBottom:8}}>No active subscriptions</h3>
          <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.5}}>Add a pet and subscribe to a product to get started</p>
        </div>
      ) : (
        <div className="subs-grid" style={{display:"flex",flexDirection:"column",gap:14}}>
          {subs.map((sub,i) => {
            const product = products.find(p=>p.id===sub.productId);
            const pet = user.pets.find(p=>p.id===sub.petId);
            const brand = brands.find(b=>b.id===product?.brand);
            const nextDel = new Date(sub.nextDelivery);
            const daysUntil = Math.max(0,Math.ceil((nextDel - new Date())/(86400000)));
            const bagDays = sub.bagDays;
            const daysSinceStart = Math.ceil((Date.now() - new Date(sub.startDate).getTime())/(86400000));
            const pctUsed = Math.min(100, Math.round((daysSinceStart / bagDays)*100));

            return (
              <div key={sub.id} style={{...card,animation:`fadeUp .4s ease ${i*.08}s both`}}>
                <div style={{padding:18}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:44,height:44,borderRadius:13,background:`${brand?.color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{product?.img}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{product?.name}</div>
                        <div style={{fontSize:12,color:"var(--muted)"}}>for {pet?.name||"—"} · {sub.dailyG}g/day</div>
                      </div>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:12,background:sub.status==="active"?"var(--green-bg)":"var(--bg2)",color:sub.status==="active"?"var(--green)":"var(--muted)"}}>{sub.status}</span>
                  </div>

                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12,color:"var(--muted)"}}>Bag usage</span>
                      <span style={{fontSize:12,fontWeight:600}}>{pctUsed}%</span>
                    </div>
                    <div style={{height:6,borderRadius:6,background:"var(--bg2)",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:6,background:`linear-gradient(90deg,var(--green),var(--green-light))`,width:`${pctUsed}%`,animation:"progressGrow .8s ease",transition:"width .5s"}}/>
                    </div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>~{Math.max(0,bagDays - daysSinceStart)} days remaining in current bag</div>
                  </div>

                  <div style={{background:"var(--bg)",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                    <div style={{color:"var(--amber)"}}><Truck s={22}/></div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>Next delivery</div>
                      <div style={{fontSize:12,color:"var(--muted)"}}>{nextDel.toLocaleDateString("en-ZA",{weekday:"short",month:"short",day:"numeric"})} · {daysUntil} days away</div>
                    </div>
                    <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:"var(--amber)"}}>R{sub.monthlyPrice}<span style={{fontSize:11,fontWeight:400,color:"var(--muted)"}}>/mo</span></span>
                  </div>

                  <button onClick={()=>cancelSub(sub.id)} style={{...btnSecondary,width:"100%",fontSize:13,color:"var(--rose)"}}>Cancel Subscription</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE TAB ────────────────────────────────────────
function ProfileTab({ user, setUser, token, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone||"");
  const [address, setAddress] = useState(user.address);

  const save = () => {
    const update = async () => {
      try {
        const result = await apiRequest("/api/auth/me", {
          method: "PUT",
          token,
          body: {
            name,
            email,
            phone,
            street_address: address,
          },
        });
        setUser(u => ({ ...u, ...mapUserFromApi(result.user, u.pets, u.subscriptions) }));
        setEditing(false);
      } catch (err) {
        alert(err.message || "Could not update profile");
      }
    };
    update();
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,...delay(0)}}>
        <h2 className="page-h2" style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700}}>Profile</h2>
        {!editing && <button onClick={()=>setEditing(true)} style={{...btnSecondary,padding:"8px 14px",fontSize:13,display:"flex",alignItems:"center",gap:6}}><Edit s={14}/> Edit</button>}
      </div>

      <div className="profile-grid" style={{marginBottom:16,...delay(.1)}}>
        {/* Left: personal info */}
        <div style={{...card,padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
            <div style={{width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,var(--amber),var(--amber-light))",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,boxShadow:"0 4px 14px rgba(212,145,42,.3)",flexShrink:0}}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{minWidth:0}}>
              {editing ? <input value={name} onChange={e=>setName(e.target.value)} style={{...input,fontWeight:600,fontSize:16,padding:"8px 12px",marginBottom:6}}/> : <div style={{fontWeight:700,fontSize:18,marginBottom:2}}>{user.name}</div>}
              {editing ? <input value={email} onChange={e=>setEmail(e.target.value)} style={{...input,fontSize:13,padding:"6px 12px"}}/> : <div style={{fontSize:13,color:"var(--muted)"}}>{user.email}</div>}
            </div>
          </div>
          <div style={{borderTop:"1px solid var(--border)",paddingTop:16}}>
            {editing ? (
              <>
                <Field label="Phone" value={phone} set={setPhone} placeholder="+27 82 123 4567"/>
                <Field label="Delivery Address" value={address} set={setAddress} placeholder="Full address"/>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setEditing(false)} style={btnSecondary}>Cancel</button>
                  <button onClick={save} style={{...btnPrimary,flex:1}}>Save Changes</button>
                </div>
              </>
            ) : (
              <>
                <div style={{marginBottom:16}}>
                  <div style={{...sectionTitle,marginBottom:4}}>Phone</div>
                  <p style={{fontSize:14,color:"var(--bark2)"}}>{user.phone||"Not set"}</p>
                </div>
                <div>
                  <div style={{...sectionTitle,marginBottom:4}}>Delivery Address</div>
                  <p style={{fontSize:14,color:"var(--bark2)",lineHeight:1.6}}>{user.address||"Not set"}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: stats + actions */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{...card,padding:24,...delay(.15)}}>
            <div style={{...sectionTitle,marginBottom:16}}>Account Overview</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <MiniStat label="Pets" value={user.pets.length} color="var(--amber)"/>
              <MiniStat label="Subscriptions" value={user.subscriptions?.length||0} color="var(--green)"/>
            </div>
            <MiniStat label="Monthly spend" value={`R${(user.subscriptions||[]).reduce((s,sub)=>s+sub.monthlyPrice,0)}`} color="var(--sky)"/>
          </div>
          <button onClick={onLogout} style={{...btnSecondary,width:"100%",color:"var(--rose)",borderColor:"var(--rose)",...delay(.2)}}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════
function ModalWrap({ title, onClose, children }) {
  return (
    <div className="modal-positioner" style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(45,31,20,.45)",backdropFilter:"blur(4px)"}}/>
      <div className="modal-sheet" style={{position:"relative",width:"100%",maxWidth:520,maxHeight:"92vh",background:"var(--bg)",borderRadius:"24px 24px 0 0",overflow:"auto",animation:"scaleIn .25s ease",padding:"0 0 env(safe-area-inset-bottom,20px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"var(--bg)",zIndex:2}}>
          <h3 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",padding:4,color:"var(--muted)"}}><X/></button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}

function PetFormModal({ pet, onSave, onClose, onDelete }) {
  const [name, setName] = useState(pet?.name || "");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [size, setSize] = useState(pet?.size || "");
  const [stage, setStage] = useState(pet?.stage || "");
  const [activity, setActivity] = useState(pet?.activity || "");
  const [weight, setWeight] = useState(pet?.weight || "");
  const [healthTags, setHealthTags] = useState(pet?.healthTags || []);

  const toggleTag = t => setHealthTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);
  const valid = name && size && stage && activity;

  return (
    <ModalWrap title={pet ? `Edit ${pet.name}` : "Add a Pet"} onClose={onClose}>
      <Field label="Name" value={name} set={setName} placeholder="Biscuit, Luna, Rex..." d={0}/>
      <SelectableBreedField value={breed} set={setBreed} d={.03}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Weight (kg)" value={weight} set={v=>setWeight(v.replace(/[^0-9.]/g,""))} placeholder="e.g. 15" d={.06}/>
        <div/>
      </div>

      <div style={{marginBottom:18,...delay(.09)}}>
        <label style={lbl}>Size</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
          {DOG_SIZES.map(s=>(
            <button key={s.id} onClick={()=>setSize(s.id)} style={{
              padding:"10px 4px",borderRadius:12,border:size===s.id?"2px solid var(--amber)":"1.5px solid var(--border)",
              background:size===s.id?"var(--amber-bg)":"var(--surface)",fontSize:11,fontWeight:size===s.id?600:400,
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .2s"
            }}>
              <span style={{fontSize:20}}>{s.emoji}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:18,...delay(.12)}}>
        <label style={lbl}>Life Stage</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {LIFE_STAGES.map(s=>(
            <button key={s.id} onClick={()=>setStage(s.id)} style={{
              padding:"12px 8px",borderRadius:12,border:stage===s.id?"2px solid var(--amber)":"1.5px solid var(--border)",
              background:stage===s.id?"var(--amber-bg)":"var(--surface)",fontSize:13,fontWeight:stage===s.id?600:400,
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .2s"
            }}>
              <span style={{fontSize:22}}>{s.icon}</span>{s.label}<span style={{fontSize:10,color:"var(--muted)"}}>{s.range}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:18,...delay(.15)}}>
        <label style={lbl}>Activity Level</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ACTIVITY_LEVELS.map(a=>(
            <button key={a.id} onClick={()=>setActivity(a.id)} style={{
              padding:"12px",borderRadius:12,border:activity===a.id?"2px solid var(--amber)":"1.5px solid var(--border)",
              background:activity===a.id?"var(--amber-bg)":"var(--surface)",textAlign:"left",
              display:"flex",alignItems:"center",gap:10,transition:"all .2s"
            }}>
              <span style={{fontSize:20}}>{a.icon}</span>
              <div><div style={{fontSize:13,fontWeight:activity===a.id?600:500}}>{a.label}</div><div style={{fontSize:11,color:"var(--muted)"}}>{a.desc}</div></div>
            </button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:24,...delay(.18)}}>
        <label style={lbl}>Health Needs <span style={{fontWeight:400,color:"var(--muted)"}}>(optional)</span></label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {HEALTH_TAGS.map(t=>(
            <button key={t} onClick={()=>toggleTag(t)} style={{
              padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:healthTags.includes(t)?600:400,
              background:healthTags.includes(t)?"var(--green)":"var(--surface)",
              color:healthTags.includes(t)?"white":"var(--bark)",
              border:healthTags.includes(t)?"none":"1px solid var(--border)",transition:"all .2s"
            }}>{t}</button>
          ))}
        </div>
      </div>

      <button onClick={()=>onSave({...(pet||{}),name,breed,size,stage,activity,weight:parseFloat(weight)||null,healthTags})} disabled={!valid} style={{...btnPrimary,opacity:valid?1:.4}}>
        {pet ? "Save Changes" : "Add Pet"}
      </button>

      {pet && onDelete && (
        <button onClick={onDelete} style={{...btnSecondary,width:"100%",marginTop:10,color:"var(--rose)",borderColor:"var(--rose)",fontSize:13}}>Remove {pet.name}</button>
      )}
    </ModalWrap>
  );
}

function SubscribeModal({ product, pet, onConfirm, onClose }) {
  const sizeObj = DOG_SIZES.find(s=>s.id===pet?.size);
  const [dailyG, setDailyG] = useState(sizeObj?.daily || 250);
  const bagDays = calcBagDays(product.size, dailyG);
  const monthlyBags = Math.ceil(30 / bagDays);
  const monthlyPrice = product.price * monthlyBags;
  const brand = BRANDS.find(b=>b.id===product.brand);
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => onConfirm(product.id, pet.id, dailyG), 1500);
  };

  return (
    <ModalWrap title="Start Subscription" onClose={onClose}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:24,...delay(0)}}>
        <div style={{width:52,height:52,borderRadius:14,background:`${brand?.color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{product.img}</div>
        <div>
          <div style={{fontWeight:600,fontSize:15}}>{product.name}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>for {pet?.name} · {product.size}kg bag</div>
        </div>
      </div>

      <div style={{marginBottom:24,...delay(.1)}}>
        <label style={lbl}>Daily feeding amount</label>
        <div style={{textAlign:"center",margin:"12px 0"}}>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:44,fontWeight:700,color:"var(--amber)"}}>{dailyG}</span>
          <span style={{fontSize:14,color:"var(--muted)",marginLeft:4}}>g/day</span>
        </div>
        <input type="range" min="50" max="800" step="10" value={dailyG} onChange={e=>setDailyG(+e.target.value)} style={{width:"100%",height:6,appearance:"none",WebkitAppearance:"none",borderRadius:3,background:`linear-gradient(to right,var(--amber) ${((dailyG-50)/750)*100}%,var(--border) ${((dailyG-50)/750)*100}%)`,outline:"none",cursor:"pointer"}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <span style={{fontSize:11,color:"var(--muted)"}}>50g</span>
          <span style={{fontSize:11,color:"var(--amber)",fontWeight:500}}>Recommended: ~{sizeObj?.daily}g</span>
          <span style={{fontSize:11,color:"var(--muted)"}}>800g</span>
        </div>
      </div>

      <div style={{background:"var(--bark)",borderRadius:18,padding:20,color:"white",marginBottom:24,...delay(.15)}}>
        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,opacity:.5,marginBottom:14}}>Summary</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <div><div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700}}>{bagDays}</div><div style={{fontSize:11,opacity:.5}}>days/bag</div></div>
          <div><div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700}}>{monthlyBags}</div><div style={{fontSize:11,opacity:.5}}>bags/mo</div></div>
          <div><div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:"var(--amber-glow)"}}>R{monthlyPrice}</div><div style={{fontSize:11,opacity:.5}}>per month</div></div>
        </div>
        <div style={{paddingTop:14,borderTop:"1px solid rgba(255,255,255,.1)",fontSize:13,opacity:.7,display:"flex",alignItems:"center",gap:8}}>
          <Truck s={18}/> New bag ships every ~{bagDays} days · Free delivery
        </div>
      </div>

      <button onClick={handleConfirm} disabled={processing} style={{
        ...btnPrimary,fontSize:16,
        background:processing?"linear-gradient(90deg,var(--amber),var(--amber-light),var(--amber))":btnPrimary.background,
        backgroundSize:processing?"200% 100%":"100%",
        animation:processing?"shimmer 1.5s infinite":"none"
      }}>
        {processing ? "Redirecting to payment..." : `Subscribe · R${monthlyPrice}/mo`}
      </button>
      <p style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:10}}>Cancel anytime · No lock-in · Free delivery</p>
    </ModalWrap>
  );
}

// ═══════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════
const lbl = {fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:6,display:"block"};

function Field({ label, value, set, placeholder, type="text", d=0 }) {
  return (
    <div style={{marginBottom:16,...(d!==undefined?delay(d):{})}} >
      <label style={lbl}>{label}</label>
      <input type={type} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} style={input}/>
    </div>
  );
}

function SelectableBreedField({ value, set, d=0 }) {
  return (
    <div style={{marginBottom:16,...(d!==undefined?delay(d):{})}}>
      <label style={lbl}>Breed</label>
      <input
        list="dog-breed-options"
        value={value}
        onChange={e=>set(e.target.value)}
        placeholder="Select or type a breed"
        style={input}
      />
      <datalist id="dog-breed-options">
        {DOG_BREEDS.map(breed => <option key={breed} value={breed} />)}
      </datalist>
    </div>
  );
}

function InfoBox({ icon, text, d=0 }) {
  return (
    <div style={{marginTop:16,background:"var(--green-bg)",border:"1px solid var(--green-light)",borderRadius:14,padding:16,display:"flex",alignItems:"flex-start",gap:12,...delay(d)}}>
      <span style={{fontSize:20}}>{icon}</span>
      <span style={{fontSize:13,color:"var(--bark2)",lineHeight:1.5}}>{text}</span>
    </div>
  );
}

function NavHeader({ onBack, title }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:"1px solid var(--border)",...delay(0)}}>
      <button onClick={onBack} style={{background:"none",padding:4,color:"var(--bark)",fontSize:18}}>←</button>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:8,background:"var(--amber)",display:"flex",alignItems:"center",justifyContent:"center"}}><Paw s={14} c="white"/></div>
        <span style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:600}}>{title}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{background:`${color}0A`,borderRadius:12,padding:"10px 12px",textAlign:"center"}}>
      <div style={{fontSize:11,color:"var(--muted)",marginBottom:3}}>{label}</div>
      <div style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:700,color}}>{value}</div>
    </div>
  );
}
