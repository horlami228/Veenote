export interface DbConfig {
    uri: string;
}

export interface Config {
    development: DbConfig;
    production: DbConfig;
}

export const config: Config = {
    development: {
        uri: 'mongodb://localhost:27017/veenote',
    },

    production: {
        uri: process.env.DATABASE_URI || '',
    }
};
