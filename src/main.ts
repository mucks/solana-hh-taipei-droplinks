import { DropLinks, DropLinksSearchOptions, DropLinkClaim } from "@droplinks/sdk"
import { SystemProgram } from "@solana/web3.js";
import * as web3 from '@solana/web3.js';
import { readFileSync } from "fs";

require('dotenv').config();

const DROPLINKS_API_KEY = process.env.DROPLINKS_API_KEY!;

DropLinks.init(DROPLINKS_API_KEY);

(async () => {
    const dropLink = await DropLinks.create({ campaign: "mucks", locked: false });

    console.log(dropLink);

    const secretKeyRaw = readFileSync('/home/mucks/.config/solana/id.json', "utf-8");
    const secretKeyBytes = new Uint8Array(JSON.parse(secretKeyRaw));
    console.log(secretKeyBytes.length);

    let payer = web3.Keypair.fromSecretKey(secretKeyBytes);
    console.log(payer.publicKey)
    let connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");

    let transaction = new web3.Transaction();
    transaction.add(
        web3.SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: new web3.PublicKey(dropLink.publicAddress),
            lamports: 0.01 * web3.LAMPORTS_PER_SOL,
        }),
    );

    await web3.sendAndConfirmTransaction(connection, transaction, [payer]);



})()

