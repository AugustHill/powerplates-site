// Power Plates member directory.
//
// PRIVACY RULE -- read before adding an entry:
// This file is public. Every visitor's browser downloads it in full, so
// anything written here is visible to anyone who views page source, no
// matter what the site's UI shows or hides. Each directory sign-up
// (directory-signup.html) lets the member choose, field by field, whether
// their email and phone are shown publicly. Only copy a field into this
// file if that member explicitly opted to make THAT field public --
// if they left "show my email" unchecked, omit the email key entirely
// (don't include it and hide it with CSS/JS). When in doubt, leave it out
// and ask them.
//
// Fields:
//   name       (required) string
//   occupation (required) string -- job title / role
//   company    (required) string
//   industry   (required) string -- powers the filter dropdown; keep
//              wording consistent with existing entries (e.g. always
//              "Real Estate", not a mix of "Real Estate"/"Realtor")
//   market     (required) "Pinellas County" | "Hillsborough County" | "Other"
//   bio        (optional) string -- one line, "how I can help" style
//   link       (optional) string -- their own website/LinkedIn/social URL
//   email      (optional) string -- ONLY if they opted to show it publicly
//   phone      (optional) string -- ONLY if they opted to show it publicly
//   photo      (optional) string -- path like "images/members/Name.jpg";
//              omit if none on file, the card falls back to initials

const POWERPLATES_DIRECTORY = [
  // Empty for now -- entries are added here after a member submits
  // directory-signup.html and Derrick verifies the submission.
];
