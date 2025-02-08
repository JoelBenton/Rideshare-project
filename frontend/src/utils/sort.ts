import { Group, Trips } from "./types";

export const sortTripsByDate = (trips: Trips[]) => {
    return trips.sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`20${year}-${month}-${day}`);
      };
  
      const dateA = parseDate(a.date_of_trip);
      const dateB = parseDate(b.date_of_trip);
      return dateB.getTime() - dateA.getTime(); // Sort by most recent first
    });
};

export const sortGroupsByDate = (groups: Group[]) => {
    return groups.sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`20${year}-${month}-${day}`);
      };
  
      const dateA = parseDate(a.date_of_trip);
      const dateB = parseDate(b.date_of_trip);
      return dateB.getTime() - dateA.getTime(); // Sort by most recent first
    });
};