import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })

// carga la configuración de variables de entorno 
// desde un archivo .env específico según el entorno

