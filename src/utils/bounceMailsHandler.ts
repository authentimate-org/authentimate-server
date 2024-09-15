// import Imap from 'imap';
// import { simpleParser, ParsedMail } from 'mailparser';
// import { PassThrough } from 'stream';
// import { CertificationModel } from '../models/certification.model';
// import dotenv from 'dotenv';

// dotenv.config();

// const imapConfig = {
//   user: process.env.AUTHENTIMATE_OFFICIAL_EMAIL || '',
//   password: process.env.EMAIL_PASSWORD || '',
//   host: 'imap.gmail.com',
//   port: 993,
//   tls: true,
//   tlsOptions: { rejectUnauthorized: false },
// };

// const imap = new Imap(imapConfig);

// const openInbox = (cb: (err: Error | null, box: Imap.Box) => void) => {
//   imap.openBox('INBOX', true, cb);
// };

// const getEmailAddresses = (addressObject: any) => {
//   if (Array.isArray(addressObject)) {
//     return addressObject.map((address) => address.address).join(', ');
//   } else {
//     return addressObject?.address;
//   }
// };

// const checkBounceEmails = () => {
//   imap.once('ready', () => {
//     openInbox((err, box) => {
//       if (err) throw err;

//       imap.search(['UNSEEN', ['SUBJECT', 'Delivery Status Notification (Failure)']], (err, results) => {
//         if (err) throw err;

//         console.log('Search results:', results);

//         if (results.length === 0) {
//           console.log('No bounce-back emails found');
//           imap.end();
//           return;
//         }

//         const f = imap.fetch(results, { bodies: '' });

//         f.on('message', (msg, seqno) => {
//           console.log('Processing message', seqno);
//           msg.on('body', (stream, info) => {
//             const passThrough = new PassThrough();
//             stream.pipe(passThrough);

//             simpleParser(passThrough)
//               .then((parsed: ParsedMail) => {
//                 console.log('Bounce-back email parsed:', parsed);

//                 const subject = parsed.subject;
//                 const text = parsed.text;
//                 // const html = parsed.html;
//                 // const from = getEmailAddresses(parsed.from);
//                 const to = getEmailAddresses(parsed.to);
//                 // const date = parsed.date;

//                 // console.log('Subject:', subject);
//                 // console.log('Text:', text);
//                 // console.log('HTML:', html);
//                 // console.log('From:', from);
//                 // console.log('To:', to);
//                 // console.log('Date:', date);

//                 if (subject && subject.includes('Delivery Status Notification (Failure)')) {
//                   CertificationModel.findOneAndUpdate({ certificationId: text }, { status: 'MAIL_NOT_DELIVERED' }, { new: true }).exec();
//                   console.log(`Bounce-back detected for: ${to}`);
//                 }
//               })
//               .catch(err => {
//                 console.error('Error parsing email:', err);
//               });
//           });
//         });

//         f.once('error', (err) => {
//           console.log('Fetch error:', err);
//         });

//         f.once('end', () => {
//           console.log('Done fetching all messages!');
//           imap.end();
//         });
//       });
//     });
//   });

//   imap.once('error', (err: any) => {
//     console.log('IMAP error:', err);
//   });

//   imap.once('end', () => {
//     console.log('Connection ended');
//   });

//   imap.connect();
// };

// export default checkBounceEmails;
