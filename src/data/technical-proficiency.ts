import { skillCategories } from "./skills";

export interface ProficiencyCategory {
  label: string;
  items: string[];
}

// Technical proficiency consumed by resume templates (ATS, Modern, Classic).
// Sourced from the same category tree as the site so both stay in sync.
export const technicalProficiency: ProficiencyCategory[] = skillCategories.map(
  (category) => ({
    label: category.label,
    items: [...category.items],
  }),
);
