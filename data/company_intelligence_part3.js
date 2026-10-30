// Part 3 of Deep Corporate Intelligence: Completing 100% Coverage Across All 204 Portfolio Companies
(function () {
  if (!window.COMPANY_INTELLIGENCE) window.COMPANY_INTELLIGENCE = { byRank: {}, tours: {} };
  const extra3 = {
    51: {
      ticker: "KAR.ST", exchange: "Nasdaq Stockholm", founded: 1867, employees: "1,300+",
      keyFilials: ["Karnov Group Sweden (JUNO Legal Platform)", "Karnov Group Denmark (Copenhagen)", "Aranzadi LA LEY (Spain)", "Lamy Liaisons (France)", "DIBkunnskap (Norway)"],
      productionProfile: "Mission-critical legal, tax and accounting intelligence databases across Sweden, Denmark, Norway, France, Spain and Portugal."
    },
    55: {
      ticker: "AKTIA.HE", exchange: "Nasdaq Helsinki", founded: 1826, employees: "850+",
      keyFilials: ["Aktia Bank", "Aktia Fund Management", "Aktia Life Insurance (Vaasa & Helsinki)"],
      productionProfile: "Finland's oldest deposit bank (founded 1826), operating wealth management and banking hubs in Helsinki, Vaasa, Turku, Tampere and Oulu."
    },
    57: {
      ticker: "SPKS.CO", exchange: "Nasdaq Copenhagen", founded: 1825, employees: "600+",
      keyFilials: ["Sparekassen Sjælland (Zealand)", "Sparekassen Fyn (Odense & Funen)", "35+ Regional Bank Branches"],
      productionProfile: "Regional savings bank headquartered on Holbæk fjord serving Zealand, Funen and Greater Copenhagen."
    },
    75: {
      ticker: "EMIL-B.ST", exchange: "Nasdaq Stockholm", founded: 2018, employees: "35+",
      keyFilials: ["160+ Light-Industrial, Warehouse & Commercial Properties in Vetlanda, Växjö, Jönköping,Värnamo, Linköping & Norrköping"],
      productionProfile: "900,000+ m² of industrial, manufacturing and logistics real estate in Småland, Östergötland and Halland."
    },
    76: {
      ticker: "AMAST.ST", exchange: "Nasdaq First North / Sveafastigheter", founded: 2012, employees: "85+",
      keyFilials: ["Residential & Community Property Clusters across Mid- & Southern Sweden"],
      productionProfile: "Manages and develops sustainable rental housing and municipal properties across Swedish growth cities."
    },
    85: {
      ticker: "NIVI-B.ST", exchange: "Nasdaq Stockholm", founded: 2000, employees: "65+",
      keyFilials: ["150+ Commercial, Logistics & Residential Properties in Värnamo, Jönköping, Växjö, Halmstad & Varberg"],
      productionProfile: "Owns industrial warehouses and logistics hubs along the E4/R40 Western Småland industrial belt."
    },
    86: {
      ticker: "GRK.HE", exchange: "Nasdaq Helsinki", founded: 1983, employees: "1,100+",
      keyFilials: ["GRK Suomi Oy (Highway, Bridge & Railway Track Construction)", "GRK Sverige AB (Luleå & Stockholm Green Industrial Infrastructure)", "GRK Eesti AS (Rail Baltica & Estonian Electrification)"],
      productionProfile: "Operates heavy railway track-laying machines, bridge construction yards, asphalt plants and circular biochar/environmental remediation works."
    },
    89: {
      ticker: "UIE.CO", exchange: "Nasdaq Copenhagen", founded: 1922, employees: "Holding (17,000+ in associates)",
      keyFilials: ["United Plantations Berhad (~48% — RSPO Certified Sustainable Palm & Coconut Estates & Refineries)", "Schouw & Co (~7% stake)"],
      productionProfile: "Agro-industrial investment company with certified sustainable plantations, biogas capture plants and edible oil refineries."
    },
    93: {
      ticker: "PARB.OL", exchange: "Oslo Børs", founded: 2007, employees: "65+",
      keyFilials: ["Pareto Bank Real Estate & Residential Development Finance", "Pareto Bank Ship & Offshore Rig Financing", "Pareto Bank Corporate M&A Lending"],
      productionProfile: "High-efficiency single-branch commercial bank at Dronning Mauds gate 3 in Vika, Oslo."
    },
    98: {
      ticker: "TFBANK.ST / AVARDA", exchange: "Nasdaq Stockholm Group", founded: 2015, employees: "200+",
      keyFilials: ["Avarda Checkout (Sweden, Finland, Norway, Denmark, Baltics)", "TF Bank E-Commerce Solutions (Borås & Stockholm)"],
      productionProfile: "Powers white-label buy-now-pay-later and checkout infrastructure for major Nordic online retailers."
    },
    102: {
      ticker: "PLSV.OL", exchange: "Oslo Børs", founded: 2013, employees: "1,500+",
      keyFilials: ["Seagems (6 Multipurpose Subsea Pipe-Laying Support Vessels PLSVs in Brazil)", "Fontis Energy (5 High-Spec Jack-Up Drilling Rigs)", "Seabras Sapura (50% JV)"],
      productionProfile: "Operates 6 high-tension deepwater pipe-laying vessels for Petrobras and 5 offshore jack-up drilling rigs."
    },
    103: {
      ticker: "ABG.OL", exchange: "Oslo Børs", founded: 1984, employees: "330+",
      keyFilials: ["ABGSC Oslo HQ (VIA Vika)", "ABGSC Stockholm", "ABGSC Copenhagen", "ABGSC Frankfurt, London & New York", "ABG Private Banking", " Kameo Real Estate Crowdfunding"],
      productionProfile: "Nordic corporate finance, equity research, M&A and brokerage desks across 6 financial capitals."
    },
    107: {
      ticker: "COOR.ST", exchange: "Nasdaq Stockholm", founded: 1998, employees: "11,000+",
      keyFilials: ["Coor Sverige", "Coor Norge (Lysaker — Equinor Offshore Platform & Office Catering/FM)", "Coor Danmark (Herlev)", "Coor Finland"],
      productionProfile: "Manages technical property maintenance, workplace services, staff restaurants and offshore platform catering across the Nordics."
    },
    110: {
      ticker: "ANOD-B.ST", exchange: "Nasdaq Stockholm", founded: 2003, employees: "2,700+",
      keyFilials: ["Symetri (Autodesk Platinum Partner & BIM/CAD Software across Europe & USA)", "Technia (Dassault Systèmes PLM Engineering Partner)", "Sokigo & Icebound (Municipal GIS & Forest Software)", "Decerno"],
      productionProfile: "20+ engineering software and digital twin subsidiaries serving 800,000+ engineers and architects worldwide."
    },
    112: {
      ticker: "VIMIAN.ST", exchange: "Nasdaq Stockholm", founded: 2020, employees: "1,100+",
      keyFilials: ["Movora (Veterinary Orthopedic Implants & TPLO Plates — Zurich, Boston, Sheffield)", "Nextmune (Veterinary Allergy Diagnostics & Immunotherapy — Stockholm, Lelystad, Madrid)", "Indical Bioscience (Leipzig Veterinary PCR Diagnostics)", "VetFamily (5,000+ Member Veterinary Clinics)"],
      productionProfile: "Manufactures titanium veterinary orthopedic implants, allergy immunotherapy vaccines and molecular diagnostic test kits."
    },
    113: {
      ticker: "ACAST.ST", exchange: "Nasdaq Stockholm", founded: 2014, employees: "350+",
      keyFilials: ["Acast Marketplace", "Podchaser (Podcast Intelligence Database)", "Pippa Hosting Platform"],
      productionProfile: "Delivers 1+ billion podcast listens per quarter across 100,000+ shows from Stockholm, London, New York, Paris and Sydney."
    },
    116: {
      ticker: "KVIKA.IC", exchange: "Nasdaq Iceland", founded: 1999, employees: "400+",
      keyFilials: ["Kvika Banki", "TM Tryggingar hf. (Major Icelandic Non-Life Insurer)", "Kvika Asset Management", "Lykill Leasing", "Aur & Netgíró Fintech Apps", "Ortaca (UK Lending)"],
      productionProfile: "Operates commercial/investment banking, TM Insurance and Iceland's most popular mobile payment app Aur."
    },
    121: {
      ticker: "MMGR-B.ST", exchange: "Nasdaq Stockholm", founded: 2016, employees: "900+",
      keyFilials: ["Momentum Industrial (30+ Swedish Industrial Bearing, Seal & Transmission Service Workshops)", "Rörick Elektriska Verkstad (Köping)", "Mekano", "SWEDOL / Alligo Spinoff Heritage", "25+ Niche Flow & Power Tech Subsidiaries"],
      productionProfile: "30+ local industrial maintenance workshops, electromechanical motor repair shops and flow-control valve companies across the Nordics."
    },
    124: {
      ticker: "SMOP.OL", exchange: "Oslo Børs", founded: 2006, employees: "110+",
      keyFilials: ["Smartoptics Oslo HQ", "Smartoptics Kista R&D & Optical Engineering Lab (Stockholm)", "Smartoptics US & UK"],
      productionProfile: "Develops open line systems, 100G/400G/800G ZR/ZR+ coherent optical transceivers and passive DWDM multiplexers for metro and data-center fiber networks."
    },
    125: {
      ticker: "APR.OL", exchange: "Oslo Børs", founded: 2004, employees: "180+",
      keyFilials: ["Appear Lilleaker HQ & Hardware/FPGA Lab (Oslo)", "X Platform Modular Ultra-Low-Latency Video Contribution Chassis"],
      productionProfile: "Designs and assembles ultra-dense live broadcast encoders/decoders in Oslo used by the Premier League, NFL, Olympics and global telcos."
    },
    126: {
      ticker: "KARNEL-B.ST", exchange: "Nasdaq Stockholm", founded: 2016, employees: "700+",
      keyFilials: ["15+ Niche Nordic Manufacturing & Product Companies across Sweden and Finland (circuit boards, transformers, excavation tools, cleanwater valves)"],
      productionProfile: "Industrial technology owner of specialized small-to-medium Nordic factories and B2B engineering firms."
    },
    128: {
      ticker: "BWE.OL", exchange: "Oslo Børs", founded: 2016, employees: "500+",
      keyFilials: ["Dussafu Marine Permit & BW Adolo FPSO + Hibiscus Alpha Rig (Gabon)", "Golfinho & Maromba Offshore Fields (Brazil)", "Kudu Gas Field (Namibia)"],
      productionProfile: "Produces ~30,000–40,000 bopd offshore Gabon and Brazil using converted FPSOs and repurposed jack-up production platforms."
    },
    129: {
      ticker: "AXA.OL", exchange: "Oslo Børs", founded: 2015, employees: "1,100+",
      keyFilials: ["Axactor Norway (Oslo & Røyken)", "Axactor Sweden (Gothenburg)", "Axactor Finland", "Axactor Germany (Heidelberg)", "Axactor Spain (Madrid & Valladolid)", "Axactor Italy"],
      productionProfile: "Manages EUR 10B+ in non-performing loan (NPL) portfolios and third-party debt collection across 6 European countries."
    },
    132: {
      ticker: "OTL.OL", exchange: "Oslo Børs", founded: 1973, employees: "1,100+",
      keyFilials: ["Odfjell Technology Kokstad HQ (Bergen)", "CCB Ågotnes Subsea & Rental Base", "Tananger Stavanger Tubular Running Base", "Aberdeen, Dubai, Kuala Lumpur & Perth Operations Bases"],
      productionProfile: "Provides casing/tubular running services, drilling tool rentals and wellbore cleanup across 25+ countries."
    },
    134: {
      ticker: "SENTIA / HENT", exchange: "Nordic Construction Group", founded: 1980, employees: "1,400+",
      keyFilials: ["HENT AS (Trondheim & Oslo)", "Vestlandsentreprenøren", "SSEA Group & Kiruna/Stockholm Projects"],
      productionProfile: "Turnkey contractor behind Norway's largest hospitals, university campuses, airport terminals and industrial plants."
    },
    135: {
      ticker: "MULTI.OL", exchange: "Oslo Børs", founded: 1908, employees: "3,600+",
      keyFilials: ["Multiconsult Norge (30+ offices from Kristiansand to Tromsø & Svalbard)", "LINK Arkitektur (500+ architects in Norway, Sweden & Denmark)", "Iterio AB (Stockholm Geotech & Infrastructure)", "A-lab Architects (Oslo)"],
      productionProfile: "Operates geotechnical drilling rigs, marine seabed survey vessels and 40+ engineering & architecture offices across Scandinavia."
    },
    136: {
      ticker: "EAST.ST", exchange: "Nasdaq Stockholm", founded: 2007, employees: "30+",
      keyFilials: ["Warsaw Unit & Skyliner Office Towers (Poland)", "Nowy Rynek (Poznan)", "3Bures & Uptown Park (Vilnius, Lithuania)", "Pinehurst (Riga, Latvia)"],
      productionProfile: "Owns EUR 900M+ of A-grade sustainable office towers in Warsaw, Poznan, Vilnius and Riga."
    },
    138: {
      ticker: "BHG.ST", exchange: "Nasdaq Stockholm", founded: 2012, employees: "1,800+",
      keyFilials: ["Bygghemma.se / Bygghemma.no", "Trademax, Chilli & Furniturebox (Helsingborg Showrooms & Warehouses)", "Nordic Nest & Svenssons i Lammhult (Kalmar AutoStore Warehouse)", "LampGallerian & Badshop"],
      productionProfile: "Over 100 online home-improvement and Scandi-design destinations plus 70+ physical showrooms and large logistics hubs in Kalmar and Helsingborg."
    },
    140: {
      ticker: "TRIFOR.CO", exchange: "Nasdaq Copenhagen", founded: 1996, employees: "1,200+",
      keyFilials: ["Trifork Smart Enterprise, Cyber Protection & Digital Health", "Trifork Labs (Venture investments in 25+ deep-tech startups)", "GOTO® Developer Conferences", "Nine A/S (Danish e-Government IT)"],
      productionProfile: "70+ autonomous software engineering units across Denmark, Switzerland, Netherlands, UK, USA and Spain."
    },
    142: {
      ticker: "REJL-B.ST", exchange: "Nasdaq Stockholm", founded: 1942, employees: "3,300+",
      keyFilials: ["Rejlers Sverige (70+ offices)", "Rejlers Finland (Espoo, Tampere, Oulu, Turku)", "Rejlers Norge & Embriq (Oslo, Kristiansand, Bergen)", "Rejlers Abu Dhabi (Middle East Energy Engineering)"],
      productionProfile: "80+ engineering offices designing high-voltage power grids, hydrogen/biorefineries, railways and defence facilities."
    },
    143: {
      ticker: "FSECURE.HE", exchange: "Nasdaq Helsinki", founded: 1988, employees: "500+",
      keyFilials: ["F-Secure Total Consumer Security", "200+ Global Telecom & Retail Banking Embedded Security Partners"],
      productionProfile: "Protects 30+ million consumers globally through telco-embedded scam, VPN and identity protection software developed in Helsinki and Oulu."
    },
    144: {
      ticker: "EPEN.ST", exchange: "Nasdaq Stockholm", founded: 1981, employees: "900+",
      keyFilials: ["Westermo Network Technologies (Stora Sundby Factory — Rugged Train & Power Grid Ethernet)", "Beijer Electronics (Malmö & Taipei — Marine & Industrial HMI Touch Panels)"],
      productionProfile: "Manufactures rugged onboard railway switches in Stora Sundby (Sweden), substation routers in Dublin/Zurich, and marine HMI panels in Malmö & Taiwan."
    },
    146: {
      ticker: "REG1V.HE", exchange: "Nasdaq Helsinki", founded: 2001, employees: "220+",
      keyFilials: ["iCare Finland Oy (Vantaa — Rebound Tonometers for Glaucoma Screening)", "iCare / CenterVue SpA (Padua, Italy — Confocal Fundus Cameras)", "Oculo Clinical Eye Care Platform"],
      productionProfile: "Assembles patented handheld rebound tonometers in Vantaa, Finland and automated retinal imaging systems in Padua, Italy."
    },
    149: {
      ticker: "MOBA.OL", exchange: "Oslo Børs", founded: 2014, employees: "75+",
      keyFilials: ["Morrow Bank Norway, Sweden & Finland Digital Lending & Credit Cards"],
      productionProfile: "Cloud-based Nordic consumer finance bank headquartered in Lysaker."
    },
    150: {
      ticker: "YUBICO.ST", exchange: "Nasdaq Stockholm", founded: 2007, employees: "450+",
      keyFilials: ["YubiKey® 5 Series & YubiKey Bio Hardware Security Keys", "Stockholm & Santa Clara (California) Dual HQ", "Automated Cryptographic Key Manufacturing in Sweden & USA"],
      productionProfile: "Every YubiKey is manufactured and cryptographically programmed strictly in Sweden and the USA, protecting 80% of the world's largest tech companies."
    },
    152: {
      ticker: "ENITY", exchange: "Nordic Financial Holding", founded: 2020, employees: "120+",
      keyFilials: ["Nordic Financial & Credit Operations (Stockholm)"],
      productionProfile: "Stockholm-headquartered financial services group."
    },
    154: {
      ticker: "LT1V.HE", exchange: "Nasdaq Helsinki", founded: 1905, employees: "8,000+",
      keyFilials: ["L&T Environmental Services (Kerava, Turku, Tampere, Oulu Recycling Plants)", "L&T Industrial Services (Hazardous Waste & Process Cleaning)", "L&T Facility Services Finland & Sweden", "Suomen Ekokumppanit"],
      productionProfile: "Operates a fleet of 1,000+ waste collection/vacuum trucks and 30+ recycling, composting and SRF fuel plants across Finland."
    },
    155: {
      ticker: "REITIR.IC", exchange: "Nasdaq Iceland", founded: 2009, employees: "65+",
      keyFilials: ["Kringlan Shopping Mall (Reykjavík — 150+ stores)", "Hótel Borg & Hilton Reykjavík Nordica Buildings", "Laugavegur Historic Downtown Retail Portfolio", "Holtagarðar Commercial Hub"],
      productionProfile: "Iceland's largest commercial property portfolio (~450,000 m² across 130+ properties in the Capital Region)."
    },
    156: {
      ticker: "BOHUS", exchange: "Norwegian Retail Group", founded: 1976, employees: "1,100+",
      keyFilials: ["60+ Bohus Furniture & Interior Megastores across Norway", "Bohus Logistikk AS Central Warehouse (Fetsund / Lillestrøm)"],
      productionProfile: "Norway's largest furniture chain by revenue, operating 60+ stores and a central distribution mega-hub in Lillestrøm."
    },
    157: {
      ticker: "AKBM.OL", exchange: "Oslo Børs", founded: 2006, employees: "500+",
      keyFilials: ["Antarctic Krill Harvesting Fleet (Antarctic Endurance, Saga Sea, Antarctic Sea)", "Aker BioMarine Montevideo Logistics Hub", "Ski Marine Protein & Innovation Plant (Norway)", "QRILL™ Aqua & Superba Krill®"],
      productionProfile: "Operates 3 specialized Antarctic krill-harvesting factory vessels with Eco-Harvesting® technology plus processing plants in Ski (Norway) and Houston."
    },
    159: {
      ticker: "PACT.ST", exchange: "Nasdaq Stockholm", founded: 1994, employees: "1,200+",
      keyFilials: ["Proact Cloud & Sovereign Data Centers (Sweden, Norway, Germany, UK, Netherlands, Czechia)", "Proact Security (24/7 SOC)", "Conoa Container/Kubernetes Specialists"],
      productionProfile: "Operates sovereign European private/hybrid cloud data centers and enterprise storage infrastructure across 12 countries."
    },
    160: {
      ticker: "TRUE-B.ST", exchange: "Nasdaq Stockholm", founded: 2009, employees: "400+",
      keyFilials: ["Truecaller Stockholm HQ & Engineering", "Truecaller Bengaluru, Mumbai & Gurugram Hubs (India)", "Truecaller for Business Verified Identity"],
      productionProfile: "AI caller ID and anti-fraud communication platform serving 420+ million active users globally."
    },
    161: {
      ticker: "KCC.OL", exchange: "Oslo Børs", founded: 2018, employees: "450+ (incl. crew)",
      keyFilials: ["8 CABU (Caustic Soda / Bulk) Combination Vessels", "8 CLEANBU (Clean Petroleum Products / Dry Bulk) Combination Vessels", "3 Third-GenerationCABU III Newbuilds"],
      productionProfile: "Operates 16+ specialized combination vessels carrying wet tanker cargo one way and dry bulk (alumina, coal, grain, iron ore) on the return voyage, cutting CO2 by 30–40%."
    },
    164: {
      ticker: "CYNCA", exchange: "Nordic Industrial Holding", founded: 2018, employees: "150+",
      keyFilials: ["Cynca Nordic Industrial Operations (Stockholm)"],
      productionProfile: "Stockholm-headquartered industrial services and engineering group."
    },
    166: {
      ticker: "BTS-B.ST", exchange: "Nasdaq Stockholm", founded: 1986, employees: "1,150+",
      keyFilials: ["BTS Stockholm HQ", "BTS North America (New York, San Francisco, Austin, Chicago)", "BTS Europe, Asia & LatAm (35+ global offices)", "BTS Coach & Wonderway AI Sales Coaching"],
      productionProfile: "Develops custom business simulation software and executive strategy transformation programs across 35+ global offices."
    },
    167: {
      ticker: "SF.ST", exchange: "Nasdaq Stockholm", founded: 2010, employees: "1,250+",
      keyFilials: ["20+ Game Studios: Bytro Labs (Hamburg), Goodgame Studios (Hamburg), Jawaker (Abu Dhabi), Nanobit (Zagreb), Dorado Games (Malta), Sandbox Interactive (Berlin), Super Free Games (California)"],
      productionProfile: "Operates 20+ mobile and browser game studios generating ~70+ live-ops games."
    },
    168: {
      ticker: "GUBRA.CO", exchange: "Nasdaq Copenhagen", founded: 2008, employees: "240+",
      keyFilials: ["Gubra Hørsholm Preclinical CRO & Peptide Drug Discovery Laboratories", "GUB-amy (Amylin Agonist Obesity Program)", "Strexliner™ 3D Whole-Organ Light-Sheet Imaging"],
      productionProfile: "Automated in-vivo metabolic/obesity research laboratories, 3D brain imaging and AI peptide chemistry at Hørsholm, Denmark."
    },
    169: {
      ticker: "OET.OL", exchange: "Oslo Børs / NYSE", founded: 2018, employees: "400+ (incl. seafarers)",
      keyFilials: ["8 Eco-Design VLCC Supertankers (2M barrel capacity each)", "6 Eco-Design Suezmax Crude Tankers (1M barrel capacity each)"],
      productionProfile: "Operates 14 young, scrubber-fitted crude oil supertankers (VLCC & Suezmax) managed between Oslo and Piraeus."
    },
    171: {
      ticker: "JOMA.ST", exchange: "Nasdaq Stockholm", founded: 1944, employees: "70+",
      keyFilials: ["Larsberg & Käppala Residential Districts (Lidingö)", "Rotebro (Sollentuna)", "Slagsta Strand (Botkyrka)", "Nacka & Bromma Properties"],
      productionProfile: "Owns and manages 4,300+ rental apartments and commercial premises across Greater Stockholm."
    },
    172: {
      ticker: "HEIMAR.IC", exchange: "Nasdaq Iceland", founded: 2009, employees: "45+",
      keyFilials: ["Smáralind Shopping Mall (Kópavogur — 62,000 m²)", "Hafnartorg Downtown Reykjavík Harbour Quarter", "Egilshöll Sports & Cinema Arena", "Bíldshöfði & Borgartún Commercial Properties"],
      productionProfile: "Owns 110+ commercial properties totaling ~375,000 m² in Reykjavík and Kópavogur."
    },
    174: {
      ticker: "GOFORE.HE", exchange: "Nasdaq Helsinki", founded: 2001, employees: "1,450+",
      keyFilials: ["Gofore Tampere HQ & Helsinki Hub", "eMundo GmbH (Munich & Vienna Rail/Mobility Software)", "Creanord (Network Performance Telemetry)", "19 Offices across Finland, Germany, Austria, Spain & Estonia"],
      productionProfile: "Builds digital society platforms and autonomous industrial machine control software (e.g., for Ponsse, Sandvik & Valmet)."
    },
    175: {
      ticker: "TAALA.HE", exchange: "Nasdaq Helsinki", founded: 2007, employees: "130+",
      keyFilials: ["Taaleri SolarWind I, II & III Funds (100+ Wind, Solar & Battery Projects across Nordics, Baltics, Poland, Spain & Texas)", "Taaleri Bioindustry Fund (Torrefied Biochar Plant in Joensuu!)", "Garantia Insurance Company Ltd"],
      productionProfile: "Manages EUR 2.6B+ in renewable energy wind/solar farms, industrial bioindustry plants (Joensuu biocoal) and Garantia credit insurance."
    },
    176: {
      ticker: "NORDTECH", exchange: "Swedish Software Group", founded: 2020, employees: "500+",
      keyFilials: ["20+ Nordic B2B Vertical SaaS Subsidiaries across Sweden, Norway, Denmark & Finland"],
      productionProfile: "Long-term compounder acquiring mission-critical vertical software companies across Scandinavia."
    },
    177: {
      ticker: "MGN.OL", exchange: "Oslo Børs", founded: 2001, employees: "40+",
      keyFilials: ["Helios Nordic Energy (Solar PV & BESS Portfolio)", "Scotwind N3 Offshore Floating Wind Lease (Scotland)", "Hafslund Magnora Sol AS (Norwegian Solar JV)", "Magnora South Africa (1,000+ MW Solar/Wind/Battery Pipeline)", "Kustvind Offshore Wind (Sweden)"],
      productionProfile: "Develops utility-scale solar parks, battery energy storage systems (BESS) and offshore wind projects totaling 9+ GW across Europe and South Africa."
    },
    180: {
      ticker: "OMASP.HE", exchange: "Nasdaq Helsinki", founded: 2009, employees: "450+",
      keyFilials: ["45+ Oma Säästöpankki Branches across Seinäjoki, Lappeenranta, Tampere, Turku, Jyväskylä, Oulu & Helsinki"],
      productionProfile: "Finland's largest independent savings bank with roots dating back to 1875."
    },
    181: {
      ticker: "SAVOX", exchange: "Finnish Defense & Comms Group", founded: 1982, employees: "300+",
      keyFilials: ["Savox Espoo HQ & R&D", "Savox IMP Armored Vehicle Intercom Systems", "Savox TRICS® Tactical Radio Control", "Savox Con-Space Confined Space Rescue Comms (Vancouver)"],
      productionProfile: "Supplies NATO/Nordic armed forces (including Patria 6x6 & CV90 armored vehicles) and firefighters with rugged tactical intercoms and skull-mic headsets."
    },
    182: {
      ticker: "BETCO.ST", exchange: "Nasdaq Stockholm / Copenhagen", founded: 2004, employees: "1,500+",
      keyFilials: ["HLTV.org (Aarhus — World's #1 Counter-Strike Esports Portal)", "FUTBIN (EA FC / FIFA Community)", "Action Network & VegasInsider (New York)", "Playmaker Capital (Toronto & LatAm)", "SvenskaFans.com"],
      productionProfile: "Global sports media network reaching 400+ million monthly visits from 20+ offices in Copenhagen, Aarhus, Niš (Serbia), Stockholm, New York and Rio."
    },
    184: {
      ticker: "ORES.ST", exchange: "Nasdaq Stockholm", founded: 1956, employees: "10+ (HQ)",
      keyFilials: ["Core Listed Portfolio: Bilia (Nordic car dealership & service workshops), Scandi Standard (Kronfågel poultry), Ovzon (Satellites), Bahnhof (Nuclear-bunker data centers!), Securitas, Ericsson, Stenhus Fastigheter"],
      productionProfile: "Active Stockholm investment company with major stakes in Bilia, Scandi Standard, Ovzon, Bahnhof and Stenhus Fastigheter."
    },
    186: {
      ticker: "MTHH.CO", exchange: "Nasdaq Copenhagen", founded: 1918, employees: "2,900+",
      keyFilials: ["MT Højgaard Danmark (Civil Engineering, Bridges, Tunnels, Harbours & Data Centers)", "Enemærke & Petersen (Social Housing Renovation & Wood Modular Building)", "MT Højgaard Greenland & North Atlantic (Nuuk Airport!)", "NEMEAN"],
      productionProfile: "Built the Great Belt Bridge, Øresund Bridge, Nuuk International Airport and major Nordic data centers and military bases."
    },
    187: {
      ticker: "HERMA.OL", exchange: "Oslo Børs", founded: 2024, employees: "15+",
      keyFilials: ["Magnora Data Center / Hermana Holding ASA (Oslo)", "30% FPSO Design Licensing Royalty Stream (Western Isles & Shell Penguins Cylinder FPSOs)"],
      productionProfile: "Combines greenfield AI/hyperscale data center site development in the Nordics with Sevan cylinder-FPSO licensing royalties."
    },
    188: {
      ticker: "OLGERDIN.IC / BERA", exchange: "Nasdaq Iceland", founded: 1913, employees: "440+",
      keyFilials: ["Ölgerðin Egill Skallagrímsson Brewery & Beverage Plant (Fossháls, Reykjavík)", "Borg Brugghús Craft Brewery", "Eimverk / Icelandic Spirits", "Danól Food & FMCG Distribution"],
      productionProfile: "Iceland's oldest brewery and beverage plant in Reykjavík producing Gull beer, Appelsín, Malt, Brennivín and Kristall volcanic sparkling water."
    },
    189: {
      ticker: "HUMBLE.ST", exchange: "Nasdaq Stockholm", founded: 2014, employees: "1,100+",
      keyFilials: ["Grahns Konfektyr (Skövde Candy Factory)", "Humble Co. (Eco Oral Care)", "True Gum (Copenhagen Plastic-Free Chewing Gum Factory!)", "Pändy Protein Candy", "Body Science Sports Nutrition (Gothenburg)", "Naty Eco Diapers", "Solent Global (UK)"],
      productionProfile: "Operates 10+ in-house food, confectionery, chewing-gum, sports nutrition and personal-care factories in Sweden, Denmark, UK and Australia."
    },
    190: {
      ticker: "LIME.ST", exchange: "Nasdaq Stockholm", founded: 1990, employees: "450+",
      keyFilials: ["Lime CRM & Lime Go (Lund, Stockholm, Gothenburg, Oslo, Copenhagen, Helsinki, Utrecht, Cologne)", "Lime Connect (Userlike Customer Messaging)", "Lime Sportadmin"],
      productionProfile: "Develops vertical CRM and field-service software for Nordic energy utilities, district heating companies and real estate owners."
    },
    194: {
      ticker: "BRUTON", exchange: "Oslo Maritime & Energy Investment", founded: 2023, employees: "15+",
      keyFilials: ["Oslo Maritime, Drilling & Tanker Asset Holdings (Vika, Oslo)"],
      productionProfile: "Oslo-based maritime and offshore asset owner."
    },
    196: {
      ticker: "PEN.OL", exchange: "Oslo Børs", founded: 2007, employees: "110+",
      keyFilials: ["Dussafu Marin Permit (17.5% interest alongside BW Energy — Gabon)", "Ceiba Field & Okume Complex (Equatorial Guinea)", "TPS Assets & Sfax Offshore Permit (Tunisia)"],
      productionProfile: "Produces ~12,000–14,000 bopd net working interest across offshore Gabon, Equatorial Guinea and onshore/offshore Tunisia."
    },
    197: {
      ticker: "KNOW.ST", exchange: "Nasdaq Stockholm", founded: 1990, employees: "4,000+",
      keyFilials: ["Knowit Solutions", "Knowit Experience", "Knowit Connectivity (Embedded Automotive & Telecom)", "Knowit Insight & Defense Cyber Consultancy"],
      productionProfile: "35+ digital engineering and defense/cybersecurity offices across Sweden, Norway, Denmark, Finland, Germany and Poland."
    },
    198: {
      ticker: "ICP1V.HE", exchange: "Nasdaq Helsinki", founded: 1985, employees: "2,200+",
      keyFilials: ["Incap Kuressaare Factory (Saaremaa, Estonia)", "Incap Tumkur Factories 1, 2 & 3 (Karnataka, India)", "Incap Newcastle-under-Lyme (UK)", "Incap Námestovo (Slovakia)", "Incap Penn (Pennsylvania, USA)"],
      productionProfile: "7 electronics manufacturing services (EMS) factories across Estonia, India, UK, Slovakia and the USA."
    },
    199: {
      ticker: "NORION.ST", exchange: "Nasdaq Stockholm", founded: 1999, employees: "380+",
      keyFilials: ["Norion Corporate & Real Estate Banking (Gothenburg & Stockholm)", "Walley (Nordic E-Commerce Checkout)", "Collector Retail Savings & Loans"],
      productionProfile: "Specialist corporate and real estate financing bank headquartered at Lilla Bommen in Gothenburg."
    },
    200: {
      ticker: "SEDANA.ST", exchange: "Nasdaq Stockholm", founded: 2005, employees: "90+",
      keyFilials: ["Sedaconda® ACD (Anaesthetic Conserving Device)", "Sedaconda® (isoflurane) Inhaled ICU Sedation Drug"],
      productionProfile: "Supplies intensive care units across 40+ countries with volatile-anaesthetic inhaled sedation devices."
    },
    201: {
      ticker: "INTRUM.ST", exchange: "Nasdaq Stockholm", founded: 1923, employees: "9,500+",
      keyFilials: ["Intrum Servicing & Investing across 20 European Markets (Sweden, Norway, Finland, Denmark, Spain, Italy, UK, France, Germany, Greece, Poland)"],
      productionProfile: "Europe's largest credit management and debt servicing network with operations in 20 countries."
    },
    202: {
      ticker: "CAT-B.ST", exchange: "Nasdaq Stockholm", founded: 1987, employees: "500+",
      keyFilials: ["Catella Investment Management (EUR 15B+ European Residential & Logistics Property Funds — Berlin, Munich, Paris, Madrid)", "Catella Principal Investments", "Catella Corporate Finance"],
      productionProfile: "Manages EUR 15B+ of European residential, logistics and office real estate assets across 12 countries."
    },
    203: {
      ticker: "CBRAIN.CO", exchange: "Nasdaq Copenhagen", founded: 2002, employees: "220+",
      keyFilials: ["cBrain F2® Digital Public Administration Platform", "cBrain Climate Software for Environmental Permitting"],
      productionProfile: "Powers paperless ministerial work across the majority of Danish government ministries plus agencies in Germany, UK, USA, UAE and Guyana."
    },
    204: {
      ticker: "SALIX", exchange: "Nordic Industrial Trading Group", founded: 2021, employees: "650+",
      keyFilials: ["Habo Gruppen (Door handles, locks & architectural fittings — Habo)", "Teno & Lomond (Agricultural crop-baler stretch film & industrial packaging)", "Sävehyllan", "15+ Nordic Hardware & Fitting Subsidiaries"],
      productionProfile: "Spun out of Volati; supplies hardware stores, agriculture and industry across Scandinavia with fittings, fasteners and stretch packaging."
    }
  };

  Object.assign(window.COMPANY_INTELLIGENCE.byRank, extra3);
})();
