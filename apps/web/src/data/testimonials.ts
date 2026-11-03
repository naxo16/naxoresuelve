export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  rating: number; // 1-5
  satisfactionScore: string; // e.g. "10/10"
  quote: string;
  project: string;
  date: string;
  verified: boolean;
  tag: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testimonio-1",
    name: "Gonzalo Morales Valenzuela",
    role: "Gerente de Operaciones",
    company: "Agrícola & Frutícola Los Boldos",
    city: "Curicó, Región del Maule",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "Nos salvó la vida con el tema de las cuadrillas y los contratistas agrícolas. Antes perdíamos días enteros peleando con planillas Excel desordenadas en el campo; ahora los informes de asistencia y kilos cosechados salen impecables al toque. Un 7 la pega de Pablo, muy profesional y cumplidor con las fechas.",
    project: "SaaS Gestión de Cuadrillas & Automatización Excel",
    date: "Octubre 2024",
    verified: true,
    tag: "Agroindustria & Cuadrillas",
  },
  {
    id: "testimonio-2",
    name: "Esteban Del Valle M.",
    role: "Socio Fundador & Administrador de Obras",
    company: "Del Valle Construcciones",
    city: "Talca, Región del Maule",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "El sitio web corporativo y la canalización de cotizaciones quedó de lujo. Lo que más rescato es que no hubo rodeos ni tecnicismos raros: nos hizo una propuesta clara de una sola página y entregó la plataforma funcionando antes del plazo. Las cotizaciones llegan directo al WhatsApp de faena sin perder un solo cliente.",
    project: "Plataforma Web Corporativa & Captación WhatsApp",
    date: "Agosto 2024",
    verified: true,
    tag: "Construcción & Obras",
  },
  {
    id: "testimonio-3",
    name: "Rodrigo Araya Tapia",
    role: "Director Ejecutivo",
    company: "JPVS Consultores",
    city: "Las Condes, Santiago",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "Teníamos un tremendo enredo con la duplicidad de datos de los clientes y la facturación histórica. Pablo estructuró una base de datos en PostgreSQL normalizada que anda como avión y no se cuelga con nada. La tranquilidad de tener los datos respaldados y seguros no tiene precio. Totalmente recomendable.",
    project: "Arquitectura PostgreSQL & Erradicación de Duplicidad",
    date: "Noviembre 2024",
    verified: true,
    tag: "Consultoría & Datos",
  },
  {
    id: "testimonio-4",
    name: "Marcela Cifuentes Rojas",
    role: "Jefa de Administración & Finanzas",
    company: "Transportes Cordillera Sur",
    city: "Rancagua, Región de O'Higgins",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "Cotizamos con tres agencias de Santiago y nos querían cobrar un ojo de la cara por meses de reuniones vacías. Con Naxo Resuelve cerramos el alcance exacto en un dos por tres, y en dos semanas teníamos el sistema de seguimiento de guías de despacho operando en el servidor de pruebas. Se agradece la seriedad y la transparencia.",
    project: "Software Web de Despacho & Control de Flota",
    date: "Enero 2025",
    verified: true,
    tag: "Transporte & Logística",
  },
  {
    id: "testimonio-5",
    name: "Cristóbal Henríquez Soto",
    role: "Administrador General",
    company: "Comercial & Distribuidora El Maule",
    city: "Linares, Región del Maule",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "Arrendamos la solución SaaS para el control de inventario y pedidos. La plataforma no se pega nunca, los trabajadores la aprendieron a usar en una tarde y cuando tuvimos una duda con una configuración, Pablo nos respondió por WhatsApp al tiro. Nos simplificó la pega al 100%.",
    project: "Arriendo SaaS Control de Existencias & Pedidos",
    date: "Marzo 2025",
    verified: true,
    tag: "Comercio Mayorista",
  },
  {
    id: "testimonio-6",
    name: "Felipe Valenzuela Bravo",
    role: "Gerente Comercial",
    company: "Inmobiliaria & Loteos del Sur",
    city: "Chillán, Región de Ñuble",
    rating: 5,
    satisfactionScore: "10/10",
    quote:
      "Excelente servicio. Nos levantó la arquitectura web y la captación de prospectos en tiempo récord. Lo mejor es que no quedas amarrado: te entrega las credenciales y el código de verdad, con garantía de respaldo. Un agrado tratar directamente con el analista que programa y no con intermediarios.",
    project: "Plataforma Web de Loteos & Captación CRM",
    date: "Febrero 2025",
    verified: true,
    tag: "Desarrollo Inmobiliario",
  },
];
