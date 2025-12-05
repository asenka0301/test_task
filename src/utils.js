export const getBadgeColorClass = (category) => {
  switch (category) {
    case "All":
      return "primary";
    case "Marketing":
      return "success";
    case "Management":
      return "info";
    case "HR & Recruiting":
      return "warning";
    case "Design":
      return "design";
    case "Development":
      return "dev";
    default:
      return "";
  }
};
