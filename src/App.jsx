import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
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


/* ── TRANSLATIONS ──
   Every user-facing string used by the pages/modals covered so far (nav,
   homepage, marketplace header, sign-in, and registration) lives here as
   a flat key → {en,rw,fr} object, so a new page's strings can be added the
   same way without touching how translation itself works. Reference a
   string in JSX with t("key") — see useLang() below. Adding a language
   later means adding one more value per key here; nothing else changes. */
const TRANSLATIONS = {
  // Nav
  nav_home:{en:"Home",rw:"Ahabanza",fr:"Accueil"},
  nav_marketplace:{en:"Marketplace",rw:"Isoko",fr:"Marché"},
  nav_farmers:{en:"Farmers",rw:"Abahinzi",fr:"Agriculteurs"},
  nav_prices:{en:"Prices",rw:"Ibiciro",fr:"Prix"},
  nav_tips:{en:"Tips",rw:"Inama",fr:"Conseils"},
  nav_pests:{en:"Pests",rw:"Udukoko",fr:"Nuisibles"},
  nav_calendar:{en:"Calendar",rw:"Kalindari",fr:"Calendrier"},
  nav_dashboard:{en:"Dashboard",rw:"Imbonerahamwe",fr:"Tableau de bord"},
  nav_admin:{en:"Admin",rw:"Ubuyobozi",fr:"Admin"},
  nav_signin:{en:"Sign In",rw:"Injira",fr:"Se connecter"},
  nav_register:{en:"Register",rw:"Iyandikishe",fr:"S'inscrire"},
  nav_logout:{en:"Logout",rw:"Sohoka",fr:"Déconnexion"},
  // Hero / Home
  hero_title:{en:"Supporting Rwanda's Agricultural Transformation",rw:"Dushyigikiye Impinduka mu Buhinzi bw'u Rwanda",fr:"Soutenir la transformation agricole du Rwanda"},
  hero_subtitle:{en:"Connecting verified farmers with buyers across all 30 districts",rw:"Duhuza abahinzi biyemeje n'abaguzi mu turere 30 twose",fr:"Connecter des agriculteurs vérifiés aux acheteurs dans les 30 districts"},
  hero_explore_crops:{en:"Explore Crops",rw:"Reba Ibihingwa",fr:"Explorer les cultures"},
  hero_browse_livestock:{en:"Browse Livestock",rw:"Reba Amatungo",fr:"Parcourir le bétail"},
  home_resources:{en:"Farmer Resources",rw:"Ibikoresho by'Abahinzi",fr:"Ressources agricoles"},
  home_market_prices:{en:"Market Prices",rw:"Ibiciro ku Isoko",fr:"Prix du marché"},
  home_market_prices_desc:{en:"Live commodity prices across Rwanda",rw:"Ibiciro by'ibicuruzwa mu gihe nyacyo mu Rwanda",fr:"Prix des marchandises en direct partout au Rwanda"},
  home_farming_tips:{en:"Farming Tips",rw:"Inama z'Ubuhinzi",fr:"Conseils agricoles"},
  home_farming_tips_desc:{en:"Expert advice to boost productivity",rw:"Inama z'impuguke zo kongera umusaruro",fr:"Conseils d'experts pour améliorer la productivité"},
  home_pest_center:{en:"Pest & Disease Center",rw:"Ikigo cy'Udukoko n'Indwara",fr:"Centre des nuisibles et maladies"},
  home_pest_center_desc:{en:"Identify and treat problems early",rw:"Menya no kuvura ibibazo hakiri kare",fr:"Identifier et traiter les problèmes tôt"},
  home_calendar:{en:"Planting Calendar",rw:"Kalindari yo Gutera",fr:"Calendrier de plantation"},
  home_calendar_desc:{en:"Optimal planting and harvest times",rw:"Ibihe byiza byo gutera no gusarura",fr:"Meilleures périodes de plantation et de récolte"},
  home_featured:{en:"Featured Products",rw:"Ibicuruzwa Byatoranyijwe",fr:"Produits en vedette"},
  home_newly_listed:{en:"Newly Listed",rw:"Ibishya Byashyizweho",fr:"Récemment ajoutés"},
  home_most_popular:{en:"Most Popular",rw:"Ibikunzwe Cyane",fr:"Les plus populaires"},
  home_view_all:{en:"View All →",rw:"Reba Byose →",fr:"Voir tout →"},
  home_cta_title:{en:"Are you a farmer in Rwanda?",rw:"Uri umuhinzi mu Rwanda?",fr:"Êtes-vous agriculteur au Rwanda ?"},
  home_cta_subtitle:{en:"Join 500+ verified farmers selling nationwide on Inkingi",rw:"Ifatanye n'abahinzi 500+ biyemeje bagurisha mu Rwanda hose kuri Inkingi",fr:"Rejoignez plus de 500 agriculteurs vérifiés qui vendent partout sur Inkingi"},
  home_cta_button:{en:"Register as Farmer",rw:"Iyandikishe nk'Umuhinzi",fr:"S'inscrire comme agriculteur"},
  // Marketplace
  marketplace_title:{en:"Marketplace",rw:"Isoko",fr:"Marché"},
  // Sign in
  signin_title:{en:"Sign In",rw:"Injira",fr:"Se connecter"},
  signin_email:{en:"Email",rw:"Imeyili",fr:"E-mail"},
  signin_password:{en:"Password",rw:"Ijambobanga",fr:"Mot de passe"},
  signin_forgot:{en:"Forgot password?",rw:"Wibagiwe ijambobanga?",fr:"Mot de passe oublié ?"},
  signin_submit:{en:"Sign In",rw:"Injira",fr:"Se connecter"},
  signin_submitting:{en:"Signing in…",rw:"Kwinjira…",fr:"Connexion…"},
  signin_new_here:{en:"New here?",rw:"Uri gushya hano?",fr:"Nouveau ici ?"},
  signin_register_link:{en:"Register",rw:"Iyandikishe",fr:"S'inscrire"},
  reset_title:{en:"Reset Password",rw:"Hindura Ijambobanga",fr:"Réinitialiser le mot de passe"},
  reset_send:{en:"Send Reset Link",rw:"Ohereza Ihuza ryo Guhindura",fr:"Envoyer le lien de réinitialisation"},
  reset_sending:{en:"Sending…",rw:"Kohereza…",fr:"Envoi…"},
  reset_back:{en:"Back to Sign In",rw:"Subira ku Kwinjira",fr:"Retour à la connexion"},
  reset_sent_msg:{en:"If that email has an account, a reset link has been sent.",rw:"Niba iyo imeyili ifite konti, ihuza ryo guhindura ryoherejwe.",fr:"Si cet e-mail correspond à un compte, un lien de réinitialisation a été envoyé."},
  // Registration
  reg_choice_title:{en:"Join Inkingi",rw:"Ifatanye na Inkingi",fr:"Rejoindre Inkingi"},
  reg_choice_question:{en:"How would you like to register?",rw:"Wifuza kwiyandikisha ute?",fr:"Comment souhaitez-vous vous inscrire ?"},
  reg_choice_farmer:{en:"Register as Farmer",rw:"Iyandikishe nk'Umuhinzi",fr:"S'inscrire comme agriculteur"},
  reg_choice_wholesaler:{en:"Register as Wholesaler",rw:"Iyandikishe nk'Umucuruzi",fr:"S'inscrire comme grossiste"},
  reg_choice_business:{en:"Register as Business",rw:"Iyandikishe nk'Ubucuruzi",fr:"S'inscrire comme entreprise"},
  reg_business_title:{en:"Register Your Business",rw:"Andikisha Ubucuruzi Bwawe",fr:"Enregistrer votre entreprise"},
  reg_business_step:{en:"Step",rw:"Intambwe",fr:"Étape"},
  reg_business_primary_category:{en:"What best describes your agricultural business?",rw:"Ni iki kigaragaza neza ubucuruzi bwawe bw'ubuhinzi?",fr:"Qu'est-ce qui décrit le mieux votre entreprise agricole ?"},
  reg_business_secondary_category:{en:"Also involved in (optional)",rw:"Ukora n'ibindi (bidahatirwa)",fr:"Également impliqué dans (facultatif)"},
  reg_business_trading_name:{en:"Trading / business name",rw:"Izina ry'ubucuruzi",fr:"Nom commercial"},
  reg_business_legal_name:{en:"Legal registered name (optional)",rw:"Izina ryemewe n'amategeko (bidahatirwa)",fr:"Nom légal enregistré (facultatif)"},
  reg_business_contact_name:{en:"Contact person's full name",rw:"Amazina y'uhagarariye ubucuruzi",fr:"Nom complet de la personne à contacter"},
  reg_business_phone:{en:"Phone number",rw:"Nimero ya telefoni",fr:"Numéro de téléphone"},
  reg_business_whatsapp_q:{en:"Do you use WhatsApp on this number?",rw:"Ese ukoresha WhatsApp kuri iyi nimero?",fr:"Utilisez-vous WhatsApp sur ce numéro ?"},
  reg_business_no_extra:{en:"No additional questions for this category.",rw:"Nta bibazo by'inyongera kuri iyi category.",fr:"Aucune question supplémentaire pour cette catégorie."},
  reg_business_auth_q:{en:"Is your business registered/authorized/licensed for this activity?",rw:"Ese ubucuruzi bwawe bwanditswe/bwemerewe gukora iyi mirimo?",fr:"Votre entreprise est-elle enregistrée/autorisée pour cette activité ?"},
  reg_business_auth_yes:{en:"Yes, currently valid",rw:"Yego, birakomeje kuba byemewe",fr:"Oui, actuellement valide"},
  reg_business_auth_progress:{en:"Application in progress",rw:"Gusaba birimo gukorwa",fr:"Demande en cours"},
  reg_business_auth_none:{en:"Not required for my business",rw:"Ntibikenewe ku bucuruzi bwanjye",fr:"Non requis pour mon entreprise"},
  reg_business_auth_unsure:{en:"I'm not sure",rw:"Simbizi neza",fr:"Je ne suis pas sûr"},
  reg_business_issuing_authority:{en:"Issuing authority",rw:"Urwego rwatanze uruhushya",fr:"Autorité émettrice"},
  reg_business_license_number:{en:"Registration/license number",rw:"Nimero y'icyemezo",fr:"Numéro d'enregistrement/licence"},
  reg_business_issue_date:{en:"Issue date",rw:"Itariki yatanzweho",fr:"Date de délivrance"},
  reg_business_expiry_date:{en:"Expiry date (if applicable)",rw:"Itariki irangirira (niba bikenewe)",fr:"Date d'expiration (le cas échéant)"},
  reg_business_description:{en:"About your business",rw:"Ibijyanye n'ubucuruzi bwawe",fr:"À propos de votre entreprise"},
  reg_business_image:{en:"Business logo / photo",rw:"Ifoto/ikirango cy'ubucuruzi",fr:"Logo/photo de l'entreprise"},
  reg_business_category_info:{en:"Category details",rw:"Amakuru arebana na category",fr:"Détails de la catégorie"},
  reg_error_required:{en:"Please complete all required fields.",rw:"Uzuza ibisabwa byose.",fr:"Veuillez remplir tous les champs requis."},
  common_yes:{en:"Yes",rw:"Yego",fr:"Oui"},
  common_no:{en:"No",rw:"Oya",fr:"Non"},
  common_back:{en:"Back",rw:"Subira Inyuma",fr:"Retour"},
  common_next:{en:"Next",rw:"Komeza",fr:"Suivant"},
  reg_title_farmer:{en:"Join as Farmer",rw:"Injira nk'Umuhinzi",fr:"Rejoindre comme agriculteur"},
  reg_title_wholesaler:{en:"Join as Wholesaler",rw:"Injira nk'Umucuruzi",fr:"Rejoindre comme grossiste"},
  reg_full_name:{en:"Full Name",rw:"Amazina Yombi",fr:"Nom complet"},
  reg_email:{en:"Email",rw:"Imeyili",fr:"E-mail"},
  reg_phone:{en:"Phone",rw:"Telefoni",fr:"Téléphone"},
  reg_farming_type:{en:"Farming Type",rw:"Ubwoko bw'Ubuhinzi",fr:"Type d'agriculture"},
  reg_password:{en:"Password",rw:"Ijambobanga",fr:"Mot de passe"},
  reg_confirm_password:{en:"Confirm Password",rw:"Emeza Ijambobanga",fr:"Confirmer le mot de passe"},
  reg_bio:{en:"Bio",rw:"Amakuru Yawe",fr:"Bio"},
  reg_products_desc:{en:"Description of products sold",rw:"Ibisobanuro by'ibicuruzwa ugurisha",fr:"Description des produits vendus"},
  reg_photo:{en:"Photo representing what you sell",rw:"Ifoto igaragaza ibyo ugurisha",fr:"Photo représentant ce que vous vendez"},
  reg_submit:{en:"Register",rw:"Iyandikishe",fr:"S'inscrire"},
  reg_submitting:{en:"Submitting…",rw:"Kohereza…",fr:"Envoi…"},
  // Validation messages
  err_required:{en:"Required",rw:"Birakenewe",fr:"Obligatoire"},
  err_valid_email:{en:"Enter a valid email address",rw:"Andika imeyili nyayo",fr:"Saisissez une adresse e-mail valide"},
  err_phone_format:{en:"Format: 07XXXXXXXX",rw:"Imiterere: 07XXXXXXXX",fr:"Format : 07XXXXXXXX"},
  err_pw_requirements:{en:"Password does not meet all requirements below",rw:"Ijambobanga ntirisohoza ibisabwa byose hepfo",fr:"Le mot de passe ne remplit pas toutes les exigences ci-dessous"},
  err_pw_mismatch:{en:"Passwords do not match",rw:"Amagambobanga ntahura",fr:"Les mots de passe ne correspondent pas"},
  pw_rule_len:{en:"At least 8 characters",rw:"Byibura inyuguti 8",fr:"Au moins 8 caractères"},
  pw_rule_upper:{en:"One uppercase letter (A-Z)",rw:"Inyuguti nkuru imwe (A-Z)",fr:"Une lettre majuscule (A-Z)"},
  pw_rule_lower:{en:"One lowercase letter (a-z)",rw:"Inyuguti nto imwe (a-z)",fr:"Une lettre minuscule (a-z)"},
  pw_rule_num:{en:"One number (0-9)",rw:"Umubare umwe (0-9)",fr:"Un chiffre (0-9)"},
  pw_rule_special:{en:"One special character (!@#$…)",rw:"Ikimenyetso kidasanzwe (!@#$…)",fr:"Un caractère spécial (!@#$…)"},
  // Market Prices page
  prices_title:{en:"Live Market Prices",rw:"Ibiciro ku Isoko mu Gihe Nyacyo",fr:"Prix du marché en direct"},
  prices_subtitle:{en:"Real-time agricultural commodity prices across Rwanda",rw:"Ibiciro by'ibicuruzwa mu buhinzi mu gihe nyacyo mu Rwanda",fr:"Prix des denrées agricoles en temps réel partout au Rwanda"},
  prices_add:{en:"Add Price",rw:"Ongeraho Igiciro",fr:"Ajouter un prix"},
  prices_search_ph:{en:"Search product or market…",rw:"Shakisha igicuruzwa cyangwa isoko…",fr:"Rechercher un produit ou un marché…"},
  prices_all_provinces:{en:"All Provinces",rw:"Intara Zose",fr:"Toutes les provinces"},
  prices_all_categories:{en:"All Categories",rw:"Ibyiciro Byose",fr:"Toutes les catégories"},
  prices_clear:{en:"Clear",rw:"Siba",fr:"Effacer"},
  prices_col_product:{en:"Product",rw:"Igicuruzwa",fr:"Produit"},
  prices_col_category:{en:"Category",rw:"Icyiciro",fr:"Catégorie"},
  prices_col_province:{en:"Province",rw:"Intara",fr:"Province"},
  prices_col_district:{en:"District",rw:"Akarere",fr:"District"},
  prices_col_market:{en:"Market",rw:"Isoko",fr:"Marché"},
  prices_col_unit:{en:"Unit",rw:"Igipimo",fr:"Unité"},
  prices_col_current:{en:"Current Price",rw:"Igiciro cya None",fr:"Prix actuel"},
  prices_col_prev:{en:"Prev. Price",rw:"Igiciro cya Mbere",fr:"Prix précédent"},
  prices_col_trend:{en:"Trend",rw:"Icyerekezo",fr:"Tendance"},
  prices_col_updated:{en:"Updated",rw:"Byahinduwe",fr:"Mis à jour"},
  prices_col_actions:{en:"Actions",rw:"Ibikorwa",fr:"Actions"},
  prices_none_found:{en:"No price data found",rw:"Nta biciro byabonetse",fr:"Aucune donnée de prix trouvée"},
  prices_edit_title:{en:"Edit Price",rw:"Hindura Igiciro",fr:"Modifier le prix"},
  prices_add_title:{en:"Add Market Price",rw:"Ongeraho Igiciro cy'Isoko",fr:"Ajouter un prix du marché"},
  prices_form_product:{en:"Product *",rw:"Igicuruzwa *",fr:"Produit *"},
  prices_form_category:{en:"Category",rw:"Icyiciro",fr:"Catégorie"},
  prices_form_province:{en:"Province",rw:"Intara",fr:"Province"},
  prices_form_select:{en:"Select",rw:"Hitamo",fr:"Sélectionner"},
  prices_form_district:{en:"District",rw:"Akarere",fr:"District"},
  prices_form_market:{en:"Market Name *",rw:"Izina ry'Isoko *",fr:"Nom du marché *"},
  prices_form_unit:{en:"Unit",rw:"Igipimo",fr:"Unité"},
  prices_form_trend:{en:"Trend",rw:"Icyerekezo",fr:"Tendance"},
  prices_trend_up:{en:"Up",rw:"Kuzamuka",fr:"Hausse"},
  prices_trend_down:{en:"Down",rw:"Kumanuka",fr:"Baisse"},
  prices_trend_stable:{en:"Stable",rw:"Bihagaze",fr:"Stable"},
  prices_form_current:{en:"Current Price (RWF) *",rw:"Igiciro cya None (RWF) *",fr:"Prix actuel (RWF) *"},
  prices_form_previous:{en:"Previous Price (RWF)",rw:"Igiciro cya Mbere (RWF)",fr:"Prix précédent (RWF)"},
  prices_save:{en:"Save",rw:"Bika",fr:"Enregistrer"},
  prices_cancel:{en:"Cancel",rw:"Hagarika",fr:"Annuler"},
  crops_label:{en:"Crops",rw:"Ibihingwa",fr:"Cultures"},
  livestock_label:{en:"Livestock",rw:"Amatungo",fr:"Bétail"},
  // Shared admin CRUD feedback (prices/tips/pests/calendar)
  confirm_delete:{en:"Delete?",rw:"Gusiba?",fr:"Supprimer ?"},
  msg_updated:{en:"Updated!",rw:"Byahinduwe!",fr:"Mis à jour !"},
  msg_added:{en:"Added!",rw:"Byongewemo!",fr:"Ajouté !"},
  msg_deleted:{en:"Deleted",rw:"Byasibwe",fr:"Supprimé"},
  msg_fill_required:{en:"Fill required fields",rw:"Uzuza ibisabwa",fr:"Remplissez les champs requis"},
  // Farming Tips page
  tips_title:{en:"Farming Tips",rw:"Inama z'Ubuhinzi",fr:"Conseils agricoles"},
  tips_subtitle:{en:"Expert advice to improve your farm productivity",rw:"Inama z'impuguke zo kongera umusaruro w'ubuhinzi bwawe",fr:"Conseils d'experts pour améliorer la productivité de votre exploitation"},
  tips_add:{en:"Add Tip",rw:"Ongeraho Inama",fr:"Ajouter un conseil"},
  tips_search_ph:{en:"Search tips…",rw:"Shakisha inama…",fr:"Rechercher des conseils…"},
  tips_none_found:{en:"No tips found",rw:"Nta nama zabonetse",fr:"Aucun conseil trouvé"},
  tips_back:{en:"Back to Tips",rw:"Subira ku Nama",fr:"Retour aux conseils"},
  tips_by:{en:"By",rw:"Na",fr:"Par"},
  tips_related:{en:"Related Tips",rw:"Inama Zisa Nazo",fr:"Conseils similaires"},
  tips_edit_title:{en:"Edit Tip",rw:"Hindura Inama",fr:"Modifier le conseil"},
  tips_add_title:{en:"Add Farming Tip",rw:"Ongeraho Inama y'Ubuhinzi",fr:"Ajouter un conseil agricole"},
  tips_form_title:{en:"Title *",rw:"Umutwe *",fr:"Titre *"},
  tips_form_category:{en:"Category",rw:"Icyiciro",fr:"Catégorie"},
  tips_form_image:{en:"Featured Image",rw:"Ifoto Nyamukuru",fr:"Image à la une"},
  tips_form_content:{en:"Content * (use **text** for bold)",rw:"Ibirimo * (koresha **ijambo** kugira ngirakomeye)",fr:"Contenu * (utilisez **texte** pour le gras)"},
  tips_publish:{en:"Publish Tip",rw:"Sohora Inama",fr:"Publier le conseil"},
  cat_all:{en:"All",rw:"Byose",fr:"Tous"},
  msg_title_content_required:{en:"Title and content required",rw:"Umutwe n'ibirimo birakenewe",fr:"Titre et contenu requis"},
  msg_tip_updated:{en:"Tip updated!",rw:"Inama yahinduwe!",fr:"Conseil mis à jour !"},
  msg_tip_published:{en:"Tip published!",rw:"Inama yasohowe!",fr:"Conseil publié !"},
  // Severity labels (used with SEVERITY[level].label lookups)
  severity_low:{en:"Low",rw:"Byoroheje",fr:"Faible"},
  severity_medium:{en:"Medium",rw:"Hagati",fr:"Moyen"},
  severity_high:{en:"High",rw:"Byinshi",fr:"Élevé"},
  severity_critical:{en:"Critical",rw:"Byihutirwa",fr:"Critique"},
  // Pest & Disease Center page
  pests_title:{en:"Pest & Disease Center",rw:"Ikigo cy'Udukoko n'Indwara",fr:"Centre des nuisibles et maladies"},
  pests_subtitle:{en:"Identify, prevent, and treat crop & livestock problems",rw:"Menya, kwirinda, no kuvura ibibazo by'ibihingwa n'amatungo",fr:"Identifier, prévenir et traiter les problèmes des cultures et du bétail"},
  pests_add:{en:"Add Entry",rw:"Ongeraho Icyanditswe",fr:"Ajouter une entrée"},
  pests_search_ph:{en:"Search pests or crops…",rw:"Shakisha udukoko cyangwa ibihingwa…",fr:"Rechercher des nuisibles ou des cultures…"},
  pests_none_found:{en:"No entries found",rw:"Nta byanditswe byabonetse",fr:"Aucune entrée trouvée"},
  pests_back:{en:"Back",rw:"Subira",fr:"Retour"},
  pests_severity_suffix:{en:"Severity",rw:"Ubukana",fr:"Gravité"},
  pests_affects:{en:"Affects:",rw:"Bigira ingaruka kuri:",fr:"Affecte :"},
  pests_symptoms:{en:"Symptoms",rw:"Ibimenyetso",fr:"Symptômes"},
  pests_causes:{en:"Causes",rw:"Impamvu",fr:"Causes"},
  pests_prevention:{en:"Prevention",rw:"Kwirinda",fr:"Prévention"},
  pests_treatment:{en:"Treatment",rw:"Ubuvuzi",fr:"Traitement"},
  pests_edit_title:{en:"Edit Entry",rw:"Hindura Icyanditswe",fr:"Modifier l'entrée"},
  pests_add_title:{en:"Add Pest/Disease",rw:"Ongeraho Udukoko/Indwara",fr:"Ajouter un nuisible/maladie"},
  pests_form_crop_animal:{en:"Crop/Animal *",rw:"Igihingwa/Itungo *",fr:"Culture/Animal *"},
  pests_form_name:{en:"Name *",rw:"Izina *",fr:"Nom *"},
  pests_form_category:{en:"Category",rw:"Icyiciro",fr:"Catégorie"},
  pests_form_severity:{en:"Severity",rw:"Ubukana",fr:"Gravité"},
  pests_form_photo:{en:"Photo",rw:"Ifoto",fr:"Photo"},
  pests_form_symptoms:{en:"Symptoms",rw:"Ibimenyetso",fr:"Symptômes"},
  pests_form_causes:{en:"Causes",rw:"Impamvu",fr:"Causes"},
  pests_form_prevention:{en:"Prevention",rw:"Kwirinda",fr:"Prévention"},
  pests_form_treatment:{en:"Treatment",rw:"Ubuvuzi",fr:"Traitement"},
  // Month names (indexed lookup: month_0=January … month_11=December)
  month_0:{en:"January",rw:"Mutarama",fr:"Janvier"},
  month_1:{en:"February",rw:"Gashyantare",fr:"Février"},
  month_2:{en:"March",rw:"Werurwe",fr:"Mars"},
  month_3:{en:"April",rw:"Mata",fr:"Avril"},
  month_4:{en:"May",rw:"Gicurasi",fr:"Mai"},
  month_5:{en:"June",rw:"Kamena",fr:"Juin"},
  month_6:{en:"July",rw:"Nyakanga",fr:"Juillet"},
  month_7:{en:"August",rw:"Kanama",fr:"Août"},
  month_8:{en:"September",rw:"Nzeli",fr:"Septembre"},
  month_9:{en:"October",rw:"Ukwakira",fr:"Octobre"},
  month_10:{en:"November",rw:"Ugushyingo",fr:"Novembre"},
  month_11:{en:"December",rw:"Ukuboza",fr:"Décembre"},
  // Planting Calendar page
  calendar_title:{en:"Seasonal Planting Calendar",rw:"Kalindari y'Ibihe byo Gutera",fr:"Calendrier saisonnier de plantation"},
  calendar_subtitle:{en:"Optimal planting and harvest times across Rwanda",rw:"Ibihe byiza byo gutera no gusarura mu Rwanda hose",fr:"Meilleures périodes de plantation et de récolte au Rwanda"},
  calendar_add:{en:"Add Entry",rw:"Ongeraho Icyanditswe",fr:"Ajouter une entrée"},
  calendar_view_monthly:{en:"Monthly",rw:"Buri Kwezi",fr:"Mensuel"},
  calendar_view_list:{en:"List",rw:"Urutonde",fr:"Liste"},
  calendar_all_provinces:{en:"All Provinces",rw:"Intara Zose",fr:"Toutes les provinces"},
  calendar_all_rwanda:{en:"All Rwanda",rw:"U Rwanda Hose",fr:"Tout le Rwanda"},
  calendar_filter_crop:{en:"Filter by crop…",rw:"Shungura ku gihingwa…",fr:"Filtrer par culture…"},
  calendar_crops_count:{en:"crops",rw:"ibihingwa",fr:"cultures"},
  calendar_none_scheduled:{en:"No crops scheduled for",rw:"Nta bihingwa biteganyijwe kuri",fr:"Aucune culture prévue pour"},
  calendar_plant:{en:"Plant",rw:"Tera",fr:"Planter"},
  calendar_harvest:{en:"Harvest",rw:"Sarura",fr:"Récolter"},
  calendar_days:{en:"days",rw:"iminsi",fr:"jours"},
  calendar_col_crop:{en:"Crop",rw:"Igihingwa",fr:"Culture"},
  calendar_col_province:{en:"Province",rw:"Intara",fr:"Province"},
  calendar_col_district:{en:"District",rw:"Akarere",fr:"District"},
  calendar_col_plant_month:{en:"Plant Month",rw:"Ukwezi ko Gutera",fr:"Mois de plantation"},
  calendar_col_harvest_month:{en:"Harvest Month",rw:"Ukwezi ko Gusarura",fr:"Mois de récolte"},
  calendar_col_days:{en:"Days",rw:"Iminsi",fr:"Jours"},
  calendar_col_notes:{en:"Notes",rw:"Inyandiko",fr:"Notes"},
  calendar_none_entries:{en:"No entries",rw:"Nta byanditswe",fr:"Aucune entrée"},
  calendar_edit_title:{en:"Edit Entry",rw:"Hindura Icyanditswe",fr:"Modifier l'entrée"},
  calendar_add_title:{en:"Add Planting Entry",rw:"Ongeraho Icyanditswe cyo Gutera",fr:"Ajouter une entrée de plantation"},
  calendar_form_crop:{en:"Crop *",rw:"Igihingwa *",fr:"Culture *"},
  calendar_form_select_crop:{en:"Select Crop",rw:"Hitamo Igihingwa",fr:"Sélectionner une culture"},
  calendar_form_province:{en:"Province",rw:"Intara",fr:"Province"},
  calendar_form_district:{en:"District (optional)",rw:"Akarere (si ngombwa)",fr:"District (facultatif)"},
  calendar_form_plant_month:{en:"Planting Month",rw:"Ukwezi ko Gutera",fr:"Mois de plantation"},
  calendar_form_harvest_month:{en:"Harvest Month",rw:"Ukwezi ko Gusarura",fr:"Mois de récolte"},
  calendar_form_growing_days:{en:"Growing Period (days)",rw:"Igihe cyo Gukura (iminsi)",fr:"Durée de croissance (jours)"},
  calendar_form_notes:{en:"Notes",rw:"Inyandiko",fr:"Notes"},
  msg_crop_required:{en:"Crop name required",rw:"Izina ry'igihingwa rirakenewe",fr:"Nom de la culture requis"},
  // Product Detail modal
  prod_in_stock:{en:"In Stock",rw:"Birahari",fr:"En stock"},
  prod_out_of_stock:{en:"Out of Stock",rw:"Byashize",fr:"Rupture de stock"},
  prod_available:{en:"available",rw:"bihari",fr:"disponible"},
  prod_views:{en:"views",rw:"abarebye",fr:"vues"},
  prod_about:{en:"About this product",rw:"Ibijyanye n'iki gicuruzwa",fr:"À propos de ce produit"},
  prod_no_desc:{en:"No description.",rw:"Nta bisobanuro.",fr:"Aucune description."},
  prod_call_now:{en:"Call Now",rw:"Hamagara",fr:"Appeler"},
  prod_whatsapp:{en:"WhatsApp",rw:"WhatsApp",fr:"WhatsApp"},
  prod_rate_farmer:{en:"Rate this Farmer",rw:"Tanga Amanota ku Muhinzi",fr:"Évaluer cet agriculteur"},
  prod_submit_rating:{en:"Submit Rating",rw:"Ohereza Amanota",fr:"Soumettre la note"},
  prod_already_rated:{en:"Already rated",rw:"Wamaze gutanga amanota",fr:"Déjà noté"},
  prod_thank_you:{en:"Thank you!",rw:"Murakoze!",fr:"Merci !"},
  pform_name:{en:"Product Name *",rw:"Izina ry'Igicuruzwa *",fr:"Nom du produit *"},
  pform_category:{en:"Category",rw:"Icyiciro",fr:"Catégorie"},
  pform_type:{en:"Type *",rw:"Ubwoko *",fr:"Type *"},
  pform_select:{en:"Select…",rw:"Hitamo…",fr:"Sélectionner…"},
  pform_price:{en:"Price (RWF) *",rw:"Igiciro (RWF) *",fr:"Prix (RWF) *"},
  pform_quantity:{en:"Quantity",rw:"Umubare",fr:"Quantité"},
  pform_unit:{en:"Unit",rw:"Igipimo",fr:"Unité"},
  pform_description:{en:"Description",rw:"Ibisobanuro",fr:"Description"},
  pform_main_image:{en:"Main Image (cards & homepage)",rw:"Ifoto Nyamukuru (amakarita n'urupapuro rw'itangiriro)",fr:"Image principale (cartes et accueil)"},
  pform_main_image_ph:{en:"Main product photo",rw:"Ifoto nyamukuru y'igicuruzwa",fr:"Photo principale du produit"},
  pform_detail_image:{en:"Detail Image (full view only)",rw:"Ifoto Isesengura (kureba byuzuye gusa)",fr:"Image détaillée (vue complète uniquement)"},
  pform_detail_image_ph:{en:"Detail/secondary photo",rw:"Ifoto isesengura/iyungirije",fr:"Photo détaillée/secondaire"},
  pform_save:{en:"Save Changes",rw:"Bika Impinduka",fr:"Enregistrer les modifications"},
  pform_list_product:{en:"List Product",rw:"Shyiraho Igicuruzwa",fr:"Publier le produit"},
  err_select_type:{en:"Select type",rw:"Hitamo ubwoko",fr:"Sélectionnez un type"},
  err_valid_price:{en:"Enter valid price",rw:"Andika igiciro nyacyo",fr:"Saisissez un prix valide"},
  // Terms of Use
  terms_title:{en:"Terms of Use",rw:"Amabwiriza yo Gukoresha",fr:"Conditions d'utilisation"},
  terms_sec1_title:{en:"Using Inkingi Responsibly",rw:"Gukoresha Inkingi mu Buryo Bwiza",fr:"Utiliser Inkingi de manière responsable"},
  terms_sec1_item1:{en:"Everyone is welcome to use the Inkingi platform responsibly.",rw:"Buri wese arakwiriye gukoresha urubuga rwa Inkingi mu buryo bwiza.",fr:"Chacun est invité à utiliser la plateforme Inkingi de manière responsable."},
  terms_sec1_item2:{en:"Users are responsible for protecting their account credentials.",rw:"Abakoresha barashinzwe kurinda amakuru y'ukwinjira kwabo.",fr:"Les utilisateurs sont responsables de la protection de leurs identifiants de compte."},
  terms_sec1_item3:{en:"Buyers and sellers must provide truthful information.",rw:"Abaguzi n'abagurisha bagomba gutanga amakuru y'ukuri.",fr:"Les acheteurs et vendeurs doivent fournir des informations véridiques."},
  terms_sec1_item4:{en:"Users should verify products, livestock, sellers, buyers and payment details before completing transactions.",rw:"Abakoresha bagomba kwemeza ibicuruzwa, amatungo, abagurisha, abaguzi n'amakuru y'ubwishyu mbere yo gusoza igikorwa.",fr:"Les utilisateurs doivent vérifier les produits, le bétail, les vendeurs, les acheteurs et les informations de paiement avant de conclure une transaction."},
  terms_sec1_item5:{en:"Inkingi provides a digital agricultural marketplace but cannot guarantee every transaction.",rw:"Inkingi itanga isoko ry'ikoranabuhanga ry'ubuhinzi ariko ntishobora kwemeza buri gikorwa.",fr:"Inkingi propose un marché agricole numérique mais ne peut garantir chaque transaction."},
  terms_sec1_item6:{en:"Users must use the platform honestly and respectfully.",rw:"Abakoresha bagomba gukoresha urubuga mu kuri no mu cyubahiro.",fr:"Les utilisateurs doivent utiliser la plateforme honnêtement et avec respect."},
  terms_sec1_item7:{en:"Fraud, scams, fake listings, impersonation, identity theft, hacking attempts, misinformation, abusive behaviour and illegal activities are strictly prohibited.",rw:"Uburiganya, uburyarya, ibyanditswe by'ikinyoma, kwiyita undi muntu, kwiba indangamuntu, kugerageza guhungabanya sisitemu, amakuru y'ibinyoma, imyitwarire mibi n'ibikorwa binyuranyije n'amategeko birabujijwe rwose.",fr:"La fraude, les escroqueries, les fausses annonces, l'usurpation d'identité, le vol d'identité, les tentatives de piratage, la désinformation, les comportements abusifs et les activités illégales sont strictement interdits."},
  terms_sec2_title:{en:"Fraud Prevention",rw:"Kurwanya Uburiganya",fr:"Prévention de la fraude"},
  terms_sec2_p1:{en:"Inkingi is committed to providing a safe and trustworthy agricultural marketplace.",rw:"Inkingi yiyemeje gutanga isoko ry'ubuhinzi ryizewe kandi ritekanye.",fr:"Inkingi s'engage à fournir un marché agricole sûr et fiable."},
  terms_sec2_p2:{en:"Users are responsible for verifying the identity, products, livestock, services and payment information of anyone they choose to transact with.",rw:"Abakoresha barashinzwe kwemeza indangamuntu, ibicuruzwa, amatungo, serivisi n'amakuru y'ubwishyu by'uwo bahisemo gukorana nawe.",fr:"Les utilisateurs sont responsables de la vérification de l'identité, des produits, du bétail, des services et des informations de paiement de toute personne avec qui ils choisissent de transiger."},
  terms_sec2_p3:{en:"Any user found engaging in fraud, scams, fake listings, impersonation, identity theft, misinformation or criminal activity may have their account permanently suspended or terminated.",rw:"Umukoresha uwo ari we wese uzasangwa akora uburiganya, uburyarya, ibyanditswe by'ikinyoma, kwiyita undi muntu, kwiba indangamuntu, amakuru y'ibinyoma cyangwa ibikorwa by'ubugizi bwa nabi, konti ye irashobora guhagarikwa burundu.",fr:"Tout utilisateur reconnu coupable de fraude, d'escroquerie, de fausses annonces, d'usurpation d'identité, de vol d'identité, de désinformation ou d'activité criminelle peut voir son compte suspendu ou résilié définitivement."},
  terms_sec2_p4:{en:"Where there is reasonable evidence of criminal activity, Inkingi may report the matter to the Rwanda National Police or other competent authorities for investigation in accordance with the laws of the Republic of Rwanda.",rw:"Iyo hari ibimenyetso bifatika by'ibikorwa by'ubugizi bwa nabi, Inkingi ishobora kubimenyesha Polisi y'Igihugu y'u Rwanda cyangwa izindi nzego zibifitiye ububasha kugira ngo bakore iperereza hakurikijwe amategeko ya Repubulika y'u Rwanda.",fr:"En cas de preuves raisonnables d'activité criminelle, Inkingi peut signaler l'affaire à la Police Nationale du Rwanda ou à d'autres autorités compétentes pour enquête, conformément aux lois de la République du Rwanda."},
  terms_sec2_p5:{en:"By using Inkingi, every user agrees to act honestly, responsibly and in compliance with the laws of Rwanda.",rw:"Mu gukoresha Inkingi, buri mukoresha yemera gukora mu kuri, mu buryo bwiza no mu bwubahirizwa bw'amategeko y'u Rwanda.",fr:"En utilisant Inkingi, chaque utilisateur accepte d'agir honnêtement, de manière responsable et conformément aux lois du Rwanda."},
  // Privacy Policy
  privacy_title:{en:"Privacy Policy",rw:"Politiki y'Ibanga",fr:"Politique de confidentialité"},
  privacy_sec1_title:{en:"Information We Collect",rw:"Amakuru Dukusanya",fr:"Informations que nous collectons"},
  privacy_sec1_item1:{en:"Name, phone number, and location (district, sector, village)",rw:"Izina, nimero ya telefoni, n'aho uba (akarere, umurenge, umudugudu)",fr:"Nom, numéro de téléphone et localisation (district, secteur, village)"},
  privacy_sec1_item2:{en:"Farmer or buyer profile details, product and livestock listings",rw:"Amakuru y'umwirondoro w'umuhinzi cyangwa umuguzi, ibyanditswe by'ibicuruzwa n'amatungo",fr:"Détails du profil de l'agriculteur ou de l'acheteur, annonces de produits et de bétail"},
  privacy_sec1_item3:{en:"Basic usage data such as pages visited and searches performed",rw:"Amakuru y'ibanze y'ikoreshwa nk'amapaji yasuwe n'ubushakashatsi bwakozwe",fr:"Données d'utilisation de base telles que les pages visitées et les recherches effectuées"},
  privacy_sec2_title:{en:"Why We Collect It",rw:"Impamvu Tubikusanya",fr:"Pourquoi nous les collectons"},
  privacy_sec2_item1:{en:"To operate and improve the marketplace",rw:"Kugira ngo dukoreshe kandi tunoze isoko",fr:"Pour exploiter et améliorer le marché"},
  privacy_sec2_item2:{en:"To verify farmer and buyer identities",rw:"Kwemeza indangamuntu z'abahinzi n'abaguzi",fr:"Pour vérifier l'identité des agriculteurs et des acheteurs"},
  privacy_sec2_item3:{en:"To connect buyers with sellers",rw:"Guhuza abaguzi n'abagurisha",fr:"Pour mettre en relation acheteurs et vendeurs"},
  privacy_sec2_item4:{en:"To provide market prices, farming tips and alerts relevant to your area",rw:"Gutanga ibiciro by'isoko, inama z'ubuhinzi n'imenyesha bijyanye n'aho uba",fr:"Pour fournir les prix du marché, des conseils agricoles et des alertes pertinentes pour votre région"},
  privacy_sec3_title:{en:"How Information Is Stored & Secured",rw:"Uburyo Amakuru Abikwa Kandi Arindwa",fr:"Comment les informations sont stockées et sécurisées"},
  privacy_sec3_p:{en:"Information is stored using access-controlled systems, with administrator actions logged for accountability and safeguards to protect against unauthorized access.",rw:"Amakuru abikwa hakoreshejwe sisitemu zigengwa n'uburenganzira bwo kuyageraho, ibikorwa by'abayobozi bikanditswe kugira ngo hagire ubwishingizi n'uburinzi bw'uburenganzira budasabwe.",fr:"Les informations sont stockées à l'aide de systèmes à accès contrôlé, les actions des administrateurs étant enregistrées pour la responsabilisation et la protection contre les accès non autorisés."},
  privacy_sec4_title:{en:"How Information Is Used",rw:"Uburyo Amakuru Akoreshwa",fr:"Comment les informations sont utilisées"},
  privacy_sec4_p:{en:"Information is used only to operate the Inkingi platform — connecting farmers and buyers, verifying accounts, and improving services. It is never sold to third parties.",rw:"Amakuru akoreshwa gusa mu gukoresha urubuga rwa Inkingi — guhuza abahinzi n'abaguzi, kwemeza konti, no kunoza serivisi. Ntabwo agurishwa ku bandi.",fr:"Les informations sont utilisées uniquement pour exploiter la plateforme Inkingi — connecter agriculteurs et acheteurs, vérifier les comptes et améliorer les services. Elles ne sont jamais vendues à des tiers."},
  privacy_sec5_title:{en:"Who Can Access Information",rw:"Ababona Amakuru",fr:"Qui peut accéder aux informations"},
  privacy_sec5_p:{en:"Only authorized Inkingi administrators can access account records. Buyers and sellers only see the profile and listing information users choose to make public.",rw:"Abayobozi ba Inkingi babifitiye uburenganzira gusa ni bo babona amakuru ya konti. Abaguzi n'abagurisha babona gusa amakuru y'umwirondoro n'ibyanditswe abakoresha bahisemo kumenyekanisha.",fr:"Seuls les administrateurs autorisés d'Inkingi peuvent accéder aux dossiers de compte. Les acheteurs et vendeurs ne voient que les informations de profil et d'annonces que les utilisateurs choisissent de rendre publiques."},
  privacy_sec6_title:{en:"Your Privacy Rights",rw:"Uburenganzira Bwawe ku Bwigenge",fr:"Vos droits en matière de confidentialité"},
  privacy_sec6_item1:{en:"You may request to view, correct, or delete your personal information",rw:"Ushobora gusaba kureba, gukosora, cyangwa gusiba amakuru yawe bwite",fr:"Vous pouvez demander à consulter, corriger ou supprimer vos informations personnelles"},
  privacy_sec6_item2:{en:"You may ask about how your data is used at any time",rw:"Ushobora kubaza uburyo amakuru yawe akoreshwa igihe cyose",fr:"Vous pouvez vous renseigner sur l'utilisation de vos données à tout moment"},
  privacy_sec7_title:{en:"Cookies",rw:"Cookies",fr:"Cookies"},
  privacy_sec7_p:{en:"Inkingi may use basic local storage on your device to keep you signed in and remember your preferences. This is not shared with third parties.",rw:"Inkingi ishobora gukoresha ububiko bw'ibanze kuri telefoni yawe kugira ngo ugume winjiye no kwibuka ibyo uhisemo. Ibi ntibisangirwa n'abandi.",fr:"Inkingi peut utiliser un stockage local de base sur votre appareil pour vous garder connecté et mémoriser vos préférences. Ceci n'est pas partagé avec des tiers."},
  privacy_sec8_title:{en:"Contact for Privacy Enquiries",rw:"Aho Wamenyera Ibijyanye n'Ibanga",fr:"Contact pour les questions de confidentialité"},
  // Support modal
  support_title:{en:"Support",rw:"Ubufasha",fr:"Assistance"},
  support_location:{en:"Location",rw:"Aho Turi",fr:"Emplacement"},
  support_phone:{en:"Phone",rw:"Telefoni",fr:"Téléphone"},
  support_hours:{en:"Hours",rw:"Amasaha",fr:"Heures"},
  support_email:{en:"Email",rw:"Imeyili",fr:"E-mail"},
  support_default_hours:{en:"Open 24 Hours / 7 Days a Week (24/7)",rw:"Bifunguye Amasaha 24 / Iminsi 7 mu Cyumweru (24/7)",fr:"Ouvert 24h/24 et 7j/7"},
  // Footer
  footer_our_vision:{en:"Our Vision",rw:"Icyerekezo Cyacu",fr:"Notre vision"},
  footer_our_mission:{en:"Our Mission",rw:"Intego Yacu",fr:"Notre mission"},
  footer_quick_links:{en:"Quick Links",rw:"Aho Wihuta Ujya",fr:"Liens rapides"},
  footer_contact_support:{en:"Contact & Support",rw:"Aho Twafasha n'Ubufasha",fr:"Contact et assistance"},
  footer_email:{en:"Email",rw:"Imeyili",fr:"E-mail"},
  footer_rights:{en:"All rights reserved. · Built for Rwanda's agricultural future.",rw:"Uburenganzira bwose burarindwa. · Byakorewe ejo hazaza h'ubuhinzi bw'u Rwanda.",fr:"Tous droits réservés. · Conçu pour l'avenir agricole du Rwanda."},
  footer_privacy:{en:"Privacy Policy",rw:"Politiki y'Ibanga",fr:"Politique de confidentialité"},
  footer_terms:{en:"Terms of Use",rw:"Amabwiriza yo Gukoresha",fr:"Conditions d'utilisation"},
  footer_support:{en:"Support",rw:"Ubufasha",fr:"Assistance"},
  // Shared admin
  admin_access_required:{en:"Admin Access Required",rw:"Uruhushya rw'Ubuyobozi Rirakenewe",fr:"Accès administrateur requis"},
  admin_panel:{en:"Admin Panel",rw:"Ikibaho cy'Ubuyobozi",fr:"Panneau d'administration"},
  admin_manage_platform:{en:"Manage your platform",rw:"Genzura urubuga rwawe",fr:"Gérez votre plateforme"},
  admin_db_connected:{en:"Database Connected",rw:"Ububiko Buhujwe",fr:"Base de données connectée"},
  admin_sync_issue:{en:"Sync Issue — check connection",rw:"Ikibazo cyo Guhuza — reba ukwihuza",fr:"Problème de synchronisation — vérifiez la connexion"},
  admin_dev_mode:{en:"Development Mode (localStorage)",rw:"Uburyo bwo Kwigeragereza (localStorage)",fr:"Mode développement (localStorage)"},
  admin_local_images:{en:"Local Images",rw:"Amafoto y'Aho Uri",fr:"Images locales"},
  admin_tab_dashboard:{en:"Dashboard",rw:"Imbonerahamwe",fr:"Tableau de bord"},
  admin_tab_farmers:{en:"Farmers",rw:"Abahinzi",fr:"Agriculteurs"},
  admin_tab_products:{en:"Products",rw:"Ibicuruzwa",fr:"Produits"},
  admin_tab_prices:{en:"Prices",rw:"Ibiciro",fr:"Prix"},
  admin_tab_tips:{en:"Tips",rw:"Inama",fr:"Conseils"},
  admin_tab_pests:{en:"Pests",rw:"Udukoko",fr:"Nuisibles"},
  admin_tab_calendar:{en:"Calendar",rw:"Kalindari",fr:"Calendrier"},
  admin_tab_slideshow:{en:"Slideshow",rw:"Amashusho Ahindagurika",fr:"Diaporama"},
  admin_tab_ads:{en:"Ads",rw:"Ubwamamaza",fr:"Publicités"},
  admin_tab_site:{en:"Site Settings",rw:"Igenamiterere ry'Urubuga",fr:"Paramètres du site"},
  admin_total_farmers:{en:"Total Farmers",rw:"Abahinzi Bose",fr:"Total agriculteurs"},
  admin_listings:{en:"Listings",rw:"Ibyanditswe",fr:"Annonces"},
  admin_pending:{en:"Pending",rw:"Bitegereje",fr:"En attente"},
  admin_total_views:{en:"Total Views",rw:"Abarebye Bose",fr:"Total des vues"},
  admin_pending_approvals:{en:"Pending Farmer Approvals",rw:"Abahinzi Bategereje Kwemezwa",fr:"Approbations d'agriculteurs en attente"},
  admin_no_pending:{en:"No pending approvals!",rw:"Nta bategereje kwemezwa!",fr:"Aucune approbation en attente !"},
  admin_verify:{en:"Verify",rw:"Emeza",fr:"Vérifier"},
  admin_block:{en:"Block",rw:"Buza",fr:"Bloquer"},
  msg_farmer_verified:{en:"verified!",rw:"yemejwe!",fr:"vérifié !"},
  admin_pending_farmers:{en:"Pending Farmers",rw:"Abahinzi Bategereje",fr:"Agriculteurs en attente"},
  admin_all_farmers:{en:"All Farmers",rw:"Abahinzi Bose",fr:"Tous les agriculteurs"},
  admin_clear_filter:{en:"Clear filter",rw:"Siba Akayunguruzo",fr:"Effacer le filtre"},
  admin_no_farmers_match:{en:"No farmers match this filter.",rw:"Nta muhinzi uhuye n'aka kayunguruzo.",fr:"Aucun agriculteur ne correspond à ce filtre."},
  admin_verified:{en:"Verified",rw:"Yemejwe",fr:"Vérifié"},
  admin_blocked:{en:"Blocked",rw:"Yabujijwe",fr:"Bloqué"},
  admin_listings_count:{en:"listings",rw:"ibyanditswe",fr:"annonces"},
  admin_photo:{en:"Photo",rw:"Ifoto",fr:"Photo"},
  admin_delete:{en:"Delete",rw:"Siba",fr:"Supprimer"},
  admin_confirm_delete_farmer:{en:"Delete farmer?",rw:"Gusiba umuhinzi?",fr:"Supprimer l'agriculteur ?"},
  admin_all_listings:{en:"All Listings",rw:"Ibyanditswe Byose",fr:"Toutes les annonces"},
  admin_add:{en:"Add",rw:"Ongeraho",fr:"Ajouter"},
  admin_in_stock:{en:"In Stock",rw:"Birahari",fr:"En stock"},
  admin_out:{en:"Out",rw:"Byashize",fr:"Épuisé"},
  admin_unfeature:{en:"Unfeature",rw:"Kuraho Itsinda",fr:"Retirer la mise en avant"},
  admin_feature:{en:"Feature",rw:"Shyira mu Itsinda",fr:"Mettre en avant"},
  admin_edit:{en:"Edit",rw:"Hindura",fr:"Modifier"},
  admin_del:{en:"Del",rw:"Siba",fr:"Suppr."},
  loading_text:{en:"Loading Inkingi…",rw:"Inkingi Iratangira…",fr:"Chargement d'Inkingi…"},
  // Farmer Detail modal
  fdm_ratings:{en:"ratings",rw:"amanota",fr:"avis"},
  fdm_call:{en:"Call",rw:"Hamagara",fr:"Appeler"},
  fdm_listings:{en:"Listings",rw:"Ibyanditswe",fr:"Annonces"},
  fdm_no_listings:{en:"No active listings",rw:"Nta byanditswe biriho",fr:"Aucune annonce active"},
  // Ad Manager
  adm_title:{en:"Advertisement Manager",rw:"Igenzura ry'Ubwamamaza",fr:"Gestionnaire de publicités"},
  adm_subtitle:{en:"Ads display in the full-width banner carousel above the footer",rw:"Ubwamamaza bugaragara ku ishusho ihindagurika hejuru y'ibirangira",fr:"Les publicités s'affichent dans le carrousel en haut de page au-dessus du pied de page"},
  adm_new_ad:{en:"New Ad",rw:"Itangazo Rishya",fr:"Nouvelle publicité"},
  adm_none_yet:{en:"No ads yet.",rw:"Nta bwamamaza burakorwa.",fr:"Aucune publicité pour le moment."},
  adm_live:{en:"Live",rw:"Birakora",fr:"En ligne"},
  adm_scheduled:{en:"Scheduled",rw:"Byateganyijwe",fr:"Programmé"},
  adm_inactive:{en:"Inactive",rw:"Ntibikora",fr:"Inactif"},
  adm_pause:{en:"Pause",rw:"Hagarika",fr:"Suspendre"},
  adm_activate:{en:"Activate",rw:"Tangiza",fr:"Activer"},
  adm_edit_ad:{en:"Edit Ad",rw:"Hindura Itangazo",fr:"Modifier la publicité"},
  adm_new_advertisement:{en:"New Advertisement",rw:"Itangazo Rishya",fr:"Nouvelle publicité"},
  adm_title_field:{en:"Title *",rw:"Umutwe *",fr:"Titre *"},
  adm_description:{en:"Description",rw:"Ibisobanuro",fr:"Description"},
  adm_button_label:{en:"Button Label",rw:"Izina ry'Akabuto",fr:"Libellé du bouton"},
  adm_website_link:{en:"Website Link",rw:"Ihuza ry'Urubuga",fr:"Lien du site web"},
  adm_phone_call_btn:{en:"Phone (for Call button)",rw:"Telefoni (ku kabuto ko Guhamagara)",fr:"Téléphone (pour le bouton Appeler)"},
  adm_display_duration:{en:"Display Duration (seconds)",rw:"Igihe cyo Kwerekana (amasegonda)",fr:"Durée d'affichage (secondes)"},
  adm_active:{en:"Active",rw:"Birakora",fr:"Actif"},
  adm_show_after:{en:"Show After (optional)",rw:"Erekana Nyuma ya (si ngombwa)",fr:"Afficher après (facultatif)"},
  adm_hide_after:{en:"Hide After (optional)",rw:"Hisha Nyuma ya (si ngombwa)",fr:"Masquer après (facultatif)"},
  adm_main_banner:{en:"Main Banner Image",rw:"Ifoto Nyamukuru y'Itangazo",fr:"Image principale de la bannière"},
  adm_gallery_images:{en:"Additional Gallery Images (shown in the ad details view)",rw:"Andi Mafoto (agaragara mu isesengura ry'itangazo)",fr:"Images de galerie supplémentaires (affichées dans les détails de l'annonce)"},
  adm_add_image:{en:"Add Image",rw:"Ongeraho Ifoto",fr:"Ajouter une image"},
  adm_gallery_image_n:{en:"Gallery image",rw:"Ifoto y'igaleri",fr:"Image de galerie"},
  adm_save_changes:{en:"Save Changes",rw:"Bika Impinduka",fr:"Enregistrer les modifications"},
  adm_publish_ad:{en:"Publish Ad",rw:"Sohora Itangazo",fr:"Publier la publicité"},
  msg_title_required:{en:"Title required",rw:"Umutwe urakenewe",fr:"Titre requis"},
  msg_published:{en:"Published!",rw:"Byasohowe!",fr:"Publié !"},
  msg_removed:{en:"Removed",rw:"Byavanyweho",fr:"Supprimé"},
  confirm_delete_ad:{en:"Delete ad?",rw:"Gusiba itangazo?",fr:"Supprimer la publicité ?"},
  // Site Settings
  ss_db_connected_title:{en:"Connected to central database",rw:"Guhuzwa n'Ububiko Nyamukuru",fr:"Connecté à la base de données centrale"},
  ss_dev_mode_title:{en:"Running in development mode",rw:"Birakora mu Buryo bwo Kwigeragereza",fr:"Fonctionne en mode développement"},
  ss_db_connected_desc:{en:"All content — farmers, products, prices, tips, pests, calendar, ads, slideshow, and site settings — is being saved to Supabase and is instantly visible to every visitor and device after they refresh.",rw:"Ibirimo byose — abahinzi, ibicuruzwa, ibiciro, inama, udukoko, kalindari, ubwamamaza, amashusho, n'igenamiterere ry'urubuga — babikwa muri Supabase kandi bigaragara ako kanya ku bantu bose nyuma yo kongera gufungura.",fr:"Tout le contenu — agriculteurs, produits, prix, conseils, nuisibles, calendrier, publicités, diaporama et paramètres du site — est enregistré dans Supabase et instantanément visible par chaque visiteur après actualisation."},
  ss_dev_mode_desc:{en:"No Supabase credentials are configured, so all content is stored in this browser's localStorage only. Other visitors and devices won't see admin changes made here. See the README setup section for how to connect a real database before going live.",rw:"Nta makuru ya Supabase yashyizweho, bityo ibirimo byose bibikwa muri localStorage ya iyi porogaramu gusa. Abandi bakoresha ntibazabona impinduka zakorewe hano. Reba igice cya README kugira ngo umenye uko wahuza ububiko nyakuri mbere yo gutangira gukoresha urubuga mu buzima nyabwo.",fr:"Aucun identifiant Supabase n'est configuré, donc tout le contenu est stocké uniquement dans le localStorage de ce navigateur. Les autres visiteurs ne verront pas les modifications faites ici. Consultez la section README pour connecter une vraie base de données avant la mise en ligne."},
  ss_pushing:{en:"Pushing…",rw:"Byoherezwa…",fr:"Envoi en cours…"},
  ss_push_local:{en:"Push this browser's local data to the database",rw:"Ohereza amakuru y'iyi porogaramu ku bubiko",fr:"Envoyer les données locales de ce navigateur vers la base de données"},
  ss_official_logo:{en:"Official Logo",rw:"Ikirango Nyamukuru",fr:"Logo officiel"},
  ss_logo_desc:{en:"Used in the navigation bar, footer, login, registration, and admin panel. Leave blank to keep the official Inkingi logo.",rw:"Gikoreshwa ku murongo w'ibuganduro, ibirangira, kwinjira, kwiyandikisha, n'ikibaho cy'ubuyobozi. Reka nta kimo niba ushaka gukomeza gukoresha ikirango nyamukuru cya Inkingi.",fr:"Utilisé dans la barre de navigation, le pied de page, la connexion, l'inscription et le panneau d'administration. Laissez vide pour conserver le logo officiel d'Inkingi."},
  ss_upload_logo:{en:"Upload or paste logo URL",rw:"Ohereza cyangwa Shyiramo Ihuza ry'Ikirango",fr:"Téléchargez ou collez l'URL du logo"},
  ss_favicon:{en:"Browser Favicon",rw:"Agashusho ko kuri Munara",fr:"Favicon du navigateur"},
  ss_favicon_desc:{en:"The small icon shown in the browser tab. Leave blank to use the official logo.",rw:"Agashusho gato kagaragara kuri munara. Reka nta kimo niba ushaka gukoresha ikirango nyamukuru.",fr:"La petite icône affichée dans l'onglet du navigateur. Laissez vide pour utiliser le logo officiel."},
  ss_upload_favicon:{en:"Upload or paste favicon URL",rw:"Ohereza cyangwa Shyiramo Ihuza ry'Agashusho",fr:"Téléchargez ou collez l'URL du favicon"},
  ss_about_vision_mission:{en:"About, Vision & Mission",rw:"Ibijyanye, Icyerekezo & Intego",fr:"À propos, vision et mission"},
  ss_about:{en:"About Inkingi",rw:"Ibijyanye na Inkingi",fr:"À propos d'Inkingi"},
  ss_vision:{en:"Vision",rw:"Icyerekezo",fr:"Vision"},
  ss_mission:{en:"Mission",rw:"Intego",fr:"Mission"},
  ss_contact_hours:{en:"Contact & Hours",rw:"Aho Twafasha n'Amasaha",fr:"Contact et horaires"},
  ss_address:{en:"Address",rw:"Aho Turi",fr:"Adresse"},
  ss_phone:{en:"Phone",rw:"Telefoni",fr:"Téléphone"},
  ss_working_hours:{en:"Working Hours",rw:"Amasaha y'Akazi",fr:"Heures d'ouverture"},
  ss_quick_links:{en:"Quick Links",rw:"Aho Wihuta Ujya",fr:"Liens rapides"},
  ss_quick_links_desc:{en:"One per line. Options: Marketplace, Farmers, Market Prices, Farming Tips, Pest & Disease Center, Seasonal Planting Calendar",rw:"Umurongo umwe kuri buri kimwe. Amahitamo: Isoko, Abahinzi, Ibiciro by'Isoko, Inama z'Ubuhinzi, Ikigo cy'Udukoko n'Indwara, Kalindari y'Ibihe byo Gutera",fr:"Un par ligne. Options : Marché, Agriculteurs, Prix du marché, Conseils agricoles, Centre des nuisibles et maladies, Calendrier saisonnier de plantation"},
  ss_save_all:{en:"Save All Settings",rw:"Bika Igenamiterere Ryose",fr:"Enregistrer tous les paramètres"},
  msg_site_saved:{en:"Site settings saved!",rw:"Igenamiterere ry'urubuga ryabitswe!",fr:"Paramètres du site enregistrés !"},
  msg_saved_locally:{en:"Saved locally — database sync failed, check connection",rw:"Byabitswe aho uri — guhuza n'ububiko byanze, reba ukwihuza",fr:"Enregistré localement — échec de la synchronisation, vérifiez la connexion"},
  msg_migration_pushed:{en:"Local data pushed to the database!",rw:"Amakuru yo hano yoherejwe ku bubiko!",fr:"Données locales envoyées vers la base de données !"},
  msg_migration_failed:{en:"Migration failed:",rw:"Kohereza byanze:",fr:"Échec de la migration :"},
  // Carousel Manager
  cm_title:{en:"Slideshow Manager",rw:"Igenzura ry'Amashusho Ahindagurika",fr:"Gestionnaire du diaporama"},
  cm_slides:{en:"slides",rw:"amashusho",fr:"diapositives"},
  cm_live:{en:"live",rw:"birakora",fr:"en ligne"},
  cm_drag_reorder:{en:"drag to reorder",rw:"kurura kugira ngo uhindure urutonde",fr:"glisser pour réorganiser"},
  cm_new_slide:{en:"New Slide",rw:"Ishusho Nshya",fr:"Nouvelle diapositive"},
  cm_none_yet:{en:"No slides yet.",rw:"Nta mashusho arakorwa.",fr:"Aucune diapositive pour le moment."},
  cm_untitled:{en:"Untitled",rw:"Nta Mutwe",fr:"Sans titre"},
  cm_scheduled:{en:"Scheduled",rw:"Byateganyijwe",fr:"Programmé"},
  cm_draft:{en:"Draft",rw:"Igishushanyo",fr:"Brouillon"},
  cm_unpublish:{en:"Unpublish",rw:"Kuraho Gutangaza",fr:"Dépublier"},
  cm_publish:{en:"Publish",rw:"Tangaza",fr:"Publier"},
  cm_edit_slide:{en:"Edit",rw:"Hindura",fr:"Modifier"},
  cm_new_slide_title:{en:"New",rw:"Nshya",fr:"Nouvelle"},
  cm_slide_suffix:{en:"Slide",rw:"Ishusho",fr:"diapositive"},
  cm_slide_type:{en:"Slide Type",rw:"Ubwoko bw'Ishusho",fr:"Type de diapositive"},
  cm_type_welcome:{en:"Welcome / Image",rw:"Ikaze / Ifoto",fr:"Bienvenue / Image"},
  cm_type_map:{en:"Map / Regions",rw:"Ikarita / Uturere",fr:"Carte / Régions"},
  cm_type_crops:{en:"Crops Grid",rw:"Imbonerahamwe y'Ibihingwa",fr:"Grille de cultures"},
  cm_type_livestock:{en:"Livestock Grid",rw:"Imbonerahamwe y'Amatungo",fr:"Grille de bétail"},
  cm_title_field:{en:"Title",rw:"Umutwe",fr:"Titre"},
  cm_subtitle:{en:"Subtitle",rw:"Ikirunzi",fr:"Sous-titre"},
  cm_interval:{en:"Interval (seconds)",rw:"Igihe (amasegonda)",fr:"Intervalle (secondes)"},
  cm_published:{en:"Published",rw:"Byasohowe",fr:"Publié"},
  cm_show_after:{en:"Show After (optional)",rw:"Erekana Nyuma ya (si ngombwa)",fr:"Afficher après (facultatif)"},
  cm_hide_after:{en:"Hide After (optional)",rw:"Hisha Nyuma ya (si ngombwa)",fr:"Masquer après (facultatif)"},
  cm_description:{en:"Description",rw:"Ibisobanuro",fr:"Description"},
  cm_main_image:{en:"Main Image",rw:"Ifoto Nyamukuru",fr:"Image principale"},
  cm_regions:{en:"Agricultural Regions",rw:"Uturere tw'Ubuhinzi",fr:"Régions agricoles"},
  cm_add_region:{en:"Add Region",rw:"Ongeraho Akarere",fr:"Ajouter une région"},
  cm_region_name:{en:"Region Name",rw:"Izina ry'Akarere",fr:"Nom de la région"},
  cm_color:{en:"Color",rw:"Ibara",fr:"Couleur"},
  cm_crops_livestock:{en:"Crops / Livestock",rw:"Ibihingwa / Amatungo",fr:"Cultures / Bétail"},
  cm_grid_items:{en:"Grid Items",rw:"Ibintu by'Imbonerahamwe",fr:"Éléments de la grille"},
  cm_add_item:{en:"Add Item",rw:"Ongeraho Ikintu",fr:"Ajouter un élément"},
  cm_item_desc_ph:{en:"Short caption shown on hover",rw:"Umwandiko mugufi ugaragara igihe utereye",fr:"Légende courte affichée au survol"},
  cm_item_desc_label:{en:"Description (optional)",rw:"Ibisobanuro (si ngombwa)",fr:"Description (facultatif)"},
  cm_image:{en:"Image",rw:"Ifoto",fr:"Image"},
  cm_save_slide:{en:"Save Slide",rw:"Bika Ishusho",fr:"Enregistrer la diapositive"},
  msg_slide_updated:{en:"Slide updated!",rw:"Ishusho yahinduwe!",fr:"Diapositive mise à jour !"},
  msg_slide_created:{en:"Slide created!",rw:"Ishusho yaremwe!",fr:"Diapositive créée !"},
  msg_status_updated:{en:"Status updated",rw:"Uko bihagaze byahinduwe",fr:"Statut mis à jour"},
  confirm_delete_slide:{en:"Delete slide permanently?",rw:"Gusiba burundu iyi shusho?",fr:"Supprimer définitivement cette diapositive ?"},
};

