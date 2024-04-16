import { mplTokenMetadata,  createFungible, mintV1 } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { userKeypair } from "./helpers";

const umi = createUmi('https://api.devnet.solana.com');

const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);

umi.use(keypairIdentity(keypair))
    .use(mplTokenMetadata())


//Defining token metadata
const metadata = {
    name: "Just Solana",
    symbol: "JSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

const mint = generateSigner(umi);


async function createFungibleOneLiner() {
    createFungible(umi, {
        mint,
        authority: umi.identity,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 9,
    }).sendAndConfirm(umi)
}


createFungibleOneLiner()
    .then(() => console.log(`success \ntx: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`))
    .catch(err => console.error("error minting the tokens", err))