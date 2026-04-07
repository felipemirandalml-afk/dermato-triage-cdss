/**
 * audit_logger.js - Sistema de Trazabilidad y Auditoría Médica
 * Registra eventos críticos para cumplimiento de seguridad y explicabilidad.
 */

export const auditLogger = {
  /**
   * Registra un evento de triaje.
   * @param {Object} input - Datos del paciente (sin PII si es posible)
   * @param {Object} output - Resultado del motor
   */
  logTriage(input, output) {
    const timestamp = new Date().toISOString();
    const eventId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);

    const auditEvent = {
      eventId,
      timestamp,
      version: "2.1.0",
      patientProfile: {
        age: input.age,
        sex: input.sex,
        timing: input.timing,
        featuresCount: Object.keys(input.features || {}).length
      },
      inference: {
        priority: output.priority,
        syndrome: output.primary_syndrome,
        confidence: output.probabilistic_analysis?.top_probability,
        triggeredRules: output.triggered_rules || []
      }
    };

    // En producción esto se enviaría a un endpoint de telemetría segura
    /*
    console.group(`🩺 Audit Event: [${eventId}]`);
    console.log("Timestamp:", timestamp);
    console.log("Input Profile:", auditEvent.patientProfile);
    console.log("Result:", auditEvent.inference);
    console.groupEnd();
    */

    return auditEvent;
  }
};
