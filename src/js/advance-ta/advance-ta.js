// Embedded symbol and sector data
const MARKET_DATA = [
  { name: "Nabil Bank Limited", symbol: "NABIL", sector: "Commercial Banks" },
  { name: "Nepal Investment Mega Bank Limited", symbol: "NIMB", sector: "Commercial Banks" },
  { name: "Standard Chartered Bank Limited", symbol: "SCB", sector: "Commercial Banks" },
  { name: "Himalayan Bank Limited", symbol: "HBL", sector: "Commercial Banks" },
  { name: "Nepal SBI Bank Limited", symbol: "SBI", sector: "Commercial Banks" },
  { name: "Everest Bank Limited", symbol: "EBL", sector: "Commercial Banks" },
  { name: "NIC Asia Bank Ltd.", symbol: "NICA", sector: "Commercial Banks" },
  { name: "Machhapuchhre Bank Limited", symbol: "MBL", sector: "Commercial Banks" },
  { name: "Laxmi Sunrise Bank Limited", symbol: "LSL", sector: "Commercial Banks" },
  { name: "Kumari Bank Limited", symbol: "KBL", sector: "Commercial Banks" },
  { name: "Siddhartha Bank Limited", symbol: "SBL", sector: "Commercial Banks" },
  { name: "Sanima Bank Limited", symbol: "SANIMA", sector: "Commercial Banks" },
  { name: "NMB Bank Limited", symbol: "NMB", sector: "Commercial Banks" },
  { name: "Prabhu Bank Limited", symbol: "PRVU", sector: "Commercial Banks" },
  { name: "Global IME Bank Limited", symbol: "GBIME", sector: "Commercial Banks" },
  { name: "Citizens Bank International Limited", symbol: "CZBIL", sector: "Commercial Banks" },
  { name: "Prime Commercial Bank Ltd.", symbol: "PCBL", sector: "Commercial Banks" },
  { name: "Agricultural Development Bank Limited", symbol: "ADBL", sector: "Commercial Banks" },
  { name: "Nepal Bank Limited", symbol: "NBL", sector: "Commercial Banks" },
  { name: "Soaltee Hotel Limited", symbol: "SHL", sector: "Hotels And Tourism" },
  { name: "Taragaon Regency Hotel Limited", symbol: "TRH", sector: "Hotels And Tourism" },
  { name: "Oriental Hotels Limited", symbol: "OHL", sector: "Hotels And Tourism" },
  { name: "Chandragiri Hills Limited", symbol: "CGH", sector: "Hotels And Tourism" },
  { name: "City Hotel Limited", symbol: "CITY", sector: "Hotels And Tourism" },
  { name: "Kalinchowk Darshan Limited", symbol: "KDL", sector: "Hotels And Tourism" },
  { name: "Bandipur Cablecar and Tourism Limited", symbol: "BANDIPUR", sector: "Hotels And Tourism" },
  { name: "National Hydro Power Company Limited", symbol: "NHPC", sector: "Hydro Power" },
  { name: "Butwal Power Company Limited", symbol: "BPCL", sector: "Hydro Power" },
  { name: "Chilime Hydropower Company Limited", symbol: "CHCL", sector: "Hydro Power" },
  { name: "Arun Valley Hydropower Development Co. Ltd.", symbol: "AHPC", sector: "Hydro Power" },
  { name: "Sanima Mai Hydropower Ltd.", symbol: "SHPC", sector: "Hydro Power" },
  { name: "Ridi Power Company Limited", symbol: "RIDI", sector: "Hydro Power" },
  { name: "Barun Hydropower Co. Ltd.", symbol: "BARUN", sector: "Hydro Power" },
  { name: "Api Power Company Ltd.", symbol: "API", sector: "Hydro Power" },
  { name: "Ngadi Group Power Ltd.", symbol: "NGPL", sector: "Hydro Power" },
  { name: "Khanikhola Hydropower Co. Ltd.", symbol: "KKHC", sector: "Hydro Power" },
  { name: "Dibyashwori Hydropower Ltd.", symbol: "DHPL", sector: "Hydro Power" },
  { name: "Arun Kabeli Power Ltd.", symbol: "AKPL", sector: "Hydro Power" },
  { name: "Synergy Power Development Ltd.", symbol: "SPDL", sector: "Hydro Power" },
  { name: "United Modi Hydropower Ltd.", symbol: "UMHL", sector: "Hydro Power" },
  { name: "Chhyangdi Hydropower Ltd.", symbol: "CHL", sector: "Hydro Power" },
  { name: "Himalayan Power Partner Ltd.", symbol: "HPPL", sector: "Hydro Power" },
  { name: "Nepal Hydro Developers Ltd.", symbol: "NHDL", sector: "Hydro Power" },
  { name: "Radhi Bidyut Company Ltd", symbol: "RADHI", sector: "Hydro Power" },
  { name: "Panchakanya Mai Hydropower Ltd", symbol: "PMHPL", sector: "Hydro Power" },
  { name: "Kalika power Company Ltd", symbol: "KPCL", sector: "Hydro Power" },
  { name: "Ankhu Khola Jalvidhyut Company Ltd", symbol: "AKJCL", sector: "Hydro Power" },
  { name: "Joshi Hydropower Development Company Ltd", symbol: "JOSHI", sector: "Hydro Power" },
  { name: "Upper Tamakoshi Hydropower Ltd", symbol: "UPPER", sector: "Hydro Power" },
  { name: "Ghalemdi Hydro Limited", symbol: "GHL", sector: "Hydro Power" },
  { name: "UNIVERSAL POWER COMPANY LTD", symbol: "UPCL", sector: "Hydro Power" },
  { name: "Mountain Hydro Nepal Limited", symbol: "MHNL", sector: "Hydro Power" },
  { name: "Panchthar Power Compant Limited", symbol: "PPCL", sector: "Hydro Power" },
  { name: "Himalaya Urja Bikas Company Limited", symbol: "HURJA", sector: "Hydro Power" },
  { name: "Union Hydropower Limited", symbol: "UNHPL", sector: "Hydro Power" },
  { name: "RASUWAGADHI HYDROPOWER COMPANY LIMITED", symbol: "RHPL", sector: "Hydro Power" },
  { name: "SANJEN JALAVIDHYUT COMPANY LIMITED", symbol: "SJCL", sector: "Hydro Power" },
  { name: "Himal Dolakha Hydropower Company Limited", symbol: "HDHPC", sector: "Hydro Power" },
  { name: "Liberty Energy Company Limited", symbol: "LEC", sector: "Hydro Power" },
  { name: "Shiva Shree Hydropower Ltd", symbol: "SSHL", sector: "Hydro Power" },
  { name: "Mountain Energy Nepal Limited", symbol: "MEN", sector: "Hydro Power" },
  { name: "United IDI Mardi RB Hydropower Limited.", symbol: "UMRH", sector: "Hydro Power" },
  { name: "GreenLife Hydropower Limited", symbol: "GLH", sector: "Hydro Power" },
  { name: "Singati Hydro Energy Limited", symbol: "SHEL", sector: "Hydro Power" },
  { name: "Ru Ru Jalbidhyut Pariyojana Limited", symbol: "RURU", sector: "Hydro Power" },
  { name: "Mailung Khola Jal Vidhyut Company Limited", symbol: "MKJC", sector: "Hydro Power" },
  { name: "Sahas Urja Limited", symbol: "SAHAS", sector: "Hydro Power" },
  { name: "Terhathum Power Company Limited", symbol: "TPC", sector: "Hydro Power" },
  { name: "Samling Power Company Limited", symbol: "SPC", sector: "Hydro Power" },
  { name: "Nyadi Hydropower Limited", symbol: "NYADI", sector: "Hydro Power" },
  { name: "Madhya Bhotekoshi Jalavidyut Company Limited", symbol: "MBJC", sector: "Hydro Power" },
  { name: "Buddha Bhumi Nepal Hydropower Company Limited", symbol: "BNHC", sector: "Hydro Power" },
  { name: "Green Ventures Limited", symbol: "GVL", sector: "Hydro Power" },
  { name: "Balephi Hydropower Limited", symbol: "BHL", sector: "Hydro Power" },
  { name: "River Falls Power Limited", symbol: "RFPL", sector: "Hydro Power" },
  { name: "Dordi Khola Jal Bidyut Company Limited", symbol: "DORDI", sector: "Hydro Power" },
  { name: "Bindhyabasini Hydropower Development Company Limited", symbol: "BHDC", sector: "Hydro Power" },
  { name: "Himalayan Hydropower Limited", symbol: "HHL", sector: "Hydro Power" },
  { name: "Upper Hewakhola Hydropower Company Limited", symbol: "UHEWA", sector: "Hydro Power" },
  { name: "Swet-Ganga Hydropower & Construction Limited", symbol: "SGHC", sector: "Hydro Power" },
  { name: "Mandakini Hydropower Limited", symbol: "MHL", sector: "Hydro Power" },
  { name: "Upper Solu Hydro Electric Company Limited", symbol: "USHEC", sector: "Hydro Power" },
  { name: "Rapti Hydro And General Construction Limited", symbol: "RHGCL", sector: "Hydro Power" },
  { name: "Sayapatri Hydropower Limited", symbol: "SPHL", sector: "Hydro Power" },
  { name: "People's Power Limited", symbol: "PPL", sector: "Hydro Power" },
  { name: "Sikles Hydropower Limited", symbol: "SIKLES", sector: "Hydro Power" },
  { name: "Eastern Hydropower Limited", symbol: "EHPL", sector: "Hydro Power" },
  { name: "Peoples Hydropower Company Limited", symbol: "PHCL", sector: "Hydro Power" },
  { name: "Barahi Hydropower Public Limited", symbol: "BHPL", sector: "Hydro Power" },
  { name: "Super Madi Hydropower Limited", symbol: "SMHL", sector: "Hydro Power" },
  { name: "Shuvam Power Limited", symbol: "SPL", sector: "Hydro Power" },
  { name: "Super Mai Hydropower Limited", symbol: "SMH", sector: "Hydro Power" },
  { name: "Maya Khola Hydropower Company Limited", symbol: "MKHC", sector: "Hydro Power" },
  { name: "Asian Hydropower Limited", symbol: "AHL", sector: "Hydro Power" },
  { name: "Sanima Middle Tamor Hydropower Limited", symbol: "TAMOR", sector: "Hydro Power" },
  { name: "Molung Hydropower Company Limited", symbol: "MHCL", sector: "Hydro Power" },
  { name: "Sagarmatha Jalabidhyut Company Limited", symbol: "SMJC", sector: "Hydro Power" },
  { name: "Makar Jitumaya Suri Hydropower Limited", symbol: "MAKAR", sector: "Hydro Power" },
  { name: "Mai Khola Hydropower Limited", symbol: "MKHL", sector: "Hydro Power" },
  { name: "Dolti Power Company Limited", symbol: "DOLTI", sector: "Hydro Power" },
  { name: "Bhugol Energy Development Company Limited", symbol: "BEDC", sector: "Hydro Power" },
  { name: "Menchhiyam Hydropower Limited", symbol: "MCHL", sector: "Hydro Power" },
  { name: "Ingwa Hydropower Limited", symbol: "IHL", sector: "Hydro Power" },
  { name: "Modi Energy Limited", symbol: "MEL", sector: "Hydro Power" },
  { name: "Rawa Energy Development Limited", symbol: "RAWA", sector: "Hydro Power" },
  { name: "Upper Syange Hydropower Limited", symbol: "USHL", sector: "Hydro Power" },
  { name: "Three Star Hydropower Limited", symbol: "TSHL", sector: "Hydro Power" },
  { name: "Kutheli Bukhari Small Hydropower Limited", symbol: "KBSH", sector: "Hydro Power" },
  { name: "Manakamana Engineering Hydropower Limited", symbol: "MEHL", sector: "Hydro Power" },
  { name: "Upper Lohore Khola Hydropower Company Limited", symbol: "ULHC", sector: "Hydro Power" },
  { name: "Mandu Hydropower Limited", symbol: "MANDU", sector: "Hydro Power" },
  { name: "Bhagawati Hydropower Development Company Limited", symbol: "BGWT", sector: "Hydro Power" },
  { name: "Mid Solu Hydropower Limited", symbol: "MSHL", sector: "Hydro Power" },
  { name: "Mathillo Mailun Khola Jalvidhyut Limited", symbol: "MMKJL", sector: "Hydro Power" },
  { name: "Trishuli Jal Vidhyut Company Limited", symbol: "TVCL", sector: "Hydro Power" },
  { name: "Vision Lumbini Urja Company Limited", symbol: "VLUCL", sector: "Hydro Power" },
  { name: "Chirkhwa Hydropower Limited", symbol: "CKHL", sector: "Hydro Power" },
  { name: "Sanvi Energy Limited", symbol: "SANVI", sector: "Hydro Power" },
  { name: "Bikash Hydropower Company Limited", symbol: "BHCL", sector: "Hydro Power" },
  { name: "Him Star Urja Company Limited", symbol: "HIMSTAR", sector: "Hydro Power" },
  { name: "Mabilung Energy Limited", symbol: "MABEL", sector: "Hydro Power" },
  { name: "Daramkhola Hydro Energy Limited", symbol: "DHEL", sector: "Hydro Power" },
  { name: "Bungal Hydro Limited", symbol: "BUNGAL", sector: "Hydro Power" },
  { name: "Salt Trading Corporation", symbol: "STC", sector: "Tradings" },
  { name: "Bishal Bazar Company Limited", symbol: "BBC", sector: "Tradings" },
  { name: "Nirdhan Utthan Laghubitta Bittiya Sanstha Limited", symbol: "NUBL", sector: "Microfinance" },
  { name: "Chhimek Laghubitta Bittiya Sanstha Limited", symbol: "CBBL", sector: "Microfinance" },
  { name: "Deprosc Laghubitta Bittiya Sanstha Limited", symbol: "DDBL", sector: "Microfinance" },
  { name: "Swabalamban Laghubitta Bittiya Sanstha Limited", symbol: "SWBBL", sector: "Microfinance" },
  { name: "Nerude Mirmire Laghubitta Bittiya Sanstha Limited", symbol: "NMLBBL", sector: "Microfinance" },
  { name: "First Micro Finance Laghubitta Bittiya Sanstha Limited", symbol: "FMDBL", sector: "Microfinance" },
  { name: "Swarojgar Laghubitta Bittiya Sanstha Ltd.", symbol: "SLBBL", sector: "Microfinance" },
  { name: "Sana Kisan Bikas Laghubitta Bittiya Sanstha Limited", symbol: "SKBBL", sector: "Microfinance" },
  { name: "Grameen Bikas Laghubitta Bittiya Sanstha Ltd.", symbol: "GBLBS", sector: "Microfinance" },
  { name: "Kalika Laghubitta Bittiya Sanstha Ltd", symbol: "KMCDB", sector: "Microfinance" },
  { name: "Mithila LaghuBitta Bittiya Sanstha Limited", symbol: "MLBBL", sector: "Microfinance" },
  { name: "Laxmi Laghubitta Bittiya Sanstha Ltd.", symbol: "LLBS", sector: "Microfinance" },
  { name: "Vijaya laghubitta Bittiya Sanstha Ltd.", symbol: "VLBS", sector: "Microfinance" },
  { name: "Himalayan Laghubitta Bittiya Sanstha Limited", symbol: "HLBSL", sector: "Microfinance" },
  { name: "Matribhumi Lagubitta Bittiya Sanstha Limited", symbol: "MATRI", sector: "Microfinance" },
  { name: "Janautthan Samudayic Laghubitta Bittya Sanstha Limited", symbol: "JSLBB", sector: "Microfinance" },
  { name: "NMB Microfinance Bittiya Sanstha Ltd.", symbol: "NMBMF", sector: "Microfinance" },
  { name: "Global IME Laghubitta Bittiya Sanstha Ltd.", symbol: "GILB", sector: "Microfinance" },
  { name: "Suryodaya Womi Laghubitta Bittiya Sanstha Limited", symbol: "SWMF", sector: "Microfinance" },
  { name: "Mero Microfinance Bittiya Sanstha Ltd.", symbol: "MERO", sector: "Microfinance" },
  { name: "National Laghubitta Bittiya Sanstha Limited", symbol: "NMFBS", sector: "Microfinance" },
  { name: "RSDC Laghubitta Bittiya Sanstha Ltd.", symbol: "RSDC", sector: "Microfinance" },
  { name: "Forward Microfinance Laghubitta Bittiya Sanstha Limited", symbol: "FOWAD", sector: "Microfinance" },
  { name: "Samata Gharelu Laghubitta Bittiya Sanstha Limited", symbol: "SMATA", sector: "Microfinance" },
  { name: "Mahuli Laghubitta Bittiya Sanstha Limited", symbol: "MSLB", sector: "Microfinance" },
  { name: "Support Microfinance Bittiya Sanstha Ltd.", symbol: "SMB", sector: "Microfinance" },
  { name: "Unnati Sahakarya Laghubitta Bittiya Sanstha Limited", symbol: "USLB", sector: "Microfinance" },
  { name: "Wean Nepal Laghubitta Bittiya Sanstha Limited", symbol: "WNLB", sector: "Microfinance" },
  { name: "Nadep Laghubittiya bittya Sanstha Ltd.", symbol: "NADEP", sector: "Microfinance" },
  { name: "Aarambha Chautari Laghubitta Bittiya Sanstha Limited", symbol: "ACLBSL", sector: "Microfinance" },
  { name: "Samudayic Laghubitta Bittiya Sanstha Limited", symbol: "SLBSL", sector: "Microfinance" },
  { name: "Asha Laghubitta Bittiya Sanstha Ltd", symbol: "ALBSL", sector: "Microfinance" },
  { name: "Ganapati Laghubitta Bittiya Sanstha Limited", symbol: "GMFBS", sector: "Microfinance" },
  { name: "Gurans Laghubitta Bittiya Sanstha Limited", symbol: "GLBSL", sector: "Microfinance" },
  { name: "Swabhimaan Laghubitta Bittiya Sanstha Limited", symbol: "SMFBS", sector: "Microfinance" },
  { name: "Infinity Laghubitta Bittiya Sanstha Limited", symbol: "ILBS", sector: "Microfinance" },
  { name: "NIC ASIA Laghubitta Bittiya Sanstha Limited", symbol: "NICLBSL", sector: "Microfinance" },
  { name: "Sampada Laghubitta Bittiya Sanstha Limited", symbol: "SMPDA", sector: "Microfinance" },
  { name: "Mahila Lagubitta Bittiya Sanstha Limited", symbol: "MLBSL", sector: "Microfinance" },
  { name: "Jeevan Bikas Laghubitta Bittya Sanstha Ltd", symbol: "JBLB", sector: "Microfinance" },
  { name: "Manushi Laghubitta Bittiya Sanstha Limited", symbol: "MLBS", sector: "Microfinance" },
  { name: "NESDO Sambridha Laghubitta Bittiya Sanstha Limited", symbol: "NESDO", sector: "Microfinance" },
  { name: "Upakar Laghubitta Bittiya Sanstha Limited", symbol: "ULBSL", sector: "Microfinance" },
  { name: "CYC Nepal Laghubitta Bittiya Sanstha Limited", symbol: "CYCL", sector: "Microfinance" },
  { name: "Aviyan Laghubitta Bittiya Sanstha Limited", symbol: "AVYAN", sector: "Microfinance" },
  { name: "Dhaulagiri Laghubitta Bittiya Sanstha Limited", symbol: "DLBS", sector: "Microfinance" },
  { name: "Shrijanshil Laghubitta Bittiya Sanstha Limited", symbol: "SHLB", sector: "Microfinance" },
  { name: "Unique Nepal Laghubitta Bittiya Sanstha Limited", symbol: "UNLB", sector: "Microfinance" },
  { name: "Aatmanirbhar Laghubitta Bittiya Sanstha Limited", symbol: "ANLB", sector: "Microfinance" },
  { name: "Swastik Laghubitta Bittiya Sanstha Limited", symbol: "SWASTIK", sector: "Microfinance" },
  { name: "Narayani Development Bank Limited", symbol: "NABBC", sector: "Development Banks" },
  { name: "Excel Development Bank Ltd.", symbol: "EDBL", sector: "Development Banks" },
  { name: "Lumbini Bikas Bank Ltd.", symbol: "LBBL", sector: "Development Banks" },
  { name: "Miteri Development Bank Limited", symbol: "MDB", sector: "Development Banks" },
  { name: "Mahalaxmi Bikas Bank Ltd.", symbol: "MLBL", sector: "Development Banks" },
  { name: "Garima Bikas Bank Limited", symbol: "GBBL", sector: "Development Banks" },
  { name: "Jyoti Bikas Bank Limited", symbol: "JBBL", sector: "Development Banks" },
  { name: "Corporate Development Bank Limited", symbol: "CORBL", sector: "Development Banks" },
  { name: "Kamana Sewa Bikas Bank Limited", symbol: "KSBBL", sector: "Development Banks" },
  { name: "Shangrila Development Bank Ltd.", symbol: "SADBL", sector: "Development Banks" },
  { name: "Shine Resunga Development Bank Ltd.", symbol: "SHINE", sector: "Development Banks" },
  { name: "Muktinath Bikas Bank Ltd.", symbol: "MNBBL", sector: "Development Banks" },
  { name: "Sindhu Bikash Bank Ltd", symbol: "SINDU", sector: "Development Banks" },
  { name: "Green Development Bank Ltd.", symbol: "GRDBL", sector: "Development Banks" },
  { name: "Saptakoshi Development Bank Ltd", symbol: "SAPDBL", sector: "Development Banks" },
  { name: "Nepal Insurance Co. Ltd.", symbol: "NICL", sector: "Non Life Insurance" },
  { name: "Rastriya Beema Company Limited", symbol: "RBCL", sector: "Non Life Insurance" },
  { name: "Himalayan Everest Insurance Limited", symbol: "HEI", sector: "Non Life Insurance" },
  { name: "United Ajod Insurance Limited", symbol: "UAIL", sector: "Non Life Insurance" },
  { name: "Siddhartha Premier Insurance Limited", symbol: "SPIL", sector: "Non Life Insurance" },
  { name: "Neco Insurance Limited", symbol: "NIL", sector: "Non Life Insurance" },
  { name: "Prabhu Insurance Ltd.", symbol: "PRIN", sector: "Non Life Insurance" },
  { name: "Sagarmatha Lumbini Insurance Co. Limited", symbol: "SALICO", sector: "Non Life Insurance" },
  { name: "IGI Prudential insurance Limited", symbol: "IGI", sector: "Non Life Insurance" },
  { name: "Shikhar Insurance Co. Ltd.", symbol: "SICL", sector: "Non Life Insurance" },
  { name: "NLG Insurance Company Ltd.", symbol: "NLG", sector: "Non Life Insurance" },
  { name: "Sanima GIC Insurance Limited", symbol: "SGIC", sector: "Non Life Insurance" },
  { name: "Nepal Micro Insurance Company Limited", symbol: "NMIC", sector: "Non Life Insurance" },
  { name: "National Life Insurance Co. Ltd.", symbol: "NLICL", sector: "Life Insurance" },
  { name: "Nepal Life Insurance Co. Ltd.", symbol: "NLIC", sector: "Life Insurance" },
  { name: "Life Insurance Corporation (Nepal) Limited", symbol: "LICN", sector: "Life Insurance" },
  { name: "Asian Life Insurance Co. Limited", symbol: "ALICL", sector: "Life Insurance" },
  { name: "Himalayan Life Insurance Limited", symbol: "HLI", sector: "Life Insurance" },
  { name: "SuryaJyoti Life Insurance Company Limited", symbol: "SJLIC", sector: "Life Insurance" },
  { name: "Prabhu Mahalaxmi Life Insurance Limited", symbol: "PMLI", sector: "Life Insurance" },
  { name: "Sanima Reliance Life Insurance Limited", symbol: "SRLI", sector: "Life Insurance" },
  { name: "IME Life Insurance Company Limited", symbol: "ILI", sector: "Life Insurance" },
  { name: "Reliable Nepal Life Insurance Limited", symbol: "RNLI", sector: "Life Insurance" },
  { name: "Sun Nepal Life Insurance Company Limited", symbol: "SNLI", sector: "Life Insurance" },
  { name: "Citizen Life Insurance Company Limited", symbol: "CLI", sector: "Life Insurance" },
  { name: "Guardian Micro Life Insurance Limited", symbol: "GMLI", sector: "Life Insurance" },
  { name: "Crest Micro Life Insurance Limited", symbol: "CREST", sector: "Life Insurance" },
  { name: "Nepal Finance Ltd.", symbol: "NFS", sector: "Finance" },
  { name: "Gurkhas Finance Ltd.", symbol: "GUFL", sector: "Finance" },
  { name: "Best Finance Company Ltd.", symbol: "BFC", sector: "Finance" },
  { name: "Goodwill Finance Limited", symbol: "GFCL", sector: "Finance" },
  { name: "Pokhara Finance Ltd.", symbol: "PFL", sector: "Finance" },
  { name: "Shree Investment Finance Co. Ltd.", symbol: "SIFC", sector: "Finance" },
  { name: "Central Finance Co. Ltd.", symbol: "CFCL", sector: "Finance" },
  { name: "Janaki Finance Company Limited", symbol: "JFL", sector: "Finance" },
  { name: "Samriddhi Finance Company Limited", symbol: "SFCL", sector: "Finance" },
  { name: "Guheshowori Merchant Bank & Finance Co. Ltd.", symbol: "GMFIL", sector: "Finance" },
  { name: "ICFC Finance Limited", symbol: "ICFC", sector: "Finance" },
  { name: "Progressive Finance Limited", symbol: "PROFL", sector: "Finance" },
  { name: "Multipurpose Finance Company Limited", symbol: "MPFL", sector: "Finance" },
  { name: "Manjushree Finance Ltd.", symbol: "MFIL", sector: "Finance" },
  { name: "Reliance Finance Ltd.", symbol: "RLFL", sector: "Finance" },
  { name: "Bottlers Nepal (Balaju) Limited", symbol: "BNL", sector: "Manufacturing And Processing" },
  { name: "Nepal Lube Oil Limited", symbol: "NLO", sector: "Manufacturing And Processing" },
  { name: "Bottlers Nepal (Terai) Limited", symbol: "BNT", sector: "Manufacturing And Processing" },
  { name: "Unilever Nepal Limited", symbol: "UNL", sector: "Manufacturing And Processing" },
  { name: "Himalayan Distillery Limited", symbol: "HDL", sector: "Manufacturing And Processing" },
  { name: "SHIVAM CEMENTS LTD", symbol: "SHIVM", sector: "Manufacturing And Processing" },
  { name: "Ghorahi Cement Industry Limited", symbol: "GCIL", sector: "Manufacturing And Processing" },
  { name: "Sonapur Minerals And Oil Limited", symbol: "SONA", sector: "Manufacturing And Processing" },
  { name: "Sarbottam Cement Limited", symbol: "SARBTM", sector: "Manufacturing And Processing" },
  { name: "Om Megashree Pharmaceuticals Limited", symbol: "OMPL", sector: "Manufacturing And Processing" },
  { name: "Sagar Distillery Limited", symbol: "SAGAR", sector: "Manufacturing And Processing" },
  { name: "Shreenagar Agritech Industries Limited", symbol: "SAIL", sector: "Manufacturing And Processing" },
  { name: "SY Panel Nepal Limited", symbol: "SYPNL", sector: "Manufacturing And Processing" },
  { name: "Citizen Investment Trust", symbol: "CIT", sector: "Investment" },
  { name: "Hydorelectricity Investment and Development Company Ltd", symbol: "HIDCL", sector: "Investment" },
  { name: "NRN Infrastructure and Development Limited", symbol: "NRN", sector: "Investment" },
  { name: "Nepal Infrastructure Bank Limited", symbol: "NIFRA", sector: "Investment" },
  { name: "CEDB Holdings Limited", symbol: "CHDC", sector: "Investment" },
  { name: "Emerging Nepal Limited", symbol: "ENL", sector: "Investment" },
  { name: "Hathway Investment Nepal Limited", symbol: "HATHY", sector: "Investment" },
  { name: "Nepal Doorsanchar Company Limited", symbol: "NTC", sector: "Others" },
  { name: "Nepal Reinsurance Company Limited", symbol: "NRIC", sector: "Others" },
  { name: "Nepal Republic Media Limited", symbol: "NRM", sector: "Others" },
  { name: "Muktinath Krishi Company Limited", symbol: "MKCL", sector: "Others" },
  { name: "Nepal Warehousing Company Limited", symbol: "NWCL", sector: "Others" },
  { name: "Himalayan Reinsurance Limited", symbol: "HRL", sector: "Others" },
  { name: "Pure Energy Limited", symbol: "PURE", sector: "Others" },
  { name: "Trade Tower Limited", symbol: "TTL", sector: "Others" },
  { name: "Jhapa Energy Limited", symbol: "JHAPA", sector: "Others" }
];

