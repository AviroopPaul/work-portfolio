"use client";

import { createContext, useContext } from "react";
import { siteContent, SiteContent } from "./content";

export const ContentContext = createContext<SiteContent>(siteContent);
export const useContent = () => useContext(ContentContext);
