export interface Category {
  id?: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  status: "active" | "hidden";
  displayOrder: number;
  createdAt?: Date;
}