# DermatoTriage CDSS (v4.0) 🩺🚀

**Sistema de Apoyo a la Decisión Clínica (CDSS) para Triaje Dermatológico en Atención Primaria.**

Este sistema es una aplicación **100% estática, offline-first**, diseñada para asistir a profesionales de la salud en la priorización de casos dermatológicos utilizando un motor de **Inferencia Matemática (Regresión Logística Multiclase)** basado en Softmax.

---

## 🧠 Arquitectura Clínica

El modelo analiza más de **100 variables clínicas** distribuidas en:

- **Perfil Demográfico & Comorbilidades**: Edad, fototipo, inmunosupresión y polifarmacia.
- **Semiología Avanzada**: Clasificación jerárquica de lesiones primarias, secundarias y de contenido líquido.
- **Topografía Inteligente**: Mapeo por regiones con despliegue de sub-localizaciones anatómicas.
- **Patrones de Distribución**: Identificación de patrones clásicos (Dermatomal, Acral, Fotoexpuesto).

## 🛡️ Seguridad y Transparencia (Explainability)

A diferencia de los modelos de "caja negra", el **DermatoTriage CDSS** incluye un módulo de **Análisis de Decisión** que:
1. Calcula la contribución individual de cada variable ($w_i \times x_i$).
2. Identifica los factores de mayor impacto que impulsaron la recomendación de prioridad.
3. Presenta los pesos matemáticos de forma transparente para auditoría médica constante.

## 🚀 Características Técnicas

- **Tecnología**: Vanilla JavaScript (ES6+), Tailwind CSS (CDN).
- **Offline-First**: Funciona sin conexión a internet desde cualquier navegador moderno (Edge Computing).
- **Modular**: Arquitectura desacoplada por grupos de características (`FEATURE_INDEX`).
- **Responsive**: Optimizado para su uso en tablets y dispositivos móviles en el punto de atención.

---

## 🏗️ Instalación y Uso

1. Clona este repositorio:
   ```bash
   git clone https://github.com/felipemirandalml-afk/dermato-triage-cdss.git
   ```
2. Abre `index.html` en tu navegador.

*Nota: No requiere instalación de dependencias ni servidor local.*

---

## ⚠️ Aviso Legal (Disclaimer)

Esta herramienta es un **Sistema de Apoyo a la Decisión Clínica**. La recomendación de prioridad generada por el algoritmo es sugerida y **no reemplaza el juicio clínico del médico tratante**. El profesional de salud es responsable del diagnóstico final y de la conducta clínica.

---
© 2026 DermatoTriage System. Desarrollado por felipemirandalml-afk.
