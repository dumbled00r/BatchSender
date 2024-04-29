import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import SendSection from '../components/SendSection';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome to my Dapp</title>
        <meta
          content="Created by @znfeau"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
        <SendSection />
        
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by @dumbled00rz 
        </a>
      </footer>
    </div>
  );
};

export default Home;
