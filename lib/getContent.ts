import { siteContent, SiteContent } from "./content";
import path from "path";
import fs from "fs";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return siteContent;
  }
}
