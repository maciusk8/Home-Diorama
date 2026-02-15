export type Room = {
  name: string;
  image: string | null;
  bgColor: string;
  entities: Entity[];
}

export type Entity = {
  id: string;         
  x: number;           
  y: number;           
  type: string;      
  label?: string;     
  icon?: string;       
};