import type { ComponentType } from "react";
import type { DeliverableId } from "@/content/copy";
import { ColourDemo } from "./ColourDemo";
import { GuidelinesDemo } from "./GuidelinesDemo";
import { ImageDemo } from "./ImageDemo";
import { LogoDemo } from "./LogoDemo";
import { TypeDemo } from "./TypeDemo";

export const demoFor: Record<DeliverableId, ComponentType> = {
  logo: LogoDemo,
  colour: ColourDemo,
  typeface: TypeDemo,
  image: ImageDemo,
  guidelines: GuidelinesDemo,
};