const LangContext = createContext(null);

// Wraps the app so any component can call useLang() to read the active
// language and translate strings, without threading a `lang` prop through
// every level. Persists the choice via the same LS (localStorage) helper
// every other saved preference in this app already uses, under its own
// "ik_lang" key, so it doesn't collide with or disturb any existing data.
function LangProvider({children}){
  const[lang,setLang]=useState(()=>LS.g("lang")||"en");
  useEffect(()=>{LS.s("lang",lang)},[lang]);
  const t=key=>TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.en ?? key;
  return <LangContext.Provider value={{lang,setLang,t}}>{children}</LangContext.Provider>;
}
const useLang=()=>useContext(LangContext);


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
  // `skipDelete`: when true, this call only upserts `rows` and never
  // deletes anything based on what's absent from the array. Defaults to
  // false so every existing caller (products/prices/tips/pests/calendar,
  // and the backup-restore path, which intentionally needs a save to
  // remove rows added since the backup) keeps its exact current
  // behavior. Only saveFarmers() opts into skipDelete=true — see the
  // comment there for why: two sessions saving the farmers table with
  // different/stale snapshots must never be able to delete each other's
  // rows as a side effect of an unrelated save.
  //
  // `cacheRows`: optional. When provided, the LOCAL cache (this
  // browser's offline/instant-UI copy) is written using this fuller
  // array, while the actual network request to Supabase still only
  // ever sends `rows`. This is what lets a single new/changed row be
  // upserted to Supabase (satisfying a strict per-row RLS policy like
  // `auth.uid() = id`) without shrinking this browser's local view of
  // every other farmer down to just that one row. Defaults to `rows`,
  // so every existing caller that doesn't pass this keeps its exact
  // current behavior (local cache and network payload stay identical).
  async save(table, rows, skipDelete=false, cacheRows=null) {
    LS.s(table, cacheRows||rows); // keep the local cache current for instant UI + offline fallback
    if (!HAS_SUPABASE) { lastSyncOk=true; return {ok:true}; }
    try {
      if (!skipDelete) {
        const existing = await SB.get(table, "select=id");
        const keepIds = new Set(rows.map(r=>r.id));
        const toDelete = existing.filter(r=>!keepIds.has(r.id)).map(r=>r.id);
        if (toDelete.length) await SB.del(table, `id=in.(${toDelete.map(id=>encodeURIComponent(id)).join(",")})`);
      }
      if (rows.length) {
        const payload = rows.map(({id,...rest})=>({id, data:rest}));
        await SB.upsert(table, payload);
      }
      lastSyncOk = true;
      return {ok:true};
    } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
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
  // Used by Admin's existing Pending Approvals list to approve/block a
  // wholesaler the same way a farmer's status is changed — updates just
  // the one row (wholesalers is a flat table, not the jsonb-wrapped
  // pattern the other tables use via SA), and keeps the local cache in
  // sync the same way add() does.
  async setStatus(id, status) {
    if (HAS_SUPABASE) {
      try {
        await SB.patch("wholesalers", `id=eq.${id}`, {status});
        lastSyncOk = true;
        const cached = (LS.g("wholesalers")||[]).map(w=>w.id===id?{...w,status}:w);
        LS.s("wholesalers", cached);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    const cached = (LS.g("wholesalers")||[]).map(w=>w.id===id?{...w,status}:w);
    LS.s("wholesalers", cached);
    return {ok:true};
  },
  // Used by the Wholesaler panel to update their own profile picture
  // after registration — same single-row PATCH pattern as setStatus.
  async updateImage(id, image_url) {
    if (HAS_SUPABASE) {
      try {
        await SB.patch("wholesalers", `id=eq.${id}`, {image_url});
        lastSyncOk = true;
        const cached = (LS.g("wholesalers")||[]).map(w=>w.id===id?{...w,image_url}:w);
        LS.s("wholesalers", cached);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    const cached = (LS.g("wholesalers")||[]).map(w=>w.id===id?{...w,image_url}:w);
    LS.s("wholesalers", cached);
    return {ok:true};
  },
};

// Business accounts (Stage 3 of the new Business system) — mirrors WS
// above exactly: `businesses` is a flat relational table (no jsonb blob,
// see businesses/business_compliance/business_products schema, verified
// live in Stage 1), so every write here is a genuine INSERT (add) or a
// genuine column-scoped UPDATE (_patchBusiness) via SB.post/SB.patch.
// SB.upsert is never used — learned directly from the farmers
// upsert-vs-INSERT-policy bug earlier this session.
const Biz = {
  async getAll() {
    if (HAS_SUPABASE) {
      try {
        const rows = await SB.get("businesses", "select=*&order=created_at.asc");
        lastSyncOk = true; LS.s("businesses", rows); return rows;
      } catch { lastSyncOk = false; }
    }
    return LS.g("businesses") || [];
  },
  async getOne(id) {
    if (HAS_SUPABASE) {
      try {
        const rows = await SB.get("businesses", `id=eq.${id}&select=*`);
        lastSyncOk = true; return rows?.[0] || null;
      } catch { lastSyncOk = false; return null; }
    }
    return (LS.g("businesses") || []).find(b=>b.id===id) || null;
  },
  // Genuine one-time INSERT — plain SB.post, no merge-duplicates header.
  async add(row) {
    if (HAS_SUPABASE) {
      try {
        await SB.post("businesses", row);
        lastSyncOk = true;
        const cached = LS.g("businesses") || [];
        LS.s("businesses", [...cached, row]);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    const cached = LS.g("businesses") || [];
    LS.s("businesses", [...cached, row]);
    return {ok:true};
  },
  // Genuine column-scoped UPDATE — never upsert, never a full-object
  // replace. `patch` is only the changed fields (e.g. {status:"approved"}),
  // sent as-is via SB.patch; PostgREST maps this to
  // UPDATE businesses SET <only those columns> WHERE id=... — no other
  // column is read or resent. businesses has no jsonb column, so there is
  // no equivalent of the farmers full-blob-replacement/rating-trigger risk.
  async _patchBusiness(id, patch) {
    if (HAS_SUPABASE) {
      try {
        await SB.patch("businesses", `id=eq.${id}`, patch);
        lastSyncOk = true;
        const cached = (LS.g("businesses")||[]).map(b=>b.id===id?{...b,...patch}:b);
        LS.s("businesses", cached);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    const cached = (LS.g("businesses")||[]).map(b=>b.id===id?{...b,...patch}:b);
    LS.s("businesses", cached);
    return {ok:true};
  },
  // Atomic registration — calls the register_business RPC (Stage 4),
  // which inserts the businesses row and its business_compliance row in
  // a single transaction: both succeed or neither is created. Returns
  // the created businesses row on success. Not a replacement for add()
  // (still used elsewhere), only used by the registration paths below.
  async registerAtomic(payload) {
    if (HAS_SUPABASE) {
      try {
        const row = await SB.post("rpc/register_business", payload);
        lastSyncOk = true;
        const created = Array.isArray(row) ? row[0] : row;
        const cached = LS.g("businesses") || [];
        LS.s("businesses", [...cached, created]);
        return {ok:true, business:created};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    return {ok:false, reason:"Registration is not configured yet — see SETUP.md"};
  },
};

// Dedicated Admin profile lookup — deliberately read-only from the app.
// Admin accounts live in their own `admins` table (separate from
// `farmers`/`wholesalers` on purpose) so that farmer/wholesaler
// management actions (delete/block/edit) can never touch an Admin
// account, structurally, by construction. There is no add/update/delete
// here: per the RLS policy this table uses, only the Supabase service
// role can write to it — admin accounts are provisioned via SQL in the
// Supabase dashboard, the same way the very first admin account was.
//
// The `admins` table itself has NO select policy for authenticated
// users (see admin-table-migration.sql) — a farmer/wholesaler cannot
// read it directly. The only way to check "is the current user an
// admin?" is this security-definer RPC, which uses auth.uid() from the
// caller's own verified session server-side (never a client-supplied
// value) and returns only the caller's own row, or nothing. The `uid`
// parameter here is used purely to keep this function's call signature
// consistent with the rest of the file (WS.getOne-style lookups) — the
// database ignores it entirely and answers strictly for whoever is
// actually logged in.
const AdminTbl = {
  async getOne(uid) {
    if (HAS_SUPABASE) {
      try {
        const rows = await SB.post("rpc/get_my_admin_profile", {});
        lastSyncOk = true;
        return rows?.[0] || null;
      } catch { lastSyncOk = false; return null; }
    }
    return null;
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
    // Admin accounts live in their own `admins` table — checked first,
    // before wholesaler/farmer, so an admin is identified from a table
    // that farmer/wholesaler management operations never touch. This
    // check works whether or not the account has any user_metadata
    // (the original admin account, created directly in Supabase, has
    // none — see SETUP.md), unlike the farmer fallback below.
    const adminProfile = await AdminTbl.getOne(uid);
    if (adminProfile) return {...adminProfile, role:"admin"};
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
    // Business accounts live in `businesses` — same pattern as
    // wholesaler above. primary_category is DATA on this row (see
    // businesses schema, Stage 1), never a separate auth branch — the
    // category itself does not affect how this branch behaves.
    if (meta.role === "business") {
      let bizProfile = await Biz.getOne(uid);
      if (!bizProfile) {
        // Same email-confirmation gap as wholesaler/farmer: the row
        // couldn't be inserted at registration time (no active session
        // yet), so it's rebuilt here from the metadata that signUp
        // preserved. meta.primary_category is the actual value the
        // person submitted at registration — it is never defaulted or
        // invented here. If it's missing (corrupted/incomplete
        // metadata), that's a genuine data problem, not something to
        // paper over by guessing a category — surface it as an error so
        // the person (or an admin, on investigation) knows the account
        // needs attention, rather than silently creating a
        // mis-categorized business.
        if (!meta.primary_category) {
          return {err:"Your business registration is incomplete (missing category). Please contact support or try registering again."};
        }
        const r = await Biz.registerAtomic({
          p_trading_name: meta.trading_name || meta.name || email,
          p_legal_name: meta.legal_name || null,
          p_primary_category: meta.primary_category,
          p_secondary_categories: meta.secondary_categories || [],
          p_contact_name: meta.contact_name || meta.name || email,
          p_phone: meta.phone || "", p_whatsapp: meta.whatsapp === true,
          p_district: meta.district, p_sector: meta.sector, p_village: meta.village,
          p_description: meta.description || meta.bio || "",
          p_image_url: meta.image || "",
          p_requires_auth: meta.requires_auth === true, p_auth_status: meta.auth_status || null,
          p_issuing_authority: meta.issuing_authority || null, p_license_number: meta.license_number || null,
          p_issue_date: meta.issue_date || null, p_expiry_date: meta.expiry_date || null,
        });
        if (!r.ok) return {err:r.reason||"Could not save business profile"};
        // The RPC derives email/status/created_at server-side, so its
        // returned row (not a locally-constructed object) is what's used
        // from here on — it's the actual source of truth for this row.
        bizProfile = r.business;
      }
      return {...bizProfile, role:"business"};
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
      const r = await this.saveFarmers([profile], [...farmers, profile]);
      if (!r.ok) return {err:r.reason||"Could not save farmer profile"};
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
    // Same admin-first check as login() above, for the same reason.
    const adminProfile = await AdminTbl.getOne(session.user.id);
    if (adminProfile) return {...adminProfile, role:"admin"};
    if (session.user?.user_metadata?.role === "wholesaler") {
      const wholesalers = await WS.getAll();
      const w = wholesalers.find(w=>w.id===session.user.id);
      return w ? {...w, role:"wholesaler"} : null;
    }
    if (session.user?.user_metadata?.role === "business") {
      const b = await Biz.getOne(session.user.id);
      return b ? {...b, role:"business"} : null;
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
  // skipDelete=true: farmer saves must never delete rows as a side
  // effect of an incomplete/stale array — see SA.save's comment. Actual
  // farmer deletion is handled explicitly by deleteFarmer() below, via a
  // direct single-row DELETE rather than this diff mechanism.
  //
  // cacheRows (optional): lets a caller send only the one row that
  // actually needs to reach Supabase (v) while keeping this browser's
  // local cache showing the full known set — see register()/login()
  // below, where a non-admin farmer's own INSERT must not be bundled
  // with every other farmer's row or a strict `auth.uid() = id` RLS
  // policy rejects the whole batch over rows that aren't theirs.
  async saveFarmers(v,cacheRows=null){return await SA.save("farmers",v,true,cacheRows)},
  // cacheRows (optional, same pattern as saveFarmers): lets addProduct
  // send only the one new product row to Supabase — required because
  // products_insert_own has no unconditional-open fallback the way the
  // farmers/products UPDATE policies do, so a full-array insert batch
  // containing other farmers' existing products could be rejected.
  // Defaults to null so every other caller (updateProduct, deleteProduct,
  // incView, toggleFeatured, backup restore) keeps its exact current
  // behavior unchanged.
  async saveProducts(v,cacheRows=null){return await SA.save("products",v,false,cacheRows)},
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
    if (role==="business") {
      const {trading_name,legal_name,primary_category,secondary_categories,contact_name,phone,whatsapp,district,sector,village,description,image,requires_auth,auth_status,issuing_authority,license_number,issue_date,expiry_date}=profileFields;
      if (!primary_category) return {err:"Please select a business category before submitting."};
      const r = await Biz.registerAtomic({
        p_trading_name: trading_name, p_legal_name: legal_name||null,
        p_primary_category: primary_category, p_secondary_categories: secondary_categories||[],
        p_contact_name: contact_name, p_phone: phone, p_whatsapp: whatsapp===true,
        p_district: district, p_sector: sector, p_village: village,
        p_description: description, p_image_url: image||"",
        p_requires_auth: requires_auth===true, p_auth_status: auth_status||null,
        p_issuing_authority: issuing_authority||null, p_license_number: license_number||null,
        p_issue_date: issue_date||null, p_expiry_date: expiry_date||null,
      });
      if (!r.ok) return {err:r.reason||"Could not save business profile"};
      return {ok:true};
    }
    const nf={...profileFields,id:uid,email,role:"farmer",status:"pending",rating:0,rCount:0,createdAt:new Date().toISOString()};
    const existingFarmers = await this.farmers();
    const r = await this.saveFarmers([nf], [...existingFarmers, nf]);
    if (!r.ok) return {err:r.reason||"Could not save farmer profile"};
    return {ok:true};
  },
  async addProduct(d){const ps=await this.products();const np={...d,id:"p"+Date.now(),views:0,img1:d.img1||"",img2:d.img2||"",createdAt:new Date().toISOString()};await this.saveProducts([np],[...ps,np]);return np},
  async updateProduct(id,d){await this.saveProducts((await this.products()).map(p=>p.id===id?{...p,...d}:p))},
  async deleteProduct(id){await this.saveProducts((await this.products()).filter(p=>p.id!==id))},
  async incView(id){await this.saveProducts((await this.products()).map(p=>p.id===id?{...p,views:(p.views||0)+1}:p))},
  async rateFarmer(fid,rating,sid){const rs=(await SA.getKV("ratings"))||[];if(rs.find(r=>r.fid===fid&&r.sid===sid))return{err:"Already rated"};const nrs=[...rs,{fid,rating,sid}];await SA.setKV("ratings",nrs);const fr=nrs.filter(r=>r.fid===fid);const avg=fr.reduce((s,r)=>s+r.rating,0)/fr.length;await this.saveFarmers((await this.farmers()).map(f=>f.id===fid?{...f,rating:Math.round(avg*10)/10,rCount:fr.length}:f));return{ok:true}},
  // Sends only the one changed row to Supabase (cacheRows keeps the local
  // cache showing every farmer), and returns a real result so the caller
  // can tell whether the status change actually reached the database
  // instead of assuming success.
  // Shared by setFarmerStatus/updateFarmer: both only ever modify a
  // farmer row that's already confirmed to exist, so — unlike
  // saveFarmers (genuine inserts: registration, login-rebuild) — these
  // must use a real UPDATE, not an upsert. SB.upsert sends
  // `Prefer: resolution=merge-duplicates`, which PostgREST implements as
  // INSERT ... ON CONFLICT DO UPDATE; Postgres checks the INSERT policy's
  // WITH CHECK on every row of that statement regardless of whether it
  // will end up inserting or updating, so an admin changing another
  // farmer's row was being rejected by farmers_insert_self_or_admin
  // (correctly: (auth.uid()=id) OR is_admin() fails for auth.uid()=admin,
  // id=farmer) even though the UPDATE policies that DO cover this case
  // were never actually reached. A direct SB.patch is a genuine SQL
  // UPDATE, checked only against the UPDATE policies — same fix already
  // proven working in WS.setStatus/WS.updateImage above.
  //
  // farmers is the jsonb-wrapped table (id, data, created_at) — unlike
  // wholesalers' flat columns, every field lives inside `data`, and a
  // PATCH replaces that column's value outright rather than merging by
  // key. So the full updated fields object (not just the changed key)
  // is sent as `data`, preserving every other field on the row.
  async _patchFarmer(id, updatedFields, cacheRows) {
    if (HAS_SUPABASE) {
      try {
        const {id:_omit, ...data} = updatedFields;
        await SB.patch("farmers", `id=eq.${id}`, {data});
        lastSyncOk = true;
        LS.s("farmers", cacheRows);
        return {ok:true};
      } catch(e) { lastSyncOk = false; return {ok:false, reason:e.message||String(e)}; }
    }
    LS.s("farmers", cacheRows);
    return {ok:true};
  },
  async setFarmerStatus(id,status){
    const all = await this.farmers();
    const updated = all.map(f=>f.id===id?{...f,status}:f);
    const changed = updated.find(f=>f.id===id);
    if (!changed) return {ok:false, reason:"Farmer not found"};
    return await this._patchFarmer(id, changed, updated);
  },
  async updateFarmer(id,patch){
    const all = await this.farmers();
    const updated = all.map(f=>f.id===id?{...f,...patch}:f);
    const changed = updated.find(f=>f.id===id);
    if (!changed) return {ok:false, reason:"Farmer not found"};
    return await this._patchFarmer(id, changed, updated);
  },
  // Explicit, single-row delete — this is the ONLY place a farmer row is
  // ever actually removed from Supabase. It no longer relies on
  // saveFarmers' diff-delete side effect (disabled for farmers, see
  // saveFarmers above) so that deleting one farmer can never accidentally
  // remove another session's just-written row. Governed by the existing
  // farmers_delete_admin_only RLS policy, unchanged.
  async deleteFarmer(id){
    const ps = await this.products();
    await Promise.all([
      SB.del("farmers", `id=eq.${encodeURIComponent(id)}`),
      this.saveProducts(ps.filter(p=>p.fid!==id)),
    ]);
    const cached=(LS.g("farmers")||[]).filter(f=>f.id!==id);
    LS.s("farmers", cached);
  },
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
  const{t}=useLang();
  if(value===undefined)return null;
  return(
    <div style={{marginTop:-7,marginBottom:13,padding:"9px 11px",background:G.gray1,borderRadius:G.r}}>
      {PW_RULES.map(r=>{
        const ok=r.test(value||"");
        return(
          <div key={r.k} style={{display:"flex",alignItems:"center",gap:6,fontSize:11.5,color:ok?"#15803d":G.gray5,fontWeight:600,padding:"1.5px 0"}}>
            <span style={{display:"inline-flex",width:14,height:14,borderRadius:4,background:ok?"#15803d":"transparent",border:ok?"none":`1.5px solid ${G.gray3}`,alignItems:"center",justifyContent:"center",flexShrink:0}}>{ok&&<Ic.check size={10} color="#fff" strokeWidth={3}/>}</span>{t("pw_rule_"+r.k)}
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
            {uploading
              ?<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,color:G.white}}>
                  <Ic.refresh size={22} className="ik-spinner"/>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:FB}}>Uploading…</span>
                </div>
              :<>
                  <label style={{position:"absolute",bottom:6,left:6,background:"rgba(0,0,0,.6)",color:G.white,border:"none",padding:"5px 9px",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,fontFamily:FB}}>
                    <Ic.upload size={12}/> Replace
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} style={{display:"none"}}/>
                  </label>
                  <button onClick={clear} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.6)",color:G.white,border:"none",width:26,height:26,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.close size={14}/></button>
                </>}
          </div>
        :<div style={{border:`2px dashed ${G.gray3}`,borderRadius:G.r,padding:"16px",textAlign:"center",background:G.g0}}>
            <div style={{marginBottom:5,color:G.gray5,display:"flex",justifyContent:"center"}}>{uploading?<Ic.refresh size={26} className="ik-spinner"/>:<Ic.camera size={26}/>}</div>
            <p style={{fontSize:12,color:G.gray5,margin:"0 0 8px"}}>{uploading?"Uploading image…":(placeholder||"Upload or paste URL")}</p>
            <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
              <label style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:uploading?G.gray1:G.g1,borderRadius:8,cursor:uploading?"not-allowed":"pointer",fontSize:12,fontWeight:600,color:G.g7,border:`1px solid ${G.gray3}`,opacity:uploading?.6:1}}>
                {uploading?<><Ic.refresh size={13} className="ik-spinner"/> Uploading…</>:<><Ic.upload size={13}/> Browse</>}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} style={{display:"none"}} disabled={uploading}/>
              </label>
              <Inp placeholder="Paste image URL…" style={{margin:0,flex:1,minWidth:140,padding:"6px 10px",fontSize:12}} onChange={e=>handleUrl(e.target.value)} disabled={uploading}/>
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

/* ── FARMER PROFILE SECTION (dashboard) ──
   Lets a signed-in farmer (pending or approved) complete/edit their own
   contact, WhatsApp preference, location, and agricultural info. Reuses
   the existing DB.updateFarmer (now single-row/cacheRows-safe) and the
   existing LocPicker component — no new location fields, no new
   agricultural fields beyond the existing fType/bio, per approved scope.
   WhatsApp is stored as a new additive `whatsapp` boolean inside the
   existing farmers.data jsonb — no schema change. */
function FarmerProfileSection({me,onNotify,onReload}){
  const[f,setF]=useState({phone:me.phone||"",whatsapp:me.whatsapp===true,district:me.district||"",sector:me.sector||"",village:me.village||"",fType:me.fType||"abahinzi",bio:me.bio||""});
  const[busy,setBusy]=useState(false);
  const[dirty,setDirty]=useState(false);
  // Keep the form in sync if the farmer record changes elsewhere (e.g.
  // after a save reloads `farmers` from Supabase) — but only while the
  // farmer hasn't started editing, so an in-progress edit is never
  // silently overwritten.
  useEffect(()=>{if(!dirty)setF({phone:me.phone||"",whatsapp:me.whatsapp===true,district:me.district||"",sector:me.sector||"",village:me.village||"",fType:me.fType||"abahinzi",bio:me.bio||""})},[me.phone,me.whatsapp,me.district,me.sector,me.village,me.fType,me.bio,dirty]);
  const set=(k,v)=>{setF(x=>({...x,[k]:v}));setDirty(true)};
  const save=async()=>{
    setBusy(true);
    const r=await DB.updateFarmer(me.id,{phone:f.phone,whatsapp:f.whatsapp,district:f.district,sector:f.sector,village:f.village,fType:f.fType,bio:f.bio});
    setBusy(false);
    if(r.ok){setDirty(false);await onReload();onNotify("Profile updated!")}
    else onNotify(r.reason||"Could not update profile","error");
  };
  return(
    <div style={{background:G.white,border:`1px solid ${G.gray1}`,borderRadius:G.rL,padding:18,boxShadow:G.sh,marginBottom:20}}>
      <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:800,color:G.gray9,fontFamily:FH,display:"flex",alignItems:"center",gap:7}}><Ic.contact size={15} color={G.g6}/> My Profile</h3>

      <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:G.gray5,textTransform:"uppercase",letterSpacing:.3}}>Contact</p>
      <Inp label="Phone number" value={f.phone} onChange={e=>set("phone",e.target.value)} type="tel" placeholder="07XXXXXXXX"/>
      <div style={{marginBottom:13}}>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:5,fontFamily:FB}}>Do you use WhatsApp on this number?</label>
        <div style={{display:"flex",gap:8}}>
          <Btn variant={f.whatsapp?"primary":"secondary"} size="sm" onClick={()=>set("whatsapp",true)} icon={<Ic.whatsapp size={13}/>}>Yes</Btn>
          <Btn variant={!f.whatsapp?"primary":"secondary"} size="sm" onClick={()=>set("whatsapp",false)} icon={<Ic.close size={13}/>}>No</Btn>
        </div>
        <p style={{margin:"6px 0 0",fontSize:11,color:G.gray5}}>{f.whatsapp?"A WhatsApp contact option will be shown on your public listings.":"Only your phone number will be shown — no WhatsApp button."}</p>
      </div>

      <p style={{margin:"16px 0 8px",fontSize:12,fontWeight:700,color:G.gray5,textTransform:"uppercase",letterSpacing:.3}}>Location</p>
      <LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>{setF(x=>({...x,district:d,sector:s,village:v}));setDirty(true)}}/>

      <p style={{margin:"16px 0 8px",fontSize:12,fontWeight:700,color:G.gray5,textTransform:"uppercase",letterSpacing:.3}}>Agricultural Information</p>
      <Sel label="Farming type" value={f.fType} onChange={e=>set("fType",e.target.value)}>
        <option value="abahinzi">Abahinzi — Crops</option>
        <option value="aborozi">Aborozi — Livestock</option>
      </Sel>
      <Txt label="About your farm / main products" value={f.bio} onChange={e=>set("bio",e.target.value)} style={{minHeight:70}}/>

      <Btn onClick={save} disabled={busy||!dirty} icon={<Ic.check size={14}/>}>{busy?"Saving...":"Save Profile"}</Btn>
    </div>
  );
}


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
  const{t}=useLang();
  const[f,setF]=useState(initial||{name:"",type:"crop",sub:"",price:"",desc:"",qty:"",unit:"kg",inStock:true,district:farmer?.district||"",sector:farmer?.sector||"",village:farmer?.village||"",img1:"",img2:""});
  const[errs,setErrs]=useState({});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const validate=()=>{const e={};if(!f.name.trim())e.name=t("err_required");if(!f.price||isNaN(f.price)||f.price<=0)e.price=t("err_valid_price");if(!f.sub)e.sub=t("err_select_type");setErrs(e);return Object.keys(e).length===0};
  const submit=()=>{if(!validate())return;onSave({...f,price:parseFloat(f.price),qty:parseFloat(f.qty)||0,fid:farmer?.id,fname:farmer?.name,fphone:farmer?.phone})};
  const types=f.type==="crop"?CROPS:ANIMALS;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{gridColumn:"1/-1"}}><Inp label={t("pform_name")} value={f.name} onChange={e=>set("name",e.target.value)} error={errs.name}/></div>
        <Sel label={t("pform_category")} value={f.type} onChange={e=>set("type",e.target.value)}><option value="crop">Crops</option><option value="animal">Livestock</option></Sel>
        <Sel label={t("pform_type")} value={f.sub} onChange={e=>set("sub",e.target.value)} style={{borderColor:errs.sub?G.red:undefined}}><option value="">{t("pform_select")}</option>{types.map(x=><option key={x} value={x}>{x}</option>)}</Sel>
        <Inp label={t("pform_price")} type="number" value={f.price} onChange={e=>set("price",e.target.value)} error={errs.price}/>
        <div style={{display:"flex",gap:7}}>
          <div style={{flex:1}}><Inp label={t("pform_quantity")} type="number" value={f.qty} onChange={e=>set("qty",e.target.value)}/></div>
          <Sel label={t("pform_unit")} value={f.unit} onChange={e=>set("unit",e.target.value)} style={{width:90}}>{"kg,head,liter,piece,ton,bag,box,crate".split(",").map(u=><option key={u} value={u}>{u}</option>)}</Sel>
        </div>
      </div>
      <Txt label={t("pform_description")} value={f.desc} onChange={e=>set("desc",e.target.value)}/>
      <ImageUpload label={t("pform_main_image")} value={f.img1} onChange={v=>set("img1",v)} placeholder={t("pform_main_image_ph")}/>
      <ImageUpload label={t("pform_detail_image")} value={f.img2} onChange={v=>set("img2",v)} placeholder={t("pform_detail_image_ph")}/>
      <label style={{display:"flex",alignItems:"center",gap:9,marginBottom:13,cursor:"pointer"}}>
        <div style={{width:40,height:21,background:f.inStock?G.g5:G.gray3,borderRadius:99,position:"relative",transition:"background .2s"}} onClick={()=>set("inStock",!f.inStock)}>
          <div style={{width:17,height:17,background:G.white,borderRadius:99,position:"absolute",top:2,left:f.inStock?21:2,transition:"left .2s",boxShadow:G.sh}}/>
        </div>
        <span style={{fontSize:13,fontWeight:600,color:G.gray7}}>{f.inStock?t("prod_in_stock"):t("prod_out_of_stock")}</span>
      </label>
      <LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>setF(x=>({...x,district:d,sector:s,village:v}))}/>
      <div style={{display:"flex",gap:9,marginTop:6}}>
        <Btn onClick={submit} full>{initial?t("pform_save"):t("pform_list_product")}</Btn>
        <Btn variant="secondary" onClick={onCancel}>{t("prices_cancel")}</Btn>
      </div>
    </div>
  );
}

