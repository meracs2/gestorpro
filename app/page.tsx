"use client";

import { useState, useRef, useEffect } from 'react';

interface Service {
  id: string;
  title: string;
  category: 'Judicial' | 'Registral' | 'Administrativo' | 'Previsional';
  description: string;
  detalle: string;
  tiempoDemora: string;
  explicacionAmpliada: string;
  organismo: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  options?: { label: string; action: string; data?: string }[];
}

const servicesList: Service[] = [
  // --- JUDICIAL ---
  {
    id: 'cedulas',
    title: 'Cédulas Ley 22.172',
    category: 'Judicial',
    description: 'Diligenciamiento profesional de cédulas y notificaciones con presentación directa en Tribunales de Córdoba.',
    detalle: 'Optimización de plazos procesales, control exhaustivo de casilleros y devolución inmediata.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Recepción de la cédula, control de recaudaciones legales, presentación en la oficina de mandamientos y notificaciones o tribunal correspondiente, seguimiento diario y retiro de copia diligenciada.',
    organismo: 'Palacio de Justicia I y II'
  },
  {
    id: 'oficios',
    title: 'Oficios y Mandamientos',
    category: 'Judicial',
    description: 'Gestión y trámite de oficios judiciales y mandamientos de ley interjurisdiccionales.',
    detalle: 'Articulación directa con juzgados para destrabar exhortos y mandamientos sin demoras.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Compulsa, libramientos, control de firmas autorizadas y legalizaciones necesarias ante el organismo requerido.',
    organismo: 'Juzgados Civiles, Comerciales y Laborales'
  },
  {
    id: 'exhortos',
    title: 'Exhortos Ley 22.172',
    category: 'Judicial',
    description: 'Diligenciamiento integral de exhortos de otras provincias con radicación en Córdoba.',
    detalle: 'Presentación, sorteo de juzgado, pago de tasa de justicia y seguimiento hasta su total traba.',
    tiempoDemora: '72 a 96 hs',
    explicacionAmpliada: 'Ideal para estudios jurídicos de Buenos Aires, Rosario u otras jurisdicciones que necesitan representación sólida y ágil en Córdoba.',
    organismo: 'Cámara Única / Of. de Sorteos'
  },
  {
    id: 'superintendencia',
    title: 'Superintendencia de Justicia',
    category: 'Judicial',
    description: 'Legalizaciones judiciales, matrículas y trámites en el TSJ Córdoba.',
    detalle: 'Gestiones ante el Tribunal Superior de Justicia y dependencias administrativas del Poder Judicial.',
    tiempoDemora: '24 a 72 hs',
    explicacionAmpliada: 'Legalizaciones de firmas de jueces/secretarios, certificaciones de vigencia de matrícula profesional y presentaciones ante Superintendencia.',
    organismo: 'Tribunal Superior de Justicia (TSJ)'
  },
  {
    id: 'quiebras',
    title: 'Informes de Juicios Universales',
    category: 'Judicial',
    description: 'Solicitud de informes de juicios universales, quiebras, concursos y sucesiones.',
    detalle: 'Consulta directa en Cámaras y Juzgados Civiles y Comerciales.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Revisión de bases de datos judiciales y solicitud de certificados de no inhibición y no concurso en la jurisdicción local.',
    organismo: 'Fuero Civil y Comercial'
  },
  {
    id: 'familia',
    title: 'Trámites en Fuero de Familia',
    category: 'Judicial',
    description: 'Diligenciamiento de medidas cautelares, alimentos y régimen de comunicación.',
    detalle: 'Gestión especializada y confidencial ante los Tribunales de Familia de Córdoba.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Presentación de testimonios, oficios a empleadores, bancos o registros civiles en expedientes de familia con estricta reserva.',
    organismo: 'Tribunales de Familia'
  },
  {
    id: 'laboral',
    title: 'Trámites en Fuero Laboral',
    category: 'Judicial',
    description: 'Presentación de notas, giros, oficios y retiro de libramientos laborales.',
    detalle: 'Seguimiento riguroso de expedientes en Conciliación y Juzgados Laborales.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Control y diligenciamiento de medidas urgentes, oficios a ART y presentación de escritos de estilo en el fuero del trabajo.',
    organismo: 'Tribunales del Trabajo'
  },
  {
    id: 'penal_judicial',
    title: 'Gestiones en Fuero Penal',
    category: 'Judicial',
    description: 'Presentación de escritos de mero trámite, solicitud de copias y control de expedientes penales.',
    detalle: 'Asistencia para letrados en fiscalías y cámaras del crimen.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Compulsa de expedientes, solicitud de libertades o eximiciones de prisión en mesa de entradas.',
    organismo: 'Tribunales Penales / Fiscalías'
  },

  // --- REGISTRAL ---
  {
    id: 'propiedad',
    title: 'Registro General de la Propiedad (RPI)',
    category: 'Registral',
    description: 'Solicitud e inscripción de certificados de dominio, inhibiciones y minutas.',
    detalle: 'Gestiones ágiles ante el RPI para asegurar que tus operaciones inmobiliarias no sufran trabas.',
    tiempoDemora: '24 a 72 hs',
    explicacionAmpliada: 'Presentación y retiro de rogatorias, solicitud de certificados e informes dominiales, inhibiciones y anotaciones personales.',
    organismo: 'RPI Córdoba'
  },
  {
    id: 'automotor',
    title: 'Registro Seccional del Automotor',
    category: 'Registral',
    description: 'Informes de dominio, radicación, transferencias y trámites en seccionales.',
    detalle: 'Asistencia y presentación express en registros del automotor con control previo de documentación.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Verificación de legajos, presentación de formularios 08, 02, 13, obtención de informes de dominio y retiros de cédulas o títulos.',
    organismo: 'Registros Seccionales del Automotor'
  },
  {
    id: 'escribanos',
    title: 'Colegio de Escribanos',
    category: 'Registral',
    description: 'Legalización, apostillado y certificación de actuaciones notariales.',
    detalle: 'Trámite presencial y digital de actas, escrituras e instrumentos notariales ante la sede Córdoba.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Presentación de hojas notariales, legalización de firmas de escribanos de Córdoba, tramitación de apostillas de La Haya y retiros oficiales.',
    organismo: 'Colegio de Escribanos de Córdoba'
  },
  {
    id: 'catastro',
    title: 'Dirección General de Catastro',
    category: 'Registral',
    description: 'Certificados catastrales, visado de planos y antecedentes parcelarios.',
    detalle: 'Gestión ante Catastro de la Provincia para informes técnicos y valuaciones fiscales.',
    tiempoDemora: '48 a 96 hs',
    explicacionAmpliada: 'Solicitud de certificados catastrales para actos notariales, consulta de polígonos, partidas y antecedentes de mensura.',
    organismo: 'Dirección General de Catastro'
  },
  {
    id: 'prendas',
    title: 'Inscripción de Prendas y Contratos',
    category: 'Registral',
    description: 'Trámites de contratos de prenda, inscripción y cancelación en registros competentes.',
    detalle: 'Resguardo legal de garantías reales y contratos prendarios comerciales.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Presentación de contratos originales, control de gravámenes y retiro de toma de razón.',
    organismo: 'Registro de Prendas Córdoba'
  },
  {
    id: 'patentes_registrales',
    title: 'Informes Historicos de Dominio',
    category: 'Registral',
    description: 'Búsqueda de titularidades históricas y cadenas dominiales inmobiliarias o vehiculares.',
    detalle: 'Informes ampliados para estudios de títulos.',
    tiempoDemora: '48 a 96 hs',
    explicacionAmpliada: 'Análisis de antecedentes registrales completos desde la matriculación inicial.',
    organismo: 'RPI / Registros del Automotor'
  },
  {
    id: 'anotaciones_personales',
    title: 'Certificados de Inhibición General',
    category: 'Registral',
    description: 'Emisión de certificados de inhibición de bienes y gravámenes a nivel provincial.',
    detalle: 'Indispensable para operaciones de venta y constitución de derechos reales.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Solicitud de certificados nominativos de inhibición en bases del RPI.',
    organismo: 'Registro General de la Propiedad'
  },
  {
    id: 'propiedad_intelectual',
    title: 'Trámites de Marcas y Patentes',
    category: 'Registral',
    description: 'Asesoramiento y gestión de presentación de marcas y oposiciones en Córdoba.',
    detalle: 'Protección de activos intangibles y marcas comerciales.',
    tiempoDemora: '72 a 96 hs',
    explicacionAmpliada: 'Presentación local y enlace con oficinas centrales de propiedad intelectual.',
    organismo: 'Delegación INPI Córdoba'
  },

  // --- ADMINISTRATIVO ---
  {
    id: 'comercial_pj',
    title: 'Inspección de Personas Jurídicas (IPJ)',
    category: 'Administrativo',
    description: 'Trámites societarios, rúbrica de libros y presentación de balances ante la IPJ.',
    detalle: 'Gestión integral para sociedades, asociaciones civiles y fundaciones en Córdoba.',
    tiempoDemora: '72 a 96 hs',
    explicacionAmpliada: 'Presentación de estatutos, inscripciones de directorios, rubrica de libros contables y societarios ante el organismo de control.',
    organismo: 'IPJ Córdoba'
  },
  {
    id: 'rentas',
    title: 'Dirección General de Rentas (DGR)',
    category: 'Administrativo',
    description: 'Libre deuda fiscal, altas/bajas de IIBB, planes de pago y certificados de exención.',
    detalle: 'Gestión de trámites impositivos provinciales de la Provincia de Córdoba.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Obtención de certificados fiscales, presentación de recursos administrativos y regularización de deudas inmobiliarias o automotores.',
    organismo: 'Rentas Córdoba'
  },
  {
    id: 'municipalidad',
    title: 'Municipalidad de Córdoba',
    category: 'Administrativo',
    description: 'Libre deuda de Tasa de Comercio, Inmuebles, automotor y habilitaciones.',
    detalle: 'Gestiones presenciales en Palacio 6 de Julio y CPC habilitados.',
    tiempoDemora: '24 a 72 hs',
    explicacionAmpliada: 'Tramitación de certificados catastrales municipal, libre deudas y gestiones vinculadas a habilitaciones comerciales.',
    organismo: 'Municipalidad de Córdoba'
  },
  {
    id: 'antecedentes',
    title: 'Certificados de Antecedentes',
    category: 'Administrativo',
    description: 'Gestión y tramitación de certificados de antecedentes penales y policiales.',
    detalle: 'Asistencia para la obtención rápida de certificaciones requeridas para procesos o trámites laborales.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Asesoramiento y gestión presencial/digital en dependencias autorizadas de la provincia.',
    organismo: 'Registro Nacional / Provincial'
  },
  {
    id: 'habilitaciones',
    title: 'Habilitaciones Comerciales Express',
    category: 'Administrativo',
    description: 'Gestión de expedientes de habilitación para comercios, industrias y servicios.',
    detalle: 'Seguimiento de visados técnicos, bromatología y bomberos.',
    tiempoDemora: '5 a 10 días hábiles',
    explicacionAmpliada: 'Armado de carpeta técnica, presentación municipal y control de inspecciones periódicas.',
    organismo: 'Dirección de Habilitaciones Municipal'
  },
  {
    id: 'licencias_conducir',
    title: 'Gestiones Licencias y Antecedentes',
    category: 'Administrativo',
    description: 'Informes de infracciones, libre deuda de multas y libreta sanitaria.',
    detalle: 'Trámites ante el Tribunal de Faltas de la Ciudad de Córdoba.',
    tiempoDemora: '24 a 48 hs',
    explicacionAmpliada: 'Pago de francas, obtención de certificados de libre multa y resolución de contravenciones menores.',
    organismo: 'Tribunal de Faltas Municipal'
  },
  {
    id: 'ministerio_trabajo',
    title: 'Ministerio de Trabajo Córdoba',
    category: 'Administrativo',
    description: 'Rúbrica de hojas móviles, homologación de acuerdos y presentación de planillas.',
    detalle: 'Trámites laborales provinciales y acuerdos conciliatorios privados.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Gestión ante la cartera laboral provincial para control de libros de sueldos y jornales.',
    organismo: 'Secretaría de Trabajo Córdoba'
  },
  {
    id: 'epec_ecogas',
    title: 'Gestiones EPEC y ECOGAS',
    category: 'Administrativo',
    description: 'Certificados de libre deuda, cambios de titularidad y gestiones comerciales de servicios.',
    detalle: 'Solución de trámites de suministros para inmuebles comerciales y particulares.',
    tiempoDemora: '48 a 96 hs',
    explicacionAmpliada: 'Presentación de formularios y seguimiento de bajas, altas o rectificación de facturación.',
    organismo: 'EPEC / ECOGAS'
  },

  // --- PREVISIONAL ---
  {
    id: 'anses',
    title: 'Trámites ante ANSES',
    category: 'Previsional',
    description: 'Presentación de expedientes de jubilaciones, pensiones, reajustes y telegramas laborales.',
    detalle: 'Seguimiento de trámites previsionales y turnos preferenciales en delegaciones locales.',
    tiempoDemora: '48 a 96 hs',
    explicacionAmpliada: 'Presentación de documentación respaldatoria, certificaciones de servicios y seguimiento de expedientes previsionales en curso.',
    organismo: 'ANSES UDAI Córdoba'
  },
  {
    id: 'caja_jubilaciones',
    title: 'Caja de Jubilaciones de Córdoba',
    category: 'Previsional',
    description: 'Reconocimiento de servicios, cómputos y trámites previsionales provinciales.',
    detalle: 'Gestiones específicas para agentes públicos de la provincia de Córdoba.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Presentación de formularios, acreditación de aportes y gestiones de expedientes jubilatorios provinciales.',
    organismo: 'Caja de Jubilaciones, Pensiones y Retiros de Córdoba'
  },
  {
    id: 'pbu_reajustes',
    title: 'Reajustes de Haberes Previsionales',
    category: 'Previsional',
    description: 'Seguimiento y diligenciamiento de expedientes de reajuste por movilidad.',
    detalle: 'Trámites especiales para jubilados nacionales y provinciales.',
    tiempoDemora: '72 a 96 hs',
    explicacionAmpliada: 'Presentación de cálculos actuariales y notas de reclamo administrativo previo a vía judicial.',
    organismo: 'ANSES / Caja de Jubilaciones'
  },
  {
    id: 'reconocimiento_servicios',
    title: 'Reconocimiento de Servicios',
    category: 'Previsional',
    description: 'Armado y presentación de expedientes para certificación de aportes históricos.',
    detalle: 'Compilación de certificaciones laborales en distintos empleadores.',
    tiempoDemora: '5 a 7 días hábiles',
    explicacionAmpliada: 'Revisión de historias previsionales, armado de formularios SICAM o analógicos y presentación formal.',
    organismo: 'Unidad de Atención Integral ANSES'
  },
  {
    id: 'pensiones_graciables',
    title: 'Pensiones y Subsidios de Ley',
    category: 'Previsional',
    description: 'Gestión y presentación de solicitudes de pensiones directas, derivadas o graciables.',
    detalle: 'Asesoramiento y seguimiento de expedientes sociales.',
    tiempoDemora: '72 a 96 hs',
    explicacionAmpliada: 'Acompañamiento en el cumplimiento de requisitos socioeconómicos y aportes documentales.',
    organismo: 'Secretaría de Previsión Social'
  },
  {
    id: 'moratorias_previsionales',
    title: 'Moratorias y Planes de Pago',
    category: 'Previsional',
    description: 'Evaluación y liquidación de planes de facilidades de pago para obtención de haberes.',
    detalle: 'Análisis de moratorias vigentes y turnos para unificación de aportes.',
    tiempoDemora: '48 a 72 hs',
    explicacionAmpliada: 'Confección de liquidaciones a través de sistemas oficiales y presentación de plan de pagos.',
    organismo: 'AFIP / ANSES'
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCalcService, setSelectedCalcService] = useState<Service>(servicesList[0]);
  
  // Estado para el menú hamburguesa móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estado del asistente virtual flotante
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! 👋 Bienvenido a la gestoría. Por favor, seleccioná el área del trámite que necesitás consultar:',
      options: [
        { label: '⚖️ Trámites Judiciales', action: 'cat', data: 'Judicial' },
        { label: '🏢 Trámites Registrales', action: 'cat', data: 'Registral' },
        { label: '📋 Trámites Administrativos', action: 'cat', data: 'Administrativo' },
        { label: '👴 Trámites Previsionales', action: 'cat', data: 'Previsional' }
      ]
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 6;
  const whatsappPhone = "5493510000000";

  const filteredServices = activeTab === 'todos' 
    ? servicesList 
    : servicesList.filter(s => s.category.toLowerCase() === activeTab.toLowerCase());

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAssistantOpen]);

  const handleOptionClick = (action: string, data?: string) => {
    if (action === 'cat' && data) {
      const categoryServices = servicesList.filter(s => s.category.toLowerCase() === data.toLowerCase());
      const newMsgUser: ChatMessage = { role: 'user', text: `Quiero ver trámites del área: ${data}` };
      const subMenuOptions = categoryServices.map(s => ({
        label: `📄 ${s.title}`,
        action: 'service',
        data: s.id
      }));
      subMenuOptions.push({ label: '🔙 Volver al menú principal', action: 'main_menu', data: '' });
      
      const newMsgBot: ChatMessage = {
        role: 'model',
        text: `Seleccionaste el área **${data}**. Elegí el trámite específico para ver su detalle:`,
        options: subMenuOptions
      };
      setMessages(prev => [...prev, newMsgUser, newMsgBot]);
    }
    else if (action === 'service' && data) {
      const service = servicesList.find(s => s.id === data);
      if (!service) return;
      const newMsgUser: ChatMessage = { role: 'user', text: `Consultar sobre: ${service.title}` };
      const newMsgBot: ChatMessage = {
        role: 'model',
        text: `📌 **${service.title}**\n\n` +
              `• **Organismo:** ${service.organismo}\n` +
              `• **Demora estimada:** ${service.tiempoDemora}\n` +
              `• **Detalle:** ${service.explicacionAmpliada}\n\n` +
              `¡Llegamos al final de la explicación! Si deseas avanzar con esta gestión, coordinemos directamente por WhatsApp con el mensaje precargado.`,
        options: [
          { label: '💬 Coordinar gestión por WhatsApp', action: 'whatsapp', data: service.title },
          { label: '🔙 Volver al menú principal', action: 'main_menu', data: '' }
        ]
      };
      setMessages(prev => [...prev, newMsgUser, newMsgBot]);
    }
    else if (action === 'main_menu') {
      const newMsgUser: ChatMessage = { role: 'user', text: 'Volver al menú principal' };
      const newMsgBot: ChatMessage = {
        role: 'model',
        text: 'Menú principal. Seleccioná el área correspondiente:',
        options: [
          { label: '⚖️ Trámites Judiciales', action: 'cat', data: 'Judicial' },
          { label: '🏢 Trámites Registrales', action: 'cat', data: 'Registral' },
          { label: '📋 Trámites Administrativos', action: 'cat', data: 'Administrativo' },
          { label: '👴 Trámites Previsionales', action: 'cat', data: 'Previsional' }
        ]
      };
      setMessages(prev => [...prev, newMsgUser, newMsgBot]);
    }
    else if (action === 'whatsapp' && data) {
      const text = `Hola, consulté por el trámite *${data}* en el asistente virtual de la web y quisiera coordinar para iniciarlo.`;
      window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleWhatsAppCalc = () => {
    const text = `Hola, quiero iniciar o consultar por el trámite de *${selectedCalcService.title}* (${selectedCalcService.category}). El plazo estimado indicado es de ${selectedCalcService.tiempoDemora} ante el organismo ${selectedCalcService.organismo}.`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      color: '#0f172a', 
      minHeight: '100vh', 
      width: '100%', 
      margin: 0, 
      padding: 0, 
      boxSizing: 'border-box', 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Estilos Responsivos y Media Queries */}
      <style>{`
        .nav-desktop {
          display: flex;
          gap: 28px;
          align-items: center;
        }
        .hamburger-btn {
          display: none;
        }
        .mobile-dropdown-menu {
          display: none;
        }
        .hero-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          align-items: center;
          margin-bottom: 60px;
          background-color: #ffffff;
          border-radius: 20px;
          padding: 56px 40px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }
        .simulator-card {
          box-sizing: border-box;
          width: 100%;
        }
        .filter-desktop {
          display: flex;
          gap: 6px;
          background-color: #e2e8f0;
          padding: 4px;
          border-radius: 8px;
        }
        .filter-mobile {
          display: none;
        }
        .chat-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
        }
        .chat-window {
          width: 380px;
          height: 520px;
        }
        .chat-trigger-btn {
          background-color: #0f172a;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }
          .hamburger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 18px;
            cursor: pointer;
            color: #0f172a;
          }
          .mobile-dropdown-menu {
            display: ${isMobileMenuOpen ? 'flex' : 'none'};
            flex-direction: column;
            gap: 12px;
            padding: 16px 20px;
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
          }
          .hero-section {
            grid-template-columns: 1fr;
            padding: 24px 16px;
            gap: 28px;
            margin-bottom: 32px;
          }
          .simulator-card {
            padding: 18px !important;
          }
          .filter-desktop {
            display: none;
          }
          .filter-mobile {
            display: block;
            width: 100%;
          }
          .chat-widget-container {
            bottom: 20px;
            right: 20px;
            left: auto;
          }
          .chat-window {
            width: calc(100vw - 32px) !important;
            height: 80vh !important;
            max-height: 550px;
          }
          .chat-trigger-btn {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            padding: 0;
            position: relative;
          }
          .chat-trigger-btn .chat-btn-text {
            display: none;
          }
          .chat-trigger-btn .chat-btn-icon {
            font-size: 24px;
          }
          .chat-trigger-btn .chat-btn-status {
            position: absolute;
            top: 2px;
            right: 2px;
            border: 2px solid #0f172a;
          }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '12px 20px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              backgroundColor: '#0f172a', 
              color: '#ffffff', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800,
              fontSize: '18px'
            }}>
              G
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              GESTOR<span style={{ color: '#2563eb' }}>PRO</span>
            </span>
          </div>

          {/* Menú para Escritorio */}
          <nav className="nav-desktop">
            <a href="#hero" style={{ fontSize: '14px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Inicio</a>
            <a href="#servicios" style={{ fontSize: '14px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Servicios</a>
            <a href="#proceso" style={{ fontSize: '14px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Cómo Trabajamos</a>
            <a href="#contacto" style={{ fontSize: '14px', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Oficina y Contacto</a>
          </nav>

          {/* Botón Hamburguesa Móvil */}
          <button 
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Desplegable Móvil al Presionar Hamburguesa */}
        <div className="mobile-dropdown-menu">
          <a 
            href="#hero" 
            onClick={() => setIsMobileMenuOpen(false)} 
            style={{ fontSize: '15px', color: '#0f172a', textDecoration: 'none', fontWeight: 600, padding: '6px 0' }}
          >
            Inicio
          </a>
          <a 
            href="#servicios" 
            onClick={() => setIsMobileMenuOpen(false)} 
            style={{ fontSize: '15px', color: '#0f172a', textDecoration: 'none', fontWeight: 600, padding: '6px 0' }}
          >
            Servicios
          </a>
          <a 
            href="#proceso" 
            onClick={() => setIsMobileMenuOpen(false)} 
            style={{ fontSize: '15px', color: '#0f172a', textDecoration: 'none', fontWeight: 600, padding: '6px 0' }}
          >
            Cómo Trabajamos
          </a>
          <a 
            href="#contacto" 
            onClick={() => setIsMobileMenuOpen(false)} 
            style={{ fontSize: '15px', color: '#0f172a', textDecoration: 'none', fontWeight: 600, padding: '6px 0' }}
          >
            Oficina y Contacto
          </a>
          <a 
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 14px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '4px'
            }}
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '20px 16px', boxSizing: 'border-box' }}>
        
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', marginBottom: '16px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>Plataforma Integral de Gestoría Córdoba</span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(26px, 4vw, 48px)', 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              lineHeight: 1.2, 
              margin: '0 0 16px 0', 
              color: '#0f172a'
            }}>
              Gestión Judicial, Registral, Administrativa y Previsional.
            </h1>

            <p style={{ 
              fontSize: '15px', 
              color: '#64748b', 
              lineHeight: 1.6, 
              margin: '0 0 24px 0'
            }}>
              Optimizamos los tiempos de tu estudio o empresa con presencia presencial diaria en todas las dependencias, fueros y organismos de Córdoba.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a 
                href="#servicios"
                style={{ 
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px 24px', 
                  backgroundColor: '#0f172a', 
                  color: '#ffffff', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                  display: 'inline-block',
                  boxSizing: 'border-box'
                }}
              >
                Ver Servicios →
              </a>
            </div>
          </div>

          {/* SIMULADOR ADAPTADO Y RESPONSIVO */}
          <div className="simulator-card" style={{ 
            backgroundColor: '#0f172a', 
            borderRadius: '16px', 
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0' }}>
              ⚡ Simulador Exprés de Trámites
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Tipo de Trámite / Servicio
              </label>
              <select 
                value={selectedCalcService.id}
                onChange={(e) => {
                  const found = servicesList.find(s => s.id === e.target.value);
                  if (found) setSelectedCalcService(found);
                }}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {servicesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '10px', 
              padding: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Plazo Estimado</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80' }}>{selectedCalcService.tiempoDemora}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Organismo</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>{selectedCalcService.organismo}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppCalc}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              💬 Iniciar trámite por WhatsApp
            </button>
          </div>
        </section>

        {/* SECCIÓN DE SERVICIOS */}
        <section id="servicios" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                Servicios
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Filtrá por área profesional para encontrar el trámite específico.
              </p>
            </div>

            {/* FILTRO 1: DESKTOP (Botones) */}
            <div className="filter-desktop">
              {['todos', 'Judicial', 'Registral', 'Administrativo', 'Previsional'].map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#0f172a' : '#64748b',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* FILTRO 2: MÓVIL (Menú Desplegable / Select) */}
            <div className="filter-mobile">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Filtrar por Categoría:
              </label>
              <select
                value={activeTab}
                onChange={(e) => { setActiveTab(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  color: '#0f172a',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="todos">Todos los servicios</option>
                <option value="Judicial">Judicial</option>
                <option value="Registral">Registral</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Previsional">Previsional</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {currentItems.map((service) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(service)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#f1f5f9', borderRadius: '100px', color: '#475569', fontWeight: 600, textTransform: 'uppercase' }}>
                      {service.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                      ⏱ {service.tiempoDemora}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
                    {service.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {service.description}
                  </p>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                  Ver detalles completos →
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: isActive ? '#0f172a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#0f172a',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* SECCIÓN CÓMO TRABAJAMOS */}
        <section id="proceso" style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Cómo Trabajamos
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Un proceso ágil y transparente diseñado para optimizar el tiempo de tu estudio o empresa.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              {
                step: '01',
                title: 'Contacto y Envío',
                desc: 'Nos enviás la documentación digitalizada y los detalles del trámite requerido por WhatsApp o correo.'
              },
              {
                step: '02',
                title: 'Revisión y Presupuesto',
                desc: 'Controlamos los recaudos formales y te enviamos el presupuesto detallado de tasas y honorarios.'
              },
              {
                step: '03',
                title: 'Diligenciamiento',
                desc: 'Realizamos la presentación y seguimiento presencial diario en el organismo correspondiente de Córdoba.'
              },
              {
                step: '04',
                title: 'Entrega y Comprobante',
                desc: 'Te devolvemos la constancia digitalizada y el instrumento original por el medio acordado.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#2563eb',
                  opacity: 0.3,
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  {item.step}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* UBICACIÓN Y MAPA */}
        <section id="contacto" style={{ marginBottom: '60px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                Oficina Principal
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                Operamos de forma presencial con cobertura en Córdoba y el interior, optimizando los plazos y gestiones ante cada dependencia.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
                <li>📍 <strong>Dirección:</strong> Calle Linda 123, Córdoba Capital.</li>
                <li>⏱ <strong>Horario de atención:</strong> Lunes a Viernes de 8:00 a 16:00 hs.</li>
              </ul>
            </div>

            <div style={{ width: '100%', height: '260px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9' }}>
              <iframe
                title="Ubicación Oficina"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.996191740938!2d-64.192323!3d-31.416875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a285d1e2e1d7%3A0x6b7724d1a1b8cf4b!2sTribunales%20I%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1650000000000!5m2!1ses-419!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

      </div>

      {/* ASISTENTE VIRTUAL INTERACTIVO */}
      <div className="chat-widget-container">
        {!isAssistantOpen ? (
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="chat-trigger-btn"
            aria-label="Abrir asistente virtual"
          >
            <span className="chat-btn-icon" style={{ fontSize: '16px' }}>💬</span>
            <span className="chat-btn-text">Asistente Virtual</span>
            <span className="chat-btn-status" style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
          </button>
        ) : (
          <div className="chat-window" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header del chat */}
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Asistente GestorPro</h4>
                <span style={{ fontSize: '11px', color: '#4ade80' }}>● En línea</span>
              </div>
              <button
                onClick={() => setIsAssistantOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Mensajes */}
            <div ref={chatContainerRef} style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8fafc' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%'
                }}>
                  <div style={{
                    backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    border: msg.role === 'model' ? '1px solid #e2e8f0' : 'none',
                    boxShadow: msg.role === 'model' ? '0 2px 5px rgba(0,0,0,0.02)' : 'none',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>

                  {msg.options && msg.options.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt.action, opt.data)}
                          style={{
                            backgroundColor: opt.action === 'whatsapp' ? '#16a34a' : '#ffffff',
                            color: opt.action === 'whatsapp' ? '#ffffff' : '#1e293b',
                            border: opt.action === 'whatsapp' ? 'none' : '1px solid #cbd5e1',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer del chat */}
            <div style={{ padding: '10px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Seleccioná una opción para continuar</span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETALLE DE SERVICIO */}
      {selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            <button
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 600
              }}
            >
              ✕
            </button>

            <span style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '100px', fontWeight: 600, textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
              {selectedService.category}
            </span>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
              {selectedService.title}
            </h3>

            <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, marginBottom: '16px' }}>
              ⏱ Demora: {selectedService.tiempoDemora} | Organismo: {selectedService.organismo}
            </p>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              {selectedService.explicacionAmpliada}
            </p>

            <button
              onClick={() => {
                const text = `Hola, quiero coordinar la gestión de *${selectedService.title}*.`;
                window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              💬 Coordinar por WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ 
        backgroundColor: '#0f172a', 
        color: '#94a3b8', 
        padding: '40px 20px 24px 20px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800,
                fontSize: '14px'
              }}>
                G
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                GESTOR<span style={{ color: '#2563eb' }}>PRO</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Soluciones integrales en gestoría judicial, registral, administrativa y previsional en Córdoba e interior.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0' }}>
              Contacto Directo
            </h4>
            <p style={{ fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              📍 Calle Linda 123, Córdoba Capital.<br />
              ⏱ Lunes a Viernes de 8:00 a 16:00 hs.
            </p>
            <button
              onClick={() => window.open(`https://wa.me/${whatsappPhone}?text=` + encodeURIComponent('Hola, quiero hacer una consulta general desde la web.'), '_blank')}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              💬 WhatsApp Directo
            </button>
          </div>
        </div>

        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          borderTop: '1px solid #1e293b', 
          paddingTop: '20px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          fontSize: '12px',
          textAlign: 'center'
        }}>
          <span>© {new Date().getFullYear()} GestorPro Córdoba e interior. Todos los derechos reservados.</span>
        </div>
      </footer>

    </div>
  );
}