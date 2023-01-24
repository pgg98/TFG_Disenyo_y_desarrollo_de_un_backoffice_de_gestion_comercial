export class Producto {
  public nombre: string
  public agrupacion: string
  public check: boolean
  public id: number
  public cultivos: string[]
  public fk_provider: number
  public pixel_2: boolean
  public titulo: string
  public titulo_english: string
  public titulo_portuguese: string
  
  constructor(nombre: string, agrupacion: string, check:boolean, id: number, cultivos: string[], fk_provider: number, pixel_2: boolean, titulo: string, titulo_english: string,titulo_portuguese: string) {
    this.nombre = nombre;
    this.agrupacion = agrupacion;
    this.check = check;
    this.id = id
    this.cultivos = cultivos
    this.fk_provider = fk_provider
    this.pixel_2 = pixel_2
    this.titulo = titulo
    this.titulo_english = titulo_english
    this.titulo_portuguese = titulo_portuguese
  }
}