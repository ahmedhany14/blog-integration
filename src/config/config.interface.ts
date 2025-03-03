export interface AppConfig {
    port: number;
    env: string;
}

export interface DatabaseConfig {
    url: string;
}


export interface Config {
    app: AppConfig;
    database: DatabaseConfig;
}