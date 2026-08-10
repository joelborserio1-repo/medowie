import { strapiFindOne } from "@/lib/cms/client";
import type { AboutPage, Homepage, SiteSettings, TrainingPage, YearlingPreparationPage } from "@/lib/cms/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return strapiFindOne<SiteSettings>("/site-setting", { populate: "*" });
}

export async function getHomepage(): Promise<Homepage | null> {
  return strapiFindOne<Homepage>("/homepage");
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return strapiFindOne<AboutPage>("/about-page");
}

export async function getTrainingPage(): Promise<TrainingPage | null> {
  return strapiFindOne<TrainingPage>("/training-page");
}

export async function getYearlingPreparationPage(): Promise<YearlingPreparationPage | null> {
  return strapiFindOne<YearlingPreparationPage>("/yearling-preparation-page");
}
