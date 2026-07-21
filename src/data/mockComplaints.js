export const INITIAL_COMPLAINTS = [
  {
    id: "COMP-9041",
    title: "Deep Pothole near Central Bus Terminal",
    category: "Pothole",
    severity: "High",
    isHazardous: true,
    description: "Dangerous 8-inch deep pothole causing two-wheelers to slip near the main terminal exit gate.",
    location: {
      address: "Outer Ring Road, Near Central Bus Stop, District 4",
      lat: 12.9716,
      lng: 77.5946
    },
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    status: "In Progress",
    reportedBy: "Rahul Verma",
    createdAt: "2026-07-19T10:30:00Z",
    upvotes: 42,
    assignedDepartment: "Public Works Dept (PWD) - Zone B",
    timeline: [
      { status: "Received", timestamp: "2026-07-19T10:30:00Z", note: "Complaint logged by citizen." },
      { status: "Under Review", timestamp: "2026-07-19T14:15:00Z", note: "Assigned to PWD Field Engineer Team 4." },
      { status: "In Progress", timestamp: "2026-07-20T09:00:00Z", note: "Asphalt patching team dispatched to site." }
    ],
    authorityNotes: "Patchwork materials scheduled for filling by evening shift.",
    proofPhotoUrl: null
  },
  {
    id: "COMP-9042",
    title: "Broken Drainage Manhole Cover",
    category: "Missing Manhole",
    severity: "Critical",
    isHazardous: true,
    description: "Manhole lid completely shattered, open drain left exposed on pedestrian walkway.",
    location: {
      address: "14th Cross, MG Road Junction, District 1",
      lat: 12.9750,
      lng: 77.6070
    },
    photoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    status: "Received",
    reportedBy: "Priya Sharma",
    createdAt: "2026-07-21T08:15:00Z",
    upvotes: 89,
    assignedDepartment: "Municipal Storm Water Drain Dept",
    timeline: [
      { status: "Received", timestamp: "2026-07-21T08:15:00Z", note: "Emergency safety complaint registered." }
    ],
    authorityNotes: "Barricades placed. Replacement cast-iron cover ordered.",
    proofPhotoUrl: null
  },
  {
    id: "COMP-9038",
    title: "Severe Road Surface Cave-In",
    category: "Cave-in",
    severity: "High",
    isHazardous: false,
    description: "Road surface collapsed following water pipeline leak under the main asphalt.",
    location: {
      address: "Green Avenue Road, Near St. John Hospital",
      lat: 12.9345,
      lng: 77.6242
    },
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
    status: "Completed",
    reportedBy: "Anish Nair",
    createdAt: "2026-07-15T11:00:00Z",
    upvotes: 115,
    assignedDepartment: "Water Supply & Sewerage Board + PWD",
    timeline: [
      { status: "Received", timestamp: "2026-07-15T11:00:00Z", note: "Complaint registered." },
      { status: "Under Review", timestamp: "2026-07-16T08:00:00Z", note: "Joint inspection by Water Board & PWD." },
      { status: "In Progress", timestamp: "2026-07-17T10:00:00Z", note: "Pipe repaired and road resurfaced." },
      { status: "Completed", timestamp: "2026-07-18T16:30:00Z", note: "Final asphalt overlay completed & road reopened." }
    ],
    authorityNotes: "Road fully restored and tested for traffic loads.",
    proofPhotoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    citizenRating: 5,
    citizenFeedback: "Great work! Fixed within 3 days."
  },
  {
    id: "COMP-9040",
    title: "Heavy Waterlogging due to Blocked Gutter",
    category: "Waterlogging",
    severity: "Medium",
    isHazardous: false,
    description: "Stagnant rainwater extending across 50 meters, causing traffic slowdown.",
    location: {
      address: "Subway Underpass, Sector 3, Industrial Layout",
      lat: 12.9600,
      lng: 77.6480
    },
    photoUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80",
    status: "In Progress",
    reportedBy: "Karthik R.",
    createdAt: "2026-07-20T16:45:00Z",
    upvotes: 27,
    assignedDepartment: "Municipal Sanitation Department",
    timeline: [
      { status: "Received", timestamp: "2026-07-20T16:45:00Z", note: "Logged by citizen." },
      { status: "In Progress", timestamp: "2026-07-21T07:30:00Z", note: "Suction pump deployed to clear clogged inlet." }
    ],
    authorityNotes: "Pumping team currently active on site.",
    proofPhotoUrl: null
  }
];

export const ROAD_CATEGORIES = [
  "Pothole",
  "Cave-in",
  "Waterlogging",
  "Missing Manhole",
  "Broken Divider / Curb",
  "Surface Cracks & Rutting"
];

export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];

export const STATUS_TYPES = ["Received", "In Progress", "Completed", "Rejected"];
