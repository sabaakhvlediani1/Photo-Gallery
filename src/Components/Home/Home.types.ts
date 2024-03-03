export interface ImageDataType {
  imageURL: string;
  downloads: number;
  likes: number;
  views: number;
};

export interface CachedData {
  [key: string]: Array<any>;
}