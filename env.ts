import dotenv from 'dotenv'
process.env['APP_ENV'] ||= 'production'
dotenv.config({
  path: process.env['APP_ENV'] == 'development' ? '.env' : `.env.${process.env['APP_ENV']}`,
})
