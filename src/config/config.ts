import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PINATA_API_KEY: string;
  PINATA_SECRET_API_KEY: string;
  TENDERLY_URL: string;
}

const config: Config = {
  // eslint-disable-next-line no-undef
  PINATA_API_KEY: process.env.PINATA_API_KEY || '',
  // eslint-disable-next-line no-undef
  PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY || '',
  // eslint-disable-next-line no-undef
  TENDERLY_URL: process.env.TENDERLY_URL || '',
};

export default config;
