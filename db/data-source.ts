import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: configService.get<string>("dbHost"),
            port: configService.get<number>("dbPort"),
            username: configService.get<string>("username"),
            database: configService.get<string>("dbName"),
            password: configService.get<string>("password"),
            entities: ["dist/**/*.entity.js"],
            synchronize: false,
            migrations: ["dist/db/migrations/*.js"],
        };
    },
};