export interface Post {
  id: number;
  title: any;
  content: any;
  Image?:any;
  created_at: any;
  updated_at: any;
  published_at: any;
}

export interface PostJsonResponse {
  data: Post[];
}