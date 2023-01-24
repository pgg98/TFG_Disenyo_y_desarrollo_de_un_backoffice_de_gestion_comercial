export class Plan {
  public titulo: string
  public productos: string[];
  public herramientas: string[];
  
  constructor(titulo: string, productos: string[], herramientas: string[]) {
    this.titulo = titulo
    this.productos = productos;
    this.herramientas = herramientas;
  }
}