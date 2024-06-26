import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as basicAuth from 'express-basic-auth'

async function start() {
    const app = await NestFactory.create(AppModule)
    const PORT = Number(process.env.PORT) || 5000
    app.enableCors({
        origin: true,
    })
    app.use(
        // Paths you want to protect with basic auth
        '/api/docs*',
        basicAuth({
            challenge: true,
            users: {
                admin: process.env.PASSWORD,
            },
        })
    )
    const config = new DocumentBuilder()
        .setTitle('NestJS-Ecommerce')
        .setDescription('Zoomish backend for ecommerce')
        .setVersion('3.4.2')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth' // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(PORT, async () => {
        console.log(`Docs run on ${await app.getUrl()}`)
        console.log(`Server run on ${await app.getUrl()}/api/docs`)
    })
}

start()