/* ── AUTH MODALS ── */
function LoginModal({open,onClose,onLogin,onGoReg,onResetPassword}){
  const{t}=useLang();
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[busy,setBusy]=useState(false);
  const[resetMode,setResetMode]=useState(false);const[resetMsg,setResetMsg]=useState("");
  const submit=async()=>{setErr("");setBusy(true);const r=await onLogin(email,pw);if(r?.err)setErr(r.err);setBusy(false)};
  const submitReset=async()=>{
    setBusy(true);setResetMsg("");
    const r=await onResetPassword(email);
    setResetMsg(r?.err?r.err:t("reset_sent_msg"));
    setBusy(false);
  };
  if(resetMode) return(
    <Modal open={open} onClose={()=>{onClose();setResetMode(false);setResetMsg("")}} title={t("reset_title")}>
      {resetMsg&&<div style={{background:resetMsg===t("reset_sent_msg")?G.g1:G.redL,color:resetMsg===t("reset_sent_msg")?G.g7:G.red,padding:"8px 12px",borderRadius:G.r,marginBottom:12,fontSize:13,fontWeight:600}}>{resetMsg}</div>}
      <Inp label={t("signin_email")} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
      <Btn full onClick={submitReset} disabled={busy||!email}>{busy?t("reset_sending"):t("reset_send")}</Btn>
      <p style={{textAlign:"center",marginTop:11,fontSize:13,color:G.gray5}}>
        <button onClick={()=>{setResetMode(false);setResetMsg("")}} style={{color:G.g6,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>{t("reset_back")}</button>
      </p>
    </Modal>
  );
  return(
    <Modal open={open} onClose={onClose} title={t("signin_title")}>
      {err&&<div style={{background:G.redL,color:G.red,padding:"8px 12px",borderRadius:G.r,marginBottom:12,fontSize:13,fontWeight:600}}>{err}</div>}
      <Inp label={t("signin_email")} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
      <PasswordInput label={t("signin_password")} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"/>
      <p style={{textAlign:"right",margin:"-8px 0 13px"}}>
        <button onClick={()=>setResetMode(true)} style={{color:G.gray5,fontSize:12,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>{t("signin_forgot")}</button>
      </p>
      <Btn full onClick={submit} disabled={busy||!email||!pw}>{busy?t("signin_submitting"):t("signin_submit")}</Btn>
      <p style={{textAlign:"center",marginTop:11,fontSize:13,color:G.gray5}}>
        {t("signin_new_here")} <button onClick={()=>{onClose();onGoReg()}} style={{color:G.g6,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:FB}}>{t("signin_register_link")}</button>
      </p>
    </Modal>
  );
}

// Shown first when Register is pressed, before either registration form.
// Per spec: no second Register button anywhere else — this choice only
// appears once Register has already been clicked.
function RoleChoiceModal({open,onClose,onChoose,site}){
  const{t}=useLang();
  return(
    <Modal open={open} onClose={onClose} title={t("reg_choice_title")}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{width:56,height:56,borderRadius:14,overflow:"hidden",boxShadow:G.sh}}><Logo size={56} site={site}/></div>
      </div>
      <p style={{fontSize:13,color:G.gray6,textAlign:"center",margin:"0 0 16px",fontFamily:FB}}>{t("reg_choice_question")}</p>
      <Btn full variant="gold" onClick={()=>onChoose("farmer")} icon={<Ic.farmer size={16}/>} style={{fontSize:15,padding:"13px 20px",marginBottom:10}}>{t("reg_choice_farmer")}</Btn>
      <Btn full variant="secondary" onClick={()=>onChoose("wholesaler")} icon={<Ic.marketplace size={16}/>} style={{fontSize:15,padding:"13px 20px",marginBottom:10}}>{t("reg_choice_wholesaler")}</Btn>
      <Btn full variant="secondary" onClick={()=>onChoose("business")} icon={<Ic.marketplace size={16}/>} style={{fontSize:15,padding:"13px 20px"}}>{t("reg_choice_business")}</Btn>
    </Modal>
  );
}

function RegModal({open,onClose,onRegister,site,role="farmer"}){
  const{t}=useLang();
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
    if(!f.name.trim())e.name=t("err_required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))e.email=t("err_valid_email");
    if(!/^07\d{8}$/.test(f.phone))e.phone=t("err_phone_format");
    if(!pwPasses(f.pw))e.pw=t("err_pw_requirements");
    else if(f.pw2!==f.pw)e.pw2=t("err_pw_mismatch");
    if(!f.district)e.district=t("err_required");
    if(isWholesaler&&!f.sector)e.sector=t("err_required");
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
    <Modal open={open} onClose={onClose} title={isWholesaler?t("reg_title_wholesaler"):t("reg_title_farmer")}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{width:56,height:56,borderRadius:14,overflow:"hidden",boxShadow:G.sh}}><Logo size={56} site={site}/></div>
      </div>
      <Inp label={t("reg_full_name")+" *"} value={f.name} onChange={e=>set("name",e.target.value)} error={errs.name}/>
      <Inp label={t("reg_email")+" *"} value={f.email} onChange={e=>set("email",e.target.value)} error={errs.email} type="email" placeholder="you@example.com"/>
      <Inp label={t("reg_phone")+" *"} value={f.phone} onChange={e=>set("phone",e.target.value)} error={errs.phone} type="tel" placeholder="07XXXXXXXX"/>
      {!isWholesaler&&
        <Sel label={t("reg_farming_type")} value={f.fType} onChange={e=>set("fType",e.target.value)}>
          <option value="abahinzi">Abahinzi — Crops</option>
          <option value="aborozi">Aborozi — Livestock</option>
        </Sel>}
      <PasswordInput label={t("reg_password")+" *"} value={f.pw} onChange={e=>set("pw",e.target.value)} error={errs.pw} placeholder="Create a strong password"/>
      <PasswordStrengthHints value={f.pw}/>
      <PasswordInput label={t("reg_confirm_password")+" *"} value={f.pw2} onChange={e=>set("pw2",e.target.value)} error={errs.pw2} placeholder="Re-enter password"/>
      <Txt label={isWholesaler?t("reg_products_desc"):t("reg_bio")} value={f.bio} onChange={e=>set("bio",e.target.value)} style={{minHeight:65}}/>
      {isWholesaler&&
        <ImageUpload label={t("reg_photo")} value={f.image} onChange={v=>set("image",v)}/>}
      <LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>setF(x=>({...x,district:d,sector:s,village:v}))}/>
      {errs.district&&<p style={{fontSize:12,color:G.red,marginTop:-8,marginBottom:11}}>{errs.district}</p>}
      {errs.sector&&<p style={{fontSize:12,color:G.red,marginTop:-8,marginBottom:11}}>{errs.sector}</p>}
      <Btn full variant="gold" onClick={submit} disabled={busy||!pwPasses(f.pw)||f.pw2!==f.pw} style={{fontSize:15,padding:"13px 20px",boxShadow:"0 4px 14px rgba(245,158,11,.35)"}}>{busy?t("reg_submitting"):t("reg_submit")}</Btn>
    </Modal>
  );
}

/* ── BUSINESS CATEGORY CONFIG ──
   Data-driven per-category question set (Stage 4). Each category lists
   its own category-specific fields, rendered generically by
   BusinessRegModal — adding a future category means adding one entry
   here, not new branches in the modal itself. category_data collected
   from these fields is shown in Review but intentionally NOT persisted
   anywhere (no approved storage mechanism yet — Stage 4 scope). */
const BUSINESS_CATEGORY_CONFIG = {
  "Wholesaler": {fields:[
    {key:"main_products", label:"Main products traded", type:"text"},
  ]},
  "Agro-dealer / Input Supplier": {fields:[
    {key:"input_types", label:"Inputs supplied", type:"checkboxes",
      options:["Seeds","Fertilizer","Crop-protection products","Animal feed","Other"]},
  ]},
  "Livestock Trader": {fields:[
    {key:"animal_types", label:"Animals traded", type:"checkboxes",
      options:["Cattle","Goats","Sheep","Pigs","Poultry","Other"]},
    {key:"trading_area", label:"Main trading area", type:"text"},
  ]},
  "Veterinary / Animal Health Service": {fields:[
    {key:"services_offered", label:"Services offered", type:"text"},
    {key:"service_area", label:"Service area", type:"text"},
  ]},
  "Agricultural / Food Processor": {fields:[
    {key:"products_processed", label:"Products processed", type:"text"},
    {key:"processing_type", label:"Processing type", type:"text"},
  ]},
  "Cooperative": {fields:[
    {key:"cooperative_type", label:"Cooperative type/activity", type:"text"},
  ]},
  "Agricultural Transport / Logistics": {fields:[
    {key:"transport_services", label:"Services offered", type:"text"},
    {key:"coverage_area", label:"Service area", type:"text"},
  ]},
  "Storage / Warehouse": {fields:[
    {key:"storage_type", label:"Storage type", type:"text"},
    {key:"capacity", label:"Approximate capacity", type:"text"},
  ]},
};
const BUSINESS_CATEGORIES = Object.keys(BUSINESS_CATEGORY_CONFIG);

/* ── BUSINESS REGISTRATION MODAL (Stage 4) ──
   Separate component from RegModal — farmer/wholesaler registration is
   completely untouched. 8 steps per the approved design: category,
   identity, contact, location, category-specific, compliance, image,
   review. On submit, calls onRegister(payload, "business") — the same
   doRegister handler farmer/wholesaler already use — which routes to
   DB.register's business branch and the atomic register_business RPC. */
function BusinessRegModal({open,onClose,onRegister,site}){
  const{t}=useLang();
  const blank={
    primary_category:"", secondary_categories:[],
    trading_name:"", legal_name:"", contact_name:"",
    email:"", pw:"", pw2:"",
    phone:"", whatsapp:null,
    district:"", sector:"", village:"",
    category_data:{},
    requires_auth:null, auth_status:"", issuing_authority:"", license_number:"", issue_date:"", expiry_date:"",
    description:"", image:"",
  };
  const[step,setStep]=useState(1);
  const[f,setF]=useState(blank);
  const[busy,setBusy]=useState(false);
  const[err,setErr]=useState("");
  useEffect(()=>{if(open){setStep(1);setF(blank);setErr("")}},[open]);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const setCat=(k,v)=>setF(x=>({...x,category_data:{...x.category_data,[k]:v}}));
  const toggleSecondary=cat=>setF(x=>({...x,secondary_categories:x.secondary_categories.includes(cat)?x.secondary_categories.filter(c=>c!==cat):[...x.secondary_categories,cat]}));
  const toggleCatCheckbox=(key,opt)=>setF(x=>{
    const cur=x.category_data[key]||[];
    const next=cur.includes(opt)?cur.filter(o=>o!==opt):[...cur,opt];
    return {...x,category_data:{...x.category_data,[key]:next}};
  });

  const stepValid=()=>{
    if(step===1) return !!f.primary_category;
    if(step===2) return !!f.trading_name && !!f.contact_name && !!f.email && pwPasses(f.pw) && f.pw2===f.pw;
    if(step===3) return !!f.phone && f.whatsapp!==null;
    if(step===4) return !!f.district && !!f.sector;
    if(step===6) return f.requires_auth!==null;
    return true;
  };
  const next=()=>{if(stepValid())setStep(s=>Math.min(s+1,8));};
  const back=()=>setStep(s=>Math.max(s-1,1));

  const submit=async()=>{
    setErr("");
    if(!stepValid()){setErr(t("reg_error_required")||"Please complete all required fields.");return;}
    setBusy(true);
    const payload={
      trading_name:f.trading_name, legal_name:f.legal_name||null,
      primary_category:f.primary_category, secondary_categories:f.secondary_categories,
      contact_name:f.contact_name, email:f.email, pw:f.pw,
      phone:f.phone, whatsapp:f.whatsapp===true,
      district:f.district, sector:f.sector, village:f.village,
      description:f.description, image:f.image,
      requires_auth:f.requires_auth===true,
      auth_status:f.requires_auth===true?(f.auth_status||null):null,
      issuing_authority:f.requires_auth===true?(f.issuing_authority||null):null,
      license_number:f.requires_auth===true?(f.license_number||null):null,
      issue_date:f.requires_auth===true?(f.issue_date||null):null,
      expiry_date:f.requires_auth===true?(f.expiry_date||null):null,
    };
    const r=await onRegister(payload,"business");
    setBusy(false);
    if(r?.err) setErr(r.err);
  };

  const catFields=BUSINESS_CATEGORY_CONFIG[f.primary_category]?.fields||[];

  return(
    <Modal open={open} onClose={onClose} title={t("reg_business_title")||"Register Your Business"} maxW={560}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
        <div style={{width:56,height:56,borderRadius:14,overflow:"hidden",boxShadow:G.sh}}><Logo size={56} site={site}/></div>
      </div>
      <p style={{textAlign:"center",fontSize:11,color:G.gray5,fontWeight:700,marginBottom:16}}>{t("reg_business_step")||"Step"} {step} / 8</p>
      {err&&<p style={{background:G.redL,color:G.red,padding:"8px 12px",borderRadius:G.r,fontSize:12,marginBottom:12}}>{err}</p>}

      {step===1&&<>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:8}}>{t("reg_business_primary_category")||"What best describes your agricultural business?"}</label>
        {BUSINESS_CATEGORIES.map(cat=>(
          <Btn key={cat} full variant={f.primary_category===cat?"primary":"secondary"} onClick={()=>set("primary_category",cat)} style={{marginBottom:7,fontSize:14,textAlign:"left",justifyContent:"flex-start"}}>{cat}</Btn>
        ))}
        <label style={{display:"block",fontSize:12,fontWeight:600,color:G.gray5,margin:"14px 0 8px"}}>{t("reg_business_secondary_category")||"Also involved in (optional)"}</label>
        {BUSINESS_CATEGORIES.filter(c=>c!==f.primary_category).map(cat=>(
          <label key={cat} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,marginBottom:6,cursor:"pointer"}}>
            <input type="checkbox" checked={f.secondary_categories.includes(cat)} onChange={()=>toggleSecondary(cat)}/>{cat}
          </label>
        ))}
      </>}

      {step===2&&<>
        <Inp label={t("reg_business_trading_name")||"Trading / business name"} value={f.trading_name} onChange={e=>set("trading_name",e.target.value)}/>
        <Inp label={t("reg_business_legal_name")||"Legal registered name (optional)"} value={f.legal_name} onChange={e=>set("legal_name",e.target.value)}/>
        <Inp label={t("reg_business_contact_name")||"Contact person's full name"} value={f.contact_name} onChange={e=>set("contact_name",e.target.value)}/>
        <Inp label={t("reg_email")||"Email"} type="email" value={f.email} onChange={e=>set("email",e.target.value)}/>
        <Inp label={t("reg_password")||"Password"} type="password" value={f.pw} onChange={e=>set("pw",e.target.value)}/>
        <Inp label={t("reg_password2")||"Confirm password"} type="password" value={f.pw2} onChange={e=>set("pw2",e.target.value)}/>
      </>}

      {step===3&&<>
        <Inp label={t("reg_business_phone")||"Phone number"} type="tel" value={f.phone} onChange={e=>set("phone",e.target.value)}/>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,margin:"4px 0 8px"}}>{t("reg_business_whatsapp_q")||"Do you use WhatsApp on this number?"}</label>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Btn variant={f.whatsapp===true?"primary":"secondary"} onClick={()=>set("whatsapp",true)} icon={<Ic.whatsapp size={13}/>}>{t("common_yes")||"Yes"}</Btn>
          <Btn variant={f.whatsapp===false?"primary":"secondary"} onClick={()=>set("whatsapp",false)} icon={<Ic.close size={13}/>}>{t("common_no")||"No"}</Btn>
        </div>
      </>}

      {step===4&&<LocPicker district={f.district} sector={f.sector} village={f.village} onChange={(d,s,v)=>setF(x=>({...x,district:d,sector:s,village:v}))}/>}

      {step===5&&<>
        {catFields.length===0&&<p style={{fontSize:13,color:G.gray5}}>{t("reg_business_no_extra")||"No additional questions for this category."}</p>}
        {catFields.map(fld=>fld.type==="checkboxes"?(
          <div key={fld.key} style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:6}}>{fld.label}</label>
            {fld.options.map(opt=>(
              <label key={opt} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,marginBottom:5,cursor:"pointer"}}>
                <input type="checkbox" checked={(f.category_data[fld.key]||[]).includes(opt)} onChange={()=>toggleCatCheckbox(fld.key,opt)}/>{opt}
              </label>
            ))}
          </div>
        ):(
          <Inp key={fld.key} label={fld.label} value={f.category_data[fld.key]||""} onChange={e=>setCat(fld.key,e.target.value)}/>
        ))}
      </>}

      {step===6&&<>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:G.gray7,marginBottom:8}}>{t("reg_business_auth_q")||"Is your business registered/authorized/licensed for this activity?"}</label>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
          {[["has_it",t("reg_business_auth_yes")||"Yes, currently valid"],["in_progress",t("reg_business_auth_progress")||"Application in progress"],["not_required",t("reg_business_auth_none")||"Not required for my business"],["unsure",t("reg_business_auth_unsure")||"I'm not sure"]].map(([val,label])=>(
            <label key={val} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
              <input type="radio" name="auth_status" checked={f.auth_status===val} onChange={()=>{set("auth_status",val);set("requires_auth",val!=="not_required")}}/>{label}
            </label>
          ))}
        </div>
        {(f.auth_status==="has_it"||f.auth_status==="in_progress")&&<>
          <Inp label={t("reg_business_issuing_authority")||"Issuing authority"} value={f.issuing_authority} onChange={e=>set("issuing_authority",e.target.value)}/>
          <Inp label={t("reg_business_license_number")||"Registration/license number"} value={f.license_number} onChange={e=>set("license_number",e.target.value)}/>
          <Inp label={t("reg_business_issue_date")||"Issue date"} type="date" value={f.issue_date} onChange={e=>set("issue_date",e.target.value)}/>
          <Inp label={t("reg_business_expiry_date")||"Expiry date (if applicable)"} type="date" value={f.expiry_date} onChange={e=>set("expiry_date",e.target.value)}/>
        </>}
      </>}

      {step===7&&<>
        <Txt label={t("reg_business_description")||"About your business"} value={f.description} onChange={e=>set("description",e.target.value)} style={{minHeight:80}}/>
        <ImageUpload label={t("reg_business_image")||"Business logo / photo"} value={f.image} onChange={v=>set("image",v)}/>
      </>}

      {step===8&&<div style={{fontSize:13,color:G.gray7,lineHeight:1.7}}>
        <p><b>{t("reg_business_trading_name")||"Trading name"}:</b> {f.trading_name}</p>
        <p><b>{t("reg_business_primary_category")||"Category"}:</b> {f.primary_category}{f.secondary_categories.length>0&&` (+ ${f.secondary_categories.join(", ")})`}</p>
        <p><b>{t("reg_business_contact_name")||"Contact"}:</b> {f.contact_name}</p>
        <p><b>{t("reg_business_phone")||"Phone"}:</b> {f.phone} {f.whatsapp?"(WhatsApp)":""}</p>
        <p><b>{t("nav_location")||"Location"}:</b> {f.village?f.village+", ":""}{f.sector}, {f.district}</p>
        {catFields.length>0&&<p><b>{t("reg_business_category_info")||"Category details"}:</b> {catFields.map(fl=>`${fl.label}: ${Array.isArray(f.category_data[fl.key])?(f.category_data[fl.key]||[]).join(", "):(f.category_data[fl.key]||"—")}`).join(" · ")}</p>}
        <p><b>{t("reg_business_auth_q")||"Authorization"}:</b> {f.auth_status||"—"}</p>
      </div>}

      <div style={{display:"flex",gap:8,marginTop:18}}>
        {step>1&&<Btn variant="secondary" onClick={back}>{t("common_back")||"Back"}</Btn>}
        {step<8&&<Btn onClick={next} disabled={!stepValid()} style={{flex:1}}>{t("common_next")||"Next"}</Btn>}
        {step===8&&<Btn onClick={submit} disabled={busy} style={{flex:1}}>{busy?(t("reg_submitting")||"Submitting..."):(t("reg_submit")||"Submit")}</Btn>}
      </div>
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
  const{t}=useLang();
  return(
    <Modal open={open} onClose={onClose} title={t("terms_title")} maxW={640}>
      <LegalSection title={t("terms_sec1_title")}>
        <LegalList items={[
          t("terms_sec1_item1"),
          t("terms_sec1_item2"),
          t("terms_sec1_item3"),
          t("terms_sec1_item4"),
          t("terms_sec1_item5"),
          t("terms_sec1_item6"),
          t("terms_sec1_item7"),
        ]}/>
      </LegalSection>
      <LegalSection title={t("terms_sec2_title")}>
        <p style={{marginBottom:8}}>{t("terms_sec2_p1")}</p>
        <p style={{marginBottom:8}}>{t("terms_sec2_p2")}</p>
        <p style={{marginBottom:8}}>{t("terms_sec2_p3")}</p>
        <p style={{marginBottom:8}}>{t("terms_sec2_p4")}</p>
        <p style={{margin:0}}>{t("terms_sec2_p5")}</p>
      </LegalSection>
    </Modal>
  );
}

