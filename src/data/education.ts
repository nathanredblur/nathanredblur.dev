export interface Education {
  degree: string;
  institution: string;
  duration: string;
  location?: string;
  notes?: string;
}

export const education: Education[] = [
  {
    degree: "Engineering Technology degree",
    institution: "Institución Universitaria ITM",
    duration: "Jan 2007 - Oct 2009",
    location: "Medellín, CO",
  },
];
