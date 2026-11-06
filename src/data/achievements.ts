export const achievementCategories = ["Awards", "Certifications", "Intellectual Property", "Publications"] as const;
export type AchievementCategory = typeof achievementCategories[number];

export interface AchievementRecord {
  id: string;
  category: AchievementCategory;
  title: string;
  displayTitle: string;
  distinction: string;
  issuer?: string;
  year?: number;
  summary: string;
  referenceNumber?: string;
  url?: string;
  media?: { src: string; width: number; height: number; alt: string };
  featuredOrder?: number;
}

// Source: the owner's CV, plus the existing provincial LKS participation record.
// Course completion is not presented as a professional certification. Journal
// publication status, ranking and missing issuers/dates remain unspecified.
const records: AchievementRecord[] = [
  { id: "lks-city", category: "Awards", title: "1st Place — LKS Cloud Computing, City Level", displayTitle: "Cloud Computing", distinction: "1st Place", year: 2024, issuer: "Lomba Kompetensi Siswa · City Level", summary: "First place in the city-level Lomba Kompetensi Siswa (LKS), Cloud Computing category.", featuredOrder: 1 },
  { id: "mtcna", category: "Certifications", title: "MikroTik Certified Network Associate (MTCNA)", displayTitle: "MikroTik Network Associate", distinction: "Professional certification", issuer: "MikroTik", year: 2024, summary: "Earned the MikroTik Certified Network Associate credential in 2024.", featuredOrder: 2 },
  { id: "garuda-hacks", category: "Awards", title: "Most Unique Idea — Garuda Hacks 7.0", displayTitle: "Garuda Hacks 7.0", distinction: "Most Unique Idea", issuer: "Universitas Multimedia Nusantara", year: 2026, summary: "Received the Most Unique Idea recognition at Garuda Hacks 7.0.", featuredOrder: 3 },
  { id: "agropredict-copyright", category: "Intellectual Property", title: "Aplikasi Agropredict: Sistem Pertanian Terintegrasi AIoT Rekomendasi Pemasaran dan Penanggulangan Penyakit Berbasis Geographic Information System dalam Upaya Smart City Tangguh Pangan", displayTitle: "AGROPREDICT", distinction: "Copyright · Hak Cipta", year: 2025, referenceNumber: "000988674", summary: "Recorded copyright for the AGROPREDICT application, integrating AIoT, marketing recommendations, disease management and geographic information systems.", featuredOrder: 4 },
  { id: "iceeie-paper", category: "Publications", title: "Structured Data Flow and Multi-Level Access Control for Landfill Smart Weighing System", displayTitle: "Landfill Smart Weighing", distinction: "Conference paper · 2nd author", issuer: "9th ICEEIE", year: 2025, summary: "Second author and presenter of the peer-reviewed paper at the International Conference on Electrical, Electronics and Information Engineering in September 2025.", referenceNumber: "10.1109/ICEEIE66203.2025.11252117", url: "https://doi.org/10.1109/ICEEIE66203.2025.11252117", featuredOrder: 5 },
  { id: "lua-book", category: "Publications", title: "Struktur Data dalam Lua", displayTitle: "Struktur Data dalam Lua", distinction: "Book", year: 2025, referenceNumber: "62-401-6601-728", summary: "Book publication: Struktur Data dalam Lua (2025).", featuredOrder: 6 },
  { id: "playit", category: "Awards", title: "3rd Place — UI/UX Hackathon, PlayIT", displayTitle: "PlayIT UI/UX Hackathon", distinction: "3rd Place", issuer: "Politeknik Negeri Malang", year: 2026, summary: "Third place in the UI/UX Hackathon at PlayIT." },
  { id: "exploration", category: "Awards", title: "2nd Place — Exploration Batch 3 Mini Hackathon", displayTitle: "Exploration Batch 3", distinction: "2nd Place", issuer: "Garuda Spark Innovation Hub", year: 2026, summary: "Second place in the Exploration Batch 3 Mini Hackathon." },
  { id: "dinacom", category: "Awards", title: "2nd Runner Up — DINACOM 11.0 Hackathon", displayTitle: "DINACOM 11.0", distinction: "2nd Runner Up", issuer: "Universitas Dian Nuswantoro", year: 2026, summary: "Second runner up in the Hackathon Dinus Application Competition 11.0." },
  { id: "business-plan", category: "Awards", title: "1st Place — Business Plan Competition, Festival of Plant Protection Indonesia", displayTitle: "Business Plan Competition", distinction: "1st Place", issuer: "HIMASITA IPB", year: 2025, summary: "First place in the Business Plan Competition at the Festival of Plant Protection Indonesia." },
  { id: "lintas-paper", category: "Awards", title: "2nd Place — Scientific Paper, LINTAS ORMAWA", displayTitle: "LINTAS ORMAWA", distinction: "2nd Place · Scientific paper", issuer: "Faculty of Engineering, Universitas Negeri Malang", year: 2025, summary: "Second place in the Scientific Paper category of LINTAS ORMAWA." },
  { id: "lintas-presentation", category: "Awards", title: "3rd Place — Presentation Category, LINTAS ORMAWA", displayTitle: "LINTAS ORMAWA", distinction: "3rd Place · Presentation", issuer: "Faculty of Engineering, Universitas Negeri Malang", year: 2025, summary: "Third place in the Presentation category of LINTAS ORMAWA." },
  { id: "igsc", category: "Awards", title: "3rd Place — International Green Scientific Competition (IGSC)", displayTitle: "Green Scientific Competition", distinction: "3rd Place", issuer: "Universitas Negeri Semarang", year: 2025, summary: "Third place in the International Green Scientific Competition (IGSC)." },
  { id: "essay", category: "Awards", title: "3rd Place — Essay Competition, Festival of Plant Protection Indonesia", displayTitle: "Essay Competition", distinction: "3rd Place", issuer: "HIMASITA IPB", year: 2025, summary: "Third place in the Essay Competition at the Festival of Plant Protection Indonesia." },
  { id: "excel", category: "Certifications", title: "Data Analyst using Microsoft Excel", displayTitle: "Data Analysis with Excel", distinction: "Course completion", issuer: "Iblu Academy", year: 2025, summary: "Completed the Data Analyst using Microsoft Excel training at Iblu Academy." },
  { id: "dinoyo-copyright", category: "Intellectual Property", title: "Sistem Manajemen Database Terintegrasi untuk Dinoyo Camera sebagai Langkah Mendukung Teknologi UMKM di Indonesia dengan Digitalisasi", displayTitle: "Dinoyo Camera", distinction: "Copyright · Hak Cipta", year: 2025, referenceNumber: "000892586", summary: "Recorded copyright for an integrated database management system supporting the digitalization of Dinoyo Camera." },
  { id: "lks-province", category: "Awards", title: "Provincial-Level LKS Cloud Computing Participant", displayTitle: "LKS Cloud Computing", distinction: "Provincial participant", year: 2024, summary: "Participated in the provincial-level LKS Cloud Computing competition." },
  { id: "cisco-intro", category: "Certifications", title: "CCNAv7: Introduction to Networks", displayTitle: "Introduction to Networks", distinction: "Course completion", issuer: "Cisco Networking Academy", year: 2024, summary: "Completed CCNAv7: Introduction to Networks through Cisco Networking Academy." },
  { id: "cisco-switching", category: "Certifications", title: "CCNAv7: Switching, Routing, and Wireless Essentials", displayTitle: "Switching, Routing & Wireless", distinction: "Course completion", issuer: "Cisco Networking Academy", year: 2024, summary: "Completed CCNAv7: Switching, Routing, and Wireless Essentials through Cisco Networking Academy." },
  { id: "cisco-enterprise", category: "Certifications", title: "CCNAv7: Enterprise Networking, Security, and Automation", displayTitle: "Enterprise Networking", distinction: "Course completion", issuer: "Cisco Networking Academy", year: 2024, summary: "Completed CCNAv7: Enterprise Networking, Security, and Automation through Cisco Networking Academy." },
  { id: "english", category: "Certifications", title: "English Proficiency Test", displayTitle: "English Proficiency", distinction: "Language test · Score 547", year: 2024, summary: "English Proficiency Test score of 547." },
  { id: "aws-essentials", category: "Certifications", title: "AWS Cloud Practitioner Essentials", displayTitle: "Cloud Practitioner Essentials", distinction: "Course completion", issuer: "AWS", year: 2023, summary: "Completed AWS Cloud Practitioner Essentials. This is a course completion credential." },
  { id: "sqa", category: "Certifications", title: "Software Quality Assurance Bootcamp", displayTitle: "Software Quality Assurance", distinction: "Bootcamp", issuer: "JuaraCoding", year: 2022, summary: "Completed the Software Quality Assurance Bootcamp at JuaraCoding." },
  { id: "smart-weighing-journal", category: "Publications", title: "Smart Weighing for Waste Management System Using Integration Internet of Things and Artificial Intelligence to Assist Circular Economics", displayTitle: "Smart Weighing & Circular Economics", distinction: "Research article · 6th author", issuer: "Indonesian Journal of Urban and Environmental Technology", summary: "Sixth author of this research article exploring IoT and AI for waste management and circular economics." },
];

export const achievementRecords = [...records].sort((a, b) => {
  if (a.featuredOrder || b.featuredOrder) return (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity);
  return (b.year ?? 0) - (a.year ?? 0);
});
