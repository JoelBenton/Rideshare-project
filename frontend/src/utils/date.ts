export const convertDate = (dateString, splitChar = "-", add20 = true) => {
    if (!dateString || dateString == "Unknown Date") {
      return "";
    }

    const [day, month, year] = dateString.split(splitChar);
    const date = new Date(`${add20 ? "20" : ""}${year}-${month}-${day}`); // Convert to a proper Date object
  
    // Use Intl.DateTimeFormat for formatting
    const daySuffix = (day) => {
      if (day % 10 === 1 && day !== 11) return "st";
      if (day % 10 === 2 && day !== 12) return "nd";
      if (day % 10 === 3 && day !== 13) return "rd";
      return "th";
    };

    const formattedDate = new Intl.DateTimeFormat("en-GB",  { month: "long", year: "numeric" }).format(date);
  
    return `${parseInt(day)}${daySuffix(day)} ${formattedDate}`;
};

export const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`20${year}-${month}-${day}`);
};