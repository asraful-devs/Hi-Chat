import 'dotenv/config';

export const ENV = {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    NODE_ENV: process.env.NODE_ENV as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    RESEND_API_KEY: process.env.RESEND_API_KEY as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    ARCJET_KEY: process.env.ARCJET_KEY as string,
    ARCJET_ENV: process.env.ARCJET_ENV as string,
};
