export type Room = {
  name: string;
  image: string | null;
  entities: string[];
}

export type Entity = {
  id: string;         
  x: number;           
  y: number;           
  type: string;      
  label?: string;     
  icon?: string;       
};