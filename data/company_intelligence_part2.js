// Part 2 of Deep Corporate Intelligence: Tickers, Subsidiary Trees (Filials) & Industrial Profiles for All Remaining Portfolio Companies
(function () {
  if (!window.COMPANY_INTELLIGENCE) window.COMPANY_INTELLIGENCE = { byRank: {}, tours: {} };
  const extra = {
    2: {
      ticker: "SAVE.ST", exchange: "Nasdaq Stockholm", founded: 1996, employees: "900+",
      keyFilials: ["Nordnet Bank AB (Stockholm)", "Nordnet Norge (Oslo)", "Nordnet Danmark (Copenhagen)", "Nordnet Finland (Helsinki)", "Nordnet Livsforsikring", "Shareville Social Investing Network"],
      productionProfile: "Pan-Nordic cloud brokerage and pension platform with country headquarters in Stockholm, Oslo, Copenhagen and Helsinki serving 2M+ Nordic savers."
    },
    4: {
      ticker: "AZA.ST", exchange: "Nasdaq Stockholm", founded: 1999, employees: "700+",
      keyFilials: ["Avanza Bank AB", "Försäkringsaktiebolaget Avanza Pension", "Avanza Fonder AB", "Placera Media Stockholm"],
      productionProfile: "Sweden's largest retail stockbroker and digital pension platform operating from Regeringsgatan in Stockholm."
    },
    10: {
      ticker: "OEM-B.ST", exchange: "Nasdaq Stockholm", founded: 1974, employees: "1,050+",
      keyFilials: ["OEM Automatic (Tranås, Drammen, Turku, Pärnu, Warsaw, Leicester)", "OEM Motor (Tranås)", "Telfa AB (Gothenburg)", "Internordic Bearings (Nässjö)", "Svenska Batteripoolen", "Agolux"],
      productionProfile: "35+ operating technology trading subsidiaries and central logistics warehouses across 15 European countries."
    },
    11: {
      ticker: "MANTA.HE", exchange: "Nasdaq Helsinki", founded: 2001, employees: "650+",
      keyFilials: ["Mandatum Asset Management", "Mandatum Life Insurance", "Mandatum Incentives"],
      productionProfile: "Spun off from Sampo Group in 2023; manages EUR 12B+ in client assets from Bulevardi 56 in Helsinki plus regional offices across Finland."
    },
    12: {
      ticker: "CAMX.ST", exchange: "Nasdaq Stockholm", founded: 1991, employees: "250+",
      keyFilials: ["Camurus Ideon Science Park R&D Labs (Lund)", "Camurus Inc. (US Commercial)", "Rechon Life Science Fill-Finish Partner (Malmö)"],
      productionProfile: "Develops and commercializes Buvidal® / Brixadi® and Oclaiz™ extended-release FluidCrystal® depot injections."
    },
    14: {
      ticker: "ASKER.ST", exchange: "Nasdaq Stockholm", founded: 2011, employees: "4,000+",
      keyFilials: ["OneMed Sverige (Gothenburg)", "Bosman (Netherlands)", "DiaMed (Switzerland)", "abena / Santex", "45+ European healthcare distributors & manufacturers"],
      productionProfile: "Pan-European medical supplies and healthcare equipment group operating 45+ subsidiaries and automated hospital logistics warehouses."
    },
    17: {
      ticker: "ATT.ST", exchange: "Nasdaq Stockholm", founded: 1985, employees: "35,000+",
      keyFilials: ["Attendo Sverige", "Attendo Suomi / Finland (400+ care units)", "Attendo Danmark"],
      productionProfile: "Operates 700+ nursing homes, assisted living facilities and LSS care residences across Sweden, Finland and Denmark."
    },
    18: {
      ticker: "AMBEA.ST", exchange: "Nasdaq Stockholm", founded: 1996, employees: "31,000+",
      keyFilials: ["Vardaga (Swedish Elderly Care — 100+ nursing homes)", "Nytida (Disability & Psychosocial Care — 400+ units)", "Stendi AS (Norway's largest care provider)", "Altiden (Denmark)", "Klara (Mobile Nursing Teams)"],
      productionProfile: "Operates ~950 care homes and residential units across Sweden, Norway and Denmark."
    },
    19: {
      ticker: "ALMB.CO", exchange: "Nasdaq Copenhagen", founded: 1792, employees: "2,300+",
      keyFilials: ["Alm. Brand Forsikring", "Codan Forsikring A/S (Acquired 2022)", "Privatsikring", "Erhvervssikring"],
      productionProfile: "Denmark's second-largest non-life insurance group, headquartered at Midtermolen in Copenhagen with major claims hubs in Odense, Aarhus and Køge."
    },
    21: {
      ticker: "ADDL-B.ST", exchange: "Nasdaq Stockholm", founded: 2016, employees: "2,300+",
      keyFilials: ["Triolab (Gothenburg, Oslo, Copenhagen, Turku)", "Bergman Diagnostika (Lillestrøm)", "Mediplast (Malmö)", "BioNordika", "Vision Healthcare", "Healthcare 21 (Ireland/UK)"],
      productionProfile: "80+ specialized Labtech and Medtech operating companies across 30 European countries."
    },
    22: {
      ticker: "ISB.IC", exchange: "Nasdaq Iceland", founded: 1875, employees: "750+",
      keyFilials: ["Íslandsbanki Smárinn HQ (Kópavogur)", "Íslandsbanki Seafood & Geothermal Corporate Finance", "Íslandssjóðir Fund Management", "Ergo Equipment Financing"],
      productionProfile: "Nationwide Icelandic commercial bank financing fisheries, geothermal energy, real estate and SMEs."
    },
    23: {
      ticker: "TIETO.HE", exchange: "Nasdaq Helsinki / Oslo / Stockholm", founded: 1968, employees: "23,000+",
      keyFilials: ["Tietoevry Tech Services", "Tietoevry Banking (Fornebu — Core Banking & Card Issuing)", "Tietoevry Care (Nordic Hospital EHR Systems)", "Tietoevry Create", "Tietoevry Industry (Pulp/Paper & Energy IT)"],
      productionProfile: "Nordic sovereign cloud data centers and software engineering campuses in Espoo, Fornebu, Solna, Tampere, Oulu, Bergen and Trondheim."
    },
    24: {
      ticker: "ARION.IC", exchange: "Nasdaq Iceland / Stockholm", founded: 1930, employees: "800+",
      keyFilials: ["Arion Banki Borgartún HQ", "Vörður Tryggingar hf. (Insurance)", "Stefnir hf. (Iceland's largest fund manager)", "Valitor / Rapyd Partner Network"],
      productionProfile: "Integrated bancassurance and investment banking group operating across Iceland."
    },
    26: {
      ticker: "EKTA-B.ST", exchange: "Nasdaq Stockholm", founded: 1972, employees: "4,700+",
      keyFilials: ["Elekta Unity MR-Linac & Linear Accelerators (Crawley, UK)", "Leksell Gamma Knife® (Stockholm)", "Elekta Brachytherapy (Veenendaal, Netherlands)", "Elekta Oncology Software (Stockholm, Oulu, St. Louis)"],
      productionProfile: "Manufactures linear accelerators, Gamma Knife radiosurgery systems and brachytherapy equipment installed in 7,000+ cancer hospitals worldwide."
    },
    27: {
      ticker: "ROKO-B.ST", exchange: "Nasdaq Stockholm", founded: 2019, employees: "1,500+",
      keyFilials: ["28+ perpetual-ownership niche European B2B and manufacturing subsidiaries across Sweden, Denmark, Norway, Finland, UK & Netherlands"],
      productionProfile: "Decentralized serial acquirer owning high-margin niche industrial manufacturers and B2B product companies."
    },
    28: {
      ticker: "HOFI.ST", exchange: "Nasdaq Stockholm", founded: 1994, employees: "1,400+",
      keyFilials: ["HoistSpar Deposit Platform", "Hoist Finance UK, Germany, Poland, Italy, France & Spain Servicing Centers"],
      productionProfile: "Regulated Swedish credit market company managing SEK 25B+ in consumer and SME loan portfolios across 13 European countries."
    },
    30: {
      ticker: "HMS.ST", exchange: "Nasdaq Stockholm", founded: 1988, employees: "1,200+",
      keyFilials: ["Anybus® Factory Automation (Halmstad)", "Ewon® Remote Industrial Access (Nivelles, Belgium)", "Ixxat® Automotive/Safety (Ravensburg, Germany)", "Intesis® Building Automation (Igualada, Spain)", "Red Lion Controls (York, Pennsylvania)"],
      productionProfile: "Main electronics assembly and R&D center in Halmstad, Sweden plus engineering/manufacturing sites in Germany, Belgium, Spain and USA."
    },
    31: {
      ticker: "AMBU-B.CO", exchange: "Nasdaq Copenhagen", founded: 1937, employees: "4,500+",
      keyFilials: ["Ambu Ballerup Innovation & Endoscopy HQ", "Ambu Augsburg Endoscope R&D (Germany)", "Ambu Penang Mega-Factory (Malaysia)", "Ambu Juarez Factory (Mexico)", "Ambu Xiamen Factory (China)"],
      productionProfile: "World's largest producer of single-use flexible endoscopes (aScope™) and resuscitation bags (Ambu® Bag)."
    },
    32: {
      ticker: "MCOV-B.ST", exchange: "Nasdaq Stockholm", founded: 1995, employees: "45,000+",
      keyFilials: ["Medicover Hospitals & Clinics (Poland, Romania, India)", "Synevo Medical Diagnostic Laboratories (150+ clinical labs & 1,000+ blood drawing points)"],
      productionProfile: "Operates 40+ inpatient hospitals, 300+ outpatient medical clinics, 150+ diagnostic laboratories and 130+ fertility/dental/gym centers."
    },
    35: {
      ticker: "KINV-B.ST", exchange: "Nasdaq Stockholm", founded: 1936, employees: "40+ (HQ)",
      keyFilials: ["Core Growth Portfolio: Spring Health, TravelPerk, Pleo, Cityblock Health, Mews, Recursion, Enveda, Stegra (H2 Green Steel in Boden!)"],
      productionProfile: "Historic Stenbeck-founded investment company backing digital healthcare, B2B software and green steel (Stegra Boden)."
    },
    36: {
      ticker: "BIOA-B.ST", exchange: "Nasdaq Stockholm", founded: 2003, employees: "110+",
      keyFilials: ["Leqembi® (lecanemab) Alzheimer's Antibody (partnered with Eisai/Biogen)", "BrainTransporter™ Blood-Brain Barrier Technology Platform", "Exidavnemab Parkinson's Program"],
      productionProfile: "Neurobiology antibody discovery and bioprocess development laboratories on Kungsholmen, Stockholm."
    },
    37: {
      ticker: "STOR-B.ST", exchange: "Nasdaq Stockholm", founded: 2012, employees: "11,500+",
      keyFilials: ["130+ business units across Industry (Automation, Product Solutions, Industrial Technology), Trade and Services"],
      productionProfile: "Diversified international industrial group operating 130+ SME factories, distributors and technical contractors."
    },
    38: {
      ticker: "SDIP-B.ST", exchange: "Nasdaq Stockholm", founded: 2004, employees: "2,200+",
      keyFilials: ["40+ technical infrastructure subsidiaries: Rolec EV Charging, Auger Underground Infrastructure, Alerter Group, Frigotech, GAH Transport Refrigeration, KSS"],
      productionProfile: "Manufactures and services critical urban infrastructure, water treatment, power distribution, transport refrigeration and safety equipment."
    },
    41: {
      ticker: "BITTI.HE", exchange: "Nasdaq Helsinki", founded: 1985, employees: "550+",
      keyFilials: ["Bittium Defense & Security (Tough SDR™ Tactical Radios & TAC WIN)", "Bittium Medical Technologies (Faros™ ECG & BrainStatus™ EEG)", "Bittium Connectivity Engineering (Oulu, Kajaani, Tampere, Espoo)"],
      productionProfile: "Designs and manufactures NATO-compatible tactical software-defined radios, Tough Mobile™ secure smartphones and medical biosignal sensors in Finland."
    },
    42: {
      ticker: "BIOG-B.ST", exchange: "Nasdaq Stockholm", founded: 1990, employees: "210+",
      keyFilials: ["BioGaia Production AB (Eslöv Fermentation & Drops Packaging Plant)", "MetaboGen AB (Gothenburg Microbiome Research)", "CapAble AB (Innovative Delivery Systems)"],
      productionProfile: "Produces L. reuteri probiotic drops, tablets and oral rehydration products in Eslöv, distributed in 100+ countries."
    },
    43: {
      ticker: "BEIA-B.ST", exchange: "Nasdaq Stockholm", founded: 1983, employees: "2,700+",
      keyFilials: ["Lesjöfors AB (45+ spring, wire & strip stamping factories across Europe, US & Asia)", "Beijer Tech AB (25+ Nordic industrial manufacturing & fluid/surface tech companies)"],
      productionProfile: "Operates 60+ manufacturing and industrial workshops led by Lesjöfors (founded 1675) and Beijer Tech."
    },
    44: {
      ticker: "NOBA.ST", exchange: "Private / Pre-IPO Holding", founded: 2003, employees: "650+",
      keyFilials: ["Nordax Bank (Stockholm)", "Bank Norwegian (Fornebu, Norway)", "Svensk Hypotekspension (Equity Release Mortgages)", "Bank Norwegian Visa & Savings"],
      productionProfile: "Pan-Nordic specialist bank serving 2M+ customers across Sweden, Norway, Finland, Denmark, Germany and Spain."
    },
    45: {
      ticker: "HAGA.IC", exchange: "Nasdaq Iceland", founded: 1998, employees: "2,500+",
      keyFilials: ["Bónus (33 discount supermarkets across Iceland)", "Hagkaup (Department & hypermarket stores)", "Olís (Fuel stations & marine bunkering)", "Aðföng & Bananar (Central cold-chain warehouses)", "Stórkaup", "Eldum rétt"],
      productionProfile: "Iceland's largest grocery and fuel supply chain infrastructure with nationwide stores, tank terminals and Reykjavík mega-warehouses."
    },
    46: {
      ticker: "BURE.ST", exchange: "Nasdaq Stockholm", founded: 1992, employees: "20+ (HQ)",
      keyFilials: ["Core Industrial & Medtech Holdings: Mycronic (Täby photomask laser writers!), Vitrolife (Gothenburg), Xvivo Perfusion (Gothenburg), Yubico (Stockholm), Allgon (Radio remote controls), Cavotec (Automated port shore power & MoorMaster)"],
      productionProfile: "Anchor industrial owner behind Sweden's premier deep-tech hardware exporters (Mycronic, Yubico, Vitrolife, Xvivo, Allgon)."
    },
    47: {
      ticker: "CLA-B.ST", exchange: "Nasdaq Stockholm", founded: 1862, employees: "2,600+",
      keyFilials: ["Cloetta Ljungsbro Chocolate Factory (Kexchoklad, Plopp, Center, Polly)", "Cloetta Levice Factory (Slovakia)", "Cloetta Sneek & Roosendaal (Netherlands — Läkerol, Red Band)", "CandyKing® Pick & Mix Network"],
      productionProfile: "7 confectionery factories in Europe producing Kexchoklad, Läkerol, Malaco, Ahlgrens bilar, Tupla and CandyKing."
    },
    48: {
      ticker: "RAY-B.ST", exchange: "Nasdaq Stockholm", founded: 2000, employees: "400+",
      keyFilials: ["RayStation® Treatment Planning System", "RayCare® Oncology Information System", "RayIntelligence® Cloud Analytics"],
      productionProfile: "Spun out of Karolinska Institutet; software used by 1,000+ proton, carbon-ion and photon radiation therapy centers globally."
    },
    49: {
      ticker: "AFRY.ST", exchange: "Nasdaq Stockholm", founded: 1895, employees: "19,000+",
      keyFilials: ["AFRY Infrastructure", "AFRY Industrial & Digital Solutions", "AFRY Process Industries (Pöyry Forest/Paper/Mining)", "AFRY Energy (Hydro, Nuclear, Grid)", "AFRY Management Consulting"],
      productionProfile: "Engineering offices in 40+ countries designing pulp mills, mines, hydropower dams, nuclear plants, road/rail tunnels and automotive factories."
    },
    50: {
      ticker: "BONEX.ST", exchange: "Nasdaq Stockholm", founded: 1999, employees: "130+",
      keyFilials: ["CERAMENT® Bone Void Filler", "CERAMENT® G (Gentamicin Antibiotic-Eluting)", "CERAMENT® V (Vancomycin-Eluting)"],
      productionProfile: "Develops synthetic injectable radiopaque bio-ceramic bone grafts at Ideon Science Park in Lund."
    },
    52: {
      ticker: "RVRC.ST", exchange: "Nasdaq Stockholm", founded: 2014, employees: "140+",
      keyFilials: ["RevolutionRace Outdoor Apparel (Borås Design & Tech Hub)", "German, Nordic & Alpine D2C E-Commerce Fulfillment Network"],
      productionProfile: "Headquartered in Sweden's textile hub Borås, shipping outdoor trousers, jackets and boots to 40+ countries."
    },
    53: {
      ticker: "FESTI.IC", exchange: "Nasdaq Iceland", founded: 2018, employees: "2,100+",
      keyFilials: ["Krónan (26 grocery stores across Iceland)", "N1 (95+ fuel & EV charging stations + marine fuel depots)", "ELKO (Electronics megastores)", "Lyfja (45+ pharmacies across Iceland)", "Bakkinn Logistics Warehouse"],
      productionProfile: "Nationwide Icelandic grocery, pharmacy, electronics and marine/aviation energy infrastructure."
    },
    54: {
      ticker: "HTRO.ST", exchange: "Nasdaq Stockholm", founded: 1993, employees: "1,900+",
      keyFilials: ["Hexatronic Cables & Interconnect (Hudiksvall Submarine & Terrestrial Fiber Factory)", "Blue Diamond Industries (US Duct Plants)", "Rochester Cable (Subsea Harsh-Environment Cables)", "Star2Star / Data Center Connectivity"],
      productionProfile: "18 fiber-optic cable, microduct and subsea umbilical manufacturing plants across Sweden, USA, UK, Germany, Austria and New Zealand."
    },
    56: {
      ticker: "CHEMM.CO", exchange: "Nasdaq Copenhagen", founded: 1997, employees: "170+",
      keyFilials: ["ChemoMetec Allerød Instrument & Disposables Factory", "NucleoCounter® Automated Cell Counters (NC-200, NC-202, XcytoMatic)"],
      productionProfile: "Vertically integrated manufacturing in Allerød, Denmark producing automated fluorescence cell counters and Via1/Via2-Cassette™ consumables."
    },
    58: {
      ticker: "NOLA-B.ST", exchange: "Nasdaq Stockholm", founded: 1938, employees: "5,900+",
      keyFilials: ["Nolato Medical (Hörby, Lomma, Torekov, Switzerland, UK, US)", "Nolato Engineered Solutions (Grevie, Kristianstad, Sunne, Hungary, Malaysia)"],
      productionProfile: "30+ cleanroom medical polymer and industrial silicone/TPE injection-moulding plants across Europe, North America and Asia."
    },
    59: {
      ticker: "LIAB.ST", exchange: "Nasdaq Stockholm", founded: 1959, employees: "5,000+",
      keyFilials: ["Lindab Ventilation (Grevie, Farum, Karlstad, Prague)", "Lindab Profile (Förslöv Steel Roofing & Rainline)", "Airmaster Decentral Ventilation (Aars, Denmark)", "Renson / Felderer Distribution"],
      productionProfile: "30+ sheet-metal spiral duct, air diffuser, silencer and steel building profile factories across 20 European countries."
    },
    60: {
      ticker: "EPRO-B.ST", exchange: "Nasdaq Stockholm", founded: 1902, employees: "4,300+",
      keyFilials: ["Ljungby Commercial Laundry Factory (Sweden)", "Pordenone & Vallenoncello Foodservice Factories (Italy)", "Sursee Beverage Plant (Switzerland)", "Unified Brands (Mississippi & Georgia, USA)", "Tosei (Japan)"],
      productionProfile: "12 large factories in 8 countries producing professional restaurant kitchens, combi-ovens, espresso machines and industrial laundry systems."
    },
    61: {
      ticker: "EMBLA.CO", exchange: "Nasdaq Copenhagen", founded: 1971, employees: "4,000+",
      keyFilials: ["Össur Bionic & Carbon-Fiber Prosthetics (Reykjavík Grjótháls Factory)", "College Park Industries (Michigan)", "FIOR & GENTZ Neuro-Orthotics (Lüneburg, Germany)", "ForMotion Patient Care Clinics"],
      productionProfile: "Designs and manufactures Power Knee™, Proprio Foot®, Cheetah® carbon running blades and orthopedic braces in Reykjavík, Mexico and Germany."
    },
    62: {
      ticker: "XVIVO.ST", exchange: "Nasdaq Stockholm", founded: 1998, employees: "160+",
      keyFilials: ["XVIVO Gothenburg GoCo Cleanroom & R&D Hub", "XVIVO Groningen Liver/Kidney Perfusion Hub (Netherlands)", "XVIVO Denver (USA)", "Perfadex® Plus & STEEN Solution™"],
      productionProfile: "Manufactures warm and cold ex-vivo machine perfusion devices (XPS™, Kidney Assist, Liver Assist, Heart Assist) and preservation solutions."
    },
    64: {
      ticker: "BNOR.OL", exchange: "Oslo Børs", founded: 2005, employees: "45+",
      keyFilials: ["Danish Underground Consortium (DUC — 36.8% ownership alongside TotalEnergies & Nordsøfonden)", "Tyra II Gas Processing Hub, Dan, Halfdan & Gorm Offshore Fields"],
      productionProfile: "Major North Sea gas and oil producer via 15+ offshore platforms and the rebuilt Tyra II greenfield gas hub in the Danish North Sea."
    },
    65: {
      ticker: "TRMD-A.CO", exchange: "Nasdaq Copenhagen / Nasdaq NY", founded: 1889, employees: "3,800+ (incl. seafarers)",
      keyFilials: ["TORM Fleet of ~90 LR2, LR1 and MR Product Tankers", "ME Production (Frederikshavn Marine Exhaust Scrubber & Dual-Fuel Factory!)"],
      productionProfile: "Operates ~90 product tankers globally plus majority-owns ME Production marine cleantech factory in Frederikshavn, Denmark."
    },
    66: {
      ticker: "MILDEF.ST", exchange: "Nasdaq Stockholm", founded: 1997, employees: "350+",
      keyFilials: ["MilDef Helsingborg Rugged Hardware Factory", "Sysint AS (Oslo Defense Integration)", "Defcon Solutions (Stockholm)", "Handheld Group (Lidköping Rugged Tablets)", "roda computer GmbH (Germany)"],
      productionProfile: "Manufactures MIL-STD-810/461 rugged tactical computers, servers, network switches and displays for NATO/Nordic armored vehicles and soldiers."
    },
    68: {
      ticker: "ALIG.ST", exchange: "Nasdaq Stockholm", founded: 1948, employees: "3,000+",
      keyFilials: ["Alimak Construction & Industrial Elevators (Skellefteå Factory)", "Tractel Height Safety & Facade Access (France/Germany/Canada)", "CoxGomyl & Manntech Building Maintenance Units", "Avanti Wind Turbine Service Lifts (Hillerød, Denmark & Zaragoza)"],
      productionProfile: "12 factories across Sweden (Skellefteå), Denmark, Germany, France, Spain, China and North America."
    },
    69: {
      ticker: "INSTAL.ST", exchange: "Nasdaq Stockholm", founded: 2014, employees: "6,200+",
      keyFilials: ["150+ local installation and engineering subsidiaries across Sweden, Norway and Finland (Electrical, HVAC, Industrial Piping, Intec Technical Consulting)"],
      productionProfile: "Decentralized Nordic technical installation group executing hospital, data center, pulp mill and industrial piping/electrical projects."
    },
    70: {
      ticker: "SPG.CO", exchange: "Nasdaq Copenhagen", founded: 1972, employees: "2,400+",
      keyFilials: ["SP Moulding (Juelsminde & Stoholm)", "SP Medical (Karise)", "Gibo Plast (Skjern)", "Accoat (Kvistgård)", "Ultraplast", "Ergomat", "Tinby"],
      productionProfile: "31 injection moulding, blow moulding, polyurethane, vacuum thermoforming and fluoropolymer coating plants in 13 countries."
    },
    71: {
      ticker: "IVSO.ST", exchange: "Nasdaq Stockholm", founded: 1999, employees: "260+",
      keyFilials: ["INVISIO Hvidovre R&D & Acoustic Center (Copenhagen)", "Racal Acoustics Ltd (Harrow, UK — Heavy Armored Vehicle Intercoms)"],
      productionProfile: "Bone-conduction tactical headsets, AI noise-cancelling control units and military vehicle intercoms used by 20+ NATO/allied armies."
    },
    72: {
      ticker: "STEF-B.ST", exchange: "Nasdaq Stockholm", founded: 2014, employees: "65+",
      keyFilials: ["150+ warehouse, logistics and light-industrial properties in Stockholm, Mälardalen, Gothenburg, Malmö, Copenhagen, Helsinki & Oslo"],
      productionProfile: "900,000+ m² of lettable industrial and last-mile logistics real estate plus major land bank including GreenHub Bro."
    },
    73: {
      ticker: "DNORD.CO", exchange: "Nasdaq Copenhagen", founded: 1871, employees: "1,800+",
      keyFilials: ["NORDEN Dry Operator & Asset Management", "NORDEN Tanker Operator", "NORDEN Port Logistics & Transshipment (Gabon/Global)"],
      productionProfile: "Operates a dynamic fleet of 450–550 dry bulk vessels and product tankers globally from Hellerup."
    },
    74: {
      ticker: "INWI.ST", exchange: "Nasdaq Stockholm", founded: 2004, employees: "4,700+",
      keyFilials: ["Elitfönster (Vetlanda & Lenhovda)", "Lyssand-Frekhaug (Bergen/Os)", "Tiivi & Pihla (Haapajärvi & Ruovesi, Finland)", "KPK Doors & Windows (Mors, Denmark)", "Carlson & Sidey (UK/Ireland)"],
      productionProfile: "35 window and door factories across Sweden, Finland, Denmark, Norway, UK, Ireland, Poland, Estonia and Romania."
    },
    77: {
      ticker: "SYSR.ST", exchange: "Nasdaq Stockholm", founded: 1974, employees: "6,600+",
      keyFilials: ["Systemair Skinnskatteberg Main Plant", "Frico Air Curtains (Partille)", "Menerga Swimming Pool AHU (Mülheim)", "Systemair Hasselager (Denmark)", "Systemair Dal/Eidsvoll (Norway)"],
      productionProfile: "26 ventilation, air handling unit, chiller and fan factories spanning 18 countries (360,000+ m² of factory & warehouse space)."
    },
    78: {
      ticker: "OLVAS.HE", exchange: "Nasdaq Helsinki", founded: 1878, employees: "2,400+",
      keyFilials: ["Olvi Iisalmi Brewery (Finland)", "A. Le Coq Brewery (Tartu, Estonia)", "Cēsu Alus Brewery (Cēsis, Latvia)", "Volfas Engelman Brewery (Kaunas, Lithuania)"],
      productionProfile: "Produces 900+ million litres of beer, cider, lonkero, mineral water and kvass annually across its Baltic Sea breweries."
    },
    79: {
      ticker: "BERGB.ST", exchange: "Nasdaq Stockholm", founded: 1906, employees: "1,300+",
      keyFilials: ["ESSVE Fasteners", "Skydda PPE", "Luna Tools", "Cresto Fall Safety (Halmstad)", "Arbesko Safety Footwear (Örebro)", "FireSeal", "30+ B2B industrial product companies"],
      productionProfile: "Owns 30+ proprietary tool, fastener, fire-sealing and workplace safety brands with central Nordic logistics in Ulricehamn."
    },
    80: {
      ticker: "AKAST.OL", exchange: "Oslo Børs", founded: 2004, employees: "2,100+ (incl. HMH)",
      keyFilials: ["HMH (50% JV with Baker Hughes — Kristiansand & Houston Offshore Drilling Equipment)", "AKOFS Offshore (Subsea Well Intervention Vessels)", "DDW Offshore (3 AHTS Vessels)", "AGR Petroleum Services"],
      productionProfile: "Major Kristiansand offshore drilling package factory (HMH) plus subsea well-intervention and anchor-handling vessel fleet."
    },
    81: {
      ticker: "TTALO.HE", exchange: "Nasdaq Helsinki", founded: 2001, employees: "15,500+",
      keyFilials: ["Terveystalo Finland (370+ clinics & 18 surgical hospitals)", "Feelgood Svenska AB (120+ Swedish occupational health clinics)", "Rela-hierojat"],
      productionProfile: "Finland's largest private healthcare network handling 8M+ annual patient visits across 370+ clinics, imaging hubs and surgical hospitals."
    },
    82: {
      ticker: "MCAP.ST", exchange: "Nasdaq Stockholm", founded: 2001, employees: "600+",
      keyFilials: ["Abilia (Täby — Cognitive & Communication Assistive Tech)", "Unimedic Pharma (Matfors Liquid Pharma Factory)", "Cardiolex (ECG Systems)", "Inpac (Lund Dietary Supplement Contract Manufacturing)", "MultiDocker / Toma"],
      productionProfile: "Pharmaceutical factory in Matfors (Sundsvall), supplement packaging plant in Lund, and assistive medtech centres in Stockholm, Oslo and Cambridge."
    },
    83: {
      ticker: "HANZA.ST", exchange: "Nasdaq Stockholm", founded: 2008, employees: "2,600+",
      keyFilials: ["Cluster Sweden (Årjäng, Töcksfors, Svanskog, Hallsberg)", "Cluster Finland (Joensuu, Iisalmi, Heinola)", "Cluster Baltics (Tartu & Narva, Estonia)", "Cluster Central Europe (Poland & Czechia)", "Cluster Germany (Remscheid)"],
      productionProfile: "18 factories organized in regional complete-manufacturing clusters (sheet metal, CNC machining, PCB electronics, cabling & final assembly)."
    },
    84: {
      ticker: "SKIS-B.ST", exchange: "Nasdaq Stockholm", founded: 1975, employees: "1,800+",
      keyFilials: ["SkiStar Sälen (Lindvallen, Högfjället, Tandådalen, Hundfjället)", "SkiStar Åre", "SkiStar Vemdalen", "SkiStar Trysil (Norway)", "SkiStar Hemsedal (Norway)", "SkiStar Hammarbybacken (Stockholm)", "SkiStar Lodge & EQPE Outdoor Brand"],
      productionProfile: "50% market share of Scandinavian alpine lift passes, operating ~200 ski lifts, 350+ slopes, snowmaking reservoirs, hotels and Scandinavian Mountains Airport partner."
    },
    87: {
      ticker: "ENGCON-B.ST", exchange: "Nasdaq Stockholm", founded: 1990, employees: "420+",
      keyFilials: ["engcon Strömsund Main Tiltrotator Factory (Jämtland)", "engcon Niepruszewo Assembly Plant (Poland)", "EC-Oil® Automatic Hydraulic Connector System"],
      productionProfile: "~45% global market share in excavator tiltrotators, manufactured in Strömsund, Northern Sweden."
    },
    88: {
      ticker: "NAPA.OL", exchange: "Oslo Børs", founded: 2003, employees: "100+",
      keyFilials: ["Napatech Søborg FPGA Engineering Center (Copenhagen)", "Napatech Andover (Massachusetts)", "Intel® Altera Programmable IPU / SmartNIC Co-Development"],
      productionProfile: "Designs ultra-high-speed 100G/200G/400G FPGA SmartNIC network accelerator cards for telecom, cybersecurity, quantitative finance and AI."
    },
    91: {
      ticker: "BONHR.OL", exchange: "Oslo Børs", founded: 1848, employees: "3,000+",
      keyFilials: ["Fred. Olsen Renewables (12 Onshore Wind Farms in Scotland, Norway & Sweden — 800+ MW)", "Fred. Olsen Windcarrier (Brave Tern, Bold Tern & Blue Tern Offshore Wind Jack-Up Vessels)", "Fred. Olsen Seawind", "Fred. Olsen Cruise Lines (Bolette, Borealis, Balmoral)"],
      productionProfile: "Operates 12 wind farms, 3 giant offshore wind turbine installation jack-up vessels and 3 ocean cruise ships."
    },
    92: {
      ticker: "MORLD.OL", exchange: "Oslo Børs", founded: 2019, employees: "2,200+",
      keyFilials: ["Moreld Apply (Stavanger, Bergen, Hammerfest — Offshore Platform Maintenance & Modifications)", "Ocean Installer (Subsea Umbilicals, Risers & Flowlines SURF)", "Global Maritime (Marine Warranty & Naval Engineering)"],
      productionProfile: "Major offshore engineering and subsea construction contractor with bases in Stavanger, Bergen, Hammerfest, Aberdeen and Houston."
    },
    94: {
      ticker: "RAIVV.HE", exchange: "Nasdaq Helsinki", founded: 1939, employees: "350+",
      keyFilials: ["Raisio Industrial Mill Complex & Plant Stanol Ester Factory", "Nokia Gluten-Free Oat Mill", "Elovena® Oats", "Benecol® Cholesterol-Lowering Foods", "Härkis® Fava Bean Foods"],
      productionProfile: "Grain silos, oat mills, plant protein extrusion and Benecol stanol ester chemical plant in Raisio and Nokia."
    },
    95: {
      ticker: "FIA1S.HE", exchange: "Nasdaq Helsinki", founded: 1923, employees: "5,300+",
      keyFilials: ["Finnair Technical Services Hangars (Helsinki Airport)", "Finnair Cargo COOL Nordic Hub (Helsinki Airport)", "Aurinkomatkat Sun Tours", "Norra (Nordic Regional Airlines — 40% JV)"],
      productionProfile: "Operates ~80 aircraft (Airbus A350-900, A330, A321/A320/A319, Embraer 190 & ATR 72) plus the automated COOL air cargo terminal at Helsinki-Vantaa."
    },
    97: {
      ticker: "YIT.HE", exchange: "Nasdaq Helsinki", founded: 1912, employees: "4,300+",
      keyFilials: ["YIT Housing Finland & CEE", "YIT Business Premises", "YIT Infrastructure (Rock caverns, metro tunnels, bridges & wind farm foundations)"],
      productionProfile: "Finland's largest urban developer and underground rock-engineering/infrastructure builder."
    },
    99: {
      ticker: "ELOPK.OL", exchange: "Oslo Børs", founded: 1957, employees: "2,700+",
      keyFilials: ["Elopak Spikkestad Corporate Technology Center", "Elopak Lystrup Coating & Converting Plant (Aarhus, Denmark)", "Elopak Terneuzen (Netherlands)", "Elopak Montreal & Little Rock (North America)", "Naturepak Beverage (MENA)"],
      productionProfile: "11 beverage carton converting plants manufacturing 14+ billion Pure-Pak® cartons annually across 70+ countries."
    },
    100: {
      ticker: "OVZON.ST", exchange: "Nasdaq Stockholm", founded: 2006, employees: "60+",
      keyFilials: ["Ovzon 3 Geostationary SATCOM Satellite (Launched via SpaceX Falcon 9)", "Ovzon T6 / T7 Ultra-Compact Mobile Satellite Terminals (Solna & Tampa)"],
      productionProfile: "Operates its own high-throughput geostationary satellite (Ovzon 3 with onboard processor) and manufactures laptop-sized defense SATCOM terminals."
    },
    101: {
      ticker: "VITR.ST", exchange: "Nasdaq Stockholm", founded: 1994, employees: "1,100+",
      keyFilials: ["Vitrolife Gothenburg IVF Media Cleanroom", "Vitrolife Viby/Aarhus EmbryoScope® Time-Lapse Incubator Plant", "Vitrolife San Diego Micromanipulation Pipettes & Lasers", "Igenomix Reproductive Genetics Labs (Valencia & Global)"],
      productionProfile: "Cleanroom manufacturing in Gothenburg, Aarhus and San Diego plus 25+ reproductive genetics laboratories worldwide."
    },
    104: {
      ticker: "QTCOM.HE", exchange: "Nasdaq Helsinki", founded: 1995, employees: "850+",
      keyFilials: ["Qt Framework & Design Studio (Espoo & Oulu)", "Qt Quality Assurance (Squish / Coco — Berlin)", "Axivion Static Code Analysis (Stuttgart)"],
      productionProfile: "Powers digital instrument clusters and touchscreens in 1.5+ billion embedded devices across automotive (Mercedes, Hyundai, BYD), medtech and industrial machines."
    },
    105: {
      ticker: "NTG.CO", exchange: "Nasdaq Copenhagen", founded: 2011, employees: "2,200+",
      keyFilials: ["NTG Road (Hvidovre, Kolding, Värnamo, Gothenburg, Helsinki)", "NTG Air & Ocean", "AGL (Allied Global Logistics)"],
      productionProfile: "80+ freight forwarding terminals and cross-docking warehouses across Europe, North America and Asia."
    },
    106: {
      ticker: "ENDUR.OL", exchange: "Oslo Børs", founded: 2007, employees: "700+",
      keyFilials: ["Artec Aqua AS (Ålesund — Turnkey Land-Based Salmon & Smolt Farms)", "Endúr Sjøsterk AS (Bergen — Concrete Floating Salmon Feed Barges)", "BMO Entreprenør AS (Quay, Bridge & Dam Rehabilitation)", "Marcon Gruppen AB (Swedish Marine Construction & Diving)", "Repstad Anlegg AS (Kristiansand)"],
      productionProfile: "Builds Norway's largest land-based fish farms (Artec Aqua), concrete aquaculture feed barges (Sjøsterk), ferries/quays and hydropower rehabilitation."
    },
    108: {
      ticker: "LINDEX.HE", exchange: "Nasdaq Helsinki", founded: 1862, employees: "5,800+",
      keyFilials: ["Lindex AB (440+ fashion stores in 18 countries + Partille/Alingsås Automated Omnichannel Warehouse)", "Stockmann Department Stores (Helsinki Flagship, Tapiola, Tampere, Turku, Jumbo, Tallinn & Riga)"],
      productionProfile: "440+ Lindex fashion stores, 8 iconic Stockmann department stores and a brand-new EUR 110M robotic garment distribution center in Alingsås."
    },
    109: {
      ticker: "OKEA.OL", exchange: "Oslo Børs", founded: 2015, employees: "550+",
      keyFilials: ["Draugen Offshore Field & Platform (Operator)", "Brage Offshore Platform (Operator)", "Hasselmus Subsea Gas Field (Operator)", "Njord, Statfjord, Gjøa & Ivar Aasen Partner Stakes", "Kristiansund Vestbase Operations Center"],
      productionProfile: "Operates the Draugen and Brage offshore platforms on the Norwegian Continental Shelf with ~35,000–40,000 boepd production."
    },
    111: {
      ticker: "ARCH.OL", exchange: "Oslo Børs", founded: 2007, employees: "5,000+",
      keyFilials: ["Archer Platform Drilling (North Sea Equinor/ConocoPhillips Rigs)", "Archer Oiltools (Stavanger Plug & Abandonment Tools)", "Archer Wireline & Well Intervention", "Iceland Drilling (Geothermal Deep DrillingJV)", "Archer Land Drilling (Vaca Muerta, Argentina)"],
      productionProfile: "Operates offshore platform drilling rigs across Norway/UK, geothermal rigs via Iceland Drilling, and land rigs in Argentina."
    },
    114: {
      ticker: "SCANFL.HE", exchange: "Nasdaq Helsinki", founded: 1976, employees: "3,700+",
      keyFilials: ["Scanfil Sievi Flagship Factory", "Scanfil Åtvidaberg & Malmö (Sweden)", "Scanfil Pärnu (Estonia)", "Scanfil Sieradz & Mysłowice (Poland)", "Scanfil Wutöschingen (Germany)", "Scanfil Atlanta (USA)", "Scanfil Suzhou (China)", "SRXGlobal (Australia/Malaysia)"],
      productionProfile: "11 global contract manufacturing plants for industrial automation, medtech, elevator and green energy systems."
    },
    115: {
      ticker: "ARJO-B.ST", exchange: "Nasdaq Stockholm", founded: 1957, employees: "6,800+",
      keyFilials: ["Arjo Malmö HQ & Eslöv R&D", "Arjo Poznan & Komorniki Mega-Factory (Poland)", "Arjo Houghton Regis (UK)", "Arjo Magog (Canada)", "Arjo San Cristobal (Dominican Republic)"],
      productionProfile: "Manufactures ceiling lifts, patient lifters (Sara/Maxi), hospital beds, flusher-disinfectors and DVT compression systems."
    },
    118: {
      ticker: "MATAS.CO", exchange: "Nasdaq Copenhagen", founded: 1949, employees: "5,000+",
      keyFilials: ["Matas Denmark (~260 stores + Allerød High-Tech Webshop Warehouse)", "KICKS Group (230+ stores across Sweden, Norway & Finland + Rosersberg Automated Warehouse)", "Skincity", "Firtal Group"],
      productionProfile: "Nordic #1 beauty retailer with ~500 stores across Denmark, Sweden, Norway and Finland plus automated fulfillment centers in Allerød and Rosersberg."
    },
    119: {
      ticker: "ODF-A.OL", exchange: "Oslo Børs", founded: 1914, employees: "2,300+",
      keyFilials: ["Odfjell Tankers (~70 Deep-Sea Stainless Steel Chemical Parcel Tankers)", "Odfjell Terminals (Houston, Charleston, Ulsan Korea & Antwerp Bulk Liquid Chemical Tank Terminals)"],
      productionProfile: "Operates ~70 stainless steel chemical tankers and 1.2+ million m³ of bulk chemical tank terminal storage capacity."
    },
    120: {
      ticker: "TOKMAN.HE", exchange: "Nasdaq Helsinki", founded: 1989, employees: "6,600+",
      keyFilials: ["Tokmanni (~205 stores across Finland + Mäntsälä Mega-Warehouse)", "Dollarstore (~135 stores in Sweden + Big Dollar in Denmark + Örebro Central Warehouse)", "Click Shoes & Miny"],
      productionProfile: "340+ discount variety stores across Finland, Sweden and Denmark backed by giant central logistics hubs in Mäntsälä and Örebro."
    },
    122: {
      ticker: "ZAP.OL", exchange: "Oslo Børs", founded: 2012, employees: "190+",
      keyFilials: ["Zaptec Stavanger HQ & R&D", "Westcontrol Tau Production Line (Norway)", "Sanmina Production Line (Germany)", "Zaptec Sweden, UK, Switzerland, Benelux & France"],
      productionProfile: "Over 500,000 Zaptec Go and Zaptec Pro smart EV chargers manufactured and installed across Europe."
    },
    123: {
      ticker: "TROAX.ST", exchange: "Nasdaq Stockholm", founded: 1955, employees: "1,200+",
      keyFilials: ["Troax Hillerstorp Automated Steel Mesh Factory", "Garantell Wire Mesh Decking (Värnamo)", "Satech Safety Technology (Bulciago, Italy)", "Folding Guard (Chicago, USA)", "Natom Logistic (Poland)", "Troax China (Changzhou)"],
      productionProfile: "Automated welded steel mesh panel factories in Hillerstorp (Sweden), Värnamo, Italy, Poland, USA and China protecting industrial robots and automated warehouses."
    },
    127: {
      ticker: "APOTEA.ST", exchange: "Nasdaq Stockholm", founded: 2012, employees: "700+",
      keyFilials: ["Apotea Morgongåva 38,000 m² Automated Robotic Pharmacy Logistics Center", "Apotea Varberg New Automated Logistics Hub"],
      productionProfile: "Ships 50,000+ e-commerce pharmacy and prescription orders per day from its robotic AutoStore/piece-picking mega-center in Morgongåva."
    },
    130: {
      ticker: "AFK.OL", exchange: "Oslo Børs", founded: 1896, employees: "2,200+",
      keyFilials: ["Arendals Fossekompani Hydropower (Bøylefoss & Flatenfoss — 500 GWh/yr)", "ENRX (Skien Induction Heating & Wireless Charging Factory)", "Volue (Power Grid & Hydro Optimization Software)", "NSSLGlobal (Defense & Maritime Satellite Comms)", "Tekna Plasma Systems (Spherical Titanium/Nickel 3D-Printing Powders)"],
      productionProfile: "Combines 100%-owned Norwegian hydropower stations with global industrial technology factories (ENRX in Skien, Tekna in Canada/France)."
    },
    133: {
      ticker: "MEDI.OL", exchange: "Oslo Børs", founded: 1984, employees: "140+",
      keyFilials: ["Medistim Oslo HQ", "Medistim Horten Ultrasound Transducer & Flow Probe Factory", "MiraQ™ Cardiac & Vascular Intraoperative Imaging Systems"],
      productionProfile: "Over 80% global market share in intraoperative coronary bypass graft blood-flow quality verification, manufactured in Horten, Norway."
    },
    137: {
      ticker: "PON1V.HE", exchange: "Nasdaq Helsinki", founded: 1970, employees: "2,100+",
      keyFilials: ["Ponsse Vieremä Cut-to-Length Forest Machine Factory (20,000+ machines built!)", "Ponsse Iisalmi Global Parts Logistics & Remanufacturing Center", "Epec Oy (Seinäjoki Control Systems & EV Power Electronics Factory)"],
      productionProfile: "Every single Ponsse Scorpion harvester and Buffalo/Elephant forwarder in the world is built at the 4-hectare Vieremä factory in Upper Savonia."
    },
    139: {
      ticker: "NMAN.ST", exchange: "Nasdaq Stockholm", founded: 1944, employees: "2,500+",
      keyFilials: ["Nederman Helsingborg Filtration Plant", "MikroPul & Pneumafil", "Luwa Textile Air Engineering", "Gasmet FTIR Emission Analyzers (Vantaa, Finland)", "Auburn FilterSense", "RoboVent", "Olicat"],
      productionProfile: "17 manufacturing plants across 12 countries building industrial baghouse dust collectors, welding fume extractors and continuous emissions monitors."
    },
    141: {
      ticker: "MEKKO.HE", exchange: "Nasdaq Helsinki", founded: 1951, employees: "470+",
      keyFilials: ["Marimekko Herttoniemi Textile Printing Factory (Helsinki — prints ~1 million meters of fabric/year!)", "160+ Marimekko Stores across Finland, Japan, Asia-Pacific, Europe & North America"],
      productionProfile: "Operates its own industrial rotary screen and flatbed textile printing mill in Herttoniemi, Helsinki."
    },
    147: {
      ticker: "SCST.ST", exchange: "Nasdaq Stockholm", founded: 2013, employees: "3,200+",
      keyFilials: ["Kronfågel AB (Valla Mega-Plant, Sweden)", "Den Stolte Hane AS (Jæren & Stokke Plants, Norway)", "Danpo A/S (Farre & Aars Plants, Denmark)", "Naapurin Maalaiskana Oy (Lieto Plant, Finland)", "Manor Farm (Shercock Plant, Ireland)"],
      productionProfile: "Processes 200+ million chickens per year across 8 large poultry slaughter, deboning and ready-to-eat plants in Sweden, Norway, Denmark, Finland, Ireland and Lithuania."
    },
    148: {
      ticker: "DFDS.CO", exchange: "Nasdaq Copenhagen", founded: 1866, employees: "14,000+",
      keyFilials: ["65+ RoRo Freight & Passenger Ferries (North Sea, Baltic, English Channel, Mediterranean, Strait of Gibraltar)", "8 Strategic Port Terminals (Gothenburg, Vlaardingen/Rotterdam, Immingham, Esbjerg, Oslo, Dunkirk, Calais)", "12,000+ Road Freight Trailers & Trucks"],
      productionProfile: "Operates 65+ ferries, 8 major European port terminals and 80+ logistics warehouses."
    },
    158: {
      ticker: "ANORA.HE", exchange: "Nasdaq Helsinki", founded: 1888, employees: "1,200+",
      keyFilials: ["Koskenkorva Barley Spirit & Starch Distillery (Ilmajoki, Finland)", "Rajamäki Alcoholic Beverage Bottling Plant &Protected Groundwater Reserve (Nurmijärvi, Finland)", "Gjelleråsen Aquavit Distillery, Cask Cellar & Automated Logistics Plant (Oslo, Norway)", "Globus Wine (Køge, Denmark)"],
      productionProfile: "Produces Koskenkorva Vodka, Linie Aquavit, Gammel Dansk, Larsen Cognac, Blossa Glögg and Chill Out wines across 4 major Nordic plants."
    },
    163: {
      ticker: "NOTE.ST", exchange: "Nasdaq Stockholm", founded: 1999, employees: "1,500+",
      keyFilials: ["NOTE Norrtälje", "NOTE Torsby", "NOTE Lund", "NOTE Herrljunga", "NOTE Hyvinkää (Finland)", "NOTE Pärnu (Estonia)", "NOTE Stonehouse, Windsor & Haddenham (UK)", "NOTE Varna (Bulgaria)"],
      productionProfile: "11 high-mix electronics manufacturing services (EMS) factories across Sweden, Finland, Estonia, UK, Bulgaria and China."
    },
    165: {
      ticker: "KEMPOWR.HE", exchange: "Nasdaq Helsinki", founded: 2017, employees: "850+",
      keyFilials: ["Kempower Lahti Plants 1, 2 & Heavy Electric Truck Charging Lab (Finland)", "Kempower Durham Factory (North Carolina, USA)", "Kempower Tampere R&D Center"],
      productionProfile: "Three DC fast-charger assembly and power-electronics plants in Lahti (Finland) plus a North American factory in Durham, NC."
    },
    170: {
      ticker: "FRAMERY.HE", exchange: "Nasdaq Helsinki", founded: 2010, employees: "420+",
      keyFilials: ["Framery Tampere Sarankulma Factory & Acoustic Lab (Framery One, Four & Six Smart Pods)"],
      productionProfile: "Centralized sheet-metal, acoustic glass and smart-sensor pod assembly complex in Tampere, exporting 95%+ of production to 100+ countries."
    },
    179: {
      ticker: "ORRON.ST", exchange: "Nasdaq Stockholm", founded: 2001, employees: "90+",
      keyFilials: ["80+ Onshore Wind & Hydropower Assets in Sweden & Finland (~1,100 GWh/yr)", "Karskruv 86 MW Wind Farm (SE4)", "Metsälä (MLK) Wind Farm (Finland)", "Greenfield Solar & Battery Storage Projects in UK, Germany & France"],
      productionProfile: "Lundin Group renewable power producer operating 80+ wind farms and hydro stations across the Nordics."
    },
    183: {
      ticker: "HEX.OL", exchange: "Oslo Børs", founded: 1983, employees: "1,100+",
      keyFilials: ["Hexagon Agility (Lincoln Nebraska & Salisbury NC — RNG/CNG Heavy Truck Fuel Systems)", "Hexagon Raufoss (Norway — Type 4 LPG & High-Pressure Composite Cylinders)", "Hexagon Digital Wave (Modal Acoustic Emission Cylinder Testing)", "40% stake in Hexagon Purus (Hydrogen Cylinders & Battery Systems)"],
      productionProfile: "Automated carbon-fiber & glass-fiber filament winding factories in Raufoss (Norway), Lincoln (Nebraska), Salisbury (NC) and Kassel (Germany)."
    },
    191: {
      ticker: "SOFF.OL", exchange: "Oslo Børs", founded: 1964, employees: "2,500+",
      keyFilials: ["Solstad Offshore & Solstad Maritime (~40 High-End CSV Subsea Construction Vessels & AHTS Anchor Handlers)", "Normand Maximus, Normand Ocean, Normand Frontier, Normand Vision", "Skudeneshavn Deepwater Quay Base"],
      productionProfile: "Operates ~40 of the world's largest subsea construction (CSV) and anchor-handling (AHTS) vessels for offshore wind and deepwater oil & gas in Norway, Brazil, UK and Australia."
    },
    193: {
      ticker: "FAG.ST", exchange: "Nasdaq Stockholm", founded: 1945, employees: "4,100+",
      keyFilials: ["Fagerhult Habo Factory (Sweden)", "iGuzzini Illuminazione (Recanati, Italy)", "Ateljé Lyktan (Åhus, Sweden)", "Whitecroft Lighting (Manchester, UK)", "WE-EF Outdoor Lighting (Bispingen, Germany)", "LTS Licht & Leuchten (Tettnang, Germany)", "Designplan & Eagle Lighting"],
      productionProfile: "12 architectural, hospital, tunnel and street lighting brands operating major luminaire factories across Sweden, Italy, Germany, UK and Australia."
    },
    195: {
      ticker: "FSKRS.HE", exchange: "Nasdaq Helsinki", founded: 1649, employees: "7,000+",
      keyFilials: ["Fiskars Billnäs Scissors & Garden Tool Factory (Finland)", "Iittala Glass Factory (Finland)", "Royal Copenhagen Porcelain Manufactory (Glostrup, Denmark)", "Georg Jensen Silversmithy (Copenhagen & Chiang Mai)", "Wedgwood & Waterford Crystal (Barlaston, UK & Waterford, Ireland)", "Gerber Gear (Portland, Oregon)"],
      productionProfile: "Finland's oldest company (founded 1649); operates scissors, glass, porcelain, silver and crystal factories across Finland, Denmark, UK, Ireland, USA and Thailand."
    }
  };

  Object.assign(window.COMPANY_INTELLIGENCE.byRank, extra);
})();
