export type Result = {
  id: number;
  species_guess: string;
  uri: string;
  taxon: {
    name: string;
  };
  user: {
    login: string;
    user_icon_url: string;
  };
  photos: { id: number; medium_url: string }[];
};