const STORAGE_KEY = "selectedTheme";

// Crosshair Plugin for Price/Date Labels
const crosshairPlugin = {
  id: 'crosshair',
  afterInit: (chart) => {
    chart.crosshair = { x: null, y: null };
  },
  afterEvent: (chart, args) => {
    const {type} = args.event;
    const {chartArea} = chart;
    
    if (type === 'mousemove' || type === 'mouseout') {
        if (type === 'mousemove') {
          const {x, y} = args.event;
          if (chartArea && x >= chartArea.left && x <= chartArea.right && y >= chartArea.top && y <= chartArea.bottom) {
            chart.crosshair.x = x;
            chart.crosshair.y = y;
          } else {
            chart.crosshair.x = null;
            chart.crosshair.y = null;
          }
       } else {
         chart.crosshair.x = null;
         chart.crosshair.y = null;
       }
       chart.draw();
    }
  },
  afterDraw: (chart, args, options) => {
    if (!chart.crosshair || chart.crosshair.x === null || !chart.chartArea) return;
    
    const {ctx, chartArea: {top, bottom, left, right}, scales: {x, y}} = chart;
    const {x: mouseX, y: mouseY} = chart.crosshair;

    ctx.save();
    
    // Draw vertical/horizontal lines
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = options.color || 'rgba(148, 163, 184, 0.5)';
    
    // Vertical
    ctx.moveTo(mouseX, top);
    ctx.lineTo(mouseX, bottom);
    // Horizontal
    ctx.moveTo(left, mouseY);
    ctx.lineTo(right, mouseY);
    ctx.stroke();

    // Axis Labels
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const labelBg = isDark ? "#1e293b" : "#ffffff";
    const labelText = isDark ? "#f8fafc" : "#0f172a";
    const font = '11px "Inter", sans-serif';
    // X Label (Date)
    const xVal = x.getValueForPixel(mouseX);
    let xText = "";
    
    try {
      if (chart.data.labels && chart.data.labels.length > 0) {
        const xIndex = Math.round(xVal);
        if (xIndex >= 0 && xIndex < chart.data.labels.length) {
          xText = chart.data.labels[xIndex];
        }
      } else if (x.getLabelForValue) {
        xText = x.getLabelForValue(xVal);
      }
    } catch (e) {
      console.warn("Crosshair X-label error:", e);
    }
    
    if (xText) {
      ctx.font = font;
      const xPadding = 8;
      const textWidth = ctx.measureText(xText).width;
      const rectW = textWidth + xPadding * 2;
      const rectH = 22;
      
      ctx.fillStyle = labelBg;
      ctx.fillRect(mouseX - rectW / 2, bottom, rectW, rectH);
      ctx.strokeStyle = options.color;
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeRect(mouseX - rectW / 2, bottom, rectW, rectH);
      
      ctx.fillStyle = labelText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(xText, mouseX, bottom + rectH / 2);
    }

    // Y Label (Price)
    const val = y.getValueForPixel(mouseY);
    const yVal = val.toFixed(2);
    
    ctx.font = font;
    const yPadding = 8;
    const yTextWidth = ctx.measureText(yVal).width;
    const yRectW = yTextWidth + yPadding * 2;
    const yRectH = 22;

    ctx.fillStyle = labelBg;
    ctx.fillRect(right, mouseY - yRectH / 2, yRectW, yRectH);
    ctx.strokeStyle = options.color;
    ctx.strokeRect(right, mouseY - yRectH / 2, yRectW, yRectH);

    ctx.fillStyle = labelText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(yVal, right + yPadding, mouseY);

    ctx.restore();
  }
};

