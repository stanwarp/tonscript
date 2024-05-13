import TonWeb from 'tonweb';
import { keyPairFromSecretKey } from '@ton/crypto';

const privateKey = ''
const senderAddress = ''
const receiverAddress = ''


const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    'https://toncenter.com/api/v3/jsonrpc',
  ),
);
const keyPair = keyPairFromSecretKey(Buffer.from(privateKey, 'hex'));
const WalletClass = tonweb.wallet.all.v3R2;

const wallet = new WalletClass(tonweb.provider, {
  publicKey: keyPair.publicKey,
  address: senderAddress,
});

const address = await wallet.getAddress();

console.log(address.toString(true, true, false)); // print address in format to display in UI

const seqno = await wallet.methods.seqno().call();

let stateInit;
let code;
let data;

if (seqno === null) {
  const deploy = await wallet.createStateInit();

  stateInit = deploy.stateInit;
  code = deploy.code;
  data = deploy.data;
}

try {
  const transfer = wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: receiverAddress,
    amount: TonWeb.utils.toNano(amountTo),
    // when seqno is 0 lib returns null
    seqno: seqno || 0,
    expireAt: Math.floor(Date.now() / 1000) + 60, // now + 60 seconds);
    stateInit,
    });
  const sent = await transfer.send();
  
  console.log('sent, ', sent);
    } catch (err) {
      console.log('eerr, ', err);
    }
