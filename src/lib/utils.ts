import { PhotoSize } from "@/components/results/types";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageBySize = ({
  url,
  id,
  size = "medium",
}: {
  url: string;
  id: string;
  size?: PhotoSize;
}): [string, number] => {
  // Sizes from https://api.inaturalist.org/v1/docs/#!/Observations/get_observations#https-api-inaturalist-org-v1-
  const sizeMap = {
    original: 2048,
    large: 1024,
    medium: 500,
    small: 240,
    thumb: 100,
    square: 75,
  };
  const sizePx = sizeMap[size];
  if (!url.includes(id)) {
    return [url, sizePx];
  }

  const [root, rest] = url.split(id);
  const ext = rest?.split(".")[1];
  if (!ext) {
    return [url, sizePx];
  }

  return [`${root}${id}/${size}.${ext}`, sizePx];
};
