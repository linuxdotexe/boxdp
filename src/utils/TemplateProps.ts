export interface SatoriParams {
  image: string;
  imagePosition?: string;
  filmName: string;
  filmYear: string;
  reviewerName: string;
  reviewerId: string;
  reviewRating: number;
  reviewContent: string;
  director: string;
  userImage?: string;
  haveAvatar: boolean;
  haveTitle: boolean;
  haveBg: boolean;
}

export interface TemplateProps extends SatoriParams {
  brightness: number;
}
