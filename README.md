# Team Members:- 

1.y.jaswanth
2.p.Bhargav.S.S
3.B.Hema Swarup

# Smart Mirror Trading DApp on Aptos

A decentralized application built on the Aptos blockchain that allows users to automate their trading by mirroring the strategies of successful traders.

## Overview

This DApp provides a seamless experience for users to engage in "mirror trading" or "copy trading". By connecting their Aptos wallet, users can select a "leader" trader to follow, configure their own risk management rules, and have the DApp automatically execute trades on their behalf, mirroring the leader's actions.

The project includes both a frontend built with React and a Move smart contract to handle the on-chain logic.

## Features

- **Mirror Trading**: Follow any Aptos wallet address and automatically copy their trades.
- **Customizable Trading Rules**:
  - Set maximum trade sizes.
  - Define stop-loss percentages.
  - Configure a delay before copying trades.
  - Enable or disable trading at any time.
- **Live Trading Data**: View real-time trading data from global markets.
- **AI Trading Assistant**: An integrated chatbot to get information about stocks, crypto, and trading strategies.
- **Wallet Integration**: Securely connect with various Aptos wallets using the Aptos Wallet Adapter.
- **On-chain Logic**: All trading and rule-setting logic is handled by a secure Move smart contract on the Aptos network.
- **Modern UI**: A sleek and responsive user interface built with Tailwind CSS and shadcn/ui.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Aptos TS SDK
- Aptos Wallet Adapter
- TanStack Query for data fetching and state management.

### Backend (Smart Contract)

- Move on Aptos

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/smart-mirror-trading.git
    cd smart-mirror-trading
    ```

2.  **Install frontend dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add any necessary environment variables. For example, you will need an Aptos API key.

    ```env
    VITE_APTOS_API_KEY="YOUR_API_KEY_HERE"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    This will start the Vite development server, and you can view the application at `http://localhost:5173` (or another port if 5173 is busy).

## Move Smart Contract

The core logic for mirror trading is handled by a Move smart contract. The `package.json` includes scripts to manage it.

### Available Scripts

- **Compile the contract:**
  ```sh
  npm run move:compile
  ```
- **Run Move unit tests:**
  ```sh
  npm run move:test
  ```
- **Publish the contract to the Aptos network:**
  This requires a configured profile with the Aptos CLI.
  ```sh
  npm run move:publish
  ```
- **Upgrade an existing contract:**
  ```sh
  npm run move:upgrade
  ```

## Usage

1.  **Connect Your Wallet**: Open the application and connect your preferred Aptos wallet.
2.  **Navigate to Mirror Trading**: Go to the main Mirror Trading dashboard.
3.  **Enter Leader Address**: Input the Aptos wallet address of the trader you wish to follow.
4.  **Configure Rules**: Set your trading parameters, such as max trade size and stop-loss percentage.
5.  **Follow**: Click the "Follow Leader" button and approve the transaction in your wallet.
6.  **Monitor**: Your wallet will now automatically mirror the trades of the leader based on your rules. You can monitor recent trades and update your rules at any time.

## Deployment

This project is configured for easy deployment to Vercel.

To deploy, run the following command and follow the Vercel CLI prompts:

```sh
npm run deploy
```