// Register Plugins globally once
if (typeof ChartZoom !== 'undefined') {
  Chart.register(ChartZoom);
}
if (typeof ChartAnnotation !== 'undefined') {
  Chart.register(ChartAnnotation);
}

// Financial components will be registered by the inline script in index.html
// This ensures proper load order

Chart.register(crosshairPlugin);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Advance TA page loaded");

  const sectorSelect = document.getElementById("sectorSelect");
  const symbolSelect = document.getElementById("symbolSelect");
  const symbolDisplay = document.getElementById("symbolDisplay");
  const resetBtn = document.getElementById("resetFilters");
  const searchBtn = document.getElementById("searchBtn");
  const themeButtons = document.querySelectorAll(".theme-btn");
  let priceChart = null;
  let lastFetchedData = null;
  let currentSymbol = "";
  let comparisonSymbol = "";
  let comparisonData = null;
  let isComparisonMode = false;
  let currentChartType = "Line Chart"; // Default to Line Chart as requested
  let showSR = true; // S&R toggle state
  let showVolume = true; // Volume toggle state
  let showEMA20 = false; // EMA 20 toggle state
  let showEMA50 = false; // EMA 50 toggle state

  // Initialize Theme
  initTheme();
  
  // Initialize filters
  initFilters();

  // Fetch Market Turnover
  fetchMarketTurnover();

  async function fetchMarketTurnover() {
    const turnoverEl = document.querySelector(".turnover");
    const volumeEl = document.querySelector(".volume");

    try {
      const response = await fetch("https://nepsehub-production.up.railway.app/market-turnover");
      if (!response.ok) throw new Error("Failed to fetch turnover");
      
      const data = await response.json();
      if (data && data.totalTurnover) {
        const turnover = data.totalTurnover.totalTradedValue || 0;
        const volume = data.totalTurnover.totalTradedQuantity || 0;

        if (turnoverEl) turnoverEl.textContent = "Rs. " + turnover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (volumeEl) volumeEl.textContent = volume.toLocaleString() + " Kitta";
      }
    } catch (error) {
      console.error("Error fetching market turnover:", error);
    }
  }

  function initTheme() {
    // Read saved theme or fallback to light (as requested)
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "light";
    applyTheme(savedTheme);

    // Theme toggle click handlers
    themeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(btn.getAttribute("data-theme"));
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-theme") === theme);
    });
    localStorage.setItem(STORAGE_KEY, theme);

    // Update chart theme if it exists
    if (priceChart) {
      updateChartTheme();
    }
  }

  function updateChartTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    priceChart.options.scales.x.grid.color = gridColor;
    priceChart.options.scales.y.grid.color = gridColor;
    priceChart.options.scales.x.ticks.color = textColor;
    priceChart.options.scales.y.ticks.color = textColor;
    priceChart.update();
  }

  function initFilters() {
    // Populate unique sectors
    const sectors = [...new Set(MARKET_DATA.map((item) => item.sector))].sort();
    sectors.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector;
      option.textContent = sector;
      sectorSelect.appendChild(option);
    });

    // Populate all symbols initially
    updateSymbols("");

    // Event Listeners
    sectorSelect.addEventListener("change", (e) => {
      updateSymbols(e.target.value);
    });

    symbolSelect.addEventListener("change", (e) => {
      symbolDisplay.value = e.target.value;
    });

    resetBtn.addEventListener("click", () => {
      sectorSelect.value = "";
      updateSymbols("");
      symbolDisplay.value = "";
    });

    searchBtn.addEventListener("click", () => {
      const symbol = symbolDisplay.value;
      if (symbol) {
        fetchSymbolData(symbol);
      } else {
        alert("Please select a symbol first.");
      }
    });

    const compareBtn = document.getElementById("compareBtn");
    if (compareBtn) {
      compareBtn.addEventListener("click", async () => {
        if (!currentSymbol) {
          alert("Please load a primary symbol first.");
          return;
        }

        if (isComparisonMode) {
          isComparisonMode = false;
          comparisonSymbol = "";
          comparisonData = null;
          compareBtn.classList.remove("active");
          renderPriceChart(currentSymbol, lastFetchedData);
          return;
        }

        const symbolToCompare = prompt("Enter symbol to compare (e.g. NABIL, UPPER):");
        if (symbolToCompare && symbolToCompare.toUpperCase() !== currentSymbol.toUpperCase()) {
          await fetchComparisonData(symbolToCompare.toUpperCase());
        }
      });
    }
  }

  async function fetchComparisonData(symbol) {
    try {
      const url = `https://web-production-2c746.up.railway.app/api/symbol-data?symbol=${symbol}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Symbol not found");
      
      const data = await response.json();
      if (data.success && data.data && data.data.data) {
        comparisonSymbol = symbol;
        comparisonData = data.data.data;
        isComparisonMode = true;
        document.getElementById("compareBtn").classList.add("active");
        renderPriceChart(currentSymbol, lastFetchedData);
      }
    } catch (error) {
      alert("Could not load comparison data: " + error.message);
    }
  }

  async function fetchSymbolData(symbol) {
    const placeholder = document.querySelector(".chart-placeholder");
    if (placeholder) {
      placeholder.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <p>Fetching data for <strong>${symbol}</strong>...</p>
      `;
    }

    try {
      const url = `https://web-production-2c746.up.railway.app/api/symbol-data?symbol=${symbol}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API Limit reached or Symbol not found");
      
      const data = await response.json();

      if (data.success && data.data && data.data.data) {
        if (placeholder) placeholder.style.display = "none";
        document.getElementById("priceChart").style.display = "block";
        lastFetchedData = data.data.data;
        currentSymbol = symbol;
        renderPriceChart(symbol, lastFetchedData);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      if (placeholder) {
        placeholder.innerHTML = `
          <i class="fas fa-exclamation-triangle" style="color: #ef4444"></i>
          <p>Failed to load data for <strong>${symbol}</strong>.<br> Please try again later.</p>
        `;
      }
    }
  }

  function calculateAdvancedSRZones(chartData) {
    if (!chartData || chartData.length < 30) return [];

    const data = [...chartData].reverse(); // Oldest to newest
    const N = 3; // Swing window
    
    // 1. Identify Swing Points
    const swingHighs = [];
    const swingLows = [];

    for (let i = N; i < data.length - N; i++) {
        const currentHigh = parseFloat(data[i].High);
        const currentLow = parseFloat(data[i].Low);
        let isSwingHigh = true;
        let isSwingLow = true;

        for (let j = 1; j <= N; j++) {
            if (parseFloat(data[i - j].High) >= currentHigh || parseFloat(data[i + j].High) >= currentHigh) isSwingHigh = false;
            if (parseFloat(data[i - j].Low) <= currentLow || parseFloat(data[i + j].Low) <= currentLow) isSwingLow = false;
        }

        if (isSwingHigh) swingHighs.push({ price: currentHigh, index: i, volume: parseFloat(data[i].Volume) });
        if (isSwingLow) swingLows.push({ price: currentLow, index: i, volume: parseFloat(data[i].Volume) });
    }

    // 2. Clustering into Zones
    const clusterPoints = (points, type) => {
        if (points.length === 0) return [];
        const sorted = [...points].sort((a, b) => a.price - b.price);
        const clusters = [];
        let currentCluster = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            const avg = currentCluster.reduce((sum, p) => sum + p.price, 0) / currentCluster.length;
            if ((sorted[i].price - avg) / avg < 0.01) { // 1% tolerance
                currentCluster.push(sorted[i]);
            } else {
                clusters.push(currentCluster);
                currentCluster = [sorted[i]];
            }
        }
        clusters.push(currentCluster);

        return clusters.map(cluster => {
            const min = Math.min(...cluster.map(p => p.price));
            const max = Math.max(...cluster.map(p => p.price));
            return {
                type,
                min,
                max,
                points: cluster,
                touchCount: cluster.length,
                score: 0
            };
        });
    };

    let zones = [...clusterPoints(swingHighs, 'resistance'), ...clusterPoints(swingLows, 'support')];

    const currentPrice = parseFloat(data[data.length - 1].Close);
    const avgVol = data.reduce((sum, d) => sum + parseFloat(d.Volume), 0) / data.length;

    // 3 & 4. Validate & Score
    zones.forEach(zone => {
        let reactionScore = 0;
        let volScore = 0;

        // Reaction size after swing points
        zone.points.forEach(p => {
            const lookback = 10;
            if (p.index + lookback < data.length) {
                const move = Math.abs(parseFloat(data[p.index + lookback].Close) - p.price) / p.price;
                reactionScore += move;
            }
            if (p.volume > avgVol * 1.5) volScore += 1;
        });

        // Round number bonus
        let psychBonus = 0;
        [100, 500, 1000, 1500, 2000, 2500, 3000].forEach(rn => {
            if (rn >= zone.min && rn <= zone.max) psychBonus = 2;
        });

        zone.score = (zone.touchCount * 2) + (reactionScore * 15) + volScore + psychBonus;
        
        // Status Flip Logic
        if (currentPrice > zone.max) zone.currentStatus = 'support';
        else if (currentPrice < zone.min) zone.currentStatus = 'resistance';
        else zone.currentStatus = 'active_zone';
    });

    // Sort by strength and pick top 6 (3S, 3R)
    const finalSupports = zones.filter(z => z.currentStatus === 'support').sort((a,b) => b.score - a.score).slice(0,3);
    const finalResistances = zones.filter(z => z.currentStatus === 'resistance').sort((a,b) => b.score - a.score).slice(0,3);
    const activeZones = zones.filter(z => z.currentStatus === 'active_zone').slice(0,1);

    return [...finalSupports, ...finalResistances, ...activeZones];
  }

  function calculateEMA(data, period) {
    if (data.length < period) return Array(data.length).fill(null);
    const k = 2 / (period + 1);
    const emaArray = Array(data.length).fill(null);
    
    // Simple SMA for first EMA point
    let firstSMA = 0;
    for (let i = 0; i < period; i++) {
        firstSMA += data[i];
    }
    emaArray[period - 1] = firstSMA / period;

    for (let i = period; i < data.length; i++) {
        if (data[i] === null || emaArray[i - 1] === null) {
            emaArray[i] = emaArray[i - 1];
        } else {
            emaArray[i] = (data[i] - emaArray[i - 1]) * k + emaArray[i - 1];
        }
    }
    return emaArray;
  }

  function renderPriceChart(symbol, chartData) {
    const ctx = document.getElementById("priceChart").getContext("2d");

    // Reverse data
    const rawData = [...chartData].reverse();
    const rawCompData = isComparisonMode && comparisonData ? [...comparisonData].reverse() : null;

    // Date Unification Logic
    const allDates = new Set();
    rawData.forEach(d => allDates.add(d.Date.split('T')[0]));
    if (rawCompData) {
      rawCompData.forEach(d => allDates.add(d.Date.split('T')[0]));
    }
    
    // Create sorted master labels
    const masterLabels = Array.from(allDates).sort();
    
    const priceMap = new Map(rawData.map(d => [d.Date.split('T')[0], d]));

    const primaryPrices = masterLabels.map(date => {
      const d = priceMap.get(date);
      return d ? parseFloat(d.Close) : null;
    });

    const candleData = masterLabels.map(date => {
      const d = priceMap.get(date);
      if (!d) return null;
      // Using native Date for better compatibility
      const timestamp = new Date(d.Date).getTime();
      return {
        x: timestamp,
        o: parseFloat(d.Open),
        h: parseFloat(d.High),
        l: parseFloat(d.Low),
        c: parseFloat(d.Close)
      };
    }).filter(d => d !== null); // Remove null entries

    let compPrices = null;
    if (rawCompData) {
      compPrices = masterLabels.map(date => {
        const point = rawCompData.find(d => d.Date.split('T')[0] === date);
        return point ? parseFloat(point.Close) : null;
      });
    }

    // Add buffer points for trading-view style gap
    const BUFFER_SIZE = 30;
    const finalLabels = [...masterLabels];
    const finalPrimaryPrices = [...primaryPrices];
    const finalCompPrices = compPrices ? [...compPrices] : null;
    // Don't add buffer to candlestick data - it breaks the chart
    const finalCandleData = candleData;

    // Map volume to master labels
    const volumeData = masterLabels.map(date => {
      const d = priceMap.get(date);
      return d ? parseFloat(d.Volume) : 0;
    });
    const finalVolume = [...volumeData];

    // Only add buffer points for non-candlestick data
    for (let i = 0; i < BUFFER_SIZE; i++) {
      finalLabels.push("");
      finalPrimaryPrices.push(null);
      if (finalCompPrices) finalCompPrices.push(null);
      finalVolume.push(null);
      // DO NOT add buffer to finalCandleData
    }

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-primary").trim() || "#4f46e5";
    const textColor = isDark ? "#1e2022ff" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    // Default view: last 400 points
    let displayCount = 400;
    const initialMin = Math.max(0, finalLabels.length - displayCount);

    // Millisecond-based bounds for Time Scale
    const lastDataDate = masterLabels[masterLabels.length - 1];
    const lastTime = new Date(lastDataDate).getTime();
    const finalMaxMs = lastTime + (BUFFER_SIZE * 24 * 60 * 60 * 1000); // Add 30 days buffer
    const startTimeStr = masterLabels[Math.max(0, masterLabels.length - displayCount)];
    const initialMinMs = new Date(startTimeStr).getTime();

    let datasets = [];
    if (isComparisonMode && finalCompPrices) {
       const mappedPrimary = currentChartType === "Candlestick Chart"
         ? finalPrimaryPrices.map((v, i) => v !== null ? { x: new Date(masterLabels[i]).getTime(), y: v } : null).filter(d => d !== null)
         : finalPrimaryPrices;
         
       const mappedComp = currentChartType === "Candlestick Chart"
         ? finalCompPrices.map((v, i) => v !== null ? { x: new Date(masterLabels[i]).getTime(), y: v } : null).filter(d => d !== null)
         : finalCompPrices;

       datasets = [
         {
           label: `${symbol} (LTP)`,
           data: mappedPrimary,
           borderColor: accentColor,
           backgroundColor: "transparent",
           borderWidth: 2,
           pointRadius: 0,
           tension: 0,
           fill: false
         },
         {
           label: `${comparisonSymbol} (LTP)`,
           data: mappedComp,
           borderColor: "#ef4444",
           backgroundColor: "transparent",
           borderWidth: 2,
           pointRadius: 0,
           tension: 0,
           fill: false
         }
       ];
    } else {
       if (currentChartType === "Candlestick Chart") {
         console.log('=== CANDLESTICK DATA DEBUG ===');
         console.log('Total candlestick points:', finalCandleData.length);
         console.log('First 3 points:', finalCandleData.slice(0, 3));
         console.log('Last 3 points:', finalCandleData.slice(-3));
         
         // Check for null values
         const nullCount = finalCandleData.filter(d => d === null).length;
         console.log('Null values in dataset:', nullCount);
         
         // Check for invalid data
         const invalidData = finalCandleData.filter(d => {
           if (!d) return true;
           return !d.x || isNaN(d.o) || isNaN(d.h) || isNaN(d.l) || isNaN(d.c);
         });
         console.log('Invalid data points:', invalidData.length, invalidData.slice(0, 3));
         
         datasets.push({
           label: `${symbol} (OHLC)`,
           type: 'candlestick',
           data: finalCandleData,
           order: 1
         });
         console.log('Candlestick dataset created with', finalCandleData.length, 'data points');
       } else {
         const isArea = currentChartType === "Area";
         const isBars = currentChartType === "Bars";
         
         datasets.push({
            label: `${symbol} Close Price`,
            data: finalPrimaryPrices,
            borderColor: accentColor,
            backgroundColor: isArea ? (context) => {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              const baseColor = accentColor === '#6366f1' ? '99, 102, 241' : '79, 70, 229';
              gradient.addColorStop(0, `rgba(${baseColor}, 0.2)`);
              gradient.addColorStop(1, "transparent");
              return gradient;
            } : (isBars ? `rgba(${accentColor === '#6366f1' ? '99, 102, 241' : '79, 70, 229'}, 0.5)` : "transparent"),
            borderWidth: isBars ? 1 : 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: (isBars || currentChartType === "Line Chart") ? 0 : 0.1,
            fill: isArea,
            spanGaps: false,
            order: 1
          });
       }
    }

    // Add Volume Dataset if enabled (but not for candlestick charts - causes data conflicts)
    if (showVolume && !isComparisonMode && currentChartType !== "Candlestick Chart") {
      datasets.push({
        label: "Volume",
        type: "bar",
        data: finalVolume,
        backgroundColor: "rgba(59, 130, 246, 0.4)",
        borderColor: "rgba(59, 130, 246, 0.7)",
        borderWidth: 1,
        yAxisID: "yVolume",
        order: 2
      });
    }

    // Add EMA Datasets if enabled
    if (!isComparisonMode) {
      const closePrices = masterLabels.map(date => {
          const d = priceMap.get(date);
          return d ? parseFloat(d.Close) : null;
      });

      if (showEMA20) {
        const ema20Raw = calculateEMA(closePrices, 20);
        const ema20Data = currentChartType === "Candlestick Chart" 
          ? ema20Raw.map((v, i) => v !== null ? { x: new Date(masterLabels[i]).getTime(), y: v } : null).filter(d => d !== null)
          : ema20Raw;

        datasets.push({
          label: "EMA 20",
          type: "line",
          data: ema20Data,
          borderColor: "#a855f7",
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          order: 0 // In front
        });
      }

      if (showEMA50) {
          const ema50Raw = calculateEMA(closePrices, 50);
          const ema50Data = currentChartType === "Candlestick Chart" 
            ? ema50Raw.map((v, i) => v !== null ? { x: new Date(masterLabels[i]).getTime(), y: v } : null).filter(d => d !== null)
            : ema50Raw;

        datasets.push({
          label: "EMA 50",
          type: "line",
          data: ema50Data,
          borderColor: "#f97316",
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          order: 0
        });
      }
    }
    if (priceChart) {
      priceChart.destroy();
      priceChart = null;
    }

    // Comprehensive check for candlestick support
    console.log('=== CHART RENDERING DEBUG ===');
    console.log('Current Chart Type:', currentChartType);
    console.log('Chart.controllers available:', Object.keys(Chart.controllers || {}));
    
    let chartType = "line";
    let shouldUseCandlestick = false;
    
    if (currentChartType === "Candlestick Chart") {
      // Check multiple possible ways the controller might be registered
      const canRenderCandles = 
        (typeof Chart.controllers.candlestick !== 'undefined') ||
        (typeof Chart.controllers.Candlestick !== 'undefined') ||
        (Chart.registry && Chart.registry.getController && Chart.registry.getController('candlestick'));
      
      console.log('Candlestick Controller Available:', canRenderCandles);
      
      if (canRenderCandles) {
        chartType = "candlestick";
        shouldUseCandlestick = true;
        console.log('✓ Using Candlestick chart');
      } else {
        console.warn('⚠ Candlestick controller not found, falling back to Line');
        currentChartType = "Line Chart";
        // Reset buttons
        const lb = document.getElementById("lineChartBtn");
        const cb = document.getElementById("candleChartBtn");
        if (lb) lb.classList.add("active");
        if (cb) cb.classList.remove("active");
      }
    }
    
    console.log('Final Chart Type:', chartType);
    console.log('Dataset Count:', datasets.length);
    if (shouldUseCandlestick) {
      console.log('Candlestick Data Sample:', finalCandleData.slice(0, 3).filter(d => d !== null));
    }

    priceChart = new Chart(ctx, {
      type: chartType,
      plugins: shouldUseCandlestick ? [] : [crosshairPlugin], // Disable crosshair for candlestick to avoid chartArea errors
      data: {
        labels: currentChartType === "Candlestick Chart" ? null : finalLabels,
        datasets: datasets
      },
      options: {
        parsing: currentChartType === "Candlestick Chart" ? false : true,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 0
          }
        },
        plugins: {
          legend: { display: isComparisonMode },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            titleColor: isDark ? "#f8fafc" : "#0f172a",
            bodyColor: isDark ? "#f8fafc" : "#0f172a",
            borderColor: gridColor,
            borderWidth: 1
          },
          annotation: {
            annotations: {}
          },
          crosshair: {
            color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'rgba(71, 85, 105, 0.8)'
          },
          zoom: {
            pan: { 
              enabled: true, 
              mode: 'x', 
              threshold: 5 
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x',
              scaleMode: 'y'
            },
            limits: {
              x: { 
                min: currentChartType === "Candlestick Chart" ? new Date(masterLabels[0]).getTime() : 0, 
                max: currentChartType === "Candlestick Chart" ? finalMaxMs : finalLabels.length - 1 
              }
            }
          }
        },
        interaction: { intersect: false, mode: "index" },
        scales: {
          x: {
            min: currentChartType === "Candlestick Chart" ? initialMinMs : initialMin,
            max: currentChartType === "Candlestick Chart" ? finalMaxMs : finalLabels.length - 1,
            grid: { color: gridColor },
            ticks: { color: textColor, maxTicksLimit: 10 },
            type: currentChartType === "Candlestick Chart" ? 'timeseries' : 'category',
            time: {
              unit: 'day',
              displayFormats: { day: 'MMM dd' }
            }
          },
          y: {
            position: 'right',
            grid: { color: gridColor },
            ticks: { color: textColor },
            beginAtZero: false,
            grace: '5%',
            title: {
              display: true,
              text: "Price (LTP)",
              color: textColor,
              font: { size: 10 }
            }
          },
          yVolume: {
            position: 'left',
            display: false,
            grid: { display: false },
            beginAtZero: true,
            grace: '300%' // This keeps volume bars at bottom
          }
        }
      }
    });

    // Datasets already consolidated above

    // Add S&R Annotations
    const annotations = {};
    
    if (showSR && !isComparisonMode) {
      const srZones = calculateAdvancedSRZones(chartData);
      
      srZones.forEach((zone, index) => {
        const isSupport = zone.currentStatus === 'support';
        const color = isSupport ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        const borderColor = isSupport ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
        const labelText = (isSupport ? 'S' : 'R') + ' Zone: ' + zone.min.toFixed(1) + ' - ' + zone.max.toFixed(1);

        annotations[`zone${index}`] = {
          type: 'box',
          yMin: zone.min,
          yMax: zone.max,
          backgroundColor: color,
          borderColor: borderColor,
          borderWidth: 1,
          label: {
            display: true,
            content: labelText,
            position: 'end',
            xAdjust: -10,
            backgroundColor: isSupport ? '#22c55e' : '#ef4444',
            color: isDark ? '#fff' : '#000',
            font: { size: 9, weight: 'bold' },
            padding: 4,
            z: 15
          }
        };
      });
    }

    priceChart.options.plugins.annotation.annotations = annotations;
    priceChart.update();

    priceChart.isComparisonMode = isComparisonMode;
  }

  // Chart Controls Initialization
  initChartControls();

  function initChartControls() {
    const tfButtons = document.querySelectorAll(".timeframes .control-btn");
    
    tfButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tfButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const timeframe = btn.getAttribute("data-tf");
        updateChartTimeframe(timeframe);
      });
    });

    const controlBtns = document.querySelectorAll(".control-btn");
    const toolBtns = document.querySelectorAll(".tool-btn");

    controlBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Timeframe logic already handled by specialized tf buttons listener above
        
        // Handle chart type clicks (simplified to single type)
        if (btn.parentElement.classList.contains("chart-types")) {
          // No action needed for now as there's only one type
        }
      });
    });

    toolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        toolBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Screenshot Functionality
    const screenshotBtn = document.getElementById("screenshotBtn");
    if (screenshotBtn) {
      screenshotBtn.addEventListener("click", () => {
        if (!priceChart) {
          alert("Please load a chart first.");
          return;
        }
        
        const link = document.createElement("a");
        link.download = `chart-${currentSymbol || 'analysis'}-${new Date().getTime()}.png`;
        link.href = priceChart.toBase64Image();
        link.click();
      });
    }

    // Fullscreen Functionality
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const chartContainer = document.getElementById("chartMainContainer");
    if (fullscreenBtn && chartContainer) {
      fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          chartContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message}`);
          });
          fullscreenBtn.querySelector("i").className = "fas fa-compress";
        } else {
          document.exitFullscreen();
          fullscreenBtn.querySelector("i").className = "fas fa-expand";
        }
      });
    }

    // Listen for fullscreen changes (e.g. Esc key)
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && fullscreenBtn) {
        fullscreenBtn.querySelector("i").className = "fas fa-expand";
      }
    });

    // Indicators Modal Logic
    const indicatorsBtn = document.getElementById("indicatorsBtn");
    const constructionModal = document.getElementById("constructionModal");
    const closeModal = document.getElementById("closeModal");

    if (indicatorsBtn && constructionModal) {
      indicatorsBtn.addEventListener("click", () => {
        constructionModal.classList.add("visible");
      });

      closeModal.addEventListener("click", () => {
        constructionModal.classList.remove("visible");
      });

      // Close on clicking backdrop
      constructionModal.addEventListener("click", (e) => {
        if (e.target === constructionModal) {
          constructionModal.classList.remove("visible");
        }
      });

      // Toggle Listener
      const toggleSR = document.getElementById("toggleSR");
      if (toggleSR) {
         toggleSR.addEventListener("change", (e) => {
           showSR = e.target.checked;
           if (priceChart && lastFetchedData) {
             renderPriceChart(currentSymbol, lastFetchedData);
           }
         });
      }

      const toggleVolume = document.getElementById("toggleVolume");
      if (toggleVolume) {
        toggleVolume.addEventListener("change", (e) => {
          showVolume = e.target.checked;
          if (priceChart && lastFetchedData) {
            renderPriceChart(currentSymbol, lastFetchedData);
          }
        });
      }

      const toggleEMA20 = document.getElementById("toggleEMA20");
      if (toggleEMA20) {
        toggleEMA20.addEventListener("change", (e) => {
          showEMA20 = e.target.checked;
          if (priceChart && lastFetchedData) {
            renderPriceChart(currentSymbol, lastFetchedData);
          }
        });
      }

      const toggleEMA50 = document.getElementById("toggleEMA50");
      if (toggleEMA50) {
        toggleEMA50.addEventListener("change", (e) => {
          showEMA50 = e.target.checked;
          if (priceChart && lastFetchedData) {
            renderPriceChart(currentSymbol, lastFetchedData);
          }
        });
      }

      // Chart Type Toggles
      const lineBtn = document.getElementById("lineChartBtn");
      const candleBtn = document.getElementById("candleChartBtn");

      const updateChartType = (type) => {
        currentChartType = type;
        lineBtn.classList.toggle("active", type === "Line Chart");
        candleBtn.classList.toggle("active", type === "Candlestick Chart");
        if (priceChart && lastFetchedData) {
          renderPriceChart(currentSymbol, lastFetchedData);
        }
      };

      if (lineBtn) lineBtn.addEventListener("click", () => updateChartType("Line Chart"));
      if (candleBtn) candleBtn.addEventListener("click", () => updateChartType("Candlestick Chart"));
    }
  }

  function updateChartTimeframe(tf) {
    if (!priceChart || !lastFetchedData) return;

    const isCandle = currentChartType === "Candlestick Chart";
    const dataLength = isCandle ? lastFetchedData.length : priceChart.data.labels.length;
    let newMin = 0;

    if (isCandle) {
      // Time Scale (ms timestamps)
      const lastPoint = lastFetchedData[0]; // Data is reversed in lastFetchedData? Wait.
      // Wait, in fetchSymbolData: lastFetchedData = data.data.data;
      // In renderPriceChart: rawData = [...chartData].reverse();
      // So lastFetchedData is usually newest-to-oldest from the API.
      
      const masterLabels = [...new Set(lastFetchedData.map(d => d.Date.split('T')[0]))].sort();
      const newestDate = masterLabels[masterLabels.length - 1];
      const newestTs = new Date(newestDate).getTime();

      switch(tf) {
        case "1M": newMin = newestTs - (30 * 24 * 60 * 60 * 1000); break;
        case "1Y": newMin = newestTs - (365 * 24 * 60 * 60 * 1000); break;
        case "ALL": 
          // For timeseries, min can be the actual timestamp of the first point
          newMin = new Date(masterLabels[0]).getTime(); 
          break;
      }
    } else {
      // Category Scale (indices)
      switch(tf) {
        case "1M": newMin = Math.max(0, dataLength - 22 - 30); break; // including buffer
        case "1Y": newMin = Math.max(0, dataLength - 250 - 30); break;
        case "ALL": newMin = 0; break;
      }
    }

    priceChart.options.scales.x.min = newMin;
    priceChart.update();
  }

  function updateSymbols(selectedSector) {
    // Clear existing symbols
    symbolSelect.innerHTML = '<option value="">Select Symbol</option>';
    
    const filteredData = selectedSector
      ? MARKET_DATA.filter((item) => item.sector === selectedSector)
      : MARKET_DATA;

    // Sort by symbol
    filteredData.sort((a, b) => a.symbol.localeCompare(b.symbol));

    filteredData.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.symbol;
      option.textContent = `${item.symbol} (${item.name})`;
      symbolSelect.appendChild(option);
    });

    // Clear display if the selected symbol is no longer in the list
    if (selectedSector && !filteredData.find(item => item.symbol === symbolSelect.value)) {
        symbolDisplay.value = "";
    }
  }

  // Common UI logic from original file
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      const btnIcon = refreshBtn.querySelector("i");
      if (btnIcon) btnIcon.classList.add("fa-spin");

      setTimeout(() => {
        if (btnIcon) btnIcon.classList.remove("fa-spin");
        alert("Data refreshed (simulated)");
      }, 1000);
    });
  }
});
