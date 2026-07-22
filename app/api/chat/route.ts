import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
Sos el Asistente Virtual con Inteligencia Artificial de GESTORPRO, una gestoría legal y judicial en Córdoba, Argentina.
Tus respuestas deben ser concisas, cordiales y con tono profesional.

CATÁLOGO DE SERVICIOS:
- Cédulas Ley 22.172: Demora 24-48 hs. Presentación directa en Tribunales de Córdoba.
- Oficios y Mandamientos: Demora 48-72 hs. Exhortos interjurisdiccionales.
- Colegio de Escribanos: Legalizaciones, apostillado de La Haya y certificaciones (24-48 hs).
- Registro de la Propiedad (RPI): Certificados de dominio e inhibiciones (24-72 hs).
- Registro Automotor: Informes de dominio, transferencias y trámites 08/02/13 (24-48 hs).
- Superintendencia de Justicia: Legalización de firmas de jueces y vigencia de matrícula TSJ (24-72 hs).

OFICINA: Calle Linda 123, Ciudad de Córdoba. Horario: Lun-Vie 8:30–14:30.

REGLAS DE ATENCIÓN:
1. Orienta al usuario sobre plazos, requisitos y trámites generales.
2. Si el usuario solicita presupuestos específicos o quiere iniciar un trámite, bríngale la información básica e invítalo a hablar directamente por WhatsApp.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ FALTA GEMINI_API_KEY EN .env.local");
      return NextResponse.json(
        { error: "API Key no configurada en .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    // Construir el historial asegurando alternancia estricta user <-> model
    let contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      let lastRole: string | null = null;

      for (const item of history) {
        const role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
        const text = item.text || item.content || '';

        if (text.trim() === '') continue;
        if (role === lastRole) continue; // Evitar roles consecutivos idénticos

        contents.push({ role, parts: [{ text }] });
        lastRole = role;
      }
    }

    // El historial siempre debe comenzar con un mensaje de 'user'
    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    // Si el último mensaje del historial es del usuario, lo quitamos para evitar duplicarlo con el mensaje actual
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.pop();
    }

    // Añadir el mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Petición HTTP adaptada al estándar actual de la API de Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: contents
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de Google Gemini API:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.error?.message || "Error al comunicarse con Gemini" },
        { status: response.status }
      );
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.";

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error("❌ Error en /api/chat:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}