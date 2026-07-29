import { useState, useEffect, useRef, useCallback } from "react";
import {
  Eye, EyeOff, Search, Sprout, Beef, Wheat, Calendar, TrendingUp, TrendingDown, Minus, Leaf, Bug,
  Store, Phone, LifeBuoy, ShieldCheck, LayoutDashboard, Bell, Upload, Trash2,
  Pencil, X, ChevronLeft, ChevronRight, Plus, Check, MapPin, Clock, Mail,
  ExternalLink, GripVertical, ArrowUp, ArrowDown, ImageIcon, Star, Users,
  Package, ShieldAlert, Globe, Menu, LogOut, Download, Save, Camera,
  MessageCircle, Facebook, Instagram, Twitter, MessagesSquare, RotateCcw, Hourglass, HelpCircle,
} from "lucide-react";

/* ── ICON MAP ──
   Central place mapping the app's former emoji icons to lucide-react
   components, so every part of the app draws from one consistent,
   professional icon set. Pass size/color like any lucide icon: <Ic.search size={16}/> */
const Ic = {
  search: Search, farmer: Sprout, livestock: Beef, crops: Wheat, calendar: Calendar,
  prices: TrendingUp, tips: Leaf, pests: Bug, marketplace: Store, contact: Phone,
  support: LifeBuoy, admin: ShieldCheck, dashboard: LayoutDashboard, notifications: Bell,
  upload: Upload, delete: Trash2, edit: Pencil, close: X, prev: ChevronLeft, next: ChevronRight,
  add: Plus, check: Check, location: MapPin, hours: Clock, email: Mail, external: ExternalLink,
  grip: GripVertical, up: ArrowUp, down: ArrowDown, image: ImageIcon, star: Star, users: Users,
  listings: Package, alert: ShieldAlert, districts: Globe, menu: Menu, logout: LogOut,
  download: Download, save: Save, camera: Camera, show: Eye, hide: EyeOff,
  trendUp: TrendingUp, trendDown: TrendingDown, trendFlat: Minus, whatsapp: MessageCircle,
  facebook: Facebook, instagram: Instagram, twitter: Twitter, chat: MessagesSquare, refresh: RotateCcw,
  pending: Hourglass,
};


/* ── ENV ──
   Reads deployment credentials from the environment so switching from
   development (localStorage/local images) to production (Supabase +
   Cloudinary) never requires touching this file — only adding environment
   variables in your hosting provider. Works with Vite (import.meta.env),
   Create React App / Next.js (process.env), or a plain <script> global
   (window.__INKINGI_ENV__) if you're not using a bundler at all.
   See SETUP.md for the exact variable names to set and where to get them. */
const _readEnv = (name) => {
  try { if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[name]) return import.meta.env[name]; } catch {}
  try { if (typeof process !== "undefined" && process.env && process.env[name]) return process.env[name]; } catch {}
  try { if (typeof window !== "undefined" && window.__INKINGI_ENV__ && window.__INKINGI_ENV__[name]) return window.__INKINGI_ENV__[name]; } catch {}
  return "";
};
const ENV = {
  supabaseUrl:      _readEnv("VITE_SUPABASE_URL")       || _readEnv("NEXT_PUBLIC_SUPABASE_URL")       || _readEnv("REACT_APP_SUPABASE_URL"),
  supabaseAnonKey:  _readEnv("VITE_SUPABASE_ANON_KEY")  || _readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")  || _readEnv("REACT_APP_SUPABASE_ANON_KEY"),
  cloudinaryCloud:  _readEnv("VITE_CLOUDINARY_CLOUD")   || _readEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD")   || _readEnv("REACT_APP_CLOUDINARY_CLOUD"),
  cloudinaryPreset: _readEnv("VITE_CLOUDINARY_PRESET")  || _readEnv("NEXT_PUBLIC_CLOUDINARY_PRESET")  || _readEnv("REACT_APP_CLOUDINARY_PRESET"),
};
const HAS_SUPABASE   = Boolean(ENV.supabaseUrl && ENV.supabaseAnonKey);
const HAS_CLOUDINARY = Boolean(ENV.cloudinaryCloud && ENV.cloudinaryPreset);

/* ── AUTH ──
   Thin wrapper around Supabase's GoTrue REST API (no @supabase/supabase-js
   dependency required, consistent with the rest of this file's
   fetch-based approach). Handles email/password sign up, sign in, sign
   out, session persistence (in localStorage, exactly like the Supabase
   JS SDK itself does — this is a real, server-verified session token,
   not a value the app invents), and session restore on page load.
   RLS policies (see SETUP.md) check auth.uid() / auth.jwt() against this
   real session — unlike the old localStorage-only login, a session here
   cannot be forged by editing browser storage, because every request
   carries a JWT that Supabase verifies server-side. */
const AUTH_SESSION_KEY = "ik_auth_session";
const Auth = (() => {
  if (!HAS_SUPABASE) return null;
  const base = ENV.supabaseUrl + "/auth/v1";
  const h = { "Content-Type":"application/json", "apikey":ENV.supabaseAnonKey };
  const req = async (path, opts={}) => {
    const r = await fetch(base+path, {...opts, headers:{...h,...opts.headers}});
    const data = await r.json().catch(()=>({}));
    if (!r.ok) throw new Error(data.error_description||data.msg||data.error||"Authentication request failed");
    return data;
  };
  const getSession = () => { try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); } catch { return null; } };
  const saveSession = (session) => { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session)); };
  const clearSession = () => localStorage.removeItem(AUTH_SESSION_KEY);
  return {
    getSession, saveSession, clearSession,
    async signUp(email, password, metadata={}) {
      const data = await req("/signup", {method:"POST", body:JSON.stringify({email,password,data:metadata})});
      if (data.access_token) saveSession(data); // Supabase can return a session immediately if email confirmation is off
      return data;
    },
    async signIn(email, password) {
      const data = await req("/token?grant_type=password", {method:"POST", body:JSON.stringify({email,password})});
      saveSession(data);
      return data;
    },
    async signOut() {
      const s = getSession();
      if (s?.access_token) { try { await req("/logout", {method:"POST", headers:{Authorization:"Bearer "+s.access_token}}); } catch {} }
      clearSession();
    },
    async resetPassword(email) {
      return req("/recover", {method:"POST", body:JSON.stringify({email})});
    },
    // Called on app load to make sure a saved session is still valid and to
    // refresh it if the access token has expired but the refresh token hasn't.
    async restoreSession() {
      const s = getSession();
      if (!s?.access_token) return null;
      const expired = s.expires_at && Date.now()/1000 > s.expires_at;
      if (!expired) return s;
      if (!s.refresh_token) { clearSession(); return null; }
      try {
        const data = await req("/token?grant_type=refresh_token", {method:"POST", body:JSON.stringify({refresh_token:s.refresh_token})});
        saveSession(data);
        return data;
      } catch { clearSession(); return null; }
    },
  };
})();

/* ── STORAGE ADAPTER ── */
const SB = (() => {
  if (!HAS_SUPABASE) return null;
  const base = ENV.supabaseUrl+"/rest/v1";
  // Every request is sent with the anon key AND, when a user is logged in,
  // their real session's access token as the Bearer token. RLS policies
  // written against auth.uid()/auth.role() see the logged-in user this way
  // — without this, every request would look "anonymous" to Postgres no
  // matter who was logged in in the app, and admin-only RLS policies would
  // have no way to distinguish an admin from a stranger.
  const authHeaders = () => {
    const s = Auth?.getSession();
    return { "apikey":ENV.supabaseAnonKey, "Authorization":"Bearer "+(s?.access_token||ENV.supabaseAnonKey) };
  };
  const req = async (url, opts={}) => {
    const r = await fetch(url, {...opts, headers:{"Content-Type":"application/json",...authHeaders(),...opts.headers}});
    if (!r.ok) throw new Error(await r.text());
    const t = r.headers.get("content-type")||"";
    return t.includes("json") ? r.json() : r.text();
  };
  return {
    get:    (table, qs="")    => req(`${base}/${table}?${qs}`),
    post:   (table, body)     => req(`${base}/${table}`, {method:"POST", body:JSON.stringify(body), headers:{Prefer:"return=representation"}}),
    patch:  (table, qs, body) => req(`${base}/${table}?${qs}`, {method:"PATCH", body:JSON.stringify(body), headers:{Prefer:"return=representation"}}),
    del:    (table, qs)       => req(`${base}/${table}?${qs}`, {method:"DELETE"}),
    upsert: (table, body)     => req(`${base}/${table}`, {method:"POST", body:JSON.stringify(body), headers:{Prefer:"resolution=merge-duplicates,return=representation"}}),
  };
})();

const LS = {
  g: k => { try { return JSON.parse(localStorage.getItem("ik_"+k)||"null"); } catch { return null; } },
  s: (k,v) => localStorage.setItem("ik_"+k, JSON.stringify(v)),
};

/* Tracks whether the most recent remote (Supabase) write actually succeeded.
   The UI uses this (see Site Settings "Data & Sync" panel) to warn the admin
   instead of silently pretending a save reached the central database when it
   only landed in this browser's local cache. */
let lastSyncOk = true;
const getLastSyncOk = () => lastSyncOk;

const SA = {
  async getAll(table) {
    if (HAS_SUPABASE) {
      try {
        // Schema: each table is (id text primary key, data jsonb, created_at).
        // The row's actual fields live in `data`; unwrap them back into a
        // flat object with `id` attached, so every DB.* method in this file
        // keeps working with plain objects exactly as it did in dev mode.
        const raw = await SB.get(table,"select=id,data,created_at&order=created_at.asc");
        const rows = raw.map(r=>({...(r.data||{}), id:r.id}));
        lastSyncOk=true; LS.s(table, rows); return rows;
      } catch { lastSyncOk=false; /* fall through to local cache below */ }
    }
    return LS.g(table)||[];
  },
  // Full-table replace: every caller in this app passes the complete desired
  // array (adds, edits, AND removals already applied). Against Supabase this
  // must (a) upsert every row still present and (b) delete any row that used
  // to exist remotely but is no longer in `rows` — otherwise a delete made in
  // one browser would never disappear for anyone else using the site.
  async save(table, rows) {
    LS.s(table, rows); // keep the local cache current for instant UI + offline fallback
    if (!HAS_SUPABASE) { lastSyncOk=true; return; }
    try {
      const existing = await SB.get(table, "select=id");
      const keepIds = new Set(rows.map(r=>r.id));
      const toDelete = existing.filter(r=>!keepIds.has(r.id)).map(r=>r.id);
      if (toDelete.length) await SB.del(table, `id=in.(${toDelete.map(id=>encodeURIComponent(id)).join(",")})`);
      if (rows.length) {
        const payload = rows.map(({id,...rest})=>({id, data:rest}));
        await SB.upsert(table, payload);
      }
      lastSyncOk = true;
    } catch { lastSyncOk = false; }
  },
  async getKV(key) {
    if (HAS_SUPABASE) {
      try { const r=await SB.get("kv_store",`key=eq.${key}&select=value`); const v=r[0]?.value??null; lastSyncOk=true; if(v!==null) LS.s("kv_"+key, v); return v; }
      catch { lastSyncOk=false; }
    }
    return LS.g("kv_"+key);
  },
  async setKV(key, value) {
    LS.s("kv_"+key, value);
    if (!HAS_SUPABASE) { lastSyncOk=true; return; }
    try { await SB.upsert("kv_store",{key,value}); lastSyncOk=true; }
    catch { lastSyncOk=false; }
  },
  // One-time helper an admin can trigger from Site Settings once Supabase is
  // connected, to push whatever this browser has cached in localStorage up to
  // the database — useful the first time credentials are added after
  // developing locally, so existing content isn't lost.
  //
  // Deliberately does NOT push "farmers" — real farmer/admin accounts must
  // be genuine Supabase Auth users (see SETUP.md "Create your first admin
  // account"), not localStorage rows copied in directly, since those would
  // have no matching auth.users row and no real password. Farmer accounts
  // from development mode need to register for real in production.
  async pushLocalCacheToRemote() {
    if (!HAS_SUPABASE) return {ok:false,reason:"Supabase is not configured"};
    const tables = ["products","prices","tips","pests","calendar"];
    const kvKeys = ["ads","carousel","site"];
    const failures = [];
    for (const t of tables) {
      const rows = LS.g(t)||[];
      if (!rows.length) continue;
      try { await SB.upsert(t, rows.map(({id,...rest})=>({id, data:rest}))); }
      catch(e) { failures.push(`${t}: ${e.message||e}`); }
    }
    for (const k of kvKeys) {
      const v = LS.g("kv_"+k);
      if (v===null || v===undefined) continue;
      try { await SB.upsert("kv_store",{key:k,value:v}); }
      catch(e) { failures.push(`${k}: ${e.message||e}`); }
    }
    return failures.length ? {ok:false,reason:failures.join("; ")} : {ok:true};
  },
};