function PrivacyModal({open,onClose}){
  const{t}=useLang();
  return(
    <Modal open={open} onClose={onClose} title={t("privacy_title")} maxW={640}>
      <LegalSection title={t("privacy_sec1_title")}>
        <LegalList items={[t("privacy_sec1_item1"),t("privacy_sec1_item2"),t("privacy_sec1_item3")]}/>
      </LegalSection>
      <LegalSection title={t("privacy_sec2_title")}>
        <LegalList items={[t("privacy_sec2_item1"),t("privacy_sec2_item2"),t("privacy_sec2_item3"),t("privacy_sec2_item4")]}/>
      </LegalSection>
      <LegalSection title={t("privacy_sec3_title")}>
        <p style={{margin:0}}>{t("privacy_sec3_p")}</p>
      </LegalSection>
      <LegalSection title={t("privacy_sec4_title")}>
        <p style={{margin:0}}>{t("privacy_sec4_p")}</p>
      </LegalSection>
      <LegalSection title={t("privacy_sec5_title")}>
        <p style={{margin:0}}>{t("privacy_sec5_p")}</p>
      </LegalSection>
      <LegalSection title={t("privacy_sec6_title")}>
        <LegalList items={[t("privacy_sec6_item1"),t("privacy_sec6_item2")]}/>
      </LegalSection>
      <LegalSection title={t("privacy_sec7_title")}>
        <p style={{margin:0}}>{t("privacy_sec7_p")}</p>
      </LegalSection>
      <LegalSection title={t("privacy_sec8_title")}>
        <p style={{margin:0,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.contact size={13}/> +250 788 835 195</span><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.email size={13}/> info@inkingi.rw</span><span style={{display:"flex",alignItems:"center",gap:5}}><Ic.location size={13}/> Kigali, Rwanda</span></p>
      </LegalSection>
    </Modal>
  );
}

function SupportModal({open,onClose,site}){
  const{t}=useLang();
  return(
    <Modal open={open} onClose={onClose} title={t("support_title")} maxW={420}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.location size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>{t("support_location")}</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.address)||"Kigali, Rwanda"}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.contact size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>{t("support_phone")}</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.phone)||"+250 788 835 195"}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.hours size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>{t("support_hours")}</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>{(site&&site.hours)||t("support_default_hours")}</p></div>
        </div>
        <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,background:G.g1,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:G.g7}}><Ic.email size={16}/></div>
          <div><p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>{t("support_email")}</p><p style={{margin:"2px 0 0",fontSize:13,color:G.gray6}}>info@inkingi.rw</p></div>
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
  const{t}=useLang();
  const[rating,setRating]=useState(0);const[rMsg,setRMsg]=useState("");
  if(!product)return null;
  const farmer=farmers.find(f=>f.id===product.fid);
  const sid=()=>{let s=localStorage.getItem("ik_sid");if(!s){s="s"+Date.now();localStorage.setItem("ik_sid",s)}return s};
  const submitRating=async()=>{if(!rating)return;const r=await DB.rateFarmer(product.fid,rating,sid());if(r.err)setRMsg(t("prod_already_rated"));else{onReload();setRMsg(t("prod_thank_you"))}};
  return(
    <Modal open={open} onClose={onClose} title={product.name} maxW={700}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{borderRadius:G.r,overflow:"hidden",marginBottom:13}}><PImg product={product} h={200} detail={true}/></div>
          <p style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:G.g7,fontFamily:FH}}>RWF {product.price?.toLocaleString()}<span style={{fontSize:12,fontWeight:400,color:G.gray5}}>/{product.unit}</span></p>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
            <Badge color={product.inStock?"green":"gray"}>{product.inStock?t("prod_in_stock"):t("prod_out_of_stock")}</Badge>
            {product.sub&&<Badge color="gray">{product.sub}</Badge>}
          </div>
          <p style={{margin:"0 0 3px",fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.location size={12}/> {product.village}, {product.sector}, {product.district}</p>
          <p style={{margin:"0 0 3px",fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.listings size={12}/> {product.qty} {product.unit} {t("prod_available")}</p>
          <p style={{margin:0,fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.users size={12}/> {product.views} {t("prod_views")}</p>
        </div>
        <div>
          <h3 style={{margin:"0 0 7px",fontSize:14,fontWeight:700,color:G.gray9}}>{t("prod_about")}</h3>
          <p style={{margin:"0 0 16px",fontSize:13,color:G.gray5,lineHeight:1.7}}>{product.desc||t("prod_no_desc")}</p>
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
                <a href={"tel:"+farmer.phone} style={{display:"inline-flex",alignItems:"center",gap:4,background:G.g6,color:G.white,padding:"7px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12,flex:1,justifyContent:"center"}}><Ic.contact size={13}/> {t("prod_call_now")}</a>
                {farmer.whatsapp===true&&<a href={"https://wa.me/250"+farmer.phone.replace(/^0/,"")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"#25d366",color:G.white,padding:"7px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12,flex:1,justifyContent:"center"}}><Ic.whatsapp size={13}/> {t("prod_whatsapp")}</a>}
              </div>
              <div style={{borderTop:`1px solid #c8e6c9`,paddingTop:9}}>
                <p style={{margin:"0 0 5px",fontSize:12,fontWeight:700,color:G.gray7}}>{t("prod_rate_farmer")}</p>
                <Stars value={rating} size={20} interactive onChange={setRating}/>
                {rating>0&&!rMsg&&<Btn size="sm" onClick={submitRating} style={{marginTop:7}}>{t("prod_submit_rating")}</Btn>}
                {rMsg&&<p style={{margin:"5px 0 0",fontSize:12,color:rMsg===t("prod_already_rated")?G.red:G.g6,fontWeight:600}}>{rMsg}</p>}
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
  const{t}=useLang();
  const[prices,setPrices]=useState([]);
  const[search,setSearch]=useState("");const[fProv,setFProv]=useState("");const[fCat,setFCat]=useState("");
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[form,setForm]=useState({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});
  const reload=async()=>setPrices(await DB.prices());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.product||!form.current){notify(t("msg_fill_required"),"error");return}
    const entry={...form,current:parseFloat(form.current),previous:parseFloat(form.previous)||0,updatedAt:new Date().toISOString()};
    const ps=await DB.prices();
    if(editing){await DB.savePrices(ps.map(p=>p.id===editing.id?{...p,...entry}:p));notify(t("msg_updated"))}
    else{entry.id="pr"+Date.now();await DB.savePrices([...ps,entry]);notify(t("msg_added"))}
    reload();setShowForm(false);setEditing(null);
    setForm({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});
  };
  const del=async id=>{if(!window.confirm(t("confirm_delete")))return;await DB.savePrices((await DB.prices()).filter(p=>p.id!==id));reload();notify(t("msg_deleted"))};
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
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.prices size={22} color={G.g6}/> {t("prices_title")}</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>{t("prices_subtitle")}</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({product:"",category:"Crops",province:"",district:"",market:"",unit:"kg",current:"",previous:"",trend:"stable"});setShowForm(true)}}>{t("prices_add")}</Btn>}
        </div>
        <div style={{background:G.white,borderRadius:G.rL,padding:14,marginBottom:16,boxShadow:G.sh,border:`1px solid ${G.gray1}`,display:"flex",gap:9,flexWrap:"wrap"}}>
          <Inp placeholder={t("prices_search_ph")} value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:160,marginBottom:0}}/>
          <Sel value={fProv} onChange={e=>setFProv(e.target.value)} style={{minWidth:140,marginBottom:0}}><option value="">{t("prices_all_provinces")}</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
          <Sel value={fCat} onChange={e=>setFCat(e.target.value)} style={{minWidth:130,marginBottom:0}}><option value="">{t("prices_all_categories")}</option><option>Crops</option><option>Livestock</option></Sel>
          <Btn variant="secondary" size="sm" onClick={()=>{setSearch("");setFProv("");setFCat("")}}>{t("prices_clear")}</Btn>
        </div>
        <div style={{background:G.white,borderRadius:G.rL,boxShadow:G.sh,border:`1px solid ${G.gray1}`,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FB,fontSize:13}}>
              <thead>
                <tr style={{background:G.g8,color:G.white}}>
                  {[t("prices_col_product"),t("prices_col_category"),t("prices_col_province"),t("prices_col_district"),t("prices_col_market"),t("prices_col_unit"),t("prices_col_current"),t("prices_col_prev"),t("prices_col_trend"),t("prices_col_updated"),...(isAdmin?[t("prices_col_actions")]:[])].map(h=>(
                    <th key={h} style={{padding:"11px 14px",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0
                  ?<tr><td colSpan={11} style={{textAlign:"center",padding:"40px",color:G.gray5}}>{t("prices_none_found")}</td></tr>
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
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?t("prices_edit_title"):t("prices_add_title")} maxW={580}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label={t("prices_form_product")} value={form.product} onChange={e=>set("product",e.target.value)}/>
            <Sel label={t("prices_form_category")} value={form.category} onChange={e=>set("category",e.target.value)}><option>Crops</option><option>Livestock</option></Sel>
            <Sel label={t("prices_form_province")} value={form.province} onChange={e=>set("province",e.target.value)}><option value="">{t("prices_form_select")}</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
            <Inp label={t("prices_form_district")} value={form.district} onChange={e=>set("district",e.target.value)}/>
            <div style={{gridColumn:"1/-1"}}><Inp label={t("prices_form_market")} value={form.market} onChange={e=>set("market",e.target.value)}/></div>
            <Sel label={t("prices_form_unit")} value={form.unit} onChange={e=>set("unit",e.target.value)}>{"kg,ton,bag,crate,head,liter,piece".split(",").map(u=><option key={u} value={u}>{u}</option>)}</Sel>
            <Sel label={t("prices_form_trend")} value={form.trend} onChange={e=>set("trend",e.target.value)}><option value="up">{t("prices_trend_up")}</option><option value="down">{t("prices_trend_down")}</option><option value="stable">{t("prices_trend_stable")}</option></Sel>
            <Inp label={t("prices_form_current")} type="number" value={form.current} onChange={e=>set("current",e.target.value)}/>
            <Inp label={t("prices_form_previous")} type="number" value={form.previous} onChange={e=>set("previous",e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?t("prices_save"):t("prices_add")}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>{t("prices_cancel")}</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   FARMING TIPS
════════════════════════════════════ */
function FarmingTipsPage({user,notify}){
  const{t:tr}=useLang();
  const[tips,setTips]=useState([]);const[selTip,setSelTip]=useState(null);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");
  const[form,setForm]=useState({title:"",category:"Crops",image:"",content:"",author:"Admin"});
  const reload=async()=>setTips(await DB.tips());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.title||!form.content){notify(tr("msg_title_content_required"),"error");return}
    const entry={...form,publishedAt:editing?.publishedAt||new Date().toISOString()};
    const ts=await DB.tips();
    if(editing){await DB.saveTips(ts.map(t=>t.id===editing.id?{...t,...entry}:t));notify(tr("msg_tip_updated"))}
    else{entry.id="t"+Date.now();await DB.saveTips([...ts,entry]);notify(tr("msg_tip_published"))}
    reload();setShowForm(false);setEditing(null);setForm({title:"",category:"Crops",image:"",content:"",author:"Admin"});
  };
  const del=async id=>{if(!window.confirm(tr("confirm_delete")))return;await DB.saveTips((await DB.tips()).filter(t=>t.id!==id));reload();notify(tr("msg_deleted"))};
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
          <Btn variant="ghost" icon="←" onClick={()=>setSelTip(null)} style={{marginBottom:18}}>{tr("tips_back")}</Btn>
          {selTip.image&&<div style={{borderRadius:G.rL,overflow:"hidden",height:240,marginBottom:20}}><img src={selTip.image} alt={selTip.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
          <Badge color="green" style={{marginBottom:10}}>{selTip.category}</Badge>
          <h1 style={{fontFamily:FH,fontSize:24,fontWeight:900,color:G.gray9,margin:"0 0 7px",lineHeight:1.3}}>{selTip.title}</h1>
          <p style={{color:G.gray5,fontSize:13,margin:"0 0 20px"}}>{tr("tips_by")} {selTip.author} · {new Date(selTip.publishedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
          <div style={{background:G.white,borderRadius:G.rL,padding:22,boxShadow:G.shM,marginBottom:24}}>
            {selTip.content.split("\n").map((para,i)=>(
              <p key={i} style={{margin:"0 0 11px",fontSize:14,color:para.startsWith("**")?G.gray9:G.gray7,fontWeight:para.startsWith("**")?700:400,lineHeight:1.8}}>{para.replace(/\*\*/g,"")}</p>
            ))}
          </div>
          {related.length>0&&(
            <div>
              <h3 style={{fontFamily:FH,fontSize:16,fontWeight:800,marginBottom:13,color:G.gray9}}>{tr("tips_related")}</h3>
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
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.tips size={22} color={G.g6}/> {tr("tips_title")}</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>{tr("tips_subtitle")}</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({title:"",category:"Crops",image:"",content:"",author:"Admin"});setShowForm(true)}}>{tr("tips_add")}</Btn>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          <Inp placeholder={tr("tips_search_ph")} value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:180,marginBottom:0}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setFCat(c==="All"?"":c)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${fCat===(c==="All"?"":c)?G.g6:G.gray3}`,background:fCat===(c==="All"?"":c)?G.g6:G.white,color:fCat===(c==="All"?"":c)?G.white:G.gray7,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:FB}}>{c==="All"?tr("cat_all"):c}</button>
            ))}
          </div>
        </div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"60px",color:G.gray5}}><div style={{marginBottom:12,display:"flex",justifyContent:"center"}}><Ic.tips size={48}/></div><p>{tr("tips_none_found")}</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18}}>
              {filtered.map(tip=>(
                <div key={tip.id} style={{background:G.white,borderRadius:G.rL,overflow:"hidden",boxShadow:G.sh,border:`1px solid ${G.gray1}`,transition:"transform .25s,box-shadow .25s",cursor:"pointer"}} onClick={()=>setSelTip(tip)} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=G.shL;e.currentTarget.style.borderColor="#a5d6a7"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=G.sh;e.currentTarget.style.borderColor=G.gray1}}>
                  {tip.image&&<div style={{height:155,overflow:"hidden"}}><img src={tip.image} alt={tip.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
                  <div style={{padding:"13px 15px"}}>
                    <Badge color="green" style={{marginBottom:6}}>{tip.category}</Badge>
                    <h3 style={{margin:"0 0 5px",fontSize:14,fontFamily:FH,fontWeight:700,color:G.gray9,lineHeight:1.35}}>{tip.title}</h3>
                    <p style={{margin:"0 0 8px",fontSize:12,color:G.gray5,lineHeight:1.6}}>{tip.content.slice(0,100)}…</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
                      <span style={{fontSize:11,color:G.gray5}}>{tr("tips_by")} {tip.author} · {new Date(tip.publishedAt).toLocaleDateString()}</span>
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
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?tr("tips_edit_title"):tr("tips_add_title")} maxW={640}>
          <Inp label={tr("tips_form_title")} value={form.title} onChange={e=>set("title",e.target.value)}/>
          <Sel label={tr("tips_form_category")} value={form.category} onChange={e=>set("category",e.target.value)}>{"Crops,Livestock,Soil,Water,Business".split(",").map(c=><option key={c} value={c}>{c}</option>)}</Sel>
          <ImageUpload label={tr("tips_form_image")} value={form.image} onChange={v=>set("image",v)}/>
          <Txt label={tr("tips_form_content")} value={form.content} onChange={e=>set("content",e.target.value)} style={{minHeight:170}}/>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?tr("prices_save"):tr("tips_publish")}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>{tr("prices_cancel")}</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   PESTS & DISEASES
════════════════════════════════════ */
function PestsCenterPage({user,notify}){
  const{t}=useLang();
  const[pests,setPests]=useState([]);const[selPest,setSelPest]=useState(null);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");
  const[form,setForm]=useState({cropOrAnimal:"",name:"",images:[""],symptoms:"",causes:"",prevention:"",treatment:"",severity:"medium",category:"Crops"});
  const reload=async()=>setPests(await DB.pests());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.name||!form.cropOrAnimal){notify(t("msg_fill_required"),"error");return}
    const ps=await DB.pests();
    if(editing){await DB.savePests(ps.map(p=>p.id===editing.id?{...p,...form}:p));notify(t("msg_updated"))}
    else{await DB.savePests([...ps,{...form,id:"pe"+Date.now()}]);notify(t("msg_added"))}
    reload();setShowForm(false);setEditing(null);
    setForm({cropOrAnimal:"",name:"",images:[""],symptoms:"",causes:"",prevention:"",treatment:"",severity:"medium",category:"Crops"});
  };
  const del=async id=>{if(!window.confirm(t("confirm_delete")))return;await DB.savePests((await DB.pests()).filter(p=>p.id!==id));reload();notify(t("msg_deleted"))};
  const filtered=pests.filter(p=>{
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.cropOrAnimal.toLowerCase().includes(search.toLowerCase()))return false;
    if(fCat&&p.category!==fCat)return false;
    return true;
  });
  if(selPest){
    return(
      <div style={{background:G.white,minHeight:"60vh"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 20px"}}>
          <Btn variant="ghost" icon="←" onClick={()=>setSelPest(null)} style={{marginBottom:18}}>{t("pests_back")}</Btn>
          {selPest.images?.[0]&&<div style={{borderRadius:G.rL,overflow:"hidden",height:210,marginBottom:18}}><img src={selPest.images[0]} alt={selPest.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:9}}>
            <Badge color={selPest.category==="Crops"?"green":"blue"}>{selPest.category}</Badge>
            <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:99,fontSize:11,fontWeight:700,background:SEVERITY[selPest.severity]?.bg,color:SEVERITY[selPest.severity]?.color}}><Ic.alert size={11}/> {t("severity_"+selPest.severity)} {t("pests_severity_suffix")}</span>
          </div>
          <h1 style={{fontFamily:FH,fontSize:22,fontWeight:900,color:G.gray9,margin:"0 0 4px"}}>{selPest.name}</h1>
          <p style={{color:G.gray5,fontSize:13,margin:"0 0 20px"}}>{t("pests_affects")} <strong>{selPest.cropOrAnimal}</strong></p>
          {[[t("pests_symptoms"),selPest.symptoms],[t("pests_causes"),selPest.causes],[t("pests_prevention"),selPest.prevention],[t("pests_treatment"),selPest.treatment]].map(([head,content])=>content&&(
            <div key={head} style={{background:G.white,borderRadius:G.rL,padding:16,boxShadow:G.sh,border:`1px solid ${G.gray1}`,marginBottom:12}}>
              <h3 style={{margin:"0 0 7px",fontSize:14,fontWeight:800,fontFamily:FH,color:G.gray9}}>{head}</h3>
              <p style={{margin:0,fontSize:13,color:G.gray7,lineHeight:1.75}}>{content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return(
    <div style={{background:G.white,minHeight:"60vh"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.pests size={22} color={G.g6}/> {t("pests_title")}</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>{t("pests_subtitle")}</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({cropOrAnimal:"",name:"",images:[""],symptoms:"",causes:"",prevention:"",treatment:"",severity:"medium",category:"Crops"});setShowForm(true)}}>{t("pests_add")}</Btn>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <Inp placeholder={t("pests_search_ph")} value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:180,marginBottom:0}}/>
          {["","Crops","Livestock"].map(c=>(
            <button key={c} onClick={()=>setFCat(c)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${fCat===c?G.g6:G.gray3}`,background:fCat===c?G.g6:G.white,color:fCat===c?G.white:G.gray7,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:FB}}>{c||t("cat_all")}</button>
          ))}
        </div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"60px",color:G.gray5}}><div style={{marginBottom:12,display:"flex",justifyContent:"center"}}><Ic.pests size={48}/></div><p>{t("pests_none_found")}</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16}}>
              {filtered.map(p=>(
                <div key={p.id} style={{background:G.white,borderRadius:G.rL,overflow:"hidden",boxShadow:G.sh,border:`1px solid ${G.gray1}`,transition:"transform .25s,box-shadow .25s",cursor:"pointer"}} onClick={()=>setSelPest(p)} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=G.shL;e.currentTarget.style.borderColor="#a5d6a7"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=G.sh;e.currentTarget.style.borderColor=G.gray1}}>
                  {p.images?.[0]&&<div style={{height:130,overflow:"hidden"}}><img src={p.images[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
                  <div style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
                      <Badge color={p.category==="Crops"?"green":"blue"}>{p.category}</Badge>
                      <span style={{display:"inline-flex",alignItems:"center",padding:"3px 8px",borderRadius:99,fontSize:10,fontWeight:700,background:SEVERITY[p.severity]?.bg,color:SEVERITY[p.severity]?.color}}>{t("severity_"+p.severity)}</span>
                    </div>
                    <h3 style={{margin:"0 0 4px",fontSize:14,fontFamily:FH,fontWeight:700,color:G.gray9}}>{p.name}</h3>
                    <p style={{margin:"0 0 6px",fontSize:11,color:G.gray5}}>{t("pests_affects")} {p.cropOrAnimal}</p>
                    <p style={{margin:"0 0 8px",fontSize:11,color:G.gray5,lineHeight:1.5}}>{p.symptoms?.slice(0,80)}…</p>
                    {isAdmin&&(
                      <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                        <Btn size="sm" variant="secondary" onClick={()=>{setEditing(p);setForm({...p});setShowForm(true)}} icon={<Ic.edit size={14}/>}/>
                        <Btn size="sm" variant="danger" onClick={()=>del(p.id)} icon={<Ic.delete size={14}/>}/>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>}
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?t("pests_edit_title"):t("pests_add_title")} maxW={620}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label={t("pests_form_crop_animal")} value={form.cropOrAnimal} onChange={e=>set("cropOrAnimal",e.target.value)}/>
            <Inp label={t("pests_form_name")} value={form.name} onChange={e=>set("name",e.target.value)}/>
            <Sel label={t("pests_form_category")} value={form.category} onChange={e=>set("category",e.target.value)}><option>Crops</option><option>Livestock</option></Sel>
            <Sel label={t("pests_form_severity")} value={form.severity} onChange={e=>set("severity",e.target.value)}>{Object.keys(SEVERITY).map(k=><option key={k} value={k}>{t("severity_"+k)}</option>)}</Sel>
          </div>
          <ImageUpload label={t("pests_form_photo")} value={form.images?.[0]||""} onChange={v=>set("images",[v])}/>
          <Txt label={t("pests_form_symptoms")} value={form.symptoms} onChange={e=>set("symptoms",e.target.value)}/>
          <Txt label={t("pests_form_causes")} value={form.causes} onChange={e=>set("causes",e.target.value)}/>
          <Txt label={t("pests_form_prevention")} value={form.prevention} onChange={e=>set("prevention",e.target.value)}/>
          <Txt label={t("pests_form_treatment")} value={form.treatment} onChange={e=>set("treatment",e.target.value)}/>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?t("prices_save"):t("pests_add")}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>{t("prices_cancel")}</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   PLANTING CALENDAR
════════════════════════════════════ */
function PlantingCalendarPage({user,notify}){
  const{t}=useLang();
  const[entries,setEntries]=useState([]);const[view,setView]=useState("monthly");const[selMonth,setSelMonth]=useState(new Date().getMonth()+1);
  const[showForm,setShowForm]=useState(false);const[editing,setEditing]=useState(null);
  const[fProv,setFProv]=useState("");const[fCrop,setFCrop]=useState("");
  const[form,setForm]=useState({crop:"",province:"",district:"",plantMonth:1,harvestMonth:6,growingDays:"",notes:""});
  const reload=async()=>setEntries(await DB.calendar());
  useEffect(()=>{reload()},[]);
  const isAdmin=user?.role==="admin";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.crop){notify(t("msg_crop_required"),"error");return}
    const cs=await DB.calendar();
    if(editing){await DB.saveCalendar(cs.map(c=>c.id===editing.id?{...c,...form}:c));notify(t("msg_updated"))}
    else{await DB.saveCalendar([...cs,{...form,id:"cal"+Date.now(),growingDays:parseInt(form.growingDays)||90}]);notify(t("msg_added"))}
    reload();setShowForm(false);setEditing(null);setForm({crop:"",province:"",district:"",plantMonth:1,harvestMonth:6,growingDays:"",notes:""});
  };
  const del=async id=>{if(!window.confirm(t("confirm_delete")))return;await DB.saveCalendar((await DB.calendar()).filter(c=>c.id!==id));reload();notify(t("msg_deleted"))};
  const filtered=entries.filter(e=>{
    if(fProv&&e.province!==fProv&&e.province!=="All")return false;
    if(fCrop&&!e.crop.toLowerCase().includes(fCrop.toLowerCase()))return false;
    return true;
  });
  const monthEntries=filtered.filter(e=>e.plantMonth===selMonth||e.harvestMonth===selMonth);
  const cropColors={Maize:"#22c55e",Beans:"#f59e0b",Coffee:"#92400e","Irish Potato":"#8b5cf6",Rice:"#0ea5e9",default:"#6b7280"};
  const getCC=crop=>cropColors[crop]||cropColors.default;
  return(
    <div style={{background:G.sectionAlt,minHeight:"60vh"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.calendar size={22} color={G.g6}/> {t("calendar_title")}</h1>
            <p style={{margin:"3px 0 0",color:G.gray5,fontSize:13}}>{t("calendar_subtitle")}</p>
          </div>
          {isAdmin&&<Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm({crop:"",province:"",district:"",plantMonth:1,harvestMonth:6,growingDays:"",notes:""});setShowForm(true)}}>{t("calendar_add")}</Btn>}
        </div>
        <div style={{background:G.white,borderRadius:G.rL,padding:13,marginBottom:16,boxShadow:G.sh,border:`1px solid ${G.gray1}`,display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:6}}>
            {[["monthly",t("calendar_view_monthly")],["list",t("calendar_view_list")]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${view===v?G.g6:G.gray3}`,background:view===v?G.g6:G.white,color:view===v?G.white:G.gray7,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:FB}}>{l}</button>
            ))}
          </div>
          <Sel value={fProv} onChange={e=>setFProv(e.target.value)} style={{minWidth:140,marginBottom:0}}><option value="">{t("calendar_all_provinces")}</option><option value="All">{t("calendar_all_rwanda")}</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
          <Inp placeholder={t("calendar_filter_crop")} value={fCrop} onChange={e=>setFCrop(e.target.value)} style={{flex:1,minWidth:130,marginBottom:0}}/>
        </div>
        {view==="monthly"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:20}}>
              {MONTHS.map((m,i)=>{
                const mn=i+1;
                const count=filtered.filter(e=>e.plantMonth===mn||e.harvestMonth===mn).length;
                return(
                  <button key={m} onClick={()=>setSelMonth(mn)} style={{padding:"9px 5px",borderRadius:G.r,border:`2px solid ${selMonth===mn?G.g6:G.gray3}`,background:selMonth===mn?G.g6:count>0?G.g0:G.white,color:selMonth===mn?G.white:G.gray7,fontWeight:selMonth===mn?700:500,fontSize:11,cursor:"pointer",fontFamily:FB,transition:"all .2s"}}>
                    <div style={{fontSize:10,marginBottom:2}}>{t("month_"+i).slice(0,3)}</div>
                    {count>0&&<div style={{fontSize:9,background:selMonth===mn?"rgba(255,255,255,.2)":G.g1,color:selMonth===mn?G.white:G.g6,borderRadius:99,padding:"1px 5px"}}>{count} {t("calendar_crops_count")}</div>}
                  </button>
                );
              })}
            </div>
            <h3 style={{fontFamily:FH,fontSize:15,fontWeight:800,color:G.gray9,marginBottom:13,display:"flex",alignItems:"center",gap:7}}><Ic.calendar size={15} color={G.g6}/> {t("month_"+(selMonth-1))}</h3>
            {monthEntries.length===0
              ?<div style={{textAlign:"center",padding:"36px",background:G.white,borderRadius:G.rL,boxShadow:G.sh,color:G.gray5}}>{t("calendar_none_scheduled")} {t("month_"+(selMonth-1))}</div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:13}}>
                  {monthEntries.map(e=>{
                    const isPlant=e.plantMonth===selMonth, isHarvest=e.harvestMonth===selMonth;
                    return(
                      <div key={e.id} style={{background:G.white,borderRadius:G.rL,padding:15,boxShadow:G.sh,border:`1px solid ${G.gray1}`,borderLeft:`4px solid ${getCC(e.crop)}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                          <h3 style={{margin:0,fontSize:14,fontFamily:FH,fontWeight:700,color:G.gray9}}>{e.crop}</h3>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{isPlant&&<Badge color="green"><Ic.crops size={10}/> {t("calendar_plant")}</Badge>}{isHarvest&&<Badge color="gold"><Ic.calendar size={10}/> {t("calendar_harvest")}</Badge>}</div>
                        </div>
                        <p style={{margin:"0 0 3px",fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4}}><Ic.location size={11}/> {e.province}{e.district&&" · "+e.district}</p>
                        <p style={{margin:"0 0 3px",fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><Clock size={11}/> {e.growingDays} {t("calendar_days")} <span>·</span> <Ic.crops size={11}/> {t("month_"+(e.plantMonth-1))} <Ic.next size={11}/> <Ic.calendar size={11}/> {t("month_"+(e.harvestMonth-1))}</p>
                        {e.notes&&<p style={{margin:"7px 0 0",fontSize:11,color:G.gray7,lineHeight:1.5,borderTop:`1px solid ${G.gray1}`,paddingTop:6}}>{e.notes}</p>}
                        {isAdmin&&<div style={{display:"flex",gap:5,marginTop:9}}><Btn size="sm" variant="secondary" onClick={()=>{setEditing(e);setForm({...e});setShowForm(true)}} icon={<Ic.edit size={14}/>}/><Btn size="sm" variant="danger" onClick={()=>del(e.id)} icon={<Ic.delete size={14}/>}/></div>}
                      </div>
                    );
                  })}
                </div>}
          </>
        )}
        {view==="list"&&(
          <div style={{background:G.white,borderRadius:G.rL,boxShadow:G.sh,border:`1px solid ${G.gray1}`,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FB,fontSize:13}}>
                <thead>
                  <tr style={{background:G.g8,color:G.white}}>
                    {[t("calendar_col_crop"),t("calendar_col_province"),t("calendar_col_district"),t("calendar_col_plant_month"),t("calendar_col_harvest_month"),t("calendar_col_days"),t("calendar_col_notes"),...(isAdmin?[t("prices_col_actions")]:[])].map(h=>(
                      <th key={h} style={{padding:"10px 13px",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0
                    ?<tr><td colSpan={8} style={{textAlign:"center",padding:"40px",color:G.gray5}}>{t("calendar_none_entries")}</td></tr>
                    :filtered.map((e,i)=>(
                      <tr key={e.id} style={{borderBottom:`1px solid ${G.gray1}`,background:i%2===0?G.white:G.pageBg}}>
                        <td style={{padding:"10px 13px",fontWeight:700,color:G.gray9,borderLeft:`3px solid ${getCC(e.crop)}`}}>{e.crop}</td>
                        <td style={{padding:"10px 13px",color:G.gray7}}>{e.province}</td>
                        <td style={{padding:"10px 13px",color:G.gray5}}>{e.district||"—"}</td>
                        <td style={{padding:"10px 13px"}}><Badge color="green"><Ic.crops size={10}/> {t("month_"+(e.plantMonth-1))}</Badge></td>
                        <td style={{padding:"10px 13px"}}><Badge color="gold"><Ic.calendar size={10}/> {t("month_"+(e.harvestMonth-1))}</Badge></td>
                        <td style={{padding:"10px 13px",color:G.gray5}}>{e.growingDays}d</td>
                        <td style={{padding:"10px 13px",color:G.gray5,maxWidth:180}}>{e.notes||"—"}</td>
                        {isAdmin&&<td style={{padding:"10px 13px"}}><div style={{display:"flex",gap:5}}><Btn size="sm" variant="secondary" onClick={()=>{setEditing(e);setForm({...e});setShowForm(true)}} icon={<Ic.edit size={14}/>}/><Btn size="sm" variant="danger" onClick={()=>del(e.id)} icon={<Ic.delete size={14}/>}/></div></td>}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?t("calendar_edit_title"):t("calendar_add_title")} maxW={560}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}><Sel label={t("calendar_form_crop")} value={form.crop} onChange={e=>set("crop",e.target.value)}><option value="">{t("calendar_form_select_crop")}</option>{CROPS.map(c=><option key={c} value={c}>{c}</option>)}</Sel></div>
            <Sel label={t("calendar_form_province")} value={form.province} onChange={e=>set("province",e.target.value)}><option value="">{t("calendar_all_provinces")}</option><option value="All">{t("calendar_all_rwanda")}</option>{Object.keys(LOC).map(p=><option key={p} value={p}>{p}</option>)}</Sel>
            <Inp label={t("calendar_form_district")} value={form.district} onChange={e=>set("district",e.target.value)}/>
            <Sel label={t("calendar_form_plant_month")} value={form.plantMonth} onChange={e=>set("plantMonth",parseInt(e.target.value))}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{t("month_"+i)}</option>)}</Sel>
            <Sel label={t("calendar_form_harvest_month")} value={form.harvestMonth} onChange={e=>set("harvestMonth",parseInt(e.target.value))}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{t("month_"+i)}</option>)}</Sel>
            <div style={{gridColumn:"1/-1"}}><Inp label={t("calendar_form_growing_days")} type="number" value={form.growingDays} onChange={e=>set("growingDays",e.target.value)}/></div>
          </div>
          <Txt label={t("calendar_form_notes")} value={form.notes} onChange={e=>set("notes",e.target.value)}/>
          <div style={{display:"flex",gap:9,marginTop:6}}><Btn full onClick={save}>{editing?t("prices_save"):t("calendar_add")}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>{t("prices_cancel")}</Btn></div>
        </Modal>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   AD BANNER CAROUSEL
════════════════════════════════════ */
const isAdLive=a=>{
  if(!a.active)return false;
  const now=Date.now();
  if(a.scheduleStart&&new Date(a.scheduleStart).getTime()>now)return false;
  if(a.scheduleEnd&&new Date(a.scheduleEnd).getTime()<now)return false;
  return true;
};

function AdBannerCarousel({ads,onSelectAd}){
  const live=[...ads].filter(isAdLive).sort((a,b)=>(a.order??0)-(b.order??0));
  const[cur,setCur]=useState(0);const[paused,setPaused]=useState(false);
  const timerRef=useRef(null);const touchX=useRef(null);
  useEffect(()=>{if(cur>=live.length)setCur(0)},[live.length]);
  useEffect(()=>{
    if(paused||live.length<2)return;
    timerRef.current=setTimeout(()=>setCur(c=>((c+1)%live.length)),(live[cur]?.duration||5)*1000);
    return()=>clearTimeout(timerRef.current);
  },[cur,paused,live]);
  if(!live.length)return null;
  return(
    <section style={{background:G.white,padding:"32px 0 24px"}}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
      onTouchStart={e=>{touchX.current=e.touches[0].clientX}}
      onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-(touchX.current||0);if(Math.abs(dx)>40){dx<0?setCur(c=>((c+1)%live.length)):setCur(c=>((c-1+live.length)%live.length))}touchX.current=null}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:700,background:G.goldL,color:"#92400e"}}><Ic.alert size={12}/> Sponsored</span>
          <div style={{flex:1,height:1,background:G.gray1}}/>
          <span style={{fontSize:11,color:G.gray5}}>Advertisement {cur+1} / {live.length}</span>
        </div>
        <div style={{borderRadius:G.rL,overflow:"hidden",position:"relative",background:G.gray1,boxShadow:G.shL}}>
          {live.map((a,i)=>(
            <div key={a.id} style={{position:i===0?"relative":"absolute",inset:0,opacity:i===cur?1:0,transition:"opacity 600ms ease",pointerEvents:i===cur?"auto":"none"}}>
              <div style={{position:"relative",height:"clamp(180px,28vw,340px)",cursor:"pointer"}} onClick={()=>onSelectAd&&onSelectAd(a)}>
                {a.image&&<img src={a.image} alt={a.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(10,46,10,.82) 0%,rgba(10,46,10,.3) 60%,transparent 100%)",display:"flex",alignItems:"center"}}>
                  <div style={{padding:"32px 40px",maxWidth:520}}>
                    <h3 style={{margin:"0 0 10px",fontFamily:FH,fontSize:"clamp(18px,3vw,28px)",fontWeight:900,color:G.white,lineHeight:1.25}}>{a.title}</h3>
                    <p style={{margin:"0 0 18px",fontSize:"clamp(12px,1.5vw,15px)",color:"rgba(255,255,255,.85)",lineHeight:1.65}}>{a.text}</p>
                    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:G.gold,color:G.white,padding:"10px 22px",borderRadius:G.r,fontWeight:700,fontSize:13,boxShadow:"0 4px 12px rgba(0,0,0,.2)"}}>{a.btnLabel||"Learn More"} <Ic.external size={14}/></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {live.length>1&&(
            <>
              <button onClick={()=>setCur(c=>((c-1+live.length)%live.length))} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:G.white,width:36,height:36,borderRadius:99,cursor:"pointer",fontSize:16,zIndex:10}}>‹</button>
              <button onClick={()=>setCur(c=>((c+1)%live.length))} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.3)",color:G.white,width:36,height:36,borderRadius:99,cursor:"pointer",fontSize:16,zIndex:10}}>›</button>
            </>
          )}
        </div>
        {live.length>1&&(
          <div style={{display:"flex",justifyContent:"center",gap:7,marginTop:12}}>
            {live.map((_,i)=><button key={i} onClick={()=>setCur(i)} style={{width:i===cur?22:7,height:7,borderRadius:99,background:i===cur?G.g6:G.gray3,border:"none",cursor:"pointer",transition:"all 300ms",padding:0}}/>)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   AD MANAGER (admin)
════════════════════════════════════ */
function AdManager({notify}){
  const{t}=useLang();
  const BLANK={title:"",text:"",link:"",phone:"",btnLabel:"",image:"",images:[],active:true,order:0,scheduleStart:"",scheduleEnd:"",duration:5};
  const[ads,setAds]=useState([]);const[form,setForm]=useState(BLANK);const[editing,setEditing]=useState(null);const[showForm,setShowForm]=useState(false);
  const reload=async()=>setAds(await DB.ads());
  useEffect(()=>{reload()},[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.title){notify(t("msg_title_required"),"error");return}
    const all=await DB.ads();
    if(editing){await DB.saveAds(all.map(a=>a.id===editing.id?{...a,...form}:a));notify(t("msg_updated"))}
    else{await DB.saveAds([...all,{...form,id:"ad"+Date.now(),order:all.length}]);notify(t("msg_published"))}
    reload();setShowForm(false);setEditing(null);setForm(BLANK);
  };
  const del=async id=>{if(!window.confirm(t("confirm_delete_ad")))return;await DB.saveAds((await DB.ads()).filter(a=>a.id!==id));reload();notify(t("msg_removed"))};
  const toggle=async id=>{await DB.saveAds((await DB.ads()).map(a=>a.id===id?{...a,active:!a.active}:a));reload()};
  const move=async(id,dir)=>{const arr=[...ads];const i=arr.findIndex(a=>a.id===id);const ni=i+dir;if(ni<0||ni>=arr.length)return;[arr[i],arr[ni]]=[arr[ni],arr[i]];await DB.saveAds(arr.map((a,idx)=>({...a,order:idx})));reload()};
  const galImages=form.images&&form.images.length?form.images:[""];
  const updateGal=(idx,v)=>{const imgs=[...galImages];imgs[idx]=v;set("images",imgs.filter(Boolean).length?imgs:[])};
  const addGal=()=>set("images",[...galImages.filter(Boolean),""]);
  const delGal=idx=>set("images",galImages.filter((_,i)=>i!==idx));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><h3 style={{margin:0,fontFamily:FH,fontSize:16,display:"flex",alignItems:"center",gap:8}}><Ic.alert size={16} color={G.g6}/> {t("adm_title")}</h3><p style={{margin:"3px 0 0",fontSize:12,color:G.gray5}}>{t("adm_subtitle")}</p></div>
        <Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditing(null);setForm(BLANK);setShowForm(true)}}>{t("adm_new_ad")}</Btn>
      </div>
      {ads.length===0
        ?<div style={{textAlign:"center",padding:"40px",color:G.gray5,background:G.gray1,borderRadius:G.rL}}>{t("adm_none_yet")}</div>
        :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ads.map((a,i)=>(
              <div key={a.id} style={{background:G.white,borderRadius:G.r,padding:"11px 14px",boxShadow:G.sh,border:`2px solid ${isAdLive(a)?"#dcfce7":G.gray1}`,display:"flex",alignItems:"center",gap:11,flexWrap:"wrap"}}>
                <div style={{width:60,height:42,borderRadius:8,overflow:"hidden",background:G.gray1,flexShrink:0}}>{a.image&&<img src={a.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:2}}><strong style={{fontSize:13,color:G.gray9}}>{a.title}</strong><Badge color={isAdLive(a)?"green":a.active?"gold":"gray"}>{isAdLive(a)?<><Ic.check size={10}/> {t("adm_live")}</>:a.active?<><Ic.hours size={10}/> {t("adm_scheduled")}</>:<><Ic.close size={10}/> {t("adm_inactive")}</>}</Badge></div>
                  <p style={{margin:0,fontSize:11,color:G.gray5}}>⏱ {a.duration||5}s{a.scheduleStart?` · From ${new Date(a.scheduleStart).toLocaleDateString()}`:""}{a.scheduleEnd?` · Until ${new Date(a.scheduleEnd).toLocaleDateString()}`:""}</p>
                </div>
                <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap"}}>
                  <Btn size="sm" variant={a.active?"secondary":"primary"} onClick={()=>toggle(a.id)}>{a.active?t("adm_pause"):t("adm_activate")}</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>move(a.id,-1)} disabled={i===0}>↑</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>move(a.id,1)} disabled={i===ads.length-1}>↓</Btn>
                  <Btn size="sm" variant="secondary" onClick={()=>{setEditing(a);setForm({...a});setShowForm(true)}} icon={<Ic.edit size={14}/>}>{t("admin_edit")}</Btn>
                  <Btn size="sm" variant="danger" onClick={()=>del(a.id)} icon={<Ic.delete size={14}/>}/>
                </div>
              </div>
            ))}
          </div>}
      <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null)}} title={editing?t("adm_edit_ad"):t("adm_new_advertisement")} maxW={600}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"1/-1"}}><Inp label={t("adm_title_field")} value={form.title} onChange={e=>set("title",e.target.value)}/></div>
          <div style={{gridColumn:"1/-1"}}><Txt label={t("adm_description")} value={form.text} onChange={e=>set("text",e.target.value)} style={{minHeight:70}}/></div>
          <Inp label={t("adm_button_label")} value={form.btnLabel} onChange={e=>set("btnLabel",e.target.value)} placeholder="Apply Now"/>
          <Inp label={t("adm_website_link")} value={form.link} onChange={e=>set("link",e.target.value)} placeholder="https://"/>
          <Inp label={t("adm_phone_call_btn")} value={form.phone||""} onChange={e=>set("phone",e.target.value)} placeholder="07XXXXXXXX"/>
          <Inp label={t("adm_display_duration")} type="number" value={form.duration} onChange={e=>set("duration",parseInt(e.target.value)||5)}/>
          <div style={{display:"flex",alignItems:"center",gap:9,paddingTop:18}}>
            <div style={{width:40,height:21,background:form.active?G.g5:G.gray3,borderRadius:99,position:"relative",cursor:"pointer",transition:"background .2s"}} onClick={()=>set("active",!form.active)}>
              <div style={{width:17,height:17,background:G.white,borderRadius:99,position:"absolute",top:2,left:form.active?21:2,transition:"left .2s",boxShadow:G.sh}}/>
            </div>
            <span style={{fontSize:13,fontWeight:600,color:G.gray7}}>{form.active?t("adm_active"):t("adm_inactive")}</span>
          </div>
          <Inp label={t("adm_show_after")} type="datetime-local" value={form.scheduleStart||""} onChange={e=>set("scheduleStart",e.target.value)}/>
          <Inp label={t("adm_hide_after")} type="datetime-local" value={form.scheduleEnd||""} onChange={e=>set("scheduleEnd",e.target.value)}/>
          <div style={{gridColumn:"1/-1"}}><ImageUpload label={t("adm_main_banner")} value={form.image} onChange={v=>set("image",v)}/></div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{margin:0,fontSize:12,color:G.gray5,fontWeight:600}}>{t("adm_gallery_images")}</p>
              <Btn size="sm" variant="secondary" onClick={addGal} icon={<Ic.add size={14}/>}>{t("adm_add_image")}</Btn>
            </div>
            {galImages.map((img,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
                <div style={{flex:1}}><ImageUpload label="" value={img} onChange={v=>updateGal(i,v)} placeholder={`${t("adm_gallery_image_n")} ${i+1}`}/></div>
                <button onClick={()=>delGal(i)} style={{marginTop:2,background:G.red,color:G.white,border:"none",borderRadius:7,width:25,height:25,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.delete size={13}/></button>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:9,marginTop:8}}><Btn full onClick={save}>{editing?t("adm_save_changes"):t("adm_publish_ad")}</Btn><Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null)}}>{t("prices_cancel")}</Btn></div>
      </Modal>
    </div>
  );
}

