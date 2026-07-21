// Power Plates Featured Members data
// Used by index.html to show a random rotating set of 3 members on every
// page load. Keep this in sync with members.html if you add or remove
// people from the archive.

const POWERPLATES_MEMBERS = [
  { month: "June 2026", name: "Lane Askew", initials: "LA", photo: "images/members/Lane_Askew.jpg",
    occupation: "Co-Owner & VP, Wellness Studio / DoD Business Development Consultant", company: "Red Light Method, Palm Harbor / AstralMaris LLC",
    hobbies: "Wellness optimization, community networking, mentoring, and hosting local events.", dish: "Grilled steak with loaded baked potato", destination: "Coastal Italy" },

  { month: "April 2026", name: "Mary DiBenedetto Nolte", initials: "MN", photo: "images/members/Mary_DiBenedetto_Nolte.jpg",
    occupation: "Color & Interior Design Consultant", company: "Kaleidoscope Color Consulting LLC",
    hobbies: "Swing dancing, hiking trails and the beach.", dish: "Pasta", destination: "India or Morocco" },

  { month: "March 2026", name: "Austin Kennerly", initials: "AK", photo: "images/members/Austin_Kennerly.jpg",
    occupation: "Loan Originator", company: "Van Dyk Mortgage, The Miller Team",
    hobbies: "Basketball, reading, video games, movies, D&D.", dish: "Butter cake with vanilla ice cream", destination: "Osaka Bay, Japan" },

  { month: "February 2026", name: "Jessica Dibble Oker", initials: "JO", photo: "images/members/Jessica_Dibble_Oker.jpg",
    occupation: "Ayurvedic Practitioner", company: "Wildcraft Ayurveda",
    hobbies: "Reading, walking, cycling, yoga, and learning languages.", dish: "Pastitsio", destination: "Everywhere, eventually" },

  { month: "January 2026", name: "Bonnie Garrison", initials: "BG", photo: "images/members/Bonnie_Garrison.jpg",
    occupation: "Executive & Administrative Specialist, Luxury Concierge Solutions", company: "Savvy Services LLC",
    hobbies: "Live music, trivia night, traveling, family time.", dish: "Steak tacos", destination: "Paris, France" },

  { month: "December 2025", name: "Kristina Celata", initials: "KC", photo: "images/members/Kristina_Celata.jpg",
    occupation: "Office Manager", company: "Air Zero Air Conditioning",
    hobbies: "Fishing.", dish: "Lobster raviolis", destination: "Italy" },

  { month: "November 2025", name: "Mary Bosco-Pasquarello", initials: "MB", photo: "images/members/Mary_Bosco-Pasquarello.jpg",
    occupation: "Business Development / Loan Officer", company: "Third Federal",
    hobbies: "Baking, Christmas crafting, traveling, sunset beach walks.", dish: "Any homemade Italian dish", destination: "Italy" },

  { month: "October 2025", name: "Justin Levey", initials: "JL", photo: "images/members/Justin_Levey.jpg",
    occupation: "Insurance Agency Owner", company: "Edgewater Insurance",
    hobbies: "Golf, watching baseball, football, and hockey.", dish: "Lobster ravioli", destination: "Fiji" },

  { month: "August 2025", name: "Laura Michaelin", initials: "LM", photo: "images/members/Laura_Michaelin.jpg",
    occupation: "Marketing Coordinator", company: "Atlas Clinics",
    hobbies: "Bird watching, web design, and traveling.", dish: "Ceviche", destination: "Scotland" },

  { month: "July 2025", name: "Danna Kerns-Street", initials: "DK", photo: "images/members/Danna_Kerns-Street.jpg",
    occupation: "Owner & Educator", company: "Kintsugi Creative / Cops 'n Kids",
    hobbies: "Reading, anything crafty, going for walks with her husband.", dish: "Sushi", destination: "Bora Bora, or going back to Japan" },

  { month: "June 2025", name: "Kimberly Saxman", initials: "KS", photo: "images/members/Kimberly_Saxman.png",
    occupation: "Life Insurance Specialist", company: "Primerica",
    hobbies: "Reading, traveling, people, fishing, spontaneous road trips, random acts of kindness.", dish: "Mediterranean/Italian", destination: "Greece, Morocco, or Paris" },

  { month: "May 2025", name: "Alejandro Chamizo", initials: "AC", photo: "images/members/Alejandro_Alex_Chamizo.jpg",
    occupation: "Business Banker", company: "SouthState Bank",
    hobbies: "Playing basketball and working out.", dish: "Cuban food", destination: "Barcelona, Spain" },

  { month: "April 2025", name: "Amy Palmer-Walters", initials: "AW", photo: "images/members/Amy_Palmer-Walters.png",
    occupation: "Business Coach, Publisher & Podcast Co-Host", company: "New Port Richey City Lifestyle",
    hobbies: "Working out, cooking, entertaining, and spending time with her kids.", dish: "Lasagna", destination: "Italy" },

  { month: "March 2025", name: "Lillian Barcaski", initials: "L", photo: "images/members/Lilian_Barcaski.png",
    occupation: "Ghostwriter & Publisher", company: "GWN Publishing / Virtual Creatives",
    hobbies: "Theater directing, music (drums and vocals).", dish: "Pizza and any good Italian food", destination: "Italy, and Hawaii too" },

  { month: "February 2025", name: "John Ricker", initials: "JR", photo: "images/members/John_Ricker.jpg",
    occupation: "Owner & President", company: "Baxter Title",
    hobbies: "Softball, boating, weightlifting, sports.", dish: "Chicago hot dogs", destination: "Aruba" },

  { month: "January 2025", name: "Moses Alford", initials: "MA", photo: "images/members/Moses.jpg",
    occupation: "Loan Officer", company: "Alford Lending, powered by Nexa Mortgage",
    hobbies: "Working out, beach days, skating.", dish: "Tacos", destination: "The Maldives" },

  { month: "November 2024", name: "Tanya Cañarte", initials: "TC", photo: "images/members/Tanya_Canarte.jpg",
    occupation: "Loan Originator", company: "VanDyk Mortgage",
    hobbies: "Spending time with loved ones, nature, photography.", dish: "Lomo saltado", destination: "Bali and Egypt" },

  { month: "October 2024", name: "Christine Ziebell", initials: "CZ", photo: "images/members/Christine_Ziebell.jpg",
    occupation: "Broker & Owner", company: "Realty ONE Group Beyond",
    hobbies: "Scuba diving, travel, tennis.", dish: "Pasta", destination: "The Maldives" },

  { month: "September 2024", name: "Kortney Huff", initials: "KH", photo: "images/members/Kortney_Huff.jpg",
    occupation: "Life & Health Insurance Agent", company: "JAKO Insurance Solutions",
    hobbies: "Volunteering at church, trying new cuisines, theme parks, taking her dogs to the dog park.", dish: "A great burger, or anything Mexican", destination: "Alaska, or Ireland" },

  { month: "August 2024", name: "Michael Post", initials: "MP", photo: "images/members/Michael_Post.png",
    occupation: "Senior Living Concierge & SRES Realtor", company: "Team Borham / TruBlue Home Service Ally",
    hobbies: "Fishing, cooking, the beach, volunteering.", dish: "Tuna poke bowl with coconut rice", destination: "Coastal France" },

  { month: "June 2024", name: "Chad Williams", initials: "CW", photo: "images/members/Chad_Williams.jpg",
    occupation: "Business Development", company: "Coastal Title",
    hobbies: "Golfing and shopping with his daughter.", dish: "Lamb chops", destination: "Bora Bora" },

  { month: "January 2024", name: "Barbra Mastrota", initials: "BM", photo: "images/members/Barbara_Mastrota.jpg",
    occupation: "Owner", company: "Cool Wizard Heating and Air Conditioning Services",
    hobbies: "Travel. She loves putting pins in her world map.", dish: "Shepherd's pie", destination: "The Maldives" },

  { month: "December 2023", name: "Mark Soltysik", initials: "MS", photo: "images/members/Mark_Soltysik.jpg",
    occupation: "Owner", company: "Concierge Club of America",
    hobbies: "Basketball, Browns tailgates, karaoke, music festivals.", dish: "Drunken Thai noodles with chicken and shrimp", destination: "Ibiza, Spain" },

  { month: "November 2023", name: "Joe and Cassie McSherry", initials: "JC", photo: "images/members/joe_and_Cassie.jpg",
    occupation: "Title Company", company: "Assurity Title",
    hobbies: "Reading, watching football.", dish: "Spicy tuna", destination: "Italy" },

  { month: "October 2023", name: "Derrick McKenzie", initials: "DM", photo: "images/members/Derrick_McKenzie.jpg",
    occupation: "Real Estate Agent & Event Marketer", company: "Keller Williams / Power Plates / Tampa Bay Basketball Association",
    hobbies: "Basketball, video games, reading.", dish: "Ramen", destination: "Osaka Bay, Japan" },

  { month: "August 2023", name: "Mike Alverez", initials: "MV", photo: "images/members/Mike_Alverez.jpg",
    occupation: "Insurance Agent", company: "Edgewater Insurance",
    hobbies: "Music and podcasting.", dish: "Tacos", destination: "Phuket, Thailand" },

  { month: "July 2023", name: "Ricardo DonAlexis", initials: "RD", photo: "images/members/Ricardo_DonAlexis.jpg",
    occupation: "Financial Advisor", company: "Insight Family Financial",
    hobbies: "Lifting weights, charity work, and good shenanigans.", dish: "Curry goat", destination: "New Zealand" }
];
