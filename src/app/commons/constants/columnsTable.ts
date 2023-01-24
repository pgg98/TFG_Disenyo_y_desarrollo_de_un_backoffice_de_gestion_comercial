import { botonesTabla } from "../enums/botonesTabla.enum";

const botonesTablaEnum = botonesTabla

const userColumns = [
  "email",
  "nombre",
  "apellidos",
  "phone",
  "pais",
  "cultivo",
];

const defaultColumns = [
  "workspace",
  "email",
  "nombre",
  "apellidos",
  "empresa",
  "phone",
  "pais",
  "cultivo",
  "fecha_registro",
  "ha_empresa"
];

const commonNoLeads = [
  "workspace",
  "correo",
  "telefono",
  "nombre",
  "empresa",
  "ha_empresa",
  "ha_consum",
  "ha_activas"
]

const demos = [
  "ha_activas_sent",
  "fin_plataforma",
  //"prioridad", // no está
  "fin_actualizacion",
];

const clientes = [
  "alta_freq",
  "pagado",
  "ha_contrat", // planet
  "ha_contrat_sent", // contratadas
  "metodo_pago" // no está
];

const leads = [
  "verificado",
  "contactado",
];

const areas = [
"nombre",
"titulo",
"cultivo",
"fin_actualizacion",
"superficie",
"id_label",
"unidad_01",
"unidad_02",
"unidad_03",
"unidad_04",
"unidad_05",
"terminado",
"agrupacion",
"reinicio",
"zafra_cont",
"freinicio",
];

const novedades = [
  "titulo",
  "fecha_inicio",
  "fecha_vencimiento",
  "clientes",
  "rol_user",
  "descripcion",
  "tipo",
  "link",
  "link_video",
  "imagen",
  //"clientes__cultivo",
  //"clientes__pais"
]

export const buttonsEachTabla = {
  leads: [botonesTablaEnum.editar, botonesTablaEnum.usuario, botonesTablaEnum.convertir, botonesTablaEnum.superuser],
  demos: [botonesTablaEnum.editar, botonesTablaEnum.usuario, botonesTablaEnum.crear, botonesTablaEnum.superuser],
  clientes: [botonesTablaEnum.editar, botonesTablaEnum.usuario, botonesTablaEnum.crear, botonesTablaEnum.superuser],
  bajas: [botonesTablaEnum.usuario, botonesTablaEnum.superuser],
  usuarios: [botonesTablaEnum.superuser],
  areas: [
    botonesTablaEnum.editar,
    botonesTablaEnum.terminado,
    botonesTablaEnum.procCurvas,
    botonesTablaEnum.procHistoricos,
  ],
  novedades: [botonesTablaEnum.editar, botonesTablaEnum.eliminar, botonesTablaEnum.crear],
  products: [botonesTablaEnum.editar],
  powerbi: [],
  curvas: [botonesTablaEnum.curvas]
}

const usuarios = [
  "user",
  "last_login",
  "contador_login",
  "contador_dashboard",
  "contador_powerbi",
  "fecha_registro"
]

const tiles = [
  "area_nombre",
  "priority",
  "date_start",
  "date_end",
  "processed_pctg",
  "downloaded_pctg",
  "processed_tiles_pctg",
  "process_init",
  "process_end",
  "historic",
  "generate_curves",
  "generate_points",
  "upload_image"
];

const products = [
  "nombre",
  "titulo",
  "titulo_portuguese",
  "titulo_english",
  "agrupacion",
  "cultivos",
  "pixel_2",
  "fk_provider"
];

const powerbi = [
  'workspace',
  'nombre',
  'actualizar',
  'proceso',
  'estado'
];

const curvas = [
  "variedad",
  "mes",
  "riego",
  "zona_eco",
  "dds",
  "rend",
  "soca",
  "corregir"
]

export const columnsTable = {
  leads: defaultColumns.concat(leads),
  demos: commonNoLeads.concat(demos),
  clientes: commonNoLeads.concat(demos, clientes),
  bajas: commonNoLeads.concat(demos, clientes),
  usuarios: defaultColumns.filter(a => !a.startsWith('empre') && !a.startsWith('workspace')).slice(0, 6).concat(demos.slice(0, 4), leads.filter(a => a.includes('veri')), usuarios)
  .sort((a, b) => (a === 'user') ? -1 : 1),
  editar: defaultColumns.concat(usuarios, demos.filter(element => element.includes('fin')), leads, clientes.filter(a => !a.includes('sent')), 'category', 'tools', 'language', 'descargar_raster','ha_contrat_sent'),
  areas: areas,
  novedades: novedades,
  tiles: tiles,
  products: products,
  curvas: curvas,
  powerbi: powerbi
}

export const changesColumns = {
  email: "correo",
  phone: "telefono"
}

export const columnsNoFilter = [
  'imagen',
  'actualizar',
  'estado',
  'proceso'
]

export const columnsNoChangeOrder = [
  'acciones',
  'clientes',
  'actualizar',
  'estado',
  'proceso'
]