// `wholesalers` (see SCHEMA.sql) uses real typed columns (company_name,
// contact_name, district, sector, products_description, image_url, status),
// unlike the generic (id, data jsonb) shape every other table above uses —
// so it gets its own small read/write pair here instead of going through
// SA, whose getAll/save assume a `data` jsonb column that this table does
// not have. Falls back to localStorage the same way SA does when Supabase
// isn't configured, so wholesaler registration still works in dev mode.
const WS = {
  async getAll() {
    if (HAS_SUPABASE) {
      try {
        const rows = await SB.get("wholesalers", "select=*&order=created_at.asc");
        lastSyncOk = true; LS.s("wholesalers", rows); return rows;
      } catch { lastSyncOk = false; }
    }
    return LS.g("wholesalers") || [];
  },
  async add(row) {
    if (HAS_SUPABASE) {
      try {
        await SB.post("wholesalers", row);
        lastSyncOk = true;
        const cached = LS.g("wholesalers") || [];
        LS.s("wholesalers", [...cached, row]);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    const cached = LS.g("wholesalers") || [];
    LS.s("wholesalers", [...cached, row]);
    return {ok:true};
  },
};

const uploadImage = async (file) => {
  if (!(file instanceof File)) return file;
  if (HAS_CLOUDINARY) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", ENV.cloudinaryPreset);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${ENV.cloudinaryCloud}/image/upload`, {method:"POST",body:fd});
    if (!r.ok) throw new Error("Cloudinary upload failed");
    return (await r.json()).secure_url;
  }
  return new Promise((res,rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.onerror = () => rej(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
};

/* ── CONSTANTS ── */
const LOC={Kigali:{Gasabo:["Bumbogo","Kacyiru","Kimihurura","Kimironko","Remera"],Kicukiro:["Gahanga","Gatenga","Gikondo","Kagarama","Kicukiro"],Nyarugenge:["Gitega","Kigali","Kimisagara","Muhima","Nyamirambo"]},Eastern:{Bugesera:["Gashora","Mayange","Ntarama","Nyamata"],Nyagatare:["Gatunda","Karama","Matimba","Nyagatare","Tabagwe"],Rwamagana:["Fumbwe","Kigabiro","Muhazi","Musha"]},Northern:{Burera:["Bungwe","Butaro","Gahunga","Kinoni"],Gicumbi:["Byumba","Gicumbi","Muko","Rubaya"],Musanze:["Busogo","Kimonyi","Kinigi","Muhoza","Musanze"]},Southern:{Huye:["Gishamvu","Huye","Karama","Maraba","Simbi"],Muhanga:["Cyeza","Kabacuzi","Muhanga","Shyogwe"],Ruhango:["Bweramana","Byimana","Kinazi","Ruhango"]},Western:{Karongi:["Bwishyura","Gishyita","Rubengera"],Ngororero:["Bwira","Kabaya","Ngororero"],Rubavu:["Cyanzarwe","Gisenyi","Kanama","Rubavu"]}};
const CROPS=["Maize","Beans","Rice","Sorghum","Sweet Potato","Irish Potato","Cassava","Wheat","Groundnuts","Soybeans","Vegetables","Fruits","Coffee","Tea"];
const ANIMALS=["Cattle","Goats","Sheep","Pigs","Chickens","Rabbits","Fish","Honey/Bees","Ducks","Turkeys"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const SEVERITY={low:{label:"Low",color:"#16a34a",bg:"#dcfce7"},medium:{label:"Medium",color:"#d97706",bg:"#fef3c7"},high:{label:"High",color:"#dc2626",bg:"#fef2f2"},critical:{label:"Critical",color:"#7c3aed",bg:"#ede9fe"}};
const IMGS={Maize:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",Beans:"https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",Rice:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80","Irish Potato":"https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",Cassava:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",Vegetables:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",Fruits:"https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",Coffee:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",Tea:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80","Sweet Potato":"https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80",Cattle:"https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80",Goats:"https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&q=80",Sheep:"https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&q=80",Chickens:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80",default_crop:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",default_animal:"https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80"};

/* ── DESIGN TOKENS ── */
const G={
  g9:"#0a2e0a",g8:"#14451a",g7:"#1b5e20",g6:"#2e7d32",g5:"#388e3c",g3:"#66bb6a",g1:"#e8f5e9",g0:"#f7f9f7",
  pageBg:"#f7f9f7",cardBg:"#ffffff",sectionAlt:"#f0f4f0",
  gold:"#f59e0b",goldL:"#fef3c7",red:"#dc2626",redL:"#fef2f2",blue:"#1d4ed8",blueL:"#eff6ff",
  gray9:"#1a1f1a",gray7:"#374151",gray5:"#6b7280",gray3:"#d1d5db",gray1:"#f3f4f6",white:"#ffffff",
  sh:"0 1px 3px rgba(0,0,0,.07)",shM:"0 3px 8px rgba(0,0,0,.06)",shL:"0 8px 20px rgba(0,0,0,.07)",shXL:"0 16px 32px rgba(0,0,0,.09)",
  r:"12px",rL:"18px",
};
const FH="'Georgia',serif", FB="'Inter',system-ui,sans-serif";

/* ── SITE SETTINGS ── */
const DEFAULT_SITE={
  about:"Inkingi is Rwanda's digital agricultural marketplace connecting farmers, buyers, cooperatives, and agricultural stakeholders. The platform provides trusted market information, modern farming knowledge, pest and disease management resources, seasonal planting guidance, and a secure marketplace for agricultural products.",
  vision:"To become Rwanda's leading digital agriculture platform, empowering every farmer through technology, reliable information, and sustainable market access.",
  mission:"To improve agricultural productivity and farmer livelihoods by providing a trusted marketplace, accurate market prices, practical farming guidance, pest and disease information, and seasonal agricultural planning.",
  phone:"+250 788 835 195",address:"Kigali, Rwanda",hours:"Open 24 Hours / 7 Days a Week (24/7)",
  quickLinks:["Marketplace","Farmers","Market Prices","Farming Tips","Pest & Disease Center","Seasonal Planting Calendar"],
};
const QUICK_LINK_MAP={"Marketplace":"marketplace","Farmers":"farmers","Market Prices":"prices","Farming Tips":"tips","Pest & Disease Center":"pests","Seasonal Planting Calendar":"calendar"};

/* ── SEED DATA ── */
/* ⚠️ SECURITY NOTE: this is a fast, reversible checksum, not real password
   hashing (no salt, not cryptographic) — it was fine as a placeholder while
   everything lived in one browser's localStorage, but once "admins"/
   "farmers" rows live in a real shared Supabase database (readable via the
   anon key under the permissive RLS policy in SETUP.md), this is a genuine
   weak point: a stored password is not meaningfully protected. This was
   intentionally left as-is in this pass — real authentication (proper
   hashing + server-side session verification, so login can't be forged by
   editing browser storage) was explicitly scoped as a separate follow-up.
   Replace this with bcrypt/argon2 (server-side) or Supabase Auth before
   handling real user passwords in production. */
const hp=p=>{let h=0;for(let c of p)h=Math.imul(31,h)+c.charCodeAt(0)|0;return h.toString(36)+p.length};

/* Demo data for local development only (see DB.init — this never runs
   against a real Supabase database). The `pw` field here is just a
   placeholder for the old localStorage-only login and is unused once
   Supabase Auth is connected; real accounts are created via DB.register()
   (Auth.signUp) or directly in the Supabase dashboard, never from this
   array. */
const SEED_FARMERS=[
  {id:"f1",name:"Jean Baptiste Nkurunziza",phone:"0788111222",role:"farmer",fType:"abahinzi",status:"approved",pw:hp("farmer123"),district:"Eastern",sector:"Nyagatare",village:"Tabagwe",rating:4.5,rCount:12,bio:"Maize and beans specialist, 10+ years in Eastern Province."},
  {id:"f2",name:"Marie Claire Uwimana",phone:"0788333444",role:"farmer",fType:"aborozi",status:"approved",pw:hp("farmer123"),district:"Northern",sector:"Musanze",village:"Kinigi",rating:4.8,rCount:7,bio:"Premium cattle & goat farmer near Volcanoes National Park."},
  {id:"f3",name:"Emmanuel Habimana",phone:"0788555666",role:"farmer",fType:"abahinzi",status:"pending",pw:hp("farmer123"),district:"Southern",sector:"Huye",village:"Simbi",rating:0,rCount:0,bio:"Young vegetable farmer in Huye."},
];
const SEED_PRODUCTS=[
  {id:"p1",fid:"f1",fname:"Jean Baptiste",fphone:"0788111222",name:"Premium Maize (Ibigori)",type:"crop",sub:"Maize",price:350,desc:"Fresh quality maize from Nyagatare plains.",qty:500,unit:"kg",inStock:true,district:"Eastern",sector:"Nyagatare",village:"Tabagwe",views:245,featured:true,img1:"",img2:"",createdAt:new Date(Date.now()-864e5*4).toISOString()},
  {id:"p2",fid:"f2",fname:"Marie Claire",fphone:"0788333444",name:"Friesian Dairy Cattle",type:"animal",sub:"Cattle",price:850000,desc:"High milk-producing Friesian from Musanze.",qty:5,unit:"head",inStock:true,district:"Northern",sector:"Musanze",village:"Kinigi",views:189,featured:true,img1:"",img2:"",createdAt:new Date(Date.now()-864e5*3).toISOString()},
  {id:"p3",fid:"f1",fname:"Jean Baptiste",fphone:"0788111222",name:"Red Kidney Beans",type:"crop",sub:"Beans",price:550,desc:"Premium export-quality beans.",qty:200,unit:"kg",inStock:true,district:"Eastern",sector:"Nyagatare",village:"Tabagwe",views:134,featured:false,img1:"",img2:"",createdAt:new Date(Date.now()-864e5*2).toISOString()},
  {id:"p4",fid:"f2",fname:"Marie Claire",fphone:"0788333444",name:"Alpine Goats",type:"animal",sub:"Goats",price:65000,desc:"Healthy goats from Musanze highlands.",qty:12,unit:"head",inStock:true,district:"Northern",sector:"Musanze",village:"Kinigi",views:98,featured:false,img1:"",img2:"",createdAt:new Date(Date.now()-864e5).toISOString()},
  {id:"p5",fid:"f2",fname:"Marie Claire",fphone:"0788333444",name:"Rwanda Fine Coffee",type:"crop",sub:"Coffee",price:4500,desc:"Single-origin specialty coffee, cupping score 87+.",qty:50,unit:"kg",inStock:true,district:"Northern",sector:"Musanze",village:"Kinigi",views:312,featured:true,img1:"",img2:"",createdAt:new Date(Date.now()-3600e3*2).toISOString()},
];
const SEED_PRICES=[
  {id:"pr1",product:"Maize",category:"Crops",province:"Eastern",district:"Nyagatare",market:"Nyagatare Main Market",unit:"kg",current:320,previous:300,trend:"up",updatedAt:new Date().toISOString()},
  {id:"pr2",product:"Irish Potato",category:"Crops",province:"Northern",district:"Musanze",market:"Musanze Market",unit:"kg",current:280,previous:290,trend:"down",updatedAt:new Date().toISOString()},
  {id:"pr3",product:"Cattle",category:"Livestock",province:"Eastern",district:"Nyagatare",market:"Nyagatare Livestock Market",unit:"head",current:900000,previous:900000,trend:"stable",updatedAt:new Date().toISOString()},
  {id:"pr4",product:"Beans",category:"Crops",province:"Kigali",district:"Gasabo",market:"Kimironko Market",unit:"kg",current:580,previous:550,trend:"up",updatedAt:new Date().toISOString()},
  {id:"pr5",product:"Coffee",category:"Crops",province:"Northern",district:"Musanze",market:"Musanze CWS",unit:"kg",current:4800,previous:4500,trend:"up",updatedAt:new Date().toISOString()},
];
const SEED_TIPS=[
  {id:"t1",title:"Best Practices for Maize Farming in Rwanda",category:"Crops",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",content:"Maize is one of Rwanda's most important staple crops.\n\n**Soil Preparation:** Deep plowing (20-30cm) before planting helps root development.\n\n**Planting:** Plant at the start of the rainy season. Space plants 75cm between rows.\n\n**Fertilization:** Apply DAP at planting (50kg/ha), top-dress with Urea at 6 weeks.",author:"Admin",publishedAt:new Date(Date.now()-864e5*7).toISOString()},
  {id:"t2",title:"Improving Cattle Milk Production",category:"Livestock",image:"https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",content:"Dairy cattle management requires attention to nutrition and health.\n\n**Nutrition:** Ensure balanced feed including roughage and concentrates.\n\n**Health:** Vaccinate regularly against FMD, Anthrax, and Brucellosis.",author:"Admin",publishedAt:new Date(Date.now()-864e5*3).toISOString()},
];
const SEED_PESTS=[
  {id:"pe1",cropOrAnimal:"Maize",name:"Maize Stem Borer",images:["https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80"],symptoms:"Dead heart in young plants, windows in leaves, broken tassels.",causes:"Larvae of Busseola fusca moths bore into stems.",prevention:"Use certified seeds, early planting, crop rotation.",treatment:"Apply Karate or Cypermethrin at whorl stage.",severity:"high",category:"Crops"},
  {id:"pe2",cropOrAnimal:"Cattle",name:"East Coast Fever (ECF)",images:["https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80"],symptoms:"High fever, swollen lymph nodes, difficulty breathing.",causes:"Theileria parva parasite transmitted by brown ear ticks.",prevention:"Regular tick control using acaricides.",treatment:"Buparvaquone injection within 48 hours.",severity:"critical",category:"Livestock"},
];
const SEED_CALENDAR=[
  {id:"cal1",crop:"Maize",province:"Eastern",district:"Nyagatare",plantMonth:9,harvestMonth:1,growingDays:120,notes:"Best in well-drained soils."},
  {id:"cal2",crop:"Beans",province:"All",district:"",plantMonth:9,harvestMonth:12,growingDays:90,notes:"Season A. Intercrop with maize."},
  {id:"cal3",crop:"Irish Potato",province:"Northern",district:"Musanze",plantMonth:3,harvestMonth:6,growingDays:90,notes:"Highlands only. Spray against blight."},
  {id:"cal4",crop:"Coffee",province:"Western",district:"Karongi",plantMonth:3,harvestMonth:5,growingDays:730,notes:"Harvest season May. Full bearing after 3 years."},
];
const DEFAULT_CAROUSEL=[
  {id:"s1",type:"welcome",title:"Welcome to Inkingi",subtitle:"Rwanda's Premier Agricultural Marketplace",desc:"Connecting farmers, buyers, and agricultural opportunities across Rwanda.",image:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80",interval:6,published:true,scheduleStart:"",scheduleEnd:"",order:0},
  {id:"s2",type:"map",title:"Rwanda Agricultural Regions",subtitle:"Major farming zones across all 5 provinces",desc:"",interval:7,published:true,scheduleStart:"",scheduleEnd:"",order:1,regions:[{name:"Eastern Province",color:"#22c55e",crops:"Maize, Beans, Cassava, Rice"},{name:"Northern Province",color:"#3b82f6",crops:"Irish Potato, Wheat, Coffee"},{name:"Southern Province",color:"#f59e0b",crops:"Banana, Sorghum, Beans"},{name:"Western Province",color:"#8b5cf6",crops:"Coffee, Tea, Cassava"},{name:"Kigali City",color:"#ef4444",crops:"Vegetables, Fruits, Poultry"}]},
  {id:"s3",type:"crops",title:"Major Crops of Rwanda",subtitle:"Staple and export crops grown across the country",desc:"",interval:6,published:true,scheduleStart:"",scheduleEnd:"",order:2,items:[{name:"Coffee",image:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&q=80"},{name:"Maize",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80"},{name:"Sorghum",image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80"},{name:"Irish Potatoes",image:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80"},{name:"Beans",image:"https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=300&q=80"},{name:"Bananas",image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80"}]},
  {id:"s4",type:"livestock",title:"Livestock of Rwanda",subtitle:"Key animals raised by Rwandan farmers",desc:"",interval:6,published:true,scheduleStart:"",scheduleEnd:"",order:3,items:[{name:"Cattle",image:"https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&q=80"},{name:"Goats",image:"https://images.unsplash.com/photo-1524024973431-2ad916746881?w=300&q=80"},{name:"Sheep",image:"https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=300&q=80"},{name:"Pigs",image:"https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300&q=80"},{name:"Poultry",image:"https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&q=80"},{name:"Fish Farming",image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=80"}]},
];
const SEED_ADS=[
  {id:"ad1",title:"Rwanda Agricultural Bank",text:"Get affordable farm loans up to RWF 10M. Fast approval for registered farmers.",link:"#",image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",btnLabel:"Apply Now",active:true,order:0,scheduleStart:"",scheduleEnd:"",duration:5},
  {id:"ad2",title:"Agro-Input Suppliers Rwanda",text:"Quality seeds, fertilizers and pesticides delivered to your farm across all provinces.",link:"#",image:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",btnLabel:"Shop Now",active:true,order:1,scheduleStart:"",scheduleEnd:"",duration:5},
];

/* ── DATABASE ── */
const DB = {
  hp,
  async init() {
    // Seed public reference content only. Admin/user accounts are no longer
    // seeded here — with real Supabase Auth, accounts live in Supabase's own
    // auth.users table, created via DB.register()/signUp, or (for the first
    // admin) directly in the Supabase dashboard. See SETUP.md.
    const products = await SA.getAll("products");
    if (!products.length && !HAS_SUPABASE) {
      // Only auto-seed demo content in local dev mode (no Supabase configured)
      // so a fresh production database isn't silently filled with placeholder
      // farmers/products the admin didn't ask for.
      await SA.save("farmers",SEED_FARMERS);
      await SA.save("products",SEED_PRODUCTS);
      await SA.save("prices",SEED_PRICES);
      await SA.save("tips",SEED_TIPS);
      await SA.save("pests",SEED_PESTS);
      await SA.save("calendar",SEED_CALENDAR);
      await SA.setKV("ads",SEED_ADS);
      await SA.setKV("carousel",DEFAULT_CAROUSEL);
      await SA.setKV("site",DEFAULT_SITE);
    }
  },
  // Real authentication via Supabase Auth (email/password). On success,
  // loads this user's profile row from `farmers` (linked by id = auth
  // user id) so the rest of the app keeps working with the same
  // {id,name,phone,role,...} shape it always has — only how that identity
  // is verified has changed, not how it's used elsewhere in this file.
  async login(email,pw){
    if (!HAS_SUPABASE) return {err:"Authentication is not configured yet — see SETUP.md"};
    let session;
    try { session = await Auth.signIn(email,pw); }
    catch(e){ return {err:e.message||"Invalid email or password"}; }
    const uid = session.user?.id;
    const meta = session.user?.user_metadata || {};
    // Wholesaler accounts live in `wholesalers`, not `farmers` — check
    // there first (by role) so a wholesaler's profile is looked up (and,
    // below, rebuilt after an email-confirmation gap) in the right table.
    if (meta.role === "wholesaler") {
      const wholesalers = await WS.getAll();
      let wProfile = wholesalers.find(w=>w.id===uid);
      if (!wProfile) {
        // Same email-confirmation gap as the farmer path below: the
        // wholesalers row couldn't be inserted at registration time
        // because there was no active session yet, so it's rebuilt here
        // from the metadata that signUp preserved.
        wProfile = {
          id: uid, company_name: meta.name || email, contact_name: meta.name || email,
          email, phone: meta.phone || "", district: meta.district, sector: meta.sector,
          products_description: meta.bio, image_url: meta.image || "",
          status: "pending", created_at: new Date().toISOString(),
        };
        await WS.add(wProfile);
      }
      return {...wProfile, role:"wholesaler"};
    }
    const farmers = await SA.getAll("farmers");
    let profile = farmers.find(f=>f.id===uid);
    if (!profile) {
      // No profile row yet — this is either (a) someone who registered
      // through the app but is only now confirming their session for the
      // first time (their full registration form was preserved as
      // Supabase user_metadata by DB.register, since the profile row
      // couldn't be inserted until a real session existed), or (b) an
      // account created directly in the Supabase dashboard (e.g. the
      // first admin, per SETUP.md), which has no metadata at all.
      const cameFromRegistration = Object.keys(meta).length > 0;
      profile = {
        id: uid, email, name: meta.name || email, phone: meta.phone || "",
        role: meta.role || "farmer", fType: meta.fType, district: meta.district,
        sector: meta.sector, village: meta.village, bio: meta.bio,
        // A completed app registration should still require admin approval,
        // exactly as it always has — this fallback path only exists to
        // finish creating that same profile after the confirmation-email
        // gap, not to change the approval rule. An account with no
        // metadata (created directly in Supabase) is assumed intentional
        // and is approved immediately.
        status: cameFromRegistration ? "pending" : "approved",
        rating:0, rCount:0, createdAt:new Date().toISOString(),
      };
      await this.saveFarmers([...farmers, profile]);
    }
    return profile;
  },
  async logout(){ if (HAS_SUPABASE) await Auth.signOut(); },
  async resetPassword(email){
    if (!HAS_SUPABASE) return {err:"Authentication is not configured yet — see SETUP.md"};
    try { await Auth.resetPassword(email); return {ok:true}; }
    catch(e){ return {err:e.message||"Could not send reset email"}; }
  },
  // Restores a still-valid Supabase session on page load (e.g. after a
  // refresh) and returns the matching profile, or null if not logged in.
  async restoreSession(){
    if (!HAS_SUPABASE) return null;
    const session = await Auth.restoreSession();
    if (!session?.user?.id) return null;
    if (session.user?.user_metadata?.role === "wholesaler") {
      const wholesalers = await WS.getAll();
      const w = wholesalers.find(w=>w.id===session.user.id);
      return w ? {...w, role:"wholesaler"} : null;
    }
    const farmers = await SA.getAll("farmers");
    return farmers.find(f=>f.id===session.user.id) || null;
  },
  async farmers(){return SA.getAll("farmers")},
  async products(){return SA.getAll("products")},
  async prices(){return SA.getAll("prices")},
  async tips(){return SA.getAll("tips")},
  async pests(){return SA.getAll("pests")},
  async calendar(){return SA.getAll("calendar")},
  async ads(){return (await SA.getKV("ads"))||[]},
  async carousel(){return (await SA.getKV("carousel"))||DEFAULT_CAROUSEL},
  async site(){return (await SA.getKV("site"))||DEFAULT_SITE},
  async saveFarmers(v){await SA.save("farmers",v)},
  async saveProducts(v){await SA.save("products",v)},
  async savePrices(v){await SA.save("prices",v)},
  async saveTips(v){await SA.save("tips",v)},
  async savePests(v){await SA.save("pests",v)},
  async saveCalendar(v){await SA.save("calendar",v)},
  async saveAds(v){await SA.setKV("ads",v)},
  async saveCarousel(v){await SA.setKV("carousel",v)},
  async saveSite(v){await SA.setKV("site",v)},
  // Real registration: creates the Supabase Auth account first (this is
  // what makes the password real and login secure), then creates the
  // matching public profile row in `farmers`, linked by the same id so
  // RLS policies (e.g. "a farmer can only edit their own profile/products")
  // can check `id = auth.uid()`.
  //
  // `role` defaults to "farmer" (unchanged original behavior). Passing
  // role:"wholesaler" writes the profile row into `wholesalers` instead,
  // via WS.add — same auth.signUp step, same pending-approval status, same
  // email-confirmation handling; only the destination table differs.
  async register(d, role="farmer"){
    if (!HAS_SUPABASE) return {err:"Registration is not configured yet — see SETUP.md"};
    let session;
    const {pw,email,...profileFields}=d;
    try { session = await Auth.signUp(email, pw, {...profileFields, role}); }
    catch(e){ return {err:e.message||"Could not create account"}; }
    const uid = session.user?.id;
    if (!uid) return {err:"Could not create account"};
    if (!session.access_token) {
      // Email confirmation is required by this Supabase project's auth
      // settings — there is a real auth.users row now, but no active
      // session yet, so this browser is not authenticated as that user.
      // Inserting the profile row now would be rejected by the
      // insert_self RLS policy (auth.uid() would be null, not this user's
      // id). The rest of the registration form (name, phone, district,
      // etc.) was passed to signUp as user_metadata above, so it survives
      // this gap — DB.login rebuilds the full profile from it on first
      // successful login instead, once a real session exists.
      return {ok:true, pendingEmailConfirm:true};
    }
    if (role==="wholesaler") {
      const {name,district,sector,phone,bio,image}=profileFields;
      const nw={
        id:uid, company_name:name, contact_name:name, email, phone,
        district, sector, products_description:bio, image_url:image||"",
        status:"pending", created_at:new Date().toISOString(),
      };
      const r = await WS.add(nw);
      if (!r.ok) return {err:r.reason||"Could not save wholesaler profile"};
      return {ok:true};
    }
    const nf={...profileFields,id:uid,email,role:"farmer",status:"pending",rating:0,rCount:0,createdAt:new Date().toISOString()};
    await this.saveFarmers([...(await this.farmers()),nf]);
    return {ok:true};
  },
  async addProduct(d){const ps=await this.products();const np={...d,id:"p"+Date.now(),views:0,img1:d.img1||"",img2:d.img2||"",createdAt:new Date().toISOString()};await this.saveProducts([...ps,np]);return np},
  async updateProduct(id,d){await this.saveProducts((await this.products()).map(p=>p.id===id?{...p,...d}:p))},
  async deleteProduct(id){await this.saveProducts((await this.products()).filter(p=>p.id!==id))},
  async incView(id){await this.saveProducts((await this.products()).map(p=>p.id===id?{...p,views:(p.views||0)+1}:p))},
  async rateFarmer(fid,rating,sid){const rs=(await SA.getKV("ratings"))||[];if(rs.find(r=>r.fid===fid&&r.sid===sid))return{err:"Already rated"};const nrs=[...rs,{fid,rating,sid}];await SA.setKV("ratings",nrs);const fr=nrs.filter(r=>r.fid===fid);const avg=fr.reduce((s,r)=>s+r.rating,0)/fr.length;await this.saveFarmers((await this.farmers()).map(f=>f.id===fid?{...f,rating:Math.round(avg*10)/10,rCount:fr.length}:f));return{ok:true}},
  async setFarmerStatus(id,status){await this.saveFarmers((await this.farmers()).map(f=>f.id===id?{...f,status}:f))},
  async updateFarmer(id,patch){await this.saveFarmers((await this.farmers()).map(f=>f.id===id?{...f,...patch}:f))},
  async deleteFarmer(id){const[fs,ps]=await Promise.all([this.farmers(),this.products()]);await Promise.all([this.saveFarmers(fs.filter(f=>f.id!==id)),this.saveProducts(ps.filter(p=>p.fid!==id))])},
  async toggleFeatured(id){await this.saveProducts((await this.products()).map(p=>p.id===id?{...p,featured:!p.featured}:p))},
};

/* ════════════════════════════════════
   UI PRIMITIVES
════════════════════════════════════ */
function Stars({value,size=14,interactive,onChange}){
  const[hov,setHov]=useState(0);
  return(
    <span style={{display:"inline-flex",gap:1}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} onClick={()=>interactive&&onChange&&onChange(s)}
          onMouseEnter={()=>interactive&&setHov(s)} onMouseLeave={()=>interactive&&setHov(0)}
          style={{cursor:interactive?"pointer":"default",color:s<=(hov||Math.round(value||0))?"#f59e0b":"#d1d5db",lineHeight:1,display:"inline-flex"}}><Star size={size} fill="currentColor" strokeWidth={0}/></span>
      ))}
    </span>
  );
}

function Badge({children,color="green",style:s}){
  const m={green:{bg:"#dcfce7",c:"#15803d"},gold:{bg:G.goldL,c:"#92400e"},red:{bg:G.redL,c:G.red},gray:{bg:G.gray1,c:G.gray7},blue:{bg:G.blueL,c:G.blue}};
  const v=m[color]||m.green;
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"3px 9px",borderRadius:99,fontSize:11,fontWeight:700,background:v.bg,color:v.c,...s}}>{children}</span>;
}

function Btn({children,variant="primary",size="md",full,icon,onClick,style:s,disabled,type}){
  const sz={sm:{padding:"6px 12px",fontSize:12},md:{padding:"10px 20px",fontSize:14},lg:{padding:"14px 30px",fontSize:16}};
  const variants={primary:{bg:G.g6,c:G.white,hov:G.g7},secondary:{bg:G.white,c:G.g7,brd:`1.5px solid ${G.g6}`,hov:"#f0fdf4"},danger:{bg:G.red,c:G.white,hov:"#b91c1c"},ghost:{bg:"transparent",c:G.gray7,hov:G.gray1},gold:{bg:G.gold,c:G.white,hov:"#d97706"},blue:{bg:G.blue,c:G.white,hov:"#1e40af"}};
  const v=variants[variant]||variants.primary;
  return(
    <button type={type||"button"} onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",gap:5,border:v.brd||"none",background:v.bg,color:v.c,borderRadius:G.r,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:FB,width:full?"100%":undefined,justifyContent:full?"center":undefined,opacity:disabled?.6:1,transition:"all .2s",...sz[size],...s}}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.background=v.hov;if(variant==="primary")e.currentTarget.style.transform="translateY(-1px)"}}}
      onMouseLeave={e=>{e.currentTarget.style.background=v.bg;e.currentTarget.style.transform=""}}>
      {icon&&<span>{icon}</span>}{children}
    </button>
  );
}

function Inp({label,error,...p}){
  return(
    <div style={{marginBottom:13}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>{label}</label>}
      <input {...p} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${error?G.red:G.gray3}`,borderRadius:G.r,fontSize:14,outline:"none",fontFamily:FB,background:G.white,boxSizing:"border-box",...p.style}}
        onFocus={e=>{if(!error)e.target.style.borderColor=G.g5}}
        onBlur={e=>{if(!error)e.target.style.borderColor=G.gray3}}/>
      {error&&<p style={{margin:"3px 0 0",fontSize:12,color:G.red}}>{error}</p>}
    </div>
  );
}

/* ── PASSWORD SECURITY ── */
const PW_RULES=[
  {k:"len",label:"At least 8 characters",test:v=>v.length>=8},
  {k:"upper",label:"One uppercase letter (A-Z)",test:v=>/[A-Z]/.test(v)},
  {k:"lower",label:"One lowercase letter (a-z)",test:v=>/[a-z]/.test(v)},
  {k:"num",label:"One number (0-9)",test:v=>/[0-9]/.test(v)},
  {k:"special",label:"One special character (!@#$…)",test:v=>/[^A-Za-z0-9]/.test(v)},
];
const pwPasses=v=>PW_RULES.every(r=>r.test(v||""));

function PasswordInput({label,value,onChange,error,placeholder}){
  const[show,setShow]=useState(false);
  return(
    <div style={{marginBottom:13}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>{label}</label>}
      <div style={{position:"relative"}}>
        <input type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder}
          style={{width:"100%",padding:"9px 40px 9px 12px",border:`1.5px solid ${error?G.red:G.gray3}`,borderRadius:G.r,fontSize:14,outline:"none",fontFamily:FB,background:G.white,boxSizing:"border-box"}}
          onFocus={e=>{if(!error)e.target.style.borderColor=G.g5}}
          onBlur={e=>{if(!error)e.target.style.borderColor=G.gray3}}/>
        <button type="button" onClick={()=>setShow(s=>!s)} aria-label={show?"Hide password":"Show password"}
          style={{position:"absolute",right:4,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:6,color:G.gray5,lineHeight:1,display:"flex",alignItems:"center"}}>
          {show?<Ic.hide size={17}/>:<Ic.show size={17}/>}
        </button>
      </div>
      {error&&<p style={{margin:"3px 0 0",fontSize:12,color:G.red}}>{error}</p>}
    </div>
  );
}

function PasswordStrengthHints({value}){
  if(value===undefined)return null;
  return(
    <div style={{marginTop:-7,marginBottom:13,padding:"9px 11px",background:G.gray1,borderRadius:G.r}}>
      {PW_RULES.map(r=>{
        const ok=r.test(value||"");
        return(
          <div key={r.k} style={{display:"flex",alignItems:"center",gap:6,fontSize:11.5,color:ok?"#15803d":G.gray5,fontWeight:600,padding:"1.5px 0"}}>
            <span style={{display:"inline-flex",width:14,height:14,borderRadius:4,background:ok?"#15803d":"transparent",border:ok?"none":`1.5px solid ${G.gray3}`,alignItems:"center",justifyContent:"center",flexShrink:0}}>{ok&&<Ic.check size={10} color="#fff" strokeWidth={3}/>}</span>{r.label}
          </div>
        );
      })}
    </div>
  );
}

function Sel({label,children,...p}){
  return(
    <div style={{marginBottom:13}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>{label}</label>}
      <select {...p} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${G.gray3}`,borderRadius:G.r,fontSize:14,outline:"none",fontFamily:FB,background:G.white,boxSizing:"border-box",...p.style}}>{children}</select>
    </div>
  );
}

function Txt({label,...p}){
  return(
    <div style={{marginBottom:13}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>{label}</label>}
      <textarea {...p} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${G.gray3}`,borderRadius:G.r,fontSize:14,outline:"none",fontFamily:FB,background:G.white,minHeight:90,resize:"vertical",boxSizing:"border-box",...p.style}}
        onFocus={e=>e.target.style.borderColor=G.g5}
        onBlur={e=>e.target.style.borderColor=G.gray3}/>
    </div>
  );
}

function Modal({open,onClose,title,children,maxW=520}){
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(20,30,20,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div style={{background:G.white,borderRadius:G.rL,width:"100%",maxWidth:maxW,maxHeight:"92vh",overflowY:"auto",boxShadow:G.shXL}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 13px",borderBottom:`1px solid ${G.gray1}`}}>
          <h2 style={{margin:0,fontSize:16,fontWeight:800,color:G.gray9,fontFamily:FH}}>{title}</h2>
          <button onClick={onClose} style={{background:G.gray1,border:"none",width:30,height:30,borderRadius:8,cursor:"pointer",color:G.gray5,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16}/></button>
        </div>
        <div style={{padding:"16px 20px 20px"}}>{children}</div>
      </div>
    </div>
  );
}

function Toast({msg,type}){
  if(!msg)return null;
  const bg=type==="error"?G.red:type==="warn"?"#d97706":G.g6;
  const StatusIcon=type==="error"?X:type==="warn"?Ic.alert:Ic.check;
  return(
    <div style={{position:"fixed",top:16,right:16,background:bg,color:G.white,padding:"12px 16px",borderRadius:G.r,boxShadow:G.shXL,zIndex:9999,fontWeight:600,fontSize:13,display:"flex",gap:7,alignItems:"center",maxWidth:300,fontFamily:FB}}>
      <StatusIcon size={15}/> {msg}
    </div>
  );
}

function LocPicker({district,sector,village,onChange}){
  const provinces=Object.keys(LOC);
  const sectors=district?Object.keys(LOC[district]||{}):[];
  const villages=(district&&sector)?(LOC[district]?.[sector]||[]):[];
  return(
    <>
      <Sel label="Province" value={district} onChange={e=>onChange(e.target.value,"","")}>
        <option value="">All Provinces</option>
        {provinces.map(d=><option key={d} value={d}>{d}</option>)}
      </Sel>
      <Sel label="District" value={sector} onChange={e=>onChange(district,e.target.value,"")} disabled={!district}>
        <option value="">All Districts</option>
        {sectors.map(s=><option key={s} value={s}>{s}</option>)}
      </Sel>
      <Sel label="Sector" value={village} onChange={e=>onChange(district,sector,e.target.value)} disabled={!sector}>
        <option value="">All Sectors</option>
        {villages.map(v=><option key={v} value={v}>{v}</option>)}
      </Sel>
    </>
  );
}

/* ── IMAGE UPLOAD ── */
function ImageUpload({label,value,onChange,placeholder}){
  const[preview,setPreview]=useState(value||"");
  const[uploading,setUploading]=useState(false);
  useEffect(()=>setPreview(value||""),[value]);
  const handleFile=async e=>{
    const file=e.target.files[0];
    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){alert("Only JPG, PNG, WebP allowed");return}
    setUploading(true);
    try{const url=await uploadImage(file);setPreview(url);onChange(url)}
    catch(err){alert("Upload failed: "+err.message)}
    finally{setUploading(false)}
  };
  const handleUrl=v=>{setPreview(v);onChange(v)};
  const clear=()=>{setPreview("");onChange("")};
  return(
    <div style={{marginBottom:13}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>{label}</label>}
      {!HAS_CLOUDINARY&&<p style={{margin:"0 0 5px",fontSize:11,color:"#d97706",fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Ic.alert size={12}/> No Cloudinary — images stored locally</p>}
      {preview
        ?<div style={{position:"relative",borderRadius:G.r,overflow:"hidden",height:130,background:G.gray1}}>
            <img src={preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setPreview("")}/>
            <button onClick={clear} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.6)",color:G.white,border:"none",width:26,height:26,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.close size={14}/></button>
          </div>
        :<div style={{border:`2px dashed ${G.gray3}`,borderRadius:G.r,padding:"16px",textAlign:"center",background:G.g0}}>
            <div style={{marginBottom:5,color:G.gray5,display:"flex",justifyContent:"center"}}><Ic.camera size={26}/></div>
            <p style={{fontSize:12,color:G.gray5,margin:"0 0 8px"}}>{placeholder||"Upload or paste URL"}</p>
            <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
              <label style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:uploading?G.gray1:G.g1,borderRadius:8,cursor:uploading?"not-allowed":"pointer",fontSize:12,fontWeight:600,color:G.g7,border:`1px solid ${G.gray3}`,opacity:uploading?.6:1}}>
                {uploading?"Uploading…":<><Ic.upload size={13}/> Browse</>}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} style={{display:"none"}} disabled={uploading}/>
              </label>
              <Inp placeholder="Paste image URL…" style={{margin:0,flex:1,minWidth:140,padding:"6px 10px",fontSize:12}} onChange={e=>handleUrl(e.target.value)}/>
            </div>
          </div>}
    </div>
  );
}

/* ── FARMER AVATAR (photo with emoji fallback) ── */
function FarmerPhoto({farmer,size=48,radius=12}){
  const[err,setErr]=useState(false);
  if(farmer?.photoUrl&&!err){
    return <img src={farmer.photoUrl} alt={farmer.name} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:radius,objectFit:"cover",flexShrink:0}}/>;
  }
  return(
    <div style={{width:size,height:size,background:G.g1,borderRadius:radius,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,flexShrink:0}}>
      {farmer?.fType==="aborozi"?<Ic.livestock size={size*0.42} color={G.g6}/>:<Ic.farmer size={size*0.42} color={G.g6}/>}
    </div>
  );
}

/* ── PRODUCT DISPLAY ── */
function PImg({product,h=200,detail=false}){
  const[err,setErr]=useState(false);
  const imgSrc=detail?(product.img2||product.img1||""):(product.img1||"");
  const fallback=IMGS[product.sub]||(product.type==="crop"?IMGS.default_crop:IMGS.default_animal);
  const src=imgSrc||fallback;
  return(
    <div style={{height:h,background:product.type==="crop"?"#f1f8e9":"#e8f4fd",overflow:"hidden",position:"relative",flexShrink:0,borderRadius:"inherit"}}>
      {!err
        ?<img className="ik-card-img" src={src} alt={product.name} onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:G.g5}}>{product.type==="crop"?<Ic.crops size={40}/>:<Ic.livestock size={40}/>}</div>}
      {product.featured&&<div style={{position:"absolute",top:8,left:8}}><Badge color="gold"><Ic.star size={11}/> Featured</Badge></div>}
    </div>
  );
}

function PCard({product:p,user,onView,onEdit,onDel,onFeat}){
  const isOwner=user?.id===p.fid, isAdmin=user?.role==="admin";
  return(
    <div className="ik-card" style={{background:G.white,borderRadius:G.rL,overflow:"hidden",boxShadow:G.sh,border:`1px solid ${G.gray1}`,display:"flex",flexDirection:"column"}}>
      <div style={{cursor:"pointer"}} onClick={()=>onView(p)}>
        <PImg product={p}/>
        <div style={{padding:"13px 14px 9px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6,marginBottom:4}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:G.gray9,lineHeight:1.3,fontFamily:FH,flex:1}}>{p.name}</h3>
            <Badge color={p.inStock?"green":"gray"}>{p.inStock?"In Stock":"Out"}</Badge>
          </div>
          <p style={{margin:"0 0 5px",fontSize:19,fontWeight:800,color:G.g7,fontFamily:FH}}>RWF {p.price?.toLocaleString()}<span style={{fontSize:12,fontWeight:400,color:G.gray5}}>/{p.unit}</span></p>
          <p style={{margin:"0 0 3px",fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4}}><Ic.location size={11}/> {p.sector}, {p.district}</p>
          <p style={{margin:0,fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4}}><Ic.users size={11}/> {p.views} views · {p.fname}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:5,padding:"9px 13px",borderTop:`1px solid ${G.gray1}`,marginTop:"auto",flexWrap:"wrap"}}>
        <Btn size="sm" style={{flex:1,justifyContent:"center",fontSize:11}} onClick={()=>onView(p)} icon={<Ic.contact size={13}/>}>Contact</Btn>
        {(isOwner||isAdmin)&&(
          <>
            {isAdmin&&<Btn size="sm" variant="gold" onClick={e=>{e.stopPropagation();onFeat&&onFeat(p)}} icon={<Ic.star size={14}/>}/>}
            <Btn size="sm" variant="secondary" onClick={e=>{e.stopPropagation();onEdit&&onEdit(p)}} icon={<Ic.edit size={14}/>}/>
            <Btn size="sm" variant="danger" onClick={e=>{e.stopPropagation();onDel&&onDel(p)}} icon={<Ic.delete size={14}/>}/>
          </>
        )}
      </div>
    </div>
  );
}

/* ── PRODUCT FORM ── */
function PForm({initial,farmer,onSave,onCancel}){
  const[f,setF]=useState(initial||{name:"",type:"crop",sub:"",price:"",desc:"",qty:"",unit:"kg",inStock:true,district:farmer?.district||"",sector:farmer?.sector||"",village:farmer?.village||"",img1:"",img2:""});
  const[errs,setErrs]=useState({});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const validate=()=>{const e={};if(!f.name.trim())e.name="Required";if(!f.price||isNaN(f.price)||f.price<=0)e.price="Enter valid price";if(!f.sub)e.sub="Select type";setErrs(e);return Object.keys(e).length===0};
  const submit=()=>{if(!validate())return;onSave({...f,price:parseFloat(f.price),qty:parseFloat(f.qty)||0,fid:farmer?.id,fname:farmer?.name,fphone:farmer?.phone})};
  const types=f.type==="crop"?CROPS:ANIMALS;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{gridColumn:"1/-1"}}><Inp label="Product Name *" value={f.name} onChange={e=>set("name",e.target.value)} error={errs.name}/></div>
        <Sel label="Category" value={f.type} onChange={e=>set("type",e.target.value)}><option value="crop">Crops</option><option value="animal">Livestock</option></Sel>
        <Sel label="Type *" value={f.sub} onChange={e=>set("sub",e.target.value)} style={{borderColor:errs.sub?G.red:undefined}}><option value="">Select…</option>{types.map(x=><option key={x} value={x}>{x}</option>)}</Sel>
        <Inp label="Price (RWF) *" type="number" value={f.price} onChange={e=>set("price",e.target.value)} error={errs.price}/>
        <div style={{display:"flex",gap:7}}>
          <div style={{flex:1}}><Inp label="Quantity" type="number" value={f.qty} onChange={e=>set("qty",e.target.value)}/></div>
          <Sel label="Unit" value={f.unit} onChange={e=>set("unit",e.target.value)} style={{width:90}}>{"kg,head,liter,piece,ton,bag,box,crate".split(",").map(u=><option key={u} value={u}>{u}</option>)}</Sel>
        </div>
      </div>
      <Txt label="Description" value={f.desc} onChange={e=>set("desc",e.target.value)}/>
      <ImageUpload label="Main Image (cards & homepage)" value={f.img1} onChange={v=>set("img1",v)} placeholder="Main product photo"/>
      <ImageUpload label="Detail Image (full view only)" value={f.img2} onChange={v=>set("img2",v)} placeholder="Detail/secondary photo"/>
      <label style={{display:"flex",alignItems:"center",gap:9,marginBottom:13,cursor:"pointer"}}>
        <div style={{width:40,height:21,background:f.inStock?G.g5:G.gray3,borderRadius:99,position:"relative",transition:"background .2s"}} onClick={()=>set("inStock",!f.inStock)}>
          <div style={{width:17,height:17,background:G.white,borderRadius:99,position:"absolute",top:2,left:f.inStock?21:2,transition:"left .2s",boxShadow:G.sh}}/>
        </div>
        <span style={{fontSize:13,fontWeight:600,color:G.gray7}}>{f.inStock?"In Stock":"Out of Stock"}</span>
      </label>
      <LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>setF(x=>({...x,district:d,sector:s,village:v}))}/>
      <div style={{display:"flex",gap:9,marginTop:6}}>
        <Btn onClick={submit} full>{initial?"Save Changes":"List Product"}</Btn>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
}

/* ── AUTH MODALS ── */
function LoginModal({open,onClose,onLogin,onGoReg,onResetPassword}){
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const[resetMode,setResetMode]=useState(false);const[resetMsg,setResetMsg]=useState("");
  const submit=async()=>{setErr("");setBusy(true);const r=await onLogin(email,pw);if(r?.err)setErr(r.err);setBusy(false)};
  const submitReset=async()=>{
    setBusy(true);setResetMsg("");
    const r=await onResetPassword(email);
    setResetMsg(r?.err?r.err:"If that email has an account, a reset link has been sent.");
    setBusy(false);
  };
  if(resetMode) return(
    <Modal open={open} onClose={()=>{onClose();setResetMode(false);setResetMsg("")}} title="Reset Password">
      {resetMsg&&<div style={{background:resetMsg.includes("sent")?G.g1:G.redL,color:resetMsg.includes("sent")?G.g7:G.red,padding:"8px 12px",borderRadius:G.r,marginBottom:12,fontSize:13,fontWeight:600}}>{resetMsg}</div>}
      <Inp label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
      <Btn full onClick={submitReset} disabled={busy||!email}>{busy?"Sending…":"Send Reset Link"}</Btn>
      <p style={{textAlign:"center",marginTop:11,fontSize:13,color:G.gray5}}>
        <button onClick={()=>{setResetMode(false);setResetMsg("")}} style={{color:G.g6,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>Back to Sign In</button>
      </p>
    </Modal>
  );
  return(
    <Modal open={open} onClose={onClose} title="Sign In">
      {err&&<div style={{background:G.redL,color:G.red,padding:"8px 12px",borderRadius:G.r,marginBottom:12,fontSize:13,fontWeight:600}}>{err}</div>}
      <Inp label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
      <PasswordInput label="Password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"/>
      <p style={{textAlign:"right",margin:"-8px 0 13px"}}>
        <button onClick={()=>setResetMode(true)} style={{color:G.gray5,fontSize:12,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>Forgot password?</button>
      </p>
      <Btn full onClick={submit} disabled={busy||!email||!pw}>{busy?"Signing in…":"Sign In"}</Btn>
      <p style={{textAlign:"center",marginTop:11,fontSize:13,color:G.gray5}}>
        New here? <button onClick={()=>{onClose();onGoReg()}} style={{color:G.g6,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>Register</button>
      </p>
    </Modal>
  );
}

// Shown first when Register is pressed, before either registration form.
// Per spec: no second Register button anywhere else — this choice only
// appears once Register has already been clicked.
function RoleChoiceModal({open,onClose,onChoose,site}){
  return(
    <Modal open={open} onClose={onClose} title="Join Inkingi">
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{width:56,height:56,borderRadius:14,overflow:"hidden",boxShadow:G.sh}}><Logo size={56} site={site}/></div>
      </div>
      <p style={{fontSize:13,color:G.gray6,textAlign:"center",margin:"0 0 16px",fontFamily:FB}}>How would you like to register?</p>
      <Btn full variant="gold" onClick={()=>onChoose("farmer")} icon={<Ic.farmer size={16}/>} style={{fontSize:15,padding:"13px 20px",marginBottom:10}}>Register as Farmer</Btn>
      <Btn full variant="secondary" onClick={()=>onChoose("wholesaler")} icon={<Ic.marketplace size={16}/>} style={{fontSize:15,padding:"13px 20px"}}>Register as Wholesaler</Btn>
    </Modal>
  );
}

function RegModal({open,onClose,onRegister,site,role="farmer"}){
  const isWholesaler=role==="wholesaler";
  const[f,setF]=useState({name:"",email:"",phone:"",fType:"abahinzi",pw:"",pw2:"",district:"",sector:"",village:"",bio:"",image:""});
  const[errs,setErrs]=useState({});const[busy,setBusy]=useState(false);
  // Reset the form whenever the modal switches role or re-opens, so
  // leftover farmer/wholesaler-only field values from a previous open
  // don't get silently carried over into the other role's submission.
  useEffect(()=>{if(open){setF({name:"",email:"",phone:"",fType:"abahinzi",pw:"",pw2:"",district:"",sector:"",village:"",bio:"",image:""});setErrs({})}},[open,role]);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const submit=async()=>{
    const e={};
    if(!f.name.trim())e.name="Required";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))e.email="Enter a valid email address";
    if(!/^07\d{8}$/.test(f.phone))e.phone="Format: 07XXXXXXXX";
    if(!pwPasses(f.pw))e.pw="Password does not meet all requirements below";
    else if(f.pw2!==f.pw)e.pw2="Passwords do not match";
    if(!f.district)e.district="Required";
    if(isWholesaler&&!f.sector)e.sector="Required";
    setErrs(e);if(Object.keys(e).length>0)return;
    setBusy(true);
    const{pw2,fType,village,...rest}=f;
    // Wholesalers don't have a farming type or village field in the
    // wholesalers table — only send what's relevant to each role.
    const payload = isWholesaler ? rest : {...rest,fType,village};
    const r=await onRegister(payload,role);
    if(r?.err)setErrs({email:r.err});
    setBusy(false);
  };
  return(
    <Modal open={open} onClose={onClose} title={isWholesaler?"Join as Wholesaler":"Join as Farmer"}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{width:56,height:56,borderRadius:14,overflow:"hidden",boxShadow:G.sh}}><Logo size={56} site={site}/></div>
      </div>
      <Inp label="Full Name *" value={f.name} onChange={e=>set("name",e.target.value)} error={errs.name}/>
      <Inp label="Email *" value={f.email} onChange={e=>set("email",e.target.value)} error={errs.email} type="email" placeholder="you@example.com"/>
      <Inp label="Phone *" value={f.phone} onChange={e=>set("phone",e.target.value)} error={errs.phone} type="tel" placeholder="07XXXXXXXX"/>
      {!isWholesaler&&
        <Sel label="Farming Type" value={f.fType} onChange={e=>set("fType",e.target.value)}>
          <option value="abahinzi">Abahinzi — Crops</option>
          <option value="aborozi">Aborozi — Livestock</option>
        </Sel>}
      <PasswordInput label="Password *" value={f.pw} onChange={e=>set("pw",e.target.value)} error={errs.pw} placeholder="Create a strong password"/>
      <PasswordStrengthHints value={f.pw}/>
      <PasswordInput label="Confirm Password *" value={f.pw2} onChange={e=>set("pw2",e.target.value)} error={errs.pw2} placeholder="Re-enter password"/>
      <Txt label={isWholesaler?"Description of products sold":"Bio"} value={f.bio} onChange={e=>set("bio",e.target.value)} style={{minHeight:65}}/>
      {isWholesaler&&
        <ImageUpload label="Photo representing what you sell" value={f.image} onChange={v=>set("image",v)}/>}
      <LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>setF(x=>({...x,district:d,sector:s,village:v}))}/>
      {errs.district&&<p style={{fontSize:12,color:G.red,marginTop:-8,marginBottom:11}}>{errs.district}</p>}
      {errs.sector&&<p style={{fontSize:12,color:G.red,marginTop:-8,marginBottom:11}}>{errs.sector}</p>}
      <Btn full variant="gold" onClick={submit} disabled={busy||!pwPasses(f.pw)||f.pw2!==f.pw} style={{fontSize:15,padding:"13px 20px",boxShadow:"0 4px 14px rgba(245,158,11,.35)"}}>{busy?"Submitting…":"Register"}</Btn>
    </Modal>
  );
}

/* ── LEGAL / SUPPORT MODALS ── */
function LegalSection({title,children}){
  return(
    <div style={{marginBottom:16}}>
      <h3 style={{margin:"0 0 7px",fontSize:14,fontWeight:800,color:G.gray9,fontFamily:FH}}>{title}</h3>
      <div style={{fontSize:13,color:G.gray7,lineHeight:1.7}}>{children}</div>
    </div>
  );
}
function LegalList({items}){
  return(
    <ul style={{margin:"0 0 0 18px",padding:0}}>
      {items.map((it,i)=><li key={i} style={{marginBottom:5}}>{it}</li>)}
    </ul>
  );
}

function TermsModal({open,onClose}){
  return(
    <Modal open={open} onClose={onClose} title="Terms of Use" maxW={640}>
      <LegalSection title="Using Inkingi Responsibly">
        <LegalList items={[
          "Everyone is welcome to use the Inkingi platform responsibly.",
          "Users are responsible for protecting their account credentials.",
          "Buyers and sellers must provide truthful information.",
          "Users should verify products, livestock, sellers, buyers and payment details before completing transactions.",
          "Inkingi provides a digital agricultural marketplace but cannot guarantee every transaction.",
          "Users must use the platform honestly and respectfully.",
          "Fraud, scams, fake listings, impersonation, identity theft, hacking attempts, misinformation, abusive behaviour and illegal activities are strictly prohibited.",
        ]}/>
      </LegalSection>
      <LegalSection title="Fraud Prevention">
        <p style={{marginBottom:8}}>Inkingi is committed to providing a safe and trustworthy agricultural marketplace.</p>
        <p style={{marginBottom:8}}>Users are responsible for verifying the identity, products, livestock, services and payment information of anyone they choose to transact with.</p>
        <p style={{marginBottom:8}}>Any user found engaging in fraud, scams, fake listings, impersonation, identity theft, misinformation or criminal activity may have their account permanently suspended or terminated.</p>
        <p style={{marginBottom:8}}>Where there is reasonable evidence of criminal activity, Inkingi may report the matter to the Rwanda National Police or other competent authorities for investigation in accordance with the laws of the Republic of Rwanda.</p>
        <p style={{margin:0}}>By using Inkingi, every user agrees to act honestly, responsibly and in compliance with the laws of Rwanda.</p>
      </LegalSection>
    </Modal>
  );
}

function PrivacyModal({open,onClose}){
  return(
    <Modal open={open} onClose={onClose} title="Privacy Policy" maxW={640}>
      <LegalSection title="Information We Collect">
        <LegalList items={["Name, phone number, and location (district, sector, village)","Farmer or buyer profile details, product and livestock listings","Basic usage data such as pages visited and searches performed"]}/>
      </LegalSection>
      <LegalSection title="Why We Collect It">
        <LegalList items={["To operate and improve the marketplace","To verify farmer and buyer identities","To connect buyers with sellers","To provide market prices, farming tips and alerts relevant to your area"]}/>
      </LegalSection>
      <LegalSection title="How Information Is Stored & Secured">
        <p style={{margin:0}}>Information is stored using access-controlled systems, with administrator actions logged for accountability and safeguards to protect against unauthorized access.</p>
      </LegalSection>
      <LegalSection title="How Information Is Used">
        <p style={{margin:0}}>Information is used only to operate the Inkingi platform — connecting farmers and buyers, verifying accounts, and improving services. It is never sold to third parties.</p>
      </LegalSection>
      <LegalSection title="Who Can Access Information">
        <p style={{margin:0}}>Only authorized Inkingi administrators can access account records. Buyers and sellers only see the profile and listing information users choose to make public.</p>
      </LegalSection>
      <LegalSection title="Your Privacy Rights">
        <LegalList items={["You may request to view, correct, or delete your personal information","You may ask about how your data is used at any time"]}/>
      </LegalSection>
      <LegalSection title="Cookies">
        <p style={{margin:0}}>Inkingi may use basic local storage on your device to keep you signed in and remember your preferences. This is not shared with third parties.</p>
      </LegalSection>
      <LegalSection title="Contact for Privacy Enquiries">
        <p style={{margin:0,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.contact size={13}/> +250 788 835 195</span><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.email size={13}/> info@inkingi.rw</span><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.location size={13}/> Kigali, Rwanda</span></p>
      </LegalSection>
    </Modal>
  );
}

function SupportModal({open,onClose,site}){
  return(
    <Modal open={open} onClose={onClose} title="Support" maxW={420}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.location size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>Location</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.address)||"Kigali, Rwanda"}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.contact size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>Phone</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.phone)||"+250 788 835 195"}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.hours size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>Hours</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.hours)||"Open 24 Hours / 7 Days a Week (24/7)"}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.email size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>Email</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>info@inkingi.rw</p></div>
        </div>
      </div>
    </Modal>
  );
}

/* ── ADVERTISEMENT DETAIL MODAL ── */
function AdDetailModal({ad,open,onClose}){
  const[imgIdx,setImgIdx]=useState(0);
  useEffect(()=>{setImgIdx(0)},[ad?.id]);
  if(!ad)return null;
  const gallery=[ad.image,...(ad.images||[])].filter(Boolean);
  return(
    <Modal open={open} onClose={onClose} title={ad.title||"Advertisement"} maxW={640}>
      {gallery.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{borderRadius:G.rL,overflow:"hidden",height:260,background:G.gray1,position:"relative"}}>
            <img src={gallery[imgIdx]} alt={ad.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
            {gallery.length>1&&(
              <>
                <button onClick={()=>setImgIdx(i=>(i-1+gallery.length)%gallery.length)} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.45)",border:"none",color:"#fff",width:32,height:32,borderRadius:99,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.prev size={16}/></button>
                <button onClick={()=>setImgIdx(i=>(i+1)%gallery.length)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.45)",border:"none",color:"#fff",width:32,height:32,borderRadius:99,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.next size={16}/></button>
              </>
            )}
          </div>
          {gallery.length>1&&(
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              {gallery.map((g,i)=>(
                <button key={i} onClick={()=>setImgIdx(i)} style={{width:52,height:40,borderRadius:7,overflow:"hidden",border:i===imgIdx?`2px solid ${G.g6}`:`2px solid transparent`,padding:0,cursor:"pointer",background:G.gray1}}>
                  <img src={g} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <Badge color="gold">Sponsored</Badge>
      <h3 style={{margin:"9px 0 8px",fontFamily:FH,fontSize:19,fontWeight:900,color:G.gray9}}>{ad.title}</h3>
      <p style={{margin:"0 0 18px",fontSize:13.5,color:G.gray7,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{ad.text}</p>
      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
        {ad.link&&<a href={ad.link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:G.g6,color:G.white,padding:"10px 18px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:13}}><Ic.external size={15}/> {ad.btnLabel||"Visit Website"}</a>}
        {ad.phone&&<a href={"tel:"+ad.phone} style={{display:"inline-flex",alignItems:"center",gap:6,background:G.white,color:G.g7,border:`1.5px solid ${G.g6}`,padding:"10px 18px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:13}}><Ic.contact size={15}/> Call {ad.phone}</a>}
      </div>
    </Modal>
  );
}

/* ── PRODUCT DETAIL MODAL ── */
function ProductDetailModal({product,farmers,open,onClose,onReload}){
  const[rating,setRating]=useState(0);const[rMsg,setRMsg]=useState("");
  if(!product)return null;
  const farmer=farmers.find(f=>f.id===product.fid);
  const sid=()=>{let s=localStorage.getItem("ik_sid");if(!s){s="s"+Date.now();localStorage.setItem("ik_sid",s)}return s};
  const submitRating=async()=>{if(!rating)return;const r=await DB.rateFarmer(product.fid,rating,sid());if(r.err)setRMsg("Already rated");else{onReload();setRMsg("Thank you!")}};
  return(
    <Modal open={open} onClose={onClose} title={product.name} maxW={700}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{borderRadius:G.r,overflow:"hidden",marginBottom:13}}><PImg product={product} h={200} detail={true}/></div>
          <p style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:G.g7,fontFamily:FH}}>RWF {product.price?.toLocaleString()}<span style={{fontSize:12,fontWeight:400,color:G.gray5}}>/{product.unit}</span></p>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
            <Badge color={product.inStock?"green":"gray"}>{product.inStock?"In Stock":"Out of Stock"}</Badge>
            {product.sub&&<Badge color="gray">{product.sub}</Badge>}
          </div>
          <p style={{margin:"0 0 3px",fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.location size={12}/> {product.village}, {product.sector}, {product.district}</p>
          <p style={{margin:"0 0 3px",fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.listings size={12}/> {product.qty} {product.unit} available</p>
          <p style={{margin:0,fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.users size={12}/> {product.views} views</p>
        </div>
        <div>
          <h3 style={{margin:"0 0 7px",fontSize:14,fontWeight:700,color:G.gray9}}>About this product</h3>
          <p style={{margin:"0 0 16px",fontSize:13,color:G.gray5,lineHeight:1.7}}>{product.desc||"No description."}</p>
          {farmer&&(
            <div style={{background:G.g0,border:`1px solid #c8e6c9`,borderRadius:G.rL,padding:13}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:9}}>
                <FarmerPhoto farmer={farmer} size={36} radius={9}/>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><strong style={{fontSize:13,color:G.gray9}}>{farmer.name}</strong><Badge color="green"><Ic.check size={10}/></Badge></div>
                  <Stars value={farmer.rating||0} size={11}/><span style={{fontSize:11,color:G.gray5}}> {(farmer.rating||0).toFixed(1)} ({farmer.rCount||0})</span>
                </div>
              </div>
              <div style={{display:"flex",gap:7,marginBottom:11,flexWrap:"wrap"}}>
                <a href={"tel:"+farmer.phone} style={{display:"inline-flex",alignItems:"center",gap:4,background:G.g6,color:G.white,padding:"7px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12,flex:1,justifyContent:"center"}}><Ic.contact size={13}/> Call Now</a>
                <a href={"https://wa.me/250"+farmer.phone.replace(/^0/,"")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"#25d366",color:G.white,padding:"7px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12,flex:1,justifyContent:"center"}}><Ic.whatsapp size={13}/> WhatsApp</a>
              </div>
              <div style={{borderTop:`1px solid #c8e6c9`,paddingTop:9}}>
                <p style={{margin:"0 0 5px",fontSize:12,fontWeight:700,color:G.gray7}}>Rate this Farmer</p>
                <Stars value={rating} size={20} interactive onChange={setRating}/>
                {rating>0&&!rMsg&&<Btn size="sm" onClick={submitRating} style={{marginTop:7}}>Submit Rating</Btn>}
                {rMsg&&<p style={{margin:"5px 0 0",fontSize:12,color:rMsg.includes("Already")?G.red:G.g6,fontWeight:600}}>{rMsg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════
   MARKET PRICES
════════════════════════════════════ */
function MarketPricesPage({user,notify}){
  const[prices,setPrices]=useState([]);
  const[search,setSearch]=useState("");const[fProv,setFProv]=useState("");const[fCat,setFCat]=useState("");
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[form,setForm]=useState({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});
  const reload=async()=>setPrices(await DB.prices());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.product||!form.current){notify("Fill required fields","error");return}
    const entry={...form,current:parseFloat(form.current),previous:parseFloat(form.previous)||0,updatedAt:new Date().toISOString()};
    const ps=await DB.prices();
    if(editing){await DB.savePrices(ps.map(p=>p.id===editing.id?{...p,...entry}:p));notify("Updated!")}
    else{entry.id="pr"+Date.now();await DB.savePrices([...ps,entry]);notify("Added!")}
    reload();setShowForm(false);setEditing(null);
    setForm({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});
  };
  const del=async id=>{if(!window.confirm("Delete?"))return;await DB.savePrices((await DB.prices()).filter(p=>p.id!==id));reload();notify("Deleted")};
  const trendIcon=t=>t==="up"?<Ic.trendUp size={13}/>:t==="down"?<Ic.trendDown size={13}/>:<Ic.trendFlat size={13}/>;
  const trendColor=t=>t==="up"?G.g6:t==="down"?G.red:G.gray5;
  const filtered=prices.filter(p=>{
    if(search&&!p.product.toLowerCase().includes(search.toLowerCase())&&!(p.market||"").toLowerCase().includes(search.toLowerCase()))return false;
    if(fProv&&p.province!==fProv)return false;
    if(fCat&&p.category!==fCat)return false;
    return true;
  });
  return(
    <div style={{background:G.white,minHeight:"60vh"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.prices size={22} color={G.g6}/> Live Market Prices</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>Real-time agricultural commodity prices across Rwanda</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});setShowForm(true)}}>Add Price</Btn>}
        </div>
        <div style={{background:G.white,borderRadius:G.rL,padding:14,marginBottom:16,boxShadow:G.sh,border:`1px solid ${G.gray1}`,display:"flex",gap:9,flexWrap:"wrap"}}>
          <Inp placeholder="Search product or market…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:160,marginBottom:0}}/>
          <Sel value={fProv} onChange={e=>setFProv(e.target.value)} style={{minWidth:140,marginBottom:0}}><option value="">All Provinces</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
          <Sel value={fCat} onChange={e=>setFCat(e.target.value)} style={{minWidth:130,marginBottom:0}}><option value="">All Categories</option><option>Crops</option><option>Livestock</option></Sel>
          <Btn variant="secondary" size="sm" onClick={()=>{setSearch("");setFProv("");setFCat("")}}>Clear</Btn>
        </div>
        <div style={{background:G.white,borderRadius:G.rL,boxShadow:G.sh,border:`1px solid ${G.gray1}`,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FB,fontSize:13}}>
              <thead>
                <tr style={{background:G.g8,color:G.white}}>
                  {["Product","Category","Province","District","Market","Unit","Current Price","Prev. Price","Trend","Updated",...(isAdmin?["Actions"]:[])].map(h=>(
                    <th key={h} style={{padding:"11px 14px",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0
                  ?<tr><td colSpan={11} style={{textAlign:"center",padding:"40px",color:G.gray5}}>No price data found</td></tr>
                  :filtered.map((p,i)=>(
                    <tr key={p.id} style={{borderBottom:`1px solid ${G.gray1}`,background:i%2===0?G.white:G.pageBg}}>
                      <td style={{padding:"11px 14px",fontWeight:700,color:G.gray9}}>{p.product}</td>
                      <td style={{padding:"11px 14px"}}><Badge color="green">{p.category}</Badge></td>
                      <td style={{padding:"11px 14px",color:G.gray7}}>{p.province}</td>
                      <td style={{padding:"11px 14px",color:G.gray7}}>{p.district}</td>
                      <td style={{padding:"11px 14px",color:G.gray5}}>{p.market}</td>
                      <td style={{padding:"11px 14px",color:G.gray5}}>{p.unit}</td>
                      <td style={{padding:"11px 14px",fontWeight:800,color:G.g7}}>RWF {p.current?.toLocaleString()}</td>
                      <td style={{padding:"11px 14px",color:G.gray5}}>RWF {p.previous?.toLocaleString()}</td>
                      <td style={{padding:"11px 14px"}}><span style={{color:trendColor(p.trend),fontWeight:700}}>{trendIcon(p.trend)} {p.trend}</span></td>
                      <td style={{padding:"11px 14px",color:G.gray5,whiteSpace:"nowrap"}}>{new Date(p.updatedAt).toLocaleDateString()}</td>
                      {isAdmin&&<td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:5}}><Btn size="sm" variant="secondary" onClick={()=>{setEditing(p);setForm({...p});setShowForm(true)}} icon={<Ic.edit size={14}/>}/><Btn size="sm" variant="danger" onClick={()=>del(p.id)} icon={<Ic.delete size={14}/>}/></div></td>}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?"Edit Price":"Add Market Price"} maxW={580}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Product *" value={form.product} onChange={e=>set("product",e.target.value)}/>
            <Sel label="Category" value={form.category} onChange={e=>set("category",e.target.value)}><option>Crops</option><option>Livestock</option></Sel>
            <Sel label="Province" value={form.province} onChange={e=>set("province",e.target.value)}><option value="">Select</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
            <Inp label="District" value={form.district} onChange={e=>set("district",e.target.value)}/>
            <div style={{gridColumn:"1/-1"}}><Inp label="Market Name *" value={form.market} onChange={e=>set("market",e.target.value)}/></div>
            <Sel label="Unit" value={form.unit} onChange={e=>set("unit",e.target.value)}>{"kg,ton,bag,crate,head,liter,piece".split(",").map(u=><option key={u} value={u}>{u}</option>)}</Sel>
            <Sel label="Trend" value={form.trend} onChange={e=>set("trend",e.target.value)}><option value="up">Up</option><option value="down">Down</option><option value="stable">Stable</option></Sel>
            <Inp label="Current Price (RWF) *" type="number" value={form.current} onChange={e=>set("current",e.target.value)}/>
            <Inp label="Previous Price (RWF)" type="number" value={form.previous} onChange={e=>set("previous",e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?"Save":"Add Price"}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>Cancel</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   FARMING TIPS
════════════════════════════════════ */
function FarmingTipsPage({user,notify}){
  const[tips,setTips]=useState([]);const[selTip,setSelTip]=useState(null);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");
  const[form,setForm]=useState({title:"",category:"Crops",image:"",content:"",author:"Admin"});
  const reload=async()=>setTips(await DB.tips());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.title||!form.content){notify("Title and content required","error");return}
    const entry={...form,publishedAt:editing?.publishedAt||new Date().toISOString()};
    const ts=await DB.tips();
    if(editing){await DB.saveTips(ts.map(t=>t.id===editing.id?{...t,...entry}:t));notify("Tip updated!")}
    else{entry.id="t"+Date.now();await DB.saveTips([...ts,entry]);notify("Tip published!")}
    reload();setShowForm(false);setEditing(null);setForm({title:"",category:"Crops",image:"",content:"",author:"Admin"});
  };
  const del=async id=>{if(!window.confirm("Delete?"))return;await DB.saveTips((await DB.tips()).filter(t=>t.id!==id));reload();notify("Deleted")};
  const cats=["All","Crops","Livestock","Soil","Water","Business"];
  const filtered=tips.filter(t=>{
    if(search&&!t.title.toLowerCase().includes(search.toLowerCase()))return false;
    if(fCat&&fCat!=="All"&&t.category!==fCat)return false;
    return true;
  });
  const related=tips.filter(t=>t.id!==selTip?.id&&t.category===selTip?.category).slice(0,3);
  if(selTip){
    return(
      <div style={{background:G.sectionAlt,minHeight:"60vh"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 20px"}}>
          <Btn variant="ghost" icon="←" onClick={()=>setSelTip(null)} style={{marginBottom:18}}>Back to Tips</Btn>
          {selTip.image&&<div style={{borderRadius:G.rL,overflow:"hidden",height:240,marginBottom:20}}><img src={selTip.image} alt={selTip.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
          <Badge color="green" style={{marginBottom:10}}>{selTip.category}</Badge>
          <h1 style={{fontFamily:FH,fontSize:24,fontWeight:900,color:G.gray9,margin:"0 0 7px",lineHeight:1.3}}>{selTip.title}</h1>
          <p style={{color:G.gray5,fontSize:13,margin:"0 0 20px"}}>By {selTip.author} · {new Date(selTip.publishedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
          <div style={{background:G.white,borderRadius:G.rL,padding:22,boxShadow:G.shM,marginBottom:24}}>
            {selTip.content.split("\n").map((para,i)=>(
              <p key={i} style={{margin:"0 0 11px",fontSize:14,color:para.startsWith("**")?G.gray9:G.gray7,fontWeight:para.startsWith("**")?700:400,lineHeight:1.8}}>{para.replace(/\*\*/g,"")}</p>
            ))}
          </div>
          {related.length>0&&(
            <div>
              <h3 style={{fontFamily:FH,fontSize:16,fontWeight:800,marginBottom:13,color:G.gray9}}>Related Tips</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:13}}>
                {related.map(t=>(
                  <div key={t.id} style={{background:G.white,borderRadius:G.rL,overflow:"hidden",cursor:"pointer",boxShadow:G.sh,border:`1px solid ${G.gray1}`,transition:"transform .2s"}} onClick={()=>setSelTip(t)} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                    {t.image&&<div style={{height:90,overflow:"hidden"}}><img src={t.image} alt={t.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
                    <div style={{padding:11}}><Badge color="green" style={{marginBottom:5}}>{t.category}</Badge><h4 style={{margin:0,fontSize:12,fontFamily:FH,color:G.gray9,lineHeight:1.3}}>{t.title}</h4></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return(
    <div style={{background:G.sectionAlt,minHeight:"60vh"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.tips size={22} color={G.g6}/> Farming Tips</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>Expert advice to improve your farm productivity</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({title:"",category:"Crops",image:"",content:"",author:"Admin"});setShowForm(true)}}>Add Tip</Btn>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          <Inp placeholder="Search tips…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:180,marginBottom:0}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setFCat(c==="All"?"":c)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${fCat===(c==="All"?"":c)?G.g6:G.gray3}`,background:fCat===(c==="All"?"":c)?G.g6:G.white,color:fCat===(c==="All"?"":c)?G.white:G.gray7,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:FB}}>{c}</button>
            ))}
          </div>
        </div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"60px",color:G.gray5}}><div style={{marginBottom:12,display:"flex",justifyContent:"center"}}><Ic.tips size={48}/></div><p>No tips found</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18}}>
              {filtered.map(tip=>(
                <div key={tip.id} style={{background:G.white,borderRadius:G.rL,overflow:"hidden",boxShadow:G.sh,border:`1px solid ${G.gray1}`,transition:"transform .25s,box-shadow .25s",cursor:"pointer"}} onClick={()=>setSelTip(tip)} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=G.shL;e.currentTarget.style.borderColor="#a5d6a7"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=G.sh;e.currentTarget.style.borderColor=G.gray1}}>
                  {tip.image&&<div style={{height:155,overflow:"hidden"}}><img src={tip.image} alt={tip.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
                  <div style={{padding:"13px 15px"}}>
                    <Badge color="green" style={{marginBottom:6}}>{tip.category}</Badge>
                    <h3 style={{margin:"0 0 5px",fontSize:14,fontFamily:FH,fontWeight:700,color:G.gray9,lineHeight:1.35}}>{tip.title}</h3>
                    <p style={{margin:"0 0 8px",fontSize:12,color:G.gray5,lineHeight:1.6}}>{tip.content.slice(0,100)}…</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
                      <span style={{fontSize:11,color:G.gray5}}>By {tip.author} · {new Date(tip.publishedAt).toLocaleDateString()}</span>
                      {isAdmin&&(
                        <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                          <Btn size="sm" variant="secondary" onClick={()=>{setEditing(tip);setForm({...tip});setShowForm(true)}} icon={<Ic.edit size={14}/>}/>
                          <Btn size="sm" variant="danger" onClick={()=>del(tip.id)} icon={<Ic.delete size={14}/>}/>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>}
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?"Edit Tip":"Add Farming Tip"} maxW={640}>
          <Inp label="Title *" value={form.title} onChange={e=>set("title",e.target.value)}/>
          <Sel label="Category" value={form.category} onChange={e=>set("category",e.target.value)}>{"Crops,Livestock,Soil,Water,Business".split(",").map(c=><option key={c} value={c}>{c}</option>)}</Sel>
          <ImageUpload label="Featured Image" value={form.image} onChange={v=>set("image",v)}/>
          <Txt label="Content * (use **text** for bold)" value={form.content} onChange={e=>set("content",e.target.value)} style={{minHeight:170}}/>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?"Save":"Publish Tip"}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>Cancel</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   PESTS & DISEASES
════════════════════════════════════ */
function PestsCenterPage({user,notify}){
  const[pests,setPests]=useState([]);const[selPest,setSelPest]=useState(null);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");
  const[form,setForm]=useState({cropOrAnimal:"",name:"",images:[""],symptoms:"",causes:"",prevention:"",treatment:"",severity:"medium",category:"Crops"});
  const reload=async()=>setPests(await DB.pests());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.name||!form.cropOrAnimal){notify("Fill required fields","error");return}
    const ps=await DB.pests();
    if(editing){await DB.savePests(ps.map(p=>p.id===editing.id?{...p,...form}:p));notify("Updated!")}
    else{await DB.savePests([...ps,{...form,id:"pe"+Date.now()}]);notify("Added!")}
    reload();setShowForm(false);setEditing(null);
    setForm({cropOrAnimal:"",name:"",images:[""],symptoms:"",causes:"",prevention:"",treatment:"",severity:"medium",category:"Crops"});
  };
  const del=async id=>{if(!window.confirm("Delete?"))return;await DB.savePests((await DB.pests()).filter(p=>p.id!==id));reload();notify("Deleted")};
  const filtered=pests.filter(p=>{
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.cropOrAnimal.toLowerCase().includes(search.toLowerCase()))return false;
    if(fCat&&p.category!==fCat)return false;
    return true;
  });
  if(selPest){
    return(
      <div style={{background:G.white,minHeight:"60vh"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 20px"}}>
          <Btn variant="ghost" icon="←" onClick={()=>setSelPest(null)} style={{marginBottom:18}}>Back</Btn>
          {sel
