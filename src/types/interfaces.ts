export interface IPodcastElement {
  id: string;
  title: string;
  author: string;
  image: string;
  onClick?: (...params: any) => void;
}

export interface IDivider {
  className?: string
}