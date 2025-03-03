interface Photo {
  id: string;
  license_code: string;
  url: string;
  original_dimensions: {
    height: number;
    width: number;
  };
  square_url?: string;
  medium_url?: string;
}

interface Taxon {
  id: string;
  name: string;
  default_photo: Photo;
  wikipedia_url: string;
  iconic_taxon_name: string;
  preferred_common_name: string;
}

interface User {
  id: string;
  login: string;
  name: string;
  icon_url: string;
}

export interface Result {
  id: string;
  species_guess: string;
  description: string;
  observed_on: string;
  observed_on_string: string;
  updated_at: string;
  captive: boolean;
  taxon: Taxon;
  uri: string;
  geoprivacy: string;
  location: string;
  user: User;
  mappable: boolean;
  place_guess: string;
  photos: Array<Photo>;
}

export type PhotoSize = "thumb" | "small" | "medium" | "large" | "original";

// export type Result = {
//   id: number;
//   species_guess: string;
//   uri: string;
//   taxon: {
//     name: string;
//   };
//   user: {
//     login: string;
//     user_icon_url: string;
//   };
//   photos: { id: number; medium_url: string }[];
// };