/* ════════════════════════════════════
   SITE SETTINGS MANAGER (admin)
════════════════════════════════════ */
function SiteSettingsManager({notify}){
  const{t}=useLang();
  const[form,setForm]=useState(null);
  const[migrating,setMigrating]=useState(false);
  const reload=async()=>setForm(await DB.site());
  useEffect(()=>{reload()},[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{await DB.saveSite(form);notify(getLastSyncOk()?t("msg_site_saved"):t("msg_saved_locally"),"warn")};
  const runMigration=async()=>{
    setMigrating(true);
    const r=await SA.pushLocalCacheToRemote();
    setMigrating(false);
    notify(r.ok?t("msg_migration_pushed"):t("msg_migration_failed")+" "+(r.reason||"unknown error"),r.ok?"success":"error");
  };
  if(!form)return <p style={{color:G.gray5}}>Loading…</p>;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <div style={{background:HAS_SUPABASE?G.g0:G.goldL,border:`1px solid ${HAS_SUPABASE?"#c8e6c9":G.gold}`,borderRadius:G.rL,padding:20,gridColumn:"1/-1",display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{color:HAS_SUPABASE?G.g7:"#92400e",flexShrink:0}}>{HAS_SUPABASE?<Ic.check size={22}/>:<Ic.alert size={22}/>}</div>
        <div style={{flex:1,minWidth:240}}>
          <h3 style={{margin:"0 0 5px",fontFamily:FH,fontSize:15,color:G.gray9}}>{HAS_SUPABASE?t("ss_db_connected_title"):t("ss_dev_mode_title")}</h3>
          <p style={{margin:"0 0 10px",fontSize:12.5,color:G.gray7,lineHeight:1.6}}>
            {HAS_SUPABASE ? t("ss_db_connected_desc") : t("ss_dev_mode_desc")}
          </p>
          {HAS_SUPABASE&&(
            <Btn size="sm" variant="secondary" onClick={runMigration} disabled={migrating} icon={<Ic.upload size={13}/>}>
              {migrating?t("ss_pushing"):t("ss_push_local")}
            </Btn>
          )}
        </div>
      </div>
      <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh,gridColumn:"1/-1",display:"flex",gap:24,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 220px"}}>
          <h3 style={{margin:"0 0 8px",fontFamily:FH,fontSize:15,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.image size={15} color={G.g6}/> {t("ss_official_logo")}</h3>
          <p style={{margin:"0 0 10px",fontSize:12,color:G.gray5}}>{t("ss_logo_desc")}</p>
          <ImageUpload label="" value={form.logoUrl||""} onChange={v=>set("logoUrl",v)} placeholder={t("ss_upload_logo")}/>
        </div>
        <div style={{flex:"1 1 220px"}}>
          <h3 style={{margin:"0 0 8px",fontFamily:FH,fontSize:15,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.districts size={15} color={G.g6}/> {t("ss_favicon")}</h3>
          <p style={{margin:"0 0 10px",fontSize:12,color:G.gray5}}>{t("ss_favicon_desc")}</p>
          <ImageUpload label="" value={form.faviconUrl||""} onChange={v=>set("faviconUrl",v)} placeholder={t("ss_upload_favicon")}/>
        </div>
      </div>
      <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh,gridColumn:"1/-1"}}>
        <h3 style={{margin:"0 0 16px",fontFamily:FH,fontSize:15,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.edit size={15} color={G.g6}/> {t("ss_about_vision_mission")}</h3>
        <Txt label={t("ss_about")} value={form.about||""} onChange={e=>set("about",e.target.value)} style={{minHeight:100}}/>
        <Txt label={t("ss_vision")} value={form.vision||""} onChange={e=>set("vision",e.target.value)} style={{minHeight:70}}/>
        <Txt label={t("ss_mission")} value={form.mission||""} onChange={e=>set("mission",e.target.value)} style={{minHeight:70}}/>
      </div>
      <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh}}>
        <h3 style={{margin:"0 0 16px",fontFamily:FH,fontSize:15,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.contact size={15} color={G.g6}/> {t("ss_contact_hours")}</h3>
        <Inp label={t("ss_address")} value={form.address||""} onChange={e=>set("address",e.target.value)}/>
        <Inp label={t("ss_phone")} value={form.phone||""} onChange={e=>set("phone",e.target.value)}/>
        <Inp label={t("ss_working_hours")} value={form.hours||""} onChange={e=>set("hours",e.target.value)}/>
      </div>
      <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh}}>
        <h3 style={{margin:"0 0 10px",fontFamily:FH,fontSize:15,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.external size={15} color={G.g6}/> {t("ss_quick_links")}</h3>
        <p style={{margin:"0 0 12px",fontSize:12,color:G.gray5}}>{t("ss_quick_links_desc")}</p>
        <Txt value={(form.quickLinks||[]).join("\n")} onChange={e=>set("quickLinks",e.target.value.split("\n").map(s=>s.trim()).filter(Boolean))} style={{minHeight:120,fontFamily:FB,fontSize:13}}/>
      </div>
      <div style={{gridColumn:"1/-1",display:"flex",justifyContent:"flex-end"}}>
        <Btn onClick={save} icon={<Ic.save size={14}/>}>{t("ss_save_all")}</Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   CAROUSEL MANAGER + HERO CAROUSEL
════════════════════════════════════ */
const isPublished=s=>{
  if(!s.published)return false;
  const now=Date.now();
  if(s.scheduleStart&&new Date(s.scheduleStart).getTime()>now)return false;
  if(s.scheduleEnd&&new Date(s.scheduleEnd).getTime()<now)return false;
  return true;
};

function CarouselManager({notify}){
  const{t}=useLang();
  const[allSlides,setAllSlides]=useState([]);const[editOpen,setEditOpen]=useState(false);const[editForm,setEditForm]=useState({});const[dragIdx,setDragIdx]=useState(null);
  const reload=async()=>setAllSlides(await DB.carousel());
  useEffect(()=>{reload()},[]);
  const persist=async s=>{await DB.saveCarousel(s);setAllSlides(s)};
  const openNew=()=>{
    const ns={id:"s"+Date.now(),type:"welcome",title:"New Slide",subtitle:"",desc:"",image:"",interval:6,published:false,scheduleStart:"",scheduleEnd:"",order:allSlides.length};
    setEditForm(ns);setEditOpen(true);
  };
  const openEdit=s=>{setEditForm(JSON.parse(JSON.stringify(s)));setEditOpen(true)};
  const saveEdit=async()=>{
    const exists=allSlides.find(s=>s.id===editForm.id);
    const updated=exists?allSlides.map(s=>s.id===editForm.id?{...editForm}:s):[...allSlides,{...editForm}];
    await persist(updated);setEditOpen(false);notify(exists?t("msg_slide_updated"):t("msg_slide_created"));
  };
  const delSlide=async id=>{if(!window.confirm(t("confirm_delete_slide")))return;await persist(allSlides.filter(s=>s.id!==id));notify(t("msg_deleted"))};
  const togglePublish=async id=>{await persist(allSlides.map(s=>s.id===id?{...s,published:!s.published}:s));notify(t("msg_status_updated"))};
  const moveSlide=async(id,dir)=>{
    const arr=[...allSlides];const i=arr.findIndex(s=>s.id===id);const ni=i+dir;
    if(ni<0||ni>=arr.length)return;
    [arr[i],arr[ni]]=[arr[ni],arr[i]];
    await persist(arr.map((s,idx)=>({...s,order:idx})));
  };
  const onDragStart=i=>setDragIdx(i);
  const onDragOver=(e,i)=>{
    e.preventDefault();if(dragIdx===null||dragIdx===i)return;
    const arr=[...allSlides];const moved=arr.splice(dragIdx,1)[0];arr.splice(i,0,moved);
    setAllSlides(arr.map((s,idx)=>({...s,order:idx})));setDragIdx(i);
  };
  const onDragEnd=async()=>{await persist(allSlides);setDragIdx(null)};
  const updateItem=(idx,field,val)=>{const items=[...(editForm.items||[])];items[idx]={...items[idx],[field]:val};setEditForm(f=>({...f,items}))};
  const addItem=()=>setEditForm(f=>({...f,items:[...(f.items||[]),{name:"",desc:"",image:""}]}));
  const delItem=idx=>setEditForm(f=>({...f,items:(f.items||[]).filter((_,i)=>i!==idx)}));
  const moveItem=(idx,dir)=>{
    const items=[...(editForm.items||[])];const ni=idx+dir;
    if(ni<0||ni>=items.length)return;
    [items[idx],items[ni]]=[items[ni],items[idx]];
    setEditForm(f=>({...f,items}));
  };
  const[dragItemIdx,setDragItemIdx]=useState(null);
  const onItemDragOver=(e,i)=>{
    e.preventDefault();if(dragItemIdx===null||dragItemIdx===i)return;
    const items=[...(editForm.items||[])];const moved=items.splice(dragItemIdx,1)[0];items.splice(i,0,moved);
    setEditForm(f=>({...f,items}));setDragItemIdx(i);
  };
  const updateRegion=(idx,field,val)=>{const regions=[...(editForm.regions||[])];regions[idx]={...regions[idx],[field]:val};setEditForm(f=>({...f,regions}))};
  const addRegion=()=>setEditForm(f=>({...f,regions:[...(f.regions||[]),{name:"",color:"#22c55e",crops:""}]}));
  const delRegion=idx=>setEditForm(f=>({...f,regions:(f.regions||[]).filter((_,i)=>i!==idx)}));
  const pubCount=allSlides.filter(s=>isPublished(s)).length;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><h3 style={{margin:0,fontFamily:FH,fontSize:16,color:G.gray9,display:"flex",alignItems:"center",gap:8}}><Ic.image size={16} color={G.g6}/> {t("cm_title")}</h3><p style={{margin:"3px 0 0",fontSize:12,color:G.gray5}}>{allSlides.length} {t("cm_slides")} · {pubCount} {t("cm_live")} · {t("cm_drag_reorder")}</p></div>
        <Btn icon={<Ic.add size={14}/>} onClick={openNew}>{t("cm_new_slide")}</Btn>
      </div>
      {allSlides.length===0
        ?<div style={{textAlign:"center",padding:"40px",color:G.gray5,background:G.gray1,borderRadius:G.rL}}>{t("cm_none_yet")}</div>
        :<div style={{display:"flex",flexDirection:"column",gap:7}}>
            {allSlides.map((s,i)=>{
              const live=isPublished(s);const scheduled=s.published&&(s.scheduleStart||s.scheduleEnd)&&!live;
              return(
                <div key={s.id} draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDragEnd={onDragEnd}
                  style={{background:G.white,borderRadius:G.r,padding:"11px 13px",boxShadow:G.sh,display:"flex",alignItems:"center",gap:11,flexWrap:"wrap",cursor:"grab",border:`2px solid ${dragIdx===i?"#22c55e":live?"#dcfce7":G.gray1}`,transition:"border-color 200ms"}}>
                  <span style={{color:G.gray3,fontSize:16,cursor:"grab",flexShrink:0}}>⠿</span>
                  <div style={{width:50,height:38,borderRadius:7,overflow:"hidden",background:G.gray1,flexShrink:0}}>
                    {s.image?<img src={s.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:16}}>{s.type==="map"?<Ic.districts size={16}/>:s.type==="crops"?<Ic.crops size={16}/>:s.type==="livestock"?<Ic.livestock size={16}/>:<Ic.image size={16}/>}</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:2}}><strong style={{fontSize:13,color:G.gray9}}>{s.title||t("cm_untitled")}</strong><Badge color={live?"green":scheduled?"gold":"gray"}>{live?<><Ic.check size={10}/> {t("adm_live")}</>:scheduled?<><Ic.hours size={10}/> {t("cm_scheduled")}</>:<><Ic.close size={10}/> {t("cm_draft")}</>}</Badge><Badge color="gray">{s.type}</Badge></div>
                    <p style={{margin:0,fontSize:11,color:G.gray5}}>⏱ {s.interval||6}s{s.scheduleStart?` · From: ${new Date(s.scheduleStart).toLocaleDateString()}`:""}{s.scheduleEnd?` · Until: ${new Date(s.scheduleEnd).toLocaleDateString()}`:""}</p>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",flexShrink:0}}>
                    <Btn size="sm" variant={s.published?"secondary":"primary"} onClick={()=>togglePublish(s.id)}>{s.published?t("cm_unpublish"):t("cm_publish")}</Btn>
                    <Btn size="sm" variant="ghost" onClick={()=>moveSlide(s.id,-1)} disabled={i===0}>↑</Btn>
                    <Btn size="sm" variant="ghost" onClick={()=>moveSlide(s.id,1)} disabled={i===allSlides.length-1}>↓</Btn>
                    <Btn size="sm" variant="secondary" onClick={()=>openEdit(s)} icon={<Ic.edit size={14}/>}>{t("cm_edit_slide")}</Btn>
                    <Btn size="sm" variant="danger" onClick={()=>delSlide(s.id)} icon={<Ic.delete size={14}/>}/>
                  </div>
                </div>
              );
            })}
          </div>}
      <Modal open={editOpen} onClose={()=>setEditOpen(false)} title={(allSlides.find(s=>s.id===editForm.id)?t("cm_edit_slide"):t("cm_new_slide_title"))+" "+t("cm_slide_suffix")} maxW={640}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"1/-1"}}><Sel label={t("cm_slide_type")} value={editForm.type||"welcome"} onChange={e=>setEditForm(f=>({...f,type:e.target.value}))}><option value="welcome">{t("cm_type_welcome")}</option><option value="map">{t("cm_type_map")}</option><option value="crops">{t("cm_type_crops")}</option><option value="livestock">{t("cm_type_livestock")}</option></Sel></div>
          <div style={{gridColumn:"1/-1"}}><Inp label={t("cm_title_field")} value={editForm.title||""} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))}/></div>
          <div style={{gridColumn:"1/-1"}}><Inp label={t("cm_subtitle")} value={editForm.subtitle||""} onChange={e=>setEditForm(f=>({...f,subtitle:e.target.value}))}/></div>
          <Inp label={t("cm_interval")} type="number" value={editForm.interval||6} onChange={e=>setEditForm(f=>({...f,interval:parseInt(e.target.value)||6}))}/>
          <div style={{display:"flex",alignItems:"center",gap:9,paddingTop:18}}>
            <div style={{width:40,height:21,background:editForm.published?G.g5:G.gray3,borderRadius:99,position:"relative",transition:"background .2s",cursor:"pointer"}} onClick={()=>setEditForm(f=>({...f,published:!f.published}))}>
              <div style={{width:17,height:17,background:G.white,borderRadius:99,position:"absolute",top:2,left:editForm.published?21:2,transition:"left .2s",boxShadow:G.sh}}/>
            </div>
            <span style={{fontSize:13,fontWeight:600,color:G.gray7}}>{editForm.published?t("cm_published"):t("cm_draft")}</span>
          </div>
          <Inp label={t("cm_show_after")} type="datetime-local" value={editForm.scheduleStart||""} onChange={e=>setEditForm(f=>({...f,scheduleStart:e.target.value}))}/>
          <Inp label={t("cm_hide_after")} type="datetime-local" value={editForm.scheduleEnd||""} onChange={e=>setEditForm(f=>({...f,scheduleEnd:e.target.value}))}/>
        </div>
        {editForm.type==="welcome"&&(
          <>
            <Inp label={t("cm_description")} value={editForm.desc||""} onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))}/>
            <ImageUpload label={t("cm_main_image")} value={editForm.image||""} onChange={v=>setEditForm(f=>({...f,image:v}))}/>
          </>
        )}
        {editForm.type==="map"&&(
          <div style={{marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{margin:0,fontSize:12,color:G.gray5,fontWeight:600}}>{t("cm_regions")}</p>
              <Btn size="sm" variant="secondary" onClick={addRegion} icon={<Ic.add size={14}/>}>{t("cm_add_region")}</Btn>
            </div>
            {(editForm.regions||[]).map((r,i)=>(
              <div key={i} style={{background:G.gray1,borderRadius:G.r,padding:10,marginBottom:7}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:7}}><div style={{flex:1}}><Inp label={t("cm_region_name")} value={r.name} onChange={e=>updateRegion(i,"name",e.target.value)}/></div><div style={{width:68}}><Inp label={t("cm_color")} type="color" value={r.color||"#22c55e"} onChange={e=>updateRegion(i,"color",e.target.value)} style={{height:38,padding:2}}/></div></div>
                    <Inp label={t("cm_crops_livestock")} value={r.crops} onChange={e=>updateRegion(i,"crops",e.target.value)}/>
                  </div>
                  <button onClick={()=>delRegion(i)} style={{marginTop:22,background:G.red,color:G.white,border:"none",borderRadius:7,width:25,height:25,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.delete size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {(editForm.type==="crops"||editForm.type==="livestock")&&(
          <div style={{marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{margin:0,fontSize:12,color:G.gray5,fontWeight:600}}>{t("cm_grid_items")} ({(editForm.items||[]).length}) · drag ⠿ or use ↑↓ to reorder</p>
              <Btn size="sm" variant="secondary" onClick={addItem} icon={<Ic.add size={14}/>}>{t("cm_add_item")}</Btn>
            </div>
            {(editForm.items||[]).map((item,i)=>(
              <div key={i} draggable onDragStart={()=>setDragItemIdx(i)} onDragOver={e=>onItemDragOver(e,i)} onDragEnd={()=>setDragItemIdx(null)}
                style={{background:G.gray1,borderRadius:G.r,padding:10,marginBottom:7,border:`2px solid ${dragItemIdx===i?"#22c55e":"transparent"}`}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{color:G.gray3,fontSize:15,cursor:"grab",marginTop:24,flexShrink:0}}><Ic.grip size={15}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <Inp label={t("cm_title_field")} value={item.name} onChange={e=>updateItem(i,"name",e.target.value)}/>
                    <Inp label={t("cm_item_desc_label")} value={item.desc||""} onChange={e=>updateItem(i,"desc",e.target.value)} placeholder={t("cm_item_desc_ph")}/>
                    <ImageUpload label={t("cm_image")} value={item.image||""} onChange={v=>updateItem(i,"image",v)}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:22,flexShrink:0}}>
                    <button onClick={()=>moveItem(i,-1)} disabled={i===0} style={{background:G.white,border:`1px solid ${G.gray3}`,borderRadius:6,width:25,height:25,cursor:i===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:i===0?.4:1}}><Ic.up size={13}/></button>
                    <button onClick={()=>moveItem(i,1)} disabled={i===(editForm.items||[]).length-1} style={{background:G.white,border:`1px solid ${G.gray3}`,borderRadius:6,width:25,height:25,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:i===(editForm.items||[]).length-1?.4:1}}><Ic.down size={13}/></button>
                    <button onClick={()=>delItem(i)} style={{background:G.red,color:G.white,border:"none",borderRadius:6,width:25,height:25,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.delete size={13}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:9,marginTop:13}}>
          <Btn full onClick={saveEdit}>{t("cm_save_slide")}</Btn>
          <Btn variant="secondary" onClick={()=>setEditOpen(false)}>{t("prices_cancel")}</Btn>
        </div>
      </Modal>
    </div>
  );
}

function HeroCarousel({isAdmin,onNav}){
  const[allSlides,setAllSlides]=useState(DEFAULT_CAROUSEL);
  const[cur,setCur]=useState(0);const[paused,setPaused]=useState(false);
  const timerRef=useRef(null);const touchStartX=useRef(null);
  const reload=useCallback(async()=>{const s=await DB.carousel();if(s&&s.length)setAllSlides(s)},[]);
  useEffect(()=>{reload()},[]);
  useEffect(()=>{const iv=setInterval(reload,30000);return()=>clearInterval(iv)},[]);
  const slides=[...allSlides].sort((a,b)=>(a.order??0)-(b.order??0)).filter(isPublished);
  const safeIdx=i=>((i%Math.max(slides.length,1))+Math.max(slides.length,1))%Math.max(slides.length,1);
  const next=()=>setCur(c=>safeIdx(c+1));
  const prev=()=>setCur(c=>safeIdx(c-1));
  useEffect(()=>{if(cur>=slides.length)setCur(0)},[slides.length]);
  useEffect(()=>{
    if(paused||slides.length<2)return;
    timerRef.current=setTimeout(next,(slides[cur]?.interval||6)*1000);
    return()=>clearTimeout(timerRef.current);
  },[cur,paused,slides]);
  const handleTouchStart=e=>{touchStartX.current=e.touches[0].clientX};
  const handleTouchEnd=e=>{if(touchStartX.current===null)return;const dx=e.changedTouches[0].clientX-touchStartX.current;if(Math.abs(dx)>40){dx<0?next():prev()}touchStartX.current=null};
  const renderContent=s=>{
    if(!s)return null;
    if(s.type==="welcome") return(
      <div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
        {s.image&&<div style={{borderRadius:13,overflow:"hidden",height:152,marginBottom:12,boxShadow:"0 8px 24px rgba(0,0,0,.3)"}}><img src={s.image} alt={s.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/></div>}
        <h3 style={{fontFamily:FH,fontSize:17,fontWeight:900,color:G.white,margin:"0 0 5px",lineHeight:1.3}}>{s.title}</h3>
        {s.subtitle&&<p style={{fontSize:12,color:"rgba(255,255,255,.85)",margin:"0 0 4px",fontWeight:600}}>{s.subtitle}</p>}
        {s.desc&&<p style={{fontSize:11,color:"rgba(255,255,255,.7)",lineHeight:1.6,margin:0}}>{s.desc}</p>}
      </div>
    );
    if(s.type==="map") return(
      <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontFamily:FH,fontSize:14,fontWeight:900,color:G.white,margin:"0 0 3px"}}>{s.title}</h3>
        {s.subtitle&&<p style={{fontSize:10,color:"rgba(255,255,255,.75)",margin:"0 0 9px"}}>{s.subtitle}</p>}
        <div style={{flex:1,background:"rgba(255,255,255,.06)",borderRadius:11,padding:"7px 9px",display:"flex",flexDirection:"column",gap:5,overflow:"auto",position:"relative"}}>
          <span style={{position:"absolute",top:5,right:7,fontSize:10,color:"rgba(255,255,255,.4)",fontStyle:"italic"}}>Rwanda</span>
          {(s.regions||[]).map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,padding:"4px 6px",borderRadius:6,background:"rgba(255,255,255,.07)"}}>
              <div style={{width:10,height:10,borderRadius:3,background:r.color||"#22c55e",flexShrink:0,marginTop:2}}/>
              <div><div style={{fontSize:11,fontWeight:700,color:G.white,marginBottom:1}}>{r.name}</div><div style={{fontSize:9,color:"rgba(255,255,255,.65)"}}>{r.crops}</div></div>
            </div>
          ))}
        </div>
      </div>
    );
    if(s.type==="crops"||s.type==="livestock") return(
      <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontFamily:FH,fontSize:14,fontWeight:900,color:G.white,margin:"0 0 3px"}}>{s.title}</h3>
        {s.subtitle&&<p style={{fontSize:10,color:"rgba(255,255,255,.75)",margin:"0 0 7px"}}>{s.subtitle}</p>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,flex:1}}>
          {(s.items||[]).map((item,i)=>(
            <div key={i} className="ik-tile" style={{borderRadius:10,overflow:"hidden",background:"rgba(255,255,255,.1)",position:"relative",cursor:"pointer",transition:"transform 220ms ease, box-shadow 220ms ease"}}>
              <img src={item.image} alt={item.name} style={{width:"100%",height:66,objectFit:"cover",display:"block",transition:"transform 350ms ease"}} onError={e=>e.target.style.display="none"}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.65) 0%,rgba(0,0,0,0) 55%)"}}/>
              <div style={{position:"absolute",bottom:3,left:0,right:0,textAlign:"center",padding:"0 3px"}}>
                <span style={{fontSize:9.5,fontWeight:800,color:G.white,textShadow:"0 1px 3px rgba(0,0,0,.6)"}}>{item.name}</span>
                {item.desc&&<div style={{fontSize:7.5,color:"rgba(255,255,255,.85)",marginTop:1,lineHeight:1.2}}>{item.desc}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    return null;
  };
  if(slides.length===0)return null;
  return(
    <div style={{width:"100%",maxWidth:355,flexShrink:0,position:"relative"}}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div style={{background:"rgba(255,255,255,.09)",backdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:18,padding:"17px 15px",minHeight:295,position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.25)"}}>
        {slides.map((s,i)=>(
          <div key={s.id} style={{position:i===0?"relative":"absolute",inset:0,padding:i===0?"0":"17px 15px",opacity:i===cur?1:0,transition:"opacity 600ms ease",pointerEvents:i===cur?"auto":"none"}}>
            {renderContent(s)}
          </div>
        ))}
        {slides.length>1&&(
          <>
            <button onClick={prev} style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",color:G.white,width:25,height:25,borderRadius:99,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>‹</button>
            <button onClick={next} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",color:G.white,width:25,height:25,borderRadius:99,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>›</button>
          </>
        )}
        {isAdmin&&<button onClick={()=>onNav("admin")} style={{position:"absolute",top:6,right:6,background:"rgba(245,158,11,.85)",color:G.white,border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:9,fontWeight:700,zIndex:10,display:"flex",alignItems:"center",gap:3}}><Ic.edit size={9}/> Slides</button>}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8,alignItems:"center"}}>
        {slides.map((s,i)=><button key={s.id} onClick={()=>setCur(i)} style={{width:i===cur?19:6,height:6,borderRadius:99,background:i===cur?"rgba(255,255,255,.9)":"rgba(255,255,255,.35)",border:"none",cursor:"pointer",transition:"all 300ms",padding:0}}/>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   LOGO — official Inkingi brand mark
   Default is the uploaded official logo (embedded as a data URL so it
   works with zero configuration). Admins can replace it at any time from
   Site Settings without touching source code — that override is stored
   in site.logoUrl / site.faviconUrl and takes priority over this default.
════════════════════════════════════ */
const DEFAULT_LOGO_URL = "data:image/png;base64,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";
function Logo({size=30, site}){
  const src = (site && site.logoUrl) || DEFAULT_LOGO_URL;
  return <img src={src} alt="Inkingi" style={{width:size,height:size,objectFit:"contain",borderRadius:size>60?12:6,background:"#fff"}} onError={e=>{e.target.onerror=null;e.target.src=DEFAULT_LOGO_URL}}/>;
}

/* ════════════════════════════════════
   AUDIT LOG & TRASH — persisted via SA
════════════════════════════════════ */
const ADMIN_ROLES={superadmin:{label:"Super Admin",color:"#7c3aed",bg:"#ede9fe"},admin:{label:"Admin",color:"#1d4ed8",bg:"#eff6ff"},editor:{label:"Editor",color:"#0891b2",bg:"#e0f2fe"}};

const AuditLog={
  async log(user,action,details=""){
    const entries=(await SA.getKV("audit_log"))||[];
    entries.unshift({id:"al"+Date.now(),adminId:user?.id||"system",adminName:user?.name||"System",adminRole:user?.adminRole||"admin",action,details,timestamp:new Date().toISOString()});
    await SA.setKV("audit_log",entries.slice(0,500)); // keep last 500
  },
  async getAll(){return (await SA.getKV("audit_log"))||[]},
};

const Trash={
  async add(type,record,deletedBy){
    const items=(await SA.getKV("trash"))||[];
    items.unshift({id:"tr"+Date.now(),type,record,deletedBy,deletedByName:deletedBy?.name||"Admin",deletedAt:new Date().toISOString()});
    await SA.setKV("trash",items.slice(0,200));
  },
  async getAll(){return (await SA.getKV("trash"))||[]},
  async restore(trashId){
    const items=(await SA.getKV("trash"))||[];
    const item=items.find(i=>i.id===trashId);
    if(!item)return null;
    await SA.setKV("trash",items.filter(i=>i.id!==trashId));
    return item;
  },
  async permanentDelete(trashId){
    await SA.setKV("trash",(await SA.getKV("trash")||[]).filter(i=>i.id!==trashId));
  },
  async clear(){await SA.setKV("trash",[])},
};

/* ════════════════════════════════════
   BACKUP / RESTORE / EXPORT HELPERS
════════════════════════════════════ */
const DataMgr={
  async createBackup(user){
    const[farmers,products,prices,tips,pests,calendar,ads,carousel,site,ratings,auditLog]=await Promise.all([
      SA.getAll("farmers"),SA.getAll("products"),SA.getAll("prices"),SA.getAll("tips"),SA.getAll("pests"),SA.getAll("calendar"),
      SA.getKV("ads"),SA.getKV("carousel"),SA.getKV("site"),SA.getKV("ratings"),SA.getKV("audit_log"),
    ]);
    const backup={version:"2.0",createdAt:new Date().toISOString(),createdBy:user?.name||"Admin",data:{farmers,products,prices,tips,pests,calendar,ads:ads||[],carousel:carousel||[],site:site||{},ratings:ratings||[],auditLog:auditLog||[]}};
    const backups=(await SA.getKV("backups"))||[];
    backups.unshift({id:"bk"+Date.now(),createdAt:backup.createdAt,createdBy:backup.createdBy,size:JSON.stringify(backup).length,snapshot:backup});
    await SA.setKV("backups",backups.slice(0,10)); // keep last 10
    await AuditLog.log(user,"BACKUP_CREATED","Manual backup created");
    return backup;
  },
  async getBackups(){return (await SA.getKV("backups"))||[]},
  async restore(backupId,user){
    const backups=(await SA.getKV("backups"))||[];
    const bk=backups.find(b=>b.id===backupId);
    if(!bk)throw new Error("Backup not found");
    const d=bk.snapshot.data;
    await Promise.all([
      SA.save("farmers",d.farmers||[]),SA.save("products",d.products||[]),SA.save("prices",d.prices||[]),
      SA.save("tips",d.tips||[]),SA.save("pests",d.pests||[]),SA.save("calendar",d.calendar||[]),
      SA.setKV("ads",d.ads||[]),SA.setKV("carousel",d.carousel||[]),SA.setKV("site",d.site||{}),
    ]);
    await AuditLog.log(user,"BACKUP_RESTORED",`Restored from backup: ${bk.createdAt}`);
  },
  downloadJSON(data,filename){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  },
  toCSV(rows,cols){
    const header=cols.join(",");
    const body=rows.map(r=>cols.map(c=>{const v=r[c]??"";""+v;return `"${(""+v).replace(/"/g,'""')}"`;}).join(",")).join("\n");
    return header+"\n"+body;
  },
  downloadCSV(csvStr,filename){
    const blob=new Blob([csvStr],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  },
  downloadXLSX(rows,cols,filename){
    // Pure JS minimal XLSX (CSV inside .xlsx via data URI for compatibility)
    // For real XLSX use SheetJS — here we output a well-formatted CSV named .xlsx
    // In production swap this with: import * as XLSX from 'xlsx'; XLSX.writeFile(...)
    const csv=this.toCSV(rows,cols);
    const blob=new Blob([csv],{type:"application/vnd.ms-excel"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  },
};

/* ════════════════════════════════════
   CONFIRM DIALOG
════════════════════════════════════ */
function ConfirmDialog({open,title,message,danger,onConfirm,onCancel}){
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(20,30,20,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:G.white,borderRadius:G.rL,width:"100%",maxWidth:400,boxShadow:G.shXL,padding:28,textAlign:"center"}}>
        <div style={{marginBottom:12,color:danger?G.red:G.g6,display:"flex",justifyContent:"center"}}>{danger?<Ic.alert size={40}/>:<HelpCircle size={40}/>}</div>
        <h3 style={{margin:"0 0 10px",fontFamily:FH,color:G.gray9,fontSize:17}}>{title}</h3>
        <p style={{margin:"0 0 24px",color:G.gray5,fontSize:13,lineHeight:1.6}}>{message}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <Btn variant={danger?"danger":"primary"} onClick={onConfirm}>Confirm</Btn>
          <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}
function AnimatedHeading({text,style:s}){
  const[vis,setVis]=useState(true);
  useEffect(()=>{
    const cycle=()=>{setVis(false);setTimeout(()=>setVis(true),700)};
    const iv=setInterval(cycle,6000);
    return()=>clearInterval(iv);
  },[]);
  return(
    <h1 style={{...s,transition:"opacity 700ms ease, transform 700ms ease",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(12px)"}}>{text}</h1>
  );
}

/* ════════════════════════════════════
   MAIN APP
════════════════════════════════════ */
function AppInner(){
  const{lang,setLang,t}=useLang();
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("home");
  const[products,setProducts]=useState([]);
  const[farmers,setFarmers]=useState([]);
  const[wholesalers,setWholesalers]=useState([]);
  const[ads,setAds]=useState([]);
  const[site,setSite]=useState(DEFAULT_SITE);
  const[toast,setToast]=useState(null);
  const[loading,setLoading]=useState(true);
  const[searchQ,setSearchQ]=useState("");
  const[sugg,setSugg]=useState([]);const[showSugg,setShowSugg]=useState(false);
  const[results,setResults]=useState(null);
  const[fDist,setFDist]=useState("");const[fSec,setFSec]=useState("");const[fVil,setFVil]=useState("");
  const[fCat,setFCat]=useState("");const[fMin,setFMin]=useState("");const[fMax,setFMax]=useState("");
  const[sort,setSort]=useState("latest");const[showFilter,setShowFilter]=useState(false);
  const[selProd,setSelProd]=useState(null);const[selFarmer,setSelFarmer]=useState(null);const[selAd,setSelAd]=useState(null);
  const[showLogin,setShowLogin]=useState(false);const[showReg,setShowReg]=useState(false);
  const[showRoleChoice,setShowRoleChoice]=useState(false);const[regRole,setRegRole]=useState("farmer");
  // Register buttons open the role choice first; picking a role there opens
  // the existing RegModal with that role instead of adding a second button.
  const openRegChoice=()=>setShowRoleChoice(true);
  const chooseRegRole=role=>{setShowRoleChoice(false);setRegRole(role);setShowReg(true)};
  const[legalOpen,setLegalOpen]=useState(""); // "" | "terms" | "privacy" | "support"
  const[showForm,setShowForm]=useState(false);const[editP,setEditP]=useState(null);const[delP,setDelP]=useState(null);
  const[detailFarmer,setDetailFarmer]=useState(null);
  const[adminTab,setAdminTab]=useState("dashboard");
  const[syncOk,setSyncOk]=useState(true);
  useEffect(()=>{ // lightweight poll so the admin badge reflects real Supabase health without wiring every save call
    if(!HAS_SUPABASE) return;
    const t=setInterval(()=>setSyncOk(getLastSyncOk()),1500);
    return ()=>clearInterval(t);
  },[]);
  const[farmerFilter,setFarmerFilter]=useState(""); // "" | "pending" — set when a dashboard stat card is clicked
  const[photoFarmer,setPhotoFarmer]=useState(null); // farmer currently being edited for profile photo (admin)
  const searchRef=useRef(null);

  const notify=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500)};
  const reload=useCallback(async()=>{
    const[f,p,a,s,w]=await Promise.all([DB.farmers(),DB.products(),DB.ads(),DB.site(),WS.getAll()]);
    setFarmers(f);setProducts(p);setAds(a);setSite(s||DEFAULT_SITE);setWholesalers(w);
  },[]);

  useEffect(()=>{(async()=>{setLoading(true);await DB.init();await reload();const restored=await DB.restoreSession();if(restored)setUser(restored);setLoading(false)})()},[]);
  // Keep the browser tab favicon in sync with the admin-configured logo/favicon — no code edits needed.
  useEffect(()=>{
    const href=(site&&(site.faviconUrl||site.logoUrl))||DEFAULT_LOGO_URL;
    let link=document.querySelector("link[rel~='icon']");
    if(!link){link=document.createElement("link");link.rel="icon";document.head.appendChild(link)}
    link.href=href;
  },[site]);
  useEffect(()=>{
    const h=e=>{if(searchRef.current&&!searchRef.current.contains(e.target))setShowSugg(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);

  const approvedFarmers=farmers.filter(f=>f.status==="approved");
  const approvedProds=products.filter(p=>approvedFarmers.find(f=>f.id===p.fid));
  const nav=p=>{setPage(p);setResults(null);setShowSugg(false)};

  const doSearch=(q=searchQ)=>{
    let list=[...approvedProds];
    if(q)list=list.filter(p=>{const lq=q.toLowerCase();return p.name.toLowerCase().includes(lq)||(p.sub||"").toLowerCase().includes(lq)||p.district.toLowerCase().includes(lq)||p.sector.toLowerCase().includes(lq)||p.fname.toLowerCase().includes(lq)});
    if(fDist)list=list.filter(p=>p.district===fDist);
    if(fSec)list=list.filter(p=>p.sector===fSec);
    if(fVil)list=list.filter(p=>p.village===fVil);
    if(fCat)list=list.filter(p=>p.type===fCat);
    if(fMin)list=list.filter(p=>p.price>=parseFloat(fMin));
    if(fMax)list=list.filter(p=>p.price<=parseFloat(fMax));
    if(sort==="price")list.sort((a,b)=>a.price-b.price);
    else if(sort==="priceH")list.sort((a,b)=>b.price-a.price);
    else if(sort==="views")list.sort((a,b)=>(b.views||0)-(a.views||0));
    else list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    setResults(list);setShowSugg(false);setPage("marketplace");
  };

  const handleSugInput=v=>{
    setSearchQ(v);
    if(v.length<2){setSugg([]);setShowSugg(false);return}
    const lv=v.toLowerCase();const s=new Set();
    approvedProds.forEach(p=>{if(p.name.toLowerCase().includes(lv))s.add(p.name);if((p.sub||"").toLowerCase().includes(lv))s.add(p.sub);if(p.district.toLowerCase().includes(lv))s.add(p.district)});
    setSugg([...s].slice(0,6));setShowSugg(true);
  };

  const doLogin=async(email,pw)=>{
    const u=await DB.login(email,pw);
    if(u?.err)return{err:u.err};
    // Session persistence is already handled inside Auth.signIn (a real,
    // server-verified Supabase session) — no separate localStorage write
    // needed here the way the old custom login required.
    setUser(u);setShowLogin(false);
    notify("Welcome, "+u.name);if(u.role==="admin")setPage("admin");else if(u.role==="wholesaler")setPage("wpanel");return{ok:true};
  };
  const doLogout=async()=>{await DB.logout();setUser(null);setPage("home");notify("Signed out")};
  const doRegister=async(d,role)=>{const r=await DB.register(d,role);if(r.ok){await reload();setShowReg(false);notify(r.pendingEmailConfirm?"Check your email to confirm your account, then sign in.":"Submitted! Await approval.")}return r};
  const viewProduct=async p=>{await DB.incView(p.id);await reload();setSelProd(p)};

  const navItems=[
    {k:"home",l:t("nav_home")},{k:"marketplace",l:t("nav_marketplace"),ic:Ic.marketplace},{k:"farmers",l:t("nav_farmers"),ic:Ic.farmer},
    {k:"prices",l:t("nav_prices"),ic:Ic.prices},{k:"tips",l:t("nav_tips"),ic:Ic.tips},{k:"pests",l:t("nav_pests"),ic:Ic.pests},{k:"calendar",l:t("nav_calendar"),ic:Ic.calendar},
    ...(user?.role==="farmer"?[{k:"dashboard",l:t("nav_dashboard"),ic:Ic.dashboard}]:[]),
    ...(user?.role==="wholesaler"?[{k:"wpanel",l:t("nav_dashboard"),ic:Ic.dashboard}]:[]),
    ...(user?.role==="admin"?[{k:"admin",l:t("nav_admin"),ic:Ic.admin}]:[]),
  ];

  /* ── HOME ── */
  const renderHome=()=>{
    const activeAd=ads.find(a=>a.active);
    return(
      <div>
        {/* HERO */}
        <div style={{position:"relative",minHeight:540,background:`linear-gradient(135deg,${G.g9},${G.g7} 60%,${G.g5})`,overflow:"hidden",display:"flex",alignItems:"center"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=60')",backgroundSize:"cover",backgroundPosition:"center",opacity:.18}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(10,46,10,.88),rgba(27,94,32,.55))"}}/>
          <div style={{position:"relative",maxWidth:1100,margin:"0 auto",padding:"68px 20px 68px",width:"100%",display:"flex",alignItems:"center",gap:30,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:270}}>
              <AnimatedHeading text={t("hero_title")} style={{fontFamily:FH,fontSize:"clamp(26px,5vw,50px)",fontWeight:900,color:G.white,margin:"0 0 12px",lineHeight:1.15}}/>
              <p style={{fontSize:"clamp(12px,2vw,15px)",color:"rgba(255,255,255,.82)",margin:"0 0 30px",lineHeight:1.7}}>{t("hero_subtitle")}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Btn size="lg" onClick={()=>{setFCat("crop");doSearch("")}} style={{background:G.white,color:G.g7}} icon={<Ic.crops size={16}/>}>{t("hero_explore_crops")}</Btn>
                <Btn size="lg" onClick={()=>{setFCat("animal");doSearch("")}} style={{background:"rgba(255,255,255,.12)",color:G.white,border:"2px solid rgba(255,255,255,.3)"}} icon={<Ic.livestock size={16}/>}>{t("hero_browse_livestock")}</Btn>
              </div>
            </div>
            <HeroCarousel isAdmin={user?.role==="admin"} onNav={nav}/>
          </div>
        </div>

        {/* HOMEPAGE AD (small inline) */}
        {activeAd&&(
          <div style={{background:G.white}}>
            <div style={{maxWidth:1100,margin:"0 auto",padding:"22px 20px 0"}}>
              <div style={{borderRadius:G.rL,overflow:"hidden",cursor:"pointer",position:"relative"}} onClick={()=>setSelAd(activeAd)}>
                <img src={activeAd.image} alt={activeAd.title} style={{width:"100%",height:135,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(0,0,0,.7),rgba(0,0,0,.1))",display:"flex",alignItems:"center",padding:"0 24px",gap:12}}>
                  <Badge color="gold">Sponsored</Badge>
                  <div>
                    <h3 style={{margin:0,color:G.white,fontSize:16,fontFamily:FH}}>{activeAd.title}</h3>
                    <p style={{margin:"2px 0 0",color:"rgba(255,255,255,.8)",fontSize:12}}>{activeAd.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESOURCE CARDS */}
        <div style={{background:G.white}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"44px 20px 36px"}}>
            <h2 style={{margin:"0 0 16px",fontSize:18,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:8}}><Ic.dashboard size={18} color={G.g6}/> {t("home_resources")}</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:13,marginBottom:0}}>
              {[{page:"prices",icon:Ic.prices,title:t("home_market_prices"),desc:t("home_market_prices_desc")},{page:"tips",icon:Ic.tips,title:t("home_farming_tips"),desc:t("home_farming_tips_desc")},{page:"pests",icon:Ic.pests,title:t("home_pest_center"),desc:t("home_pest_center_desc")},{page:"calendar",icon:Ic.calendar,title:t("home_calendar"),desc:t("home_calendar_desc")}].map(m=>(
                <div key={m.page} onClick={()=>nav(m.page)} style={{background:G.white,borderRadius:G.rL,padding:"18px 16px",cursor:"pointer",border:`1px solid ${G.gray1}`,boxShadow:G.sh,transition:"transform .22s,box-shadow .22s,border-color .22s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=G.shL;e.currentTarget.style.borderColor="#a5d6a7"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=G.sh;e.currentTarget.style.borderColor=G.gray1}}>
                  <div style={{width:40,height:40,background:G.g1,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,color:G.g7}}><m.icon size={20}/></div>
                  <h3 style={{margin:"0 0 5px",fontSize:13,fontWeight:800,color:G.g7,fontFamily:FH}}>{m.title}</h3>
                  <p style={{margin:0,fontSize:11,color:G.gray5,lineHeight:1.55}}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT SECTIONS — alternating bg */}
        {[
          {label:t("home_featured"),items:approvedProds.filter(p=>p.featured),alt:false},
          {label:t("home_newly_listed"),items:[...approvedProds].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4),alt:true},
          {label:t("home_most_popular"),items:[...approvedProds].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4),alt:false},
        ].map(({label,items,alt})=>items.length>0&&(
          <div key={label} style={{background:alt?G.sectionAlt:G.white}}>
            <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h2 style={{margin:0,fontSize:18,fontWeight:800,fontFamily:FH,color:G.gray9}}>{label}</h2>
                <Btn variant="secondary" size="sm" onClick={()=>doSearch("")}>{t("home_view_all")}</Btn>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                {items.slice(0,4).map(p=>(
                  <PCard key={p.id} product={p} user={user}
                    onView={viewProduct}
                    onEdit={p=>{setEditP(p);setShowForm(true)}}
                    onDel={p=>setDelP(p)}
                    onFeat={async p=>{await DB.toggleFeatured(p.id);await reload()}}/>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        {!user&&(
          <div style={{background:`linear-gradient(160deg,${G.g8} 0%,${G.g6} 100%)`,padding:"52px 20px",textAlign:"center"}}>
            <h2 style={{fontFamily:FH,fontSize:"clamp(19px,4vw,30px)",color:G.white,margin:"0 0 9px"}}>{t("home_cta_title")}</h2>
            <p style={{color:"rgba(255,255,255,.82)",margin:"0 0 20px",fontSize:14}}>{t("home_cta_subtitle")}</p>
            <Btn size="lg" onClick={()=>chooseRegRole("farmer")} style={{background:G.white,color:G.g7}} icon={<Ic.farmer size={16}/>}>{t("home_cta_button")}</Btn>
          </div>
        )}
      </div>
    );
  };

  /* ── MARKETPLACE ── */
  const renderMarketplace=()=>{
    const list=results!==null?results:approvedProds;
    return(
      <div style={{background:G.white,minHeight:"60vh"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.marketplace size={22} color={G.g6}/> {t("marketplace_title")}</h1>
            <div style={{display:"flex",gap:7}}>
              <Btn variant="secondary" size="sm" icon={<Ic.edit size={13}/>} onClick={()=>setShowFilter(!showFilter)}>Filters</Btn>
              {user?.role==="farmer"&&user?.status==="approved"&&<Btn size="sm" icon={<Ic.add size={14}/>} onClick={()=>{setEditP(null);setShowForm(true)}}>List Product</Btn>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {[["","All"],["crop","Crops"],["animal","Livestock"]].map(([v,l])=>(
              <button key={v} onClick={()=>{setFCat(v);doSearch()}} style={{padding:"6px 13px",borderRadius:99,border:`1.5px solid ${fCat===v?G.g6:G.gray3}`,background:fCat===v?G.g6:G.white,color:fCat===v?G.white:G.gray7,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:FB}}>{l}</button>
            ))}
            <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
              {[["latest","Latest"],["price","Price ↑"],["priceH","Price ↓"],["views","Popular"]].map(([v,l])=>(
                <button key={v} onClick={()=>{setSort(v);doSearch()}} style={{padding:"5px 11px",borderRadius:99,border:`1.5px solid ${sort===v?G.g6:G.gray3}`,background:sort===v?G.g6:G.white,color:sort===v?G.white:G.gray7,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:FB}}>{l}</button>
              ))}
            </div>
          </div>
          {showFilter&&(
            <div style={{background:G.white,borderRadius:G.rL,padding:16,marginBottom:14,boxShadow:G.sh,border:`1px solid ${G.gray1}`}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:9,alignItems:"end"}}>
                <Sel label="Category" value={fCat} onChange={e=>setFCat(e.target.value)}><option value="">All</option><option value="crop">Crops</option><option value="animal">Livestock</option></Sel>
                <LocPicker district={fDist} sector={fSec} village={fVil} onChange={(d,s,v)=>{setFDist(d);setFSec(s);setFVil(v)}}/>
                <Inp label="Min Price" type="number" value={fMin} onChange={e=>setFMin(e.target.value)} placeholder="0"/>
                <Inp label="Max Price" type="number" value={fMax} onChange={e=>setFMax(e.target.value)} placeholder="1000000"/>
                <div style={{paddingTop:12,display:"flex",gap:7}}>
                  <Btn onClick={()=>doSearch()} full>Apply</Btn>
                  <Btn variant="secondary" full onClick={()=>{setFCat("");setFDist("");setFSec("");setFVil("");setFMin("");setFMax("");setSearchQ("");setResults(null)}}>Clear</Btn>
                </div>
              </div>
            </div>
          )}
          {list.length===0
            ?<div style={{textAlign:"center",padding:"60px",color:G.gray5}}>
                <div style={{marginBottom:12,display:"flex",justifyContent:"center"}}><Ic.search size={48}/></div>
                <h3 style={{fontFamily:FH,color:G.gray9}}>No listings found</h3>
                <Btn variant="secondary" onClick={()=>setResults(null)} style={{marginTop:11}}>Clear filters</Btn>
              </div>
            :<>
                <p style={{margin:"0 0 13px",color:G.gray5,fontSize:12}}>{list.length} listing{list.length!==1?"s":""} found</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                  {list.map(p=>(
                    <PCard key={p.id} product={p} user={user}
                      onView={viewProduct}
                      onEdit={p=>{setEditP(p);setShowForm(true)}}
                      onDel={p=>setDelP(p)}
                      onFeat={async p=>{await DB.toggleFeatured(p.id);await reload()}}/>
                  ))}
                </div>
              </>}
        </div>
      </div>
    );
  };

  /* ── FARMERS ── */
  const renderFarmers=()=>(
    <div style={{background:G.sectionAlt,minHeight:"60vh"}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"28px 20px"}}>
        <h1 style={{margin:"0 0 20px",fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.farmer size={22} color={G.g6}/> Farmers</h1>
        {approvedFarmers.length===0
          ?<p style={{color:G.gray5}}>No farmers found</p>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:15}}>
              {approvedFarmers.map(f=>{
                const fp=products.filter(p=>p.fid===f.id);
                return(
                  <div key={f.id} style={{background:G.white,borderRadius:G.rL,padding:16,boxShadow:G.sh,cursor:"pointer",transition:"transform .22s,box-shadow .22s,border-color .22s",border:`1px solid ${G.gray1}`}}
                    onClick={()=>setSelFarmer(f)}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=G.shL;e.currentTarget.style.borderColor="#a5d6a7"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=G.sh;e.currentTarget.style.borderColor=G.gray1}}>
                    <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
                      <FarmerPhoto farmer={f} size={48} radius={12}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><strong style={{fontSize:13,fontFamily:FH,color:G.gray9}}>{f.name}</strong><Badge color="green"><Ic.check size={10}/></Badge></div>
                        <p style={{margin:"2px 0",fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4}}><Ic.location size={11}/> {f.sector}, {f.district}</p>
                        <Stars value={f.rating||0} size={11}/> <span style={{fontSize:11,color:G.gray5}}>{(f.rating||0).toFixed(1)} · {fp.length} listings</span>
                        {f.bio&&<p style={{margin:"5px 0 0",fontSize:11,color:G.gray5,lineHeight:1.5,borderTop:`1px solid ${G.gray1}`,paddingTop:5}}>{f.bio}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>}
      </div>
    </div>
  );

  /* ── DASHBOARD ── */
  const renderDashboard=()=>{
    if(!user||user.role!=="farmer")return null;
    const me=farmers.find(f=>f.id===user.id)||user;
    const mine=products.filter(p=>p.fid===user.id);
    return(
      <div style={{background:G.white,minHeight:"60vh"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"28px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
            <div style={{width:34,height:34,borderRadius:9,overflow:"hidden",flexShrink:0,boxShadow:G.sh}}><Logo size={34} site={site}/></div>
            <span style={{fontSize:13,fontWeight:700,color:G.gray5,fontFamily:FB}}>Inkingi</span>
          </div>
          <div style={{background:`linear-gradient(135deg,${G.g8},${G.g6})`,borderRadius:20,padding:22,marginBottom:20,color:G.white}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div onClick={()=>setPhotoFarmer(me)} style={{position:"relative",cursor:"pointer",flexShrink:0}} title="Update profile photo">
                <FarmerPhoto farmer={me} size={52} radius={12}/>
                <div style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,background:G.white,borderRadius:99,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:G.sh,color:G.g7}}><Ic.camera size={10}/></div>
              </div>
              <div>
                <h2 style={{margin:0,fontSize:18,fontFamily:FH}}>{me.name}</h2>
                <p style={{margin:"3px 0 0",opacity:.8,fontSize:12,display:"flex",alignItems:"center",gap:4}}><Ic.location size={12}/> {me.sector}, {me.district}</p>
              </div>
              <div style={{marginLeft:"auto"}}><Badge color={me.status==="approved"?"green":me.status==="blocked"?"red":"gold"}>{me.status==="approved"?<><Ic.check size={10}/> Verified</>:me.status==="blocked"?<><Ic.close size={10}/> Suspended</>:<><Ic.pending size={10}/> Pending</>}</Badge></div>
            </div>
          </div>
          {/* Email confirmation and Admin approval are two different, separate
              things — a farmer reaching this dashboard at all already proves
              their email is confirmed (that's required to sign in), so that
              part is always shown as done. Admin approval is a distinct,
              separate status shown alongside it, never conflated with it. */}
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:G.g7,fontWeight:600}}><Ic.check size={13} color={G.g6}/> Email confirmed</div>
            {me.status==="approved"
              ?<div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:G.g7,fontWeight:600}}><Ic.check size={13} color={G.g6}/> Profile approved by Admin</div>
              :me.status==="blocked"
              ?<div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:G.red,fontWeight:600}}><Ic.close size={13}/> Account suspended by Admin</div>
              :<div style={{background:G.goldL,border:`1px solid ${G.gold}`,borderRadius:G.r,padding:12,display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{color:"#92400e"}}><Ic.pending size={18}/></span>
                  <p style={{margin:0,fontSize:12,color:"#78350f"}}>Your profile is pending Admin approval. You can complete your profile and prepare products now — they'll become publicly visible once approved.</p>
                </div>}
          </div>
          <FarmerProfileSection me={me} onNotify={notify} onReload={reload}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(125px,1fr))",gap:11,marginBottom:22,marginTop:22}}>
            {[[mine.length,"Listings",Ic.listings,G.g6],[mine.reduce((s,p)=>s+(p.views||0),0),"Views",Ic.users,"#1d4ed8"],[(me.rating||0).toFixed(1),"Rating",Ic.star,"#d97706"],[mine.filter(p=>p.inStock).length,"In Stock",Ic.check,G.g6]].map(([v,l,IcC,ac])=>(
              <div key={l} style={{background:G.white,borderRadius:G.rL,padding:16,boxShadow:G.sh,textAlign:"center",border:`1px solid ${G.gray1}`}}>
                <div style={{marginBottom:4,color:ac,display:"flex",justifyContent:"center"}}><IcC size={22}/></div>
                <div style={{fontSize:22,fontWeight:900,color:ac,fontFamily:FH}}>{v}</div>
                <div style={{fontSize:11,color:G.gray5,fontWeight:600,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:9}}>
            <h2 style={{margin:0,fontSize:16,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.listings size={16} color={G.g6}/> My Listings</h2>
            <Btn icon={<Ic.add size={14}/>} onClick={()=>{setEditP(null);setShowForm(true)}}>Add Product</Btn>
          </div>
          {me.status!=="approved"&&
            <p style={{fontSize:12,color:G.gray5,marginTop:-8,marginBottom:14,display:"flex",alignItems:"center",gap:5}}><Ic.alert size={12}/> Your listings are saved but won't appear publicly until your profile is approved.</p>}
          {mine.length===0
            ?<div style={{textAlign:"center",padding:"40px",background:G.white,borderRadius:G.rL,border:`2px dashed ${G.gray3}`}}>
                <div style={{marginBottom:9,display:"flex",justifyContent:"center",color:G.gray3}}><Ic.listings size={38}/></div>
                <p style={{color:G.gray5,marginBottom:12}}>No listings yet.</p>
                <Btn onClick={()=>{setEditP(null);setShowForm(true)}} icon={<Ic.add size={14}/>}>Add Product</Btn>
              </div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
                {mine.map(p=>(
                  <PCard key={p.id} product={p} user={user}
                    onView={viewProduct}
                    onEdit={p=>{setEditP(p);setShowForm(true)}}
                    onDel={p=>setDelP(p)}
                    onFeat={()=>{}}/>
                ))}
              </div>}
        </div>
      </div>
    );
  };

  /* ── WHOLESALER PANEL ──
     Mirrors the Farmer dashboard above: own profile, own status,
     nothing from Admin. Picture upload happens here (post-registration,
     post-login) rather than during registration, reusing the same
     ImageUpload component/Cloudinary path the rest of the app already
     uses — no new upload system. */
  const renderWholesalerPanel=()=>{
    if(!user||user.role!=="wholesaler")return null;
    const me=wholesalers.find(w=>w.id===user.id)||user;
    return(
      <div style={{background:G.white,minHeight:"60vh"}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"28px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
            <div style={{width:34,height:34,borderRadius:9,overflow:"hidden",flexShrink:0,boxShadow:G.sh}}><Logo size={34} site={site}/></div>
            <span style={{fontSize:13,fontWeight:700,color:G.gray5,fontFamily:FB}}>Inkingi</span>
          </div>
          <div style={{background:`linear-gradient(135deg,${G.g8},${G.g6})`,borderRadius:20,padding:22,marginBottom:20,color:G.white}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{width:52,height:52,borderRadius:12,overflow:"hidden",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {me.image_url?<img src={me.image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Ic.marketplace size={22}/>}
              </div>
              <div>
                <h2 style={{margin:0,fontSize:18,fontFamily:FH}}>{me.company_name}</h2>
                <p style={{margin:"3px 0 0",opacity:.8,fontSize:12,display:"flex",alignItems:"center",gap:4}}><Ic.location size={12}/> {me.sector}, {me.district}</p>
              </div>
              <div style={{marginLeft:"auto"}}><Badge color={me.status==="approved"?"green":me.status==="blocked"?"red":"gold"}>{me.status==="approved"?<><Ic.check size={10}/> Verified</>:me.status==="blocked"?<><Ic.close size={10}/> Suspended</>:<><Ic.pending size={10}/> Pending</>}</Badge></div>
            </div>
          </div>
          {me.status!=="approved"&&(
            <div style={{background:G.goldL,border:`1px solid ${G.gold}`,borderRadius:G.r,padding:12,marginBottom:18,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{color:"#92400e"}}><Ic.pending size={18}/></span>
              <p style={{margin:0,fontSize:12,color:"#78350f"}}>Your account is under review. You'll be notified once approved.</p>
            </div>
          )}
          <div style={{background:G.white,border:`1px solid ${G.gray1}`,borderRadius:G.rL,padding:18,boxShadow:G.sh,marginBottom:16}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:800,color:G.gray9,fontFamily:FH,display:"flex",alignItems:"center",gap:6}}><Ic.camera size={15} color={G.g6}/> Company Picture</h3>
            <ImageUpload label="" value={me.image_url||""} onChange={async v=>{await WS.updateImage(me.id,v);await reload();notify("Picture updated!")}}/>
          </div>
          <div style={{background:G.white,border:`1px solid ${G.gray1}`,borderRadius:G.rL,padding:18,boxShadow:G.sh}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:800,color:G.gray9,fontFamily:FH}}>My Details</h3>
            <p style={{margin:"0 0 6px",fontSize:13,color:G.gray7,display:"flex",alignItems:"center",gap:6}}><Ic.contact size={13}/> {me.phone}</p>
            <p style={{margin:"0 0 6px",fontSize:13,color:G.gray7}}>{me.email}</p>
            {me.products_description&&<p style={{margin:"8px 0 0",fontSize:13,color:G.gray7,lineHeight:1.5}}>{me.products_description}</p>}
          </div>
        </div>
      </div>
    );
  };

  /* ── ADMIN ── */
  const renderAdmin=()=>{
    if(!user||user.role!=="admin"){
      return(
        <div style={{textAlign:"center",padding:80}}>
          <div style={{display:"flex",justifyContent:"center",color:G.gray3}}><ShieldCheck size={48}/></div>
          <h2 style={{color:G.gray9,fontFamily:FH}}>{t("admin_access_required")}</h2>
          <Btn onClick={()=>setShowLogin(true)} style={{marginTop:11}}>{t("nav_signin")}</Btn>
        </div>
      );
    }
    // Admin accounts now live in their own `admins` table (see AdminTbl).
    // The old admin row in `farmers` is being kept temporarily as a
    // manual-approval-required backup (per migration plan) rather than
    // deleted immediately — filtering it out here keeps it from showing
    // up in "All Farmers" / Pending Approvals without touching the
    // underlying data or any delete/status function.
    const allF=farmers.filter(f=>f.role!=="admin");const allP=products;
    const tabs=[["dashboard",t("admin_tab_dashboard"),Ic.dashboard],["farmers",t("admin_tab_farmers"),Ic.farmer],["products",t("admin_tab_products"),Ic.listings],["prices",t("admin_tab_prices"),Ic.prices],["tips",t("admin_tab_tips"),Ic.tips],["pests",t("admin_tab_pests"),Ic.pests],["calendar",t("admin_tab_calendar"),Ic.calendar],["carousel",t("admin_tab_slideshow"),Ic.image],["ads",t("admin_tab_ads"),Ic.notifications],["site",t("admin_tab_site"),Ic.edit]];
    return(
      <div style={{background:G.pageBg,minHeight:"60vh"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:38,height:38,borderRadius:10,overflow:"hidden",flexShrink:0,boxShadow:G.sh}}><Logo size={38} site={site}/></div>
              <h1 style={{margin:0,fontSize:22,fontWeight:800,fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:9}}><Ic.admin size={22} color={G.g6}/> {t("admin_panel")}</h1>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {HAS_SUPABASE&&syncOk&&<Badge color="green"><Ic.check size={10}/> {t("admin_db_connected")}</Badge>}
              {HAS_SUPABASE&&!syncOk&&<Badge color="red"><Ic.alert size={10}/> {t("admin_sync_issue")}</Badge>}
              {!HAS_SUPABASE&&<Badge color="gold">{t("admin_dev_mode")}</Badge>}
              {HAS_CLOUDINARY&&<Badge color="blue">Cloudinary</Badge>}
              {!HAS_CLOUDINARY&&<Badge color="gray">{t("admin_local_images")}</Badge>}
            </div>
          </div>
          <p style={{margin:"0 0 18px",color:G.gray5,fontSize:12}}>{t("admin_manage_platform")}</p>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",borderBottom:`1px solid ${G.gray1}`,paddingBottom:12}}>
            {tabs.map(([tab,label,TabIc])=>(
              <button key={tab} onClick={()=>setAdminTab(tab)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:G.r,border:"none",fontWeight:700,fontSize:11,cursor:"pointer",background:adminTab===tab?G.g6:G.gray1,color:adminTab===tab?G.white:G.gray7,transition:"all .2s",fontFamily:FB,whiteSpace:"nowrap"}}><TabIc size={13}/>{label}</button>
            ))}
          </div>

          {adminTab==="dashboard"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24}}>
                {[[allF.length,t("admin_total_farmers"),Ic.farmer,G.g6,()=>{setFarmerFilter("");setAdminTab("farmers")}],[allP.length,t("admin_listings"),Ic.listings,"#1d4ed8",()=>setAdminTab("products")],[allF.filter(f=>f.status==="pending").length+wholesalers.filter(w=>w.status==="pending").length,t("admin_pending"),Ic.pending,"#d97706",()=>{setFarmerFilter("pending");setAdminTab("farmers")}],[allP.reduce((s,p)=>s+(p.views||0),0),t("admin_total_views"),Ic.users,"#7c3aed",()=>setAdminTab("products")]].map(([v,l,IcC,col,onCardClick])=>(
                  <button key={l} onClick={onCardClick} style={{background:G.white,borderRadius:G.rL,padding:"17px 16px",boxShadow:G.sh,border:`1px solid ${G.gray1}`,borderTop:`3px solid ${col}`,textAlign:"left",cursor:"pointer",font:"inherit",width:"100%"}}>
                    <div style={{marginBottom:5,color:col}}><IcC size={22}/></div>
                    <div style={{fontSize:26,fontWeight:900,color:col,fontFamily:FH}}>{typeof v==="number"?v.toLocaleString():v}</div>
                    <div style={{fontSize:11,color:G.gray5,fontWeight:600,marginTop:2,display:"flex",alignItems:"center",gap:4}}>{l} <Ic.external size={10} style={{opacity:.5}}/></div>
                  </button>
                ))}
              </div>
              <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh,border:`1px solid ${G.gray1}`}}>
                <h3 style={{margin:"0 0 13px",fontFamily:FH,color:G.gray9,display:"flex",alignItems:"center",gap:7}}><Ic.pending size={16} color={G.g6}/> {t("admin_pending_approvals")}</h3>
                {(()=>{
                  // Same list as before (pending farmers), with pending
                  // wholesalers merged in — tagged by _kind so each row
                  // calls the right approve/block function below. This
                  // keeps the existing single Pending Approvals UI as the
                  // one place both farmer and wholesaler signups show up,
                  // instead of adding a separate tab/section.
                  const pendingF=allF.filter(f=>f.status==="pending").map(f=>({...f,_kind:"farmer"}));
                  const pendingW=wholesalers.filter(w=>w.status==="pending").map(w=>({...w,_kind:"wholesaler"}));
                  const pending=[...pendingF,...pendingW];
                  return pending.length===0
                    ?<div style={{textAlign:"center",padding:"28px",color:G.gray5}}>{t("admin_no_pending")}</div>
                    :pending.map(f=>(
                      <div key={f._kind+f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${G.gray1}`,flexWrap:"wrap",gap:9}}>
                        <div onClick={()=>{if(f._kind==="farmer")setDetailFarmer(f)}} style={{cursor:f._kind==="farmer"?"pointer":"default"}}>
                          <p style={{margin:0,fontWeight:700,fontSize:13,color:G.gray9}}>{f._kind==="wholesaler"?f.company_name:f.name}{f._kind==="wholesaler"&&<span style={{marginLeft:6,fontWeight:600,fontSize:10,color:G.gray5}}>(Wholesaler)</span>}</p>
                          <p style={{margin:"2px 0 0",fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><Ic.contact size={11}/> {f.phone} <span>·</span> <Ic.location size={11}/> {f.district}, {f.sector}</p>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <Btn size="sm" onClick={async()=>{const r=f._kind==="wholesaler"?await WS.setStatus(f.id,"approved"):await DB.setFarmerStatus(f.id,"approved");if(r.ok){await reload();notify((f._kind==="wholesaler"?f.company_name:f.name)+" "+t("msg_farmer_verified"))}else{notify(r.reason||"Could not update status","error")}}} icon={<Ic.check size={13}/>}>{t("admin_verify")}</Btn>
                          <Btn size="sm" variant="danger" onClick={async()=>{const r=f._kind==="wholesaler"?await WS.setStatus(f.id,"blocked"):await DB.setFarmerStatus(f.id,"blocked");if(r.ok){await reload()}else{notify(r.reason||"Could not update status","error")}}} icon={<Ic.close size={13}/>}>{t("admin_block")}</Btn>
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>
          )}

          {adminTab==="farmers"&&(()=>{
            const shown=farmerFilter==="pending"?allF.filter(f=>f.status==="pending"):allF;
            return(
            <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh,border:`1px solid ${G.gray1}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:15}}>
                <h3 style={{margin:0,fontFamily:FH,color:G.gray9}}>{farmerFilter==="pending"?`⏳ ${t("admin_pending_farmers")} (${shown.length})`:`${t("admin_all_farmers")} (${shown.length})`}</h3>
                {farmerFilter&&<Btn size="sm" variant="ghost" onClick={()=>setFarmerFilter("")} icon={<Ic.close size={13}/>}>{t("admin_clear_filter")}</Btn>}
              </div>
              {shown.length===0&&<div style={{textAlign:"center",padding:"28px",color:G.gray5}}>{t("admin_no_farmers_match")}</div>}
              {shown.map(f=>(
                <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.gray1}`,flexWrap:"wrap",gap:9}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <FarmerPhoto farmer={f} size={40} radius={10}/>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
                        <strong style={{fontSize:13,color:G.gray9}}>{f.name}</strong>
                        <Badge color={f.status==="approved"?"green":f.status==="blocked"?"red":"gold"}>{f.status==="approved"?<><Ic.check size={10}/> {t("admin_verified")}</>:f.status==="blocked"?<><Ic.close size={10}/> {t("admin_blocked")}</>:<><Ic.pending size={10}/> {t("admin_pending")}</>}</Badge>
                      </div>
                      <p style={{margin:0,fontSize:11,color:G.gray5,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><Ic.contact size={11}/> {f.phone} <span>·</span> <Ic.location size={11}/> {f.district} <span>· {allP.filter(p=>p.fid===f.id).length} {t("admin_listings_count")}</span></p>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <Btn size="sm" variant="secondary" onClick={()=>setPhotoFarmer(f)} icon={<Ic.camera size={13}/>}>{t("admin_photo")}</Btn>
                    {f.status!=="approved"&&<Btn size="sm" onClick={async()=>{const r=await DB.setFarmerStatus(f.id,"approved");if(r.ok){await reload();notify(t("msg_updated"))}else{notify(r.reason||"Could not update status","error")}}} icon={<Ic.check size={13}/>}>{t("admin_verify")}</Btn>}
                    {f.status!=="blocked"&&<Btn size="sm" variant="ghost" onClick={async()=>{const r=await DB.setFarmerStatus(f.id,"blocked");if(r.ok){await reload()}else{notify(r.reason||"Could not update status","error")}}} icon={<Ic.close size={13}/>}>{t("admin_block")}</Btn>}
                    <Btn size="sm" variant="danger" onClick={async()=>{if(window.confirm(t("admin_confirm_delete_farmer")))await DB.deleteFarmer(f.id);await reload();notify(t("msg_deleted"))}} icon={<Ic.delete size={14}/>}>{t("admin_delete")}</Btn>
                  </div>
                </div>
              ))}
            </div>
          );})()}

          {adminTab==="products"&&(
            <div style={{background:G.white,borderRadius:G.rL,padding:20,boxShadow:G.sh,border:`1px solid ${G.gray1}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:15}}>
                <h3 style={{margin:0,fontFamily:FH,color:G.gray9}}>{t("admin_all_listings")} ({allP.length})</h3>
                <Btn size="sm" icon={<Ic.add size={14}/>} onClick={()=>{setEditP(null);setShowForm(true)}}>{t("admin_add")}</Btn>
              </div>
              {allP.map(p=>(
                <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.gray1}`,flexWrap:"wrap",gap:9}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:46,height:38,borderRadius:7,overflow:"hidden",background:G.gray1,flexShrink:0}}>
                      <img src={p.img1||IMGS[p.sub]||(p.type==="crop"?IMGS.default_crop:IMGS.default_animal)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                    </div>
                    <div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:2}}><strong style={{fontSize:12,color:G.gray9}}>{p.name}</strong>{p.featured&&<Badge color="gold">⭐</Badge>}<Badge color={p.inStock?"green":"gray"}>{p.inStock?t("admin_in_stock"):t("admin_out")}</Badge></div>
                      <p style={{margin:"1px 0",fontSize:10,color:G.gray5,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>RWF {p.price?.toLocaleString()}/{p.unit} <span>·</span> <Ic.users size={10}/> {p.views} <span>· {p.fname}</span></p>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <Btn size="sm" variant="gold" onClick={async()=>{await DB.toggleFeatured(p.id);await reload()}} icon={<Ic.star size={13}/>}>{p.featured?t("admin_unfeature"):t("admin_feature")}</Btn>
                    <Btn size="sm" variant="secondary" onClick={()=>{setEditP(p);setShowForm(true)}} icon={<Ic.edit size={14}/>}>{t("admin_edit")}</Btn>
                    <Btn size="sm" variant="danger" onClick={()=>setDelP(p)} icon={<Ic.delete size={14}/>}>{t("admin_del")}</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab==="prices"&&<MarketPricesPage user={user} notify={notify}/>}
          {adminTab==="tips"&&<FarmingTipsPage user={user} notify={notify}/>}
          {adminTab==="pests"&&<PestsCenterPage user={user} notify={notify}/>}
          {adminTab==="calendar"&&<PlantingCalendarPage user={user} notify={notify}/>}
          {adminTab==="carousel"&&<CarouselManager notify={notify}/>}
          {adminTab==="ads"&&<AdManager notify={notify}/>}
          {adminTab==="site"&&<SiteSettingsManager notify={notify}/>}
        </div>
      </div>
    );
  };

  /* ── FARMER DETAIL MODAL ── */
  const FarmerDetailModal=({farmer,open,onClose})=>{
    if(!farmer)return null;
    const fp=approvedProds.filter(p=>p.fid===farmer.id);
    return(
      <Modal open={open} onClose={onClose} title={farmer.name} maxW={720}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16,flexWrap:"wrap"}}>
          <FarmerPhoto farmer={farmer} size={54} radius={13}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><strong style={{fontSize:16,fontFamily:FH,color:G.gray9}}>{farmer.name}</strong><Badge color="green"><Ic.check size={10}/> {t("admin_verified")}</Badge></div>
            <p style={{margin:"3px 0",fontSize:12,color:G.gray5,display:"flex",alignItems:"center",gap:5}}><Ic.location size={12}/> {farmer.village}, {farmer.sector}, {farmer.district}</p>
            <Stars value={farmer.rating||0} size={12}/> <span style={{fontSize:11,color:G.gray5}}>{(farmer.rating||0).toFixed(1)} ({farmer.rCount||0} {t("fdm_ratings")})</span>
            {farmer.bio&&<p style={{margin:"5px 0 0",fontSize:12,color:G.gray5}}>{farmer.bio}</p>}
          </div>
          <div style={{display:"flex",gap:7}}>
            <a href={"tel:"+farmer.phone} style={{display:"inline-flex",alignItems:"center",gap:4,background:G.g6,color:G.white,padding:"8px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12}}><Ic.contact size={13}/> {t("fdm_call")}</a>
            {farmer.whatsapp===true&&<a href={"https://wa.me/250"+farmer.phone.replace(/^0/,"")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"#25d366",color:G.white,padding:"8px 12px",borderRadius:G.r,textDecoration:"none",fontWeight:700,fontSize:12}}><Ic.whatsapp size={13}/> {t("prod_whatsapp")}</a>}
          </div>
        </div>
        <h3 style={{margin:"0 0 12px",fontFamily:FH,fontSize:14,color:G.gray9}}>{t("fdm_listings")} ({fp.length})</h3>
        {fp.length===0
          ?<p style={{color:G.gray5}}>{t("fdm_no_listings")}</p>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:12}}>
              {fp.map(p=>(
                <PCard key={p.id} product={p} user={null}
                  onView={prod=>{onClose();setTimeout(()=>viewProduct(prod),150)}}
                  onEdit={()=>{}} onDel={()=>{}} onFeat={()=>{}}/>
              ))}
            </div>}
      </Modal>
    );
  };

  /* ── LOADING SCREEN ── */
  if(loading){
    return(
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.g9,fontFamily:FB}}>
        <div style={{textAlign:"center",color:G.white}}>
          <div style={{marginBottom:14,display:"flex",justifyContent:"center"}}><Logo size={64} site={site}/></div>
          <p style={{fontSize:15,opacity:.8}}>{t("loading_text")}</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  return(
    <div style={{fontFamily:FB,background:G.pageBg,minHeight:"100vh",color:G.gray9}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#f7f9f7}
        input::placeholder{color:#9ca3af}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#a5d6a7;border-radius:3px}
        button{transition:filter 180ms ease,transform 180ms ease,background 180ms ease,color 180ms ease,border-color 180ms ease}
        button:hover:not(:disabled){filter:brightness(1.06);transform:scale(1.025)}
        button:active:not(:disabled){transform:scale(0.98)}
        nav button{position:relative;overflow:hidden}
        nav button::after{content:'';position:absolute;bottom:0;left:50%;right:50%;height:2px;background:rgba(255,255,255,.6);transition:left 220ms ease,right 220ms ease}
        nav button:hover::after{left:8%;right:8%}
        input,select,textarea{transition:border-color 180ms ease,box-shadow 180ms ease}
        input:hover:not(:focus),select:hover:not(:focus),textarea:hover:not(:focus){border-color:#66bb6a !important;box-shadow:0 0 0 3px rgba(46,125,50,.08)}
        a[href]{transition:filter 180ms ease,transform 180ms ease}
        a[href]:hover{filter:brightness(1.08);transform:scale(1.02)}
        tbody tr{transition:background 160ms ease}
        tbody tr:hover{background:#f0f7f0 !important}
        .ik-tile:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 18px rgba(0,0,0,.35)}
        .ik-tile:hover img{transform:scale(1.08)}
        .ik-tile:active{transform:scale(0.98)}
        .ik-card{transition:transform 260ms ease, box-shadow 260ms ease}
        .ik-card:hover{transform:translateY(-5px);box-shadow:0 14px 30px rgba(0,0,0,.14)}
        .ik-card:hover .ik-card-img{transform:scale(1.06)}
        .ik-card:active{transform:scale(0.985)}
        .ik-card-img{transition:transform 400ms ease}
        @keyframes ik-spin{to{transform:rotate(360deg)}}
        .ik-spinner{animation:ik-spin 700ms linear infinite}
        @media (max-width:760px){
          .ik-navbar-row{height:auto !important;flex-wrap:wrap !important;padding:8px 12px !important;row-gap:8px !important}
          .ik-navbar-search{order:3;flex:1 1 100% !important;max-width:none !important}
          .ik-navbar-items{order:4;flex:1 1 100% !important;margin-left:0 !important;justify-content:flex-start !important}
        }
      `}</style>

      <Toast msg={toast?.msg} type={toast?.type}/>

      {/* NAVBAR */}
      <nav style={{background:G.g8,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 14px rgba(0,0,0,.2)"}}>
        <div className="ik-navbar-row" style={{maxWidth:1200,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",height:58,gap:13}}>
          <div onClick={()=>nav("home")} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Logo size={30} site={site}/></div>
            <span style={{fontSize:16,fontWeight:900,color:G.white,fontFamily:FH}}>Inkingi</span>
          </div>
          <div ref={searchRef} className="ik-navbar-search" style={{position:"relative",flex:1,maxWidth:400}}>
            <div style={{display:"flex",background:"rgba(255,255,255,.11)",border:"1.5px solid rgba(255,255,255,.18)",borderRadius:99,overflow:"hidden"}}>
              <input value={searchQ} onChange={e=>handleSugInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Search products…" style={{flex:1,background:"none",border:"none",outline:"none",padding:"7px 13px",color:G.white,fontSize:12,fontFamily:FB}}/>
              <button onClick={()=>doSearch()} style={{background:"rgba(255,255,255,.14)",border:"none",color:G.white,padding:"7px 11px",cursor:"pointer",display:"flex",alignItems:"center"}}><Ic.search size={14}/></button>
            </div>
            {showSugg&&sugg.length>0&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:G.white,borderRadius:G.r,boxShadow:G.shXL,overflow:"hidden",zIndex:300}}>
                {sugg.map(s=>(
                  <div key={s} onClick={()=>{setSearchQ(s);doSearch(s)}} style={{padding:"9px 13px",cursor:"pointer",fontSize:12,color:G.gray7,borderBottom:`1px solid ${G.gray1}`,fontFamily:FB,transition:"background 150ms",display:"flex",alignItems:"center",gap:7}} onMouseEnter={e=>e.currentTarget.style.background=G.g0} onMouseLeave={e=>e.currentTarget.style.background=""}><Ic.search size={12} color={G.gray5}/> {s}</div>
                ))}
              </div>
            )}
          </div>
          <div className="ik-navbar-items" style={{display:"flex",alignItems:"center",gap:2,marginLeft:"auto",overflowX:"auto"}}>
            {navItems.map(n=>(
              <button key={n.k} onClick={()=>nav(n.k)} style={{display:"inline-flex",alignItems:"center",gap:5,background:page===n.k?"rgba(255,255,255,.16)":"none",color:G.white,border:"none",padding:"6px 9px",borderRadius:7,cursor:"pointer",fontWeight:page===n.k?700:500,fontSize:11,fontFamily:FB,whiteSpace:"nowrap",flexShrink:0}}>{n.ic&&<n.ic size={13}/>}{n.l}</button>
            ))}
            <select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language" style={{background:"rgba(255,255,255,.1)",color:G.white,border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 6px",fontSize:11,fontFamily:FB,cursor:"pointer",flexShrink:0,marginLeft:3}}>
              <option value="en" style={{color:"#000"}}>EN</option>
              <option value="rw" style={{color:"#000"}}>RW</option>
              <option value="fr" style={{color:"#000"}}>FR</option>
            </select>
            {user
              ?<button onClick={doLogout} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.1)",color:G.white,border:"1px solid rgba(255,255,255,.2)",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:FB,marginLeft:3,flexShrink:0}}><Ic.logout size={13}/> {t("nav_logout")}</button>
              :<>
                <button onClick={()=>setShowLogin(true)} style={{background:"rgba(255,255,255,.1)",color:G.white,border:"none",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:FB,flexShrink:0}}>{t("nav_signin")}</button>
                <button onClick={openRegChoice} style={{background:G.gold,color:G.white,border:"none",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:FB,marginLeft:3,flexShrink:0}}>{t("nav_register")}</button>
              </>}
          </div>
        </div>
      </nav>

      {/* PAGES */}
      <main>
        {page==="home"&&renderHome()}
        {page==="marketplace"&&renderMarketplace()}
        {page==="farmers"&&renderFarmers()}
        {page==="dashboard"&&renderDashboard()}
        {page==="wpanel"&&renderWholesalerPanel()}
        {page==="admin"&&renderAdmin()}
        {page==="prices"&&<MarketPricesPage user={user} notify={notify}/>}
        {page==="tips"&&<FarmingTipsPage user={user} notify={notify}/>}
        {page==="pests"&&<PestsCenterPage user={user} notify={notify}/>}
        {page==="calendar"&&<PlantingCalendarPage user={user} notify={notify}/>}
      </main>

      {/* AD BANNER CAROUSEL */}
      <AdBannerCarousel ads={ads} onSelectAd={setSelAd}/>

      {/* FOOTER — unchanged */}
      <footer style={{background:"#071a07",color:G.white,paddingTop:0,marginTop:0}}>
        <div style={{height:4,background:`linear-gradient(to right,${G.g6},${G.g3},${G.gold})`}}/>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"clamp(24px,4vw,56px)",marginBottom:40}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Logo size={36} site={site}/></div>
                <span style={{fontSize:22,fontWeight:900,fontFamily:FH,letterSpacing:"-0.3px"}}>Inkingi</span>
              </div>
              <p style={{color:"rgba(255,255,255,.65)",fontSize:12.5,lineHeight:1.8,marginBottom:18,maxWidth:380}}>{site.about}</p>
              <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:16,marginBottom:14}}>
                <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"#a5d6a7",letterSpacing:.6,textTransform:"uppercase"}}>{t("footer_our_vision")}</p>
                <p style={{margin:"0 0 14px",color:"rgba(255,255,255,.6)",fontSize:12,lineHeight:1.7}}>{site.vision}</p>
                <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"#a5d6a7",letterSpacing:.6,textTransform:"uppercase"}}>{t("footer_our_mission")}</p>
                <p style={{margin:0,color:"rgba(255,255,255,.6)",fontSize:12,lineHeight:1.7}}>{site.mission}</p>
              </div>
            </div>
            <div>
              <h4 style={{margin:"0 0 18px",color:"#a5d6a7",fontSize:11,fontWeight:700,letterSpacing:.7,textTransform:"uppercase"}}>{t("footer_quick_links")}</h4>
              {(site.quickLinks||[]).map(l=>{
                const k=QUICK_LINK_MAP[l];
                return(
                  <div key={l} onClick={()=>k&&nav(k)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.06)",cursor:k?"pointer":"default",transition:"color 200ms,padding-left 200ms",color:"rgba(255,255,255,.65)",fontSize:12.5,fontWeight:500}}
                    onMouseEnter={e=>{e.currentTarget.style.color=G.g3;e.currentTarget.style.paddingLeft="6px"}}
                    onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.65)";e.currentTarget.style.paddingLeft="0"}}>
                    <span style={{fontSize:8,color:G.g3,flexShrink:0}}>▶</span>{l}
                  </div>
                );
              })}
            </div>
            <div>
              <h4 style={{margin:"0 0 18px",color:"#a5d6a7",fontSize:11,fontWeight:700,letterSpacing:.7,textTransform:"uppercase"}}>{t("footer_contact_support")}</h4>
              {[[Ic.location,site.address],[Ic.contact,site.phone],[Ic.hours,site.hours]].map(([IcC,val],idx)=>(
                <div key={idx} style={{display:"flex",gap:10,marginBottom:16,alignItems:"flex-start"}}>
                  <div style={{width:32,height:32,background:"rgba(255,255,255,.07)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#a5d6a7"}}><IcC size={15}/></div>
                  <div style={{color:"rgba(255,255,255,.7)",fontSize:12.5,lineHeight:1.6,paddingTop:6}}>{val}</div>
                </div>
              ))}
              <div style={{marginTop:10}}>
                <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"#a5d6a7",letterSpacing:.6,textTransform:"uppercase"}}>{t("footer_email")}</p>
                <a href="mailto:info@inkingi.rw" style={{color:"rgba(255,255,255,.6)",fontSize:12.5,textDecoration:"none",transition:"color 200ms"}} onMouseEnter={e=>e.target.style.color=G.g3} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.6)"}>info@inkingi.rw</a>
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,.08)",padding:"16px 0 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <p style={{margin:0,color:"rgba(255,255,255,.3)",fontSize:11}}>© {new Date().getFullYear()} Inkingi. {t("footer_rights")}</p>
            <div style={{display:"flex",gap:16}}>
              {[[t("footer_privacy"),"privacy"],[t("footer_terms"),"terms"],[t("footer_support"),"support"]].map(([x,k])=>(
                <span key={x} onClick={()=>setLegalOpen(k)} style={{color:"rgba(255,255,255,.3)",fontSize:11,cursor:"pointer",transition:"color 200ms"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.7)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.3)"}>{x}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <LoginModal open={showLogin} onClose={()=>setShowLogin(false)} onLogin={doLogin} onGoReg={openRegChoice} onResetPassword={DB.resetPassword}/>
      <RoleChoiceModal open={showRoleChoice} onClose={()=>setShowRoleChoice(false)} onChoose={chooseRegRole} site={site}/>
      <RegModal open={showReg&&regRole!=="business"} onClose={()=>setShowReg(false)} onRegister={doRegister} site={site} role={regRole}/>
      <BusinessRegModal open={showReg&&regRole==="business"} onClose={()=>setShowReg(false)} onRegister={doRegister} site={site}/>
      <TermsModal open={legalOpen==="terms"} onClose={()=>setLegalOpen("")}/>
      <PrivacyModal open={legalOpen==="privacy"} onClose={()=>setLegalOpen("")}/>
      <SupportModal open={legalOpen==="support"} onClose={()=>setLegalOpen("")} site={site}/>
      <ProductDetailModal product={selProd} farmers={farmers} open={!!selProd} onClose={()=>setSelProd(null)} onReload={reload}/>
      <FarmerDetailModal farmer={selFarmer} open={!!selFarmer} onClose={()=>setSelFarmer(null)}/>
      <AdDetailModal ad={selAd} open={!!selAd} onClose={()=>setSelAd(null)}/>

      <Modal open={showForm} onClose={()=>{setShowForm(false);setEditP(null)}} title={editP?"Edit Listing":"List Product"} maxW={620}>
        {(user?.role==="farmer"||user?.role==="admin")&&(
          <PForm initial={editP} farmer={user?.role==="admin"&&editP?{id:editP.fid,name:editP.fname,phone:editP.fphone}:user}
            onSave={async d=>{if(editP){await DB.updateProduct(editP.id,d);notify("Updated!")}else{await DB.addProduct(d);notify("Listed!")}await reload();setShowForm(false);setEditP(null)}}
            onCancel={()=>{setShowForm(false);setEditP(null)}}/>
        )}
      </Modal>

      <Modal open={!!delP} onClose={()=>setDelP(null)} title="Confirm Delete" maxW={380}>
        <p style={{color:G.gray7,marginBottom:6}}>Delete this listing?</p>
        <p style={{fontWeight:700,color:G.red,marginBottom:18}}>"{delP?.name}"</p>
        <div style={{display:"flex",gap:9}}>
          <Btn variant="danger" full onClick={async()=>{await DB.deleteProduct(delP.id);await reload();setDelP(null);notify("Deleted")}}>Delete</Btn>
          <Btn variant="secondary" full onClick={()=>setDelP(null)}>Cancel</Btn>
        </div>
      </Modal>

      <Modal open={!!photoFarmer} onClose={()=>setPhotoFarmer(null)} title={(photoFarmer?.name||"")+" — Profile Photo"} maxW={420}>
        {photoFarmer&&(
          <ImageUpload label="Profile Photo" value={photoFarmer.photoUrl||""} onChange={async v=>{await DB.updateFarmer(photoFarmer.id,{photoUrl:v});await reload();setPhotoFarmer(f=>f?{...f,photoUrl:v}:f);notify("Photo updated!")}}/>
        )}
        <Btn full variant="secondary" onClick={()=>setPhotoFarmer(null)}>Done</Btn>
      </Modal>

      <Modal open={!!detailFarmer} onClose={()=>setDetailFarmer(null)} title="Farmer Details" maxW={520}>
        {detailFarmer&&(()=>{
          const d=farmers.find(x=>x.id===detailFarmer.id)||detailFarmer; // always show the freshest copy
          const np=v=>(v===undefined||v===null||v==="")?<span style={{color:G.gray4,fontStyle:"italic"}}>Not provided</span>:v;
          const dp=products.filter(p=>p.fid===d.id);
          const row=(label,val)=>(
            <div style={{display:"flex",justifyContent:"space-between",gap:10,padding:"7px 0",borderBottom:`1px solid ${G.gray1}`,fontSize:13}}>
              <span style={{color:G.gray5,fontWeight:600}}>{label}</span>
              <span style={{color:G.gray9,textAlign:"right"}}>{np(val)}</span>
            </div>
          );
          return(<>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
              <FarmerPhoto farmer={d} size={56} radius={13}/>
              <div>
                <p style={{margin:0,fontWeight:800,fontSize:16,color:G.gray9,fontFamily:FH}}>{d.name}</p>
                <Badge color={d.status==="approved"?"green":d.status==="blocked"?"red":"gold"}>{d.status==="approved"?<><Ic.check size={10}/> Approved</>:d.status==="blocked"?<><Ic.close size={10}/> Blocked</>:<><Ic.pending size={10}/> Pending</>}</Badge>
              </div>
            </div>
            <div style={{background:G.g0,borderRadius:G.r,padding:"4px 12px",marginBottom:14}}>
              {row("Email",d.email)}
              {row("Phone",d.phone)}
              {row("WhatsApp",d.whatsapp===true?"Yes":d.whatsapp===false?"No":undefined)}
              {row("Farming type",d.fType==="aborozi"?"Aborozi — Livestock":d.fType==="abahinzi"?"Abahinzi — Crops":undefined)}
              {row("District",d.district)}
              {row("Sector",d.sector)}
              {row("Village",d.village)}
              {row("Bio",d.bio)}
              {row("Registered",d.createdAt?new Date(d.createdAt).toLocaleDateString():undefined)}
            </div>
            <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:G.gray5,textTransform:"uppercase",letterSpacing:.3}}>Products ({dp.length})</p>
            {dp.length===0
              ?<p style={{fontSize:12,color:G.gray5,marginBottom:14}}>No products added yet.</p>
              :<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14,maxHeight:160,overflowY:"auto"}}>
                  {dp.map(p=>(<div key={p.id} style={{fontSize:12,color:G.gray7,padding:"6px 10px",background:G.gray1,borderRadius:8}}>{p.name}</div>))}
                </div>}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {d.status!=="approved"&&<Btn size="sm" onClick={async()=>{const r=await DB.setFarmerStatus(d.id,"approved");if(r.ok){await reload();notify(t("msg_updated"));setDetailFarmer(null)}else notify(r.reason||"Could not update status","error")}} icon={<Ic.check size={13}/>}>Verify / Approve</Btn>}
              {d.status!=="pending"&&<Btn size="sm" variant="secondary" onClick={async()=>{const r=await DB.setFarmerStatus(d.id,"pending");if(r.ok){await reload();notify(t("msg_updated"))}else notify(r.reason||"Could not update status","error")}}>Keep Pending</Btn>}
              <Btn size="sm" variant="ghost" onClick={()=>setDetailFarmer(null)}>Close</Btn>
            </div>
          </>);
        })()}
      </Modal>
    </div>
  );
}

// Thin wrapper so every component in the tree can call useLang() — the
// actual app (state, pages, all existing logic) is unchanged, just now
// rendered inside the language context instead of being the default
// export directly.
export default function App(){
  return <LangProvider><AppInner/></LangProvider>;
}